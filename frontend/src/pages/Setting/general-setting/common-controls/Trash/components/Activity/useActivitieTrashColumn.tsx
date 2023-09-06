
// ** import packages ** //
import { Dispatch, SetStateAction } from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { useNavigate } from 'react-router-dom';

// ** hooks ** //
import useAuth from 'hooks/useAuth';

// ** components ** //
import DateFormat from 'components/DateFormat';
import { TableActionButton } from 'components/Button/TableActionButton';
import TableCellRenderer from 'components/TableInfiniteScroll/TableCellRender';
import Icon from 'components/Icon';

// ** others ** //
import {
  BasicPermissionTypes,
  ModuleNames,
} from 'constant/permissions.constant';
import { setUrlParams } from 'utils/util';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

interface Props {
  setOpenModal: Dispatch<
    SetStateAction<{
      delete: boolean;
      }>
  >;
  selectionRef?: any;
  setSelectionList?: any;
  setIsCheckAll?: any;
  isCheckAll?: boolean;
  isCheckAllRef?: any;
  disabled?: boolean;
  isSelectionDisabled?: boolean;
  openDeleteActivityModal: () => void;
  restoreData:(id?: number | undefined) => void;
  setActionBtnState: React.Dispatch<React.SetStateAction<boolean>>;
}

const useActivityTrash = (props: Props) => {
  const {
    selectionRef,
    disabled,
    setSelectionList,
    setIsCheckAll,
    isCheckAll,
    isCheckAllRef,
    isSelectionDisabled,
    restoreData ,
    openDeleteActivityModal,
    setActionBtnState
  } = props;

  const defaultColDef = { sortable: true, rowSelection: 'multiple' };

  // ** custom hooks **
  const { hasAuthorized } = useAuth();

  const deleteActivityPermission = hasAuthorized([
    { module: ModuleNames.ACTIVITY, type: BasicPermissionTypes.DELETE },
  ]);

  const editPermission = hasAuthorized([
    { module: ModuleNames.ACTIVITY, type: BasicPermissionTypes.UPDATE },
  ]);

  const deletePermission = hasAuthorized([
    { module: ModuleNames.ACTIVITY, type: BasicPermissionTypes.DELETE },
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
                  setActionBtnState(false)
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
            <input
              className="agGrid__customInput"
              ref={(ref: HTMLInputElement | null) => {
                if (!ref) return;

                ref.onclick = (e) => {
                  setActionBtnState(false)
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
          );
        }
        return <span className="skeletonBox w-[16px] h-[16px] rounded-[3px]" />;
      },
    },
    {
      field: 'topic',
      headerName: 'Activity Title',
      sortable: true,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Activity Title"
            params={params}
            isMobileView={isMobileView}
            cellValue={params?.data?.topic}
          />
        );
      },
    },
    {
      field: 'updated_by',
      headerName: 'Deleted By',
      sortable: true,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Deleted By"
            params={params}
            isMobileView={isMobileView}
            cellValue={params?.data?.modifier?.full_name}
          />
        );
      },
    },
    {
      field: 'deleted_at',
      headerName: 'Deleted Time',
      sortable: true,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Activity Title"
            params={params}
            isMobileView={isMobileView}
            cellValue={  <DateFormat format="Pp" date={params?.data?.deleted_at} />}
          />
        );
      },
    },
    {
      field: 'Action',
      sortable: false,
      cellClass: '!flex items-center',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        const permissionArray = [];

        if (typeof isMobileView !== 'boolean' &&
        deleteActivityPermission 
        && params?.data?.id) {
          permissionArray.push({
            label: 'Delete Permanently',
            onClick: () =>{
              setActionBtnState(true)
                if (params?.data?.id) {
                  openDeleteActivityModal()
                    setSelectionList({ [params.data.id]: params.data });
                  }
            }
          });
          if (typeof isMobileView !== 'boolean' && 
          editPermission &&
          params?.data?.id) {
            permissionArray.push({
              label: 'Restore',
              onClick: () =>{
                setActionBtnState(true)
                if (params?.data?.id) {
                  restoreData(params.data.id)
                }
               }
            });
          }
        }

        
        return (
          <>
            {disabled ? (
              <span className="skeletonBox" />
            ) : (
              <TableActionButton filedArray={[...permissionArray]} />
            )}
            <ActivityCardMobileViewEye
              isMobileView={isMobileView}
              activityId={params?.data?.id}
            />
          </>
        );
      },
    },
  ];
  return { defaultColDef, columnDefs };
};

export default useActivityTrash;

type ActivityCardMobileViewEyePropsType = {
  activityId?: number;
  isMobileView?: boolean;
};
const ActivityCardMobileViewEye = (
  props: ActivityCardMobileViewEyePropsType
) => {
  const { isMobileView, activityId } = props;
  const navigate = useNavigate();
  const { hasAuthorized } = useAuth();
  const readPermission = hasAuthorized([
    { module: ModuleNames.ACTIVITY, type: BasicPermissionTypes.READ },
  ]);
  return (
    <>
      {isMobileView === true && readPermission && activityId && (
        <button
          className="viewBtn text-[14px] font-biotif__Medium text-primaryColor mr-[10px] underline duration-500 absolute top-[11px] right-[58px] z-[3] hover:text-primaryColor__hoverDark"
          onClick={() =>
            activityId &&
            navigate(
              setUrlParams(PRIVATE_NAVIGATION.activities.detailPage, activityId)
            )
          }
        >
          <Icon
            className="w-[28px] h-[28px] rounded-[6px] p-[5px] relative top-[-2px] duration-500 hover:bg-secondary__Btn__BGColor"
            iconType="eyeFilled"
            fill="var(--primaryColor)"
          />
        </button>
      )}
    </>
  );
};
