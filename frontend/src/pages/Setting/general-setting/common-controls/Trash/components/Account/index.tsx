// ** Import Packages **
import React, {
  ChangeEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

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

// ** Hooks **
import useSelectAll from 'hooks/selectAll';
import useInfiniteScrollInfo from 'hooks/useInfiniteScrollInfo';
import usePermission from 'hooks/usePermission';
import useWindowDimensions from 'hooks/useWindowDimensions';

// ** Type **

// ** Constants **

// ** Other **
import useAccountTrashColumn from './useAccountTrashColumn';
import { entityModuleRefType } from '../..';
import { AccountPageModalPropsType } from 'pages/Account/types/account.types';
import {
  useDestroyAccountMutation,
  useLazyGetAccountsQuery,
  useRestoreAccountMutation,
} from 'redux/api/accountApi';
import {
  LISTING_DATA_LIMIT,
  POLLING_INTERVAL,
} from 'constant/dataLimit.constant';
import { IS_CACHING_ACTIVE } from 'constant';

interface Props {
  setSelectedIds: React.Dispatch<
    React.SetStateAction<{
      ids: number[];
      data?: any[];
    }>
  >;
  searchData: {
    searchText: string;
    searchFields: string;
  };
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  setActionBtnState: React.Dispatch<React.SetStateAction<boolean>>;
}
const AccountTrash = forwardRef<entityModuleRefType, Props>(
  (
    {
      setSelectedIds,
      searchData,
      searchText,
      setSearchText,
      setActionBtnState,
    }: Props,
    ref
  ) => {
    // ** Ref **
    const tableRef = useRef<AgGridTableRef>(null);

    // ** States **
    const [currentPage, setCurrentPage] = useState(1);
    const [dataInfo, setDataInfo] = useState<agGridSelectedProps>([]);
    const [openModal, setOpenModal] = useState<AccountPageModalPropsType>({
      delete: false,
      manageColumn: false,
    });

    // ** APIS **
    const [getAccounts, { isLoading: getAccountsLoading }] =
      useLazyGetAccountsQuery({
        pollingInterval: currentPage === 1 ? POLLING_INTERVAL : 0,
      });

    // ** Custom Hooks **
    const { readAccountPermission } = usePermission();
    const [getAccountRestoreAccountApi] = useRestoreAccountMutation();

    const [destroyAccountAPI, { isLoading: deleteAccountsLoading }] =
      useDestroyAccountMutation();
    const { isMobileView } = useWindowDimensions();
    const { loading, perPage, items, setPerPage, setItems } =
      useInfiniteScrollInfo({
        getData: getAccountData,
        searchData,
      });
    const {
      isCheckAll,
      isCheckAllRef,
      setSelectionList,
      selectionRef,
      setIsCheckAll,
      selectedIds,
    } = useSelectAll({ data: dataInfo });

    const hardDeletedData = async () => {
      const data = await destroyAccountAPI({
        data: { accountIds: selectedIds },
      });
      if ('data' in data || !('error' in data)) {
        closeModal();
        refreshTable();
      }
    };

    const restoreData = async (id?: number) => {
      const data = await getAccountRestoreAccountApi({
        data: {
          accountIds: id ? [id] : selectedIds,
        },
      });
      searchText = '';
      if ('data' in data || !('error' in data)) {
        refreshTable();
      }
    };

    const { columnDefs, defaultColDef } = useAccountTrashColumn({
      selectionRef,
      isCheckAllRef,
      setIsCheckAll,
      disabled: getAccountsLoading,
      isCheckAll,
      setSelectionList,
      isSelectionDisabled: !dataInfo.length,
      openDeleteAccountModal,
      restoreData,
      setActionBtnState,
    });

    useEffect(() => {
      setSelectedIds({ ids: selectedIds });
    }, [JSON.stringify(selectedIds)]);

    useEffect(() => {
      const event = {
        target: {
          value: searchText,
        },
      };
      tableRef?.current?.onChange?.(event as ChangeEvent<HTMLInputElement>);
    }, [searchText]);

    async function getAccountData(
      params: PaginationParams = { page: 1, limit: LISTING_DATA_LIMIT }
    ) {
      const { data, error } = await getAccounts(
        {
          data: {
            query: {
              sort: '-id',
              ...params,
              'q[deleted_at][ne]': null,
              'include[modifier]': 'id,first_name,last_name,full_name',
              paranoid: false,
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
      }

      return tableData;
    }

    const closeModal = () => {
      setOpenModal({
        delete: false,
        manageColumn: false,
      });
      selectionRef.current = {};
      setSelectionList({});
    };

    function openDeleteAccountModal() {
      setOpenModal({
        delete: true,
        manageColumn: false,
      });
    }

    const refreshTable = () => {
      tableRef.current?.refreshData();
      if (isMobileView) {
        setPerPage({ ...perPage, page: 1 });
        setItems([]);
      }
    };

    useImperativeHandle(ref, () => ({
      openDeleteModal: openDeleteAccountModal,
      restoreData,
    }));

    return (
      <>
        <AuthGuard isAccessible={readAccountPermission}>
          {isMobileView ? (
            <div className="ag__grid__mobile__account">
              <CardInfiniteScroll
                perPage={perPage}
                items={items}
                isLoading={loading}
                columnData={columnDefs}
                setPerPage={setPerPage}
              />
            </div>
          ) : (
            <div className="account__page__ag__table">
              <TableInfiniteScroll
                setCurrentPage={setCurrentPage}
                ref={tableRef}
                rowDataLimit={LISTING_DATA_LIMIT}
                getData={(params) => getAccountData(params)}
                columnData={columnDefs}
                searchColumns={['name']}
                defaultColParams={defaultColDef}
                isLoading={getAccountsLoading}
                allowMultipleSelect
                setSearchText={setSearchText}
              />
            </div>
          )}
        </AuthGuard>

        {openModal.delete && (
          <DeleteModal
            closeModal={closeModal}
            isOpen={openModal.delete}
            isLoading={deleteAccountsLoading}
            deleteOnSubmit={() => hardDeletedData()}
            moduleName={
              selectedIds.length > 1 ? 'these accounts' : 'this account'
            }
          />
        )}
      </>
    );
  }
);

export default AccountTrash;
