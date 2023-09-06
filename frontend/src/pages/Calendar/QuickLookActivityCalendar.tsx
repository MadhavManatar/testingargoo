// ** import packages **
import { useState } from 'react';
import intervalToDuration from 'date-fns/intervalToDuration';
import formatDuration from 'date-fns/formatDuration';
import { useNavigate } from 'react-router-dom';
import format from 'date-fns-tz/format';
import { ScheduleComponent } from '@syncfusion/ej2-react-schedule';

// ** components **
import DateFormat from 'components/DateFormat';
import Icon from 'components/Icon';
import Image from 'components/Image';
import ActivityActionComponent from 'pages/Dashboard/components/ActivityActionComponent';

// ** types **
import { activitiesResponse } from 'pages/Dashboard/types/dashboard.types';

// ** Hooks ** //
import useWindowDimensions from 'hooks/useWindowDimensions';

// ** others **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { setUrlParams } from 'utils/util';
import {
  useChangeActivityStatusByIdMutation,
  useUpdateActivityMutation,
} from 'redux/api/activityApi';

interface PropsInterface {
  showQuickActivityData: activitiesResponse;
  reminder: string[];
  schedularRef: React.RefObject<ScheduleComponent>;
  setOpenModal: React.Dispatch<
    React.SetStateAction<{
      add: boolean;
      edit: boolean;
      view: boolean;
      complete: boolean;
      id: number;
      activityTopic?: string;
      activityTypeId?: number;
    }>
  >;
  refreshPage: () => void;
}

