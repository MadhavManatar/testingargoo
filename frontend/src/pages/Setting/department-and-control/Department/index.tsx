// ** Import Packages **
import { Children, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ** components **
import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/Button';
import DaysFilterDropdown from 'components/DaysFilterDropdown';
import DeleteButton from 'components/DeleteComponents/DeleteButton';
import Dropdown from 'components/Dropdown';
import FormField from 'components/FormField';
import Icon from 'components/Icon';
import TableInfiniteScroll, {
  agGridSelectedProps,
  AgGridTableRef,
  PaginationParams,
} from 'components/TableInfiniteScroll';
import CardInfiniteScroll from 'components/TableInfiniteScroll/CardInfiniteScroll';
import AuthGuard from 'pages/auth/components/AuthGuard';

// ** hooks **
import useSelectAll from 'hooks/selectAll';
import useAuth from 'hooks/useAuth';
import useInfiniteScrollInfo from 'hooks/useInfiniteScrollInfo';
import useWindowDimensions from 'hooks/useWindowDimensions';
import useDepartmentColumns from './hooks/useDepartmentColumns';

// ** modal **
import DeleteModal from 'components/DeleteComponents/DeleteModal';

// ** Type **
import { SelectedDayRangeType } from 'components/DaysFilterDropdown/types/index.types';

// ** APIS **
import {
  useDeleteDepartmentMutation,
  useLazyGetDepartmentsQuery,
} from 'redux/api/departmentApi';

// ** constants **
import { BREAD_CRUMB, DATE_SLUG, TAB } from 'constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import {
  BasicPermissionTypes,
  ModuleNames,
} from 'constant/permissions.constant';

// ** Other **
import { debounce } from 'utils/util';
import {
  LISTING_DATA_LIMIT,
  POLLING_INTERVAL,
} from 'constant/dataLimit.constant';

