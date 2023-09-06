// ** import packages **
import { ICellRendererParams } from 'ag-grid-community';
import { Dispatch, SetStateAction } from 'react';

// ** components **
import { TableActionButton } from 'components/Button/TableActionButton';
import TableCellRenderer from 'components/TableInfiniteScroll/TableCellRender';

// ** Hook **
import usePermission from 'hooks/usePermission';
import useWindowDimensions from 'hooks/useWindowDimensions';

interface Props {
  setModal: Dispatch<
    SetStateAction<{ edit: boolean; add: boolean; id?: null | number }>
  >;
  selectionRef?: any;
  setSelectionList?: any;
  setIsCheckAll?: any;
  isCheckAll?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  isCheckAllRef?: any;
  isSelectionDisabled?: boolean;
  openDeleteJobRoleModal: () => void;
}

const useContactTypeColumns = (props: Props) => {
  const {
    setModal,
    selectionRef,
    setSelectionList,
    setIsCheckAll,
    isCheckAll,
    isCheckAllRef,
    isLoading,
    disabled,
    isSelectionDisabled,
    openDeleteJobRoleModal,
  } = props;

  const { isMobileView: isDefaultMobileView } = useWindowDimensions();

  // ** custom hooks **
  const { deleteContactPermission, updateContactPermission } = usePermission();

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
      hide: !deleteContactPermission,
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
              type="checkbox"
              defaultChecked={selectionRef.current[colId]}
              disabled={isSelectionDisabled}
            />
          );
        }
        return <span className="skeletonBox w-[16px] h-[16px] rounded-[3px]" />;
      },
    },

    {
      field: 'name',
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
          (params?.data?.creator?.first_name &&
            params?.data?.creator?.last_name)
            ? `${params?.data?.creator?.first_name} ${params?.data?.creator?.last_name}`
            : '';
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

  if (
    updateContactPermission ||
    (isDefaultMobileView && deleteContactPermission)
  ) {
    columnDefs.push({
      field: 'Action',
      sortable: false,
      cellClass: '!flex items-center',
      minWidth: 200,
      cellRenderer: (
        params: { data: { id: number } },
        isMobileView?: boolean
      ) => {
        const permissionArray = [];

        if (updateContactPermission) {
          permissionArray.push({
            label: 'Edit',
            onClick: () =>
              setModal((prev: any) => ({
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
          deleteContactPermission &&
          params?.data?.id
        ) {
          permissionArray.push({
            label: 'Delete',
            onClick: () => {
              if (params?.data?.id) {
                openDeleteJobRoleModal();
                setSelectionList({ [params.data.id]: params.data });
              }
            },
          });
        }

        return isLoading ? (
          <span className="skeletonBox" />
        ) : (
          <TableActionButton filedArray={[...permissionArray]} />
        );
      },
    } as any);
  }

  return { defaultColDef, columnDefs };
};

export default useContactTypeColumns;
