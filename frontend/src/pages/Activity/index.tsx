/* eslint-disable @typescript-eslint/no-unused-vars */
// ** Import Packages ** //
import {
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ColDef, RowClickedEvent } from 'ag-grid-community';
import _ from 'lodash';

// ** Redux ** //
import {
  getEntityTableView,
  getIsActivityQuickAdd,
  setActivityQuickAdd,
  setEntityLastOpenRecord,
} from 'redux/slices/commonSlice';

// ** Components ** //
import DeleteModal from 'components/DeleteComponents/DeleteModal';
import TableInfiniteScroll, {
  agGridSelectedProps,
  AgGridTableRef,
  PaginationParams,
} from 'components/TableInfiniteScroll';
import CardInfiniteScroll from 'components/TableInfiniteScroll/CardInfiniteScroll';
import AuthGuard from 'pages/auth/components/AuthGuard';
import AddActivityModal from './components/Modal/AddActivityModal';
import EditActivityModal from './components/Modal/EditActivityModal';
import MarkAsDoneModal from './components/Modal/MarkAsDoneModal';

// ** Hooks ** //
import useSelectAll from 'hooks/selectAll';
import useInfiniteScrollInfo from 'hooks/useInfiniteScrollInfo';
import useWindowDimensions from 'hooks/useWindowDimensions';
import useActivityColumns from './hooks/useActivityColumns';

// ** Constants ** //
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import {
  BasicPermissionTypes,
  ModuleNames,
} from 'constant/permissions.constant';

// ** Other ** //
import { debounce } from 'utils/util';
import DashboardActivityDetailView from 'pages/Dashboard/components/DashboardActivityDetailView';
import useFollowFollowing from 'components/EntityDetails/FollowFollowing/useFollowFollowing';
import { ActivityModalName } from './types/activity.types';
import {
  useChangeActivityStatusByIdMutation,
  useDeleteActivityMutation,
  useLazyGetActivitiesAdvanceQuery,
  useUpdateActivityMutation,
} from 'redux/api/activityApi';
import {
  LISTING_DATA_LIMIT,
  POLLING_INTERVAL,
} from 'constant/dataLimit.constant';
import {
  columnsDataInterface,
  columnViewInterface,
} from 'components/ColumnViewListDropDown';
import useTableHeaderService from 'components/TableHeader/useTableHeaderService';
import TableHeader from 'components/TableHeader';
import ColumnManageModal from 'components/ColumnManageModal';
import usePermission from 'hooks/usePermission';
import Button from 'components/Button';
import AssignTagModal from 'components/detail-components/AssignTags/AssignTagModal';
import { AssignTagsProps } from 'components/EntityDetails/types';
import useTagListView from 'pages/TagMangement/useTagMangement';
import { tag } from 'components/detail-components/AssignTags/types/assignTags.type';

export const initialActivityOpenModalState = {
  add: false,
  edit: false,
  complete: false,
  addTag: false,
  delete: false,
  activityId: undefined,
  activityTypeId: undefined,
  view: false,
  doneApiCall: true,
  manageColumn: false,
  saveAsView: false,
};

