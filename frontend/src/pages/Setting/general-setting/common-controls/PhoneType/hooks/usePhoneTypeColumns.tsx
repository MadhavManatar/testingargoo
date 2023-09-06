// ** Import Packages **
import { ICellRendererParams } from 'ag-grid-community';
import { Dispatch, SetStateAction } from 'react';

// ** Components **
import { TableActionButton } from 'components/Button/TableActionButton';
import TableCellRenderer from 'components/TableInfiniteScroll/TableCellRender';

// ** Hook **
import usePermission from 'hooks/usePermission';
import useWindowDimensions from 'hooks/useWindowDimensions';

// ** Constants **
import { SYSTEM_DEFAULT_LABEL } from 'constant';

interface Props {
  setModal: Dispatch<
    SetStateAction<{ edit: boolean; add: boolean; id?: null | number }>
  >;
  selectionRef?: any;
  setSelectionList?: any;
  setIsCheckAll?: any;
  isCheckAll?: boolean;
  isCheckAllRef?: any;
  disabled?: boolean;
  isLoading?: boolean;
  dataLength?: number;
  isSelectionDisabled?: boolean;
  openDeleteModal: () => void;
}

const usePhoneTypeColumns = (props: Props) => {
  const {
    setModal,
    selectionRef,
    setSelectionList,
    setIsCheckAll,
    isCheckAll,
    isCheckAllRef,
    disabled,
    isLoading,
    dataLength,
    isSelectionDisabled,
    openDeleteModal,
  } = props;

  const defaultColDef = {
    sortable: true,
    showDisabledCheckboxes: true,
    rowSelection: 'multiple',
  };

  const { updateContactPermission, deleteContactPermission } = usePermission();
  const { isMobileView: isDefaultMobileView } = useWindowDimensions();

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
              disabled={dataLength === 4 ? true : disabled}
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
      hide: !deleteContactPermission,
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
      headerName: 'Phone Type Name',
      sortable: true,
      suppressMenu: false,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Phone Type Name"
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
        params: {
          data: {
            is_system: boolean;
            id: number;
          };
        },
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
                openDeleteModal();
                setSelectionList({ [params.data.id]: params.data });
              }
            },
          });
        }

        return isLoading ? (
          <span className="skeletonBox" />
        ) : (
          <TableActionButton
            disabled={params?.data?.is_system}
            filedArray={[...permissionArray]}
          />
        );
      },
    } as any);
  }

  return { defaultColDef, columnDefs };
};

export default usePhoneTypeColumns;
