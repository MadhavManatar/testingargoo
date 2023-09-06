// ** Import Packages **
import { useEffect, useReducer, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';

// ** Components **
import DeleteModal from 'components/DeleteComponents/DeleteModal';
import TableInfiniteScroll, {
  agGridSelectedProps,
  AgGridTableRef,
  PaginationParams,
} from 'components/TableInfiniteScroll';
import CardInfiniteScroll from 'components/TableInfiniteScroll/CardInfiniteScroll';
import AuthGuard from 'pages/auth/components/AuthGuard';

// ** Redux **
import {
  getEntityTableView,
  getIsAccountQuickAdd,
  setAccountQuickAdd,
  setEntityLastOpenRecord,
} from 'redux/slices/commonSlice';

// ** Hooks **
import useSelectAll from 'hooks/selectAll';
import useInfiniteScrollInfo from 'hooks/useInfiniteScrollInfo';
import usePermission from 'hooks/usePermission';
import useWindowDimensions from 'hooks/useWindowDimensions';
import useAccountList from './hooks/useAccountColumns';

// ** Type **
import { AccountPageModalPropsType } from './types/account.types';

// ** Constants **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { ModuleNames } from 'constant/permissions.constant';

// ** Other **
import { debounce } from 'utils/util';
import useFollowFollowing from 'components/EntityDetails/FollowFollowing/useFollowFollowing';
import {
  columnsDataInterface,
  columnViewInterface,
} from 'components/ColumnViewListDropDown';
import ColumnManageModal from 'components/ColumnManageModal';
import {
  LISTING_DATA_LIMIT,
  POLLING_INTERVAL,
} from 'constant/dataLimit.constant';
import {
  useDeleteAccountMutation,
  useLazyGetAccountsPostQuery,
} from 'redux/api/accountApi';
import { ColDef, RowClickedEvent } from 'ag-grid-community';
import TableHeader from 'components/TableHeader';
import { IS_CACHING_ACTIVE } from 'constant';
import AssignTagModal from 'components/detail-components/AssignTags/AssignTagModal';
import { AssignTagsProps } from 'components/EntityDetails/types';
import useTagListView from 'pages/TagMangement/useTagMangement';
import useTableHeaderService from 'components/TableHeader/useTableHeaderService';
import {
  getFilterKeys,
  setIncludeObj,
} from 'components/TableHeader/helpers/columnTypeManage';

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

const initialOpenModalState: AccountPageModalPropsType = {
  delete: false,
  manageColumn: false,
  addTag: false,
  saveAsView: false,
};

const Accounts = () => {
  // ** Hooks **
  const currentDays = useRef<string>();
  const tableRef = useRef<AgGridTableRef>(null);
  const isAccountQuickAdd = useSelector(getIsAccountQuickAdd);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedColumnViewRef = useRef<columnViewInterface>();
  const initialTableView = useSelector(getEntityTableView);

  // ** States **
  const [pollingInterval, setPollingInterval] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [total, setTotal] = useState(0);
  const [dataInfo, setDataInfo] = useState<agGridSelectedProps>([]);
  const [searchData, setSearchData] = useState<{
    searchText: string;
    searchFields: string;
  }>({ searchText: '', searchFields: '' });
  const [openModal, setOpenModal] = useState<AccountPageModalPropsType>(
    initialOpenModalState
  );
  const [searchText, setSearchText] = useState<string>('');
  const [isColumnDataUpdated, setIsColumnDataUpdated] = useState(false);
  const [, setSpacing] = useState<{ height: number; class: string }>({
    height: 60,
    class: 'normal',
  });
  const [accountId, setAccountId] = useState(-1);
  const [assignedTags, setAssignedTags] = useState<AssignTagsProps>({
    list: [],
    total: 0,
  });
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

  // ** Apis ** //
  const [getAccountsAPI, { isLoading: getAccountsLoading }] =
    useLazyGetAccountsPostQuery({
      pollingInterval: currentPage === 1 ? pollingInterval : 0,
    });
  const [deleteAccountsAPI, { isLoading: deleteAccountsLoading }] =
    useDeleteAccountMutation();

  // ** Custom Hooks **
  const {
    readAccountPermission,
    createAccountPermission,
    deleteAccountPermission,
    tagForAccountPermission,
  } = usePermission();
  const { isMobileView } = useWindowDimensions();

  const { loading, perPage, items, setPerPage, setItems } =
    useInfiniteScrollInfo({
      getData: getAccountData,
      searchData,
    });
  const { followingStoreRefresh } = useFollowFollowing({
    moduleName: ModuleNames.ACCOUNT,
  });

  const {
    isCheckAll,
    isCheckAllRef,
    setSelectionList,
    selectionRef,
    setIsCheckAll,
    selectedIds,
    selectionList,
  } = useSelectAll({ data: dataInfo });

  const { getAssignedTags, deleteAssignedTags } = useTagListView();

  const {
    onHandleMoveColumnData,
    onHandleUpdateColumnData,
    onHandleUpdateColumnWidth,
    updateColumnView,
    isViewUpdate,
    selectColumnView,
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

  const { columnDefs, defaultColDef } = useAccountList({
    selectionRef,
    isCheckAllRef,
    setIsCheckAll,
    disabled: getAccountsLoading,
    isCheckAll,
    setSelectionList,
    openAddTagModal,
    setIsWrapTxtUpdate,
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
    onRowClickNavigateLink: `${PRIVATE_NAVIGATION.accounts.view}/`,
  });

  // Here set the polling interval for api calling every EX.POLLING_INTERVAL time
  useEffect(() => {
    setTimeout(() => {
      setPollingInterval(POLLING_INTERVAL);
    }, 1000);
  }, []);

  useEffect(() => {
    if (initialTableView?.Account) {
      setSelectedColumnView({
        type: 'update',
        data: initialTableView.Account,
      });
    }
  }, [initialTableView]);

  useEffect(() => {
    if (isAccountQuickAdd) {
      if (selectedColumnView?.columns?.length) refreshTable();
      dispatch(setAccountQuickAdd({ account: false }));
    }
  }, [isAccountQuickAdd]);

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
    if (PRIVATE_NAVIGATION.accounts.view && !classExist) {
      modalOpenTarget[0]?.classList.add('listing__page');
    }

    return () => {
      modalOpenTarget[0]?.classList.remove('listing__page');
    };
  });

  async function getAccountData(
    params: PaginationParams = { page: 1, limit: LISTING_DATA_LIMIT }
  ) {
    const falseReturnObj = { rowData: [], rowCount: 0 }; // if view selected not found or not any selected view column return default value
    const filterObject: { [key: string]: string | boolean } = {};
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

    const { data, error } = await getAccountsAPI(
      {
        data: {
          query: {
            ...(currentDays.current
              ? { 'q[created_at][gte]': currentDays.current }
              : {}),
            ...params,
            ...filterObject,
            select: `id,${[...modelSelectColumn]},account_image,initial_color`,
            subQuery: false,
            sort: sortData?.length ? sortData.join(',') : '-id',
          },
        },
      },
      IS_CACHING_ACTIVE
    );

    let tableData = { rowData: [], rowCount: 0 };
    if (!error && data) {
      tableData = { rowData: data.rows, rowCount: data.count };
      if (params.page === 1) {
        setDataInfo([...tableData.rowData]);
      } else {
        setDataInfo((prev) => [...prev, ...tableData.rowData]);
      }
      setTotal(data.count);
      tableRef?.current?.setLastOpenedRecordInView();
    }
    return tableData;
  }

  const assignTag = () => {
    getAssignedTags(
      accountId,
      setAssignedTags,
      assignedTags,
      ModuleNames.ACCOUNT
    );
  };
  const removeTag = () => {
    deleteAssignedTags(
      accountId,
      setAssignedTags,
      assignedTags,
      ModuleNames.ACCOUNT
    );
  };

  const closeModal = () => {
    refreshTable();
    setOpenModal(initialOpenModalState);
    selectionRef.current = {};
    setSelectionList({});
    setColumnEditViewId(-1);
    setIsColumnDataUpdated(!isColumnDataUpdated);
    setAccountId(-1);
  };

  function openDeleteAccountModal() {
    setOpenModal({
      ...initialOpenModalState,
      delete: true,
    });
  }

  function openAddTagModal(id: number) {
    setOpenModal({
      ...initialOpenModalState,
      addTag: true,
    });
    setAccountId(id);
  }

  function openManageColumnModal(saveAsView = false) {
    setOpenModal({
      ...initialOpenModalState,
      manageColumn: true,
      saveAsView,
    });
  }

  const onDeleteAll = async () => {
    const data = await deleteAccountsAPI({
      data: { allId: selectedIds },
    });
    if (!('error' in data)) {
      setPerPage({ ...perPage, page: 1 });
      refreshTable();
      setItems([]);
      closeModal();
      setIsCheckAll(false);
      selectionRef.current = {};
      setSelectionList({});
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

  const onHandleSearch = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchText(e?.currentTarget?.value);
    debounce(onSearchChange)(e);
  };

  const onTableRowClick = (e: RowClickedEvent) => {
    if (_.isNumber(e.data?.id) && _.isNumber(e.rowIndex)) {
      dispatch(
        setEntityLastOpenRecord({
          data: {
            [ModuleNames.ACCOUNT]: {
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
        modelName="Account"
        collectionName="accounts"
        selectedColumnView={selectedColumnView}
        setSelectedColumnView={selectColumnView}
        onHandleUpdateData={onHandleUpdateColumnData}
        onHandleSearch={onHandleSearch}
        searchValue={searchText}
        isDataUpdated={isColumnDataUpdated}
        openViewModal={() => openManageColumnModal()}
        total={total}
        // columnListHeight={columnListHeight}
        deletePermission={deleteAccountPermission}
        selectedIds={selectedIds}
        deleteMethod={() => openDeleteAccountModal()}
        dataLoading={deleteAccountsLoading}
        setSpacing={updateSpacing}
        onSave={() => updateColumnView(selectedColumnViewRef.current)}
        onSaveAs={() => openManageColumnModal(true)}
        isViewUpdate={isViewUpdate}
      >
        <>
          <AuthGuard isAccessible={createAccountPermission}>
            <div className="action__btn__item inline-flex pr-[14px] mr-[14px] relative before:content-[''] before:absolute before:right-0 before:w-[1px] before:h-[20px] before:bg-[#CCCCCC] last:before:hidden last:pr-0 last:mr-0">
              <button
                onClick={() => navigate(`/${PRIVATE_NAVIGATION.accounts.add}`)}
                className="text-[16px] font-biotif__Medium text-[#7467B7] duration-300 hover:underline"
                disabled={deleteAccountsLoading || getAccountsLoading}
              >
                New Account
              </button>
            </div>
          </AuthGuard>
        </>
      </TableHeader>
      <AuthGuard isAccessible={readAccountPermission}>
        {isMobileView ? (
          <div className="ag__grid__mobile__account">
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
            className="account__page__ag__table ag__grid__purple__new__design"
            key={JSON.stringify(selectedColumnView.spacing)}
          >
            <TableInfiniteScroll
              key={selectedColumnView?.id}
              setCurrentPage={setCurrentPage}
              ref={tableRef}
              rowDataLimit={LISTING_DATA_LIMIT}
              getData={(params) => getAccountData(params)}
              columnData={
                selectedColumnView?.columns?.length > 0
                  ? (columnDefs as ColDef[])
                  : []
              }
              searchColumns={['name', 'tags', 'phones', 'emails']}
              defaultColParams={defaultColDef}
              isLoading={getAccountsLoading}
              allowMultipleSelect
              type="account"
              isWrapTxtUpdate={isWrapTxtUpdate}
              setIsWrapTxtUpdate={setIsWrapTxtUpdate}
              setSearchText={setSearchText}
              onHandleColumnSizeUpdate={(colId, width) =>
                onHandleUpdateColumnWidth(colId, width)
              }
              onHandleColumnMoved={({ columns }: { columns: string[] }) => {
                onHandleMoveColumnData({ columns });
              }}
              onRowClick={onTableRowClick}
              spacing={selectedColumnView.spacing}
              modelName={ModuleNames.ACCOUNT}
            />
          </div>
        )}
      </AuthGuard>

      {openModal.delete && (
        <DeleteModal
          closeModal={closeModal}
          isOpen={openModal.delete}
          isLoading={deleteAccountsLoading}
          deleteOnSubmit={() => onDeleteAll()}
          moduleName={
            selectedIds.length > 1 ? 'these accounts' : 'this account'
          }
        />
      )}

      {openModal.manageColumn && (
        <ColumnManageModal
          modelName="Account"
          collectionName="accounts"
          closeModal={closeModal}
          editColumnViewID={editColumnViewId}
          saveAsViewData={selectedColumnViewRef.current}
          isSaveAsAction={openModal.saveAsView}
        />
      )}

      {openModal.addTag === true && (
        <AuthGuard isAccessible={tagForAccountPermission}>
          <AssignTagModal
            closeModal={closeModal}
            isOpen={openModal.addTag}
            modelRecordId={accountId}
            assignedTags={assignedTags}
            setAssignedTags={setAssignedTags}
            modelName={ModuleNames.ACCOUNT}
            getAssignedTags={assignTag}
            deleteAssignedTag={async () => removeTag()}
            editTagsPermission={tagForAccountPermission}
          />
        </AuthGuard>
      )}
    </>
  );
};

export default Accounts;
