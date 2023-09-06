/* eslint-disable no-lonely-if */
// ** Import Packages **
import { ICellRendererParams } from 'ag-grid-community';

// ** Components **
import DateFormat from 'components/DateFormat';
import TableCellRenderer from 'components/TableInfiniteScroll/TableCellRender';
import StatusChip from 'pages/Lead/components/StatusChip';

// ** Hook **
import usePermission from 'hooks/usePermission';

// ** Constant **
import { ModuleNames } from 'constant/permissions.constant';

// ** Type **
import { entityDataType } from 'pages/Activity/types/activity.types';

// ** Util **
import { usCurrencyFormat } from 'utils/util';
import { columnsDataInterface } from 'components/ColumnViewListDropDown';
import _ from 'lodash';
import ContactCellRenderer from 'components/TableInfiniteScroll/customCellRenderers/ContactCellRenderer';
import useDateColorCal from './useClosingDateColorCal';
import { DEAL_STAGE_VALUE } from 'constant';

import useTagListView from 'pages/TagMangement/useTagMangement';
import Image from 'components/Image';
import NameCellRenderer from 'components/TableInfiniteScroll/customCellRenderers/NameCellRenderer';
import useShowHeaderColumn from 'pages/ColumnHeader/useColumnHeader';

type useDealColumnsProps = {
  openDealWonLostModal: (data: entityDataType) => void;
  selectionRef?: any;
  setSelectionList?: any;
  setIsCheckAll?: any;
  isCheckAll?: boolean;
  isCheckAllRef?: any;
  disabled?: boolean;
  isSelectionDisabled?: boolean;
  loading: boolean;
  columns: columnsDataInterface[];
  openEditModel: () => void;
  onHandleUpdateColumns: (columns: columnsDataInterface[]) => void;
  setIsWrapTxtUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  selectionList?: any;
  onRowClickNavigateLink: string;
  dealClosingDateData: {
    time_frame: number;
    neutral_color: string;
    warning_color: string;
    passed_due_color: string;
  };
  openAddTagModal: (id: number) => void;
};

