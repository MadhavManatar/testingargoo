// ** import packages **
import { ICellRendererParams } from 'ag-grid-community';
import { Dispatch, SetStateAction } from 'react';
import { useSelector } from 'react-redux';

// ** Redux **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** components **
import { TableActionButton } from 'components/Button/TableActionButton';
import TableCellRenderer from 'components/TableInfiniteScroll/TableCellRender';

// ** Hook **
import usePermission from 'hooks/usePermission';
import useWindowDimensions from 'hooks/useWindowDimensions';

// ** Constant **
import { SYSTEM_DEFAULT_LABEL } from 'constant';

// ** Other **
import { isAdministrator } from 'utils/is';

interface Props {
  setIsOpen: Dispatch<
    SetStateAction<{
      edit: boolean;
      add: boolean;
      id?: null | number;
      changeColor: boolean;
    }>
  >;
  openChangeColorStatusModal: (id: number) => void;
  selectionRef?: any;
  setSelectionList?: any;
  setIsCheckAll?: any;
  isCheckAll?: boolean;
  disabled?: boolean;
  isCheckAllRef?: any;
  dataLength?: number;
  isSelectionDisabled?: boolean;
  isLoading?: boolean;
  openLeadTempStatusDeleteModal: () => void;
}

const useLeadStatusColumns = (props: Props) => {
  const {
    setIsOpen,
    openChangeColorStatusModal,
    selectionRef,
    setSelectionList,
    disabled,
    isLoading,
    setIsCheckAll,
    isCheckAll,
    isCheckAllRef,
    dataLength,
    isSelectionDisabled,
    openLeadTempStatusDeleteModal,
  } = props;

  // ** Hooks **
  const defaultColDef = {
    sortable: true,
    showDisabledCheckboxes: true,
    rowSelection: 'multiple',
  };
  const currentUser = useSelector(getCurrentUser);

  // ** custom hooks **
  const { isMobileView: isDefaultMobileView } = useWindowDimensions();

  const { updateLeadPermission, deleteLeadPermission } = usePermission();

  const isAdmin = isAdministrator();

  const columnDefs = [
    {
      headerName: 'Select All',
      field: 'checkbox',
      width: 54,
      minWidth: 54,
      maxWidth: 54,
      headerComponent: () => (
        <>
          {isLoading ? (
            <span className="skeletonBox w-[16px] h-[16px] rounded-[3px]" />
          ) : (
            <input
              className="agGrid__customInput"
              checked={isCheckAll}
              type="checkbox"
              disabled={dataLength === 3 ? true : disabled}
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
      hide: !deleteLeadPermission,
      cellRenderer: (params: ICellRendererParams) => {
        const colId = params?.data?.id;
        if (params.data) {
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
              hidden={params?.data?.is_system}
              defaultChecked={selectionRef.current[colId]}
            />
          );
        }
        return <span className="skeletonBox w-[16px] h-[16px] rounded-[3px]" />;
      },
    },
    {
      field: 'name',
      headerName: 'Temperature Status',
      sortable: true,
      suppressMenu: false,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Temperature Status"
            params={params}
            isMobileView={isMobileView}
            cellValue={params?.data?.name || ''}
          />
        );
      },
    },
    {
      field: 'color',
      headerName: 'Color',
      sortable: false,
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Color"
            params={params}
            isMobileView={isMobileView}
            cellValue={
              <div
                className="cell__value__wrapper cursor-pointer"
                onClick={() =>
                  !params?.data?.is_system &&
                  (isAdmin ||
                    (updateLeadPermission &&
                      currentUser?.id === params?.data?.created_by))
                    ? openChangeColorStatusModal(params?.data?.id)
                    : ''
                }
              >
                <div className="value w-[30px] h-[30px] p-[3px] border border-ipBlack__borderColor rounded-full colorRound__Box">
                  <span
                    className="block w-full h-full rounded-full"
                    style={{ backgroundColor: `${params?.data?.color || ''}` }}
                  />
                </div>
              </div>
            }
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
        const creatorName =
          params?.data?.creator?.first_name && params?.data?.creator?.last_name
            ? `${params?.data?.creator?.first_name} ${params?.data?.creator?.last_name}`
            : '';
        const userName = params?.data?.is_system
          ? SYSTEM_DEFAULT_LABEL
          : params?.data?.creator?.full_name || creatorName;

        return (
          <TableCellRenderer
            label="Name"
            params={params}
            isMobileView={isMobileView}
            cellValue={userName}
          />
        );
      },
    },
  ];

  if (updateLeadPermission || (isDefaultMobileView && deleteLeadPermission)) {
    columnDefs.push({
      field: 'Action',
      sortable: false,
      cellClass: '!flex items-center',
      minWidth: 200,
      cellRenderer: (
        params: {
          data: {
            id: number;
            name: string;
            is_system: boolean;
            created_by: number;
          };
        },
        isMobileView?: boolean
      ) => {
        const permissionArray = [];
        if (updateLeadPermission) {
          permissionArray.push({
            label: 'Edit',
            onClick: () =>
              setIsOpen((prev: any) => ({
                ...prev,
                edit: true,
                add: false,
                id: params?.data?.id,
              })),
          });
        }

        if (
          typeof isMobileView === 'boolean' &&
          isMobileView &&
          deleteLeadPermission &&
          params?.data?.id
        ) {
          permissionArray.push({
            label: 'Delete',
            onClick: () => {
              if (params?.data?.id) {
                openLeadTempStatusDeleteModal();
                setSelectionList({ [params.data.id]: params.data });
              }
            },
          });
        }

        return (
          <>
            {isLoading ? (
              <span className="skeletonBox" />
            ) : (
              <TableActionButton
                filedArray={permissionArray}
                disabled={!!params?.data?.is_system}
              />
            )}
          </>
        );
      },
    } as any);
  }

  return { defaultColDef, columnDefs };
};

export default useLeadStatusColumns;
