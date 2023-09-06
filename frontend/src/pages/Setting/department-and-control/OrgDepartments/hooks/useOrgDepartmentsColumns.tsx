// ** import packages **
import { ICellRendererParams } from 'ag-grid-community';
import { Dispatch, SetStateAction, useState } from 'react';

// ** components **
import { TableActionButton } from 'components/Button/TableActionButton';
import TableCellRenderer from 'components/TableInfiniteScroll/TableCellRender';

// ** Hook **
import useWindowDimensions from 'hooks/useWindowDimensions';
import { DepartmentRowObj } from '../../Department/types/department.types';

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
  openDeleteOrgDepartmentModal: () => void;
}

const useOrgDepartmentsColumns = (props: Props) => {
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
    openDeleteOrgDepartmentModal,
  } = props;

  const { isMobileView: isDefaultMobileView } = useWindowDimensions();

  // disable shorting for state
  const [disableSorting, setDisableSoritng] = useState<boolean>();

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
      cellRenderer: (params: ICellRendererParams) => {
        setDisableSoritng(params?.data !== undefined);
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
      sortable: disableSorting,
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
      sortable: disableSorting,
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

    {
      field: 'Action',
      sortable: false,
      cellClass: '!flex items-center',
      minWidth: 200,
      cellRenderer: (params: { data: DepartmentRowObj }) => {
        const permissionArray = [];

        permissionArray.push({
          label: 'Edit',
          onClick: () => {
            setModal({
              edit: true,
              id: params?.data?.id,
              add: false,
            });
          },
        });

        permissionArray.push({
          label: 'Delete',
          onClick: () => {
            if (params?.data?.id) {
              openDeleteOrgDepartmentModal();
              setSelectionList({ [params.data.id]: params.data });
            }
          },
        });

        return (
          <>
            <TableActionButton filedArray={[...permissionArray]} />
          </>
        );
      },
    },
  ];

  if (isDefaultMobileView) {
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

        if (
          typeof isMobileView === 'boolean' &&
          isMobileView &&
          params?.data?.id
        ) {
          permissionArray.push({
            label: 'Delete',
            onClick: () => {
              if (params?.data?.id) {
                openDeleteOrgDepartmentModal();
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

export default useOrgDepartmentsColumns;
