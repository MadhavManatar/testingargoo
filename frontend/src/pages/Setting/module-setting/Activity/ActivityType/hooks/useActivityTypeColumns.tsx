// ** import packages **
import { ICellRendererParams } from 'ag-grid-community';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// ** components **
import { TableActionButton } from 'components/Button/TableActionButton';
import TableCellRenderer from 'components/TableInfiniteScroll/TableCellRender';

// ** type **

import useAuth from 'hooks/useAuth';
import {
  BasicPermissionTypes,
  ModuleNames,
} from 'constant/permissions.constant';

// ** Redux **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** Other **
import { isAdministrator } from 'utils/is';
import { SYSTEM_DEFAULT_LABEL } from 'constant';
import ActivityTypeMailStatus from '../components/ActivityTypeMailStatus';

interface Props {
  setModal: Dispatch<
    SetStateAction<{ edit: boolean; add: boolean; id?: null | number }>
  >;
  setDefaultId?: any;
  selectionRef?: any;
  setSelectionList?: any;
  setIsCheckAll?: any;
  isCheckAll?: boolean;
  isCheckAllRef?: any;
  disabled?: boolean;
  checked: number | undefined;
  changeDefaultType: (id: number, type: boolean) => Promise<void>;
  isSelectionDisabled?: boolean;
  getActivityTypesLoading?: boolean;
  openDeleteActivityTypeModal: () => void;
  refreshTable: () => void;
}

