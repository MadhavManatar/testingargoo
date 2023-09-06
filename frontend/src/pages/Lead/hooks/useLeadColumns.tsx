// ** Import Packages **
import { ICellRendererParams } from 'ag-grid-community';

// ** Components **
import TableCellRenderer from 'components/TableInfiniteScroll/TableCellRender';
import StatusChip from '../components/StatusChip';
import TemperatureChip from '../components/TemperatureChip';

// ** Hooks **
import usePermission from 'hooks/usePermission';

// ** Type **
import { UseLeadColumnsPropsType } from '../types/lead.type';

// ** Constants **
import { ModuleNames } from 'constant/permissions.constant';

// ** Other **
import { usCurrencyFormat } from 'utils/util';
import _ from 'lodash';
import DateFormat from 'components/DateFormat';
import ContactCellRenderer from 'components/TableInfiniteScroll/customCellRenderers/ContactCellRenderer';

import useTagListView from 'pages/TagMangement/useTagMangement';
import AccountCellRenderer from 'components/TableInfiniteScroll/customCellRenderers/AccountCellRenderer';
import Image from 'components/Image';
import NameCellRenderer from 'components/TableInfiniteScroll/customCellRenderers/NameCellRenderer';
import useShowHeaderColumn from 'pages/ColumnHeader/useColumnHeader';

const useLeadColumns = ({
  selectionRef,
  setSelectionList,
  setIsCheckAll,
  disabled,
  getLeadsLoading,
  isCheckAll,
  leadStatusOpt,
  isCheckAllRef,
  isSelectionDisabled,
  openAddTagModal,
  columns = [],
  onHandleUpdateColumns,
  setIsWrapTxtUpdate,
  selectionList,
  onRowClickNavigateLink,
}: UseLeadColumnsPropsType) => {
  const defaultColDef = {
    sortable: true,
    resizable: true,
    rowSelection: 'multiple',
  };

  // ** Custom Hooks **
  const { deleteLeadPermission } = usePermission();

  const { showHeaderList, calculateDynamicWidth } = useShowHeaderColumn();
  const { showTagList } = useTagListView();
  //  ** disable shorting for state

  const renderCell = (fieldName: string, params: ICellRendererParams) => {
    if (fieldName === 'name' && params?.data?.name && params?.data?.id) {
      return (
        <NameCellRenderer
          {...{
            modelName: ModuleNames.LEAD,
            name: params.data.name,
            onRowClickNavigateLink: `${onRowClickNavigateLink}/${params?.data?.id}`,
            params,
          }}
        />
      );
    }

    if (fieldName === 'lead_status.name') {
      return (
        <StatusChip
          status={params?.data?.lead_status?.name as string}
          bgColor={params?.data?.lead_status?.color as string}
        />
      );
    }
    if (fieldName === 'lead_temperature_name') {
      const leadTempInfo = leadStatusOpt.find(({ label, color }) =>
        label === params?.data?.lead_temperature_name ? color : ''
      );
      const leadBadge = params?.data?.lead_temperature_name;
      return (
        <>
          <TemperatureChip bgColor={leadTempInfo?.color} status={leadBadge} />
        </>
      );
    }

    if (fieldName === 'related_contacts') {
      return (
        <ContactCellRenderer
          {...{
            params,
            onRowClickNavigateLink: `${onRowClickNavigateLink}${
              params?.data?.id || ''
            }`,
          }}
        />
      );
    }

    if (
      fieldName === 'lead_owner' ||
      fieldName === 'creator' ||
      fieldName === 'modifier'
    ) {
      return (
        <div className="flex profile__img__name items-center">
          <div className="img__wrapper">
            <Image
              imgClassName={`${
                params?.data?.[fieldName]?.full_name ||
                params?.data?.[fieldName]?.profile_image
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

    if (fieldName === 'related_account') {
      return (
        <div className="flex profile__img__name items-center">
          <div className="img__wrapper">
            <Image
              imgClassName={`${
                params?.data?.related_account?.name ||
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
      return `${
        (params?.data?.deal_value &&
          usCurrencyFormat(params?.data?.deal_value?.toString())) ||
        ''
      }`;
    }
    if (_.isBoolean(params?.data?.[fieldName])) {
      return params?.data?.[fieldName] ? 'Yes' : 'No';
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

    if (['open_deal_value'].includes(fieldName)) {
      return `${
        (params?.data?.[fieldName] &&
          usCurrencyFormat(params?.data?.[fieldName]?.toString())) ||
        ''
      }`;
    }

    if (fieldName === 'tags' || fieldName === 'associated_tags') {
      return showTagList({ params, onRowClickNavigateLink, openAddTagModal });
    }

    if (fieldName === 'total_age') {
      return params?.data?.total_age
        ? params?.data?.total_age.replace(/[()]/g, '')
        : '';
    }
    if (fieldName === 'related_accounts') {
      return (
        <AccountCellRenderer
          {...{
            params,
            onRowClickNavigateLink: `${onRowClickNavigateLink}${
              params?.data?.id || ''
            }`,
          }}
        />
      );
    }
    if (fieldName === 'owner_full_name') {
      return (
        <div className="flex profile__img__name items-center">
          <div className="img__wrapper">
            <Image
              imgClassName={`${
                params?.data?.owner_full_name || params?.data?.profile_image
                  ? 'w-[34px] h-[34px] object-cover object-center rounded-full'
                  : ''
              }`}
              first_name={params?.data?.owner_full_name || null}
              imgPath={params?.data?.profile_image || null}
              serverPath
              color={params?.data?.initial_color}
            />
          </div>
          <span className="name pl-[8px] whitespace-pre overflow-hidden text-ellipsis">
            {params?.data?.owner_full_name}
          </span>
        </div>
      );
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
            isLoading={getLeadsLoading}
            isMobileView={isMobileView}
            cellValue={renderCell(column.fieldName, params)}
            {...(!['related_contacts', 'related_accounts'].includes(
              column.fieldName
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
      headerComponent: () => (
        <>
          {getLeadsLoading !== false ? (
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

      hide: !deleteLeadPermission,
      cellRenderer: (params: ICellRendererParams) => {
        const colId = params?.data?.id;
        if (getLeadsLoading === false) {
          return (
            <span>
              <input
                className={`agGrid__customInput ${
                  selectionList[colId] ? 'input__checked' : ''
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
                    selectionRef.current = { ...updatedList };
                    setSelectionList({ ...updatedList });
                    e.stopPropagation();
                  };
                }}
                disabled={isSelectionDisabled}
                type="checkbox"
                defaultChecked={selectionRef.current[colId]}
              />
              <h3 className="index">{(params?.rowIndex || 0) + 1}</h3>
            </span>
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

export default useLeadColumns;
