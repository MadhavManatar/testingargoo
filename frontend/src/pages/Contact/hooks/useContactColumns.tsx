// ** Import Packages **
import { ICellRendererParams } from 'ag-grid-community';

// ** Components **
import TableCellRenderer from 'components/TableInfiniteScroll/TableCellRender';

// ** Hook **
import usePermission from 'hooks/usePermission';

// ** Type **
import { useContactColumnsDefProps } from '../types/contacts.types';

// ** Constants **
import { ModuleNames } from 'constant/permissions.constant';

// ** Others **
import { formatPhoneNumber, usCurrencyFormat } from 'utils/util';
import React from 'react';
import _ from 'lodash';
import DateFormat from 'components/DateFormat';
import Image from 'components/Image';
import { DetailHeaderEmail } from 'components/detail-components/detail-header-email';
import Tippy from '@tippyjs/react';
import DetailHeaderPhone from 'components/detail-components/detail-header-phone';
import { EmailComposeButton } from 'components/EmailComposeButton';
import AccountCellRenderer from 'components/TableInfiniteScroll/customCellRenderers/AccountCellRenderer';
import ContactCellRenderer from 'components/TableInfiniteScroll/customCellRenderers/ContactCellRenderer';
import useTagListView from 'pages/TagMangement/useTagMangement';
import NameCellRenderer from 'components/TableInfiniteScroll/customCellRenderers/NameCellRenderer';
import useShowHeaderColumn from 'pages/ColumnHeader/useColumnHeader';

const useContactColumnsDef = ({
  selectionRef,
  openAddTagModal,
  setSelectionList,
  setIsCheckAll,
  isCheckAll,
  isCheckAllRef,
  disabled,
  isSortable,
  isSelectionDisabled,
  columns = [],
  onHandleUpdateColumns,
  setIsWrapTxtUpdate,
  selectionList,
  onRowClickNavigateLink,
}: useContactColumnsDefProps) => {
  const defaultColDef = {
    sortable: isSortable,
    resizable: true,
    rowSelection: 'multiple',
  };

  // ** hooks **

  // ** Custom hooks **
  const { deleteContactPermission } = usePermission();
  // ** state for table shorting table
  const { showTagList } = useTagListView();
  const { calculateDynamicWidth, showHeaderList } = useShowHeaderColumn();

  const renderCell = (fieldName: string, params: ICellRendererParams) => {
    if (fieldName === 'name' && params?.data?.name && params?.data?.id) {
      return (
        <NameCellRenderer
          {...{
            modelName: ModuleNames.CONTACT,
            name: params.data.name,
            onRowClickNavigateLink: `${onRowClickNavigateLink}/${params?.data?.id}`,
            params,
          }}
        />
      );
    }

    if (fieldName === 'emails') {
      const primaryEmail = params?.data?.emails?.find(
        (item: { is_primary: boolean }) => item.is_primary
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
                      (email: { is_primary: boolean; value: string }) => (
                        <React.Fragment key={window.crypto.randomUUID()}>
                          {email?.is_primary === false ? (
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
        (item: { is_primary: boolean }) => item.is_primary
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
                        is_primary: boolean;
                        value: string;
                        phoneType: string;
                      }) => (
                        <React.Fragment key={window.crypto.randomUUID()}>
                          {phone?.is_primary === false ? (
                            <div className="item__row w-full py-[7px] flex items-center border-b-[1px] border-b-whiteScreenBorderColor last:border-b-0 cursor-pointer select-text		">
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
    if (fieldName === 'related_accounts.account.name') {
      const account_name = params.data?.related_accounts?.find(
        (item: { account: { id: number; name: string } }) => item?.account?.name
      );
      return `${account_name?.account?.name || ''} ${
        params.data?.related_accounts?.length > 1
          ? `+ ${(params.data?.related_accounts || []).length - 1} more`
          : ''
      }  `;
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
    if (_.isBoolean(params?.data?.[fieldName])) {
      return params?.data?.[fieldName] ? 'Yes' : 'No';
    }

    if (fieldName === 'tags' || fieldName === 'associated_tags') {
      return showTagList({ params, onRowClickNavigateLink, openAddTagModal });
    }

    if (
      fieldName === 'contact_owner' ||
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
    if (
      ['open_deal_value', 'won_deal_value', 'lost_deal_value'].includes(
        fieldName
      )
    ) {
      return `${
        (params?.data?.[fieldName] &&
          usCurrencyFormat(params?.data?.[fieldName]?.toString())) ||
        ''
      }`;
    }

    if (
      [
        'birth_date',
        'first_deal_date',
        'first_lead_date',
        'last_deal_date',
        'last_lead_date',
        'last_note_date',
        'latest_email_date',
        'latest_lost_date',
        'created_at',
        'deleted_at',
        'updated_at',
        'latest_stage_change_date',
        'latest_won_date',
        'next_due_date',
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

    return params?.data?.[fieldName] || '';
  };

  // const totalColumnWidth = columns.reduce((sum, column) => {
  //   const columnWidth =
  //     document.querySelector(`.ag-header-cell[col-id="${column.fieldName}"]`)
  //       ?.clientWidth || 0;
  //   return sum + (typeof columnWidth === 'number' ? columnWidth : 0);
  // }, 0);

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
            isLoading={disabled}
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
      hide: !deleteContactPermission,
      cellRenderer: (params: ICellRendererParams) => {
        const colId = params?.data?.id;
        if (disabled === false) {
          return (
            <span
            // onMouseEnter={() => setHoverId(colId)}
            // onMouseLeave={() => setHoverId(-1)}
            >
              <input
                className={`agGrid__customInput ${
                  selectionList[colId] ? 'input__checked' : ''
                }`}
                key={colId}
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

export default useContactColumnsDef;
