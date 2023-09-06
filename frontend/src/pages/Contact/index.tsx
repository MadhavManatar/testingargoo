// ** Import Packages **
import { useEffect, useReducer, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ColDef, RowClickedEvent } from 'ag-grid-community';
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
import SelectEmailProviderModal from 'pages/Email/components/Modals/SelectEmailProviderModal';
import BulkEmailComposerModal from './components/BulkEmailComposerModal';

// ** Redux **
import {
  getEntityTableView,
  getIsContactQuickAdd,
  getMailProviderOption,
  setContactQuickAdd,
  setEntityLastOpenRecord,
} from 'redux/slices/commonSlice';

// ** Hooks **
import useSelectAll from 'hooks/selectAll';
import useInfiniteScrollInfo from 'hooks/useInfiniteScrollInfo';
import usePermission from 'hooks/usePermission';
import useWindowDimensions from 'hooks/useWindowDimensions';
import useContactColumnsDef from 'pages/Contact/hooks/useContactColumns';

// ** Types **
import { EmailModalType } from 'pages/Email/types/email.type';
import {
  MailTokenProvider,
  TokenProvider,
} from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';
import { ContactModalTypes } from './types/contacts.types';
import {
  useDeleteContactMutation,
  useLazyGetContactsAdvanceQuery,
} from 'redux/api/contactApi';

// ** Constants **
import { INITIAL_MAIL_PROVIDER_ARRAY } from 'constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

// ** Util **
import { REACT_APP_FRONT_URL } from 'config';
import { debounce } from 'utils/util';
import useFollowFollowing from 'components/EntityDetails/FollowFollowing/useFollowFollowing';
import { ModuleNames } from 'constant/permissions.constant';
import {
  LISTING_DATA_LIMIT,
  POLLING_INTERVAL,
} from 'constant/dataLimit.constant';

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
import { useGetLoggedIUserTokens } from 'pages/Setting/email-setting/hooks/useUserTokenService';
import useTableHeaderService from 'components/TableHeader/useTableHeaderService';
import useTagListView from 'pages/TagMangement/useTagMangement';
import { AssignTagsProps } from 'components/EntityDetails/types';
import AssignTagModal from 'components/detail-components/AssignTags/AssignTagModal';

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
const initialOpenModalState: ContactModalTypes = {
  delete: false,
  manageColumn: false,
  addTag: false,
  saveAsView: false,
  bulkMail: false,
};

