// ** Import Packages **
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ColDef, RowClickedEvent } from 'ag-grid-community';
import _ from 'lodash';

// ** redux **
import {
  getEntityTableView,
  getIsLeadQuickAdd,
  setEntityLastOpenRecord,
  setLeadQuickAdd,
} from 'redux/slices/commonSlice';

// ** Components **
import DeleteModal from 'components/DeleteComponents/DeleteModal';
import TableInfiniteScroll, {
  AgGridTableRef,
  PaginationParams,
  agGridSelectedProps,
} from 'components/TableInfiniteScroll';
import CardInfiniteScroll from 'components/TableInfiniteScroll/CardInfiniteScroll';
import AuthGuard from 'pages/auth/components/AuthGuard';

// ** Hooks **
import useInfiniteScrollInfo from 'hooks/useInfiniteScrollInfo';
import usePermission from 'hooks/usePermission';
import useWindowDimensions from 'hooks/useWindowDimensions';
import useLeadColumns from 'pages/Lead/hooks/useLeadColumns';
import useSelectAll from '../../hooks/selectAll';

// ** constants **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { MODULE_PERMISSION, ModuleNames } from 'constant/permissions.constant';
import { ToastMsg } from 'constant/toast.constants';

// ** Other **
import { debounce } from 'utils/util';
import useFollowFollowing from 'components/EntityDetails/FollowFollowing/useFollowFollowing';
import {
  LISTING_DATA_LIMIT,
  POLLING_INTERVAL,
} from 'constant/dataLimit.constant';
import {
  useDeleteLeadMutation,
  useLazyGetLeadsAdvanceQuery,
} from 'redux/api/leadApi';
import {
  columnViewInterface,
  columnsDataInterface,
} from 'components/ColumnViewListDropDown';
import {
  getFilterKeys,
  setIncludeObj,
} from 'components/TableHeader/helpers/columnTypeManage';
import ColumnManageModal from 'components/ColumnManageModal';
import TableHeader from 'components/TableHeader';
import { IS_CACHING_ACTIVE } from 'constant';
import { useLazyGetLeadTempStatusQuery } from 'redux/api/leadTempStatusApi';
import { EntityAttributesEnum } from 'redux/api/entityAttributesApi';
import { GraphDataType, LeadDetailsType } from './types/lead.type';
import useTagListView from 'pages/TagMangement/useTagMangement';
import { AssignTagsProps } from 'components/EntityDetails/types';
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

