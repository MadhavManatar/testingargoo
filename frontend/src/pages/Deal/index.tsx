// ** Import packages **
import { useEffect, useReducer, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ColDef, RowClickedEvent } from 'ag-grid-community';
import _ from 'lodash';
// ** Redux **
import {
  getEntityTableView,
  getIsDealQuickAdd,
  setDealQuickAdd,
  setEntityLastOpenRecord,
} from 'redux/slices/commonSlice';

// ** components **
import DeleteModal from 'components/DeleteComponents/DeleteModal';
import { Option } from 'components/FormField/types/formField.types';
import TableInfiniteScroll, {
  agGridSelectedProps,
  AgGridTableRef,
  PaginationParams,
} from 'components/TableInfiniteScroll';
import CardInfiniteScroll from 'components/TableInfiniteScroll/CardInfiniteScroll';
import AuthGuard from 'pages/auth/components/AuthGuard';
import AddDealWonLostModal from './components/AddDealWonLostModal';
import DealKanBanView from './components/detail/DealKanBanView';

// ** hook **
import useSelectAll from 'hooks/selectAll';
import useInfiniteScrollInfo from 'hooks/useInfiniteScrollInfo';
import usePermission from 'hooks/usePermission';
import useWindowDimensions from 'hooks/useWindowDimensions';
import useDealColumns from './hooks/useDealColumns';

// ** Type **
import { entityDataType } from 'pages/Activity/types/activity.types';

// ** constant **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { ModuleNames, POLYMORPHIC_MODELS } from 'constant/permissions.constant';
import { ToastMsg } from 'constant/toast.constants';

// ** others **
import { isSingleValue } from 'components/FormField/helper';
import { debounce } from 'utils/util';
import useFollowFollowing from 'components/EntityDetails/FollowFollowing/useFollowFollowing';
import { useLazyGetPipelinesQuery } from 'redux/api/pipelineApi';
import {
  LISTING_DATA_LIMIT,
  POLLING_INTERVAL,
} from 'constant/dataLimit.constant';
import {
  useDeleteLeadMutation,
  useLazyGetLeadsAdvanceQuery,
} from 'redux/api/leadApi';
import {
  columnsDataInterface,
  columnViewInterface,
} from 'components/ColumnViewListDropDown';
import {
  getFilterKeys,
  setIncludeObj,
} from 'components/TableHeader/helpers/columnTypeManage';
import ColumnManageModal from 'components/ColumnManageModal';
import TableHeader from 'components/TableHeader';
import { IS_CACHING_ACTIVE } from 'constant';
import { useLazyGetGeneralSettingQuery } from 'redux/api/generalSettingApi';
// ** Redux ** //
import { getCurrentUser } from 'redux/slices/authSlice';
import useDateColorCal from './hooks/useClosingDateColorCal';
import { AssignTagsProps } from 'components/EntityDetails/types';
import useTagListView from 'pages/TagMangement/useTagMangement';
import AssignTagModal from 'components/detail-components/AssignTags/AssignTagModal';
import useTableHeaderService from 'components/TableHeader/useTableHeaderService';

function customReducer(
  state: columnViewInterface,
  action: {
    type: 'update';
    data: columnViewInterface;
  }
) {
  if (action.type === 'update') {
    return action.data;
  }
  throw Error('Unknown action.');
}

const initialOpenModalState = {
  add: false,
  delete: false,
  manageColumn: false,
  addTag: false,
  saveAsView: false,
};

