// ** Import Packages **
import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';

// ** Components **
import TableCellRenderer from 'components/TableInfiniteScroll/TableCellRender';

// ** Hooks **
import usePermission from 'hooks/usePermission';

// ** Type **
import { UseAccountListPropsType } from '../types/account.types';

// ** Constant **
import { ModuleNames } from 'constant/permissions.constant';

// ** Other **
import { formatPhoneNumber, usCurrencyFormat } from 'utils/util';
import _ from 'lodash';
import DateFormat from 'components/DateFormat';
import Image from 'components/Image';
import Tippy from '@tippyjs/react';
import { DetailHeaderEmail } from 'components/detail-components/detail-header-email';
import DetailHeaderPhone from 'components/detail-components/detail-header-phone';
import { EmailComposeButton } from 'components/EmailComposeButton';
import ContactCellRenderer from 'components/TableInfiniteScroll/customCellRenderers/ContactCellRenderer';
import useTagListView from 'pages/TagMangement/useTagMangement';
import NameCellRenderer from 'components/TableInfiniteScroll/customCellRenderers/NameCellRenderer';
import useShowHeaderColumn from 'pages/ColumnHeader/useColumnHeader';
import { SingleAccountCellRenderer } from 'components/TableInfiniteScroll/customCellRenderers/AccountCellRenderer';

