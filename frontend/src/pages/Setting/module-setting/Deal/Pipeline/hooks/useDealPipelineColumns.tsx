// ** Import Packages **
import { ICellRendererParams } from 'ag-grid-community';
import { Dispatch, SetStateAction } from 'react';

// ** Components **
import { TableActionButton } from 'components/Button/TableActionButton';
import TableCellRenderer from 'components/TableInfiniteScroll/TableCellRender';

// ** Hook **
import usePermission from 'hooks/usePermission';
import useWindowDimensions from 'hooks/useWindowDimensions';

interface Props {
  setModalForPipeline: Dispatch<
    SetStateAction<{ edit: boolean; add: boolean }>
  >;
  setPipelineId: React.Dispatch<React.SetStateAction<number | undefined>>;
  selectionRef?: any;
  setSelectionList?: any;
  setIsCheckAll?: any;
  isCheckAll?: boolean;
  isCheckAllRef?: any;
  isLoading?: boolean;
  disabled?: boolean;
  dataLength?: number;
  checked: number | undefined;
  changeDefaultType: (id: number, type: boolean) => Promise<void>;
  isSelectionDisabled?: boolean;
  openDeleteModal: (Id: number) => void;
}

const useDealPipelineColumns = (props: Props) => {
  const {
    setModalForPipeline,
    setPipelineId,
    selectionRef,
    setSelectionList,
    isLoading,
    changeDefaultType,
    isSelectionDisabled,
    openDeleteModal,
  } = props;

  const { isMobileView: isDefaultMobileView } = useWindowDimensions();
  // ** custom hooks **
  const { updateDealPermission, deleteDealPermission } = usePermission();

  const defaultColDefForPipeline = {
    sortable: true,
    showDisabledCheckboxes: true,
    rowSelection: 'multiple',
  };

  let isDefault;
  let isSystem;
  const columnDefsForPipeline = [
    {
      headerName: '',
      field: 'checkbox',
      width: 54,
      minWidth: 54,
      maxWidth: 54,
      hide: !deleteDealPermission,
      cellRenderer: (params: ICellRendererParams) => {
        const colId = params?.data?.id;
        isDefault = params?.data?.is_default;
        isSystem = params?.data?.is_system;

        const isDelete = !isSystem && !isDefault && deleteDealPermission;
        if (isDelete || isLoading) {
          return (
            <input
              className="agGrid__customInput"
              ref={(ref: HTMLInputElement | null) => {
                if (!ref) return;
                ref.onclick = (e) => {
                  const updatedList = {
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
              hidden={isDefault || isSystem}
              defaultChecked={!!selectionRef.current[colId]}
            />
          );
        }
        return isLoading ? (
          <span className="skeletonBox w-[16px] h-[16px] rounded-[3px]" />
        ) : (
          <></>
        );
      },
    },

    {
      field: 'name',
      headerName: 'Pipeline Name',
      sortable: true,
      suppressMenu: false,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Pipeline Name"
            params={params}
            isMobileView={isMobileView}
            cellValue={params?.data?.name || ''}
          />
        );
      },
    },
    {
      field: 'count',
      headerName: 'No. of Stages',
      sortable: false,
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="No. of Stages"
            params={params}
            isMobileView={isMobileView}
            // eslint-disable-next-line no-underscore-dangle
            cellValue={params?.data?.stages_count || ''}
          />
        );
      },
    },

    {
      field: 'rot_days',
      headerName: 'Deal Rot In',
      sortable: false,
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        const value = params?.data?.rot_days
          ? `${params?.data?.rot_days} days`
          : '';
        return (
          <TableCellRenderer
            label="Deal Rot In"
            params={params}
            isMobileView={isMobileView}
            cellValue={value}
          />
        );
      },
    },
    {
      headerName: 'My Default',
      field: 'is_default',
      cellRenderer: (params: ICellRendererParams) => {
        const isDefaultPipeline = params?.data?.is_default;
        const isSystemPipeline = params?.data?.is_system;
        return (
          <div className="ip__Checkbox setting__activity__mark__default ml-[28px] sm:ml-0 sm:absolute sm:top-[12px] sm:right-[38px] sm:w-[18px] sm:h-[18px]">
            {isLoading ? (
              <span className="skeletonBox w-[16px] h-[16px] rounded-[3px]" />
            ) : (
              <>
                <input
                  className="agGrid__customInput sm:!block sm:!absolute sm:!top-0 sm:!right-0 sm:!w-full sm:!h-full"
                  onChange={() => {
                    //
                  }}
                  value={params?.data?.id}
                  ref={(ref: HTMLInputElement | null) => {
                    if (!ref) return;
                    ref.onclick = (e) => {
                      e.stopPropagation();
                      if (params?.data?.is_default) {
                        changeDefaultType(params?.data?.id, false);
                      } else {
                        changeDefaultType(params?.data?.id, true);
                      }
                    };
                  }}
                  disabled={isDefaultPipeline && isSystemPipeline}
                  checked={!!params?.data?.is_default}
                  type="checkbox"
                />
                <label className="rc__Label" />
              </>
            )}
          </div>
        );
      },
    },
  ];

  if (updateDealPermission || (isDefaultMobileView && deleteDealPermission)) {
    columnDefsForPipeline.push({
      field: 'Action',
      sortable: false,
      cellClass: '!flex items-center',
      minWidth: 200,
      cellRenderer: (
        params: {
          data: {
            id: number;
            name: string;
            is_default: boolean;
            is_system: boolean;
          };
        },
        isMobileView?: boolean
      ) => {
        const permissionArray = [];
        isDefault = params?.data?.is_default;
        isSystem = params?.data?.is_system;

        if (updateDealPermission) {
          permissionArray.push({
            label: 'Edit',
            onClick: () => {
              setModalForPipeline((prev: any) => ({
                ...prev,
                edit: true,
                add: false,
              }));
              setPipelineId(params?.data?.id);
            },
          });
        }

        if (
          typeof isMobileView === 'boolean' &&
          isMobileView &&
          deleteDealPermission &&
          params?.data?.id &&
          !isSystem &&
          !isDefault
        ) {
          permissionArray.push({
            label: 'Delete',
            onClick: () => {
              if (params?.data?.id) {
                openDeleteModal(params?.data?.id);
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

  return { defaultColDefForPipeline, columnDefsForPipeline };
};

export default useDealPipelineColumns;
