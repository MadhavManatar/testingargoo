// ** import packages **
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

// ** Redux **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** components **
import Button from 'components/Button';
import DeleteButton from 'components/DeleteComponents/DeleteButton';
import DeleteModal from 'components/DeleteComponents/DeleteModal';
import Icon from 'components/Icon';
import TableInfiniteScroll, {
  agGridSelectedProps,
  AgGridTableRef,
  PaginationParams,
} from 'components/TableInfiniteScroll';
import CardInfiniteScroll from 'components/TableInfiniteScroll/CardInfiniteScroll';
import AddSnippetModal from './components/AddSnippetModal';

// ** hooks **
import useSelectAll from 'hooks/selectAll';
import useInfiniteScrollInfo from 'hooks/useInfiniteScrollInfo';
import useWindowDimensions from 'hooks/useWindowDimensions';
import useSnippetColumns from './hooks/useSnippetTextColumns';

// ** Services **
import {
  useDeleteSnippetSettingMutation,
  useLazyGetSnippetSettingQuery,
} from 'redux/api/snippetSettingApi';

// ** constants **
import { ToastMsg } from 'constant/toast.constants';

// ** Other **
import { debounce } from 'utils/util';
import {
  LISTING_DATA_LIMIT,
  POLLING_INTERVAL,
} from 'constant/dataLimit.constant';

