// ** import packages **
import { useRef, useState } from 'react';

// ** Components **
import Button from 'components/Button';
import DeleteButton from 'components/DeleteComponents/DeleteButton';
import Icon from 'components/Icon';
import TableInfiniteScroll, {
  agGridSelectedProps,
  AgGridTableRef,
  PaginationParams,
} from 'components/TableInfiniteScroll';
import CardInfiniteScroll from 'components/TableInfiniteScroll/CardInfiniteScroll';
import AuthGuard from 'pages/auth/components/AuthGuard';
import SettingLayout from 'pages/Setting/components/SettingLayout';

// ** Modal **
import DeleteModal from 'components/DeleteComponents/DeleteModal';
import useSelectAll from 'hooks/selectAll';
import useWindowDimensions from 'hooks/useWindowDimensions';
import AddActivityTypeModal from './components/AddActivityTypeModal';

// ** hooks **
import useInfiniteScrollInfo from 'hooks/useInfiniteScrollInfo';
import useActivityTypeColumns from './hooks/useActivityTypeColumns';

// ** constant **
import { BREAD_CRUMB } from 'constant';
import {
  BasicPermissionTypes,
  ModuleNames,
} from 'constant/permissions.constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';

// ** Other **
import { debounce } from 'utils/util';
import {
  useDeleteActivityTypeMutation,
  useLazyGetActivityTypesQuery,
  useUpdateActivityTypeMutation,
} from 'redux/api/activityTypeApi';
import {
  LISTING_DATA_LIMIT,
  POLLING_INTERVAL,
} from 'constant/dataLimit.constant';
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'redux/slices/authSlice';

