// ** Import Packages **
import { ICellRendererParams } from 'ag-grid-community';

// ** Components **
import { TableActionButton } from 'components/Button/TableActionButton';
import TableCellRenderer from 'components/TableInfiniteScroll/TableCellRender';

// ** Hook **
import usePermission from 'hooks/usePermission';
import useWindowDimensions from 'hooks/useWindowDimensions';

// ** Type **
import { UseLeadDealSourceColumnsPropsType } from '../types/lead-deal-source.types';

const useLeadDealSourceColumns = (props: UseLeadDealSourceColumnsPropsType) => {
  const {
    setIsOpen,
    selectionRef,
    isLoading,
    disabled,
    setSelectionList,
    setIsCheckAll,
    isCheckAll,
    isCheckAllRef,
    isSelectionDisabled,
    openDeleteModal,
  } = props;

  // ** custom hooks **
  const { updateLeadPermission, deleteLeadPermission } = usePermission();
  const { isMobileView: isDefaultMobileView } = useWindowDimensions();

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
      hide: !deleteLeadPermission,
      cellRenderer: (params: ICellRendererParams) => {
        const colId = params?.data?.id;

        if (params?.data) {
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
        return <span className="skeletonBox w-[16px] h-[16px] rounded-[3px]" />;
      },
    },
    {
      field: 'name',
      headerName: `Source`,
      sortable: !isSelectionDisabled,
      suppressMenu: false,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Source"
            isLoading={disabled}
            isMobileView={isMobileView}
            cellValue={params?.data?.name || ''}
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
          params?.data?.creator?.full_name ||
          `${params?.data?.creator?.first_name} ${params?.data?.creator?.last_name}` ||
          '';
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
      cellRenderer: (
        params: { data: { id: number; name: string } },
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
                openDeleteModal();
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
              <TableActionButton filedArray={[...permissionArray]} />
            )}
          </>
        );
      },
    } as any);
  }

  return { defaultColDef, columnDefs };
};

export default useLeadDealSourceColumns;
