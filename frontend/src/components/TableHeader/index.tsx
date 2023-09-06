// ** Import Packages **
import React, { useEffect, useRef, useState } from 'react';
import { OnChangeValue } from 'react-select';

// ** Components **
import {
  columnViewInterface,
  columnsDataInterface,
} from 'components/ColumnViewListDropDown';
import FilterColumnModal from './components/FilterColumnModal';
import ManageColumnModal from './components/ManageColumnModal';
import ViewList from './components/ViewList';
import { Option } from 'components/FormField/types/formField.types';
import { updateArgType } from './types';
import DeleteModal from 'components/DeleteComponents/DeleteModal';

// ** Type **
import {
  FiltersDataInterface,
  selectOptionsInterface,
  sortDataInterface,
} from 'components/ColumnManageModal/types/column.types';
import SortColumnModal from './components/SortColumnModal';

interface propsInterface {
  total: number;
  modelName: string;
  collectionName: string;
  searchValue: string;
  isDataUpdated: boolean;
  children: JSX.Element | JSX.Element[];
  isPipeLine?: boolean;
  pipelineOptions?: Option[];
  selectedPipeline?: any;
  createPermission?: boolean;
  dataLoading?: boolean;
  dealsView?: string;
  deletePermission?: boolean;
  selectedIds?: number[];
  selectedColumnView: columnViewInterface;
  setSelectedColumnView: (
    value: columnViewInterface,
    isEditModalOpen?: boolean
  ) => void;
  onHandleUpdateData: (args: {
    columnData: columnViewInterface;
    should_update: boolean;
    is_pin?: boolean;
    is_locked?: boolean;
  }) => void;
  onHandleSearch: (e: React.FormEvent<HTMLInputElement>) => void;
  openViewModal: () => void;
  deleteMethod?: () => void;
  mailMethod?: () => void;
  onChangePipeLine?: (selectedOption: OnChangeValue<Option, boolean>) => void;
  // columnListHeight?:number;
  setSpacing?: (value: { height: number; class: string }) => void;
  onSave: () => void;
  onSaveAs: () => void;
  isViewUpdate: boolean;
}

const sortInitData = {
  column: undefined,
  type: 'asc',
};
const defaultModal = {
  sortBy: false,
  filterBy: false,
  manageColumn: false,
  menu: false,
  columnViews: false,
  columnViewsMore: false,
  delete: false,
};

const TableHeader = (props: propsInterface) => {
  const {
    total,
    children,
    modelName,
    searchValue,
    isDataUpdated,
    onHandleSearch,
    openViewModal,
    selectedColumnView,
    setSelectedColumnView,
    collectionName,
    isPipeLine,
    pipelineOptions,
    selectedPipeline,
    createPermission,
    deletePermission,
    dataLoading,
    selectedIds,
    dealsView,
    deleteMethod,
    mailMethod,
    onChangePipeLine,
    onHandleUpdateData,
    // columnListHeight,
    setSpacing,
    onSave,
    onSaveAs,
    isViewUpdate,
  } = props;

  // ** States **
  const [openModal, setOpenModal] = useState(defaultModal);
  const [columnsOptionData, setColumnsOptionsData] = useState<
    selectOptionsInterface[]
  >([]);
  const [apiColumnsData, setApiColumnsData] = useState<columnsDataInterface[]>(
    []
  );
  const [sortsData, setSortsData] = useState<sortDataInterface[]>([
    sortInitData,
  ]);
  const [filtersData, setFiltersData] = useState<FiltersDataInterface>({});
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);

  const onHandleUpdateRef = useRef<
    ((type: updateArgType, data?: columnsDataInterface[]) => void) | null
  >(null);
  const onHandleDeleteRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    setSortsData(
      selectedColumnView?.sort?.length > 0
        ? selectedColumnView?.sort
        : [sortInitData]
    );
  }, [selectedColumnView?.sort]);

  const closeModal = () => {
    setOpenModal(defaultModal);
    setSortsData(
      selectedColumnView?.sort?.length > 0
        ? selectedColumnView?.sort
        : [sortInitData]
    );
    setFiltersData(selectedColumnView?.filter);
  };

  const openModalHandler = (openModalItem: { [key: string]: boolean }) => {
    setOpenModal({
      ...defaultModal,
      ...openModalItem,
    });
  };

  return (
    <div className="page__topHeader page__topHeader__account bg-white rounded-[10px] mb-[30px] shadow-[0px_0px_0px_0px_#00000005,_4px_5px_14px_0px_#00000005,_16px_20px_26px_0px_#00000005,_37px_45px_35px_0px_#00000003,_65px_80px_41px_0px_#0000,_102px_125px_45px_0px_#0000]">
      <ViewList
        total={total}
        modelName={modelName}
        isPipeLine={isPipeLine}
        searchValue={searchValue}
        selectedPipeline={selectedPipeline}
        pipelineOptions={pipelineOptions}
        onChangePipeLine={onChangePipeLine}
        openModalHandler={openModalHandler}
        onHandleSearch={onHandleSearch}
        openViewModal={openViewModal}
        deleteMethod={deleteMethod}
        mailMethod={mailMethod}
        createPermission={createPermission}
        deletePermission={deletePermission}
        dataLoading={dataLoading}
        selectedIds={selectedIds}
        dealsView={dealsView}
        selectedColumnView={selectedColumnView}
        setSelectedColumnView={setSelectedColumnView}
        closeModal={closeModal}
        collectionName={collectionName}
        filtersData={filtersData}
        setFiltersData={setFiltersData}
        isDataUpdated={isDataUpdated}
        sortsData={sortsData}
        onHandleUpdateData={onHandleUpdateData}
        setApiColumnsData={setApiColumnsData}
        setColumnsOptionsData={setColumnsOptionsData}
        onHandleUpdateRef={onHandleUpdateRef}
        onHandleDeleteRef={onHandleDeleteRef}
        // columnListHeight={columnListHeight}
        setSpacing={setSpacing}
        setIsLoadingDelete={setIsLoadingDelete}
        onSave={onSave}
        onSaveAs={onSaveAs}
        isViewUpdate={isViewUpdate}
      >
        {children}
      </ViewList>

      {openModal.sortBy && (
        <SortColumnModal
          closeModal={closeModal}
          columOptions={columnsOptionData}
          sortsData={sortsData}
          setSortsData={setSortsData}
          apiColumnsData={apiColumnsData}
          onHandleSaveData={() =>
            onHandleUpdateRef.current &&
            onHandleUpdateRef.current(updateArgType.SORT)
          }
        />
      )}
      {openModal.filterBy && (
        <FilterColumnModal
          closeModal={closeModal}
          columOptions={columnsOptionData}
          filtersData={filtersData}
          setFiltersData={setFiltersData}
          onHandleSaveData={() =>
            onHandleUpdateRef.current &&
            onHandleUpdateRef.current(updateArgType.FILTER)
          }
        />
      )}
      {openModal.manageColumn && (
        <ManageColumnModal
          closeModal={closeModal}
          SelectedColumnData={selectedColumnView}
          apiColumnsData={apiColumnsData}
          onHandleSaveData={(data) =>
            onHandleUpdateRef.current &&
            onHandleUpdateRef.current(updateArgType.COLUMNS, data)
          }
        />
      )}
      {openModal.delete && (
        <DeleteModal
          closeModal={closeModal}
          isOpen={openModal.delete}
          isLoading={isLoadingDelete}
          deleteOnSubmit={() =>
            onHandleDeleteRef.current && onHandleDeleteRef.current()
          }
          moduleName="this View"
        />
      )}
    </div>
  );
};

export default TableHeader;
