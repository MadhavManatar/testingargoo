// ** Import Packages **
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ** Components **
import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/Button';
import DaysFilterDropdown from 'components/DaysFilterDropdown';
import DeleteButton from 'components/DeleteComponents/DeleteButton';
import Dropdown from 'components/Dropdown';
import FormField from 'components/FormField';
import Icon from 'components/Icon';
import TableInfiniteScroll, {
  agGridSelectedProps,
  AgGridTableRef,
  PaginationParams,
} from 'components/TableInfiniteScroll';
import CardInfiniteScroll from 'components/TableInfiniteScroll/CardInfiniteScroll';
import AuthGuard from 'pages/auth/components/AuthGuard';
import EditProfileModal from 'pages/Setting/user-setting/ProfilePermissions/components/EditProfileModal';
import DeleteProfilePermissionModal from './components/DeleteProfilePermissionModal';

// ** Hooks **
import useSelectAll from 'hooks/selectAll';
import useAuth from 'hooks/useAuth';
import useInfiniteScrollInfo from 'hooks/useInfiniteScrollInfo';
import useWindowDimensions from 'hooks/useWindowDimensions';
import useProfileColumns from './hooks/useProfileColumns';

// ** Types **
import { SelectedDayRangeType } from 'components/DaysFilterDropdown/types/index.types';
import {
  PermissionResponseType,
  ProfileData,
  ProfilesRowObj,
} from 'pages/Setting/user-setting/ProfilePermissions/types/profile-permissions.types';

// ** Constants **
import { BREAD_CRUMB, DATE_RANGE_DROPDOWN, DATE_SLUG, TAB } from 'constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import {
  BasicPermissionTypes,
  ModuleNames,
} from 'constant/permissions.constant';

// ** Other **
import { debounce } from 'utils/util';
import {
  LISTING_DATA_LIMIT,
  POLLING_INTERVAL,
} from 'constant/dataLimit.constant';
import {
  useDeleteProfileMutation,
  useLazyGetProfilesQuery,
  useUpdateProfileMutation,
} from 'redux/api/profileApi';

