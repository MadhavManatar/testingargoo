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

// ** Modals **
import DeleteModal from 'components/DeleteComponents/DeleteModal';
import AddLeadStatusModal from './components/AddLeadStatusModal';

// ** API **
import { useDeleteDealStatusMutation, useLazyGetLeadStatusQuery } from 'redux/api/leadStatusApi';

// ** hooks **
import useSelectAll from 'hooks/selectAll';
import useInfiniteScrollInfo from 'hooks/useInfiniteScrollInfo';
import usePermission from 'hooks/usePermission';
import useSettingSidebarLinks from 'hooks/useSettingSidebarLinks';
import useWindowDimensions from 'hooks/useWindowDimensions';
import useLeadStatusColumns from './hooks/useLeadStatusColumns';

// ** services **
import {
  EntityAttributesEnum,
} from 'redux/api/entityAttributesApi';

// ** Constants **
import { BREAD_CRUMB } from 'constant';
import {
  LISTING_DATA_LIMIT,
  POLLING_INTERVAL,
} from 'constant/dataLimit.constant';
import { MODULE_PERMISSION } from 'constant/permissions.constant';
import { ToastMsg } from 'constant/toast.constants';

// ** Other **
import { debounce } from 'utils/util';

const LeadDealStatus = () => {
  // ** hooks **
  const tableRef = useRef<AgGridTableRef>(null);

  // ** States **
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState<{
    add: boolean;
    edit: boolean;
    id?: number | null;
    changeColor: boolean;
  }>({ edit: false, add: false, changeColor: false });
  const [deleteModal, setDeleteModal] = useState(false);
  const [dataInfo, setDataInfo] = useState<agGridSelectedProps>([]);
  const [searchData, setSearchData] = useState<{
    searchText: string;
    searchFields: string;
  }>({ searchText: '', searchFields: '' });

  // ** APIS **
  const [getLeadDealStatus, { isLoading }] = useLazyGetLeadStatusQuery({
    pollingInterval: currentPage === 1 ? POLLING_INTERVAL : 0,
  });
  const [deleteDealStatusApi, { isLoading: deleteLeadStatusLoading }] =
    useDeleteDealStatusMutation();

  // ** Custom hooks **
  const { isMobileView } = useWindowDimensions();
  const { createLeadPermission, deleteLeadPermission } = usePermission();

  const { filterCommonControlsSideBarLink } = useSettingSidebarLinks();

  const { loading, perPage, items, setPerPage, setItems } =
    useInfiniteScrollInfo({
      getData: getLeadStatusData,
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

  // **
  const { columnDefs, defaultColDef } = useLeadStatusColumns({
    setIsOpen,
    openChangeColorStatusModal,
    selectionRef,
    disabled,
    isCheckAllRef,
    isLoading,
    dataLength: dataInfo.length,
    setIsCheckAll,
    isCheckAll,
    setSelectionList,
    openDeleteLeadStatusModal,
    isSelectionDisabled: !dataInfo.length,
  });

  async function getLeadStatusData(
    params: PaginationParams = { page: 1, limit: LISTING_DATA_LIMIT }
  ) {
    const { data, error } = await getLeadDealStatus(
      {
        data: {
          query: {
            ...params,
            ...MODULE_PERMISSION.LEAD.read,
            'include[creator]': 'id,first_name,last_name,full_name',
            select: 'id,name,is_system,type,color',
            sort: '-id',
            'q[type]': EntityAttributesEnum.LEAD_STATUS,
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
      if (params.page === 1) {
        setDataInfo([...filleterData]);
      } else {
        setDataInfo((prev) => [...prev, ...filleterData]);
      }
    }

    return tableData;
  }

  const refreshTable = () => {
    tableRef.current?.refreshData();
    if (isMobileView) {
      setPerPage({ ...perPage, page: 1 });
      setItems([]);
    }
  };

  const onDeleteLeadStatus = async () => {
    const toastMsg =
      selectedIds.length > 1
        ? ToastMsg.settings.moduleSettings.lead.status.deleteMsg.replace(
          'status',
          'statuses'
        )
        : ToastMsg.settings.moduleSettings.lead.status.deleteMsg;

    await deleteDealStatusApi({
      data: {
        allId: selectedIds,
        toastMsg,
        type: EntityAttributesEnum.LEAD_STATUS,
      },
      params: { ...MODULE_PERMISSION.LEAD.delete },
    });

    setItems([]);
    setPerPage({ ...perPage, page: 1 });
    refreshTable();
    setIsCheckAll(false);
    closeDeleteLeadStatusModal();
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

  const openAddLeadStatusModal = () =>
    setIsOpen({ edit: false, add: true, changeColor: false });

  function openChangeColorStatusModal(id: number) {
    setIsOpen({ add: false, edit: false, changeColor: true, id });
  }
  const closeAddUserModal = () =>
    setIsOpen({ edit: false, add: false, changeColor: false });

  const closeDeleteLeadStatusModal = () => {
    setDeleteModal(false);
    selectionRef.current = {};
    setSelectionList({});
  };

  function openDeleteLeadStatusModal() {
    setDeleteModal(true);
  }

  return (
    <SettingLayout
      title="Common Controls"
      breadCrumbPath={BREAD_CRUMB.settings.moduleSetting.lead.status}
      sideBarLinks={filterCommonControlsSideBarLink()}
    >
      <div className="page__ActionHeader setting__leadStatus justify-between mb-0">
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
              Lead Status
            </h3>
            {!isMobileView && selectedIds.length ? (
              <AuthGuard isAccessible={deleteLeadPermission}>
                <DeleteButton
                  openDeleteModal={() => openDeleteLeadStatusModal()}
                  isLoading={deleteLeadStatusLoading}
                  moduleName={selectedIds.length > 1 ? 'Statuses' : 'Status'}
                />
              </AuthGuard>
            ) : null}
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
          <div className="settingDetails__M__wrapper leadStatus border border-[#CCCCCC]/50 rounded-[12px] p-[12px]">
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
          getData={(params) => getLeadStatusData(params)}
          columnData={columnDefs}
          searchColumns={['name']}
          defaultColParams={defaultColDef}
          isLoading={isLoading}
          allowMultipleSelect
        />
      )}

      {isOpen.add || isOpen.edit || isOpen.changeColor ? (
        <AddLeadStatusModal
          isOpen={isOpen.add || isOpen.edit || isOpen.changeColor}
          closeModal={closeAddUserModal}
          setLeadStatus={setDataInfo}
          onAdd={refreshTable}
          id={isOpen?.id}
          changeColor={isOpen.changeColor}
        />
      ) : null}
      <DeleteModal
        closeModal={() => closeDeleteLeadStatusModal()}
        isOpen={deleteModal}
        isLoading={deleteLeadStatusLoading}
        deleteOnSubmit={() => onDeleteLeadStatus()}
        moduleName={selectedIds.length > 1 ? 'these statuses' : 'this status'}
      />
    </SettingLayout>
  );
};

export default LeadDealStatus;