const defaultSearchColumn = ['topic'];

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
  convert: false,
  delete: false,
  add: false,
  activity: false,
  addTag: false,
  entityData: undefined,
  relatedEntityData: undefined,
  manageColumn: false,
  saveAsView: false,
};
const Activities = () => {
  // ** Hooks **
  const currentDays = useRef<string>();
  const tableRef = useRef<AgGridTableRef>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const selectedColumnViewRef = useRef<columnViewInterface>();
  const isActivityQuickAdd = useSelector(getIsActivityQuickAdd);
  const dispatch = useDispatch();
  const initialTableView = useSelector(getEntityTableView);

  // ** States **
  const [pollingInterval, setPollingInterval] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState<ActivityModalName>(
    initialActivityOpenModalState
  );
  const [total, setTotal] = useState(0);
  const [isColumnDataUpdated, setIsColumnDataUpdated] = useState(false);
  const [, setSpacing] = useState<{ height: number; class: string }>({
    height: 60,
    class: 'normal',
  });
  const [dataInfo, setDataInfo] = useState<agGridSelectedProps>([]);
  const [activityId, setActivityId] = useState<number>();
  const [filterData, setFilterData] = useState<{
    activityTypeFilterData: string[];
    activityDateFilterData: {
      start_date: Date | undefined;
      end_date: Date | undefined;
    };
    completed: boolean;
    all: boolean;
  }>({
    activityTypeFilterData: [],
    activityDateFilterData: { start_date: undefined, end_date: undefined },
    completed: false,
    all: true,
  });
  const [assignedTags, setAssignedTags] = useState<AssignTagsProps>({
    list: [],
    total: 0,
  });
  const [searchData, setSearchData] = useState<{
    searchText: string;
    searchFields: string;
  }>({ searchText: '', searchFields: '' });
  const [searchText, setSearchText] = useState<string>('');
  const [searchColumns, setSearchColumn] =
    useState<string[]>(defaultSearchColumn);

  // ** Custom Reducer **
  const [selectedColumnView, setSelectedColumnView] = useReducer(
    customReducer,
    initialTableView?.Activity || {
      id: -1,
      model_name: '',
      name: '',
      organization_id: -1,
      is_system: false,
      filter: {},
      columns: [],
      sort: [],
      visibility: 'public',
    }
  );

  // ** APIS **
  const [deleteActivitiesAPI, { isLoading: deleteActivitiesLoading }] =
    useDeleteActivityMutation();
  const [changeActivityStatusByIdAPI] = useChangeActivityStatusByIdMutation();
  const [updateActivityByIdAPI] = useUpdateActivityMutation();

  // ** Custom Hooks **
  const { isMobileView } = useWindowDimensions();
  const {
    isCheckAll,
    isCheckAllRef,
    setSelectionList,
    selectionRef,
    setIsCheckAll,
    selectionList,
    selectedIds,
  } = useSelectAll({ data: dataInfo });
  const { getActivitiesLoading, getActivityData } = useGetActivityHook({
    currentDays,
    setDataInfo,
    currentPage,
    pollingInterval,
    tableRef,
    setTotal,
    selectedColumnViewRef,
    setSearchColumn,
  });
  const { loading, perPage, items, setPerPage, setItems } =
    useInfiniteScrollInfo({
      getData: getActivityData,
      searchData,
    });
  const { followingStoreRefresh } = useFollowFollowing({
    moduleName: ModuleNames.ACTIVITY,
  });
  const { getAssignedTags, deleteAssignedTags } = useTagListView();

  // Here set the polling interval for api calling every EX.POLLING_INTERVAL time
  useEffect(() => {
    setTimeout(() => {
      setPollingInterval(POLLING_INTERVAL);
    }, 1000);
  }, []);

  useEffect(() => {
    if (isActivityQuickAdd) {
      refreshTable();
      dispatch(setActivityQuickAdd({ activity: false }));
    }
  }, [isActivityQuickAdd]);

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

  useEffect(() => {
    const classExist = document.body.classList.contains('active');
    const modalOpenTarget = document.getElementsByTagName('body');
    if (PRIVATE_NAVIGATION.activities.view && !classExist) {
      modalOpenTarget[0]?.classList.add('listing__page');
    }

    return () => {
      modalOpenTarget[0]?.classList.remove('listing__page');
    };
  });

  async function changeActivityStatus(id: number, is_active: boolean) {
    const data = await changeActivityStatusByIdAPI({ id, data: { is_active } });
    if (!('error' in data)) {
      refreshTable();
    }
  }

  async function reOpenActivity(id: number) {
    const data = await updateActivityByIdAPI({
      id,
      data: {
        completed: false,
      },
    });
    if (!('error' in data)) {
      refreshTable();
    }
  }

  const closeModal = (data?: any) => {
    modalRef.current?.style.removeProperty('display');

    if (data) {
      setOpenModal({
        ...initialActivityOpenModalState,
        activityId: data?.id,
        activityTypeId: data?.activity_type?.id,
        activityTopic: data?.topic,
        view: !openModal?.edit,
      });
    } else if (openModal.edit) {
      setOpenModal({
        ...initialActivityOpenModalState,
        activityId: data?.id || openModal.activityId,
        activityTypeId: data?.activity_type?.id || openModal?.activityTypeId,
        activityTopic: data?.topic || openModal?.activityTopic,
        view: !openModal?.edit,
      });
    } else {
      setOpenModal(initialActivityOpenModalState);
    }

    selectionRef.current = {};
    setSelectionList({});
  };

  const onDeleteAll = async () => {
    const data = await deleteActivitiesAPI({
      data: { allId: selectedIds },
    });
    if ('data' in data || !('error' in data)) {
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

  const refreshTable = () => {
    tableRef.current?.refreshData();
    if (isMobileView) {
      setPerPage({ ...perPage, page: 1 });
      setItems([]);
    }
  };

  const modalOpen = (openModalValue: { [key: string]: boolean }) => {
    setOpenModal({
      ...initialActivityOpenModalState,
      ...openModalValue,
    });
  };

  const {
    onHandleMoveColumnData,
    onHandleUpdateColumnData,
    onHandleUpdateColumnWidth,
    editColumnViewId,
    selectColumnView,
    updateColumnView,
    isViewUpdate,
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
    openManageColumnModal: () => modalOpen({ manageColumn: true }),
    setSpacing,
  });

  const { columnDefs, defaultColDef } = useActivityColumns({
    selectionRef,
    isCheckAllRef,
    setIsCheckAll,
    disabled: getActivitiesLoading,
    isCheckAll,
    setSelectionList,
    openAddTagModal,
    setIsWrapTxtUpdate,
    isSortable: dataInfo?.length > 1,
    isSelectionDisabled: !dataInfo.length,
    columns: selectedColumnView?.columns,
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
    onRowClickNavigateLink: `${PRIVATE_NAVIGATION.activities.view}/`,
    changeActivityStatus,
    reOpenActivity,
    setOpenModal,
  });

  const assignTag = () => {
    getAssignedTags(
      activityId || 0,
      setAssignedTags,
      assignedTags,
      ModuleNames.ACTIVITY
    );
  };
  const removeTag = () => {
    deleteAssignedTags(
      activityId || 0,
      setAssignedTags,
      assignedTags,
      ModuleNames.LEAD
    );
  };

  function openAddTagModal(id: number) {
    setOpenModal({
      ...initialActivityOpenModalState,
      addTag: true,
    });
    setActivityId(id);
  }
  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    tableRef.current?.onChange?.(e);

    if (isMobileView) {
      setSearchData({
        ...searchData,
        searchText: e.target?.value.trim(),
        searchFields: 'topic',
      });
    }
  };

  const onHandleSearch = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchText(e?.currentTarget?.value);
    debounce(onSearchChange)(e);
  };

  // const setDropdownState = (key: 'isOpen' | 'isTypeOpen' | 'isStateOpen') => {
  //   setFilterToggleState((prev) => ({ ...prev, [key]: !prev[key] }));
  // };

  const onTableRowClick = (e: RowClickedEvent) => {
    if (_.isNumber(e.data?.id) && _.isNumber(e.rowIndex)) {
      dispatch(
        setEntityLastOpenRecord({
          data: {
            [ModuleNames.ACTIVITY]: {
              dataId: e.data?.id,
              index: e.rowIndex,
            },
          },
        })
      );
    }
  };

  return (
    <>
      {/** Header Start */}
      <TableHeader
        modelName="Activity"
        collectionName="activities"
        selectedColumnView={selectedColumnView}
        setSelectedColumnView={selectColumnView}
        onHandleUpdateData={onHandleUpdateColumnData}
        onHandleSearch={onHandleSearch}
        searchValue={searchText}
        isDataUpdated={isColumnDataUpdated}
        openViewModal={() => modalOpen({ manageColumn: true })}
        total={total}
        setSpacing={updateSpacing}
        onSave={() => updateColumnView(selectedColumnViewRef.current)}
        onSaveAs={() => modalOpen({ manageColumn: true, saveAsView: true })}
        isViewUpdate={isViewUpdate}
      >
        <AuthGuard
          permissions={[
            {
              module: ModuleNames.ACTIVITY,
              type: BasicPermissionTypes.CREATE,
            },
          ]}
        >
          <div className="action__btn__item inline-flex pr-[14px] mr-[14px] relative before:content-[''] before:absolute before:right-0 before:w-[1px] before:h-[20px] before:bg-[#CCCCCC] last:before:hidden last:pr-0 last:mr-0">
            <button
              onClick={() => modalOpen({ add: true })}
              className="text-[16px] font-biotif__Medium text-[#7467B7] duration-300 hover:underline"
              disabled={getActivitiesLoading || deleteActivitiesLoading}
            >
              New Activity
            </button>
          </div>
        </AuthGuard>
        <AuthGuard
          permissions={[
            {
              module: ModuleNames.ACTIVITY,
              type: BasicPermissionTypes.DELETE,
            },
          ]}
        >
          {selectedIds.length ? (
            <div className="action__btn__item inline-flex pr-[14px] mr-[14px] relative before:content-[''] before:absolute before:right-0 before:w-[1px] before:h-[20px] before:bg-[#CCCCCC] last:before:hidden last:pr-0 last:mr-0">
              <button
                onClick={() => modalOpen({ delete: true })}
                className="text-[16px] font-biotif__Medium text-[#7467B7] duration-300 hover:underline"
                disabled={deleteActivitiesLoading}
              >
                Delete {selectedIds.length > 1 ? 'Activities' : 'Activity'}
              </button>
            </div>
          ) : (
            <></>
          )}
        </AuthGuard>
      </TableHeader>
      {/** Header End */}

      {/** Table */}
      <AuthGuard
        permissions={[
          { module: ModuleNames.ACTIVITY, type: BasicPermissionTypes.READ },
        ]}
      >
        {isMobileView ? (
          <div className="ag__grid__mobile__activity">
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
            className="activity__page__ag__table ag__grid__purple__new__design"
            key={JSON.stringify(selectedColumnView.spacing)}
          >
            <TableInfiniteScroll
              // key={`${selectedColumnView?.id}_activity_listing`}
              setCurrentPage={setCurrentPage}
              // {...(readPermission && {
              //   onRowClickNavigateLink: `${PRIVATE_NAVIGATION.activities.view}/`,
              // })}
              ref={tableRef}
              rowDataLimit={LISTING_DATA_LIMIT}
              getData={(params) => getActivityData(params)}
              columnData={
                selectedColumnView?.columns?.length > 0
                  ? (columnDefs as ColDef[])
                  : []
              }
              searchColumns={searchColumns}
              defaultColParams={defaultColDef}
              isLoading={getActivitiesLoading}
              allowMultipleSelect
              type="activity"
              isWrapTxtUpdate={isWrapTxtUpdate}
              setIsWrapTxtUpdate={setIsWrapTxtUpdate}
              setSearchText={setSearchText}
              onRowClick={onTableRowClick}
              onHandleColumnSizeUpdate={onHandleUpdateColumnWidth}
              onHandleColumnMoved={onHandleMoveColumnData}
              modelName={ModuleNames.ACTIVITY}
              spacing={selectedColumnView.spacing}
            />
          </div>
        )}
      </AuthGuard>

      {/* Modal */}
      <ActivityAllModal
        closeModal={closeModal}
        activityId={activityId || 0}
        assignedTags={assignedTags}
        setAssignedTags={setAssignedTags}
        assignTag={assignTag}
        deleteAssignedTag={async () => removeTag()}
        deleteActivitiesLoading={deleteActivitiesLoading}
        onDeleteAll={onDeleteAll}
        removeTag={removeTag}
        openModal={openModal}
        refreshTable={refreshTable}
        selectedIds={selectedIds}
        setDataInfo={setDataInfo}
        modalRef={modalRef}
      />

      {openModal.manageColumn && (
        <ColumnManageModal
          modelName="Activity"
          collectionName="activities"
          closeModal={closeModal}
          editColumnViewID={editColumnViewId}
          saveAsViewData={selectedColumnViewRef.current}
          isSaveAsAction={openModal.saveAsView}
        />
      )}
    </>
  );
};

