// ** Import Packages **
import { ICellRendererParams } from 'ag-grid-community';
import { Dispatch, SetStateAction } from 'react';
import { useSelector } from 'react-redux';

// ** Components **
import { TableActionButton } from 'components/Button/TableActionButton';
import TableCellRenderer from 'components/TableInfiniteScroll/TableCellRender';

// ** Hooks **
import usePermission from 'hooks/usePermission';
import useWindowDimensions from 'hooks/useWindowDimensions';

// ** Redux **
import { getCurrentUser } from 'redux/slices/authSlice';

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
  selectionRef?: any;
  setSelectionList?: any;
  setIsCheckAll?: any;
  isCheckAll?: boolean;
  isCheckAllRef?: any;
  openChangeColorStatusModal: (id: number) => void;
  disabled: boolean;
  dataLength?: number;
  isSelectionDisabled?: boolean;
  isLoading?: boolean;
  openDeleteLeadStatusModal: () => void;
}

const useLeadStatusColumns = (props: Props) => {
  const {
    setIsOpen,
    openChangeColorStatusModal,
    selectionRef,
    disabled,
    setSelectionList,
    setIsCheckAll,
    isCheckAll,
    isLoading,
    isCheckAllRef,
    dataLength,
    isSelectionDisabled,
    openDeleteLeadStatusModal,
  } = props;

  const isAdmin = isAdministrator();

  // ** hooks **
  const currentUser = useSelector(getCurrentUser);

  // ** custom hooks **
  const { isMobileView: isDefaultMobileView } = useWindowDimensions();
  const { updateLeadPermission, deleteLeadPermission } = usePermission();

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
              defaultChecked={selectionRef.current[colId]}
              hidden={params?.data?.is_system}
            />
          );
        }
        return <span className="skeletonBox w-[16px] h-[16px] rounded-[3px]" />;
      },
    },
    {
      field: 'name',
      headerName: 'Status',
      sortable: true,
      suppressMenu: false,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Status"
            isLoading={disabled}
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
            isLoading={disabled}
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
            isLoading={disabled}
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
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
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
                openDeleteLeadStatusModal();
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
                filedArray={[...permissionArray]}
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
