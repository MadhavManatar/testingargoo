// ** Import packages **
import { useRef, useState } from 'react';

// ** Components **
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
import SettingLayout from 'pages/Setting/components/SettingLayout';
import AddPhoneTypeModal from './components/AddPhoneTypeModal';
import EditPhoneTypeModal from './components/EditPhoneTypeModal';

// ** hooks **
import useSelectAll from 'hooks/selectAll';
import useInfiniteScrollInfo from 'hooks/useInfiniteScrollInfo';
import useSettingSidebarLinks from 'hooks/useSettingSidebarLinks';
import useWindowDimensions from 'hooks/useWindowDimensions';
import usePhoneTypeColumns from './hooks/usePhoneTypeColumns';

// ** services **
import {
  EntityAttributesEnum,
} from 'redux/api/entityAttributesApi';

// ** constants **
import { BREAD_CRUMB } from 'constant';
import { MODULE_PERMISSION } from 'constant/permissions.constant';
import { ToastMsg } from 'constant/toast.constants';

// ** Other **
import { debounce } from 'utils/util';
import {
  LISTING_DATA_LIMIT,
  POLLING_INTERVAL,
} from 'constant/dataLimit.constant';
import { useDeletePhoneTypesMutation, useLazyGetPhoneTypesQuery } from 'redux/api/phoneTypeApi';