const QuickLookActivityCalendar = (props: PropsInterface) => {
  const {
    showQuickActivityData,
    reminder,
    refreshPage,
    schedularRef,
    setOpenModal,
  } = props;

  const navigate = useNavigate();

  // ** states **
  const [permissionArray, setPermissionArray] = useState<
    {
      label: string;
      onClick: () => void;
    }[]
  >([]);

  // ** hooks **
  const { isMobileView } = useWindowDimensions();

  // ** APIS **
  const [updateActivityByIdAPI] = useUpdateActivityMutation();
  const [changeActivityStatusByIdAPI] = useChangeActivityStatusByIdMutation();

  async function changeActivityStatus(id: number, is_active: boolean) {
    const data = await changeActivityStatusByIdAPI({
      id,
      data: { is_active },
    });
    if (!('error' in data)) {
      refreshPage();
    }
  }

  const handleActivityClick = (aVal: activitiesResponse) => {
    const tempPermissionArray = [];
    if (aVal?.id) {
      tempPermissionArray.push({
        label: 'Edit',
        onClick: () => {
          if (schedularRef?.current) {
            schedularRef?.current.closeQuickInfoPopup();
            const elm = document.querySelector(
              '.e-more-popup-wrapper'
            ) as HTMLElement;
            if (elm?.classList?.contains('e-popup-open')) {
              elm.classList?.remove('e-popup-open');
              elm.classList?.add('e-popup-close');
            }
          }
          if (isMobileView) {
            navigate(
              setUrlParams(
                PRIVATE_NAVIGATION.activities.EditActivityMobileView,
                showQuickActivityData?.id
              )
            );
          } else {
            setOpenModal({
              add: false,
              edit: true,
              complete: false,
              id: showQuickActivityData?.id,
              view: false,
              activityTopic: showQuickActivityData?.topic,
              activityTypeId: showQuickActivityData?.activity_type?.id,
            });
          }
        },
      });
    }

    if (aVal?.join_link) {
      tempPermissionArray.push({
        label: 'Launch',
        onClick: () => window.open(`${aVal?.join_link}`, '_blank'),
      });
    }

    tempPermissionArray.push(
      {
        label: `${aVal?.is_active ? 'Stop' : 'Start'} ${
          aVal?.activity_type?.name || ''
        }`,
        onClick: () => {
          changeActivityStatus(aVal?.id, !aVal?.is_active);
        },
      },
      {
        label: `${aVal?.completed_by ? 'Re-Open' : 'Mark As Done'}`,
        onClick: () => {
          if (aVal?.completed_by) {
            reOpenActivity(aVal?.id);
          } else {
            setOpenModal({
              add: false,
              edit: false,
              complete: true,
              id: aVal?.id,
              activityTypeId: aVal?.activity_type_id,
              view: false,
            });
          }
        },
      }
    );
    setPermissionArray(tempPermissionArray);
  };

  async function reOpenActivity(id: number) {
    const data = await updateActivityByIdAPI({
      id,
      data: {
        completed: false,
      },
    });
    if (!('error' in data)) {
      refreshPage();
    }
  }

  const customImage =
    showQuickActivityData?.activity_type?.icon_type === 'Custom' ? (
      <Image
        imgPath={showQuickActivityData?.activity_type?.icon as string}
        disableLoader
        serverPath
        imgClassName="w-[32px] h-[32px] bg-primaryColor rounded-[6px]"
      />
    ) : null;

  const formatActivityDuration = formatDuration(
    intervalToDuration({
      start: new Date(showQuickActivityData?.start_date),
      end: new Date(showQuickActivityData?.end_date),
    })
  );

  const endDataShowCondition =
    format(new Date(showQuickActivityData?.start_date || ''), 'M/dd/yyyy') !==
    format(new Date(showQuickActivityData?.end_date || ''), 'M/dd/yyyy');

  return (
    <>
      <div className="quickLookActivityCalendar__box w-[373px] max-w-full left-[300px] bg-white rounded-[10px] shadow-[0px_2px_14px_#0000001a] z-[3] mx-auto sm:w-[320px] xsm:w-[300px]">
        <div className="header flex flex-wrap items-center py-[12px] px-[20px] pr-[6px] border-b border-b-[#CCCCCC]/50">
          <div className="left flex flex-wrap items-center w-[calc(100%_-_67px)] pr-[10px]">
            {showQuickActivityData?.activity_type?.icon_type === 'Default' ? (
              <Icon
                className="w-[32px] h-[32px] bg-primaryColor rounded-[6px]"
                iconType={showQuickActivityData?.activity_type.icon}
              />
            ) : (
              customImage
            )}
            <p className="text-[#2E3234] pl-[10px] font-biotif__Medium text-[16px] relative top-[2px] w-[calc(100%_-_34px)] overflow-hidden whitespace-pre text-ellipsis">
              {showQuickActivityData?.activity_type?.name}
            </p>
          </div>
          <div className="right flex items-center">
            <Icon
              onClick={() => {
                if (schedularRef?.current) {
                  schedularRef?.current.closeQuickInfoPopup();
                  const elm = document.querySelector(
                    '.e-more-popup-wrapper'
                  ) as HTMLElement;
                  if (elm?.classList?.contains('e-popup-open')) {
                    elm.classList?.remove('e-popup-open');
                    elm.classList?.add('e-popup-close');
                  }
                }
                setOpenModal({
                  add: false,
                  edit: false,
                  complete: false,
                  id: showQuickActivityData?.id,
                  activityTypeId: showQuickActivityData?.activity_type_id,
                  activityTopic: showQuickActivityData?.topic,
                  view: true,
                });
              }}
              className="editBtn cursor-pointer rounded-[6px] w-[28px] h-[28px] p-[4px] mr-[5px] hover:bg-[#E6E6E6]"
              iconType="eyeFilled"
            />
            <ActivityActionComponent
              handleActivityClick={handleActivityClick}
              permissionArray={permissionArray}
              aVal={showQuickActivityData}
            />
            <button
              className='cancelBtn hidden w-[28px] h-[28px] rounded-[6px] text-[0px] relative duration-500 hover:bg-[#E6E6E6] before:content-[""] before:absolute before:top-[50%] before:left-[50%] before:translate-x-[-50%] before:translate-y-[-50%] before:rotate-45 before:w-[14px] before:h-[2px] before:bg-[#2E3234]/40 before:duration-500 after:content-[""] after:absolute after:top-[50%] after:left-[50%] after:translate-x-[-50%] after:translate-y-[-50%] after:-rotate-45 after:w-[14px] after:h-[2px] after:bg-[#2E3234]/40 after:duration-500 hover:before:bg-black hover:after:bg-black'
              onClick={() => {
                if (schedularRef?.current) {
                  schedularRef?.current.closeQuickInfoPopup();
                }
              }}
            >
              Close
            </button>
          </div>
        </div>
        <div className="bodyCN py-[14px] px-[20px]">
          <h4 className="text-[18px] font-biotif__SemiBold text-black mb-0 ellipsis__2">
            {showQuickActivityData?.topic}
          </h4>
          <h4 className="text-[16px] font-biotif__Medium text-[#2E3234] mb-0">
            {showQuickActivityData?.activity_contact?.name}
          </h4>
          {showQuickActivityData?.activity_account ||
          showQuickActivityData?.activity_lead ? (
            <h3 className="text-[16px] font-biotif__Regular text-black mb-[10px]">
              {showQuickActivityData?.activity_account ? (
                <span className='inline-block relative pr-[12px] mr-[12px] before:content-[""] before:absolute before:right-0 before:top-[50%] before:translate-y-[-50%] before:w-[1px] before:h-[calc(100%_-_7px)] before:bg-black/30 last:before:hidden last:pr-0 last:mr-0'>
                  {showQuickActivityData?.activity_account?.name}
                </span>
              ) : null}
              {showQuickActivityData?.activity_lead ? (
                <span className='inline-block relative pr-[12px] mr-[12px] before:content-[""] before:absolute before:right-0 before:top-[50%] before:translate-y-[-50%] before:w-[1px] before:h-[calc(100%_-_7px)] before:bg-black/30 last:before:hidden last:pr-0 last:mr-0'>
                  {showQuickActivityData?.activity_lead?.name}
                </span>
              ) : null}
            </h3>
          ) : null}
          <div className="quickACT__item max-w-full text-[14px] font-biotif__Regular text-black/50 flex flex-wrap mb-[12px]">
            <span className="inline-block text-primaryColor font-biotif__SemiBold mr-[5px]">
              Date:{' '}
            </span>
            <span className="inline-block">
              <DateFormat
                date={showQuickActivityData?.start_date}
                format="EEEE, M/dd/yyyy"
              />
            </span>
          </div>
          <div className="quickACT__item max-w-full text-[14px] font-biotif__Regular text-black/50 inline-flex flex-wrap mb-[12px] mr-[18px]">
            <span className="inline-block text-primaryColor font-biotif__SemiBold mr-[5px]">
              Time:{' '}
            </span>
            <span className="inline-block">
              <DateFormat
                date={showQuickActivityData?.start_date}
                format="h:mm a"
              />
            </span>
          </div>
          <div className="quickACT__item max-w-full text-[14px] font-biotif__Regular text-black/50 inline-flex flex-wrap mb-[12px]">
            <span className="inline-block text-primaryColor font-biotif__SemiBold mr-[5px]">
              Duration:{' '}
            </span>
            <span className="inline-block">
              {showQuickActivityData?.all_day
                ? 'All Day'
                : formatActivityDuration}
            </span>
          </div>
          <div className="quickACT__item max-w-full text-[14px] font-biotif__Regular text-black/50 flex flex-wrap mb-[12px]">
            <span className="inline-block text-primaryColor font-biotif__SemiBold mr-[5px]">
              End Time :{' '}
            </span>
            <span className="inline-block">
              {endDataShowCondition && (
                <DateFormat
                  date={showQuickActivityData?.end_date}
                  format="MM/dd/yyyy-"
                />
              )}

              <DateFormat
                date={showQuickActivityData?.end_date}
                format="hh:mm aa"
              />
            </span>
          </div>
          <div className="quickACT__item max-w-full text-[14px] font-biotif__Regular text-black/50 inline-flex flex-wrap mb-[12px]">
            <span className="inline-block text-primaryColor font-biotif__SemiBold mr-[5px]">
              Description:{' '}
            </span>
            <span className="inline-block break-all">
              {showQuickActivityData?.agenda}
            </span>
          </div>
          <div className="quickACT__item max-w-full text-[14px] font-biotif__Regular text-black/50 flex flex-wrap mb-[12px]">
            <span className="inline-block text-primaryColor font-biotif__SemiBold mr-[5px]">
              Reminder:{' '}
            </span>
            {(reminder || []).map((item, index) => (
              <span key={index} className="inline-block">
                {index ? ',' : ''} {item}
              </span>
            ))}
          </div>
          <div className="quickACT__item max-w-full text-[14px] font-biotif__Regular text-black/50 flex flex-wrap mb-[12px]">
            <span className="inline-block text-primaryColor font-biotif__SemiBold mr-[5px]">
              Link:{' '}
            </span>
            <span className="inline-block max-w-[calc(100%_-_38px)]">
              <a
                className="text-primaryColor inline-block max-w-full hover:underline whitespace-pre overflow-hidden text-ellipsis"
                href={showQuickActivityData?.join_link}
              >
                {showQuickActivityData?.join_link || ''}
              </a>
            </span>
          </div>
          <div className="flex items-center mt-[-5px]">
            <Icon
              className="mr-[3px] relative top-[-1px]"
              iconType="greenRightTickFilledIcon"
            />
            <span className="text-[14px] font-biotif__Medium text-[#808080]">
              {showQuickActivityData?.activity_type?.name} Confirmed
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickLookActivityCalendar;
