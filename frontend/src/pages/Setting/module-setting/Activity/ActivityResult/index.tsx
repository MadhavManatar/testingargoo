// ** import packages **
import { useRef, useState } from 'react';

// ** Components **
import Button from 'components/Button';
import DeleteButton from 'components/DeleteComponents/DeleteButton';
import Icon from 'components/Icon';
import TableInfiniteScroll, {
  AgGridTableRef,
  PaginationParams,
  agGridSelectedProps,
} from 'components/TableInfiniteScroll';
import CardInfiniteScroll from 'components/TableInfiniteScroll/CardInfiniteScroll';
import AuthGuard from 'pages/auth/components/AuthGuard';
import SettingLayout from 'pages/Setting/components/SettingLayout';

// ** Modal **
import DeleteModal from 'components/DeleteComponents/DeleteModal';
import AddActivityResultModal from './components/AddResultModal';

// ** hooks **
import useSelectAll from 'hooks/selectAll';
import useInfiniteScrollInfo from 'hooks/useInfiniteScrollInfo';
import useWindowDimensions from 'hooks/useWindowDimensions';
import useActivityResultColumns from './hooks/useActivityResultsColumns';

// ** constants **
import { BREAD_CRUMB } from 'constant';
import {
  BasicPermissionTypes,
  ModuleNames,
} from 'constant/permissions.constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';

// ** Other **
import { debounce } from 'utils/util';
import {
  useDeleteActivityResultMutation,
  useLazyGetActivityResultsQuery,
} from 'redux/api/activityResultApi';
import {
  LISTING_DATA_LIMIT,
  POLLING_INTERVAL,
} from 'constant/dataLimit.constant';

const ActivityType = () => {
  // ** hooks **
  const tableRef = useRef<AgGridTableRef>(null);

  // ** States **
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpen] = useState<{
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

  // ** APIS **
  const [getActivityResultsAPI, { isLoading: getActivityResultsLoading }] =
    useLazyGetActivityResultsQuery({
      pollingInterval: currentPage === 1 ? POLLING_INTERVAL : 0,
    });
  const [
    deleteActivityResultByIdAPI,
    { isLoading: deleteActivityResultLoading },
  ] = useDeleteActivityResultMutation();

  // ** custom hooks **
  const { isMobileView } = useWindowDimensions();
  const { loading, perPage, items, setPerPage, setItems } =
    useInfiniteScrollInfo({
      getData: getActivityResultData,
      searchData,
    });
  const {
    disabled,
    isCheckAll,
    isCheckAllRef,
    selectedIds,
    setSelectionList,
    selectionRef,
    setIsCheckAll,
  } = useSelectAll({ data: dataInfo });
  // **
  const { columnDefs, defaultColDef } = useActivityResultColumns({
    setOpen,
    selectionRef,
    isCheckAllRef,
    getActivityResultsLoading,
    setIsCheckAll,
    disabled,
    isCheckAll,
    setSelectionList,
    openDeleteActivityResultModal,
    isSelectionDisabled: !dataInfo.length,
  });

  async function getActivityResultData(
    params: PaginationParams = { page: 1, limit: LISTING_DATA_LIMIT }
  ) {
    const { data, error } = await getActivityResultsAPI(
      {
        data: {
          query: {
            ...params,
            'include[creator]': 'all',
          },
        },
      },
      true
    );

    let tableData = { rowData: [], rowCount: 0 };

    if (data && !error) {
      tableData = { rowData: data.rows, rowCount: data.count };
      if (params.page === 1) {
        setDataInfo([...tableData.rowData]);
      } else {
        setDataInfo((prev) => [...prev, ...tableData.rowData]);
      }
    }

    return tableData;
  }

  const onDeleteActivityResult = async () => {
    const data = await deleteActivityResultByIdAPI({
      data: { allId: selectedIds },
    });
    if (!('error' in data)) {
      setItems([]);
      setPerPage({ ...perPage, page: 1 });
      refreshTable();
      closeDeleteModal();
      setIsCheckAll(false);
    }
  };

  const refreshTable = () => {
    tableRef.current?.refreshData();
    if (isMobileView) {
      setPerPage({ ...perPage, page: 1 });
      setItems([]);
    }
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    tableRef.current?.onChange?.(e);
    if (isMobileView) {
      setSearchData({
        ...searchData,
        searchText: e.target?.value.trim(),
        searchFields: 'result',
      });
    }
  };

  const openAddModal = () => setOpen({ edit: false, add: true });

  const closeDeleteModal = () => {
    setDeleteModal(false);
    selectionRef.current = {};
    setSelectionList({});
  };

  function openDeleteActivityResultModal() {
    setDeleteModal(true);
  }

  const closeModal = () => setOpen({ edit: false, add: false });

  return (
    <SettingLayout
      title="Activity Settings"
      breadCrumbPath={BREAD_CRUMB.settings.moduleSetting.activity.result}
      sideBarLinks={SETTING_SIDEBAR.activitySetting}
    >
      <div className="page__ActionHeader setting__activityResult justify-between mb-0">
        <div className="inner__wrapper flex flex-wrap w-full justify-between">
          <div className="header__searchBox w-[255px] lg:w-[calc(100%_-_360px)] sm:w-full sm:flex">
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
              Activity Result
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
                  openDeleteModal={() => openDeleteActivityResultModal()}
                  isLoading={deleteActivityResultLoading}
                  moduleName={
                    selectedIds.length > 1
                      ? 'Activity Results'
                      : 'Activity Result'
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
                isDisabled={getActivityResultsLoading}
              >
                Add Activity Result
              </Button>
            </AuthGuard>
          </div>
        </div>
      </div>
      {isMobileView ? (
        <>
          <div className="settingDetails__M__wrapper activityResult border border-[#CCCCCC]/50 rounded-[12px] p-[12px]">
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
          ref={tableRef}
          setCurrentPage={setCurrentPage}
          rowDataLimit={LISTING_DATA_LIMIT}
          getData={(params) => getActivityResultData(params)}
          columnData={columnDefs}
          searchColumns={['result']}
          defaultColParams={defaultColDef}
          isLoading={getActivityResultsLoading}
          allowMultipleSelect
        />
      )}

      {openModal.edit || openModal.add ? (
        <AddActivityResultModal
          isOpen={openModal.edit || openModal.add}
          closeModal={closeModal}
          setActivityResultInfo={setDataInfo}
          onAdd={refreshTable}
          id={openModal.id}
        />
      ) : (
        <></>
      )}
      <DeleteModal
        closeModal={closeDeleteModal}
        isOpen={deleteModal}
        isLoading={deleteActivityResultLoading}
        deleteOnSubmit={onDeleteActivityResult}
        moduleName={
          selectedIds.length > 1
            ? 'these activity results'
            : 'this activity result'
        }
      />
    </SettingLayout>
  );
};

export default ActivityType;
