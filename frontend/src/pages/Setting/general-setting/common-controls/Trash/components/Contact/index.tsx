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

// ** Hooks **
import useSelectAll from 'hooks/selectAll';
import useInfiniteScrollInfo from 'hooks/useInfiniteScrollInfo';
import usePermission from 'hooks/usePermission';
import useWindowDimensions from 'hooks/useWindowDimensions';

// ** Util **
import useContactTrashColumn from './useContactTrashColumn';
import { entityModuleRefType } from '../..';
import { useHardDelete } from '../../hooks/useHardDelete';
import { useRestore } from '../../hooks/useRestore';
import { useLazyGetContactsQuery } from 'redux/api/contactApi';

// ** Constants **
import {
  LISTING_DATA_LIMIT,
  POLLING_INTERVAL,
} from 'constant/dataLimit.constant';

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

const ContactTrash = forwardRef<entityModuleRefType, Props>(
  ({ setSelectedIds, searchData, setSearchText, searchText, setActionBtnState }: Props, ref) => {
    // ** Ref ** //
    const tableRef = useRef<AgGridTableRef>(null);

    // ** States ** //
    const [currentPage, setCurrentPage] = useState(1);
    const [dataInfo, setDataInfo] = useState<agGridSelectedProps>([]);
    const [openModal, setOpenModal] = useState<{
      delete: boolean;
    }>({
      delete: false,
    });

    // ** APIS **
    const [getContacts, { isLoading: getContactsLoading }] =
      useLazyGetContactsQuery({
        pollingInterval: currentPage === 1 ? POLLING_INTERVAL : 0,
      });

    // ** Custom hooks ** //
    const { isMobileView } = useWindowDimensions();
    const { hardDeletedContact, destroyContactLoading } = useHardDelete();
    const { restoreContact } = useRestore();

    const { loading, perPage, items, setPerPage, setItems } =
      useInfiniteScrollInfo({
        getData: getContactData,
        searchData,
      });

    const {
      isCheckAll,
      isCheckAllRef,
      selectedIds,
      setSelectionList,
      selectionRef,
      setIsCheckAll,
    } = useSelectAll({
      data: dataInfo,
    });

    const restoreContacts = (id?: number) => {
      restoreContact({
        afterRestore: refreshTable,
        selectedIds: id ? [id] : selectedIds,
      });
    };
    const { columnDefs, defaultColDef } = useContactTrashColumn({
      selectionRef,
      isCheckAllRef,
      setIsCheckAll,
      disabled: getContactsLoading,
      isCheckAll,
      setSelectionList,
      isSortable: dataInfo?.length > 1,
      isSelectionDisabled: !dataInfo.length,
      openDeleteContactModal,
      restoreData: restoreContacts,
      setActionBtnState
    });

    const { readContactPermission } = usePermission();

    useEffect(() => {
      setSelectedIds({
        ids: selectedIds,
      });
    }, [JSON.stringify(selectedIds)]);

    useEffect(() => {
      const event = {
        target: {
          value: searchText,
        },
      };
      tableRef?.current?.onChange?.(event as ChangeEvent<HTMLInputElement>);
    }, [searchText]);

    // ** START: Functions ** //
    async function getContactData(
      params: PaginationParams = { page: 1, limit: LISTING_DATA_LIMIT }
    ) {
      const { data, error } = await getContacts(
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
      }

      return tableData;
    }

    const closeModal = () => {
      setOpenModal({
        delete: false,
      });
      selectionRef.current = {};
      setSelectionList({});
    };
    function openDeleteContactModal() {
      setOpenModal({
        delete: true,
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
      openDeleteModal: openDeleteContactModal,
      restoreData: restoreContacts,
    }));

    return (
      <>
        <AuthGuard isAccessible={readContactPermission}>
          {isMobileView ? (
            <div className="ag__grid__mobile__contact">
              <CardInfiniteScroll
                perPage={perPage}
                items={items}
                isLoading={loading}
                columnData={columnDefs}
                setPerPage={setPerPage}
              />
            </div>
          ) : (
            <div className="contact__page__ag__table">
              <TableInfiniteScroll
                setCurrentPage={setCurrentPage}
                ref={tableRef}
                rowDataLimit={LISTING_DATA_LIMIT}
                getData={(params) => getContactData(params)}
                columnData={columnDefs}
                searchColumns={['name']}
                defaultColParams={defaultColDef}
                isLoading={getContactsLoading}
                allowMultipleSelect
                setSearchText={setSearchText}
              />
            </div>
          )}
        </AuthGuard>

        {/* delete contact modal */}
        {openModal.delete && (
          <DeleteModal
            closeModal={closeModal}
            isOpen={openModal.delete}
            isLoading={destroyContactLoading}
            deleteOnSubmit={() =>
              hardDeletedContact({
                selectedIds,
                afterDelete: () => {
                  refreshTable();
                  closeModal();
                },
              })
            }
            moduleName={
              selectedIds.length > 1 ? 'these contacts' : 'this contact'
            }
          />
        )}
      </>
    );
  }
);

export default ContactTrash;
