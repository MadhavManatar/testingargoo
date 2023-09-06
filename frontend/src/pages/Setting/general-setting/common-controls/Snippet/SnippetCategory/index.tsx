// ** import packages **
import { useEffect, useRef, useState } from 'react';

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
import AddSnippetCategoryModal from './components/AddSnippetCategoryModal';

// ** hooks **
import useSelectAll from 'hooks/selectAll';
import useInfiniteScrollInfo from 'hooks/useInfiniteScrollInfo';
import useWindowDimensions from 'hooks/useWindowDimensions';
import useSnippetCategoryColumns from './hook/useSnippetCategoryColumns';

// ** Type **
import { SnippetResponseType } from '../SnippetSetting/types/snippetText.types';

// ** constants **
import { ToastMsg } from 'constant/toast.constants';

// ** Other **
import { debounce } from 'utils/util';
import {
  useDeleteSnippetCategoryMutation,
  useLazyGetSnippetCategoryQuery,
} from 'redux/api/snippetCategoryApi';
import {
  LISTING_DATA_LIMIT,
  POLLING_INTERVAL,
} from 'constant/dataLimit.constant';

const SnippetCategory = () => {
  // ** Ref **
  const tableRef = useRef<AgGridTableRef>(null);

  // ** States **
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState<{
    addEdit: boolean;
    delete: boolean;
  }>({ addEdit: false, delete: false });
  const [dataInfo, setDataInfo] = useState<agGridSelectedProps>([]);
  const [snippetCategoryId, setSnippetCategoryId] = useState<number>();
  const [associatedSnippet, setAssociatedSnippet] =
    useState<SnippetResponseType[]>();
  const [searchData, setSearchData] = useState<{
    searchText: string;
    searchFields: string;
  }>({ searchText: '', searchFields: '' });

  // ** APIS **
  const [
    deleteSnippetCategoriesAPI,
    { isLoading: deleteSnippetCategoriesLoading },
  ] = useDeleteSnippetCategoryMutation();
  const [getSnippetCategories, { isLoading: getSnippetCategoriesLoading }] =
    useLazyGetSnippetCategoryQuery({
      pollingInterval: currentPage === 1 ? POLLING_INTERVAL : 0,
    });

  // ** Custom Hooks **
  const { isMobileView } = useWindowDimensions();
  const { loading, perPage, items, setPerPage, setItems } =
    useInfiniteScrollInfo({
      getData: getSnippetCategoriesData,
      searchData,
    });

  const {
    isCheckAll,
    isCheckAllRef,
    selectedIds,
    setSelectionList,
    selectionRef,
    setIsCheckAll,
    selectionList,
  } = useSelectAll({ data: dataInfo });

  // ** custom hooks **
  const { columnDefs, defaultColDef } = useSnippetCategoryColumns({
    selectionRef,
    isCheckAllRef,
    setIsCheckAll,
    isCheckAll,
    disabled: getSnippetCategoriesLoading,
    setSelectionList,
    openEditSnippetModal,
    openDeleteSnippetModal,
    isSelectionDisabled: !dataInfo.length,
  });

  useEffect(() => {
    if (Object.values(selectionList).length) {
      setAssociatedSnippet(Object.values(selectionList));
    }
  }, [selectionList]);

  async function getSnippetCategoriesData(
    params: PaginationParams = { page: 1, limit: LISTING_DATA_LIMIT }
  ) {
    const { data, error } = await getSnippetCategories(
      {
        data: {
          query: {
            'include[creator][select]': 'id,first_name,last_name',
            sort: 'name',
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
        setDataInfo([
          ...tableData.rowData.filter(
            (item: { is_system: boolean }) => !item.is_system
          ),
        ]);
      } else {
        setDataInfo((prev) => [
          ...prev,
          ...tableData.rowData.filter(
            (item: { is_system: boolean }) => !item.is_system
          ),
        ]);
      }
    }
    return tableData;
  }

  const closeModal = () => {
    setIsOpen({ addEdit: false, delete: false });
    setSnippetCategoryId(undefined);
    selectionRef.current = {};
    setSelectionList({});
  };

  function openDeleteSnippetModal() {
    setIsOpen({ addEdit: false, delete: true });
  }

  function openEditSnippetModal(id: number) {
    setSnippetCategoryId(id);
    setIsOpen({ addEdit: true, delete: false });
  }

  const onDeleteAll = async () => {
    const toastMsg =
      ToastMsg.settings.generalSettings.commonControls.snippet.snippetCategory.deleteMsg(
        selectedIds.length
      );

    const data = await deleteSnippetCategoriesAPI({
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
        searchFields: 'name',
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
              Snippet Category
            </h3>

            {selectedIds.length ? (
              <DeleteButton
                openDeleteModal={() => openDeleteSnippetModal()}
                isLoading={deleteSnippetCategoriesLoading}
                moduleName={selectedIds.length > 1 ? 'Categories' : 'Category'}
              />
            ) : (
              <Button
                className="primary__Btn smaller__with__icon h-[44px] px-[22px] ml-[10px] 3xl:h-[36px] lg:ml-0 sm:w-[calc(50%_-_5px)] sm:ml-[5px] sm:mb-[10px] sm:text-[12px] hidden sm:inline-block"
                onClick={() => setIsOpen({ addEdit: true, delete: false })}
                isDisabled={getSnippetCategoriesLoading}
              >
                Create Category
              </Button>
            )}

            <Button
              className="primary__Btn smaller__with__icon h-[44px] px-[22px] ml-[10px] 3xl:h-[36px] lg:ml-0 sm:w-[calc(50%_-_5px)] sm:ml-[5px] sm:mb-[10px] sm:text-[12px] sm:hidden"
              onClick={() => {
                setIsOpen({ addEdit: true, delete: false });
              }}
              isDisabled={getSnippetCategoriesLoading}
            >
              Create Category
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
          getData={(params) => getSnippetCategoriesData(params)}
          columnData={columnDefs}
          searchColumns={['name']}
          defaultColParams={defaultColDef}
          isLoading={getSnippetCategoriesLoading}
          allowMultipleSelect
        />
      )}
      {isOpen.addEdit && (
        <AddSnippetCategoryModal
          id={snippetCategoryId}
          isOpen={isOpen.addEdit}
          onAdd={() => refreshTable()}
          closeModal={() => closeModal()}
        />
      )}
      <DeleteModal
        closeModal={closeModal}
        isOpen={isOpen.delete}
        isLoading={deleteSnippetCategoriesLoading}
        deleteOnSubmit={() => onDeleteAll()}
        {...(associatedSnippet?.find(
          (snippet) => snippet?.snippet_text_count > 0
        )
          ? {
              customMessage: `Deleting ${
                selectedIds.length > 1 ? 'these categories' : 'this category'
              } will transfer all snippets in this task to General category.`,
            }
          : {
              moduleName:
                selectedIds.length > 1 ? 'these categories' : 'this category',
            })}
      />
    </>
  );
};

export default SnippetCategory;
