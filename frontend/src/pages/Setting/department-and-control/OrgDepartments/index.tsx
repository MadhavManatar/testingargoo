// ** Import Packages **
import { useRef, useState } from 'react';

// ** Components **
import Button from 'components/Button';
import DeleteButton from 'components/DeleteComponents/DeleteButton';
import DeleteModal from 'components/DeleteComponents/DeleteModal';
import Icon from 'components/Icon';
import TableInfiniteScroll, {
  AgGridTableRef,
  PaginationParams,
  agGridSelectedProps,
} from 'components/TableInfiniteScroll';
import CardInfiniteScroll from 'components/TableInfiniteScroll/CardInfiniteScroll';
import EditOrgDepartmentModal from './components/EditOrgDepartmentModal';

// ** Hooks **
import useSelectAll from 'hooks/selectAll';
import useInfiniteScrollInfo from 'hooks/useInfiniteScrollInfo';
import useWindowDimensions from 'hooks/useWindowDimensions';

// ** Services **
import {
  useDeleteOrgDepartmentMutation,
  useLazyGetOrgDepartmentsQuery,
} from 'redux/api/orgDepartmentApi';

// ** Constants **
import { BREAD_CRUMB } from 'constant';

// ** Other **
import { debounce } from 'utils/util';
import { LISTING_DATA_LIMIT } from 'constant/dataLimit.constant';
import Breadcrumbs from 'components/Breadcrumbs';
import useOrgDepartmentsColumns from './hooks/useOrgDepartmentsColumns';
import AddOrgDepartment from './components/AddOrgDepartment';

const OrgDepartments = () => {
  // ** Hooks **
  const tableRef = useRef<AgGridTableRef>(null);

  // ** States **
  const [openModal, setModal] = useState<{
    add: boolean;
    edit: boolean;
    id?: number | null;
  }>({ add: false, edit: false });
  const [deleteModal, setDeleteModal] = useState(false);
  const [dataInfo, setDataInfo] = useState<agGridSelectedProps>([]);

  const [searchData, setSearchData] = useState<{
    searchText: string;
    searchFields: string;
  }>({ searchText: '', searchFields: '' });

  // ** Apis ** //
  const [getOrgDepartments, { isLoading }] = useLazyGetOrgDepartmentsQuery();
  const [deleteOrgDepartmentAPI, { isLoading: deleteLoading }] =
    useDeleteOrgDepartmentMutation();

  // ** Custom Hooks **
  const { isMobileView } = useWindowDimensions();

  const { loading, perPage, items, setPerPage, setItems } =
    useInfiniteScrollInfo({
      getData: getOrgDepartmentsData,
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

  const { columnDefs, defaultColDef } = useOrgDepartmentsColumns({
    selectionRef,
    isCheckAllRef,
    setIsCheckAll,
    isCheckAll,
    isLoading: false,
    disabled,
    setSelectionList,
    setModal,
    openDeleteOrgDepartmentModal,
    isSelectionDisabled: !dataInfo.length,
  });

  async function getOrgDepartmentsData(
    params: PaginationParams = { page: 1, limit: LISTING_DATA_LIMIT }
  ) {
    const { data, error } = await getOrgDepartments(
      {
        params: {
          'include[creator]': 'id,first_name,last_name,full_name',
        },
      },
      true
    );

    let tableData = { rowData: [], rowCount: 0 };

    if (data && !error) {
      tableData = { rowData: data?.rows, rowCount: data.count };
      if (params.page === 1) {
        setDataInfo([...tableData.rowData]);
      } else {
        setDataInfo((prev) => [...prev, ...tableData.rowData]);
      }
    }

    return tableData;
  }

  const deleteOrgDepartments = async () => {
    const data = await deleteOrgDepartmentAPI({
      data: { allId: selectedIds },
    });

    if ('data' in data && !('error' in data)) {
      setItems([]);
      setPerPage({ ...perPage, page: 1 });
      refreshTable();
      setIsCheckAll(false);
      closeDeleteModal();
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

  const closeDeleteModal = () => {
    setDeleteModal(false);
    selectionRef.current = {};
    setSelectionList({});
  };

  function openDeleteOrgDepartmentModal() {
    setDeleteModal(true);
  }
  const closeModal = () => setModal({ edit: false, add: false });

  const openAddModal = () => setModal({ edit: false, add: true });

  return (
    <>
      <Breadcrumbs path={BREAD_CRUMB.orgDepartmentSetting} />
      <div className="page__ActionHeader setting__contactType justify-between mb-0">
        <div className="inner__wrapper flex flex-wrap w-full justify-between">
          <div className="header__searchBox w-[255px] lg:w-[calc(100%_-_350px)] sm:w-full sm:flex">
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
              Org Department
            </h3>
            {!isMobileView && selectedIds.length ? (
              <DeleteButton
                openDeleteModal={() => openDeleteOrgDepartmentModal()}
                isLoading={isLoading || deleteLoading}
                moduleName={selectedIds.length > 1 ? 'Job Roles' : 'Job Role'}
              />
            ) : null}

            <Button
              className="i__Button primary__Btn smaller__with__icon h-[44px] px-[22px] ml-[10px] 3xl:h-[36px] lg:ml-0 sm:w-[calc(50%_-_5px)] sm:ml-[5px] sm:mb-[10px] sm:text-[12px]"
              onClick={() => openAddModal()}
              isDisabled={isLoading}
            >
              Add Org Department
            </Button>
          </div>
        </div>
      </div>
      {isMobileView ? (
        <div className="settingDetails__M__wrapper contactType border border-[#CCCCCC]/50 rounded-[12px] p-[12px]">
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
          ref={tableRef}
          rowDataLimit={LISTING_DATA_LIMIT}
          getData={(params) => getOrgDepartmentsData(params)}
          columnData={columnDefs}
          searchColumns={['name']}
          defaultColParams={defaultColDef}
          isLoading={isLoading}
          allowMultipleSelect
        />
      )}

      {openModal.add && (
        <AddOrgDepartment
          isOpen={openModal.add}
          setOrgDepartmentInfo={setDataInfo}
          closeModal={closeModal}
          onAdd={refreshTable}
        />
      )}
      {openModal.edit && (
        <EditOrgDepartmentModal
          isOpen={openModal.edit}
          setOrgDepartmentInfo={setDataInfo}
          closeModal={closeModal}
          onEdit={refreshTable}
          id={openModal.id || 0}
        />
      )}
      <DeleteModal
        isOpen={deleteModal}
        deleteOnSubmit={deleteOrgDepartments}
        isLoading={deleteLoading}
        closeModal={() => closeDeleteModal()}
        moduleName={
          selectedIds.length > 1 ? 'these contact job roles' : 'this job role'
        }
      />
    </>
  );
};

export default OrgDepartments;