const useActivityTypeColumns = (props: Props) => {
  const {
    setModal,
    selectionRef,
    setSelectionList,
    setIsCheckAll,
    isCheckAll,
    isCheckAllRef,
    disabled,
    getActivityTypesLoading,
    checked,
    changeDefaultType,
    isSelectionDisabled,
    openDeleteActivityTypeModal,
  } = props;
  const currentUser = useSelector(getCurrentUser);

  // ** custom hooks **
  const isAdmin = isAdministrator();

  const { hasAuthorized } = useAuth();

  const deletePermission = hasAuthorized([
    { module: ModuleNames.ACTIVITY, type: BasicPermissionTypes.DELETE },
  ]);

  const editPermission = hasAuthorized([
    { module: ModuleNames.ACTIVITY, type: BasicPermissionTypes.UPDATE },
  ]);

  // ** state **
  const [tempLoading, setTempLoading] = useState<boolean | undefined>(true);

  useEffect(() => {
    setTempLoading(getActivityTypesLoading);
  }, [getActivityTypesLoading]);

  const defaultColDef = {
    sortable: true,
    showDisabledCheckboxes: true,
    rowSelection: 'multiple',
  };
  let isSystem: any;
  const columnDefs = [
    {
      headerName: 'Select All',
      field: 'checkbox',
      width: 54,
      minWidth: 54,
      maxWidth: 54,
      headerComponent: () => (
        <>
          {getActivityTypesLoading ? (
            <span className="skeletonBox w-[16px] h-[16px] rounded-[3px]" />
          ) : (
            <input
              className="agGrid__customInput"
              checked={isCheckAll}
              disabled={disabled}
              type="checkbox"
              onChange={() => {
                //
              }}
              ref={(ref: HTMLInputElement | null) => {
                if (!ref) return;
                ref.onclick = (e) => {
                  isCheckAllRef.current = !!isCheckAll;
                  setIsCheckAll(!isCheckAll);
                  e.stopPropagation();
                };
              }}
            />
          )}
        </>
      ),
      hide: !deletePermission,
      cellRenderer: (params: ICellRendererParams) => {
        const colId = params?.data?.id;
        isSystem = params?.data?.is_system || params?.data?.is_default;
        const isEdit =
          params?.data?.is_system ||
          params?.data?.is_default ||
          !(
            isAdmin ||
            (deletePermission && currentUser?.id === params?.data?.created_by)
          );
        if (!isEdit || getActivityTypesLoading) {
          return (
            <input
              className="agGrid__customInput"
              ref={(ref: HTMLInputElement | null) => {
                if (!ref) return;
                ref.onclick = (e) => {
                  const updatedList = {
                    ...selectionRef.current,
                    ...(ref.checked && { [colId]: params.data }),
                  };
                  if (!ref.checked) {
                    delete updatedList[colId];
                  }
                  setSelectionList({ ...updatedList });
                  selectionRef.current = { ...updatedList };
                  e.stopPropagation();
                };
              }}
              disabled={isSelectionDisabled}
              type="checkbox"
              defaultChecked={selectionRef.current[colId]}
              hidden={deletePermission && isSystem}
            />
          );
        }
        return (
          <>
            {getActivityTypesLoading ? (
              <span className="skeletonBox w-[16px] h-[16px] rounded-[3px]" />
            ) : null}
          </>
        );
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      sortable: true,
      suppressMenu: false,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Name"
            params={params}
            isMobileView={isMobileView}
            cellValue={params?.data?.name || ''}
          />
        );
      },
    },
    {
      field: 'activity_type_mail_status',
      headerName: 'Activity Type Mail Status',
      width: 150,
      sortable: false,
      minWidth: 150,
      maxWidth: 150,
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Name"
            params={params}
            isMobileView={isMobileView}
            cellValue={
              <ActivityTypeMailStatus {...{ params }} />
            }
          />
        );
      },
    },
    {
      field: 'color',
      headerName: 'Color',
      sortable: true,
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Color"
            params={params}
            isMobileView={isMobileView}
            cellValue={
              <div className="value w-[30px] h-[30px] p-[3px] border border-ip__black__text__color rounded-full colorRound__Box">
                <span
                  className="block w-full h-full rounded-full"
                  style={{
                    backgroundColor: `${params?.data?.color || ''}`,
                  }}
                />
              </div>
            }
          />
        );
      },
    },
    {
      field: 'parent_type.name',
      headerName: 'Parent Activity Type',
      sortable: true,
      suppressMenu: false,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Parent Activity Type"
            params={params}
            isMobileView={isMobileView}
            cellValue={params?.data?.parent_type?.name || ''}
          />
        );
      },
    },
    {
      headerName: 'Created By',
      field: 'creator.first_name',
      sortable: true,
      suppressMenu: false,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        const userName = params?.data?.is_system
          ? SYSTEM_DEFAULT_LABEL
          : params?.data?.creator?.username ||
          `${params?.data?.creator?.first_name} ${params?.data?.creator?.last_name}` ||
          '';
        return (
          <TableCellRenderer
            label="Created By"
            params={params}
            isMobileView={isMobileView}
            cellValue={userName}
          />
        );
      },
    },
    {
      headerName: 'My Default',
      field: 'is_default',
      cellRenderer: (params: ICellRendererParams) => {
        if (getActivityTypesLoading || tempLoading) {
          return (
            <span className="skeletonBox w-[16px] h-[16px] rounded-[3px]" />
          );
        }
        return (
          <div className="ip__Checkbox setting__activity__mark__default ml-[28px] sm:ml-0 sm:absolute sm:top-[12px] sm:right-[38px] sm:w-[18px] sm:h-[18px]">
            <input
              className="agGrid__customInput sm:!block sm:!absolute sm:!top-0 sm:!right-0 sm:!w-full sm:!h-full"
              onChange={() => {
                //
              }}
              value={params?.data?.id}
              ref={(ref: HTMLInputElement | null) => {
                if (!ref) return;
                ref.onclick = (e) => {
                  e.stopPropagation();
                  if (params?.data?.id !== checked) {
                    changeDefaultType(params?.data?.id, true);
                  } else {
                    changeDefaultType(params?.data?.id, false);
                  }
                };
              }}
              checked={!!params?.data?.is_default}
              type="radio"
            />
            <label className="rc__Label" />
          </div>
        );
      },
    },
  ];

  if (editPermission) {
    columnDefs.push({
      field: 'Action',
      sortable: false,
      cellClass: '!flex items-center',
      minWidth: 200,
      cellRenderer: (
        params: {
          data: {
            is_system: boolean | undefined;
            is_default: boolean | undefined;
            id: number;
            created_by: number;
          };
        },
        isMobileView?: boolean
      ) => {
        const isEdit =
          // !params?.data?.is_system &&
          // !params?.data?.is_default &&
          isAdmin ||
          (editPermission && currentUser?.id === params?.data?.created_by);

        const permissionArray = [
          {
            label: 'Edit',
            onClick: () =>
              isEdit &&
              setModal((prev: any) => ({
                ...prev,
                edit: true,
                add: false,
                id: params?.data?.id,
              })),
          },
        ];

        if (
          typeof isMobileView === 'boolean' &&
          isMobileView &&
          deletePermission &&
          params?.data?.id
        ) {
          permissionArray.push({
            label: 'Delete',
            onClick: () => {
              if (params?.data?.id) {
                openDeleteActivityTypeModal();
                setSelectionList({ [params.data.id]: params.data });
              }
            },
          });
        }

        return (
          <>
            {!getActivityTypesLoading ? (
              <TableActionButton
                filedArray={[...permissionArray]}
                disabled={!isEdit}
              />
            ) : null}
          </>
        );
      },
    } as any);
  }
  return { defaultColDef, columnDefs };
};

export default useActivityTypeColumns;
