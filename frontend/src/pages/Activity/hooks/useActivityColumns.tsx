// ** import packages ** //
import { ICellRendererParams } from 'ag-grid-community';
import { Link } from 'react-router-dom';

// ** components ** //
import DateFormat from 'components/DateFormat';
import TableCellRenderer from 'components/TableInfiniteScroll/TableCellRender';

// ** others ** //
import { ModuleNames } from 'constant/permissions.constant';

import usePermission from 'hooks/usePermission';
import _ from 'lodash';
import {
  ActivityCollaboratorsType,
  ActivityModalName,
  ActivityParticipantType,
} from '../types/activity.types';
import { columnsDataInterface } from 'components/ColumnViewListDropDown';
import Tippy from '@tippyjs/react';
import Image from 'components/Image';
import NameCellRenderer from 'components/TableInfiniteScroll/customCellRenderers/NameCellRenderer';
import { Dispatch, SetStateAction } from 'react';
import { initialActivityOpenModalState } from '..';
import useTagListView from 'pages/TagMangement/useTagMangement';
import useShowHeaderColumn from 'pages/ColumnHeader/useColumnHeader';
import { SingleAccountCellRenderer } from 'components/TableInfiniteScroll/customCellRenderers/AccountCellRenderer';
import { SingleContactCellRenderer } from 'components/TableInfiniteScroll/customCellRenderers/ContactCellRenderer';

interface Props {
  selectionRef?: any;
  setSelectionList?: any;
  setIsCheckAll?: any;
  isCheckAll?: boolean;
  isCheckAllRef?: any;
  openAddTagModal: (id: number) => void;
  disabled?: boolean;
  isSortable?: boolean;
  isSelectionDisabled?: boolean;
  columns: columnsDataInterface[];
  onHandleUpdateColumns: (columns: columnsDataInterface[]) => void;
  setIsWrapTxtUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  selectionList?: any;
  changeActivityStatus: (id: number, is_active: boolean) => Promise<void>;
  reOpenActivity: (id: number) => Promise<void>;
  setOpenModal: Dispatch<SetStateAction<ActivityModalName>>;
  onRowClickNavigateLink: string;
}

