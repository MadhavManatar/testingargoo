// ** Import Packages **
import { ICellRendererParams } from 'ag-grid-community';
import { useNavigate } from 'react-router-dom';

// ** Components **
import { TableActionButton } from 'components/Button/TableActionButton';
import Icon from 'components/Icon';
import TableCellRenderer from 'components/TableInfiniteScroll/TableCellRender';

// ** Hook **
import usePermission from 'hooks/usePermission';

// ** Type **
import {
  ContactDetails,
  useContactTrashColumnsDefProps,
} from '../../../../../../Contact/types/contacts.types';

// ** Constants **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

// ** Others **
import { setUrlParams } from 'utils/util';
import DateFormat from 'components/DateFormat';

const useContactTrashColumn = ({
  selectionRef,
  setSelectionList,
  setIsCheckAll,
  isCheckAll,
  disabled,
  isCheckAllRef,
  isSortable,
  isSelectionDisabled,
  openDeleteContactModal,
  restoreData,
  setActionBtnState
}: useContactTrashColumnsDefProps) => {
  const defaultColDef = { sortable: isSortable, rowSelection: 'multiple' };

  // ** hooks **
  const navigate = useNavigate();

  // ** Custom hooks **
  const { updateContactPermission, deleteContactPermission } = usePermission();

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
      hide: !deleteContactPermission,
      cellRenderer: (params: ICellRendererParams) => {
        const colId = params?.data?.id;
        if (params?.data) {
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
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label="Deleted Time"
            params={params}
            isMobileView={isMobileView}
            cellValue={
              <DateFormat format="Pp" date={params?.data?.deleted_at} />
            }
          />
        );
      },
    },
    {
      field: 'Action',
      sortable: false,
      cellClass: '!flex items-center',
      cellRenderer: (
        params: { data: ContactDetails },
        isMobileView?: boolean
      ) => {
        const permissionArray = [];
        if (
          typeof isMobileView !== 'boolean' &&
          deleteContactPermission &&
          params?.data?.id
        ) {
          permissionArray.push({
            label: 'Delete Permanently',
            onClick: () => {
              setActionBtnState(true)
              openDeleteContactModal();
              setSelectionList({ [params.data.id]: params.data });
            },
          });
        }
        if (
          typeof isMobileView !== 'boolean' &&
          updateContactPermission &&
          params?.data?.id
        ) {
          permissionArray.push({
            label: 'Restore',
            onClick: () => {
              setActionBtnState(true)
              if (params?.data?.id) {
                restoreData(params.data.id);
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
            {isMobileView === true &&
              updateContactPermission &&
              params?.data?.id && (
                <button
                  className="viewBtn text-[14px] font-biotif__Medium text-primaryColor mr-[10px] underline duration-500 absolute top-[11px] right-[58px] z-[3] hover:text-primaryColor__hoverDark"
                  onClick={() =>
                    params.data.id &&
                    navigate(
                      setUrlParams(
                        PRIVATE_NAVIGATION.contacts.detailPage,
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

export default useContactTrashColumn;
