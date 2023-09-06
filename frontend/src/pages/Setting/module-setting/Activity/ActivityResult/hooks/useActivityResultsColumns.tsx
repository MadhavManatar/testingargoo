// ** import packages **
import { ICellRendererParams } from 'ag-grid-community';
import { Dispatch, SetStateAction } from 'react';
import { useSelector } from 'react-redux';

// ** components **
import { TableActionButton } from 'components/Button/TableActionButton';
import TableCellRenderer from 'components/TableInfiniteScroll/TableCellRender';
import useAuth from 'hooks/useAuth';
import {
  BasicPermissionTypes,
  ModuleNames,
} from 'constant/permissions.constant';

// ** Redux **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** Other **
import { isAdministrator } from 'utils/is';

interface Props {
  setOpen: Dispatch<
    SetStateAction<{ edit: boolean; add: boolean; id?: null | number }>
  >;
  selectionRef?: any;
  setSelectionList?: any;
  setIsCheckAll?: any;
  isCheckAll?: boolean;
  isCheckAllRef?: any;
  disabled?: boolean;
  isSelectionDisabled?: boolean;
  openDeleteActivityResultModal: () => void;
  getActivityResultsLoading?: boolean;
}

const useActivityResultColumns = (props: Props) => {
  const {
    setOpen,
    selectionRef,
    setSelectionList,
    setIsCheckAll,
    isCheckAll,
    isCheckAllRef,
    getActivityResultsLoading,
    disabled,
    isSelectionDisabled,
    openDeleteActivityResultModal,
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

  const defaultColDef = {
    sortable: true,
    showDisabledCheckboxes: true,
    rowSelection: 'multiple',
  };

  const columnDefs = [
    {
      headerName: 'Select All',
      field: 'checkbox',
      width: 54,
      minWidth: 54,
      maxWidth: 54,
      headerComponent: () => (
        <>
          {getActivityResultsLoading ? (
            <span className="skeletonBox w-[16px] h-[16px] rounded-[3px]" />
          ) : (
            <input
              className="agGrid__customInput"
              checked={isCheckAll}
              type="checkbox"
              disabled={disabled}
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
        const isEdit =
          isAdmin ||
          (deletePermission && currentUser?.id === params?.data?.created_by);
        if (isEdit || getActivityResultsLoading) {
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
            />
          );
        }
        return (
          <>
            {getActivityResultsLoading ? (
              <span className="skeletonBox w-[16px] h-[16px] rounded-[3px]" />
            ) : null}
          </>
        );
      },
    },
    {
      field: 'result',
      headerName: 'Name',
      sortable: !isSelectionDisabled,
      suppressMenu: false,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Name"
            params={params}
            isMobileView={isMobileView}
            cellValue={params?.data?.result || ''}
          />
        );
      },
    },
    {
      headerName: 'Created By',
      field: 'creator.first_name',
      sortable: !isSelectionDisabled,
      suppressMenu: false,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        const userName =
          params?.data?.creator?.username ||
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
            id: number;
            result: string;
            is_system: boolean;
            created_by: number;
          };
        },
        isMobileView?: boolean
      ) => {
        const isEdit =
          isAdmin ||
          (editPermission && currentUser?.id === params?.data?.created_by);
        const permissionArray = [
          {
            label: 'Edit',
            onClick: () =>
              isEdit &&
              setOpen((prev: any) => ({
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
          params?.data?.id
        ) {
          permissionArray.push({
            label: 'Delete',
            onClick: () => {
              if (params?.data?.id) {
                openDeleteActivityResultModal();
                setSelectionList({ [params.data.id]: params.data });
              }
            },
          });
        }

        return (
          <>
            {getActivityResultsLoading ? (
              <span className="skeletonBox" />
            ) : (
              <TableActionButton
                filedArray={[...permissionArray]}
                disabled={!isEdit}
              />
            )}
          </>
        );
      },
    } as any);
  }

  return { defaultColDef, columnDefs };
};

export default useActivityResultColumns;
