// ** Import Packages **
import { ICellRendererParams } from 'ag-grid-community';

// ** Components **
import { TableActionButton } from 'components/Button/TableActionButton';
import TableCellRenderer from 'components/TableInfiniteScroll/TableCellRender';

// ** Constants **
import { SYSTEM_DEFAULT_LABEL } from 'constant';

// ** Types **
import { UseSnippetCategoryColumnsPropsTypes } from '../types/snippetCategory.types';

const useSnippetCategoryColumns = (
  props: UseSnippetCategoryColumnsPropsTypes
) => {
  const {
    disabled,
    isCheckAll,
    selectionRef,
    setIsCheckAll,
    isCheckAllRef,
    setSelectionList,
    isSelectionDisabled,
    openEditSnippetModal,
    openDeleteSnippetModal,
  } = props;

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
      ),
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
      headerName: 'Name',
      sortable: true,
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
  columnDefs.push({
    field: 'Action',
    sortable: false,
    cellClass: '!flex items-center',
    minWidth: 200,
    cellRenderer: (
      params: { data: { is_system: boolean; id: number } },
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
        <TableActionButton
          disabled={params?.data?.is_system}
          filedArray={[...permissionArray]}
        />
      );
    },
  } as any);

  return { defaultColDef, columnDefs };
};

export default useSnippetCategoryColumns;