const ActivityType = () => {
  // ** Ref **
  const tableRef = useRef<AgGridTableRef>(null);
  const currentUser = useSelector(getCurrentUser);
  // ** States **
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setModal] = useState<{
    add: boolean;
    edit: boolean;
    id?: number | null;
  }>({ add: false, edit: false });
  const [deleteModal, setDeleteModal] = useState(false);
  const [dataInfo, setDataInfo] = useState<agGridSelectedProps>([]);
  const [searchData, setSearchData] = useState<{
    searchText: string;
    searchFields: string;
  }>({ searchText: '', searchFields: '' });
  const [checked, setChecked] = useState<number>();

  // ** APIS **
  const [getActivityTypes, { isLoading: getActivityTypesLoading }] =
    useLazyGetActivityTypesQuery({
      pollingInterval: currentPage === 1 ? POLLING_INTERVAL : 0,
    });
  const [updateActivityTypeByIdAPI, { isLoading: updateActivityTypesLoading }] =
    useUpdateActivityTypeMutation();
  const [deleteActivityTypeAPI, { isLoading: deleteActivityTypeLoading }] =
    useDeleteActivityTypeMutation();

  // ** Custom hooks **
  const { isMobileView } = useWindowDimensions();
  const { loading, perPage, items, setPerPage, setItems } =
    useInfiniteScrollInfo({
      getData: getActivityTypeData,
      searchData,
    });

  // this data is filter remove those data which system created
  const filterData = dataInfo.filter((obj) => !obj.is_system);

  const {
    disabled,
    isCheckAll,
    isCheckAllRef,
    selectionList,
    setSelectionList,
    selectionRef,
    setIsCheckAll,
  } = useSelectAll({ data: filterData });

  const selectedIds = Object.values(selectionList || {})
    .filter((obj1: any) => obj1?.id && !obj1?.is_system && !obj1?.is_default)
    .map((obj2: any) => +obj2.id);

  const refreshTable = () => {
    tableRef.current?.refreshData();
    if (isMobileView) {
      setPerPage({ ...perPage, page: 1 });
      setItems([]);
    }
  };

  const changeDefaultType = async (id: number, type: boolean) => {
    const ActivityTypeFormData = new FormData();
    ActivityTypeFormData.set('is_default', JSON.stringify(type) || '');

    const data = await updateActivityTypeByIdAPI({
      id,
      data: ActivityTypeFormData,
    });

    if ('data' in data && data.data) {
      setChecked(id);
      refreshTable();
    }
  };

  // **
  const { columnDefs, defaultColDef } = useActivityTypeColumns({
    setModal,
    selectionRef,
    isCheckAllRef,
    setIsCheckAll,
    disabled,
    isCheckAll,
    getActivityTypesLoading,
    setSelectionList,
    checked,
    changeDefaultType,
    openDeleteActivityTypeModal,
    isSelectionDisabled: !dataInfo.length,
    refreshTable,
  });

  async function getActivityTypeData(
    params: PaginationParams = { page: 1, limit: LISTING_DATA_LIMIT }
  ) {
    const { data, error } = await getActivityTypes({
      data: {
        query: {
          ...params,
          'include[creator][select]': 'username,first_name,last_name',
          'include[parent_type][select]': 'id,name',
          'include[activity_type_email_setting][q][user_id]': `${currentUser?.id}`,
          'include[activity_type_email_setting]': 'all',
        },
      },
    });

    let tableData = { rowData: [], rowCount: 0 };

    if (data && !error) {
      const is_default_type = (data.rows || []).find(
        (item: { is_default: boolean }) => item.is_default
      );

      setChecked(is_default_type?.id);

      tableData = { rowData: data.rows, rowCount: data.count };
      if (params.page === 1) {
        setDataInfo([...tableData.rowData]);
      } else {
        setDataInfo((prev) => [...prev, ...tableData.rowData]);
      }
    }

    return tableData;
  }

  const closeModal = () => setModal({ edit: false, add: false });

  const closeDeleteModal = () => {
    setDeleteModal(false);
    selectionRef.current = {};
    setSelectionList({});
  };

  function openDeleteActivityTypeModal() {
    setDeleteModal(true);
  }

  const onDeleteActivityType = async () => {
    const data = await deleteActivityTypeAPI({
      data: { allId: selectedIds },
    });
    if (!('error' in data)) {
      setItems([]);
      setPerPage({ ...perPage, page: 1 });
      refreshTable();
      closeDeleteModal();
      setIsCheckAll(false);
      selectionRef.current = {};
      setSelectionList({});
    }
  };

  const openAddModal = () => setModal({ edit: false, add: true });

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

  return (
    <SettingLayout
      title="Activity Settings"
      breadCrumbPath={BREAD_CRUMB.settings.moduleSetting.activity.type}
      sideBarLinks={SETTING_SIDEBAR.activitySetting}
    >
      <div className="page__ActionHeader setting__activityType justify-between mb-0">
        <div className="inner__wrapper flex flex-wrap w-full justify-between">
          <div className="header__searchBox w-[255px] lg:w-[calc(100%_-_342px)] sm:w-full sm:flex">
            <div className="form__Group mb-[10px] sm:w-full sm:mr-0">
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
          </div>
          <div className="flex action__buttons sm:w-full sm:items-start sm:justify-between">
            <h3 className="hidden text-[18px] leading-[24px] font-biotif__Medium text-black mb-[10px] max-w-[50%] whitespace-pre overflow-hidden text-ellipsis sm:inline-block sm:pr-[10px] sm:mt-[9px]">
              Activity Type
            </h3>
            {!isMobileView && selectedIds.length ? (
              <AuthGuard
                permissions={[
                  {
                    module: ModuleNames.ACTIVITY,
                    type: BasicPermissionTypes.DELETE,
                  },
                ]}
              >
                <DeleteButton
                  openDeleteModal={() => openDeleteActivityTypeModal()}
                  isLoading={deleteActivityTypeLoading}
                  moduleName={
                    selectedIds.length > 1 ? 'Activity Types' : 'Activity Type'
                  }
                />
              </AuthGuard>
            ) : null}

            <AuthGuard
              permissions={[
                {
                  module: ModuleNames.ACTIVITY,
                  type: BasicPermissionTypes.CREATE,
                },
              ]}
            >
              <Button
                className="primary__Btn smaller__with__icon h-[44px] px-[22px] ml-[10px] 3xl:h-[36px] lg:ml-0 sm:w-[calc(50%_-_5px)] sm:ml-[5px] sm:mb-[10px] sm:text-[12px]"
                onClick={() => openAddModal()}
                isDisabled={
                  getActivityTypesLoading || updateActivityTypesLoading
                }
              >
                Add Activity Type
              </Button>
            </AuthGuard>
          </div>
        </div>
      </div>
      {isMobileView ? (
        <>
          <div className="settingDetails__M__wrapper activityType border border-[#CCCCCC]/50 rounded-[12px] p-[12px]">
            <div className="settingM__searchBox w-full">
              <div className="form__Group mb-0">
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
            </div>
            <CardInfiniteScroll
              perPage={perPage}
              items={items}
              isLoading={loading}
              columnData={columnDefs}
              setPerPage={setPerPage}
            />
          </div>
        </>
      ) : (
        <TableInfiniteScroll
          setCurrentPage={setCurrentPage}
          ref={tableRef}
          rowDataLimit={LISTING_DATA_LIMIT}
          getData={(params) => getActivityTypeData(params)}
          columnData={columnDefs}
          searchColumns={['name']}
          defaultColParams={defaultColDef}
          isLoading={getActivityTypesLoading || updateActivityTypesLoading}
          allowMultipleSelect
          type="activity"
        />
      )}

      {openModal.edit || openModal.add ? (
        <AddActivityTypeModal
          isOpen={openModal.edit || openModal.add}
          closeModal={closeModal}
          onAdd={refreshTable}
          setActivityTypeInfo={setDataInfo}
          id={openModal.id}
        />
      ) : (
        <></>
      )}
      <DeleteModal
        closeModal={closeDeleteModal}
        isOpen={deleteModal}
        isLoading={deleteActivityTypeLoading}
        deleteOnSubmit={onDeleteActivityType}
        moduleName={
          selectedIds.length > 1 ? 'these activity types' : 'this activity type'
        }
      />
    </SettingLayout>
  );
};

export default ActivityType;