const Deals = () => {
  // ** Hooks **
  const dispatch = useDispatch();
  const currentDays = useRef<string>();
  const tableRef = useRef<AgGridTableRef>(null);
  const isDealQuickAdd = useSelector(getIsDealQuickAdd);
  const navigate = useNavigate();
  const initialTableView = useSelector(getEntityTableView);

  // ** States **
  const [pollingInterval, setPollingInterval] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [dataInfo, setDataInfo] = useState<agGridSelectedProps>([]);
  const [dealsView, setDealsView] = useState<'list' | 'kanBan'>('list');
  const [pipelineOptions, setPipelineOptions] = useState<Option[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<any>({});
  const [isDealsUpdate, setIsDealsUpdate] = useState(false);
  const [openModal, setOpenModal] = useState<{
    add: boolean;
    delete: boolean;
    manageColumn: boolean;
    addTag: boolean;
    saveAsView: boolean;
  }>(initialOpenModalState);

  const [isOpenDealWonLostModal, setIsOpenDealWonLostModal] =
    useState<boolean>(false);
  const [dealWonLostData, setDealWonLostData] = useState<{
    entityData?: entityDataType;
    stageType: string;
  }>();
  const [searchData, setSearchData] = useState<{
    searchText: string;
    searchFields: string;
  }>({
    searchText: '',
    searchFields: '',
  });
  const [searchText, setSearchText] = useState<string>('');
  const [isColumnDataUpdated, setIsColumnDataUpdated] = useState(false);
  const [dealClosingDateData, setDealClosingDateData] = useState<{
    time_frame: number;
    neutral_color: string;
    warning_color: string;
    passed_due_color: string;
  }>({
    time_frame: 7,
    neutral_color: '#7EA838',
    warning_color: '#F78310',
    passed_due_color: '#e70e02',
  });
  const [dealId, setDealId] = useState(-1);
  const [assignedTags, setAssignedTags] = useState<AssignTagsProps>({
    list: [],
    total: 0,
  });

  // ** APIS **
  const [getPipelineAPI, { isLoading: getPipelineLoading }] =
    useLazyGetPipelinesQuery();
  const [deleteLeadsAPI, { isLoading: isDeleteDealsLoading }] =
    useDeleteLeadMutation();
  const [getLeadsAPI, { isLoading: getDealsLoading }] =
    useLazyGetLeadsAdvanceQuery({
      pollingInterval: currentPage === 1 ? pollingInterval : 0,
    });
  const [, setSpacing] = useState<{ height: number; class: string }>({
    height: 60,
    class: 'normal',
  });
  // ** Ref **
  const selectedColumnViewRef = useRef<columnViewInterface>();

  // ** Custom Reducer **
  const [selectedColumnView, setSelectedColumnView] = useReducer(
    customReducer,
    {
      id: -1,
      model_name: '',
      name: '',
      organization_id: -1,
      is_system: false,
      is_locked: false,
      filter: {},
      columns: [],
      sort: [],
      visibility: 'public',
    }
  );

  // ** Custom hooks **
  const {
    readDealPermission,
    createDealPermission,
    deleteDealPermission,
    tagForDealPermission,
  } = usePermission();
  const { isMobileView } = useWindowDimensions();
  const { dealClosingDateDataCal } = useDateColorCal();
  const { loading, perPage, items, setPerPage, setItems } =
    useInfiniteScrollInfo({
      getData: getDealData,
      searchData,
    });
  const { followingStoreRefresh } = useFollowFollowing({
    moduleName: ModuleNames.DEAL,
  });
  const {
    disabled,
    isCheckAll,
    isCheckAllRef,
    selectedIds,
    setSelectionList,
    selectionRef,
    setIsCheckAll,
    selectionList,
  } = useSelectAll({ data: dataInfo });
  const currentUser = useSelector(getCurrentUser);
  const [getGeneralSetting] = useLazyGetGeneralSettingQuery();
  const { getAssignedTags, deleteAssignedTags } = useTagListView();

  const {
    onHandleMoveColumnData,
    onHandleUpdateColumnData,
    onHandleUpdateColumnWidth,
    updateColumnView,
    selectColumnView,
    isViewUpdate,
    editColumnViewId,
    setColumnEditViewId,
    updateSpacing,
    setIsWrapTxtUpdate,
    isWrapTxtUpdate,
  } = useTableHeaderService({
    selectedColumnView,
    setSelectedColumnView,
    selectedColumnViewRef,
    setIsColumnDataUpdated,
    isColumnDataUpdated,
    refreshTable,
    openManageColumnModal,
    setSpacing,
  });

  const { columnDefs, defaultColDef } = useDealColumns({
    selectionRef,
    isCheckAllRef,
    setIsCheckAll,
    disabled,
    loading: getPipelineLoading,
    openAddTagModal,
    setIsWrapTxtUpdate,
    isCheckAll,
    setSelectionList,
    openDealWonLostModal,
    dealClosingDateData,
    isSelectionDisabled: !dataInfo.length,
    columns: selectedColumnView?.columns,
    openEditModel: () => {
      setColumnEditViewId(selectedColumnView?.id);
      openManageColumnModal();
    },
    onHandleUpdateColumns: (columns: columnsDataInterface[]) => {
      onHandleUpdateColumnData({
        columnData: {
          ...selectedColumnView,
          columns,
        },
        should_update: false,
      });
    },
    selectionList,
    onRowClickNavigateLink: `${PRIVATE_NAVIGATION.deals.view}/`,
  });

  // **
  // Here set the polling interval for api calling every EX.POLLING_INTERVAL time
  useEffect(() => {
    setTimeout(() => {
      setPollingInterval(POLLING_INTERVAL);
    }, 1000);
  }, []);

  useEffect(() => {
    getDealClosingDateSettings();
  }, []);

  useEffect(() => {
    if (initialTableView?.Deal) {
      setSelectedColumnView({
        type: 'update',
        data: initialTableView.Deal,
      });
    }
  }, [initialTableView]);

  useEffect(() => {
    if (isDealQuickAdd) {
      refreshTable();
      dispatch(setDealQuickAdd({ deal: false }));
    }
  }, [isDealQuickAdd]);

  useEffect(() => {
    if (
      selectedColumnView?.columns?.length !==
        selectedColumnViewRef.current?.columns?.length &&
      selectedColumnView?.id !== -1
    ) {
      selectedColumnViewRef.current = selectedColumnView;
      if (selectedColumnView?.columns?.length) refreshTable();
    }
  }, [selectedColumnView]);

  async function getDealData(
    params: PaginationParams = { page: 1, limit: LISTING_DATA_LIMIT }
  ) {
    const falseReturnObj = { rowData: [], rowCount: 0 }; // if view selected not found or not any selected view column return default value
    const filterObject: { [key: string]: string | boolean } = {};
    // ** current model column add request params **
    const modelSelectColumn = new Set<string>();
    (selectedColumnViewRef.current?.columns || [])?.forEach((column) => {
      /** add to select attributes */
      if (column?.includeObj) {
        _.forEach(column?.includeObj, (value, key) => {
          // ** when include relation type is belongs to then add column to select attribute
          if (column?.type === 'BelongsTo' && column?.foreignKey) {
            modelSelectColumn.add(column?.foreignKey);
          }
          filterObject[key] = value;
          if (column?.fieldName === 'associated_tags') {
            filterObject['include[associated_tags][q][model_name]'] = 'deals';
          }
        });
      } else if (column?.fieldName && column?.includeObj === undefined) {
        modelSelectColumn.add(column?.fieldName);
      }
    });

    // ** if selected view in not found any column then return **
    if (!modelSelectColumn?.size) return falseReturnObj;

    if (selectedColumnViewRef.current?.filter?.filter?.length) {
      let i = 0;
      let columnKeys: { searchKeys: string[]; isAssociated: boolean } = {
        searchKeys: [],
        isAssociated: false,
      };
      selectedColumnViewRef.current?.filter?.filter?.forEach((filter) => {
        if (filter?.filter?.length) {
          filter?.filter?.forEach((item) => {
            columnKeys = getFilterKeys(item);
            if (item?.value) {
              if (columnKeys?.isAssociated) {
                setIncludeObj({
                  item,
                  modelSelectColumn,
                  existingFilterObject: filterObject,
                });
                if (item?.columnName === 'associated_tags')
                  filterObject['include[associated_tags][q][model_name]'] =
                    'deals';
              }
              (columnKeys?.searchKeys || [])?.forEach((searchKey) => {
                filterObject[
                  `q[${
                    selectedColumnViewRef.current?.filter?.filterType || ''
                  }][${i}][${filter?.filterType || ''}][][${searchKey}][${
                    item?.type
                  }]`
                ] = item?.value;
                i++;
              });
            }
          });
        }
      });
    }
    const sortData = selectedColumnViewRef?.current?.sort?.map((data) => {
      if (data?.type === 'desc') {
        return (data?.column?.fieldName && `-${data?.column?.fieldName}`) || '';
      }
      return (data?.column?.fieldName && `${data?.column?.fieldName}`) || '';
    });

    let tableData = { rowData: [], rowCount: 0 };
    const pipeline = selectedPipeline;

    if (!pipeline?.value) {
      const data = await fetchPipeLine();
      setSelectedPipeline(data);
    }

    const IsExistClosingDateField =
      selectedColumnViewRef?.current?.columns?.some(
        (person) => person.fieldName === 'closing_date'
      );

    const { data, error } = await getLeadsAPI(
      {
        data: {
          query: {
            ...(currentDays.current
              ? { 'q[created_at][gte]': currentDays.current }
              : {}),
            select: `id,${[...modelSelectColumn]}`,
            sort: sortData?.length ? sortData.join(',') : '-id',
            ...params,
            ...filterObject,
            'q[is_deal]': true,
            ...(IsExistClosingDateField
              ? {
                  'include[active_stage_history][include][stage][select]':
                    'name,stage_type',
                }
              : {}),
          },
        },
      },
      IS_CACHING_ACTIVE
    );
    if (!error && data) {
      setTotal(data.count);
      tableData = { rowData: data.rows, rowCount: data.count };

      if (params.page === 1) {
        setDataInfo([...tableData.rowData]);
      } else {
        setDataInfo((prev) => [...prev, ...tableData.rowData]);
      }
      tableRef?.current?.setLastOpenedRecordInView();
    }

    return tableData;
  }

  const fetchPipeLine = async (isDefault?: boolean) => {
    const { data, error } = await getPipelineAPI(
      {
        params: {
          'include[stages][select]': 'id,name,stage_type',
        },
      },
      true
    );

    if (data && !error) {
      const pipelineInfo = data.rows;
      const pipelineOption = pipelineInfo.map(
        (val: {
          name?: string;
          id: number;
          stages: any;
          is_default: boolean;
        }) => ({
          label: `${val.name}`,
          value: val.id,
          stages: val.stages,
          is_default: val.is_default,
        })
      );
      setSelectedPipeline(
        isDefault ? { ...selectedPipeline } : { ...pipelineOption[0] }
      );
      const defaultPipeline = pipelineOption.filter((pipeline: any) => {
        return pipeline.is_default === true;
      });

      setPipelineOptions([...pipelineOption]);
      return defaultPipeline?.[0];
    }
  };

  const closeModal = () => {
    refreshTable();
    setOpenModal(initialOpenModalState);
    selectionRef.current = {};
    setSelectionList({});
    setIsColumnDataUpdated(!isColumnDataUpdated);
    setColumnEditViewId(-1);
  };

  const closeDealWonLostModal = () => {
    setIsOpenDealWonLostModal(false);
  };
  function openDeleteDealModal() {
    setOpenModal({
      ...initialOpenModalState,
      delete: true,
    });
  }

  function openManageColumnModal(saveAsView = false) {
    setOpenModal({
      ...initialOpenModalState,
      manageColumn: true,
      saveAsView,
    });
  }

  function openAddTagModal(id: number) {
    setOpenModal({
      ...initialOpenModalState,
      addTag: true,
    });
    setDealId(id);
  }

  function openDealWonLostModal(data: entityDataType) {
    setIsOpenDealWonLostModal(true);
    const temp: { entityData?: entityDataType; stageType?: string } = {};
    temp.entityData = data;
    setDealWonLostData(
      temp as { entityData: entityDataType; stageType: string }
    );
  }

  const onDeleteAll = async () => {
    const toastMsg =
      selectedIds.length > 1
        ? ToastMsg.deal.deleteMsg.replace('Deal', 'Deals')
        : ToastMsg.deal.deleteMsg;

    const data = await deleteLeadsAPI({
      data: { allId: selectedIds, message: toastMsg },
    });

    if (!('error' in data)) {
      setItems([]);
      setPerPage({ ...perPage, page: 1 });
      refreshTable();
      setIsCheckAll(false);
      selectionRef.current = {};
      setSelectionList({});

      closeModal();
      followingStoreRefresh({ action: 'remove', addData: { id: selectedIds } });
    }
  };

  function refreshTable() {
    tableRef.current?.refreshData();
    if (isMobileView) {
      setPerPage({ ...perPage, page: 1 });
      setItems([]);
    }
  }

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

  const filterDeals = async (value: number) => {
    const pipelineOption = pipelineOptions.filter(
      (pipeline) =>
        value === pipeline?.value && {
          ...pipeline,
          label: `${pipeline.name}`,
          value: pipeline.value,
        }
    );
    setSelectedPipeline({ ...pipelineOption[0] });
  };

  const assignTag = () => {
    getAssignedTags(dealId, setAssignedTags, assignedTags, ModuleNames.DEAL);
  };
  const removeTag = () => {
    deleteAssignedTags(dealId, setAssignedTags, assignedTags, ModuleNames.DEAL);
  };

  useEffect(() => {
    const classExist = document.body.classList.contains('active');
    const modalOpenTarget = document.getElementsByTagName('body');
    if (PRIVATE_NAVIGATION.deals.view && !classExist) {
      modalOpenTarget[0]?.classList.add('listing__page');
    }

    return () => {
      modalOpenTarget[0]?.classList.remove('listing__page');
    };
  });

  const onHandleSearch = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchText(e?.currentTarget?.value);
    debounce(onSearchChange)(e);
  };

  const onTableRowClick = (e: RowClickedEvent) => {
    if (_.isNumber(e.data?.id) && _.isNumber(e.rowIndex)) {
      dispatch(
        setEntityLastOpenRecord({
          data: {
            [ModuleNames.DEAL]: {
              dataId: e.data?.id,
              index: e.rowIndex,
            },
          },
        })
      );
    }
  };

  const getDealClosingDateSettings = async () => {
    const { data } = await getGeneralSetting(
      {
        params: {
          'q[key][in]': `${[
            'deal_closing_date_color_settings_time_frame',
            'deal_closing_date_color_settings_neutral_color',
            'deal_closing_date_color_settings_warning_color',
            'deal_closing_date_color_settings_passed_due_color',
          ]}`,
          'q[model_name]': POLYMORPHIC_MODELS.USER,
          'q[model_record_id]': currentUser?.id,
          module: ModuleNames.DEAL,
        },
      },
      true
    );

    if (data?.length) {
      const closingData = dealClosingDateDataCal(data);
      setDealClosingDateData(closingData);
      return closingData;
    }
  };

  return (
    <>
      <TableHeader
        modelName="Deal"
        collectionName="leads"
        selectedColumnView={selectedColumnView}
        setSelectedColumnView={selectColumnView}
        onHandleUpdateData={onHandleUpdateColumnData}
        onHandleSearch={onHandleSearch}
        searchValue={searchText}
        isDataUpdated={isColumnDataUpdated}
        openViewModal={() => openManageColumnModal()}
        total={total}
        isPipeLine={dealsView !== 'list'}
        pipelineOptions={pipelineOptions}
        selectedPipeline={selectedPipeline}
        onChangePipeLine={(selectedOption) => {
          if (
            selectedOption &&
            isSingleValue(selectedOption) &&
            typeof selectedOption.value === 'number'
          ) {
            filterDeals(selectedOption.value);
          }
        }}
        deletePermission={deleteDealPermission}
        selectedIds={selectedIds}
        deleteMethod={() => openDeleteDealModal()}
        dataLoading={isDeleteDealsLoading}
        dealsView={dealsView}
        setSpacing={updateSpacing}
        onSave={() => updateColumnView(selectedColumnViewRef.current)}
        onSaveAs={() => openManageColumnModal(true)}
        isViewUpdate={isViewUpdate}
      >
        <>
          <div className="action__btn__item deal__list__kanban__view inline-flex pr-[14px] mr-[14px] relative before:content-[''] before:absolute before:right-0 before:w-[1px] before:h-[20px] before:bg-[#CCCCCC] last:before:hidden last:pr-0 last:mr-0">
            <button
              className={`listView__btn duration-500 rounded-[4px] mr-[3px] relative ${
                dealsView === 'list' ? 'active' : ''
              }`}
              onClick={() => setDealsView('list')}
            >
              <span className="bg__wrapper absolute top-0 left-0 w-full h-full rounded-[4px]" />
              <div className="i__Icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.5 10C17.5 10.1658 17.4342 10.3247 17.3169 10.4419C17.1997 10.5592 17.0408 10.625 16.875 10.625H3.125C2.95924 10.625 2.80027 10.5592 2.68306 10.4419C2.56585 10.3247 2.5 10.1658 2.5 10C2.5 9.83424 2.56585 9.67527 2.68306 9.55806C2.80027 9.44085 2.95924 9.375 3.125 9.375H16.875C17.0408 9.375 17.1997 9.44085 17.3169 9.55806C17.4342 9.67527 17.5 9.83424 17.5 10ZM3.125 5.625H16.875C17.0408 5.625 17.1997 5.55915 17.3169 5.44194C17.4342 5.32473 17.5 5.16576 17.5 5C17.5 4.83424 17.4342 4.67527 17.3169 4.55806C17.1997 4.44085 17.0408 4.375 16.875 4.375H3.125C2.95924 4.375 2.80027 4.44085 2.68306 4.55806C2.56585 4.67527 2.5 4.83424 2.5 5C2.5 5.16576 2.56585 5.32473 2.68306 5.44194C2.80027 5.55915 2.95924 5.625 3.125 5.625ZM16.875 14.375H3.125C2.95924 14.375 2.80027 14.4408 2.68306 14.5581C2.56585 14.6753 2.5 14.8342 2.5 15C2.5 15.1658 2.56585 15.3247 2.68306 15.4419C2.80027 15.5592 2.95924 15.625 3.125 15.625H16.875C17.0408 15.625 17.1997 15.5592 17.3169 15.4419C17.4342 15.3247 17.5 15.1658 17.5 15C17.5 14.8342 17.4342 14.6753 17.3169 14.5581C17.1997 14.4408 17.0408 14.375 16.875 14.375Z"
                    fill="#737373"
                  />
                </svg>
              </div>
            </button>
            <button
              className={`listView__btn duration-500 rounded-[4px] relative ${
                dealsView === 'kanBan' ? 'active' : ''
              }`}
              onClick={() => {
                setDealsView('kanBan');
              }}
            >
              <span className="bg__wrapper absolute top-0 left-0 w-full h-full rounded-[4px]" />
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.875 3.75H3.125C2.95924 3.75 2.80027 3.81585 2.68306 3.93306C2.56585 4.05027 2.5 4.20924 2.5 4.375V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H6.875C7.20652 17.5 7.52446 17.3683 7.75888 17.1339C7.9933 16.8995 8.125 16.5815 8.125 16.25V12.5H11.875V13.75C11.875 14.0815 12.0067 14.3995 12.2411 14.6339C12.4755 14.8683 12.7935 15 13.125 15H16.25C16.5815 15 16.8995 14.8683 17.1339 14.6339C17.3683 14.3995 17.5 14.0815 17.5 13.75V4.375C17.5 4.20924 17.4342 4.05027 17.3169 3.93306C17.1997 3.81585 17.0408 3.75 16.875 3.75ZM6.875 16.25H3.75V10H6.875V16.25ZM6.875 8.75H3.75V5H6.875V8.75ZM11.875 11.25H8.125V5H11.875V11.25ZM16.25 13.75H13.125V10H16.25V13.75ZM16.25 8.75H13.125V5H16.25V8.75Z"
                  fill="#737373"
                />
              </svg>
            </button>
          </div>
          <AuthGuard isAccessible={createDealPermission}>
            <div className="action__btn__item inline-flex pr-[14px] mr-[14px] relative before:content-[''] before:absolute before:right-0 before:w-[1px] before:h-[20px] before:bg-[#CCCCCC] last:before:hidden last:pr-0 last:mr-0">
              <button
                className="text-[16px] font-biotif__Medium text-[#7467B7] duration-300 hover:underline"
                onClick={() => {
                  navigate(`/${PRIVATE_NAVIGATION.deals.add}`);
                }}
                disabled={getDealsLoading}
              >
                New Deal
              </button>
            </div>
          </AuthGuard>
        </>
      </TableHeader>
      <AuthGuard isAccessible={readDealPermission}>
        {dealsView === 'list' ? (
          isMobileView ? (
            <div className="ag__grid__mobile__deal">
              <CardInfiniteScroll
                perPage={perPage}
                items={items}
                isLoading={loading}
                columnData={columnDefs as ColDef[]}
                setPerPage={setPerPage}
              />
            </div>
          ) : (
            <div
              className="deal__page__ag__table ag__grid__purple__new__design"
              key={JSON.stringify(selectedColumnView.spacing)}
            >
              <TableInfiniteScroll
                setCurrentPage={setCurrentPage}
                ref={tableRef}
                rowDataLimit={LISTING_DATA_LIMIT}
                getData={(params) => getDealData(params)}
                columnData={
                  selectedColumnView?.columns?.length > 0
                    ? (columnDefs as ColDef[])
                    : []
                }
                searchColumns={['name', 'tags']}
                defaultColParams={defaultColDef}
                isLoading={getDealsLoading || getPipelineLoading}
                allowMultipleSelect
                type="deal"
                isWrapTxtUpdate={isWrapTxtUpdate}
                setIsWrapTxtUpdate={setIsWrapTxtUpdate}
                setSearchText={setSearchText}
                onHandleColumnSizeUpdate={(colId, iWidth) =>
                  onHandleUpdateColumnWidth(colId, iWidth)
                }
                onHandleColumnMoved={({ columns }: { columns: string[] }) => {
                  onHandleMoveColumnData({ columns });
                }}
                onRowClick={onTableRowClick}
                modelName={ModuleNames.DEAL}
                spacing={selectedColumnView.spacing}
              />
            </div>
          )
        ) : (
          <DealKanBanView
            pipeline={selectedPipeline}
            isDealsUpdate={isDealsUpdate}
            setIsDealsUpdate={setIsDealsUpdate}
          />
        )}
      </AuthGuard>
      {/* delete deal modal */}
      <AuthGuard isAccessible={deleteDealPermission}>
        <DeleteModal
          closeModal={closeModal}
          isOpen={openModal.delete}
          isLoading={isDeleteDealsLoading}
          deleteOnSubmit={() => onDeleteAll()}
          moduleName={selectedIds.length > 1 ? 'these deals' : 'this deal'}
        />
      </AuthGuard>

      {/* add deal won lost modal */}
      {isOpenDealWonLostModal && (
        <AddDealWonLostModal
          isOpen={isOpenDealWonLostModal}
          closeModal={closeDealWonLostModal}
          dealWonLostData={
            dealWonLostData as {
              entityData?: entityDataType;
              stageType: string;
            }
          }
        />
      )}
      {openModal.manageColumn && (
        <ColumnManageModal
          modelName="Deal"
          collectionName="leads"
          closeModal={closeModal}
          editColumnViewID={editColumnViewId}
          saveAsViewData={selectedColumnViewRef.current}
          isSaveAsAction={openModal.saveAsView}
        />
      )}

      {openModal.addTag === true && (
        <AuthGuard isAccessible={tagForDealPermission}>
          <AssignTagModal
            closeModal={closeModal}
            isOpen={openModal.addTag}
            modelRecordId={dealId}
            assignedTags={assignedTags}
            setAssignedTags={setAssignedTags}
            modelName={ModuleNames.DEAL}
            getAssignedTags={assignTag}
            deleteAssignedTag={async () => removeTag()}
            editTagsPermission={tagForDealPermission}
          />
        </AuthGuard>
      )}
    </>
  );
};

export default Deals;