const useActivityColumns = (props: Props) => {
  const {
    selectionRef,
    setSelectionList,
    setIsCheckAll,
    isCheckAll,
    disabled,
    openAddTagModal,
    isCheckAllRef,
    isSortable,
    isSelectionDisabled,
    columns = [],
    onHandleUpdateColumns,
    setIsWrapTxtUpdate,
    selectionList,
    onRowClickNavigateLink,
    changeActivityStatus,
    reOpenActivity,
    setOpenModal,
  } = props;

  const defaultColDef = {
    sortable: isSortable,
    resizable: true,
    rowSelection: 'multiple',
  };

  // ** Custom hooks **
  const { deleteActivityPermission } = usePermission();
  const { showTagList } = useTagListView();
  const { calculateDynamicWidth, showHeaderList } = useShowHeaderColumn();

  const renderCell = (fieldName: string, params: ICellRendererParams) => {
    if (fieldName === 'topic' && params?.data?.topic && params?.data?.id) {
      return (
        <NameCellRenderer
          {...{
            modelName: ModuleNames.ACTIVITY,
            name: params.data.topic,
            onRowClickNavigateLink: `${onRowClickNavigateLink}/${params?.data?.id}`,
            params,
            ...(params?.data?.video_call_link && {
              launchActivity: () =>
                window.open(`${params?.data?.video_call_link}`, '_blank'),
            }),
            startOrStopActivity: {
              label: `${params?.data?.is_active ? 'Stop' : 'Start'} ${
                params?.data?.activity_type_name || 'Activity'
              }`,
              action: () => {
                changeActivityStatus(
                  params?.data?.id,
                  !params?.data?.is_active
                );
              },
            },
            completeOrOpenActivity: {
              label: params?.data?.completed_by ? 'Re-Open' : 'Mark As Done',
              action: () => {
                if (params?.data?.completed_by) {
                  reOpenActivity(params?.data?.id);
                } else {
                  setOpenModal({
                    ...initialActivityOpenModalState,
                    complete: true,
                    activityId: params?.data?.id,
                    activityTypeId: params?.data?.activity_type_id,
                  });
                }
              },
            },
          }}
        />
      );
    }

    if (fieldName === 'activity_collaborators') {
      return (
        <ActivityCollaboratorsCal
          {...{
            params,
            onRowClickNavigateLink: `${onRowClickNavigateLink}${
              params?.data?.id || ''
            }`,
          }}
        />
      );
    }

    if (fieldName === 'activity_lead') {
      return params?.data?.[fieldName]?.name;
    }

    if (fieldName === 'location_details') {
      return params?.data?.[fieldName]?.title || '';
    }

    if (_.isBoolean(params?.data?.[fieldName])) {
      return params?.data?.[fieldName] ? 'Yes' : 'No';
    }

    if (fieldName === 'tags' || fieldName === 'associated_tags') {
      return showTagList({ params, onRowClickNavigateLink, openAddTagModal });
    }
    if (fieldName === 'activity_contact' && params?.data?.id) {
      return (
        <SingleContactCellRenderer
          contact={params?.data?.activity_contact}        />
      );
    }

    if (fieldName === 'activity_account' && params?.data?.id) {
      return (
        <SingleAccountCellRenderer account={params?.data?.activity_account} />
      );
    }

    if (fieldName === 'activity_participants') {
      return (
        <ActivityParticipants
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
      fieldName === 'creator' ||
      fieldName === 'assigned_to' ||
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
      return params?.data?.[fieldName] ? (
        <span className="value block w-full text-[14px] leading-[18px] font-biotif__Medium text-black">
          <DateFormat date={params?.data?.[fieldName]} />
        </span>
      ) : (
        ''
      );
    }

    return params?.data?.[fieldName];
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
            params={params}
            isMobileView={isMobileView}
            cellValue={renderCell(column.fieldName, params)}
            {...(!['activity_contact', 'activity_account'].includes(
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
      hide: !deleteActivityPermission,
      cellRenderer: (params: ICellRendererParams) => {
        const colId = params?.data?.id;
        if (params?.data) {
          return (
            <span
            // onMouseEnter={() => setHoverId(colId)}
            // onMouseLeave={() => setHoverId(-1)}
            >
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

export default useActivityColumns;

interface ActivityCollaboratorsCalProps {
  params: ICellRendererParams;
  onRowClickNavigateLink: string;
}

const ActivityCollaboratorsCal = (props: ActivityCollaboratorsCalProps) => {
  const { params, onRowClickNavigateLink } = props;
  const { data } = params;

  if (data?.activity_collaborators?.length > 1) {
    const { first_name = '', last_name = '' } =
      data?.activity_collaborators?.[0]?.user || {};
    return (
      <div className="agGrid__prelated_contactshone__wrapper flex items-center">
        {/* <Link to={onRowClickNavigateLink}> */}
        <span className="inline-block max-w-full whitespace-pre overflow-hidden text-ellipsis">
          {`${first_name} ${last_name} `}
        </span>
        {/* </Link> */}
        {data?.activity_collaborators?.length > 1 && (
          <Tippy
            className="tippy__dropdown agGrid__emailMore__dropdown"
            trigger="click"
            hideOnClick
            theme="light"
            zIndex={4}
            content={
              <div className="p-[10px] max-w-full">
                {data?.activity_collaborators
                  ?.slice(1, data?.activity_collaborators.length)
                  ?.map((item: ActivityCollaboratorsType, key: number) => {
                    const {
                      first_name: firstName = '',
                      last_name: lastName = '',
                    } = item?.user || {};
                    return (
                      <div
                        key={`collaborators_${key}`}
                        className="item__row w-full py-[7px] flex items-center border-b-[1px] border-b-whiteScreenBorderColor last:border-b-0"
                      >
                        <p className="text-[16px] font-biotif__Regular text-darkTextColorSD whitespace-pre overflow-hidden text-ellipsis w-full">
                          {`${firstName} ${lastName}`}
                        </p>
                      </div>
                    );
                  })}
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
              className="shrink-0 text-[14px] leading-normal text-primaryColorSD hover:underline"
            >
              + {Number(params?.data?.activity_collaborators?.length) - 1} more
            </button>
          </Tippy>
        )}
      </div>
    );
  }
  const { first_name = '', last_name = '' } =
    data?.activity_collaborators?.[0]?.user || {};
  return (
    <Link to={onRowClickNavigateLink}>
      <span className="value inline-block max-w-full">
        {`${first_name} ${last_name}`}
      </span>
    </Link>
  );
};

const ActivityParticipants = (props: ActivityCollaboratorsCalProps) => {
  const { params, onRowClickNavigateLink } = props;
  const { data } = params;

  if (data?.activity_participants?.length > 1) {
    const { name } = data?.activity_participants?.[0]?.contact || {};
    return (
      <div className="agGrid__prelated_contactshone__wrapper flex items-center">
        {/* <Link to={onRowClickNavigateLink}> */}
        <span className="inline-block max-w-full whitespace-pre overflow-hidden text-ellipsis">
          {`${name}  `}
        </span>
        {/* </Link> */}
        {data?.activity_participants?.length > 1 && (
          <Tippy
            className="tippy__dropdown agGrid__emailMore__dropdown"
            trigger="click"
            hideOnClick
            theme="light"
            zIndex={4}
            content={
              <div className="p-[10px] max-w-full">
                {data?.activity_participants
                  ?.slice(1, data?.activity_participants.length)
                  ?.map((item: ActivityParticipantType, key: number) => {
                    return (
                      <div
                        key={`collaborators_${key}`}
                        className="item__row w-full py-[7px] flex items-center border-b-[1px] border-b-whiteScreenBorderColor last:border-b-0"
                      >
                        <p className="text-[16px] font-biotif__Regular text-darkTextColorSD whitespace-pre overflow-hidden text-ellipsis w-full">
                          {`${item?.contact.name}`}
                        </p>
                      </div>
                    );
                  })}
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
              className="shrink-0 text-[14px] leading-normal text-primaryColorSD hover:underline"
            >
              + {Number(params?.data?.activity_participants?.length) - 1} more
            </button>
          </Tippy>
        )}
      </div>
    );
  }
  const { name = '' } = data?.activity_participants?.[0]?.contact || {};
  return (
    <Link to={onRowClickNavigateLink}>
      <span className="value inline-block max-w-full">{`${name}`}</span>
    </Link>
  );
};
