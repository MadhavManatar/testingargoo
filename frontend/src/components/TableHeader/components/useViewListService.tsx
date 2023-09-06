// ** external packages ***
import { useEffect, useState } from 'react';

// ** internal component **
import {
  columnsDataInterface,
  columnViewInterface,
} from 'components/ColumnViewListDropDown';

// ** RTK query **
import {
  useDeleteColumnViewMutation,
  useLazyGetAllColumnQuery,
  useLazyGetAllColumnViewAPIQuery,
} from 'redux/api/columnApi';

// ** types **
import {
  FiltersDataInterface,
  selectOptionsInterface,
  sortDataInterface,
} from 'components/ColumnManageModal/types/column.types';
import { updateArgType, updateViewArgType } from '../types';

interface Props {
  modelName: string;
  closeModal: () => void;
  collectionName: string;
  sortsData: sortDataInterface[];
  filtersData: FiltersDataInterface;
  selectedColumnView: columnViewInterface;
  isDataUpdated: boolean;
  setFiltersData: React.Dispatch<React.SetStateAction<FiltersDataInterface>>;
  setColumnsOptionsData: React.Dispatch<
    React.SetStateAction<selectOptionsInterface[]>
  >;
  setApiColumnsData: React.Dispatch<
    React.SetStateAction<columnsDataInterface[]>
  >;
  onHandleUpdateData: (args: {
    columnData: columnViewInterface;
    should_update: boolean;
    is_pin?: boolean;
    is_locked?: boolean;
  }) => void;
  setSelectedColumnView: (
    value: columnViewInterface,
    isEditModalOpen?: boolean
  ) => void;
}

const useViewListService = (props: Props) => {
  const {
    modelName,
    sortsData,
    closeModal,
    filtersData,
    isDataUpdated,
    setFiltersData,
    collectionName,
    setApiColumnsData,
    selectedColumnView,
    onHandleUpdateData,
    setColumnsOptionsData,
    setSelectedColumnView,
  } = props;

  // ** states **
  const [columnViewsData, setColumnViewData] = useState<columnViewInterface[]>(
    []
  );

  // ** Apis **
  const [getAllColumnAPI] = useLazyGetAllColumnQuery();

  const [deleteColumnViewAPI, { isLoading }] = useDeleteColumnViewMutation();

  const [getAllColumnViewAPI, { currentData, isFetching }] =
    useLazyGetAllColumnViewAPIQuery();

  useEffect(() => {
    getAllColumnView();
  }, [isDataUpdated]);

  useEffect(() => {
    if (currentData && !isFetching) {
      setInitialColumnViewData();
    }
  }, [currentData, isFetching]);

  const setInitialColumnViewData = () => {
    setColumnViewData([
      ...(currentData?.pin_views || []),
      ...(currentData?.unPined_views || []),
    ]);

    if (selectedColumnView?.id === -1) {
      setSelectedColumnView(currentData?.views[0]);
    } else {
      const data1 =
        currentData?.views?.find(
          (view: columnViewInterface) => view?.id === selectedColumnView?.id
        ) || setSelectedColumnView(currentData?.views[0]);
      setSelectedColumnView(data1);
    }
  };

  useEffect(() => {
    getAllColumn();
  }, []);

  useEffect(() => {
    setFiltersData(selectedColumnView?.filter);
  }, [selectedColumnView?.filter]);

  const getAllColumnView = async () => {
    await getAllColumnViewAPI({
      data: {
        query: {
          'q[model_name]': modelName,
          sort: '-view_users.is_pin',
          'p[page]': 1,
          'u[page]': 1,
          page: 1,
          'p[limit]': 1000,
          'u[limit]': 1000,
          limit: 1000,
        },
      },
    });
  };

  const getAllColumn = async () => {
    const { data, error } = await getAllColumnAPI({
      collectionName,
      type: modelName === 'Deal',
    });
    if (data && !error) {
      setColumnsOptionsData(
        data.map((column: columnsDataInterface) => {
          return {
            label: column?.displayName,
            value: column?.fieldName,
            type: column?.type,
            searchKeys: column?.searchKeys,
            includeObj: column?.includeObj,
            foreignKey: column?.foreignKey,
          };
        })
      );
      setApiColumnsData(data);
    }
  };

  const isSelectedViewIsUnPin = () => {
    return !columnViewsData.find((view) => view?.id === selectedColumnView?.id);
  };

  const onHandleUpdate = (
    type: updateArgType,
    data?: columnsDataInterface[]
  ) => {
    onHandleUpdateData({
      columnData: {
        ...selectedColumnView,
        [type]:
          (type === updateArgType.COLUMNS &&
            data?.map((column, index) => {
              return { ...column, order: index + 1 };
            })) ||
          (type === updateArgType.SORT &&
            sortsData?.filter((item) => item?.column)) ||
          (type === updateArgType.FILTER && filtersData),
      },
      should_update: true,
    });
    closeModal();
  };

  const onHandleDeleteData = async () => {
    const data = await deleteColumnViewAPI({
      id: selectedColumnView?.id,
    });
    if (!('error' in data)) {
      if (isSelectedViewIsUnPin() === false) {
        const columnData = columnViewsData?.filter(
          (item: columnViewInterface) => item?.id !== selectedColumnView?.id
        );
        setColumnViewData(columnData);
        setSelectedColumnView(columnData[0]);
      } else {
        setSelectedColumnView(columnViewsData[0]);
      }
    }
    closeModal();
  };

  const onHandlePinViewUpdate = (is_pin: boolean) => {
    onHandleUpdateData({
      columnData: { ...selectedColumnView },
      is_pin,
      should_update: true,
    });
    if (is_pin === false) {
      setColumnViewData(
        columnViewsData?.filter(
          (column) => column?.id !== selectedColumnView?.id
        )
      );
    } else {
      setColumnViewData([...columnViewsData, selectedColumnView]);
    }
    closeModal();
  };

  const onHandleLockViewUpdate = (is_locked: boolean) => {
    onHandleUpdateData({
      columnData: { ...selectedColumnView },
      is_locked,
      should_update: true,
    });
    setColumnViewData(
      columnViewsData.map((view) => {
        if (view.id === selectedColumnView.id) {
          return {
            ...view,
            is_locked,
          };
        }
        return view;
      })
    );

    closeModal();
  };

  const onHandleColumnUpdate = (
    type: updateViewArgType,
    value: string,
    updateType: 'name' | 'visibility'
  ) => {
    const spreadValue =
      updateType === 'visibility'
        ? { visibility: value as 'private' | 'public' }
        : { name: value };
    onHandleUpdateData({
      columnData: {
        ...selectedColumnView,
        ...spreadValue,
      },
      should_update: true,
    });
    if (type === updateViewArgType.PIN) {
      setColumnViewData(
        columnViewsData?.map((view) => {
          if (view?.id === selectedColumnView?.id) {
            return {
              ...view,
              ...spreadValue,
            };
          }
          return view;
        })
      );
    }
    closeModal();
  };

  return {
    onHandleLockViewUpdate,
    onHandlePinViewUpdate,
    onHandleColumnUpdate,
    onHandleUpdate,
    onHandleDeleteData,
    isSelectedViewIsUnPin,
    columnViewsData,
    isLoading,
    setInitialColumnViewData,
  };
};

export default useViewListService;
