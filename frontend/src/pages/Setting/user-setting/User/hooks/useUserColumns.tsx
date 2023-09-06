// ** Import Packages **
import { ICellRendererParams } from 'ag-grid-community';
import { useNavigate } from 'react-router-dom';

// ** Components **
import { TableActionButton } from 'components/Button/TableActionButton';
import DateFormat from 'components/DateFormat';
import Icon from 'components/Icon';
import TableCellRenderer from 'components/TableInfiniteScroll/TableCellRender';

// ** Hook **
import usePermission from 'hooks/usePermission';

// ** Type **
import { User, UseUserColumnsPropsType } from '../types/user.types';

// ** Constant **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

// ** Utils **
import { isAdministrator, isOrganizationOwner, isSelfId } from 'utils/is';
import { formatPhoneNumber, setUrlParams } from 'utils/util';
import { useUpdateUserMutation } from 'redux/api/userApi';

const useUserColumns = ({
  selectionRef,
  setSelectionList,
  disabled,
  setDefaultId,
  isSelectionDisabled,
  openDeleteUserModal,
}: UseUserColumnsPropsType) => {
  const defaultColDef = {
    sortable: true,
    showDisabledCheckboxes: true,
    rowSelection: 'multiple',
  };

  // ** Hooks **
  const navigate = useNavigate();

  // ** Custom Hooks **
  const { readUserPermission, updateUserPermission, deleteUserPermission } =
    usePermission();

  // ** APIS **
  const [updateUserByIdAPI] = useUpdateUserMutation();
  const isAdmin = isAdministrator();

  let id: number;

  const user2FAdisable = async (user: User) => {
    if (user?.id) {
      const data = await updateUserByIdAPI({
        id: user?.id,
        data: { email: user.email, two_factor_enabled: false },
      });
      if ('data' in data) {
        return true;
      }
    }
    return false;
  };

  const columnDefs = [
    {
      headerName: '',
      field: 'checkbox',
      width: 54,
      minWidth: 54,
      maxWidth: 54,
      cellRenderer: (params: ICellRendererParams) => {
        const colId = params?.data?.id;
        id = params?.data?.id;
        if (params?.data) {
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
                if (isOrganizationOwner(id) && isSelfId(id) && setDefaultId)
                  setDefaultId(id);
              }}
              disabled={isSelectionDisabled}
              type="checkbox"
              hidden={isOrganizationOwner(id) || isSelfId(id)}
              defaultChecked={selectionRef.current[colId]}
            />
          );
        }
        return <span className="skeletonBox w-[16px] h-[16px] rounded-[3px]" />;
      },
    },
    {
      field: 'first_name',
      headerName: 'First Name',
      sortable: true,
      suppressMenu: false,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="First Name"
            params={params}
            isMobileView={isMobileView}
            cellValue={params?.data?.first_name || ''}
          />
        );
      },
    },
    {
      field: 'last_name',
      headerName: 'Last Name',
      sortable: true,
      suppressMenu: false,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Last Name"
            params={params}
            isMobileView={isMobileView}
            cellValue={params?.data?.last_name || ''}
          />
        );
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      sortable: true,
      suppressMenu: false,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Email"
            params={params}
            isMobileView={isMobileView}
            cellValue={params?.data?.email || ''}
          />
        );
      },
    },
    {
      field: 'birth_date',
      headerName: 'Birth Date',
      sortable: true,
      suppressMenu: false,
      filter: 'agDateColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Birth Date"
            params={params}
            isMobileView={isMobileView}
            cellValue={
              params?.data?.birth_date ? (
                <span className="value block w-full text-[14px] leading-[18px] font-biotif__Medium text-black">
                  <DateFormat date={params?.data?.birth_date} />
                </span>
              ) : (
                ''
              )
            }
          />
        );
      },
    },
    {
      field: 'phone',
      headerName: 'Phone',
      sortable: true,
      suppressMenu: false,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Phone"
            params={params}
            isMobileView={isMobileView}
            cellValue={formatPhoneNumber(params?.data?.phone) || ''}
          />
        );
      },
    },
    ...(isAdmin
      ? [
          {
            field: '2FA',
            headerName: '2FA',
            sortable: false,
            cellRenderer: (params: ICellRendererParams) => {
              return (
                <button
                  ref={(ref) => {
                    if (!ref) return;
                    ref.onclick = (e) => {
                      e.stopPropagation();
                      user2FAdisable(params?.data).then((result) => {
                        if (result === true)
                          params.data.two_factor_enabled = false;
                      });
                    };
                  }}
                  className="i__Button primary__Btn smaller !px-[17px] !py-[8px]"
                  disabled={!params?.data?.two_factor_enabled}
                >
                  Disable
                </button>
              );
            },
          },
        ]
      : []),
    {
      field: 'Action',
      sortable: false,
      cellClass: '!flex items-center',
      minWidth: 200,
      cellRenderer: (
        params: { data: { id: number } },
        isMobileView?: boolean
      ) => {
        const permissionArray = [];
        if (readUserPermission && params?.data?.id) {
          permissionArray.push({
            label: 'View',
            onClick: () =>
              navigate(
                setUrlParams(
                  PRIVATE_NAVIGATION.settings.user.detailPage,
                  params?.data?.id
                )
              ),
          });
        }

        if (updateUserPermission && params?.data?.id) {
          permissionArray.push({
            label: 'Edit',
            onClick: () =>
              navigate(
                setUrlParams(
                  PRIVATE_NAVIGATION.settings.user.edit,
                  params?.data?.id
                )
              ),
          });
        }

        if (
          typeof isMobileView === 'boolean' &&
          isMobileView &&
          deleteUserPermission &&
          params?.data?.id
        ) {
          permissionArray.push({
            label: 'Delete',
            onClick: () => {
              if (params?.data?.id) {
                openDeleteUserModal([params.data.id]);
                setSelectionList({ [params.data.id]: params.data });
                selectionRef.current = { [params.data.id]: params.data };
              }
            },
          });
        }

        return (
          <>
            {disabled ? (
              <span className="skeletonBox" />
            ) : (
              <TableActionButton filedArray={[...permissionArray]} />
            )}
            <button
              className="viewBtn text-[14px] font-biotif__Medium text-primaryColor mr-[10px] underline duration-500 absolute top-[11px] right-[58px] z-[3] hover:text-primaryColor__hoverDark hidden sm:block"
              onClick={() =>
                params.data.id &&
                navigate(
                  setUrlParams(
                    PRIVATE_NAVIGATION.settings.user.detailPage,
                    params?.data?.id
                  )
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

  return {
    defaultColDef,
    columnDefs,
  };
};

export default useUserColumns;
