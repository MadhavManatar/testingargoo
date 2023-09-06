import React, {
  ChangeEvent,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import AuthGuard from 'pages/auth/components/AuthGuard';
import CardInfiniteScroll from 'components/TableInfiniteScroll/CardInfiniteScroll';
import TableInfiniteScroll, {
  AgGridTableRef,
  PaginationParams,
  agGridSelectedProps,
} from 'components/TableInfiniteScroll';
import DeleteModal from 'components/DeleteComponents/DeleteModal';
import useSelectAll from 'hooks/selectAll';
import { entityModuleRefType } from '..';
import useWindowDimensions from 'hooks/useWindowDimensions';
import usePermission from 'hooks/usePermission';
import useAllTrashColumn from './useAllTrashColumn';
import useInfiniteScrollInfo from 'hooks/useInfiniteScrollInfo';
import { useHardDelete } from '../hooks/useHardDelete';
import { useRestore } from '../hooks/useRestore';
import _ from 'lodash';
import { ModuleNames } from 'constant/permissions.constant';
import { useLazyGetAllTrashDataQuery } from 'redux/api/trashApi';
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

const All = forwardRef<entityModuleRefType, Props>(
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
    const [allData, setAllData] = useState<agGridSelectedProps>([]);
    const [openModal, setOpenModal] = useState<{
      delete: boolean;
      id?: number;
    }>({ delete: false });

    // ** API **
    const { readAllPermission } = usePermission();
    const { width } = useWindowDimensions();
    const [getAllTrashDataAPI, { isLoading: getAllLoading, currentData }] =
      useLazyGetAllTrashDataQuery({
        pollingInterval: currentPage === 1 ? POLLING_INTERVAL : 0,
      });

    // ** Custom Hooks **
    const { hardDeleteLead, destroyLeadLoading } = useHardDelete();
    const { hardDeletedAccount } = useHardDelete();
    const { hardDeletedActivities, destroyActivityLoading } = useHardDelete();
    const { hardDeletedContact, destroyContactLoading } = useHardDelete();

    const { restoreLead } = useRestore();
    const { restoreContact } = useRestore();
    const { restoreAccount } = useRestore();
    const { restoreActivity } = useRestore();

    const { loading, perPage, items, setPerPage, setItems } =
      useInfiniteScrollInfo({
        getData: getAllTrashData,
        searchData,
      });

    const deleteLeadsLoading =
      destroyActivityLoading || destroyContactLoading || destroyLeadLoading;

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
    } = useSelectAll({ data: allData });
    const closeModal = () => {
      setOpenModal({
        delete: false,
        id: undefined,
      });
      selectionRef.current = {};
      setSelectionList({});
    };

    async function getAllTrashData(
      params: PaginationParams = { page: 1, limit: LISTING_DATA_LIMIT }
    ) {
      const { data, error } = await getAllTrashDataAPI(
        {
          data: {
            query: {
              sort: '-id',
              ...params,
            },
          },
        },
        true
      );
      let tableData = { rowData: [], rowCount: 0 };

      if (data && !error) {
        tableData = { rowData: data.rows, rowCount: data.count };
        if (params.page === 1) {
          setAllData([...tableData.rowData]);
        } else {
          setAllData((prev) => [...prev, ...tableData.rowData]);
        }
        setDisabled(false);
      }

      return tableData;
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
    function openDeleteAllModal(id?: number) {
      setOpenModal({
        delete: true,
        id: id ? +id : undefined,
      });
    }
    const clearSearch = () => {
      const event = {
        target: {
          value: '',
        },
      };
      tableRef?.current?.onChange?.(event as ChangeEvent<HTMLInputElement>);
    };

    useEffect(() => {
      refreshTable();
    }, [currentData]);
    useEffect(() => {
      const event = {
        target: {
          value: searchText,
        },
      };
      tableRef?.current?.onChange?.(event as ChangeEvent<HTMLInputElement>);
    }, [searchText]);

    useEffect(() => {
      setSelectedIds({
        ids: selectedIds,
        data: allData,
      });
    }, [JSON.stringify(selectedIds)]);

    useImperativeHandle(ref, () => ({
      openDeleteModal: openDeleteAllModal,
      restoreData,
      clearSearch,
    }));

    const generateModuleWiseIdArray = useCallback(
      (id?: number) => {
        const result = allData?.filter((obj) =>
          (id ? [id] : selectedIds).includes(+obj.id)
        );
        const moduleWiseData = _.groupBy(result, 'model_name');

        const leadIds =
          moduleWiseData[ModuleNames.LEAD]?.map(
            (val) => val?.model_record_id
          ) || [];
        const dealIds =
          moduleWiseData[ModuleNames.DEAL]?.map(
            (val) => val?.model_record_id
          ) || [];

        const accountIds =
          moduleWiseData[ModuleNames.ACCOUNT]?.map(
            (val) => val?.model_record_id
          ) || [];

        const contactIds =
          moduleWiseData[ModuleNames.CONTACT]?.map(
            (val) => val?.model_record_id
          ) || [];

        const activityIds =
          moduleWiseData[ModuleNames.ACTIVITY]?.map(
            (val) => val?.model_record_id
          ) || [];

        return { leadIds, dealIds, accountIds, contactIds, activityIds };
      },
      [openModal?.id, selectedIds]
    );

    const bothDelete = () => {
      const { accountIds, activityIds, contactIds, dealIds, leadIds } =
        generateModuleWiseIdArray(openModal?.id ? openModal?.id : undefined);
      const afterDelete = () => {
        closeModal();
        refreshTable();
      };

      if (leadIds?.length > 0) {
        hardDeleteLead({
          selectedIds: leadIds,
          is_deal: false,
          afterDelete,
        });
      }

      if (dealIds?.length > 0) {
        hardDeleteLead({
          selectedIds: dealIds,
          is_deal: true,
          afterDelete,
        });
      }

      if (accountIds?.length > 0) {
        hardDeletedAccount({
          selectedIds: accountIds,
          afterDelete,
        });
      }

      if (contactIds?.length > 0) {
        hardDeletedContact({
          selectedIds: contactIds,
          afterDelete,
        });
      }

      if (activityIds?.length > 0) {
        hardDeletedActivities({
          selectedIds: activityIds,
          afterDelete,
        });
      }
    };

    const restoreData = (id?: number) => {
      const { accountIds, activityIds, contactIds, dealIds, leadIds } =
        generateModuleWiseIdArray(id ? +id : undefined);
      if (leadIds?.length > 0) {
        restoreLead({
          selectedIds: leadIds,
          is_deal: false,
          afterRestore: refreshTable,
        });
      }
      if (dealIds?.length > 0) {
        restoreLead({
          selectedIds: dealIds,
          is_deal: true,
          afterRestore: refreshTable,
        });
      }

      if (accountIds?.length > 0) {
        restoreAccount({
          selectedIds: accountIds,
          afterRestore: refreshTable,
        });
      }

      if (contactIds?.length > 0) {
        restoreContact({
          selectedIds: contactIds,
          afterRestore: refreshTable,
        });
      }

      if (activityIds?.length > 0) {
        restoreActivity({
          selectedIds: activityIds,
          afterRestore: refreshTable,
        });
      }
    };

    const { columnDefs, defaultColDef } = useAllTrashColumn({
      selectionRef,
      isCheckAllRef,
      setIsCheckAll,
      disabled,
      isCheckAll,
      getAllLoading,
      setSelectionList,
      openDeleteAllModal,
      restoreData,
      setActionBtnState,
    });

    return (
      <>
        <AuthGuard isAccessible={readAllPermission}>
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
                getData={(params) => getAllTrashData(params)}
                columnData={columnDefs}
                searchColumns={['name']}
                defaultColParams={defaultColDef}
                isLoading={getAllLoading}
                allowMultipleSelect
                setSearchText={setSearchText}
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
            deleteOnSubmit={bothDelete}
            moduleName={selectedIds.length > 1 ? 'these Data' : 'this Data'}
          />
        )}
      </>
    );
  }
);

export default All;
