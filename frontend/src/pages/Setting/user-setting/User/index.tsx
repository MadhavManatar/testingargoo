// ** Import Packages **
import { Children, useCallback, useEffect, useRef, useState } from 'react';

// ** Components **
import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/Button';
import DaysFilterDropdown from 'components/DaysFilterDropdown';
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
import DeleteUserModal from 'pages/Setting/user-setting/User/components/DeleteUserModal';
import AddUserModal from './components/AddUserModal';

// ** Hooks **
import useSelectAll from 'hooks/selectAll';
import usePermission from 'hooks/usePermission';
import useInfiniteScrollInfo from 'hooks/useInfiniteScrollInfo';
import useWindowDimensions from 'hooks/useWindowDimensions';
import useUserColumns from 'pages/Setting/user-setting/User/hooks/useUserColumns';

// ** Types **
import { SelectedDayRangeType } from 'components/DaysFilterDropdown/types/index.types';
import { AddUserFormFields, TransferUserFormFields } from './types/user.types';

// ** Constant **
import { BREAD_CRUMB, DATE_RANGE_DROPDOWN, DATE_SLUG, TAB } from 'constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

// ** Other **
import { debounce } from 'utils/util';
import generateUserFormData from './helper/user.helper';
import { isOrganizationOwner } from 'utils/is';
import { useReportUserUpdate } from './hooks/useUserService';
import {
  LISTING_DATA_LIMIT,
  POLLING_INTERVAL,
} from 'constant/dataLimit.constant';
import {
  useAddUserMutation,
  useDeleteUserMutation,
  useLazyGetUsersQuery,
} from 'redux/api/userApi';

