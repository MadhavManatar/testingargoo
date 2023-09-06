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
import SettingLayout from 'pages/Setting/components/SettingLayout';
import AuthGuard from 'pages/auth/components/AuthGuard';
import AddContactTypeModal from './components/AddJobRoleModal';
import EditContactTypeModal from './components/EditJobRoleModal';

// ** Hooks **
import useSelectAll from 'hooks/selectAll';
import useInfiniteScrollInfo from 'hooks/useInfiniteScrollInfo';
import usePermission from 'hooks/usePermission';
import useWindowDimensions from 'hooks/useWindowDimensions';
import useContactTypeColumns from './hooks/useJobRoleColumns';

// ** Services **
import {
  EntityAttributesEnum,
} from 'redux/api/entityAttributesApi';

// ** Constants **
import { BREAD_CRUMB } from 'constant';
import { MODULE_PERMISSION } from 'constant/permissions.constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';
import { ToastMsg } from 'constant/toast.constants';

// ** Other **
import { debounce } from 'utils/util';
import {
  LISTING_DATA_LIMIT,
  POLLING_INTERVAL,
} from 'constant/dataLimit.constant';
import { useDeleteJobRoleMutation, useLazyGetJobRolesQuery } from 'redux/api/jobRoleApi';

const ContactType = () => {
  // ** Hooks **
  const tableRef = useRef<AgGridTableRef>(null);

  // ** States **
  const [currentPage, setCurrentPage] = useState(1);
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

  // ** APIS **
  const [getJobRoles, { isLoading }] = useLazyGetJobRolesQuery({
    pollingInterval: currentPage === 1 ? POLLING_INTERVAL : 0,
  });
  const [deleteJobRoleApi, { isLoading: isDeleteJobRoleLoading }] =
    useDeleteJobRoleMutation();

  // ** Custom Hooks **
  const { isMobileView } = useWindowDimensions();
  const { createContactPermission, deleteContactPermission } = usePermission();

  const { loading, perPage, items, setPerPage, setItems } =
    useInfiniteScrollInfo({
      getData: getContactTypeData,
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

  const { columnDefs, defaultColDef } = useContactTypeColumns({
    selectionRef,
    isCheckAllRef,
    setIsCheckAll,
    isCheckAll,
    isLoading,
    disabled,
    setSelectionList,
    setModal,
    openDeleteJobRoleModal,
    isSelectionDisabled: !dataInfo.length,
  });

  async function getContactTypeData(
    params: PaginationParams = { page: 1, limit: LISTING_DATA_LIMIT }
  ) {
    const { data, error } = await getJobRoles(
      {
        data: {
          query: {
            ...params,
            ...MODULE_PERMISSION.CONTACT.read,
            'q[type]': EntityAttributesEnum.JOB_ROLE,
            'include[creator]': 'id,first_name,last_name,full_name',
          },
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

  const deleteContactType = async () => {
    await deleteJobRoleApi({
      data: {
        allId: selectedIds,
        type: EntityAttributesEnum.JOB_ROLE,
        toastMsg: ToastMsg.settings.moduleSettings.contact.jobRole.deleteMsg,
      },
      params: { ...MODULE_PERMISSION.CONTACT.delete },
    });
    setItems([]);
    setPerPage({ ...perPage, page: 1 });
    refreshTable();
    setIsCheckAll(false);
    closeDeleteModal();
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
  function openDeleteJobRoleModal() {
    setDeleteModal(true);
  }
  const closeModal = () => setModal({ edit: false, add: false });

  const openAddModal = () => setModal({ edit: false, add: true });

  return (
    <SettingLayout
      title="Contact Settings"
      breadCrumbPath={BREAD_CRUMB.settings.moduleSetting.contact.role}
      sideBarLinks={SETTING_SIDEBAR.contactSetting}
    >
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
              Contact Job Role
            </h3>
            {!isMobileView && selectedIds.length ? (
              <AuthGuard isAccessible={deleteContactPermission}>
                <DeleteButton
                  openDeleteModal={() => openDeleteJobRoleModal()}
                  isLoading={isLoading || isDeleteJobRoleLoading}
                  moduleName={selectedIds.length > 1 ? 'Job Roles' : 'Job Role'}
                />
              </AuthGuard>
            ) : null}
            <AuthGuard isAccessible={createContactPermission}>
              <Button
                className="i__Button primary__Btn smaller__with__icon h-[44px] px-[22px] ml-[10px] 3xl:h-[36px] lg:ml-0 sm:w-[calc(50%_-_5px)] sm:ml-[5px] sm:mb-[10px] sm:text-[12px]"
                onClick={() => openAddModal()}
                isDisabled={isLoading || isDeleteJobRoleLoading}
              >
                Create Job Role
              </Button>
            </AuthGuard>
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
          setCurrentPage={setCurrentPage}
          ref={tableRef}
          rowDataLimit={LISTING_DATA_LIMIT}
          getData={(params) => getContactTypeData(params)}
          columnData={columnDefs}
          searchColumns={['name']}
          defaultColParams={defaultColDef}
          isLoading={isLoading}
          allowMultipleSelect
        />
      )}

      {openModal.add && (
        <AddContactTypeModal
          isOpen={openModal.add}
          setContactTypeInfo={setDataInfo}
          closeModal={closeModal}
          onAdd={refreshTable}
        />
      )}
      {openModal.edit && (
        <EditContactTypeModal
          isOpen={openModal.edit}
          setContactTypeInfo={setDataInfo}
          closeModal={closeModal}
          onEdit={refreshTable}
          id={openModal.id}
        />
      )}
      <DeleteModal
        isOpen={deleteModal}
        deleteOnSubmit={deleteContactType}
        isLoading={isDeleteJobRoleLoading}
        closeModal={() => closeDeleteModal()}
        moduleName={
          selectedIds.length > 1 ? 'these contact job roles' : 'this job role'
        }
      />
    </SettingLayout>
  );
};

export default ContactType;