const Leads = () => {
  // ** hooks **
  const tableRef = useRef<AgGridTableRef>(null);
  const isQuickLeadAdd = useSelector(getIsLeadQuickAdd);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialTableView = useSelector(getEntityTableView);

  // ** States **
  const [pollingInterval, setPollingInterval] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState<{
    add: boolean;
    delete: boolean;
    convert: boolean;
    addTag: boolean;
    manageColumn: boolean;
    saveAsView: boolean;
  }>(initialOpenModalState);

  const [leadData, setLeadData] = useState<agGridSelectedProps>([]);
  const [total, setTotal] = useState(0);
  const [days] = useState<string>();
  const [searchData, setSearchData] = useState<{
    searchText: string;
    searchFields: string;
  }>({
    searchText: '',
    searchFields: '',
  });
  const [searchText, setSearchText] = useState<string>('');
  const [isColumnDataUpdated, setIsColumnDataUpdated] = useState(false);
  const [, setSpacing] = useState<{ height: number; class: string }>({
    height: 60,
    class: 'normal',
  });
  const [leadStatusOpt, setLeadStatusOpt] = useState<GraphDataType[]>([]);
  const [assignedTags, setAssignedTags] = useState<AssignTagsProps>({
    list: [],
    total: 0,
  });
  const [leadId, setLeadId] = useState(-1);

  // ** Ref **
  const currentDays = useRef<string>();
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

  // ** APIS **
  const [deleteLeadsAPI, { isLoading: deleteLeadsLoading }] =
    useDeleteLeadMutation();
  const [getLeadsAPI, { isLoading: getLeadsLoading }] =
    useLazyGetLeadsAdvanceQuery({
      pollingInterval: currentPage === 1 ? pollingInterval : 0,
    });

  const [getLeadTempStatusApi] = useLazyGetLeadTempStatusQuery();

  // ** Custom Hooks **
  const { width } = useWindowDimensions();
  const {
    readLeadPermission,
    createLeadPermission,
    deleteLeadPermission,
    tagForLeadPermission,
  } = usePermission();
  const { followingStoreRefresh } = useFollowFollowing({
    moduleName: ModuleNames.LEAD,
  });

  const { loading, perPage, items, setPerPage, setItems } =
    useInfiniteScrollInfo({
      getData: getLeadData,
      searchData,
    });

  const {
    disabled,
    setDisabled,
    isCheckAll,
    isCheckAllRef,
    setSelectionList,
    selectionRef,
    setIsCheckAll,
    selectedIds,
    clearSelectAll,
    selectionList,
  } = useSelectAll({ data: leadData });
  const { getAssignedTags, deleteAssignedTags } = useTagListView();

  const {
    onHandleMoveColumnData,
    onHandleUpdateColumnData,
    onHandleUpdateColumnWidth,
    updateColumnView,
    isViewUpdate,
    setIsWrapTxtUpdate,
    isWrapTxtUpdate,
    selectColumnView,
    editColumnViewId,
    setColumnEditViewId,
    updateSpacing,
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

    const { columnDefs, defaultColDef } = useLeadColumns({
      selectionRef,
      isCheckAllRef,
      setIsCheckAll,
      disabled,
      leadStatusOpt,
      openAddTagModal,
      isCheckAll,
      getLeadsLoading,
      setSelectionList,
      setIsWrapTxtUpdate,
      isSelectionDisabled: !leadData.length,
      columns: selectedColumnView?.columns || [],
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
      onRowClickNavigateLink: `${PRIVATE_NAVIGATION.leads.view}/`,
    });

  // Here set the polling interval for api calling every EX.POLLING_INTERVAL time
  useEffect(() => {
    setTimeout(() => {
      setPollingInterval(POLLING_INTERVAL);
    }, 1000);
  }, []);

  useEffect(() => {
    if (initialTableView?.Lead) {
      setSelectedColumnView({
        type: 'update',
        data: initialTableView.Lead,
      });
    }
  }, [initialTableView]);

  // ** useEffect **
  useEffect(() => {
    if (isQuickLeadAdd) {
      refreshTable();
      dispatch(setLeadQuickAdd({ lead: false }));
    }
  }, [isQuickLeadAdd]);

  useEffect(() => {
    currentDays.current = days;
    refreshTable();
  }, [days]);

  useEffect(() => {
    getData();
  }, []);

  // Lead Temperature Data

  const getData = async () => {
    const { data, error } = await getLeadTempStatusApi({
      data: {
        query: {
          ...MODULE_PERMISSION.LEAD.read,
          'q[type]': EntityAttributesEnum.LEAD_TEMP_STATUS,
        },
      },
    });

    if (data && !error) {
      const options = data?.rows?.map((option: LeadDetailsType) => ({
        label: option.name,
        value: option.id,
        color: option.color,
      }));
      setLeadStatusOpt([...options]);
    }
  };

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
    if (PRIVATE_NAVIGATION.leads.view && !classExist) {
      modalOpenTarget[0]?.classList.add('listing__page');
    }

    return () => {
      modalOpenTarget[0]?.classList.remove('listing__page');
    };
  });

  async function getLeadData(
    params: PaginationParams = { page: 1, limit: LISTING_DATA_LIMIT }
  ) {
    setDisabled(true);
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
            filterObject['include[associated_tags][q][model_name]'] = 'leads';
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
                    'leads';
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

    const { data, error } = await getLeadsAPI(
      {
        data: {
          query: {
            ...(currentDays.current
              ? { 'q[created_at][gte]': currentDays.current }
              : {}),
            ...params,
            ...filterObject,
            select: `id,${[...modelSelectColumn]}`,
            sort: sortData?.length ? sortData.join(',') : '-id',
            'q[is_deal]': false,
          },
        },
      },
      IS_CACHING_ACTIVE
    );
    let tableData = { rowData: [], rowCount: 0 };

    if (data && !error) {
      setTotal(data.count);
      tableData = { rowData: data.rows, rowCount: data.count };
      if (params.page === 1) {
        setLeadData([...tableData.rowData]);
      } else {
        setLeadData((prev) => [...prev, ...tableData.rowData]);
      }
      setDisabled(false);
      tableRef?.current?.setLastOpenedRecordInView();
    }
    return tableData;
  }

  function openAddTagModal(id: number) {
    setOpenModal({
      ...initialOpenModalState,
      addTag: true,
    });
    setLeadId(id);
  }
  const closeModal = () => {
    refreshTable();
    setOpenModal(initialOpenModalState);
    selectionRef.current = {};
    setSelectionList({});
    setIsColumnDataUpdated(!isColumnDataUpdated);
    setColumnEditViewId(-1);
  };

  const assignTag = () => {
    getAssignedTags(leadId, setAssignedTags, assignedTags, ModuleNames.LEAD);
  };
  const removeTag = () => {
    deleteAssignedTags(leadId, setAssignedTags, assignedTags, ModuleNames.LEAD);
  };

  function openDeleteLeadsModal() {
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

  const onDeleteAll = async () => {
    const toastMsg =
      selectedIds.length > 1
        ? ToastMsg.lead.deleteMsg.replace('Lead', 'Leads')
        : ToastMsg.lead.deleteMsg;

    const data = await deleteLeadsAPI({
      data: { allId: selectedIds, message: toastMsg },
    });
    if (!('error' in data)) {
      setItems([]);
      setPerPage({ ...perPage, page: 1 });
      refreshTable();
      closeModal();
      setIsCheckAll(false);
      selectionRef.current = {};
      setSelectionList({});
      followingStoreRefresh({ action: 'remove', addData: { id: selectedIds } });
    }
  };

  function refreshTable() {
    clearSelectAll();
    tableRef.current?.refreshData();
    if (width < 576) {
      setPerPage({
        ...perPage,
        page: 1,
      });
      setItems([]);
    }
  }

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    tableRef.current?.onChange?.(e);
    if (width < 576) {
      setSearchData({
        ...searchData,
        searchText: e.target?.value.trim(),
        searchFields: 'name',
      });
    }
  };

  const onHandleSearch = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchText(e?.currentTarget?.value);
    debounce(onSearchChange)(e);
  };

  const onTableRowClick = (e: RowClickedEvent) => {
    if (_.isNumber(e.data?.id) && _.isNumber(e.rowIndex)) {
      dispatch(
        setEntityLastOpenRecord({
          data: {
            [ModuleNames.LEAD]: {
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
      <TableHeader
        modelName="Lead"
        collectionName="leads"
        selectedColumnView={selectedColumnView}
        setSelectedColumnView={selectColumnView}
        onHandleUpdateData={onHandleUpdateColumnData}
        onHandleSearch={onHandleSearch}
        searchValue={searchText}
        isDataUpdated={isColumnDataUpdated}
        openViewModal={() => openManageColumnModal()}
        total={total}
        deletePermission={deleteLeadPermission}
        selectedIds={selectedIds}
        deleteMethod={() => openDeleteLeadsModal()}
        dataLoading={deleteLeadsLoading}
        setSpacing={updateSpacing}
        onSave={() => updateColumnView(selectedColumnViewRef.current)}
        onSaveAs={() => openManageColumnModal(true)}
        isViewUpdate={isViewUpdate}
      >
        <>
          <AuthGuard isAccessible={createLeadPermission}>
            <div className="action__btn__item inline-flex pr-[14px] mr-[14px] relative before:content-[''] before:absolute before:right-0 before:w-[1px] before:h-[20px] before:bg-[#CCCCCC] last:before:hidden last:pr-0 last:mr-0">
              <button
                className="text-[16px] font-biotif__Medium text-[#7467B7] duration-300 hover:underline"
                onClick={() => {
                  navigate(`/${PRIVATE_NAVIGATION.leads.add}`);
                }}
                disabled={getLeadsLoading}
              >
                New Lead
              </button>
            </div>
          </AuthGuard>
        </>
      </TableHeader>
      <AuthGuard isAccessible={readLeadPermission}>
        {width < 576 ? (
          <div className="ag__grid__mobile__lead">
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
            className="lead__page__ag__table ag__grid__purple__new__design "
            key={JSON.stringify(selectedColumnView.spacing)}
          >
            <TableInfiniteScroll
              key={selectedColumnView?.id}
              setCurrentPage={setCurrentPage}
              // {...(readLeadPermission && {
              //   onRowClickNavigateLink: `${PRIVATE_NAVIGATION.leads.view}/`,
              // })}
              ref={tableRef}
              rowDataLimit={LISTING_DATA_LIMIT}
              getData={(params) => getLeadData(params)}
              columnData={
                selectedColumnView?.columns?.length > 0
                  ? (columnDefs as ColDef[])
                  : []
              }
              searchColumns={['name', 'tags']}
              defaultColParams={defaultColDef}
              isLoading={getLeadsLoading}
              allowMultipleSelect
              type="lead"
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
              modelName={ModuleNames.LEAD}
              spacing={selectedColumnView.spacing}
            />
          </div>
        )}
      </AuthGuard>

      {/* delete lead modal */}
      {openModal.delete && (
        <DeleteModal
          closeModal={closeModal}
          isOpen={openModal.delete}
          isLoading={deleteLeadsLoading}
          deleteOnSubmit={() => onDeleteAll()}
          moduleName={selectedIds.length > 1 ? 'these Leads' : 'this Lead'}
        />
      )}

      {openModal.manageColumn && (
        <ColumnManageModal
          modelName="Lead"
          collectionName="leads"
          closeModal={closeModal}
          editColumnViewID={editColumnViewId}
          saveAsViewData={selectedColumnViewRef.current}
          isSaveAsAction={openModal.saveAsView}
        />
      )}
      {openModal.addTag === true && (
        <AuthGuard isAccessible={tagForLeadPermission}>
          <AssignTagModal
            closeModal={closeModal}
            isOpen={openModal.addTag}
            modelRecordId={leadId}
            assignedTags={assignedTags}
            setAssignedTags={setAssignedTags}
            modelName={ModuleNames.LEAD}
            getAssignedTags={assignTag}
            deleteAssignedTag={async () => removeTag()}
            editTagsPermission={tagForLeadPermission}
          />
        </AuthGuard>
      )}
    </>
  );
};

export default Leads;