const useDealColumns = ({
  openDealWonLostModal,
  selectionRef,
  setSelectionList,
  setIsCheckAll,
  disabled,
  openAddTagModal,
  loading,
  isCheckAll,
  isCheckAllRef,
  isSelectionDisabled,
  columns = [],
  onHandleUpdateColumns,
  setIsWrapTxtUpdate,
  selectionList,
  onRowClickNavigateLink,
  dealClosingDateData,
}: useDealColumnsProps) => {
  const defaultColDef = {
    sortable: true,
    resizable: true,
    rowSelection: 'multiple',
  };

  // ** hook **

  // ** Custom hooks **
  const { deleteDealPermission } = usePermission();
  const { dateColorCal } = useDateColorCal();

  const { showHeaderList, calculateDynamicWidth } = useShowHeaderColumn();
  const { showTagList } = useTagListView();

  const renderCell = (fieldName: string, params: ICellRendererParams) => {
    if (fieldName === 'name' && params?.data?.name && params?.data?.id) {
      return (
        <NameCellRenderer
          {...{
            modelName: ModuleNames.DEAL,
            name: params.data.name,
            onRowClickNavigateLink: `${onRowClickNavigateLink}/${params?.data?.id}`,
            params,
            handleDealWonLost: () =>
              params.data.id &&
              openDealWonLostModal({
                id: params.data.id,
                name: params.data.name || '',
                type: ModuleNames.DEAL,
              }),
          }}
        />
      );
    }

    if (fieldName === 'lead_status.name') {
      const name = params?.data?.lead_status?.name;
      const color = params?.data?.lead_status?.color;
      return name && color ? (
        <StatusChip status={name as string} bgColor={color as string} />
      ) : (
        ''
      );
    }

    if (
      fieldName === 'creator' ||
      fieldName === 'modifier' ||
      fieldName === 'lead_owner'
    ) {
      return (
        <div className="flex profile__img__name items-center">
          <div className="img__wrapper">
            <Image
              imgClassName={`${params?.data?.lead_owner?.full_name ||
                params?.data?.lead_owner?.profile_image
                ? 'w-[34px] h-[34px] object-cover object-center rounded-full'
                : ''
                }`}
              first_name={params?.data?.[fieldName]?.full_name || null}
              imgPath={params?.data?.[fieldName]?.profile_image || null}
              serverPath
              color={params?.data?.[fieldName]?.initial_color}
            />
          </div>
          <span className="name pl-[8px] whitespace-pre overflow-hidden text-ellipsis">
            {params?.data?.[fieldName]?.full_name}
          </span>
        </div>
      );
    }

    if (fieldName === 'lead_owner.first_name') {
      const firstName = params?.data?.lead_owner?.first_name;
      const lastName = params?.data?.lead_owner?.last_name;
      return `${firstName || ''} ${lastName || ''}`;
    }

    if (fieldName === 'related_account') {
      return (
        <div className="flex profile__img__name items-center">
          <div className="img__wrapper">
            <Image
              imgClassName={`${params?.data?.related_account?.name ||
                params?.data?.related_account?.account_image
                ? 'w-[34px] h-[34px] object-cover object-center rounded-full'
                : ''
                }`}
              first_name={params?.data?.related_account?.name || null}
              imgPath={params?.data?.related_account?.account_image || null}
              serverPath
              color={params?.data?.related_account?.initial_color}
            />
          </div>
          <span className="name pl-[8px] whitespace-pre overflow-hidden text-ellipsis">
            {params?.data?.related_account?.name}
          </span>
        </div>
      );
    }
    if (fieldName === 'deal_value') {
      return `${(params?.data?.deal_value &&
        usCurrencyFormat(params?.data?.deal_value?.toString())) ||
        ''
        }`;
    }
    if (
      [
        'converted_at',
        'created_at',
        'deleted_at',
        'updated_at',
        'latest_email_date',
        'latest_received_email_date',
        'latest_sent_email_date',
      ].includes(fieldName)
    ) {
      const currentFieldName = fieldName;
      return params?.data?.[currentFieldName] ? (
          <span className="value block w-full text-[14px] leading-[18px] font-biotif__Medium text-black">
            <DateFormat date={params?.data?.[currentFieldName]} />
          </span>
      ) : (
        ''
      );
    }

    if (fieldName === 'closing_date') {
      const currentFieldName = fieldName;

      const calDateColor = dateColorCal({
        dealClosingDateData,
        closing_date: params?.data?.closing_date,
        converted_at: params?.data?.converted_at,
        created_at: params?.data?.created_at,
      });

      let closingDateColor;
      if (
        params?.data?.active_stage_history?.stage?.name ===
        DEAL_STAGE_VALUE.CLOSED_WON ||
        params?.data?.active_stage_history?.stage?.name ===
        DEAL_STAGE_VALUE.CLOSED_LOST
      ) {
        closingDateColor = '';
      } else {
        if (calDateColor !== undefined) {
          closingDateColor = calDateColor;
        } else {
          closingDateColor = dealClosingDateData.neutral_color;
        }
      }
      return params?.data?.[currentFieldName] ? (
          <span
            className="name whitespace-pre overflow-hidden text-ellipsis"
            style={{
              color: closingDateColor,
            }}
          >
            {params?.data?.closing_date && (
              <DateFormat
                format="MMM d, yyyy"
                date={params?.data?.closing_date}
              />
            )}
          </span>
      ) : (
        ''
      );
    }

    if (_.isBoolean(params?.data?.[fieldName])) {
      return params?.data?.[fieldName] ? 'Yes' : 'No';
    }

    if (fieldName === 'related_contacts') {
      return (
        <ContactCellRenderer
          {...{
            params,
            onRowClickNavigateLink: `${onRowClickNavigateLink}${params?.data?.id || ''
              }`,
          }}
        />
      );
    }

    if (fieldName === 'total_age') {
      return params?.data?.total_age
        ? params?.data?.total_age.replace(/[()]/g, '')
        : '';
    }

    if (fieldName === 'tags' || fieldName === 'associated_tags') {
      return showTagList({ params, onRowClickNavigateLink, openAddTagModal });
    }

    return params?.data?.[fieldName] || '';
  };

  const dynamicColumnDefs = columns.map((column, index) => {
    const { widthParams } = calculateDynamicWidth(columns, column);
    return {
      headerName: column.displayName,
      field: column.fieldName,
      sortable: !isSelectionDisabled,
      suppressMenu: false,
      lockPosition: column?.is_pin ? 'left' : false,
      wrapText: column?.is_wrap,
      autoHeight: column?.is_wrap,
      headerComponent: () => (
        <>
          {showHeaderList({
            column,
            columns,
            index,
            onHandleUpdateColumns,
            disabled,
            setIsWrapTxtUpdate,
          })}
        </>
      ),
      menuTabs: [],
      ...widthParams,
      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <TableCellRenderer
            label={column.displayName}
            isLoading={loading}
            isMobileView={isMobileView}
            cellValue={renderCell(column.fieldName, params)}
            {...(!['related_contacts', 'related_accounts'].includes(
              `${column.fieldName}test7988888888888888`
            ) && {
              onRowClickNavigateLink: `${onRowClickNavigateLink}${
                params?.data?.id || ''
              }`,
            })}
          />
        );
      },
    };
  });

  const columnDefs = [
    {
      headerName: 'Select All',
      field: 'checkbox',
      width: 54,
      minWidth: 54,
      maxWidth: 54,
      suppressMovable: true,
      lockPosition: 'left',
      autoHeight: true,
      headerComponent: () => (
        <>
          {loading ? (
            <span className="skeletonBox w-[16px] h-[16px] rounded-[3px]" />
          ) : (
            <div
              ref={(ref: HTMLInputElement | null) => {
                if (!ref) return;
                ref.onclick = (e) => {
                  e.stopPropagation();
                };
              }}
            >
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
            </div>
          )}
        </>
      ),
      hide: !deleteDealPermission,
      cellRenderer: (params: ICellRendererParams) => {
        const colId = params?.data?.id;
        if (loading === false) {
          return (
            !disabled && (
              <span>
                <input
                  className={`agGrid__customInput ${selectionList[colId] ? 'input__checked' : ''
                    }`}
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
                <h3 className="index">{(params?.rowIndex || 0) + 1}</h3>
              </span>
            )
          );
        }
        return <span className="skeletonBox w-[16px] h-[16px] rounded-[3px]" />;
      },
      cellClass: ['first__column'],
      headerClass: ['first__column'],
      pinned: 'left',
    },
    ...dynamicColumnDefs,
    // RG: remove action button as par client requirement  task: SD-2353
  ];
  return { defaultColDef, columnDefs };
};

export default useDealColumns;