const SnippetSetting = () => {
  // ** Store **
  const user = useSelector(getCurrentUser);

  // ** Ref **
  const tableRef = useRef<AgGridTableRef>(null);

  // ** States **
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState<{
    addEdit: boolean;
    delete: boolean;
  }>({ addEdit: false, delete: false });
  const [dataInfo, setDataInfo] = useState<agGridSelectedProps>([]);
  const [snippetId, setSnippetId] = useState<number>();

  const [searchData, setSearchData] = useState<{
    searchText: string;
    searchFields: string;
  }>({ searchText: '', searchFields: '' });

  // ** APIS **
  const [deleteSnippetAPI, { isLoading: deleteSnippetLoading }] =
    useDeleteSnippetSettingMutation();
  const [getSnippets, { isLoading: getSnippetsLoading }] =
    useLazyGetSnippetSettingQuery({
      pollingInterval: currentPage === 1 ? POLLING_INTERVAL : 0,
    });

  // ** Custom Hooks **
  const { isMobileView } = useWindowDimensions();
  const { loading, perPage, items, setPerPage, setItems } =
    useInfiniteScrollInfo({
      getData: getSnippetData,
      searchData,
    });

  const {
    isCheckAll,
    isCheckAllRef,
    selectedIds,
    setSelectionList,
    selectionRef,
    setIsCheckAll,
  } = useSelectAll({ data: dataInfo });

  // ** custom hooks **
  const { columnDefs, defaultColDef } = useSnippetColumns({
    selectionRef,
    isCheckAllRef,
    setIsCheckAll,
    isCheckAll,
    disabled: getSnippetsLoading,
    setSelectionList,
    openEditSnippetModal,
    openDeleteSnippetModal,
    isSelectionDisabled: !dataInfo.length,
  });

  async function getSnippetData(
    params: PaginationParams = { page: 1, limit: LISTING_DATA_LIMIT }
  ) {
    const { data, error } = await getSnippets(
      {
        data: {
          query: {
            'include[creator][select]': 'id,first_name,last_name',
            'include[snippet_category][select]': 'id,name',
            sort: 'title',
            ...params,
          },
        },
      },
      true
    );
    let tableData = { rowData: [], rowCount: 0 };
    if (data && !error) {
      tableData = { rowData: data.rows, rowCount: data.count };
      const filteredDataInfo = data.rows.filter(
        (dataObj: { created_by: number | undefined }) =>
          dataObj?.created_by === user?.id
      );
      if (params.page === 1) {
        setDataInfo([...filteredDataInfo]);
      } else {
        setDataInfo((prev) => [...prev, ...filteredDataInfo]);
      }
    }
    return tableData;
  }

  const closeModal = () => {
    setIsOpen({ addEdit: false, delete: false });
    setSnippetId(undefined);
    selectionRef.current = {};
    setSelectionList({});
  };

  function openDeleteSnippetModal() {
    setIsOpen({ addEdit: false, delete: true });
  }

  function openEditSnippetModal(id: number) {
    setSnippetId(id);
    setIsOpen({ addEdit: true, delete: false });
  }

  const onDeleteAll = async () => {
    const toastMsg =
      ToastMsg.settings.generalSettings.commonControls.snippet.snippetSetting.deleteMsg(
        selectedIds.length
      );

    const data = await deleteSnippetAPI({
      data: { allId: selectedIds, message: toastMsg },
    });

    if (!('error' in data)) {
      setItems([]);
      setPerPage({ ...perPage, page: 1 });
      refreshTable();
      closeModal();
      setIsCheckAll(false);
    }
  };

  const refreshTable = () => {
    tableRef.current?.refreshData();
    if (isMobileView) {
      setPerPage({ ...perPage, page: 1 });
      setItems([]);
    }
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    tableRef.current?.onChange?.(e);
    if (isMobileView) {
      setSearchData({
        ...searchData,
        searchText: e.target?.value.trim(),
        searchFields: 'title',
      });
    }
  };

  return (
    <>
      <div className="page__ActionHeader setting__tagControl justify-between mb-0">
        <div className="inner__wrapper flex flex-wrap w-full justify-between">
          <div className="header__searchBox w-[255px] lg:w-[calc(100%_-_243px)] sm:w-full sm:flex">
            <div className="form__Group mb-[10px] sm:w-full sm:mr-0">
              <div className="ip__form__hasIcon">
                <input
                  type="text"
                  onChange={debounce(onSearchChange)}
                  className="ip__input"
                  placeholder="Search here..."
                  maxLength={50}
                />
                <Icon
                  className="i__Icon grayscale"
                  iconType="searchStrokeIcon"
                />
              </div>
            </div>
          </div>
          <div className="flex action__buttons sm:w-full sm:items-start sm:justify-between">
            <h3 className="hidden text-[18px] leading-[24px] font-biotif__Medium text-black mb-[10px] max-w-[50%] whitespace-pre overflow-hidden text-ellipsis sm:inline-block sm:pr-[10px] sm:mt-[9px]">
              Snippet
            </h3>

            {selectedIds.length ? (
              <DeleteButton
                openDeleteModal={() => openDeleteSnippetModal()}
                isLoading={deleteSnippetLoading}
                moduleName={selectedIds.length > 1 ? 'Snippets' : 'Snippet'}
              />
            ) : (
              <Button
                className="primary__Btn smaller__with__icon h-[44px] px-[22px] ml-[10px] 3xl:h-[36px] lg:ml-0 sm:w-[calc(50%_-_5px)] sm:ml-[5px] sm:mb-[10px] sm:text-[12px] hidden sm:inline-block"
                onClick={() => setIsOpen({ addEdit: true, delete: false })}
                isDisabled={getSnippetsLoading}
              >
                Create Snippet
              </Button>
            )}

            <Button
              className="primary__Btn smaller__with__icon h-[44px] px-[22px] ml-[10px] 3xl:h-[36px] lg:ml-0 sm:w-[calc(50%_-_5px)] sm:ml-[5px] sm:mb-[10px] sm:text-[12px] sm:hidden"
              onClick={() => {
                setIsOpen({ addEdit: true, delete: false });
              }}
              isDisabled={getSnippetsLoading}
            >
              Create Snippet
            </Button>
          </div>
        </div>
      </div>

      {isMobileView ? (
        <div className="settingDetails__M__wrapper tagControl border border-[#CCCCCC]/50 rounded-[12px] p-[12px]">
          <div className="settingM__searchBox w-full">
            <div className="form__Group mb-0">
              <div className="ip__form__hasIcon">
                <input
                  type="text"
                  onChange={debounce(onSearchChange)}
                  className="ip__input"
                  placeholder="Search here..."
                  maxLength={50}
                />
                <Icon
                  className="i__Icon grayscale"
                  iconType="searchStrokeIcon"
                />
              </div>
            </div>
          </div>
          <CardInfiniteScroll
            perPage={perPage}
            items={items}
            isLoading={loading}
            columnData={columnDefs}
            setPerPage={setPerPage}
          />
        </div>
      ) : (
        <TableInfiniteScroll
          setCurrentPage={setCurrentPage}
          ref={tableRef}
          rowDataLimit={LISTING_DATA_LIMIT}
          getData={(params) => getSnippetData(params)}
          columnData={columnDefs}
          searchColumns={['title']}
          defaultColParams={defaultColDef}
          isLoading={getSnippetsLoading}
          allowMultipleSelect
        />
      )}
      {isOpen.addEdit && (
        <AddSnippetModal
          id={snippetId}
          isOpen={isOpen.addEdit}
          defaultValue={{ type: 'anywhere' }}
          onAdd={() => refreshTable()}
          closeModal={() => closeModal()}
        />
      )}
      <DeleteModal
        closeModal={closeModal}
        isOpen={isOpen.delete}
        isLoading={deleteSnippetLoading}
        deleteOnSubmit={() => onDeleteAll()}
        moduleName={selectedIds.length > 1 ? 'these snippets' : 'this snippet'}
      />
    </>
  );
};

export default SnippetSetting;