const useAccountList = ({
  selectionRef,
  setSelectionList,
  openAddTagModal,
  setIsCheckAll,
  isCheckAll,
  isCheckAllRef,
  disabled,
  isSelectionDisabled,
  columns = [],
  onHandleUpdateColumns,
  setIsWrapTxtUpdate,
  selectionList,
  onRowClickNavigateLink,
}: UseAccountListPropsType) => {
  // ** States **
  const defaultColDef = {
    sortable: true,
    resizable: true,
    rowSelection: 'multiple',
  };

  // ** State **

  // ** Hook **

  // ** Custom Hooks **
  const { deleteAccountPermission } = usePermission();

  const { showHeaderList, calculateDynamicWidth } = useShowHeaderColumn();
  const { showTagList } = useTagListView();
  const renderCell = (fieldName: string, params: ICellRendererParams) => {
    if (fieldName === 'name' && params?.data?.name && params?.data?.id) {
      return (
        <NameCellRenderer
          {...{
            modelName: ModuleNames.ACCOUNT,
            name: params.data.name,
            onRowClickNavigateLink: `${onRowClickNavigateLink}/${params?.data?.id}`,
            params,
          }}
        />
      );
    }

    if (fieldName === 'emails') {
      const primaryEmail = params?.data?.emails?.find(
        (item: { isPrimary: boolean }) => item.isPrimary
      )?.value;
      return (
        <div className="agGrid__email__wrapper flex items-center flex-wrap">
          <span className="value inline-flex items-center max-w-full group mr-[6px]">
            <span className="inline-block max-w-full whitespace-pre overflow-hidden text-ellipsis">
                {primaryEmail}
            </span>
            {primaryEmail && (
              <div className="action__btn__wrapper shrink-0 items-center ml-[10px] relative z-[3] flex opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto">
                <EmailComposeButton
                  email={primaryEmail}
                  modelName={ModuleNames.ACCOUNT}
                  modelRecordId={params?.data?.id}
                />
              </div>
            )}
          </span>
          <div className="inline-flex w-auto max-w-full leading-[15px]">
            {params?.data?.emails?.length > 1 && (
              <Tippy
                className="tippy__dropdown agGrid__emailMore__dropdown"
                trigger="click"
                hideOnClick
                interactive
                theme="light"
                zIndex={4}
                content={
                  <div className="p-[10px] max-w-full">
                    {params?.data?.emails?.map(
                      (email: { isPrimary: boolean; value: string }) => (
                        <React.Fragment key={window.crypto.randomUUID()}>
                          {email?.isPrimary === false ? (
                            <div className="item__row w-full py-[7px] flex items-center border-b-[1px] border-b-whiteScreenBorderColor last:border-b-0 cursor-auto select-text">
                              <p className="text-[16px] font-biotif__Regular text-darkTextColorSD whitespace-pre overflow-hidden text-ellipsis w-full">
                                {email?.value}
                              </p>
                              <div className="action__btn__wrapper shrink-0 flex items-center ml-[10px]">
                                <DetailHeaderEmail
                                  email={email?.value}
                                  modelName={ModuleNames.ACCOUNT}
                                  modelRecordId={params?.data?.id}
                                />
                              </div>
                            </div>
                          ) : (
                            <></>
                          )}
                        </React.Fragment>
                      )
                    )}
                  </div>
                }
                placement="bottom-start"
              >
                <button
                  ref={(ref) => {
                    if (!ref) return;
                    ref.onclick = (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    };
                  }}
                  className={`${'shrink-0 text-[14px] leading-normal text-primaryColorSD hover:underline'}`}
                >
                  + {Number(params?.data?.emails?.length) - 1} more
                </button>
              </Tippy>
            )}
          </div>
        </div>
      );
    }
    if (fieldName === 'phones') {
      const primaryPhone = params?.data?.phones?.find(
        (item: { isPrimary: boolean }) => item.isPrimary
      );
      return (
        <div className="agGrid__phone__wrapper flex items-center flex-wrap">
          <span className="value inline-flex items-center max-w-full group mr-[6px]">
            <span className="inline-block max-w-full whitespace-pre overflow-hidden text-ellipsis">
                {primaryPhone?.phoneType ? `${primaryPhone?.phoneType}:` : ''}{' '}
                {formatPhoneNumber(primaryPhone?.value)}
            </span>
            {primaryPhone?.value && (
              <div
                ref={(ref) => {
                  if (!ref) return;
                  ref.onclick = (e) => {
                    e.stopPropagation();
                  };
                }}
                className="action__btn__wrapper shrink-0 items-center ml-[10px] relative z-[3] flex opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
              >
                <DetailHeaderPhone
                  type={primaryPhone?.phoneType || ''}
                  number={primaryPhone?.value}
                />
              </div>
            )}
          </span>
          <div className="inline-flex w-auto max-w-full leading-[15px]">
            {params?.data?.phones?.length > 1 && (
              <Tippy
                className="tippy__dropdown agGrid__phoneMore__dropdown"
                trigger="click"
                hideOnClick
                interactive
                theme="light"
                zIndex={4}
                content={
                  <div className="p-[10px] max-w-full">
                    {params?.data?.phones?.map(
                      (phone: {
                        isPrimary: boolean;
                        value: string;
                        phoneType: string;
                      }) => (
                        <React.Fragment key={window.crypto.randomUUID()}>
                          {phone?.isPrimary === false ? (
                            <div className="item__row w-full py-[7px] flex items-center border-b-[1px] border-b-whiteScreenBorderColor last:border-b-0 cursor-auto select-text">
                              <p className="text-[16px] font-biotif__Regular text-darkTextColorSD whitespace-pre overflow-hidden text-ellipsis w-full">
                                {primaryPhone?.phoneType
                                  ? `${primaryPhone?.phoneType}:`
                                  : ''}{' '}
                                {formatPhoneNumber(phone?.value)}
                              </p>
                              <div className="action__btn__wrapper shrink-0 flex items-center ml-[10px]">
                                <DetailHeaderPhone
                                  type={phone?.phoneType || ''}
                                  number={phone?.value}
                                />
                              </div>
                            </div>
                          ) : (
                            <></>
                          )}
                        </React.Fragment>
                      )
                    )}
                  </div>
                }
                placement="bottom-start"
              >
                <button
                  ref={(ref) => {
                    if (!ref) return;
                    ref.onclick = (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    };
                  }}
                  className={`${'shrink-0 text-[14px] leading-normal text-primaryColorSD hover:underline'}`}
                >
                  + {Number(params?.data?.phones?.length) - 1} more
                </button>
              </Tippy>
            )}
          </div>
        </div>
      );
    }

    if (fieldName === 'AccountContacts') {
      return (
        <ContactCellRenderer
          {...{
            params,
            dataKey: 'AccountContacts',
            onRowClickNavigateLink: `${onRowClickNavigateLink}${
              params?.data?.id || ''
            }`,
          }}
        />
      );
    }

    if (fieldName === 'parent_account') {
      return (
        <SingleAccountCellRenderer
          {...{
            account: params?.data?.parent_account,
            onRowClickNavigateLink: `${onRowClickNavigateLink}${
              params?.data?.id || ''
            }`,
          }}
        />
      );
    }

    if (_.isBoolean(params?.data?.[fieldName])) {
      return params?.data?.[fieldName] ? 'Yes' : 'No';
    }

    if (fieldName === 'AccountContacts') {
      return params?.data?.AccountContacts?.contact?.name || '';
    }

    if (
      [
        'annual_revenue',
        'open_deal_value',
        'lost_deal_value',
        'won_deal_value',
      ].includes(fieldName)
    ) {
      return `${
        (params?.data?.[fieldName] &&
          usCurrencyFormat(params?.data?.[fieldName]?.toString())) ||
        ''
      }`;
    }

    if (
      [
        'created_at',
        'deleted_at',
        'first_deal_date',
        'first_lead_date',
        'last_deal_date',
        'last_lead_date',
        'last_note_date',
        'latest_email_date',
        'latest_lost_date',
        'latest_received_email_date',
        'latest_sent_email_date',
        'latest_stage_change_date',
        'latest_won_date',
        'next_due_date',
        'updated_at',
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

    if (fieldName === 'tags' || fieldName === 'associated_tags') {
      return showTagList({ params, onRowClickNavigateLink, openAddTagModal });
    }

    if (
      fieldName === 'account_owner' ||
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
    return params?.data?.[fieldName] || '';
  };

  // const getFilterName = (type: string) => {
  //   switch (type) {
  //     case 'INTEGER':
  //       return 'agNumberColumnFilter';
  //     case 'DATE':
  //       return 'agDateColumnFilter';
  //     default:
  //       return 'agTextColumnFilter';
  //   }
  // };

  const dynamicColumnDefs = columns.map((column, index) => {
    const { widthParams } = calculateDynamicWidth(columns, column);
    return {
      headerName: column.displayName,
      field: column.fieldName,
      sortable: !isSelectionDisabled,
      suppressMenu: false,
      cellEditor: 'agTextCellEditor',
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
      // filter: getFilterName(column?.type),
      menuTabs: [],
      ...widthParams,

      cellRenderer: (params: ICellRendererParams, isMobileView?: boolean) => {
        return (
          <>
            <TableCellRenderer
              label={column.displayName}
              isLoading={disabled}
              isMobileView={isMobileView}
              cellValue={renderCell(column.fieldName, params)}
              {...(!['AccountContacts', 'related_accounts'].includes(
                column.fieldName
              ) && {
                onRowClickNavigateLink: `${onRowClickNavigateLink}${
                  params?.data?.id || ''
                }`,
              })}
            />
          </>
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
      pinned: 'left',
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
      hide: !deleteAccountPermission,
      cellRenderer: (params: ICellRendererParams) => {
        const colId = params?.data?.id;
        if (disabled === false) {
          return (
            <div>
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

              <h3 className="index">{(params?.rowIndex || 0) + 1}</h3>
            </div>
          );
        }
        return <span className="skeletonBox w-[16px] h-[16px] rounded-[3px]" />;
      },
      cellClass: ['first__column'],
      headerClass: ['first__column'],
    },
    ...dynamicColumnDefs,
    // RG: remove action button as par client requirement  task: SD-2353
  ];

  return { defaultColDef, columnDefs };
};

export default useAccountList;
