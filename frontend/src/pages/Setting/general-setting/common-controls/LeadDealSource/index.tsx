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
import AuthGuard from 'pages/auth/components/AuthGuard';
import AddLeadDealSourceModal from './components/AddLeadDealSourceModal';

// ** Hooks **
import useSelectAll from 'hooks/selectAll';
import useInfiniteScrollInfo from 'hooks/useInfiniteScrollInfo';
import usePermission from 'hooks/usePermission';
import useSettingSidebarLinks from 'hooks/useSettingSidebarLinks';
import useWindowDimensions from 'hooks/useWindowDimensions';
import useLeadDealSourceColumns from './hooks/useLeadDealSourceColumns';

// ** API **
import { useDeleteLeadDealSourceMutation, useLazyGetLeadDealSourceQuery } from 'redux/api/leadDealSourceApi';

// ** Services **
import {
  EntityAttributesEnum,
} from 'redux/api/entityAttributesApi';

// ** Constant **
import { BREAD_CRUMB } from 'constant';
import {
  LISTING_DATA_LIMIT,
  POLLING_INTERVAL,
} from 'constant/dataLimit.constant';
import { MODULE_PERMISSION } from 'constant/permissions.constant';
import { ToastMsg } from 'constant/toast.constants';

// ** Other **

import { debounce } from 'utils/util';

const LeadDealSource = () => {
  // ** hooks **
  const tableRef = useRef<AgGridTableRef>(null);

  // ** States **
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState<{
    add: boolean;
    edit: boolean;
    id?: number | null;
  }>({ edit: false, add: false });
  const [dataInfo, setDataInfo] = useState<agGridSelectedProps>([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [searchData, setSearchData] = useState<{
    searchText: string;
    searchFields: string;
  }>({ searchText: '', searchFields: '' });

  // ** APIS **
  const [getLeadDealSource, { isLoading }] = useLazyGetLeadDealSourceQuery({
    pollingInterval: currentPage === 1 ? POLLING_INTERVAL : 0,
  });
  const [deleteLeadDealSourceApi, { isLoading: deleteLeadDealSourceLoading }] =
    useDeleteLeadDealSourceMutation();

  // ** Custom hooks **
  const { isMobileView } = useWindowDimensions();
  const { createLeadPermission, deleteLeadPermission } = usePermission();
  const { filterCommonControlsSideBarLink } = useSettingSidebarLinks();

  const { loading, perPage, items, setPerPage, setItems } =
    useInfiniteScrollInfo({
      getData: getLeadDealSourceData,
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
  const { columnDefs, defaultColDef } = useLeadDealSourceColumns({
    setIsOpen,
    selectionRef,
    isCheckAllRef,
    isLoading,
    setIsCheckAll,
    isCheckAll,
    disabled,
    setSelectionList,
    openDeleteModal,
    isSelectionDisabled: !dataInfo.length,
  });

  async function getLeadDealSourceData(
    params: PaginationParams = { page: 1, limit: LISTING_DATA_LIMIT }
  ) {
    const { data, error } = await getLeadDealSource(
      {
        data: {
          query: {
            ...params,
            ...MODULE_PERMISSION.LEAD.read,
            'include[creator]': 'id,first_name,last_name,full_name',
            select: 'id,name,is_system,type',
            sort: '-id',
            'q[type]': EntityAttributesEnum.LEAD_DEAL_SOURCE,
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

  const closeAddLeadDealSourceModal = () =>
    setIsOpen({ edit: false, add: false });

  const closeDeleteLeadDealSourceModal = () => {
    setDeleteModal(false);
    selectionRef.current = {};
    setSelectionList({});
  };

  const openAddLeadDealSourceModal = () =>
    setIsOpen({ edit: false, add: true });

  function openDeleteModal() {
    setDeleteModal(true);
  }

  const refreshTable = () => {
    tableRef.current?.refreshData();
    if (isMobileView) {
      setPerPage({ ...perPage, page: 1 });
      setItems([]);
    }
  };

  const OnDeleteLeadDealSource = async () => {
    await deleteLeadDealSourceApi({
      data: {
        allId: selectedIds,
        type: EntityAttributesEnum.LEAD_DEAL_SOURCE,
        toastMsg:
          ToastMsg.settings.generalSettings.commonControls.leadDealSource
            .deleteMsg,
      },
      params: { ...MODULE_PERMISSION.LEAD.delete },
    });
    setItems([]);
    refreshTable();
    closeDeleteLeadDealSourceModal();
    setPerPage({ ...perPage, page: 1 });
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
      title="Common Controls"
      breadCrumbPath={
        BREAD_CRUMB.settings.generalSettings.commonControls.leadDealSource
      }
      sideBarLinks={filterCommonControlsSideBarLink()}
    >
      <div className="page__ActionHeader setting__leadSource justify-between mb-0">
        <div className="inner__wrapper flex flex-wrap w-full justify-between">
          <div className="header__searchBox w-[255px] lg:w-[calc(100%_-_268px)] sm:w-full sm:flex">
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
              Lead/Deal Source
            </h3>
            {!isMobileView && selectedIds.length ? (
              <AuthGuard isAccessible={deleteLeadPermission}>
                <DeleteButton
                  openDeleteModal={() => openDeleteModal()}
                  isLoading={deleteLeadDealSourceLoading}
                  moduleName={selectedIds.length > 1 ? 'Sources' : 'Source'}
                />
              </AuthGuard>
            ) : null}
            <AuthGuard isAccessible={createLeadPermission}>
              <Button
                className="primary__Btn smaller__with__icon h-[44px] px-[22px] ml-[10px] 3xl:h-[36px] lg:ml-0 sm:w-[calc(50%_-_5px)] sm:ml-[5px] sm:mb-[10px] sm:text-[12px]"
                onClick={() => openAddLeadDealSourceModal()}
                isDisabled={isLoading}
              >
                Add Source
              </Button>
            </AuthGuard>
          </div>
        </div>
      </div>
      {isMobileView ? (
        <div className="settingDetails__M__wrapper leadDeal__Source border border-[#CCCCCC]/50 rounded-[12px] p-[12px]">
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
          getData={(params) => getLeadDealSourceData(params)}
          columnData={columnDefs}
          searchColumns={['name']}
          defaultColParams={defaultColDef}
          isLoading={isLoading}
          allowMultipleSelect
        />
      )}

      {isOpen.add || isOpen.edit ? (
        <AddLeadDealSourceModal
          isOpen={isOpen.add || isOpen.edit}
          closeModal={closeAddLeadDealSourceModal}
          setSourceInfo={setDataInfo}
          onAdd={refreshTable}
          id={isOpen?.id}
        />
      ) : null}
      <DeleteModal
        closeModal={closeDeleteLeadDealSourceModal}
        isOpen={deleteModal}
        isLoading={deleteLeadDealSourceLoading}
        deleteOnSubmit={() => OnDeleteLeadDealSource()}
        moduleName={selectedIds.length > 1 ? 'these sources' : 'this source'}
      />
    </SettingLayout>
  );
};

export default LeadDealSource;
