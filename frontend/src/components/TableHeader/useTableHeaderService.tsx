import {
  columnsDataInterface,
  columnViewInterface,
} from 'components/ColumnViewListDropDown';
import _ from 'lodash';
import { useState } from 'react';
import { useUpdateColumnViewMutation } from 'redux/api/columnApi';

interface Props {
  selectedColumnView: columnViewInterface;
  setSelectedColumnView: (value: {
    type: 'update';
    data: columnViewInterface;
  }) => void;
  selectedColumnViewRef: React.MutableRefObject<
    columnViewInterface | undefined
  >;
  setIsColumnDataUpdated: (value: React.SetStateAction<boolean>) => void;
  isColumnDataUpdated: boolean;
  refreshTable: () => void;
  openManageColumnModal(): void;
  setSpacing: React.Dispatch<
    React.SetStateAction<{ height: number; class: string }>
  >;
}
const useTableHeaderService = (props: Props) => {
  const {
    selectedColumnView,
    setSelectedColumnView,
    selectedColumnViewRef,
    setIsColumnDataUpdated,
    isColumnDataUpdated,
    refreshTable,
    openManageColumnModal,
    setSpacing,
  } = props;
  const [editColumnViewId, setColumnEditViewId] = useState(-1);

  const [isViewUpdate, setIsViewUpdated] = useState(false);
  const [isWrapTxtUpdate, setIsWrapTxtUpdate] = useState(false);

  const [updateColumnViewAPI] = useUpdateColumnViewMutation();

  const onHandleUpdateColumnWidth = async (colId: string, width: number) => {
    if (selectedColumnView?.id === -1 || colId === '' || colId === undefined) {
      return false;
    }
    const isColumnExist = selectedColumnView?.columns?.find(
      (column) => column?.fieldName === colId && column?.width === width
    );

    if (isColumnExist) {
      return false;
    }

    const bodyColumnData = selectedColumnView?.columns?.map((column) => {
      if (column?.fieldName === colId) {
        return {
          ...column,
          fieldName: colId,
          width,
        };
      }
      return column;
    });

    const updatedData = {
      ...selectedColumnView,
      columns: bodyColumnData,
    };

    if (_.isEqual(selectedColumnViewRef?.current, updatedData)) {
      return;
    }

    setSelectedColumnView({
      type: 'update',
      data: updatedData,
    });
    selectedColumnViewRef.current = updatedData;
    setIsViewUpdated(true);
  };

  const onHandleMoveColumnData = async ({ columns }: { columns: string[] }) => {
    const columnsData = columns.slice(1)?.map((column, index) => {
      const data = selectedColumnViewRef?.current?.columns?.find(
        (sColumn) => sColumn?.fieldName === column
      );
      return {
        ...data,
        order: index + 1,
      };
    });

    const updatedData = {
      ...(selectedColumnViewRef?.current as columnViewInterface),
      columns: columnsData as columnsDataInterface[],
    };

    if (_.isEqual(selectedColumnViewRef?.current, updatedData)) {
      return;
    }

    setSelectedColumnView({
      type: 'update',
      data: updatedData,
    });

    selectedColumnViewRef.current = updatedData;
    setIsViewUpdated(true);
  };

  const onHandleUpdateColumnData = async (args: {
    columnData: columnViewInterface;
    should_update: boolean;
    is_pin?: boolean;
    is_locked?: boolean;
    spacing?: number;
  }) => {
    const { columnData, is_locked, is_pin, should_update } = args;
    let updatedData;
    const commonData = {
      ...columnData,
      is_locked: _.isBoolean(is_locked) ? is_locked : columnData?.is_locked,
    };
    if (typeof is_pin === 'boolean') {
      const viewUsersData = columnData?.view_users?.map((user, index) => {
        if (index === 0) {
          return {
            ...user,
            is_pin,
          };
        }
        return user;
      });

      updatedData = {
        ...commonData,
        view_users: viewUsersData,
      };
    } else {
      updatedData = commonData;
    }

    if (should_update) {
      updateColumnView(updatedData);
    } else {
      setSelectedColumnView({
        type: 'update',
        data: updatedData,
      });
      selectedColumnViewRef.current = updatedData;
      setIsViewUpdated(true);
    }
  };

  const selectColumnView = (
    data: columnViewInterface,
    isEditModalOpen?: boolean
  ) => {
    if (data) {
      setSelectedColumnView({
        type: 'update',
        data,
      });
      setIsViewUpdated(false);
    }
    if (isEditModalOpen) {
      setColumnEditViewId(data?.id);
      openManageColumnModal();
    }
  };

  const updateColumnView = async (columnData?: columnViewInterface) => {
    if (!columnData || !columnData?.id) return false;

    const data = await updateColumnViewAPI({
      id: columnData?.id,
      data: {
        filter: columnData?.filter,
        model_name: columnData?.model_name,
        name: columnData?.name,
        columns: columnData?.columns,
        sort: columnData?.sort,
        is_pin: columnData?.view_users?.[0]?.is_pin,
        visibility: columnData.visibility,
        is_locked: columnData?.is_locked,
        toast: true,
        spacing: columnData?.spacing,
      },
    });
    if ('data' in data && !('error' in data)) {
      setIsViewUpdated(false);
      setIsColumnDataUpdated(!isColumnDataUpdated);
      refreshTable();
    }
  };

  const updateSpacing = (value: { height: number; class: string }) => {
    setSpacing(value);
    const updatedColumnView = {
      ...selectedColumnView,
      spacing: value,
    };
    setSelectedColumnView({
      type: 'update',
      data: updatedColumnView,
    });
    if (selectedColumnViewRef?.current) {
      selectedColumnViewRef.current = updatedColumnView;
    }
    setIsViewUpdated(true);
  };

  return {
    onHandleUpdateColumnWidth,
    onHandleMoveColumnData,
    onHandleUpdateColumnData,
    editColumnViewId,
    setColumnEditViewId,
    selectColumnView,
    updateColumnView,
    isViewUpdate,
    setIsViewUpdated,
    updateSpacing,
    setIsWrapTxtUpdate,
    isWrapTxtUpdate,
  };
};

export default useTableHeaderService;