const ProfileList = () => {
  // ** Hooks **
  const navigate = useNavigate();
  const currentDays = useRef<string>();

  // ** Ref **
  const tableRef = useRef<AgGridTableRef>(null);

  // ** States **
  const [currentPage, setCurrentPage] = useState(1);
  const [days, setDays] = useState<string>();
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isFilterable, setIsFilterable] = useState(false);
  const [dataInfo, setDataInfo] = useState<agGridSelectedProps>([]);
  const [currentEdit, setCurrentEdit] = useState<ProfilesRowObj | null>(null);
  const [selectedDayRangeObj, setSelectedDayRangeObj] =
    useState<SelectedDayRangeType>({ contacts: DATE_SLUG.THIRTY_DAYS });
  const [deletedProfileDetails, setDeletedProfileDetails] =
    useState<PermissionResponseType>();

  const [searchData, setSearchData] = useState<{
    searchText: string;
    searchFields: string;
  }>({ searchText: '', searchFields: '' });

  // ** Custom Hooks **
  const { hasAuthorized } = useAuth();
  const { isMobileView } = useWindowDimensions();

  // ** APIS **
  const [getProfilesAPI, { isLoading }] = useLazyGetProfilesQuery({
    pollingInterval: currentPage === 1 ? POLLING_INTERVAL : 0,
  });
  const [updateProfileByIdAPI, { isLoading: isUpdateProfileLoading }] =
    useUpdateProfileMutation();
  const [deleteProfileByIdAPI, { isLoading: isDeleteProfileLoading }] =
    useDeleteProfileMutation();
  const { loading, perPage, items, setPerPage, setItems } =
    useInfiniteScrollInfo({
      getData: getProfilePermissionData,
      searchData,
    });

  const { selectionList, setSelectionList, selectionRef, setIsCheckAll } =
    useSelectAll({ data: dataInfo });

  const selectedIds = Object.values(selectionList || {})
    .filter((obj1: any) => obj1?.id && !obj1?.is_system)
    .map((obj2: any) => +obj2.id);
  // **
  const { columnDefs, defaultColDef } = useProfileColumns({
    setIsEdit,
    setCurrentEdit,
    selectionRef,
    setSelectionList,
    openDeleteProfileModal,
    isSelectionDisabled: !dataInfo.length,
  });

  const readPermission = hasAuthorized([
    {
      module: ModuleNames.PROFILE_AND_PERMISSION,
      type: BasicPermissionTypes.READ,
    },
  ]);

  useEffect(() => {
    currentDays.current = days;
    refreshTable();
  }, [days]);

  const refreshTable = () => {
    tableRef.current?.refreshData();
  };

  const updateProfileData = async (data: ProfileData) => {
    if (!currentEdit) return;
    const { id } = currentEdit;
    const { name, description } = data;

    const dataUpdate = await updateProfileByIdAPI({
      id,
      data: {
        name,
        description,
      },
    });
    if (!('error' in dataUpdate)) {
      setIsEdit(false);
      setCurrentEdit(null);
      tableRef.current?.refreshData();
    }
  };

  const getDeletedProfileDetails = async (ids?: number[]) => {
    const data = await getProfilesAPI(
      {
        data: {
          query: {
            limit: 20,
            'q[id][in]': `${ids || selectedIds}`,
          },
        },
      },
      true
    );
    if ('data' in data) {
      setDeletedProfileDetails(data.data.rows?.[0] || {});
    }
  };

  async function getProfilePermissionData(
    params: PaginationParams = { page: 1, limit: LISTING_DATA_LIMIT }
  ) {
    const data = await getProfilesAPI(
      {
        data: {
          query: {
            ...(currentDays.current
              ? { 'q[created_at][gte]': currentDays.current }
              : {}),
            ...params,
          },
        },
      },
      true
    );

    let tableData = { rowData: [], rowCount: 0 };

    if (!('error' in data)) {
      const { rows, count } = data.data;
      tableData = { rowData: rows, rowCount: count };
      if (params.page === 1) {
        setDataInfo([...tableData.rowData]);
      } else {
        setDataInfo((prev) => [...prev, ...tableData.rowData]);
      }
      setIsFilterable(data.data.count > 0);
    }

    return tableData;
  }

  const closeDeleteProfileModal = () => {
    setDeleteModal(false);
    selectionRef.current = {};
    setSelectionList({});
  };

  async function openDeleteProfileModal() {
    await getDeletedProfileDetails();
    setDeleteModal(true);
  }

  const onDeleteProfile = async (value?: any) => {
    const data = await deleteProfileByIdAPI({
      data: { id: value?.id, transfer_id: value?.transfer_id },
    });
    if (!('error' in data)) {
      setItems([]);
      setPerPage({ ...perPage, page: 1 });
      tableRef.current?.refreshData();
      closeDeleteProfileModal();
      setIsCheckAll(false);
    }
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    tableRef.current?.onChange?.(e);
    if (isMobileView) {
      setSearchData({
        ...searchData,
        searchText: e.target?.value.trim(),
        searchFields: 'name',
      });
    }
  };

  const List = useCallback((content: { close: () => void }) => {
    const { close } = content;
    return (
      <div className="items" onClick={close}>
        <div className="filter__wrapper">
          <div className="filter__box border-b border-b-[#000000]/10 pb-[12px] mb-[14px] last:border-b-0 last:pb-0 last:mb-0">
            <h3 className='filter__heading text-[16px] text-black font-biotif__Medium relative mb-[10px] before:content-[""] before:absolute before:top-[3px] before:right-0 before:w-[8px] before:h-[8px] before:-rotate-45 before:border-l-[2px] before:border-l-black before:border-b-[2px] before:border-b-black'>
              Filter
            </h3>
            <FormField
              wrapperClass="mb-0"
              key={window.crypto.randomUUID()}
              type="radio"
              name="all"
              value=""
              label="All Time"
            />
            {DATE_RANGE_DROPDOWN.map((item) => {
              return (
                <FormField
                  wrapperClass="mb-0"
                  key={window.crypto.randomUUID()}
                  type="radio"
                  name={item.slug}
                  value={item.value}
                  label={item.label}
                />
              );
            })}
          </div>
          <div className="filter__box border-b border-b-[#000000]/10 pb-[12px] mb-[14px] last:border-b-0 last:pb-0 last:mb-0">
            <h3 className='filter__heading text-[16px] text-black font-biotif__Medium relative mb-[10px] before:content-[""] before:absolute before:top-[3px] before:right-0 before:w-[8px] before:h-[8px] before:-rotate-45 before:border-l-[2px] before:border-l-black before:border-b-[2px] before:border-b-black'>
              View
            </h3>
            <FormField
              wrapperClass="mb-0"
              type="radio"
              name=""
              options={[{ label: 'Card View', value: 'Card View' }]}
            />
            <FormField
              wrapperClass="mb-0"
              type="radio"
              name=""
              options={[{ label: 'List View', value: 'List View' }]}
            />
          </div>
        </div>
        <div className="flex justify-end mt-[15px]">
          <button
            className="bg-[#D9D9D9] text-[#2E3234] text-[12px] font-biotif__SemiBold py-[4px] px-[12px] rounded-[6px] duration-500 hover:bg-[#bfbfbf] hover:text-[#2E3234]"
            type="button"
          >
            Cancel
          </button>
          <button
            type="button"
            className="bg-primaryColor text-[#ffffff] text-[12px] font-biotif__SemiBold py-[4px] px-[12px] rounded-[6px] duration-500 ml-[10px] hover:bg-primaryColor__hoverDark"
          >
            Apply
          </button>
        </div>
      </div>
    );
  }, []);

  return (
    <>
      <Breadcrumbs path={BREAD_CRUMB.profileAndPermissionsSetting} />
      <div className="page__ActionHeader page__ActionHeader__profilePermission mb-0 lg:mt-[-10px] sm:mb-[15px] md:mt-0">
        <div className="inner__wrapper flex flex-wrap w-full justify-between">
          <div className="header__searchBox w-[255px] lg:w-full lg:flex lg:items-center">
            <div className="form__Group mb-[10px] lg:mb-0 lg:w-[calc(100%_-_145px)] lg:pr-[10px] sm:w-[calc(100%_-_141px)]">
              <div className="ip__form__hasIcon">
                <input
                  type="text"
                  onChange={debounce(onSearchChange)}
                  className="ip__input"
                  placeholder="Search here..."
                  maxLength={50}
                />
                <Icon
                  className="i__Icon grayscale"
                  iconType="searchStrokeIcon"
                />
              </div>
            </div>
            <Dropdown
              className="tippy__days__filter__mobile"
              placement="bottom"
              content={List}
            >
              <button className="hidden lg:block" type="button">
                <Icon
                  className="filter__btn cursor-pointer p-[10px] bg-[#E6E6E6] w-[36px] h-[36px] rounded-[6px] duration-500 hover:bg-[#c8c8c8] block sm:w-[32px] sm:h-[32px] sm:p-[9px]"
                  iconType="filterFilled"
                />
              </button>
            </Dropdown>
            <button
              className="text-[14px] font-biotif__SemiBold h-[36px] rounded-[6px] py-[4px] px-[12px] ml-[10px] bg-primaryColor text-white duration-500 hover:bg-primaryColor__hoverDark hidden lg:inline-block sm:h-[32px]"
              onClick={() =>
                navigate(
                  PRIVATE_NAVIGATION.settings.profileAndPermissions.create
                )
              }
            >
              Add Profile
            </button>
          </div>
          <div className="right inline-block lg:w-full lg:hidden">
            <div className="inline-flex items-center lg:flex lg:justify-between lg:w-full">
              <div className="deleteDrop__wrapper inline-flex items-center sm:w-1/2">
                <AuthGuard
                  permissions={[
                    {
                      module: ModuleNames.PROFILE_AND_PERMISSION,
                      type: BasicPermissionTypes.DELETE,
                    },
                  ]}
                >
                  {selectedIds.length ? (
                    <DeleteButton
                      openDeleteModal={() => openDeleteProfileModal()}
                      isLoading={
                        isDeleteProfileLoading ||
                        (!!selectedIds?.length && isLoading)
                      }
                      moduleName={
                        selectedIds.length > 1 ? 'Profiles' : 'Profile'
                      }
                    />
                  ) : (
                    <></>
                  )}
                </AuthGuard>
                <DaysFilterDropdown
                  selectedDayRangeObj={selectedDayRangeObj}
                  setDays={setDays}
                  isDisabled={!isFilterable}
                  modal={TAB.CONTACTS}
                  setSelectedDayRangeObj={setSelectedDayRangeObj}
                />
              </div>
              <div className="inline-block w-0" />
              <AuthGuard
                permissions={[
                  {
                    module: ModuleNames.PROFILE_AND_PERMISSION,
                    type: BasicPermissionTypes.CREATE,
                  },
                ]}
              >
                <Button
                  className="primary__Btn smaller__with__icon h-[44px] px-[20px] ml-[10px] mb-[10px] sm:text-[12px] sm:px-[10px] sm:h-[38px] sm:ml-[5px] sm:w-[calc(50%_-_5px)]"
                  onClick={() =>
                    navigate(
                      PRIVATE_NAVIGATION.settings.profileAndPermissions.create
                    )
                  }
                  isDisabled={isLoading}
                >
                  Add Profile
                </Button>
              </AuthGuard>
            </div>
          </div>
        </div>
      </div>

      <AuthGuard
        permissions={[
          {
            module: ModuleNames.PROFILE_AND_PERMISSION,
            type: BasicPermissionTypes.READ,
          },
        ]}
      >
        {isMobileView ? (
          <div className="ag__grid__mobile__profilePermission">
            <CardInfiniteScroll
              perPage={perPage}
              items={items}
              isLoading={loading}
              columnData={columnDefs}
              setPerPage={setPerPage}
            />
          </div>
        ) : (
          <div className="profilePermission__page__ag__table">
            <TableInfiniteScroll
              setCurrentPage={setCurrentPage}
              {...(readPermission && {
                onRowClickNavigateLink: `${PRIVATE_NAVIGATION.settings.profileAndPermissions.edit}/`,
              })}
              ref={tableRef}
              rowDataLimit={LISTING_DATA_LIMIT}
              getData={(params) => getProfilePermissionData(params)}
              columnData={columnDefs}
              searchColumns={['name']}
              defaultColParams={defaultColDef}
              isLoading={isLoading}
              allowMultipleSelect={false}
            />
          </div>
        )}
      </AuthGuard>

      {isEdit && currentEdit && (
        <AuthGuard
          permissions={[
            {
              module: ModuleNames.PROFILE_AND_PERMISSION,
              type: BasicPermissionTypes.UPDATE,
            },
          ]}
        >
          <EditProfileModal
            loading={isUpdateProfileLoading}
            isOpen={isEdit}
            closeModal={() => setIsEdit(false)}
            profileData={{
              name: currentEdit.name || '',
              description: currentEdit.description || '',
            }}
            setProfileData={updateProfileData}
          />
        </AuthGuard>
      )}
      {deleteModal && deletedProfileDetails && (
        <AuthGuard
          permissions={[
            {
              module: ModuleNames.PROFILE_AND_PERMISSION,
              type: BasicPermissionTypes.DELETE,
            },
          ]}
        >
          <DeleteProfilePermissionModal
            isOpen={deleteModal}
            deleteProfile={onDeleteProfile}
            profileDetails={deletedProfileDetails}
            isLoading={isDeleteProfileLoading}
            closeModal={() => closeDeleteProfileModal()}
          />
        </AuthGuard>
      )}
    </>
  );
};

export default ProfileList;