export default Activities;

type UseGetActivityHookProps = {
  currentDays: MutableRefObject<string | undefined>;
  setIsCheckAll?: React.Dispatch<React.SetStateAction<boolean>>;
  setDataInfo: Dispatch<SetStateAction<agGridSelectedProps>>;
  currentPage: number;
  pollingInterval: number;
  tableRef: RefObject<AgGridTableRef>;
  setTotal: Dispatch<SetStateAction<number>>;
  selectedColumnViewRef: MutableRefObject<columnViewInterface | undefined>;
  setSearchColumn: Dispatch<SetStateAction<string[]>>;
};

const useGetActivityHook = (props: UseGetActivityHookProps) => {
  const {
    currentDays,
    setDataInfo,
    currentPage,
    pollingInterval,
    tableRef,
    setTotal,
    selectedColumnViewRef,
  } = props;

  // ** APIS **
  const [getActivitiesAPI, { isLoading: getActivitiesLoading }] =
    useLazyGetActivitiesAdvanceQuery({
      pollingInterval: currentPage === 1 ? pollingInterval : 0,
    });

  async function getActivityData(
    params: PaginationParams = { page: 1, limit: LISTING_DATA_LIMIT }
  ) {
    const falseReturnObj = { rowData: [], rowCount: 0 }; // if view selected not found or not any selected view column return default value

    if (selectedColumnViewRef.current === undefined) return falseReturnObj;

    // ** current selected view data **
    const {
      columns = [],
      filter = {},
      sort = [],
    } = selectedColumnViewRef.current;

    // ** Filters **
    const queryFilterParams: { [key: string]: string | boolean } = {};

    // ** current model column add request params **
    const modelSelectColumn: string[] = [
      'is_active',
      'activity_type_id',
      'video_call_link',
      'completed_by',
      'activity_type_name',
    ];
    columns?.forEach((column) => {
      /** add to select attributes */
      if (column?.includeObj) {
        _.forEach(column?.includeObj, (value, key) => {
          // ** when include relation type is belongs to then add column to select attribute
          if (column?.type === 'BelongsTo' && column?.foreignKey)
            modelSelectColumn.push(column?.foreignKey);
          queryFilterParams[key] = value;
        });
      } else if (column?.fieldName && column?.includeObj === undefined) {
        modelSelectColumn.push(column?.fieldName);
      }
    });

    // ** if selected view in not found any column then return **
    if (!modelSelectColumn?.length) return falseReturnObj;

    // ** filter add to request params **
    if (filter?.filter?.length) {
      let i = 0;
      filter?.filter?.forEach((filterItem) => {
        if (filterItem?.filter?.length) {
          filterItem?.filter?.forEach((item) => {
            if (item?.value) {
              if (item?.type === 'iLike') {
                const isAssociateTableColumn = columns.find((column) => column);
              }
              // } else {
              queryFilterParams[
                `q[${filter?.filterType || ''}][${i}][${(
                  filterItem?.filterType || ''
                )?.trim()}][][${item?.columnName}][${item?.type}]`
              ] = item?.value;
              // }
              i++;
            }
          });
        }
      });
    }

    // ** sorting column data **
    const sortData = sort?.map((data) => {
      const { includeObj, type, foreignKey, fieldName, searchKeys } =
        data?.column || {};

      if (includeObj) {
        _.forEach(includeObj, (value, key) => {
          // ** when include relation type is belongs to then add column to select attribute
          if (
            type === 'BelongsTo' &&
            foreignKey &&
            !modelSelectColumn.includes(foreignKey)
          )
            modelSelectColumn.push(foreignKey);

          queryFilterParams[key] = value;
        });

        return `${data?.type === 'desc' ? '-' : ''}${
          (searchKeys && searchKeys[0]) || fieldName
        }`;
      }

      return (
        (fieldName && `${data?.type === 'desc' ? '-' : ''}${fieldName}`) || ''
      );
    });

    // ** API Call **
    const { data, error } = await getActivitiesAPI(
      {
        data: {
          query: {
            ...(currentDays.current
              ? { 'q[created_at][gte]': currentDays.current }
              : {}),
            select: `id,${[..._.uniq(modelSelectColumn)]?.toString()}`,
            sort: sortData?.length ? sortData.join(',') : '-id',
            ...params,
            ...queryFilterParams,
            // 'include[host][select]': 'id,username,first_name,last_name',
            // 'include[associated_tags][select]': 'tag_id',
            // 'include[associated_tags][include][tag][select]': 'name',
            // 'include[associated_tags][q][model_name]': 'activities',
            // 'include[activity_time_logs]': 'all',
            // 'include[users][select]': 'id,first_name',
            // 'include[activity_account][select]': 'id,name',
            // 'include[activity_contact][select]': 'id,name',
            // 'include[activity_type][select]': 'icon,icon_type,name,id,color',
            // 'include[activity_participants]': 'all',
            // 'include[activity_participants][q][is_deleted]': false,
            tableName: 'Activity',
          },
        },
      },
      true
    );

    let tableData = { rowData: [], rowCount: 0 };

    if (!error && data) {
      tableData = { rowData: data.rows, rowCount: data.count };
      if (params.page === 1) {
        setDataInfo([...tableData.rowData]);
      } else {
        setDataInfo((prev) => [...prev, ...tableData.rowData]);
      }
      tableRef?.current?.setLastOpenedRecordInView();
      setTotal(data?.count);
    }

    return tableData;
  }

  return {
    getActivityData,
    getActivitiesLoading,
  };
};

