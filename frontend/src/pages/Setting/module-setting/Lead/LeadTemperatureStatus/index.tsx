// ** Import Packages **
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

// ** hooks **
import useSelectAll from 'hooks/selectAll';
import useInfiniteScrollInfo from 'hooks/useInfiniteScrollInfo';
import usePermission from 'hooks/usePermission';
import useWindowDimensions from 'hooks/useWindowDimensions';
import useLeadStatusColumns from './hooks/useLeadTemperatureStatusColumns';

// ** modal **
import DeleteModal from 'components/DeleteComponents/DeleteModal';
import AddLeadTemperatureStatusModal from './components/AddLeadTemperatureStatusModal';

// ** services **
import {
  EntityAttributesEnum,
} from 'redux/api/entityAttributesApi';

// ** Constant **
import { BREAD_CRUMB } from 'constant';
import { MODULE_PERMISSION } from 'constant/permissions.constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';
import { ToastMsg } from 'constant/toast.constants';

// ** Other **
import { debounce } from 'utils/util';
import {
  LISTING_DATA_LIMIT,
  POLLING_INTERVAL,
} from 'constant/dataLimit.constant';
import { useDeleteLeadTempStatusMutation, useLazyGetLeadTempStatusQuery } from 'redux/api/leadTempStatusApi';