const DepartmentList = () => {
  // ** hooks **
  const tableRef = useRef<AgGridTableRef>(null);
  const navigate = useNavigate();

  // ** State **
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDayRangeObj, setSelectedDayRangeObj] =
    useState<SelectedDayRangeType>({
      contacts: DATE_SLUG.THIRTY_DAYS,
    });
  const [deleteModal, setDeleteModal] = useState(false);
  const [days, setDays] = useState<string>();
  const [dataInfo, setDataInfo] = useState<agGridSelectedProps>([]);
  const currentDays = useRef<string>();

  const [isFilterable, setIsFilterable] = useState(false);
  const [searchData, setSearchData] = useState<{
    searchText: string;
    searchFields: string;
  }>({ searchText: '', searchFields: '' });

  // ** Custom hooks **
  const { hasAuthorized } = useAuth();
  const { isMobileView } = useWindowDimensions();

  // Custom Apis
  const [deleteDepartmentAPI, { isLoading: deleteDepartmentLoading }] =
    useDeleteDepartmentMutation();
  const [getDepartmentAPI, { isLoading }] = useLazyGetDepartmentsQuery({
    pollingInterval: currentPage === 1 ? POLLING_INTERVAL : 0,
  });

  const { loading, perPage, items, setPerPage, setItems } =
    useInfiniteScrollInfo({
      getData: getDepartmentAndControlData,
      searchData,
    });
  const {
    disabled,
    isCheckAll,
    isCheckAllRef,
    setSelectionList,
    selectedIds,
    selectionRef,
    setIsCheckAll,
  } = useSelectAll({ data: dataInfo });
  // **
  const { columnDefs, defaultColDef } = useDepartmentColumns({
    selectionRef,
    isCheckAllRef,
    setIsCheckAll,
    disabled,
    isCheckAll,
    setSelectionList,
    openDeleteModal,
    isSelectionDisabled: !dataInfo.length,
  });

  const readPermission = hasAuthorized([
    { module: ModuleNames.DEPARTMENT, type: BasicPermissionTypes.READ },
  ]);

  // ** useEffect **
  useEffect(() => {
    currentDays.current = days;
    refreshTable();
  }, [days]);

  async function getDepartmentAndControlData(
    params: PaginationParams = { page: 1, limit: LISTING_DATA_LIMIT }
  ) {
    const { data, error } = await getDepartmentAPI(
      {
        data: {
          ...(currentDays.current
            ? { 'q[created_at][gte]': currentDays.current }
            : {}),
          sort: '-id',
          ...params,
        },
      },
      true
    );

    let tableData = { rowData: [], rowCount: 0 };

    if (!error) {
      const { rows, count } = data;
      tableData = { rowData: rows, rowCount: count };
      if (params.page === 1) {
        setDataInfo([...tableData.rowData]);
      } else {
        setDataInfo((prev) => [...prev, ...tableData.rowData]);
      }
      setIsFilterable(data.count > 0);
    }

    return tableData;
  }

  const closeDeleteDepartmentModal = () => {
    setDeleteModal(false);
    selectionRef.current = {};
    setSelectionList({});
  };

  function openDeleteModal() {
    setDeleteModal(true);
  }

  const onDeleteDepartment = async () => {
    const data = await deleteDepartmentAPI({
      data: { allId: selectedIds },
    });
    if ('data' in data || !('error' in data)) {
      setItems([]);
      setPerPage({ ...perPage, page: 1 });
      refreshTable();
      setIsCheckAll(false);
      closeDeleteDepartmentModal();
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

  const List = useCallback((content: { close: () => void }) => {
    const { close } = content;
    return (
      <div className="items" onClick={close}>
        {Children.toArray(
          [0].map(() => (
            <>
              <div className="filter__wrapper">
                <div className="filter__box border-b border-b-[#000000]/10 pb-[12px] mb-[14px] last:border-b-0 last:pb-0 last:mb-0">
                  <h3 className='filter__heading text-[16px] text-black font-biotif__Medium relative mb-[10px] before:content-[""] before:absolute before:top-[3px] before:right-0 before:w-[8px] before:h-[8px] before:-rotate-45 before:border-l-[2px] before:border-l-black before:border-b-[2px] before:border-b-black'>
                    Filter
                  </h3>
                  <FormField
                    wrapperClass="mb-0"
                    type="radio"
                    name=""
                    options={[
                      {
                        label: 'All Time',
                        value: 'All Time',
                      },
                    ]}
                  />
                  <FormField
                    wrapperClass="mb-0"
                    type="radio"
                    name=""
                    options={[
                      {
                        label: 'last 7 days',
                        value: 'last 7 days',
                      },
                    ]}
                  />
                  <FormField
                    wrapperClass="mb-0"
                    type="radio"
                    name=""
                    options={[
                      {
                        label: 'last 30 days',
                        value: 'last 30 days',
                      },
                    ]}
                  />
                  <FormField
                    wrapperClass="mb-0"
                    type="radio"
                    name=""
                    options={[
                      {
                        label: 'last 6 Months',
                        value: 'last 6 Months',
                      },
                    ]}
                  />
                  <FormField
                    wrapperClass="mb-0"
                    type="radio"
                    name=""
                    options={[
                      {
                        label: 'last Year',
                        value: 'last Year',
                      },
                    ]}
                  />
                </div>
                <div className="filter__box border-b border-b-[#000000]/10 pb-[12px] mb-[14px] last:border-b-0 last:pb-0 last:mb-0">
                  <h3 className='filter__heading text-[16px] text-black font-biotif__Medium relative mb-[10px] before:content-[""] before:absolute before:top-[3px] before:right-0 before:w-[8px] before:h-[8px] before:-rotate-45 before:border-l-[2px] before:border-l-black before:border-b-[2px] before:border-b-black'>
                    View
                  </h3>
                  <FormField
                    wrapperClass="mb-0"
                    type="radio"
                    name=""
                    options={[
                      {
                        label: 'Card View',
                        value: 'Card View',
                      },
                    ]}
                  />
                  <FormField
                    wrapperClass="mb-0"
                    type="radio"
                    name=""
                    options={[
                      {
                        label: 'List View',
                        value: 'List View',
                      },
                    ]}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-[15px]">
                <button
                  className="bg-[#D9D9D9] text-[#2E3234] text-[12px] font-biotif__SemiBold py-[4px] px-[12px] rounded-[6px] duration-500 hover:bg-[#bfbfbf] hover:text-[#2E3234]"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-primaryColor text-[#ffffff] text-[12px] font-biotif__SemiBold py-[4px] px-[12px] rounded-[6px] duration-500 ml-[10px] hover:bg-primaryColor__hoverDark"
                >
                  Apply
                </button>
              </div>
            </>
          ))
        )}
      </div>
    );
  }, []);

  return (
    <>
      <Breadcrumbs path={BREAD_CRUMB.departmentSetting} />
      <div className="page__ActionHeader page__ActionHeader__department mb-0 lg:mt-[-10px] sm:mb-[15px] md:mt-0">
        <div className="inner__wrapper flex flex-wrap w-full justify-between">
          <div className="header__searchBox w-[255px] lg:w-full lg:flex lg:items-center">
            <div className="form__Group mb-[10px] lg:mb-0 lg:w-[calc(100%_-_183px)] lg:pr-[10px] sm:w-[calc(100%_-_179px)]">
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
            <Dropdown
              className="tippy__days__filter__mobile"
              placement="bottom"
              content={List}
            >
              <button className="hidden lg:block" type="button">
                <Icon
                  className="filter__btn cursor-pointer p-[10px] bg-[#E6E6E6] w-[36px] h-[36px] rounded-[6px] duration-500 hover:bg-[#c8c8c8] block sm:w-[32px] sm:h-[32px] sm:p-[9px]"
                  iconType="filterFilled"
                />
              </button>
            </Dropdown>
            <button
              className="text-[14px] font-biotif__SemiBold h-[36px] rounded-[6px] py-[4px] px-[12px] ml-[10px] bg-primaryColor text-white duration-500 hover:bg-primaryColor__hoverDark hidden lg:inline-block sm:h-[32px]"
              onClick={() =>
                navigate(PRIVATE_NAVIGATION.settings.department.create)
              }
            >
              New Department
            </button>
          </div>
          <div className="right inline-block lg:w-full lg:hidden">
            <div className="inline-flex items-center lg:flex lg:justify-between lg:w-full">
              <div className="deleteDrop__wrapper inline-flex items-center sm:w-1/2">
                <AuthGuard
                  permissions={[
                    {
                      module: ModuleNames.DEPARTMENT,
                      type: BasicPermissionTypes.DELETE,
                    },
                  ]}
                >
                  {selectedIds.length ? (
                    <DeleteButton
                      openDeleteModal={() => openDeleteModal()}
                      isLoading={deleteDepartmentLoading}
                      moduleName={
                        selectedIds.length > 1 ? 'Departments' : 'Department'
                      }
                    />
                  ) : (
                    <></>
                  )}
                </AuthGuard>
                <DaysFilterDropdown
                  selectedDayRangeObj={selectedDayRangeObj}
                  setDays={setDays}
                  isDisabled={!isFilterable}
                  modal={TAB.CONTACTS}
                  setSelectedDayRangeObj={setSelectedDayRangeObj}
                />
              </div>
              <div className="inline-block w-0" />
              <AuthGuard
                permissions={[
                  {
                    module: ModuleNames.DEPARTMENT,
                    type: BasicPermissionTypes.CREATE,
                  },
                ]}
              >
                <Button
                  className="primary__Btn smaller__with__icon h-[44px] px-[20px] ml-[10px] mb-[10px] sm:text-[12px] sm:px-[10px] sm:h-[38px] sm:ml-[5px] sm:w-[calc(50%_-_5px)]"
                  onClick={() =>
                    navigate(PRIVATE_NAVIGATION.settings.department.create)
                  }
                  isDisabled={isLoading}
                >
                  Add Department
                </Button>
              </AuthGuard>
            </div>
          </div>
        </div>
      </div>
      {isMobileView ? (
        <div className="ag__grid__mobile__department">
          <CardInfiniteScroll
            perPage={perPage}
            items={items}
            isLoading={loading}
            columnData={columnDefs}
            setPerPage={setPerPage}
          />
        </div>
      ) : (
        <div className="department__page__ag__table">
          <TableInfiniteScroll
            setCurrentPage={setCurrentPage}
            {...(readPermission && {
              onRowClickNavigateLink: `${PRIVATE_NAVIGATION.settings.department.edit}/`,
            })}
            ref={tableRef}
            rowDataLimit={LISTING_DATA_LIMIT}
            getData={(params) => getDepartmentAndControlData(params)}
            columnData={columnDefs}
            searchColumns={['name']}
            defaultColParams={defaultColDef}
            isLoading={isLoading}
            allowMultipleSelect={false}
          />
        </div>
      )}

      {/* delete user modal */}
      <AuthGuard
        permissions={[
          {
            module: ModuleNames.DEPARTMENT,
            type: BasicPermissionTypes.DELETE,
          },
        ]}
      >
        <DeleteModal
          isOpen={deleteModal}
          deleteOnSubmit={onDeleteDepartment}
          isLoading={deleteDepartmentLoading}
          closeModal={closeDeleteDepartmentModal}
          moduleName={
            selectedIds.length > 1 ? 'these departments' : 'this department'
          }
        />
      </AuthGuard>
    </>
  );
};

export default DepartmentList;
