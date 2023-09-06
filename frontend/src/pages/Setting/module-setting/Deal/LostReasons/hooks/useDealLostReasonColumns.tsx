// ** Import Packages **
import { ICellRendererParams } from 'ag-grid-community';
import { Dispatch, SetStateAction } from 'react';

// ** Components **
import { TableActionButton } from 'components/Button/TableActionButton';
import TableCellRenderer from 'components/TableInfiniteScroll/TableCellRender';

//  ** Hook **
import usePermission from 'hooks/usePermission';
import useWindowDimensions from 'hooks/useWindowDimensions';

interface Props {
  setOpenModal: Dispatch<
    SetStateAction<{ edit: boolean; add: boolean; id?: null | number }>
  >;
  selectionRef?: any;
  setSelectionList?: any;
  setIsCheckAll?: any;
  isLoading?: boolean;
  isCheckAll?: boolean;
  disabled: boolean;
  isCheckAllRef?: any;
  isSelectionDisabled?: boolean;
  openDeleteLostReasonModal: () => void;
}

const useDealLostReasonColumns = (props: Props) => {
  const {
    setOpenModal,
    selectionRef,
    setSelectionList,
    setIsCheckAll,
    isCheckAll,
    isCheckAllRef,
    isLoading,
    disabled,
    isSelectionDisabled,
    openDeleteLostReasonModal,
  } = props;

  // ** hooks **
  const { isMobileView: isDefaultMobileView } = useWindowDimensions();

  // ** custom hooks **
  const { updateDealPermission, deleteDealPermission } = usePermission();

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
      hide: !deleteDealPermission,
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
            />
          );
        }
        return <span className="skeletonBox w-[16px] h-[16px] rounded-[3px]" />;
      },
    },
    {
      field: 'reason',
      headerName: 'Lost Reason',
      sortable: !isSelectionDisabled,
      suppressMenu: false,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Lost Reason"
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
        const creatorName =
          params?.data?.creator?.first_name && params?.data?.creator?.last_name
            ? `${params?.data?.creator?.first_name} ${params?.data?.creator?.last_name}`
            : '';
        const userName = params?.data?.creator?.full_name || creatorName;

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
  if (updateDealPermission || (isDefaultMobileView && deleteDealPermission)) {
    columnDefs.push({
      field: 'Action',
      sortable: false,
      cellClass: '!flex items-center',
      minWidth: 200,
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        const permissionArray = [];
        if (updateDealPermission) {
          permissionArray.push({
            label: 'Edit',
            onClick: () =>
              setOpenModal((prev: any) => ({
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
          deleteDealPermission &&
          params?.data?.id
        ) {
          permissionArray.push({
            label: 'Delete',
            onClick: () => {
              if (params?.data?.id) {
                openDeleteLostReasonModal();
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

export default useDealLostReasonColumns;