const PhoneType = () => {
  // ** Ref **
  const tableRef = useRef<AgGridTableRef>(null);

  // ** States **
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setModal] = useState<{
    add: boolean;
    edit: boolean;
    id?: number | null;
  }>({ add: false, edit: false });
  const [dataInfo, setPhoneTypeInfo] = useState<agGridSelectedProps>([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [searchData, setSearchData] = useState<{
    searchText: string;
    searchFields: string;
  }>({ searchText: '', searchFields: '' });

  // ** APIS **
  const [getPhoneTypes, { isLoading }] = useLazyGetPhoneTypesQuery({
    pollingInterval: currentPage === 1 ? POLLING_INTERVAL : 0,
  });
  const [deletePhoneTypes, { isLoading: isDeleteLoading }] =
    useDeletePhoneTypesMutation();

  // ** custom hooks **
  const { isMobileView } = useWindowDimensions();
  const { filterCommonControlsSideBarLink } = useSettingSidebarLinks();

  const { loading, perPage, items, setPerPage, setItems } =
    useInfiniteScrollInfo({
      getData: getPhoneTypeData,
      searchData,
    });
  const {
    disabled,
    isCheckAll,
    isCheckAllRef,
    selectedIds,
    setSelectionList,
    selectionRef,
    setIsCheckAll,
  } = useSelectAll({ data: dataInfo });
  // **
  const { columnDefs, defaultColDef } = usePhoneTypeColumns({
    setModal,
    selectionRef,
    disabled,
    isLoading,
    isCheckAllRef,
    setIsCheckAll,
    isCheckAll,
    setSelectionList,
    openDeleteModal,
    isSelectionDisabled: !dataInfo.length,
  });

  async function getPhoneTypeData(params: PaginationParams = { page: 1 }) {
    const { data, error } = await getPhoneTypes(
      {
        data: {
          query: {
            ...params,
            ...MODULE_PERMISSION.CONTACT.read,
            'include[creator]': 'id,first_name,last_name,full_name',
            select: 'id,name,is_system,type',
            sort: '-id',
            'q[type]': EntityAttributesEnum.PHONE_TYPE,
          },
        },
      },
      true
    );


    let tableData = { rowData: [], rowCount: 0 };

    if (data && !error) {
      tableData = { rowData: data?.rows, rowCount: data.count };
      if (params.page === 1) {
        setPhoneTypeInfo([
          ...tableData.rowData.filter(
            (item: { is_system: boolean }) => !item.is_system
          ),
        ]);
      } else {
        setPhoneTypeInfo((prev) => [
          ...prev,
          ...tableData.rowData.filter(
            (item: { is_system: boolean }) => !item.is_system
          ),
        ]);
      }
    }
    return tableData;
  }

  const deletePhoneType = async () => {
    await deletePhoneTypes({
      data: {
        allId: selectedIds,
        type: EntityAttributesEnum.PHONE_TYPE,
        toastMsg:
          ToastMsg.settings.generalSettings.commonControls.phoneType.deleteMsg,
      },
      params: { ...MODULE_PERMISSION.CONTACT.delete },
    });
    setItems([]);
    setPerPage({ ...perPage, page: 1 });
    refreshTable();
    setIsCheckAll(false);
    closeDeleteModal();
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    selectionRef.current = {};
    setSelectionList({});
  };

  const closeModal = () => setModal({ edit: false, add: false });

  const openAddModal = () => setModal({ edit: false, add: true });

  const refreshTable = () => {
    tableRef.current?.refreshData();
    if (isMobileView) {
      setPerPage({ ...perPage, page: 1 });
      setItems([]);
    }
  };

  function openDeleteModal() {
    setDeleteModal(true);
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

  return (
    <SettingLayout
      title="Common Controls"
      breadCrumbPath={
        BREAD_CRUMB.settings.generalSettings.commonControls.phoneType
      }
      sideBarLinks={filterCommonControlsSideBarLink()}
    >
      <div className="page__ActionHeader setting__PhoneType justify-between mb-0">
        <div className="inner__wrapper flex flex-wrap w-full justify-between">
          <div className="header__searchBox w-[255px] lg:w-[calc(100%_-_330px)] sm:w-full sm:flex">
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
              Phone Type
            </h3>
            {!isMobileView && selectedIds.length ? (
              <DeleteButton
                openDeleteModal={() => openDeleteModal()}
                isLoading={isLoading || isDeleteLoading}
                moduleName={
                  selectedIds.length > 1 ? 'Phone Types' : 'Phone Type'
                }
              />
            ) : null}
            <Button
              className="primary__Btn smaller__with__icon h-[44px] px-[22px] ml-[10px] 3xl:h-[36px] lg:ml-0 sm:w-[calc(50%_-_5px)] sm:ml-[5px] sm:mb-[10px] sm:text-[12px]"
              onClick={() => openAddModal()}
              isDisabled={isLoading}
            >
              Add Phone Type
            </Button>
          </div>
        </div>
      </div>
      {isMobileView ? (
        <>
          <div className="settingDetails__M__wrapper phoneType border border-[#CCCCCC]/50 rounded-[12px] p-[12px]">
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
        </>
      ) : (
        <TableInfiniteScroll
          setCurrentPage={setCurrentPage}
          ref={tableRef}
          rowDataLimit={LISTING_DATA_LIMIT}
          getData={(params) => getPhoneTypeData(params)}
          columnData={columnDefs}
          searchColumns={['name']}
          defaultColParams={defaultColDef}
          isLoading={isLoading}
          allowMultipleSelect
        />
      )}

      {openModal.add ? (
        <AddPhoneTypeModal
          isOpen={openModal.add}
          closeModal={closeModal}
          setPhoneTypeInfo={setPhoneTypeInfo}
          onAdd={refreshTable}
        />
      ) : (
        <></>
      )}
      {openModal.edit ? (
        <EditPhoneTypeModal
          isOpen={openModal.edit}
          closeModal={closeModal}
          onEdit={refreshTable}
          id={openModal.id}
        />
      ) : (
        <></>
      )}
      <DeleteModal
        isOpen={deleteModal}
        deleteOnSubmit={deletePhoneType}
        isLoading={isDeleteLoading}
        closeModal={closeDeleteModal}
        moduleName={
          selectedIds.length > 1 ? 'these phone types' : 'this phone type'
        }
      />
    </SettingLayout>
  );
};

export default PhoneType;