type ActivityAllModalPropsType = {
  openModal: ActivityModalName;
  closeModal: (data?: any) => void;
  activityId: number;
  assignedTags: AssignTagsProps;
  setAssignedTags: React.Dispatch<React.SetStateAction<AssignTagsProps>>;
  refreshTable: () => void;
  assignTag: () => void;
  setDataInfo: Dispatch<SetStateAction<agGridSelectedProps>>;
  deleteActivitiesLoading: boolean;
  onDeleteAll: () => Promise<void>;
  selectedIds: number[];
  deleteAssignedTag: (
    deleteId: number,
    tagDetail?: tag | undefined
  ) => Promise<void>;
  modalRef: React.RefObject<HTMLDivElement>;
  removeTag: () => void;
};

const ActivityAllModal = (props: ActivityAllModalPropsType) => {
  const {
    openModal,
    closeModal,
    refreshTable,
    setDataInfo,
    deleteActivitiesLoading,
    onDeleteAll,
    selectedIds,
    activityId,
    assignedTags,
    setAssignedTags,
    assignTag,
    deleteAssignedTag,
    modalRef,
    removeTag,
  } = props;

  const {
    createActivityPermission,
    updateActivityPermission,
    deleteActivityPermission,
    readActivityPermission,
    tagForLeadPermission,
  } = usePermission();

  return (
    <>
      {/* add activity modal */}
      {openModal.add && (
        <AuthGuard isAccessible={createActivityPermission}>
          <AddActivityModal
            isOpen={openModal.add}
            onAdd={() => {
              refreshTable();
              setDataInfo([]);
            }}
            closeModal={closeModal}
          />
        </AuthGuard>
      )}

      {openModal.edit && openModal.activityId && (
        <AuthGuard isAccessible={updateActivityPermission}>
          <EditActivityModal
            id={openModal.activityId}
            isOpen={openModal.edit}
            onEdit={refreshTable}
            closeModal={closeModal}
          />
        </AuthGuard>
      )}

      {/* delete activity modal */}
      {openModal.delete && (
        <AuthGuard isAccessible={deleteActivityPermission}>
          <DeleteModal
            isOpen={openModal.delete}
            closeModal={closeModal}
            isLoading={deleteActivitiesLoading}
            deleteOnSubmit={() => onDeleteAll()}
            moduleName={
              selectedIds.length > 1 ? 'these activities' : 'this activity'
            }
          />
        </AuthGuard>
      )}
      {/* mark as done Modal */}
      {openModal.complete && openModal.activityId && (
        <AuthGuard isAccessible={updateActivityPermission}>
          <MarkAsDoneModal
            isOpen={openModal.complete}
            closeModal={closeModal}
            onAdd={refreshTable}
            activityId={openModal.activityId}
            activityTypeId={openModal.activityTypeId}
          />
        </AuthGuard>
      )}

      {/* View Modal In Activity */}
      {openModal.view && openModal?.activityId && (
        <AuthGuard isAccessible={readActivityPermission}>
          <DashboardActivityDetailView
            onEdit={refreshTable}
            isOpen={openModal.view}
            activityId={openModal.activityId}
            activityTopic={openModal.activityTopic || ''}
            closeModalForDashboard={() => {
              if (modalRef.current) {
                modalRef.current.style.display = 'none';
              }
            }}
            modalRef={modalRef}
            closeViewModal={(activityDetail?: any) =>
              closeModal(activityDetail)
            }
          />
        </AuthGuard>
      )}
      {openModal.addTag === true && (
        <AuthGuard isAccessible={tagForLeadPermission}>
          <AssignTagModal
            closeModal={() => {
              closeModal();
              refreshTable();
            }}
            refreshTable={refreshTable}
            isOpen={openModal.addTag}
            modelRecordId={activityId}
            assignedTags={assignedTags}
            setAssignedTags={setAssignedTags}
            modelName={ModuleNames.ACTIVITY}
            getAssignedTags={assignTag}
            deleteAssignedTag={async () => removeTag()}
            editTagsPermission={tagForLeadPermission}
          />
        </AuthGuard>
      )}
    </>
  );
};
