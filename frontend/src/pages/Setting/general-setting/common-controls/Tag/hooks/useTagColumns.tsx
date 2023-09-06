// ** import packages **
import { ICellRendererParams } from 'ag-grid-community';

// ** types **
import { TagDetails } from '../types/tag.type';

// ** components **
import { TableActionButton } from 'components/Button/TableActionButton';
import TableCellRenderer from 'components/TableInfiniteScroll/TableCellRender';

// ** hooks **
import useAuth from 'hooks/useAuth';

// ** constants **
import {
  BasicPermissionTypes,
  ModuleNames,
} from 'constant/permissions.constant';
import { SYSTEM_DEFAULT_LABEL } from 'constant';

interface Props {
  openEditTagModal: (id: number) => void;
  openChangeColorTagModal: (id: number) => void;
  selectionRef?: any;
  setSelectionList?: any;
  setIsCheckAll?: any;
  disabled?: any;
  isCheckAll?: boolean;
  isCheckAllRef?: any;
  isSelectionDisabled?: boolean;
  openDeleteTagsModal: () => void;
}

const useTagColumns = (props: Props) => {
  const {
    openChangeColorTagModal,
    openEditTagModal,
    selectionRef,
    setSelectionList,
    setIsCheckAll,
    isCheckAll,
    disabled,
    isCheckAllRef,
    isSelectionDisabled,
    openDeleteTagsModal,
  } = props;

  const defaultColDef = { sortable: true, rowSelection: 'multiple' };

  // ** custom hooks **
  const { hasAuthorized } = useAuth();

  const editPermission = hasAuthorized([
    { module: ModuleNames.TAG, type: BasicPermissionTypes.UPDATE },
  ]);

  const deletePermission = hasAuthorized([
    { module: ModuleNames.TAG, type: BasicPermissionTypes.DELETE },
  ]);

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
      hide: !deletePermission,
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
                disabled={isSelectionDisabled}
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
      field: 'name',
      headerName: 'Tag Name',
      sortable: !isSelectionDisabled,

      suppressMenu: false,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Tag Name"
            params={params}
            isMobileView={isMobileView}
            cellValue={params?.data?.name || ''}
          />
        );
      },
    },
    {
      field: 'color',
      headerName: 'Color',
      sortable: !isSelectionDisabled,
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Color"
            params={params}
            isMobileView={isMobileView}
            cellValue={
              <div
                className="cell__value__wrapper cursor-pointer"
                onClick={() =>
                  editPermission
                    ? openChangeColorTagModal(params?.data?.id)
                    : ''
                }
              >
                <div className="value w-[30px] h-[30px] p-[3px] border border-ipBlack__borderColor rounded-full colorRound__Box">
                  <span
                    className="block w-full h-full rounded-full"
                    style={{
                      backgroundColor: `${params?.data?.color || ''}`,
                    }}
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

  if (editPermission) {
    columnDefs.push({
      field: 'Action',
      sortable: false,
      cellClass: '!flex items-center',
      cellRenderer: (params: { data: TagDetails }, isMobileView?: boolean) => {
        const permissionArray = [];

        permissionArray.push({
          label: 'Edit',
          onClick: () => openEditTagModal(params?.data?.id),
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
                openDeleteTagsModal();
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
              <TableActionButton filedArray={[...permissionArray]} />
            )}
          </>
        );
      },
    } as any);
  }
  return { defaultColDef, columnDefs };
};

export default useTagColumns;
