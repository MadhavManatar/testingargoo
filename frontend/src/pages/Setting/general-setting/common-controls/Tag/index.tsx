// ** import packages **
import { useRef, useState } from 'react';

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
import AddTagModal from './components/AddTagModal';
import CardInfiniteScroll from 'components/TableInfiniteScroll/CardInfiniteScroll';
import SettingLayout from 'pages/Setting/components/SettingLayout';

// ** hooks **
import useSelectAll from 'hooks/selectAll';
import useInfiniteScrollInfo from 'hooks/useInfiniteScrollInfo';
import useSettingSidebarLinks from 'hooks/useSettingSidebarLinks';
import useWindowDimensions from 'hooks/useWindowDimensions';
import useTagColumns from './hooks/useTagColumns';

// ** constants **
import { BREAD_CRUMB } from 'constant';
import { ToastMsg } from 'constant/toast.constants';

// ** Other **
import { debounce } from 'utils/util';
import { useDeleteTagsMutation, useLazyGetTagsQuery } from 'redux/api/tagApi';
import {
  LISTING_DATA_LIMIT,
  POLLING_INTERVAL,
} from 'constant/dataLimit.constant';

const TagControl = () => {
  // ** Ref **
  const tableRef = useRef<AgGridTableRef>(null);

  // ** States **
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState<{
    add: boolean;
    delete: boolean;
    changeColor: boolean;
  }>({ add: false, delete: false, changeColor: false });
  const [dataInfo, setDataInfo] = useState<agGridSelectedProps>([]);
  const [tagId, setTagId] = useState<number>();
  const [searchData, setSearchData] = useState<{
    searchText: string;
    searchFields: string;
  }>({ searchText: '', searchFields: '' });

  // ** APIS **
  const [deleteTags, { isLoading: deleteTagsLoading }] =
    useDeleteTagsMutation();

  // ** Custom Hooks **
  const { isMobileView } = useWindowDimensions();
  const [getTags, { isLoading: getTagsLoading }] = useLazyGetTagsQuery({
    pollingInterval: currentPage === 1 ? POLLING_INTERVAL : 0,
  });
  const { loading, perPage, items, setPerPage, setItems } =
    useInfiniteScrollInfo({
      getData: getTagData,
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
  const { filterCommonControlsSideBarLink } = useSettingSidebarLinks();
  const { columnDefs, defaultColDef } = useTagColumns({
    selectionRef,
    isCheckAllRef,
    setIsCheckAll,
    isCheckAll,
    disabled: getTagsLoading,
    setSelectionList,
    openEditTagModal,
    openChangeColorTagModal,
    openDeleteTagsModal,
    isSelectionDisabled: !dataInfo.length,
  });

  async function getTagData(
    params: PaginationParams = { page: 1, limit: LISTING_DATA_LIMIT }
  ) {
    const { data, error } = await getTags(
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
        setDataInfo([...tableData.rowData]);
      } else {
        setDataInfo((prev) => [...prev, ...tableData.rowData]);
      }
    }
    return tableData;
  }

  const closeModal = () => {
    setIsOpen({ add: false, delete: false, changeColor: false });
    setTagId(undefined);
    selectionRef.current = {};
    setSelectionList({});
  };
  function openDeleteTagsModal() {
    setIsOpen({ add: false, delete: true, changeColor: false });
  }
  function openChangeColorTagModal(id: number) {
    setTagId(id);
    setIsOpen({ add: false, delete: false, changeColor: true });
  }
  function openEditTagModal(id: number) {
    setTagId(id);
    setIsOpen({ add: true, delete: false, changeColor: false });
  }

  const onDeleteAll = async () => {
    const toastMsg =
      selectedIds.length > 1
        ? ToastMsg.settings.generalSettings.commonControls.tagControl.deleteMsg.replace(
          'Tag',
          'Tags'
        )
        : ToastMsg.settings.generalSettings.commonControls.tagControl.deleteMsg;

    const data = await deleteTags({
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
    <SettingLayout
      title="Common Controls"
      breadCrumbPath={
        BREAD_CRUMB.settings.generalSettings.commonControls.tagControl
      }
      sideBarLinks={filterCommonControlsSideBarLink()}
    >
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
              Tag Control
            </h3>

            {selectedIds.length ? (
              <DeleteButton
                openDeleteModal={() => openDeleteTagsModal()}
                isLoading={deleteTagsLoading}
                moduleName={selectedIds.length > 1 ? 'Tags' : 'Tag'}
              />
            ) : (
              <Button
                className="primary__Btn smaller__with__icon h-[44px] px-[22px] ml-[10px] 3xl:h-[36px] lg:ml-0 sm:w-[calc(50%_-_5px)] sm:ml-[5px] sm:mb-[10px] sm:text-[12px] hidden sm:inline-block"
                onClick={() => {
                  setIsOpen({
                    add: true,
                    delete: false,
                    changeColor: false,
                  });
                }}
                isDisabled={getTagsLoading}
              >
                Create Tag
              </Button>
            )}

            <Button
              className="primary__Btn smaller__with__icon h-[44px] px-[22px] ml-[10px] 3xl:h-[36px] lg:ml-0 sm:w-[calc(50%_-_5px)] sm:ml-[5px] sm:mb-[10px] sm:text-[12px] sm:hidden"
              onClick={() => {
                setIsOpen({ add: true, delete: false, changeColor: false });
              }}
              isDisabled={getTagsLoading}
            >
              Create Tag
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
          getData={(params) => getTagData(params)}
          columnData={columnDefs}
          searchColumns={['name']}
          defaultColParams={defaultColDef}
          isLoading={getTagsLoading}
          allowMultipleSelect
        />
      )}
      {isOpen.add || isOpen.changeColor ? (
        <AddTagModal
          id={tagId}
          isOpen={isOpen}
          setTagInfo={setDataInfo}
          onAdd={refreshTable}
          closeModal={closeModal}
        />
      ) : null}
      <DeleteModal
        closeModal={closeModal}
        isOpen={isOpen.delete}
        isLoading={deleteTagsLoading}
        deleteOnSubmit={() => onDeleteAll()}
        moduleName={selectedIds.length > 1 ? 'these tags' : 'this tag'}
      />
    </SettingLayout>
  );
};

export default TagControl;
