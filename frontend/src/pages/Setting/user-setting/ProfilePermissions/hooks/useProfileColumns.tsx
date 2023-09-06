// ** external packages **
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { useNavigate } from 'react-router-dom';

// ** components **
import { TableActionButton } from 'components/Button/TableActionButton';
import DateFormat from 'components/DateFormat';
import Icon from 'components/Icon';
import TableCellRenderer from 'components/TableInfiniteScroll/TableCellRender';

//  ** types **
import { ProfilesRowObj } from '../types/profile-permissions.types';

// ** hooks **
import useAuth from 'hooks/useAuth';

// ** others **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import {
  BasicPermissionTypes,
  ModuleNames,
} from 'constant/permissions.constant';
import { isAdministrator } from 'utils/is';

interface Props {
  setIsEdit: (editMode: boolean) => void;
  setCurrentEdit: (profileId: ProfilesRowObj) => void;
  selectionRef?: any;
  setSelectionList?: any;
  isSelectionDisabled?: boolean;
  openDeleteProfileModal: () => void;
}

const useProfileColumns = ({
  setIsEdit,
  setCurrentEdit,
  selectionRef,
  setSelectionList,
  isSelectionDisabled,
  openDeleteProfileModal,
}: Props) => {
  // ** Custom hooks **
  const navigate = useNavigate();
  const { hasAuthorized } = useAuth();

  const defaultColDef = { filter: false };
  let name;
  const columnDefs: ColDef[] = [
    {
      headerName: '',
      field: 'checkbox',
      width: 54,
      minWidth: 54,
      maxWidth: 54,

      cellRenderer: (params: ICellRendererParams) => {
        const colId = params?.data?.id;
        name = params?.data?.name;

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
            hidden={isAdministrator(name)}
            defaultChecked={selectionRef.current[colId]}
          />
        );
      },
    },
    {
      headerName: 'Name',
      field: 'name',
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
      headerName: 'User Profile',
      field: 'UserProfile',
      sortable: false,

      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        const userProfileMessage =
          params?.data?.user_roles?.length > 0
            ? `${params?.data?.user_roles?.length} User(s)`
            : `No users assigned`;

        return (
          <TableCellRenderer
            label="User Profile"
            params={params}
            isMobileView={isMobileView}
            cellValue={userProfileMessage}
          />
        );
      },
    },
    {
      headerName: 'Created At',
      field: 'created_at',
      sortable: true,
      suppressMenu: false,
      filter: 'agDateColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        const Date = params?.data?.created_at ? (
          <DateFormat format="Pp" date={params?.data?.created_at} />
        ) : (
          ''
        );
        return (
          <TableCellRenderer
            label="Created At"
            params={params}
            isMobileView={isMobileView}
            cellValue={Date}
          />
        );
      },
    },
    {
      headerName: 'Updated At',
      field: 'updated_at',
      suppressMenu: false,
      filter: 'agDateColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        const Date = params?.data?.updated_at ? (
          <DateFormat format="Pp" date={params?.data?.updated_at} />
        ) : (
          ''
        );
        return (
          <TableCellRenderer
            label="Updated At"
            params={params}
            isMobileView={isMobileView}
            cellValue={Date}
          />
        );
      },
    },
    {
      field: 'Action',
      sortable: false,
      cellClass: '!flex items-center',
      minWidth: 200,
      cellRenderer: (
        params: { data: ProfilesRowObj },
        isMobileView?: boolean
      ) => {
        name = params?.data?.name;
        const permissionArray = [];
        if (
          hasAuthorized([
            {
              module: ModuleNames.PROFILE_AND_PERMISSION,
              type: BasicPermissionTypes.UPDATE,
            },
          ])
        ) {
          permissionArray.push({
            label: 'Edit',
            onClick: () => {
              setIsEdit(true);
              setCurrentEdit(params.data);
            },
          });
        }

        if (
          typeof isMobileView === 'boolean' &&
          isMobileView &&
          hasAuthorized([
            {
              module: ModuleNames.PROFILE_AND_PERMISSION,
              type: BasicPermissionTypes.DELETE,
            },
          ]) &&
          params?.data?.id &&
          !isAdministrator(name)
        ) {
          permissionArray.push({
            label: 'Delete',
            onClick: () => {
              if (params?.data?.id) {
                openDeleteProfileModal();
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
                params.data.id &&
                navigate(
                  `${PRIVATE_NAVIGATION.settings.profileAndPermissions.edit}/${params?.data?.id}`
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
    },
  ];

  return { defaultColDef, columnDefs };
};

export default useProfileColumns;