const User = () => {
  // ** Hooks **
  const currentDays = useRef<string>();
  const tableRef = useRef<AgGridTableRef>(null);

  // ** States **
  const [currentPage, setCurrentPage] = useState(1);
  const [days, setDays] = useState<string>();
  const [defaultId, setDefaultId] = useState<number>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isFilterable, setIsFilterable] = useState(false);
  const [dataInfo, setDataInfo] = useState<agGridSelectedProps>([]);
  const [deletedUserDetails, setDeletedUserDetails] = useState<
    { [key: string]: any }[]
  >([]);
  const [selectedDayRangeObj, setSelectedDayRangeObj] =
    useState<SelectedDayRangeType>({ contacts: DATE_SLUG.THIRTY_DAYS });
  const [searchData, setSearchData] = useState<{
    searchText: string;
    searchFields: string;
  }>({ searchText: '', searchFields: '' });

  // ** Custom Hooks **
  const { isMobileView } = useWindowDimensions();
  const { readUserPermission, createUserPermission, deleteUserPermission } =
    usePermission();
  const { loading, perPage, items, setPerPage, setItems } =
    useInfiniteScrollInfo({
      getData: getUserData,
      searchData,
    });
  const { addReportUser, removeReportUser } = useReportUserUpdate();
  const { selectedIds, setSelectionList, selectionRef, setIsCheckAll } =
    useSelectAll({ data: dataInfo });

  // ** APIS **
  const [getUsersAPI, { isLoading: getUsersLoading }] = useLazyGetUsersQuery({
    pollingInterval: currentPage === 1 ? POLLING_INTERVAL : 0,
  });
  const [addUserAPI, { isLoading }] = useAddUserMutation();
  const [deleteUsersAPI, { isLoading: deleteUsersLoading }] =
    useDeleteUserMutation();

  const { columnDefs, defaultColDef } = useUserColumns({
    selectionRef,
    disabled: getUsersLoading,
    setDefaultId,
    setSelectionList,
    openDeleteUserModal,
    isSelectionDisabled: !dataInfo.length,
  });

  useEffect(() => {
    currentDays.current = days;
    refreshTable();
  }, [days]);

  async function getUserData(
    params: PaginationParams = { page: 1, limit: LISTING_DATA_LIMIT }
  ) {
    const data = await getUsersAPI(
      {
        data: {
          query: {
            ...(currentDays.current
              ? {
                  'q[created_at][gte]': currentDays.current,
                }
              : {}),
            sort: '-id',
            ...params,
          },
        },
      },
      true
    );
    let tableData = { rowData: [], rowCount: 0 };

    if ('data' in data) {
      const filteredList = data.data.rows.filter(
        (obj: { id: number }) => !isOrganizationOwner(obj.id)
      );
      tableData = { rowData: data.data.rows, rowCount: data.data.count };
      if (params.page === 1) {
        setDataInfo([...filteredList]);
      } else {
        setDataInfo((prev) => [...prev, ...filteredList]);
      }
      setIsFilterable(data.data.count > 0);
    }

    return tableData;
  }

  const getDeletedUserDetails = async (ids?: number[]) => {
    const data = await getUsersAPI(
      {
        data: {
          query: {
            limit: 20,
            select: 'id,first_name,last_name',
            'include[reporting_users]': 'id',
            'include[owned_accounts]': 'id',
            'include[owned_contacts]': 'id',
            'include[owned_leads]': 'id',
            'q[id][in]': `${ids || selectedIds}`,
          },
        },
      },
      true
    );
    if ('data' in data) {
      setDeletedUserDetails(data.data.rows || []);
    }
  };

  const addUser = async (formValue: AddUserFormFields) => {
    const UserFormData = generateUserFormData(formValue);
    const data = await addUserAPI({ data: UserFormData });
    if ('data' in data) {
      refreshTable();
      setIsOpen(false);
      addReportUser(data.data);
    }
  };

  const onDeleteTransferAll = async (value: TransferUserFormFields) => {
    const withoutDefaultData = value.user.filter(
      (filterData) => filterData.id !== defaultId
    );
    const data = await deleteUsersAPI({
      data: { allIdWithTransferId: withoutDefaultData },
    });
    if ('data' in data) {
      setIsCheckAll(false);
      setItems([]);
      setPerPage({ ...perPage, page: 1 });
      setDataInfo([]);
      refreshTable();
      closeDeleteUserModal();
      removeReportUser(withoutDefaultData.map((item) => item.id));
    }
  };

  const refreshTable = () => {
    tableRef.current?.refreshData();
    if (isMobileView) {
      setPerPage({
        ...perPage,
        page: 1,
      });
      setItems([]);
    }
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    tableRef.current?.onChange?.(e);
    if (isMobileView) {
      setSearchData({
        ...searchData,
        searchText: e.target?.value.trim(),
        searchFields: 'first_name,last_name',
      });
    }
  };

  function openDeleteUserModal(ids?: number[]) {
    getDeletedUserDetails(ids);
    setDeleteModal(true);
  }
  const closeAddUserModal = () => setIsOpen(false);

  const closeDeleteUserModal = () => {
    selectionRef.current = {};
    setSelectionList({});
    setDeleteModal(false);
  };

  const List = useCallback((content: { close: () => void }) => {
    const { close } = content;
    return (
      <div className="items" onClick={close}>
        {Children.toArray(
          [0].map(() => (
            <>
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
            </>
          ))
        )}
      </div>
    );
  }, []);

  return (
    <>
      <Breadcrumbs path={BREAD_CRUMB.user} />
      <div className="page__ActionHeader page__ActionHeader__user mb-0 lg:mt-[-10px] sm:mb-[15px] md:mt-0">
        <div className="inner__wrapper flex flex-wrap w-full justify-between">
          <div className="header__searchBox w-[255px] lg:w-full lg:flex lg:items-center">
            <div className="form__Group mb-[10px] lg:mb-0 lg:w-[calc(100%_-_134px)] lg:pr-[10px] sm:w-[calc(100%_-_131px)]">
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
            <button className="text-[14px] font-biotif__SemiBold h-[36px] rounded-[6px] py-[4px] px-[12px] ml-[10px] bg-primaryColor text-white duration-500 hover:bg-primaryColor__hoverDark hidden lg:inline-block sm:h-[32px]">
              New User
            </button>
          </div>
          <div className="right inline-block lg:w-full lg:hidden">
            <div className="inline-flex items-center lg:flex lg:justify-between lg:w-full">
              <div className="deleteDrop__wrapper inline-flex items-center sm:w-1/2">
                <AuthGuard isAccessible={deleteUserPermission}>
                  {selectedIds.length ? (
                    <Button
                      className="i__Button delete__Btn h-[44px] text-[14px] font-biotif__Medium py-[5px] px-[18px] rounded-[6px] mb-[10px] lg:mr-[10px] sm:h-[38px] sm:text-[12px] sm:px-[10px] sm:mr-[5px] sm:w-full"
                      onClick={() => openDeleteUserModal()}
                      isLoading={deleteUsersLoading}
                    >
                      Delete User
                    </Button>
                  ) : (
                    <></>
                  )}
                </AuthGuard>
                <DaysFilterDropdown
                  isDisabled={!isFilterable}
                  selectedDayRangeObj={selectedDayRangeObj}
                  setDays={setDays}
                  modal={TAB.CONTACTS}
                  setSelectedDayRangeObj={setSelectedDayRangeObj}
                />
              </div>
              <div className="inline-block w-0" />
              <AuthGuard isAccessible={createUserPermission}>
                <Button
                  className="primary__Btn smaller__with__icon h-[44px] px-[20px] ml-[10px] mb-[10px] sm:text-[12px] sm:px-[10px] sm:h-[38px] sm:ml-[5px] sm:w-[calc(50%_-_5px)]"
                  onClick={() => setIsOpen((prev) => !prev)}
                  isDisabled={getUsersLoading}
                >
                  Add User
                </Button>
              </AuthGuard>
            </div>
          </div>
        </div>
      </div>

      {/* listing users */}
      <AuthGuard isAccessible={readUserPermission}>
        {isMobileView ? (
          <div className="ag__grid__mobile__user">
            <CardInfiniteScroll
              perPage={perPage}
              items={items}
              isLoading={loading}
              columnData={columnDefs}
              setPerPage={setPerPage}
            />
          </div>
        ) : (
          <div className="user__page__ag__table">
            <TableInfiniteScroll
              setCurrentPage={setCurrentPage}
              {...(readUserPermission && {
                onRowClickNavigateLink: `${PRIVATE_NAVIGATION.settings.user.view}/`,
              })}
              ref={tableRef}
              rowDataLimit={LISTING_DATA_LIMIT}
              getData={(params) => getUserData(params)}
              columnData={columnDefs}
              searchColumns={['first_name', 'last_name']}
              defaultColParams={defaultColDef}
              isLoading={getUsersLoading}
              allowMultipleSelect={false}
            />
          </div>
        )}
      </AuthGuard>

      {isOpen && (
        <AddUserModal
          isOpen={isOpen}
          addUser={addUser}
          setUserInfo={setDataInfo}
          closeModal={closeAddUserModal}
          isLoading={isLoading}
        />
      )}

      <DeleteUserModal
        isOpen={deleteModal}
        deleteUser={onDeleteTransferAll}
        isLoading={deleteUsersLoading}
        closeModal={() => closeDeleteUserModal()}
        userDetails={deletedUserDetails}
      />
    </>
  );
};

export default User;
