// ** Import Packages **
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

// ** Components **
import DeleteModal from 'components/DeleteComponents/DeleteModal';
import TableInfiniteScroll, {
  AgGridTableRef,
  PaginationParams,
  agGridSelectedProps,
} from 'components/TableInfiniteScroll';
import CardInfiniteScroll from 'components/TableInfiniteScroll/CardInfiniteScroll';
import AuthGuard from 'pages/auth/components/AuthGuard';

// ** hooks **
import useInfiniteScrollInfo from 'hooks/useInfiniteScrollInfo';
import usePermission from 'hooks/usePermission';
import useWindowDimensions from 'hooks/useWindowDimensions';
import useLeadTrashColumn from './useLeadTrashColumn';

// ** Other **
import useSelectAll from 'hooks/selectAll';
import { entityModuleRefType } from '../..';
import { useHardDelete } from '../../hooks/useHardDelete';
import { useRestore } from '../../hooks/useRestore';
import { useLazyGetLeadsQuery } from 'redux/api/leadApi';
import {
  LISTING_DATA_LIMIT,
  POLLING_INTERVAL,
} from 'constant/dataLimit.constant';
import { IS_CACHING_ACTIVE } from 'constant';

interface Props {
  is_deal: boolean;
  setSelectedIds: Dispatch<
    SetStateAction<{
      ids: number[];
      data?: any[];
    }>
  >;
  searchData: {
    searchText: string;
    searchFields: string;
  };
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
  setActionBtnState: React.Dispatch<React.SetStateAction<boolean>>;
}

const LeadDealTrash = forwardRef<entityModuleRefType, Props>(
  (
    { is_deal, setSelectedIds, searchData, searchText, setSearchText, setActionBtnState }: Props,
    ref
  ) => {
    // ** Ref **
    const tableRef = useRef<AgGridTableRef>(null);

    // ** States **
    const [currentPage, setCurrentPage] = useState(1);
    const [openModal, setOpenModal] = useState<{
      delete: boolean;
    }>({ delete: false });
    const [leadData, setLeadData] = useState<agGridSelectedProps>([]);

    // ** APIS **
    const [getLeads, { isLoading: getLeadsLoading }] = useLazyGetLeadsQuery({
      pollingInterval: currentPage === 1 ? POLLING_INTERVAL : 0,
    });

    // ** Custom hooks **
    const { width } = useWindowDimensions();
    const { readLeadPermission } = usePermission();
    const { hardDeleteLead, destroyLeadLoading } = useHardDelete();
    const { restoreLead } = useRestore();

    useEffect(() => {
      const event = {
        target: {
          value: searchText,
        },
      };
      tableRef?.current?.onChange?.(event as ChangeEvent<HTMLInputElement>);
    }, [searchText]);

    const getLeadData = async (
      params: PaginationParams = { page: 1, limit: LISTING_DATA_LIMIT }
    ) => {
      setDisabled(true);
      const { data, error } = await getLeads(
        {
          data: {
            query: {
              sort: '-id',
              ...params,
              ...(params.searchText && {
                'q[or][][name][iLike]': params.searchText,
                subQuery: false,
              }),
              'q[is_deal]': is_deal,
              'q[deleted_at][ne]': null,
              'include[modifier]': 'id,first_name,last_name,full_name',
              paranoid: false,
            },
          },
        },
        IS_CACHING_ACTIVE
      );
      let tableData = { rowData: [], rowCount: 0 };

      if (data && !error) {
        tableData = { rowData: data.rows, rowCount: data.count };
        if (params.page === 1) {
          setLeadData([...tableData.rowData]);
        } else {
          setLeadData((prev) => [...prev, ...tableData.rowData]);
        }
        setDisabled(false);
      }

      return tableData;
    };

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
    } = useSelectAll({ data: leadData });

    useEffect(() => {
      setSelectedIds({
        ids: selectedIds,
      });
    }, [JSON.stringify(selectedIds)]);

    const restoreLeadDeal = (id?: number) => {
      restoreLead({
        afterRestore: refreshTable,
        selectedIds: id ? [id] : selectedIds,
        is_deal,
      });
    };

    const { columnDefs, defaultColDef } = useLeadTrashColumn({
      selectionRef,
      isCheckAllRef,
      setIsCheckAll,
      disabled,
      isCheckAll,
      getLeadsLoading,
      setSelectionList,
      restoreData: restoreLeadDeal,
      openDeleteLeadsModal,
      isSelectionDisabled: !leadData.length,
      setActionBtnState
    });

    useImperativeHandle(ref, () => ({
      openDeleteModal: openDeleteLeadsModal,
      restoreData: restoreLeadDeal,
      clearSearch,
    }));

    const clearSearch = () => {
      const event = {
        target: {
          value: '',
        },
      };
      tableRef?.current?.onChange?.(event as ChangeEvent<HTMLInputElement>);
    };

    const closeModal = () => {
      setOpenModal({
        delete: false,
      });
      selectionRef.current = {};
      setSelectionList({});
    };

    function openDeleteLeadsModal() {
      setOpenModal({
        delete: true,
      });
    }

    const refreshTable = () => {
      clearSelectAll();
      tableRef.current?.refreshData();
      if (width < 576) {
        setPerPage({
          ...perPage,
          page: 1,
        });
        setItems([]);
      }
    };

    return (
      <>
        <AuthGuard isAccessible={readLeadPermission}>
          {width < 576 ? (
            <div className="ag__grid__mobile__lead">
              <CardInfiniteScroll
                perPage={perPage}
                items={items}
                isLoading={loading}
                columnData={columnDefs}
                setPerPage={setPerPage}
              />
            </div>
          ) : (
            <div className="lead__page__ag__table">
              <TableInfiniteScroll
                setCurrentPage={setCurrentPage}
                ref={tableRef}
                rowDataLimit={LISTING_DATA_LIMIT}
                getData={(params) => getLeadData(params)}
                columnData={columnDefs}
                searchColumns={['name']}
                defaultColParams={defaultColDef}
                isLoading={getLeadsLoading}
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
            isLoading={destroyLeadLoading}
            deleteOnSubmit={() =>
              hardDeleteLead({
                selectedIds,
                is_deal,
                afterDelete: () => {
                  refreshTable();
                  closeModal();
                },
              })
            }
            moduleName={
              is_deal
                ? selectedIds.length > 1
                  ? 'these Deals'
                  : 'this Deal'
                : selectedIds.length > 1
                ? 'these Leads'
                : 'this Lead'
            }
          />
        )}
      </>
    );
  }
);
export default LeadDealTrash;
