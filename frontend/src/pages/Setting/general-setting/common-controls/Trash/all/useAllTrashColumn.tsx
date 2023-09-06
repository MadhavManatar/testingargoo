import { ICellRendererParams } from 'ag-grid-community';
import { TableActionButton } from 'components/Button/TableActionButton';
import DateFormat from 'components/DateFormat';
import TableCellRenderer from 'components/TableInfiniteScroll/TableCellRender';
import usePermission from 'hooks/usePermission';
import { UseAllTrashColumnsPropsType } from './all.type';

const useAllTrashColumn = ({
  selectionRef,
  setSelectionList,
  setIsCheckAll,
  disabled,
  getAllLoading,
  isCheckAll,
  isCheckAllRef,
  isSelectionDisabled,
  openDeleteAllModal,
  restoreData,
  setActionBtnState
}: UseAllTrashColumnsPropsType) => {
  const defaultColDef = { sortable: true, rowSelection: 'multiple' };

  // ** Custom Hooks **
  const { deleteAllPermission, updateAllPermission } = usePermission();

  const columnDefs = [
    {
      headerName: 'Select All',
      field: 'checkbox',
      width: 54,
      minWidth: 54,
      maxWidth: 54,

      headerComponent: () => (
        <>
          {getAllLoading ? (
            <span className="skeletonBox w-[16px] h-[16px] rounded-[3px]" />
          ) : (
            <div
              ref={(ref: HTMLInputElement | null) => {
                if (!ref) return;
                ref.onclick = (e) => {
                  e.stopPropagation();
                };
              }}
            >
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
                    setActionBtnState?.(false)
                    isCheckAllRef.current = !!isCheckAll;
                    setIsCheckAll(!isCheckAll);
                    e.stopPropagation();
                  };
                }}
              />
            </div>
          )}
        </>
      ),

      hide: !deleteAllPermission,
      cellRenderer: (params: ICellRendererParams) => {
        const colId = params?.data?.id;
        if (params?.data) {
          return (
            <div
              ref={(ref: HTMLInputElement | null) => {
                if (!ref) return;
                ref.onclick = (e) => {
                  e.stopPropagation();
                };
              }}
            >
              <input
                className="agGrid__customInput"
                ref={(ref: HTMLInputElement | null) => {
                  if (!ref) return;
                  ref.onclick = (e) => {
                    setActionBtnState?.(false)
                    const updatedList = {
                      ...selectionRef.current,
                      ...(ref.checked && { [colId]: params.data }),
                    };
                    if (!ref.checked) {
                      delete updatedList[colId];
                    }
                    selectionRef.current = { ...updatedList };

                    setSelectionList({ ...updatedList });
                    e.stopPropagation();
                  };
                }}
                disabled={isSelectionDisabled}
                type="checkbox"
                defaultChecked={selectionRef.current[colId]}
              />
            </div>
          );
        }
        return <span className="skeletonBox w-[16px] h-[16px] rounded-[3px]" />;
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      sortable: !isSelectionDisabled,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Name"
            params={params}
            isMobileView={isMobileView}
            cellValue={params?.data?.name}
          />
        );
      },
    },
    {
      field: 'first_name',
      headerName: 'Deleted By',
      sortable: !isSelectionDisabled,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Deleted By"
            params={params}
            isMobileView={isMobileView}
            cellValue={params?.data?.first_name}
          />
        );
      },
    },
    {
      field: 'deleted_at',
      headerName: 'Deleted Time',
      sortable: !isSelectionDisabled,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Deleted Time"
            params={params}
            isMobileView={isMobileView}
            cellValue={
              <DateFormat format="Pp" date={params?.data?.deleted_at} />
            }
          />
        );
      },
    },
    {
      field: 'model_name',
      headerName: 'Entity Type',
      sortable: !isSelectionDisabled,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Model Name"
            params={params}
            isMobileView={isMobileView}
            cellValue={params?.data?.model_name}
          />
        );
      },
    },
    {
      field: 'Action',
      sortable: false,
      cellClass: '!flex items-center',
      cellRenderer: (params: { data: any }, isMobileView?: boolean) => {
        const permissionArray = [];

        if (typeof isMobileView !== 'boolean' && deleteAllPermission) {
          permissionArray.push({
            label: 'Delete Permanently',
            onClick: () => {
              setActionBtnState?.(true)
              if (params?.data?.id) {
                openDeleteAllModal?.(params?.data?.id);
                setSelectionList(params.data);
              }
                          },
          });
        }
        if (typeof isMobileView !== 'boolean' && updateAllPermission) {
          permissionArray.push({
            label: 'Restore',
            onClick: () => {
              setActionBtnState?.(true)
              setSelectionList({ [params.data]: params.data });
              restoreData(params.data.id);
            },
          });
        }
        return (
          <>
            {getAllLoading ? (
              <span className="skeletonBox" />
            ) : (
              <TableActionButton filedArray={[...permissionArray]} />
            )}
          </>
        );
      },
    },
  ];

return { defaultColDef, columnDefs };
};
export default useAllTrashColumn;
