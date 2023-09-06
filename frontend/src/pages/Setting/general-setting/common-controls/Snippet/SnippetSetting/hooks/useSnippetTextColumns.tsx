// ** import packages **
import { ICellRendererParams } from 'ag-grid-community';
import { useSelector } from 'react-redux';

// ** Redux **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** components **
import { TableActionButton } from 'components/Button/TableActionButton';
import TableCellRenderer from 'components/TableInfiniteScroll/TableCellRender';

// ** constants **
import { SNIPPET_DEFAULT_TYPE, SYSTEM_DEFAULT_LABEL } from 'constant';

// ** Types **
import {
  SnippetResponseType,
  UseSnippetTextColumnsPropsTypes,
} from '../types/snippetText.types';

const useSnippetTextColumns = (props: UseSnippetTextColumnsPropsTypes) => {
  const {
    openEditSnippetModal,
    selectionRef,
    setSelectionList,
    setIsCheckAll,
    isCheckAll,
    disabled,
    isCheckAllRef,
    isSelectionDisabled,
    openDeleteSnippetModal,
  } = props;
  const user = useSelector(getCurrentUser);
  const defaultColDef = { sortable: true, rowSelection: 'multiple' };

  const columnDefs = [
    {
      headerName: 'Select All',
      field: 'checkbox',
      width: 54,
      minWidth: 54,
      maxWidth: 54,
      headerComponent: () => (
        <>
          {disabled ? (
            <span className="skeletonBox w-[16px] h-[16px] rounded-[3px]" />
          ) : (
            <input
              className="agGrid__customInput"
              checked={isCheckAll}
              type="checkbox"
              disabled={disabled || isSelectionDisabled}
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
        const colId = params?.data?.id;
        if (params.data) {
          return (
            <>
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
                disabled={
                  isSelectionDisabled || params?.data?.created_by !== user?.id
                }
                type="checkbox"
                hidden={disabled}
                defaultChecked={selectionRef.current[colId]}
              />
            </>
          );
        }
        return <span className="skeletonBox w-[16px] h-[16px] rounded-[3px]" />;
      },
    },
    {
      field: 'title',
      headerName: 'Title',
      sortable: !isSelectionDisabled,
      suppressMenu: false,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="title"
            params={params}
            isMobileView={isMobileView}
            cellValue={params?.data?.title || ''}
          />
        );
      },
    },
    {
      field: 'type',
      headerName: 'Type',
      sortable: !isSelectionDisabled,
      suppressMenu: false,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        const typeLabel = SNIPPET_DEFAULT_TYPE.find(
          (type) => type.value === params?.data?.type
        )?.label;
        return (
          <TableCellRenderer
            label="type"
            params={params}
            isMobileView={isMobileView}
            cellValue={typeLabel || ''}
          />
        );
      },
    },
    {
      field: 'category',
      headerName: 'Category',
      sortable: !isSelectionDisabled,
      suppressMenu: false,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="category"
            params={params}
            isMobileView={isMobileView}
            cellValue={params?.data?.snippet_category?.name || ''}
          />
        );
      },
    },
    {
      field: 'accessibility',
      headerName: 'accessibility',
      sortable: !isSelectionDisabled,
      suppressMenu: false,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="accessibility"
            params={params}
            isMobileView={isMobileView}
            cellValue={params?.data?.accessibility || ''}
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
        const userName = params?.data?.is_system
          ? SYSTEM_DEFAULT_LABEL
          : params?.data?.creator?.full_name ||
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

  columnDefs.push({
    field: 'Action',
    sortable: false,
    cellClass: '!flex items-center',
    cellRenderer: (
      params: { data: SnippetResponseType },
      isMobileView?: boolean
    ) => {
      const permissionArray = [];

      permissionArray.push({
        label: 'Edit',
        onClick: () => openEditSnippetModal(params?.data?.id),
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
              openDeleteSnippetModal();
              setSelectionList({ [params.data.id]: params.data });
            }
          },
        });
      }
      return (
        <>
          {disabled ? (
            <span className="skeletonBox " />
          ) : (
            <TableActionButton
              filedArray={[...permissionArray]}
              buttonClassName={
                params?.data?.created_by === user?.id
                  ? 'pointer-events-auto cursor-pointer'
                  : 'pointer-events-none opacity-50 cursor-not-allowed'
              }
            />
          )}
        </>
      );
    },
  } as any);
  return { defaultColDef, columnDefs };
};

export default useSnippetTextColumns;