const Contacts = () => {
  // ** START: Hooks ** //
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentDays = useRef<string>();
  const tableRef = useRef<AgGridTableRef>(null);
  const isContactQuickAdd = useSelector(getIsContactQuickAdd);
  const selectedColumnViewRef = useRef<columnViewInterface>();
  const initialTableView = useSelector(getEntityTableView);

  // ** END: Hooks ** //

  // ** States ** //
  const [pollingInterval, setPollingInterval] = useState(0);
  const [total, setTotal] = useState(0);
  const [dataInfo, setDataInfo] = useState<agGridSelectedProps>([]);
  const [emailUndoHelperObj, setEmailUndoHelperObj] = useState<{
    id?: number;
    delay_time: number;
    provider?: MailTokenProvider;
  }>({ delay_time: 10 });
  const [openModal, setOpenModal] = useState<ContactModalTypes>(
    initialOpenModalState
  );
  const [searchData, setSearchData] = useState<{
    searchText: string;
    searchFields: string;
  }>({ searchText: '', searchFields: '' });
  const [modal, setModal] = useState<EmailModalType>();
  const [searchText, setSearchText] = useState<string>('');
  const [isColumnDataUpdated, setIsColumnDataUpdated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [contactId, setContactId] = useState(-1);
  const [, setSpacing] = useState<{ height: number; class: string }>({
    height: 60,
    class: 'normal',
  });
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

  // ** APIS **
  const mailProviders = useSelector(getMailProviderOption);

  // ** Custom hooks ** //
  const { getLoggedIUserTokens, usersTokens } = useGetLoggedIUserTokens({
    INITIAL_PROVIDER_ARRAY: INITIAL_MAIL_PROVIDER_ARRAY,
  });
  const { isMobileView } = useWindowDimensions();
  const { loading, perPage, items, setPerPage, setItems } =
    useInfiniteScrollInfo({
      getData: getContactData,
      searchData,
    });

  const { followingStoreRefresh } = useFollowFollowing({
    moduleName: ModuleNames.CONTACT,
  });

  // ** APIS **
  const [getContactsAPI, { isLoading: getContactsLoading }] =
    useLazyGetContactsAdvanceQuery({
      pollingInterval: currentPage === 1 ? pollingInterval : 0,
    });
  const [deleteContactsAPI, { isLoading: deleteContactsLoading }] =
    useDeleteContactMutation();
  const { getAssignedTags, deleteAssignedTags } = useTagListView();
  const {
    isCheckAll,
    isCheckAllRef,
    selectedIds,
    selectionList,
    setSelectionList,
    selectionRef,
    setIsCheckAll,
  } = useSelectAll({
    data: dataInfo,
  });

  const refreshTable = () => {
    tableRef.current?.refreshData();
    if (isMobileView) {
      setPerPage({ ...perPage, page: 1 });
      setItems([]);
    }
  };

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

  const { columnDefs, defaultColDef } = useContactColumnsDef({
    selectionRef,
    isCheckAllRef,
    setIsCheckAll,
    disabled: getContactsLoading,
    isCheckAll,
    setSelectionList,
    isSortable: dataInfo?.length > 1,
    isSelectionDisabled: !dataInfo.length,
    openAddTagModal,
    setIsWrapTxtUpdate,
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
    onRowClickNavigateLink: `${PRIVATE_NAVIGATION.contacts.view}/`,
  });
  const {
    readContactPermission,
    createContactPermission,
    deleteContactPermission,
    tagForContactPermission,
  } = usePermission();

  // Here set the polling interval for api calling every EX.POLLING_INTERVAL time
  useEffect(() => {
    setTimeout(() => {
      setPollingInterval(POLLING_INTERVAL);
    }, 1000);
  }, []);

  useEffect(() => {
    getLoggedIUserTokens();
  }, []);

  useEffect(() => {
    if (isContactQuickAdd) {
      refreshTable();
      dispatch(setContactQuickAdd({ contact: false }));
    }
  }, [isContactQuickAdd]);

  useEffect(() => {
    if (initialTableView?.Contact) {
      setSelectedColumnView({
        type: 'update',
        data: initialTableView.Contact,
      });
    }
  }, [initialTableView]);

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
    if (PRIVATE_NAVIGATION.contacts.view && !classExist) {
      modalOpenTarget[0]?.classList.add('listing__page');
    }

    return () => {
      modalOpenTarget[0]?.classList.remove('listing__page');
    };
  });

  // ** START: Functions ** //
  async function getContactData(
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
        return `-${data?.column?.fieldName}`;
      }
      return `${data?.column?.fieldName}`;
    });
    const { data, error } = await getContactsAPI(
      {
        data: {
          query: {
            ...(currentDays.current
              ? { 'q[created_at][gte]': currentDays.current }
              : {}),
            ...params,
            ...filterObject,
            tableName: 'Contact',
            sort: sortData?.length ? sortData.join(',') : '-id',
            select: `id,${[...modelSelectColumn]},contact_image,initial_color`,
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
      setTotal(data.count);
      tableRef?.current?.setLastOpenedRecordInView();
    }

    return tableData;
  }

  const closeModal = () => {
    refreshTable();
    setOpenModal(initialOpenModalState);
    selectionRef.current = {};
    setSelectionList({});
    setModal(undefined);
    setIsColumnDataUpdated(!isColumnDataUpdated);
    setColumnEditViewId(-1);
    setContactId(-1);
  };
  function openDeleteContactModal() {
    setOpenModal({
      ...initialOpenModalState,
      delete: true,
    });
  }

  const openBulMailModal = () =>
    setOpenModal({
      ...initialOpenModalState,
      bulkMail: true,
    });

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
    setContactId(id);
  }

  const assignTag = () => {
    getAssignedTags(
      contactId,
      setAssignedTags,
      assignedTags,
      ModuleNames.CONTACT
    );
  };
  const removeTag = () => {
    deleteAssignedTags(
      contactId,
      setAssignedTags,
      assignedTags,
      ModuleNames.CONTACT
    );
  };

  const onDeleteAll = async () => {
    const data = await deleteContactsAPI({
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
            [ModuleNames.CONTACT]: {
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
        modelName="Contact"
        collectionName="contacts"
        selectedColumnView={selectedColumnView}
        setSelectedColumnView={selectColumnView}
        onHandleUpdateData={onHandleUpdateColumnData}
        onHandleSearch={onHandleSearch}
        searchValue={searchText}
        isDataUpdated={isColumnDataUpdated}
        openViewModal={() => openManageColumnModal()}
        total={total}
        createPermission={createContactPermission}
        deletePermission={deleteContactPermission}
        selectedIds={selectedIds}
        deleteMethod={() => openDeleteContactModal()}
        mailMethod={() => openBulMailModal()}
        dataLoading={deleteContactsLoading}
        setSpacing={updateSpacing}
        onSave={() => updateColumnView(selectedColumnViewRef.current)}
        onSaveAs={() => openManageColumnModal(true)}
        isViewUpdate={isViewUpdate}
      >
        <AuthGuard isAccessible={createContactPermission}>
          <div className="action__btn__item inline-flex pr-[14px] mr-[14px] relative before:content-[''] before:absolute before:right-0 before:w-[1px] before:h-[20px] before:bg-[#CCCCCC] last:before:hidden last:pr-0 last:mr-0">
            <button
              onClick={() => navigate(`/${PRIVATE_NAVIGATION.contacts.add}`)}
              className="text-[16px] font-biotif__Medium text-[#7467B7] duration-300 hover:underline"
              disabled={getContactsLoading || deleteContactsLoading}
            >
              New Contact
            </button>
          </div>
        </AuthGuard>
      </TableHeader>
      <AuthGuard isAccessible={readContactPermission}>
        {isMobileView ? (
          <div className="ag__grid__mobile__contact">
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
            className="contact__page__ag__table ag__grid__purple__new__design"
            key={JSON.stringify(selectedColumnView.spacing)}
          >
            <TableInfiniteScroll
              key={selectedColumnView?.id}
              setCurrentPage={setCurrentPage}
              // {...(readContactPermission && {
              //   onRowClickNavigateLink: `${PRIVATE_NAVIGATION.contacts.view}/`,
              // })}
              ref={tableRef}
              rowDataLimit={LISTING_DATA_LIMIT}
              getData={(params) => getContactData(params)}
              columnData={
                selectedColumnView?.columns?.length > 0
                  ? (columnDefs as ColDef[])
                  : []
              }
              searchColumns={['name', 'tags', 'emails', 'phones']}
              defaultColParams={defaultColDef}
              isLoading={getContactsLoading}
              allowMultipleSelect
              type="contact"
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
              modelName={ModuleNames.CONTACT}
              spacing={selectedColumnView.spacing}
            />
          </div>
        )}
      </AuthGuard>

      {/* delete contact modal */}
      {openModal.delete && (
        <DeleteModal
          closeModal={closeModal}
          isOpen={openModal.delete}
          isLoading={deleteContactsLoading}
          deleteOnSubmit={() => onDeleteAll()}
          moduleName={
            selectedIds.length > 1 ? 'these contacts' : 'this contact'
          }
        />
      )}

      {openModal.bulkMail && (
        <BulkEmailComposerModal
          selectionList={selectionList}
          selectionRef={selectionRef}
          setSelectionList={setSelectionList}
          providers={usersTokens}
          providerOption={mailProviders.filter(
            (item) =>
              ((item.value as string).split(',')[1] as TokenProvider) !==
              TokenProvider.All
          )}
          isOpen={openModal.bulkMail}
          closeModal={closeModal}
          emailUndoHelperObj={emailUndoHelperObj}
          setEmailUndoHelperObj={setEmailUndoHelperObj}
        />
      )}

      {modal === 'provider' && (
        <SelectEmailProviderModal
          tokenSuccessURL={`${REACT_APP_FRONT_URL}/contacts`}
          isOpen={modal === 'provider'}
          closeModal={closeModal}
          setModal={setModal}
          userTokenProviders={usersTokens.map(
            (usersToken) => usersToken.token_provider
          )}
        />
      )}

      {openModal.manageColumn && (
        <ColumnManageModal
          modelName="Contact"
          collectionName="contacts"
          closeModal={closeModal}
          editColumnViewID={editColumnViewId}
          saveAsViewData={selectedColumnViewRef.current}
          isSaveAsAction={openModal.saveAsView}
        />
      )}

      {openModal.addTag === true && (
        <AuthGuard isAccessible={tagForContactPermission}>
          <AssignTagModal
            closeModal={closeModal}
            isOpen={openModal.addTag}
            modelRecordId={contactId}
            assignedTags={assignedTags}
            setAssignedTags={setAssignedTags}
            modelName={ModuleNames.CONTACT}
            getAssignedTags={assignTag}
            deleteAssignedTag={async () => removeTag()}
            editTagsPermission={tagForContactPermission}
          />
        </AuthGuard>
      )}
    </>
  );
};

export default Contacts;