const LeadTemperatureStatus = () => {
  // ** Ref **
  const tableRef = useRef<AgGridTableRef>(null);

  // ** States **
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState<{
    add: boolean;
    edit: boolean;
    id?: number | null;
    changeColor: boolean;
  }>({ edit: false, add: false, changeColor: false });
  const [dataInfo, setDataInfo] = useState<agGridSelectedProps>([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [searchData, setSearchData] = useState<{
    searchText: string;
    searchFields: string;
  }>({ searchText: '', searchFields: '' });

  // ** APIS **
  const [getLeadTemperatureStatus, { isLoading }] =
    useLazyGetLeadTempStatusQuery({
      pollingInterval: currentPage === 1 ? POLLING_INTERVAL : 0,
    });
  const [deleteLeadTempStatusApi, { isLoading: deleteLeadStatusLoading }] =
    useDeleteLeadTempStatusMutation();

  // ** Custom hooks **
  const { isMobileView } = useWindowDimensions();
  const { createLeadPermission, deleteLeadPermission } = usePermission();
  const { loading, perPage, items, setPerPage, setItems } =
    useInfiniteScrollInfo({
      getData: getLeadTemperatureData,
      searchData,
    });
  const {
    disabled,
    isCheckAll,
    isCheckAllRef,
    selectionList,
    setSelectionList,
    selectionRef,
    setIsCheckAll,
  } = useSelectAll({ data: dataInfo });

  const selectedIds = Object.values(selectionList || {})
    .filter((obj1: any) => obj1?.id && !obj1?.is_system)
    .map((obj2: any) => +obj2.id);

  const { columnDefs, defaultColDef } = useLeadStatusColumns({
    setIsOpen,
    openChangeColorStatusModal,
    selectionRef,
    isCheckAllRef,
    disabled,
    setIsCheckAll,
    isLoading,
    isCheckAll,
    dataLength: dataInfo.length,
    setSelectionList,
    openLeadTempStatusDeleteModal,
    isSelectionDisabled: !dataInfo.length,
  });
  async function getLeadTemperatureData(
    params: PaginationParams = { page: 1, limit: LISTING_DATA_LIMIT }
  ) {
    const { data, error } = await getLeadTemperatureStatus(
      {
        data: {
          query: {
            ...params,
            ...MODULE_PERMISSION.LEAD.read,
            'q[type]': EntityAttributesEnum.LEAD_TEMP_STATUS,
            'include[creator]': 'id,first_name,last_name,full_name',
          },
        },
      },
      true
    );

    let tableData = { rowData: [], rowCount: 0 };

    if (data && !error) {
      tableData = { rowData: data.rows, rowCount: data.count };
      const filleterData = tableData.rowData.filter(
        (obj1: any) => obj1?.id && !obj1?.is_system
      );
      setDataInfo((prev) =>
        params.page === 1 ? [...filleterData] : [...prev, ...filleterData]
      );
    }

    return tableData;
  }

  const closeAddUserModal = () =>
    setIsOpen({ edit: false, add: false, changeColor: false });

  const closeLeadTempStatusDeleteModal = () => {
    setDeleteModal(false);
    selectionRef.current = {};
    setSelectionList({});
  };

  function openLeadTempStatusDeleteModal() {
    setDeleteModal(true);
  }

  const openAddLeadStatusModal = () =>
    setIsOpen({ edit: false, add: true, changeColor: false });

  function openChangeColorStatusModal(id: number) {
    setIsOpen({ add: false, edit: false, changeColor: true, id });
  }

  const refreshTable = () => {
    tableRef.current?.refreshData();
    if (isMobileView) {
      setPerPage({ ...perPage, page: 1 });
      setItems([]);
    }
  };

  const OnDeleteLeadTempStatus = async () => {
    const toastMsg =
      selectedIds.length > 1
        ? ToastMsg.settings.moduleSettings.lead.leadTempStatus.deleteMsg.replace(
          'status',
          'statuses'
        )
        : ToastMsg.settings.moduleSettings.lead.leadTempStatus.deleteMsg;

    await deleteLeadTempStatusApi({
      data: {
        allId: selectedIds,
        toastMsg,
        type: EntityAttributesEnum.LEAD_TEMP_STATUS,
      },
      params: { ...MODULE_PERMISSION.LEAD.delete },
    });
    setItems([]);
    setPerPage({ ...perPage, page: 1 });
    refreshTable();
    closeLeadTempStatusDeleteModal();
    setIsCheckAll(false);
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

  return (
    <SettingLayout
      title="Lead Settings"
      breadCrumbPath={BREAD_CRUMB.settings.moduleSetting.lead.temperatureStatus}
      sideBarLinks={SETTING_SIDEBAR.leadSettings}
    >
      <div className="page__ActionHeader setting__temperatureStatus justify-between mb-0">
        <div className="inner__wrapper flex flex-wrap w-full justify-between">
          <div className="header__searchBox w-[255px] lg:w-[calc(100%_-_258px)] sm:w-full sm:flex">
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
              Temperature Status
            </h3>
            {!isMobileView && selectedIds.length > 0 && (
              <AuthGuard isAccessible={deleteLeadPermission}>
                <DeleteButton
                  openDeleteModal={() => openLeadTempStatusDeleteModal()}
                  isLoading={deleteLeadStatusLoading}
                  moduleName={selectedIds.length > 1 ? 'Statuses' : 'Status'}
                />
              </AuthGuard>
            )}

            <AuthGuard isAccessible={createLeadPermission}>
              <Button
                className="primary__Btn smaller__with__icon h-[44px] px-[22px] ml-[10px] 3xl:h-[36px] lg:ml-0 sm:w-[calc(50%_-_5px)] sm:ml-[5px] sm:mb-[10px] sm:text-[12px]"
                onClick={() => openAddLeadStatusModal()}
                isDisabled={isLoading}
              >
                Add Status
              </Button>
            </AuthGuard>
          </div>
        </div>
      </div>
      {isMobileView ? (
        <>
          <div className="settingDetails__M__wrapper temperatureStatusLead border border-[#CCCCCC]/50 rounded-[12px] p-[12px]">
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
          getData={(params) => getLeadTemperatureData(params)}
          columnData={columnDefs}
          searchColumns={['name']}
          defaultColParams={defaultColDef}
          isLoading={isLoading}
          allowMultipleSelect
        />
      )}

      {isOpen.add || isOpen.edit || isOpen.changeColor ? (
        <AddLeadTemperatureStatusModal
          isOpen={isOpen.add || isOpen.edit || isOpen.changeColor}
          closeModal={closeAddUserModal}
          onAdd={refreshTable}
          setLeadTempInfo={setDataInfo}
          id={isOpen?.id}
          changeColor={isOpen.changeColor}
        />
      ) : null}
      <DeleteModal
        closeModal={() => closeLeadTempStatusDeleteModal()}
        isOpen={deleteModal}
        isLoading={deleteLeadStatusLoading}
        deleteOnSubmit={() => OnDeleteLeadTempStatus()}
        moduleName={selectedIds.length > 1 ? 'these statuses' : 'this status'}
      />
    </SettingLayout>
  );
};

export default LeadTemperatureStatus;
