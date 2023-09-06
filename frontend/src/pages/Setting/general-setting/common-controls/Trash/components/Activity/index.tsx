// ** Import Packages ** //
import {
  ChangeEvent,
  Dispatch,
  forwardRef,
  SetStateAction,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

// ** Components ** //

import TableInfiniteScroll, {
  agGridSelectedProps,
  AgGridTableRef,
  PaginationParams,
} from 'components/TableInfiniteScroll';
import CardInfiniteScroll from 'components/TableInfiniteScroll/CardInfiniteScroll';
import AuthGuard from 'pages/auth/components/AuthGuard';

// ** Hooks ** //
import useSelectAll from 'hooks/selectAll';
import useInfiniteScrollInfo from 'hooks/useInfiniteScrollInfo';
import useWindowDimensions from 'hooks/useWindowDimensions';

import {
  BasicPermissionTypes,
  ModuleNames,
} from 'constant/permissions.constant';

// ** Other ** //
import useActivityTrash from './useActivitieTrashColumn';
import DeleteModal from 'components/DeleteComponents/DeleteModal';
import { entityModuleRefType } from '../..';
import { useHardDelete } from '../../hooks/useHardDelete';
import { useRestore } from '../../hooks/useRestore';
import { useLazyGetActivitiesQuery } from 'redux/api/activityApi';
import {
  LISTING_DATA_LIMIT,
  POLLING_INTERVAL,
} from 'constant/dataLimit.constant';

interface Props {
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

const ActivitiesTrash = forwardRef<entityModuleRefType, Props>(
  ({ setSelectedIds, searchData, searchText, setSearchText, setActionBtnState }: Props, ref) => {
    // ** Ref **
    const tableRef = useRef<AgGridTableRef>(null);

    // ** States **
    const [currentPage, setCurrentPage] = useState(1);
    const [openModal, setOpenModal] = useState<{
      delete: boolean;
    }>({ delete: false });
    const [dataInfo, setDataInfo] = useState<agGridSelectedProps>([]);

    // ** Custom Hooks **
    const { hardDeletedActivities, destroyActivityLoading } = useHardDelete();
    const { restoreActivity } = useRestore();
    const { isMobileView } = useWindowDimensions();
    const {
      isCheckAll,
      isCheckAllRef,
      setSelectionList,
      selectionRef,
      setIsCheckAll,
      selectedIds,
    } = useSelectAll({ data: dataInfo });
    const { getActivitiesLoading, getActivityData } = useGetActivityHook({
      setDataInfo,
      currentPage,
    });
    const { loading, perPage, items, setPerPage, setItems } =
      useInfiniteScrollInfo({
        getData: getActivityData,
        searchData,
      });

    const restoreActivitys = (id?: number) => {
      restoreActivity({
        afterRestore: refreshTable,
        selectedIds: id ? [id] : selectedIds,
      });
    };
    // **
    const { columnDefs, defaultColDef } = useActivityTrash({
      selectionRef,
      isCheckAllRef,
      setIsCheckAll,
      disabled: getActivitiesLoading,
      isCheckAll,
      setSelectionList,
      openDeleteActivityModal,
      restoreData: restoreActivitys,
      isSelectionDisabled: !dataInfo.length,
      setOpenModal,
      setActionBtnState
    });

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

    const closeModal = () => {
      setOpenModal({
        delete: false,
      });
      selectionRef.current = {};
      setSelectionList({});
    };

    function openDeleteActivityModal() {
      setOpenModal({ delete: true });
    }

    const refreshTable = () => {
      tableRef.current?.refreshData();
      if (isMobileView) {
        setPerPage({ ...perPage, page: 1 });
        setItems([]);
      }
    };

    useImperativeHandle(ref, () => ({
      openDeleteModal: openDeleteActivityModal,
      restoreData: restoreActivitys,
    }));

    return (
      <>
        {/* Table */}
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
                columnData={columnDefs}
                setPerPage={setPerPage}
              />
            </div>
          ) : (
            <div className="activity__page__ag__table">
              <TableInfiniteScroll
                setCurrentPage={setCurrentPage}
                ref={tableRef}
                rowDataLimit={LISTING_DATA_LIMIT}
                getData={(params) => getActivityData(params)}
                columnData={columnDefs}
                searchColumns={['topic']}
                defaultColParams={defaultColDef}
                isLoading={getActivitiesLoading}
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
            isLoading={destroyActivityLoading}
            deleteOnSubmit={() =>
              hardDeletedActivities({
                selectedIds,
                afterDelete: () => {
                  refreshTable();
                  closeModal();
                },
              })
            }
            moduleName={
              selectedIds.length > 1 ? 'these Activitys' : 'this Activity'
            }
          />
        )}
      </>
    );
  }
);

export default ActivitiesTrash;

type UseGetActivityHookProps = {
  currentPage: number;
  setDataInfo: Dispatch<SetStateAction<agGridSelectedProps>>;
};

const useGetActivityHook = (props: UseGetActivityHookProps) => {
  const { setDataInfo, currentPage } = props;

  // ** APIS **
  const [getActivities, { isLoading: getActivitiesLoading }] =
    useLazyGetActivitiesQuery({
      pollingInterval: currentPage === 1 ? POLLING_INTERVAL : 0,
    });

  async function getActivityData(
    params: PaginationParams = { page: 1, limit: LISTING_DATA_LIMIT }
  ) {
    const { data, error } = await getActivities(
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

  return {
    getActivityData,
    getActivitiesLoading,
  };
};
