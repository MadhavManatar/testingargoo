import { ICellRendererParams } from "ag-grid-community";
import { TableActionButton } from "components/Button/TableActionButton";
import DateFormat from "components/DateFormat";
import TableCellRenderer from "components/TableInfiniteScroll/TableCellRender";
import usePermission from "hooks/usePermission";
import { LeadDetailsType,  UseLeadTrashColumnsPropsType } from "pages/Lead/types/lead.type";

const useLeadTrashColumn = ({
    selectionRef,
    setSelectionList,
    setIsCheckAll,
    disabled,
    getLeadsLoading,
    isCheckAll,
    isCheckAllRef,
    isSelectionDisabled,
    openDeleteLeadsModal,
    restoreData,
    setActionBtnState
}: UseLeadTrashColumnsPropsType) =>{
    const defaultColDef = { sortable: true, rowSelection: 'multiple' };

      // ** Custom Hooks **
  const {
    deleteLeadPermission,
    updateLeadPermission
  } = usePermission();

  const columnDefs = [
    {
        headerName: 'Select All',
        field: 'checkbox',
        width: 54,
        minWidth: 54,
        maxWidth: 54,
  
        headerComponent: () => (
          <>
            {getLeadsLoading ? (
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
                      setActionBtnState(false)
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
  
        hide: !deleteLeadPermission,
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
                      setActionBtnState(false)
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
        field: 'updated_by',
        headerName: 'Deleted By',
        filter: 'agTextColumnFilter',
        cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
          return (
            <TableCellRenderer
              label="Deleted By"
              params={params}
              isMobileView={isMobileView}
              cellValue={params?.data?.modifier?.full_name}
            />
          );
        },
      },
      {
        field: 'deleted_at',
        headerName: 'Deleted Time',
        filter: 'agTextColumnFilter',
        cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
          return (
            <TableCellRenderer
              label="Deleted Time"
              params={params}
              isMobileView={isMobileView}
              cellValue={  <DateFormat format="Pp" date={params?.data?.deleted_at} />}
            />
          );
        },
      },
    {
        field: 'Action',
        sortable: false,
        cellClass: '!flex items-center',
        cellRenderer: (
          params: { data: LeadDetailsType },
          isMobileView?: boolean
        ) => {
          const permissionArray = []; 
          
          if (
            typeof isMobileView !== 'boolean' &&
            deleteLeadPermission &&
            params?.data?.id
          )
           {
            permissionArray.push({
              label: 'Delete Permanently',
              onClick: () => {
                setActionBtnState(true)
                if (params?.data?.id) {
                  openDeleteLeadsModal();
                  setSelectionList({ [params.data.id]: params.data });
                }
              },
            });
          }
          if (
            typeof isMobileView !== 'boolean' &&
            updateLeadPermission &&
            params?.data?.id
          )
           {
            permissionArray.push({
              label: 'Restore',
              onClick: () => {
                setActionBtnState(true)
                if (params?.data?.id) {
                    restoreData(params.data.id);
                }
              },
            });
          }
          return (
            <>
              {getLeadsLoading ? (
                <span className="skeletonBox" />
              ) : (
                <TableActionButton filedArray={[...permissionArray]} />
              )}
            </>
          );
        },
      },
      
  ]

    return {defaultColDef, columnDefs}
}
export default useLeadTrashColumn;