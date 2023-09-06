// ** Import Packages **
import { useEffect, useRef, useState } from 'react';

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
import AddPipelineStatusModal from './components/AddPipelineStatusModal';
import DeleteDealPipelineModal from './components/DeleteDealPipelineModal';

// ** Hooks **
import useSelectAll from 'hooks/selectAll';
import useInfiniteScrollInfo from 'hooks/useInfiniteScrollInfo';
import usePermission from 'hooks/usePermission';
import useWindowDimensions from 'hooks/useWindowDimensions';
import useDealPipelineColumns from './hooks/useDealPipelineColumns';

// ** Constant **
import { BREAD_CRUMB } from 'constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';

// ** Other **
import { debounce } from 'utils/util';
import {
  useDeletePipelineMutation,
  useLazyGetPipelinesQuery,
  useUpdatePipelineMutation,
} from 'redux/api/pipelineApi';
import {
  LISTING_DATA_LIMIT,
  POLLING_INTERVAL,
} from 'constant/dataLimit.constant';

const DealPipeline = () => {
  // ** Ref **
  const tableRefForPipeline = useRef<AgGridTableRef>(null);

  // ** States **
  const [currentPage, setCurrentPage] = useState(1);
  const [checked, setChecked] = useState<number>();
  const [pipelineId, setPipelineId] = useState<number>();
  const [isGetDataLoading, setIsGetDataLoading] = useState(false);
  const [dataInfo, setDataInfo] = useState<agGridSelectedProps>([]);
  const [openModalForPipeline, setModalForPipeline] = useState<{
    add: boolean;
    edit: boolean;
  }>({ add: false, edit: false });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    pipelineId: number | undefined;
  }>({ isOpen: false, pipelineId });
  const [searchData, setSearchData] = useState<{
    searchText: string;
    searchFields: string;
  }>({ searchText: '', searchFields: '' });

  // ** APIS **
  const [getPipeline, { isLoading: getPipelineLoading }] =
    useLazyGetPipelinesQuery({
      pollingInterval: currentPage === 1 ? POLLING_INTERVAL : 0,
    });
  const [updateDealPipelineById, { isLoading: updatePipelineLoading }] =
    useUpdatePipelineMutation();
  const [deletePipeline, { isLoading: deletePipelineLoading }] =
    useDeletePipelineMutation();

  // ** Custom hooks **
  const { isMobileView } = useWindowDimensions();
  const { createDealPermission, deleteDealPermission, updateDealPermission } =
    usePermission();

  const { loading, perPage, items, setPerPage, setItems } =
    useInfiniteScrollInfo({
      getData: getDealPipelineData,
      searchData,
    });

  const {
    selectionList,
    setSelectionList,
    selectionRef,
    setDisabled,
    setIsCheckAll,
  } = useSelectAll({ data: dataInfo });

  const selectedIds = Object.values(selectionList || {})
    .filter((obj1: any) => obj1?.id && !obj1?.is_default)
    .map((obj2: any) => +obj2.id);

  // Update This Code
  const changeDefaultType = async (id: number, type: boolean) => {
    const ActivityTypeFormData = new FormData();

    ActivityTypeFormData.set('is_default', JSON.stringify(type) || '');

    const data = await updateDealPipelineById({
      id,
      data: ActivityTypeFormData,
    });

    if (data) {
      refreshTableForPipeline();
    }
  };

  const { columnDefsForPipeline, defaultColDefForPipeline } =
    useDealPipelineColumns({
      setModalForPipeline,
      setPipelineId,
      selectionRef,
      isLoading: getPipelineLoading,
      checked,
      changeDefaultType,
      setSelectionList,
      openDeleteModal,
      isSelectionDisabled: isGetDataLoading || !dataInfo.length,
    });

  useEffect(() => {
    const isSystemOrDefaultInfo = dataInfo.filter(
      (item: { is_system: boolean; is_default: boolean }) =>
        !!item.is_system === !!item.is_default
    );
    setDisabled(isSystemOrDefaultInfo.length === 0);
  }, [dataInfo]);

  async function getDealPipelineData(
    params: PaginationParams = { page: 1, limit: LISTING_DATA_LIMIT }
  ) {
    setIsGetDataLoading(true);
    const { data, error } = await getPipeline(
      {
        params: { ...params },
      },
      true
    );

    let tableData = { rowData: [], rowCount: 0 };

    if (data && !error) {
      const is_default_type = (data.rows || []).find(
        (item: { is_default: boolean }) => item.is_default
      );

      setChecked(is_default_type?.id);

      tableData = { rowData: data.rows, rowCount: data.count };
      if (params.page === 1) {
        setDataInfo([
          ...tableData.rowData.filter(
            (item: { is_system: boolean }) => !item.is_system
          ),
        ]);
      } else {
        setDataInfo((prev) => [
          ...prev,
          ...tableData.rowData.filter(
            (item: { is_system: boolean }) => !item.is_system
          ),
        ]);
      }
      setIsGetDataLoading(false);
    }

    return tableData;
  }

  async function openDeleteModal(Id?: number) {
    const selectedPipelineId = Id || selectedIds?.[0];
    setDeleteModal({ isOpen: true, pipelineId: selectedPipelineId });
  }

  const closeDeletePipelineModal = () => {
    setDeleteModal({ isOpen: false, pipelineId: undefined });
    selectionRef.current = {};
    setSelectionList({});
  };
  const closeModal = () => {
    setModalForPipeline({ edit: false, add: false });
    setPipelineId(undefined);
  };

  const onDeletePipeline = async () => {
    await deletePipeline({
      data: { allId: selectedIds },
    });

    setItems([]);
    setPerPage({ ...perPage, page: 1 });
    refreshTableForPipeline();
    closeDeletePipelineModal();
    setIsCheckAll(false);
    selectionRef.current = {};
    setSelectionList({});
  };

  const openAddPipelineModal = () =>
    setModalForPipeline({ edit: false, add: true });

  const refreshTableForPipeline = () => {
    tableRefForPipeline.current?.refreshData();

    if (isMobileView) {
      setPerPage({ ...perPage, page: 1 });
      setItems([]);
    }
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    tableRefForPipeline.current?.onChange?.(e);
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
      title="Deal Settings"
      breadCrumbPath={BREAD_CRUMB.settings.moduleSetting.deal.pipeline}
      sideBarLinks={SETTING_SIDEBAR.dealSetting}
    >
      <div className="page__ActionHeader setting__pipeline justify-between mb-0">
        <div className="inner__wrapper flex flex-wrap w-full justify-between">
          <div className="header__searchBox w-[255px] lg:w-[calc(100%_-_282px)] sm:w-full sm:flex">
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
              Pipeline
            </h3>
            {selectedIds.length ? (
              <AuthGuard isAccessible={deleteDealPermission}>
                <DeleteButton
                  openDeleteModal={() => openDeleteModal()}
                  isLoading={deletePipelineLoading}
                  moduleName={selectedIds.length > 1 ? 'Pipelines' : 'Pipeline'}
                />
              </AuthGuard>
            ) : (
              <AuthGuard isAccessible={createDealPermission}>
                <Button
                  className="primary__Btn smaller__with__icon h-[44px] px-[22px] ml-[10px] 3xl:h-[36px] lg:ml-0 sm:w-[calc(50%_-_5px)] sm:ml-[5px] sm:mb-[10px] sm:text-[12px] hidden sm:inline-block"
                  onClick={() => openAddPipelineModal()}
                  isDisabled={getPipelineLoading}
                >
                  Add Pipeline
                </Button>
              </AuthGuard>
            )}

            <AuthGuard isAccessible={createDealPermission}>
              <Button
                className="primary__Btn smaller__with__icon h-[44px] px-[22px] ml-[10px] 3xl:h-[36px] lg:ml-0 sm:w-[calc(50%_-_5px)] sm:ml-[5px] sm:mb-[10px] sm:text-[12px] sm:hidden"
                onClick={() => openAddPipelineModal()}
                isDisabled={getPipelineLoading || updatePipelineLoading}
              >
                Add Pipeline
              </Button>
            </AuthGuard>
          </div>
        </div>
      </div>

      {isMobileView ? (
        <div className="settingDetails__M__wrapper pipelineDeal border border-[#CCCCCC]/50 rounded-[12px] p-[12px]">
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
            columnData={columnDefsForPipeline}
            setPerPage={setPerPage}
          />
        </div>
      ) : (
        <TableInfiniteScroll
          setCurrentPage={setCurrentPage}
          onRowClick={(event) => {
            if (updateDealPermission) {
              setModalForPipeline((prev: any) => ({
                ...prev,
                edit: true,
                add: false,
              }));
              setPipelineId(event?.data?.id);
            }
          }}
          ref={tableRefForPipeline}
          rowDataLimit={LISTING_DATA_LIMIT}
          getData={(params) => getDealPipelineData(params)}
          columnData={columnDefsForPipeline}
          searchColumns={['name']}
          defaultColParams={defaultColDefForPipeline}
          isLoading={getPipelineLoading}
          allowMultipleSelect
          type="pipeline"
        />
      )}

      {(openModalForPipeline.edit || openModalForPipeline.add) && (
        <AddPipelineStatusModal
          isOpen={openModalForPipeline.edit || openModalForPipeline.add}
          id={pipelineId}
          setDealPipelineInfo={setDataInfo}
          closeModal={closeModal}
          onAdd={refreshTableForPipeline}
        />
      )}
      {deleteModal.isOpen && deleteModal.pipelineId && (
        <DeleteDealPipelineModal
          isOpen
          pipelineId={deleteModal.pipelineId}
          deleteOnSubmit={onDeletePipeline}
          isLoading={deletePipelineLoading}
          closeModal={closeDeletePipelineModal}
          moduleName={
            selectedIds.length > 1 ? 'these Pipelines' : 'this pipeline'
          }
        />
      )}
    </SettingLayout>
  );
};

export default DealPipeline;
