// ** Import Packages **
import { useRef, useState } from 'react';

// ** Components **
import Button from 'components/Button';
import DeleteButton from 'components/DeleteComponents/DeleteButton';
import DeleteModal from 'components/DeleteComponents/DeleteModal';
import Icon from 'components/Icon';
import TableInfiniteScroll, {
  AgGridTableRef,
  PaginationParams,
  agGridSelectedProps,
} from 'components/TableInfiniteScroll';
import CardInfiniteScroll from 'components/TableInfiniteScroll/CardInfiniteScroll';
import SettingLayout from 'pages/Setting/components/SettingLayout';
import AddLostReasonModal from 'pages/Setting/module-setting/Deal/LostReasons/components/AddLostReasonModal';
import AuthGuard from 'pages/auth/components/AuthGuard';

// ** Hooks **
import useSelectAll from 'hooks/selectAll';
import useInfiniteScrollInfo from 'hooks/useInfiniteScrollInfo';
import usePermission from 'hooks/usePermission';
import useWindowDimensions from 'hooks/useWindowDimensions';
import useDealLostReasonColumns from './hooks/useDealLostReasonColumns';

// ** Services **
import {
  EntityAttributesEnum,
} from 'redux/api/entityAttributesApi';

// ** constants **
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
import { useDeleteDealLostReasonMutation, useLazyGetDealLostReasonsQuery } from 'redux/api/dealLostReasonApi';

const DealLostReason = () => {
  // ** Ref **
  const tableRef = useRef<AgGridTableRef>(null);

  // ** States **
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState<{
    add: boolean;
    edit: boolean;
    id?: number | null;
  }>({ add: false, edit: false });
  const [dataInfo, setDataInfo] = useState<agGridSelectedProps>([]);
  const [deleteModal, setDeleteModal] = useState(false);

  const [searchData, setSearchData] = useState<{
    searchText: string;
    searchFields: string;
  }>({ searchText: '', searchFields: '' });

  // ** API **
  const [getDealLostReasonApi, { isLoading }] = useLazyGetDealLostReasonsQuery({
    pollingInterval: currentPage === 1 ? POLLING_INTERVAL : 0,
  });
  const [deleteDealLostReasonApi, { isLoading: deleteLostReasonLoading }] =
    useDeleteDealLostReasonMutation();

  // ** Custom hooks **
  const { isMobileView } = useWindowDimensions();
  const { createDealPermission, deleteDealPermission } = usePermission();
  const { loading, perPage, items, setPerPage, setItems } =
    useInfiniteScrollInfo({
      getData: getDealLostReasonsData,
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

  const { columnDefs, defaultColDef } = useDealLostReasonColumns({
    setOpenModal,
    selectionRef,
    isCheckAllRef,
    isLoading,
    setIsCheckAll,
    isCheckAll,
    disabled,
    setSelectionList,
    openDeleteLostReasonModal,
    isSelectionDisabled: !dataInfo.length,
  });

  async function getDealLostReasonsData(
    params: PaginationParams = { page: 1, limit: LISTING_DATA_LIMIT }
  ) {
    const { data, error } = await getDealLostReasonApi(
      {
        data: {
          query: {
            ...params,
            ...MODULE_PERMISSION.DEAL.read,
            'q[type]': EntityAttributesEnum.DEAL_LOST_REASON,
            'include[creator]': 'id,first_name,last_name,full_name',
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

  const onDeleteLostReason = async () => {
    await deleteDealLostReasonApi({
      data: {
        allId: selectedIds,
        type: EntityAttributesEnum.DEAL_LOST_REASON,
        toastMsg: ToastMsg.settings.moduleSettings.deal.lostReason.deleteMsg,
      },
      params: { ...MODULE_PERMISSION.DEAL.delete },
    });
    setItems([]);
    setPerPage({ ...perPage, page: 1 });
    refreshTable();
    setIsCheckAll(false);
    closeDeleteLostReasonModal();
  };

  const openAddLostReasonModal = () => setOpenModal({ edit: false, add: true });

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
        searchFields: 'reason',
      });
    }
  };

  const closeDeleteLostReasonModal = () => {
    setDeleteModal(false);
    selectionRef.current = {};
    setSelectionList({});
  };

  function openDeleteLostReasonModal() {
    setDeleteModal(true);
  }

  const closeModal = () => setOpenModal({ edit: false, add: false });

  return (
    <SettingLayout
      title="Deal Settings"
      breadCrumbPath={BREAD_CRUMB.settings.moduleSetting.deal.lostReasons}
      sideBarLinks={SETTING_SIDEBAR.dealSetting}
    >
      <div className="page__ActionHeader setting__lostReasons justify-between mb-0">
        <div className="inner__wrapper flex flex-wrap w-full justify-between">
          <div className="header__searchBox w-[255px] lg:w-[calc(100%_-_273px)] sm:w-full sm:flex">
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
              Lost Reasons
            </h3>
            {!isMobileView && selectedIds.length ? (
              <AuthGuard isAccessible={deleteDealPermission}>
                <DeleteButton
                  openDeleteModal={() => openDeleteLostReasonModal()}
                  isLoading={deleteLostReasonLoading}
                  moduleName={selectedIds.length > 1 ? 'Reasons' : 'Reason'}
                />
              </AuthGuard>
            ) : null}

            <AuthGuard isAccessible={createDealPermission}>
              <Button
                className="primary__Btn smaller__with__icon h-[44px] px-[22px] ml-[10px] 3xl:h-[36px] lg:ml-0 sm:w-[calc(50%_-_5px)] sm:ml-[5px] sm:mb-[10px] sm:text-[12px]"
                onClick={() => openAddLostReasonModal()}
                isDisabled={isLoading}
              >
                Add Reason
              </Button>
            </AuthGuard>
          </div>
        </div>
      </div>
      {isMobileView ? (
        <div className="settingDetails__M__wrapper lostReasons border border-[#CCCCCC]/50 rounded-[12px] p-[12px]">
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
      ) : (
        <TableInfiniteScroll
          setCurrentPage={setCurrentPage}
          ref={tableRef}
          rowDataLimit={LISTING_DATA_LIMIT}
          getData={(params) => getDealLostReasonsData(params)}
          columnData={columnDefs}
          searchColumns={['name']}
          defaultColParams={defaultColDef}
          isLoading={isLoading}
          allowMultipleSelect
        />
      )}

      {(openModal.edit || openModal.add) && (
        <AddLostReasonModal
          isOpen={openModal.edit || openModal.add}
          id={openModal?.id}
          onAdd={refreshTable}
          setDealLostInfo={setDataInfo}
          closeModal={closeModal}
        />
      )}
      <DeleteModal
        closeModal={closeDeleteLostReasonModal}
        isOpen={deleteModal}
        isLoading={deleteLostReasonLoading}
        deleteOnSubmit={() => onDeleteLostReason()}
        moduleName={selectedIds.length > 1 ? 'these reasons' : 'this reason'}
      />
    </SettingLayout>
  );
};

export default DealLostReason;
