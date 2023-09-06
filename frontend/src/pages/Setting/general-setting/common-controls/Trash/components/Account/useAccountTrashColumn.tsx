// ** Import Packages **
import { ICellRendererParams } from 'ag-grid-community';
import { useNavigate } from 'react-router-dom';

// ** Components **
import { TableActionButton } from 'components/Button/TableActionButton';
import TableCellRenderer from 'components/TableInfiniteScroll/TableCellRender';

// ** Hooks **
import usePermission from 'hooks/usePermission';

// ** Type **
import {
  AccountDetails,
} from '../../../../../../Account/types/account.types';

// ** Constant **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

// ** Other **
import Icon from 'components/Icon';
import {setUrlParams } from 'utils/util';
import DateFormat from 'components/DateFormat';


const useAccountTrashColumn = ({
    selectionRef,
    setSelectionList,
    setIsCheckAll,
    isCheckAll,
    isCheckAllRef,
    disabled,
    isSelectionDisabled, openDeleteAccountModal, restoreData,setActionBtnState
  }: { selectionRef?: any;
    setSelectionList?: any;
    setIsCheckAll?: any;
    isCheckAll?: boolean;
    isCheckAllRef?: any;
    disabled?: boolean;
    isSelectionDisabled?: boolean;
    openDeleteAccountModal: () => void;
    restoreData:(id?: number | undefined) => void;
    setActionBtnState: React.Dispatch<React.SetStateAction<boolean>>;}) => {
    const defaultColDef = { sortable: true, rowSelection: 'multiple' };
  
    // ** Hook **
    const navigate = useNavigate();
  
    // ** Custom Hooks **
    const {
      updateAccountPermission,
      deleteAccountPermission,
    } = usePermission();
  
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
        hide: !deleteAccountPermission,
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
                hidden={disabled}
                type="checkbox"
                defaultChecked={selectionRef.current[colId]}
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
        filter: 'agTextColumnFilter',
        cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
          return (
            <TableCellRenderer
              label="Name"
              params={params}
              isMobileView={isMobileView}
              cellValue={params?.data?.name}
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
              label="Deleted Time"
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
        cellRenderer: (
          params: { data: AccountDetails },
          isMobileView?: boolean
        ) => {
          const permissionArray = [];
          if (typeof isMobileView !== 'boolean' && 
          deleteAccountPermission && 
          params?.data?.id) {
            permissionArray.push({
              label: 'Delete Permanently',
              onClick: () =>{
                setActionBtnState(true)
                if(params?.data?.id){
                  openDeleteAccountModal();
                setSelectionList({ [params.data.id]: params.data });
                }
              }
            });
          }
          if (typeof isMobileView !== 'boolean' && 
          updateAccountPermission 
          && 
          params?.data?.id) {
            permissionArray.push({
              label: 'Restore',
              onClick: () =>{
                setActionBtnState(true)
                  if (params?.data?.id) {
                    restoreData(params.data.id);
                }
                }
            });
          }
  
          return (
            <>
              {disabled ? (
                <span className="skeletonBox" />
              ) : (
                <TableActionButton filedArray={[...permissionArray]} />
              )}
              {isMobileView === true &&
                updateAccountPermission &&
                params?.data?.id && (
                  <button
                    className="viewBtn text-[14px] font-biotif__Medium text-primaryColor mr-[10px] underline duration-500 absolute top-[11px] right-[58px] z-[3] hover:text-primaryColor__hoverDark"
                    onClick={() =>
                      params.data.id &&
                      navigate(
                        setUrlParams(
                          PRIVATE_NAVIGATION.accounts.detailPage,
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
                )}
            </>
          );
        },
      },
    ];
    return { defaultColDef, columnDefs };
  };
  
  export default useAccountTrashColumn;