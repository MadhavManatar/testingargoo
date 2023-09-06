// ** import packages **
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { useNavigate } from 'react-router-dom';

// ** components **
import DateFormat from 'components/DateFormat';
import { TableActionButton } from 'components/Button/TableActionButton';
import TableCellRenderer from 'components/TableInfiniteScroll/TableCellRender';

// ** custom hooks **
import useAuth from 'hooks/useAuth';

// ** types **
import { DepartmentRowObj } from '../types/department.types';

// ** constant **
import {
  BasicPermissionTypes,
  ModuleNames,
} from 'constant/permissions.constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import Icon from 'components/Icon';

type Props = {
  selectionRef?: any;
  setSelectionList?: any;
  setIsCheckAll?: any;
  isCheckAll?: boolean;
  isCheckAllRef?: any;
  disabled?: any;
  isSelectionDisabled?: boolean;
  openDeleteModal: () => void;
};

const useDepartmentColumns = ({
  selectionRef,
  setSelectionList,
  setIsCheckAll,
  isCheckAll,
  disabled,
  isCheckAllRef,
  isSelectionDisabled,
  openDeleteModal,
}: Props) => {
  // ** hooks **
  const navigate = useNavigate();

  // ** Custom hooks **
  const { hasAuthorized } = useAuth();

  const defaultColDef = {
    filter: false,
  };

  const columnDefs: ColDef[] = [
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
      },
    },
    {
      headerName: 'Name',
      field: 'name',
      sortable: !isSelectionDisabled,
      suppressMenu: false,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Name"
            isLoading={disabled}
            isMobileView={isMobileView}
            cellValue={params?.data?.name}
          />
        );
      },
    },
    {
      headerName: 'Created At',
      field: 'created_at',
      sortable: !isSelectionDisabled,
      suppressMenu: false,
      filter: 'agDateColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Created At"
            isLoading={disabled}
            isMobileView={isMobileView}
            cellValue={
              params?.data?.created_at ? (
                <DateFormat format="Pp" date={params?.data?.created_at} />
              ) : (
                ''
              )
            }
          />
        );
      },
    },
    {
      headerName: 'Updated At',
      field: 'updated_at',
      suppressMenu: false,
      sortable: !isSelectionDisabled,
      filter: 'agDateColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Updated At"
            isLoading={disabled}
            isMobileView={isMobileView}
            cellValue={
              params?.data?.updated_at ? (
                <DateFormat format="Pp" date={params?.data?.updated_at} />
              ) : (
                ''
              )
            }
          />
        );
      },
    },
    {
      ...(hasAuthorized([
        {
          module: ModuleNames.DEPARTMENT,
          type: BasicPermissionTypes.UPDATE,
        },
      ]) && {
        field: 'Action',
        sortable: false,
        cellClass: '!flex items-center',
        minWidth: 200,
        cellRenderer: (
          params: { data: DepartmentRowObj },
          isMobileView?: boolean
        ) => {
          const permissionArray = [];
          if (
            hasAuthorized([
              {
                module: ModuleNames.DEPARTMENT,
                type: BasicPermissionTypes.UPDATE,
              },
            ])
          ) {
            permissionArray.push({
              label: 'Edit',
              onClick: () =>
                navigate(
                  `${PRIVATE_NAVIGATION.settings.department.edit}/${params?.data?.id}`
                ),
            });
          }

          if (
            typeof isMobileView === 'boolean' &&
            isMobileView &&
            hasAuthorized([
              {
                module: ModuleNames.DEPARTMENT,
                type: BasicPermissionTypes.DELETE,
              },
            ]) &&
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
              <TableActionButton filedArray={[...permissionArray]} />
              <button
                className="viewBtn text-[14px] font-biotif__Medium text-primaryColor mr-[10px] underline duration-500 absolute top-[11px] right-[58px] z-[3] hover:text-primaryColor__hoverDark hidden sm:block"
                onClick={() =>
                  navigate(
                    `${PRIVATE_NAVIGATION.settings.department.edit}/${params?.data?.id}`
                  )
                }
              >
                <Icon
                  className="w-[28px] h-[28px] rounded-[6px] p-[5px] relative top-[-2px] duration-500 hover:bg-secondary__Btn__BGColor"
                  iconType="eyeFilled"
                  fill="var(--primaryColor)"
                />
              </button>
            </>
          );
        },
      }),
    },
  ];

  return { defaultColDef, columnDefs };
};

export default useDepartmentColumns;
