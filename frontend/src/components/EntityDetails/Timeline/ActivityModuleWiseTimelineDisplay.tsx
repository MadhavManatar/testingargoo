// ** Import Packages **
import { format } from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import NotificationReminderModal from 'pages/Activity/components/Modal/NotificationReminderModal';

// ** Components **
import Dropdown from 'components/Dropdown';
import Icon from 'components/Icon';
import EntityCard from '../QuickLookCard/EntityCard';
import LeadDealCard from '../QuickLookCard/LeadDealCard';

// ** Redux **
import { setLoadTimeLines } from 'redux/slices/commonSlice';

// ** Hook **
import { useGetActiveDealStage } from 'pages/Activity/hooks/useGetCurrentDealStage';

// ** Type **
import { ActivityResponseType } from 'pages/Activity/types/activity.types';
import { DealDetailsType } from 'pages/Deal/types/deals.types';
import { LeadDetailsType } from 'pages/Lead/types/lead.type';
import { TimelineMessageType, TimelineOpenActivityModalType } from './types';

// ** Constant **
import { NOTIFICATION_TYPE } from 'constant';

// ** Util **
import { convertAtoB, formatPhoneNumber } from 'utils/util';

// ** Helper **
import { calculateLogOnTime } from 'pages/Activity/helper/dateAndTime.helper';
import { setContactAndMailFunc } from 'pages/Lead/helper/leads.helper';
import DisplayRichTextContent from 'components/RichTextEditor/DisplayRichTextContent';
import Modal from 'components/Modal';
import RecordingTranscript from 'components/Transcript/RecordingTranscript';
import { RecordingTranscriptProps } from 'components/Transcript/types/transcript.types';
import MeetingReport from './components/Activity/MeetingReport';
import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ActivityTimelineSummary from './ActivityTimelineSummary';
import { ModuleNames } from 'constant/permissions.constant';
// import ClickableMobile from 'components/ClickableComponents/ClickableMobile';
// import ClickableEmail from 'components/ClickableComponents/ClickableEmail';
import Image from 'components/Image';

interface Props {
  activities: ActivityResponseType;
  setOpenActivityModal?:
    | React.Dispatch<React.SetStateAction<TimelineOpenActivityModalType>>
    | undefined;
  timeline_model_name: string;
  message?: TimelineMessageType;
  historyId?: number;
}

const ActivityModuleWiseTimelineDisplay = (props: Props) => {
  const {
    activities,
    setOpenActivityModal,
    timeline_model_name,
    message,
    historyId,
  } = props;

  const dispatch = useDispatch();

  const {
    start_date,
    topic,
    all_day,
    duration,
    activity_time_logs,
    notifications,
    id: activityId,
    activity_contact,
    activity_account,
    activity_lead,
    location_details,
    agenda,
    result,
    is_confirmed,
    completion_date,
    completed_by,
    memo,
    activity_meeting_bot,
    activity_zoom_call_recordings,
    collaborators,
    zoom_meeting_details,
    activity_type,
    activity_collaborators,
  } = activities;

  const [openNotificationReminderModal, setIsOpenNotificationReminderModal] =
    useState(false);
  const [activeDealStage, setActiveDealStage] = useState<string>('');
  const { getActiveDealStageData } = useGetActiveDealStage({
    setActiveDealStage,
  });

  const [openRecordingPlayerModel, setOpenRecordingPlayerModel] =
    useState(false);
  const [playerModelData, setPlayerModelData] =
    useState<RecordingTranscriptProps>({
      meetingType: 'video',
      path: null,
      transcript_path: null,
      summary: null,
    });

  const [showMore, setShowMore] = useState(false);
  const sliderRef = useRef<Slider | null>(null);

  const beforeChangeHandler = () => {
    if (
      sliderRef.current &&
      sliderRef.current.innerSlider &&
      sliderRef.current.innerSlider.list
    ) {
      const videos =
        sliderRef.current.innerSlider.list.querySelectorAll(
          '.slick-slide video'
        );
      videos.forEach((video) => (video as HTMLVideoElement).pause());
    }
  };

  const videoSlickSliderSettings: Settings = {
    dots: false,

    infinite: false,

    speed: 500,

    slidesToShow: 1,

    slidesToScroll: 1,

    beforeChange: beforeChangeHandler,
  };
  useEffect(() => {
    if (activity_lead?.id && activity_lead?.is_deal) {
      getActiveDealStageData(activity_lead.id);
    }
  }, [activity_lead?.id]);

  const accountCard = useCallback(
    (accountCardProps: {
      close: () => void;
      setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
      isOpen?: boolean;
    }) => {
      const { close, setIsOpen, isOpen } = accountCardProps;
      const accountPrimaryEmail = (activity_account?.emails || [])?.find(
        (val) => val?.isPrimary
      )?.value;
      const accountPrimaryPhone = (activity_account?.phones || [])?.find(
        (val) => val.isPrimary
      );

      const address = {
        address1: activity_account?.address1 || '',
        address2: activity_account?.address2 || '',
        state: activity_account?.state?.state_code || '',
        city: activity_account?.city || '',
        country: activity_account?.country?.name || '',
        zip: activity_account?.zip || '',
      };

      const checkAddressLength = Object.values(address).find(
        (element) => element
      );

      return (
        <>
          {activity_account?.name && Boolean(activity_account?.id) && (
            <EntityCard
              modelName={ModuleNames.ACCOUNT}
              id={activity_account?.id}
              name={activity_account?.name}
              email={accountPrimaryEmail}
              phone={accountPrimaryPhone?.value.toString()}
              phoneType={accountPrimaryPhone?.phoneType || ''}
              {...(!!checkAddressLength && { address })}
              {...{ close, setIsOpen, isOpen }}
            />
          )}
        </>
      );
    },
    [activity_account]
  );

  const contactCard = useCallback(
    (accountCardProps: {
      close: () => void;
      setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
      isOpen?: boolean;
    }) => {
      const { close, setIsOpen, isOpen } = accountCardProps;
      const contactPrimaryEmail = (activity_contact?.emails || [])?.filter(
        (val) => val?.is_primary
      )?.[0]?.value;
      const contactPrimaryPhone = (activity_contact?.phones || [])?.filter(
        (val) => val?.is_primary
      )?.[0];
      const address = {
        address1: activity_contact?.address1 || '',
        address2: activity_contact?.address2 || '',
        state: activity_contact?.state?.state_code || '',
        city: activity_contact?.city || '',
        country: activity_contact?.country?.name || '',
        zip: activity_contact?.zip || '',
      };

      const checkAddressLength = Object.values(address).find(
        (element) => element
      );

      return (
        <>
          {activity_contact?.name && Boolean(activity_contact?.id) && (
            <EntityCard
              modelName={ModuleNames.CONTACT}
              id={activity_contact?.id}
              name={activity_contact?.name}
              email={contactPrimaryEmail}
              phone={contactPrimaryPhone?.value?.toString()}
              phoneType={contactPrimaryPhone?.phoneType || ''}
              {...(!!checkAddressLength && { address })}
              {...{ close, setIsOpen, isOpen }}
            />
          )}
        </>
      );
    },
    [activity_contact]
  );

  const leadDealCard = useCallback(
    (leadDealCardProps: {
      close: () => void;
      setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    }) => {
      const { close, setIsOpen } = leadDealCardProps;
      const contactMail = setContactAndMailFunc({
        leadData: activity_lead as unknown as LeadDetailsType | DealDetailsType,
        isActivityContactMail: true,
      });
      return (
        <>
          {Boolean(activity_lead?.id) && activity_lead?.name && (
            <LeadDealCard
              id={activity_lead?.id}
              name={activity_lead?.name}
              closing_date={activity_lead?.closing_date}
              is_deal={activity_lead?.is_deal}
              owner={{
                first_name: activity_lead?.lead_owner?.first_name,
                last_name: activity_lead?.lead_owner?.last_name,
              }}
              source={activity_lead?.lead_source?.name}
              value={activity_lead?.deal_value}
              contactMail={contactMail}
              {...{ close, setIsOpen }}
              activeDealStage={activeDealStage}
            />
          )}
        </>
      );
    },
    [activity_lead, activeDealStage]
  );

  const headerInfo = {
    contactName: activity_contact?.id ? (
      <Dropdown
        className="quickView__accContact__tippy"
        zIndex={10}
        hideOnClick
        content={contactCard}
      >
        <button
          type="button"
          className="hover:text-primaryColorSD cursor-pointer hover:underline"
        >
          {activity_contact?.name}
        </button>
      </Dropdown>
    ) : null,
    contactJobRole: activity_contact?.job_role || '',
    contactNameAndJobRoleComma:
      activity_contact?.job_role && activity_account?.name ? ', ' : '',
    accountName: activity_account?.id ? (
      <Dropdown
        className="quickView__accContact__tippy "
        hideOnClick
        content={accountCard}
      >
        <button
          className="hover:text-primaryColorSD hover:underline"
          type="button"
        >
          {activity_account?.name}
        </button>
      </Dropdown>
    ) : null,
    dealOrLeadName: activity_lead?.id ? (
      <Dropdown
        className="quickView__accContact__tippy"
        zIndex={10}
        hideOnClick
        content={leadDealCard}
      >
        <button
          type="button"
          className="hover:text-primaryColorSD cursor-pointer hover:underline"
        >
          {activity_lead?.name}
        </button>
      </Dropdown>
    ) : null,
    contactPrimaryEmail: activity_contact?.emails?.filter(
      (val) => val?.is_primary
    )[0]?.value,
    contactPrimaryPhone:
      formatPhoneNumber(
        activity_contact?.phones?.filter((val) => val?.is_primary)[0]?.value
      ) || '',
    formattedStartDate: start_date
      ? format(new Date(start_date || ''), ' MMM dd, yyyy')
      : '',
    formattedTime: start_date
      ? format(new Date(start_date || ''), ' hh:mm aa')
      : '',
    formattedCompletedDate:
      completed_by && completion_date
        ? format(new Date(completion_date || ''), ' EEEE, MM/dd/yyyy')
        : '',
    formattedCompletedTime:
      completed_by && completion_date
        ? format(new Date(completion_date || ''), ' hh:mm aa')
        : '',
    formattedDuration: all_day ? 'All Day' : ` ${duration} Minutes`,
    logOnTime: (
      <>
        {/* <span className="text-black__TextColor600 pr-[4px]">Time Logged:</span> */}
        <span className="inline-block text-[14px] text-ipBlack__textColor font-biotif__Medium pr-[5px] sm:text-[14px] sm:text-black/50 sm:font-biotif__SemiBold">
          {calculateLogOnTime(activity_time_logs) || null}{' '}
        </span>
      </>
    ),
    viewRecording: (
      <>
        {activity_meeting_bot && activity_meeting_bot?.length ? (
          <>
            <div className="video__slider__wrapper">
              <Slider ref={sliderRef} {...videoSlickSliderSettings}>
                {activity_meeting_bot?.map((item, index) => {
                  return (
                    <>
                      <div className="meeting__video__box" key={index}>
                        {item.path ? (
                          <MeetingReport
                            path={item.path}
                            handleView={() => {
                              setPlayerModelData({
                                meetingType: 'video',
                                path: item.path,
                                transcript_path: item.transcript_path,
                                summary: item?.summary || null,
                              });
                              setOpenRecordingPlayerModel(true);
                            }}
                          />
                        ) : null}

                        {item.summary && (
                          <div className="summary__wrapper mt-[12px] mb-[10px]">
                            <h4 className="text-[16px] font-biotif__Regular text-primaryColorSD mb-[6px]">
                              Summary
                            </h4>
                            <ActivityTimelineSummary
                              data={item.summary}
                              showMoreSummary={() => {
                                setPlayerModelData({
                                  meetingType: 'video',
                                  path: item.path,
                                  transcript_path: item.transcript_path,
                                  summary: item?.summary,
                                });
                                setOpenRecordingPlayerModel(true);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </>
                  );
                })}
              </Slider>
            </div>
          </>
        ) : (
          <></>
        )}
      </>
    ),
    viewAudioRecording: (
      <>
        {activity_zoom_call_recordings?.length ? (
          <>
            <div className="video__slider__wrapper">
              <Slider {...videoSlickSliderSettings}>
                {activity_zoom_call_recordings.map((item) => {
                  return (
                    <>
                      <div className="meeting__video__box">
                        <div className="video__box w-full mb-[15px]">
                          {item.path ? (
                            <MeetingReport path={item.path} type="audio" />
                          ) : null}
                        </div>
                      </div>
                    </>
                  );
                })}
              </Slider>
            </div>
          </>
        ) : null}
      </>
    ),
    reminder: {
      isShow: notifications?.length > 0,
      title: (
        <span className="text-black__TextColor600 pr-[4px]">Reminder:</span>
      ),
      singleReminder: (
        <span className="whitespace-pre overflow-hidden text-ellipsis inline-block max-w-full">
          <>
            {notifications?.[0]?.duration}{' '}
            {
              NOTIFICATION_TYPE?.find(
                (type) => type.value === notifications?.[0]?.durationType
              )?.label
            }{' '}
            Before
          </>
        </span>
      ),
      allReminder: (
        <span
          className="inline-block text-primaryColorSD cursor-pointer hover:underline"
          onClick={() => setIsOpenNotificationReminderModal(true)}
        >
          See all
        </span>
      ),
    },
    location_details: location_details?.title || null,

    agenda: agenda || null,
  };

  return (
    <>
      {message?.fieldName &&
        (message?.fieldName === '---Zoom-Phone-Call---' ||
          message?.fieldName === '---ScHeDuLed---AcTiViTy---TiMeLiNe---') && (
          <div className="activity__timeline__wrapper flex flex-wrap w-full py-[26px]">
            {/* **** Here in first condition display only created message when activity attach any entity ****** */}
            {message?.fieldName &&
              message?.fieldName ===
                '---ScHeDuLed---AcTiViTy---TiMeLiNe---' && (
                <div
                  className={`first__column flex flex-wrap px-[26px] border-r border-r-whiteScreenBorderColor ${
                    activity_meeting_bot?.length > 0 ? 'w-1/3' : 'w-1/3'
                  }`}
                >
                  <div className="flex flex-wrap w-full">
                    {activity_type?.icon && (
                      <Icon
                        className="w-[52px] h-[52px] rounded-[6px] p-[8px] activity__type__icon bg-primaryColorSD shadow-[1px_1px_3px_0px_#2e2949e6_inset,_-1px_-1px_2px_0px_#baa5ffe6_inset,_1px_-1px_2px_0px_#2e294933_inset,_-1px_1px_2px_0px_#2e294933_inset]"
                        iconType={activity_type.icon}
                      />
                    )}
                    <div className="contant__wrapper pl-[20px] w-[calc(100%_-_52px)]">
                      <div
                        className="text-darkTextColorSD text-[18px] font-biotif__Medium mb-[12px] hover:text-primaryColorSD"
                        onClick={() => {
                          if (timeline_model_name !== 'activities') {
                            if (setOpenActivityModal) {
                              setOpenActivityModal({
                                activityTopic: topic,
                                id: activityId || null,
                                view: true,
                                edit: false,
                                complete: false,
                                historyId: historyId || null,
                              });
                            }
                          }
                        }}
                      >
                        {topic}
                      </div>
                      <div className="details__wrapper mb-[16px]">
                        {headerInfo?.contactName && (
                          <div className="text-[16px] font-biotif__Regular text-darkTextColorSD leading-normal mb-[2px]">
                            {headerInfo.contactName}
                          </div>
                        )}
                        {(headerInfo?.contactJobRole ||
                          headerInfo.accountName) && (
                          <div className="text-[16px] font-biotif__Regular text-darkTextColorSD leading-normal mb-[2px]">
                            {headerInfo.contactJobRole}
                            {headerInfo.contactNameAndJobRoleComma}
                            {headerInfo.accountName}
                          </div>
                        )}
                        {headerInfo?.dealOrLeadName && (
                          <div className="text-[16px] font-biotif__Regular text-darkTextColorSD leading-normal mb-[2px]">
                            Lead : {headerInfo.dealOrLeadName}
                          </div>
                        )}
                      </div>
                      <div className="extra__details__wrapper">
                        {is_confirmed ? (
                          <div className="extra__details__row flex items-center mb-[14px]">
                            <Icon
                              className="w-[22px] h-[22px] p-[1px] shrink-0 relative top-[-2px] mr-[8px]"
                              iconType="greenRightTickFilledIcon"
                            />
                            <div className="value w-full text-[16px] text-darkTextColorSD font-biotif__Medium whitespace-pre overflow-hidden text-ellipsis">
                              Meeting Confirmed
                            </div>
                          </div>
                        ) : null}
                        <div className="extra__details__row flex items-center mb-[14px]">
                          <Icon
                            className="w-[22px] h-[22px] p-0 shrink-0 relative top-[-2px] mr-[8px]"
                            iconType="dottedClockIcon"
                          />
                          <div className="value w-full text-[16px] text-darkTextColorSD font-biotif__Medium whitespace-pre overflow-hidden text-ellipsis">
                            {headerInfo?.formattedTime},{' '}
                            {headerInfo?.formattedStartDate} for{' '}
                            {headerInfo?.formattedDuration}
                          </div>
                        </div>
                        {headerInfo.location_details && (
                          <div className="extra__details__row flex items-center mb-[14px]">
                            <Icon
                              className="w-[22px] h-[22px] p-0 shrink-0 relative top-[-2px] mr-[8px]"
                              iconType="locationIcon"
                            />
                            <div className="value w-full text-[16px] text-darkTextColorSD font-biotif__Regular whitespace-pre overflow-hidden text-ellipsis">
                              {headerInfo.location_details}
                            </div>
                          </div>
                        )}
                        {headerInfo?.reminder.isShow &&
                        notifications?.[0]?.duration ? (
                          <div className="extra__details__row flex items-center mb-[14px]">
                            <Icon
                              className="w-[22px] h-[22px] p-0 shrink-0 relative top-[-2px] mr-[8px]"
                              iconType="notificationIcon"
                            />
                            <div className="value w-full text-[16px] text-darkTextColorSD font-biotif__Regular whitespace-pre overflow-hidden text-ellipsis">
                              {/* {headerInfo.reminder.title} */}
                              <div className="flex items-center">
                                <span className="inline-flex whitespace-pre overflow-hidden text-ellipsis max-w-full">
                                  {headerInfo.reminder.singleReminder}
                                </span>
                                <span className="inline-block shrink-0 ml-[7px]">
                                  {headerInfo.reminder.allReminder}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : null}
                        {/* {headerInfo.logOnTime && (
                          <div className="extra__details__row flex items-center mb-[14px]">
                            <Icon
                              className="w-[22px] h-[22px] p-0 shrink-0 relative top-[-2px] mr-[8px]"
                              iconType="notificationIcon"
                            />
                            <div className="value w-full text-[16px] text-darkTextColorSD font-biotif__Regular whitespace-pre overflow-hidden text-ellipsis">
                              {headerInfo.logOnTime}
                            </div>
                          </div>
                        )} */}
                        {collaborators && collaborators?.length > 0 && (
                          <div className="extra__details__row flex items-center mb-[14px]">
                            <Icon
                              className="w-[22px] h-[22px] p-0 shrink-0 relative top-[-2px] mr-[8px]"
                              iconType="groupNewIcon"
                            />
                            <div className="value w-full text-[16px] text-darkTextColorSD font-biotif__Regular whitespace-pre overflow-hidden text-ellipsis">
                              <div className="w-full flex items-center">
                                <span className="inline-block max-w-full whitespace-pre overflow-hidden text-ellipsis">
                                  {showMore
                                    ? collaborators
                                        ?.map((item: any) => item.full_name)
                                        .join(', ')
                                    : collaborators
                                        ?.map((item) => item.full_name)
                                        .slice(0, 2)}
                                </span>
                                {!showMore &&
                                  collaborators &&
                                  collaborators?.length > 2 && (
                                    <span
                                      className="inline-block cursor-pointer text-primaryColorSD shrink-0 ml-[7px] hover:underline"
                                      onClick={() => {
                                        setShowMore(true);
                                      }}
                                    >
                                      {' '}
                                      +{collaborators.length - 2} More
                                    </span>
                                  )}
                              </div>
                            </div>
                          </div>
                        )}
                        {zoom_meeting_details &&
                          zoom_meeting_details?.join_url && (
                            <div className="extra__details__row flex items-center mb-[14px]">
                              <Icon
                                className="w-[22px] h-[22px] p-0 shrink-0 relative top-[-2px] mr-[8px]"
                                iconType="videoIcon"
                              />
                              <div className="value w-full text-[16px] text-darkTextColorSD font-biotif__Regular whitespace-pre overflow-hidden text-ellipsis">
                                <div className="w-full flex items-center">
                                  <span className="inline-block shrink-0 mr-[7px]">
                                    Zoom
                                  </span>
                                  <a
                                    className="inline-block cursor-pointer text-primaryColorSD max-w-full whitespace-pre overflow-hidden text-ellipsis hover:underline"
                                    href={zoom_meeting_details?.join_url}
                                  >
                                    {zoom_meeting_details?.join_url}
                                  </a>
                                </div>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            {((activity_meeting_bot && activity_meeting_bot.length > 0) ||
              activity_zoom_call_recordings?.length > 0) &&
              message?.fieldName &&
              message?.fieldName !== '---Zoom-Phone-Call---' && (
                <div className="second__column w-1/3 px-[26px] border-r border-r-whiteScreenBorderColor">
                  {headerInfo.viewRecording}
                  {headerInfo.viewAudioRecording}
                </div>
              )}

            {message?.fieldName &&
              message?.fieldName === '---Zoom-Phone-Call---' && (
                <>
                  <div className="first__column w-1/3 px-[26px] border-r border-r-whiteScreenBorderColor">
                    <div className="flex flex-wrap w-full img__wrapper">
                      <div className="i__Icon w-[52px] h-[52px] rounded-[6px] activity__type__icon">
                        <Image
                          first_name={activities.assigned_to.first_name}
                          last_name={activities.assigned_to.last_name}
                          serverPath
                        />
                      </div>
                      <div className="contant__wrapper pl-[20px] w-[calc(100%_-_52px)]">
                        <div className="text-[16px] font-biotif__Regular tracking-[0.5px]">
                          {message?.newValue?.value}
                        </div>
                        <div className="meetingCN__box flex flex-wrap  3xl:justify-start xl:pr-0">
                          {message?.newValue && message?.newValue.result ? (
                            <div className="inline-block w-full text-[14px] text-ipBlack__textColor font-biotif__Medium relative pr-[10px] mr-[10px] mb-[6px] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[calc(100%_-_4px)] before:w-[1px] before:bg-whiteScreen__BorderColor before:hidden">
                              <span className="text-black/50 pr-[4px]">
                                Result:
                              </span>
                              {message?.newValue && message?.newValue.result
                                ? message?.newValue?.result
                                : ''}
                            </div>
                          ) : (
                            <></>
                          )}
                          {message?.newValue && message?.newValue.duration ? (
                            <div className="inline-block w-full text-[14px] text-ipBlack__textColor font-biotif__Medium relative pr-[10px] mr-[10px] mb-[6px] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[calc(100%_-_4px)] before:w-[1px] before:bg-whiteScreen__BorderColor before:hidden">
                              <span className="text-black/50 pr-[4px]">
                                Duration:
                              </span>
                              {message?.newValue?.duration}
                            </div>
                          ) : (
                            <></>
                          )}
                          {message?.newValue && message?.newValue.call_time ? (
                            <div className="inline-block w-full text-[14px] text-ipBlack__textColor font-biotif__Medium relative pr-[10px] mr-[10px] mb-[6px] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[calc(100%_-_4px)] before:w-[1px] before:bg-whiteScreen__BorderColor before:hidden">
                              <span className="text-black/50 pr-[4px]">
                                Call Time:
                              </span>
                              {format(
                                new Date(message?.newValue?.call_time || ''),
                                'MM/dd/yyyy hh:mm aa'
                              )}
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="second__column w-1/3 px-[26px]">
                    {headerInfo.viewAudioRecording}
                  </div>
                </>
              )}
            {message?.fieldName &&
              message?.fieldName ===
                '---ScHeDuLed---AcTiViTy---TiMeLiNe---' && (
                <div
                  className={`third__column px-[26px] ${
                    activity_meeting_bot?.length > 0 ? 'w-1/3' : 'w-1/3'
                  }`}
                >
                  <div className="result__top__header flex items-start mb-[20px]">
                    <div className="left__text w-full pr-[13px]">
                      {result ? (
                        <>
                          <h6 className="title text-[16px] font-biotif__Medium text-sdNormal__textColor mb-[7px]">
                            Result
                          </h6>
                          {result ? (
                            <p className="text-darkTextColorSD text-[16px] font-biotif__Medium">
                              {result}
                            </p>
                          ) : null}
                        </>
                      ) : null}
                    </div>
                  </div>

                  <div className="result__details__wrapper">
                    {result ? (
                      <>
                        <div className="result__details__row mb-[20px]">
                          <h6 className="title text-[16px] font-biotif__Medium text-sdNormal__textColor mb-[7px]">
                            Memo
                          </h6>
                          <p className="text-darkTextColorSD text-[14px] font-biotif__Regular">
                            {result ? (
                              <DisplayRichTextContent
                                information={convertAtoB(memo)}
                              />
                            ) : null}
                          </p>
                        </div>
                      </>
                    ) : null}
                    <div className="result__details__row mb-[20px]">
                      {activities?.notesData?.length ? (
                        <>
                          <h6 className="title text-[16px] font-biotif__Medium text-sdNormal__textColor mb-[7px]">
                            Notes
                          </h6>
                          <p className="text-darkTextColorSD text-[14px] font-biotif__Regular">
                            {activities?.notesData &&
                            activities?.notesData?.[0]?.description ? (
                              <DisplayRichTextContent
                                information={convertAtoB(
                                  activities?.notesData[0].description
                                )}
                              />
                            ) : null}
                          </p>
                        </>
                      ) : null}
                    </div>

                    {activity_time_logs?.length !== 0 ? (
                      <>
                        <div className="result__details__row mb-[20px]">
                          <h6 className="title text-[16px] font-biotif__Medium text-sdNormal__textColor mb-[7px]">
                            Time Logged
                          </h6>
                          <p className="text-darkTextColorSD text-[14px] font-biotif__Regular">
                            {calculateLogOnTime(activity_time_logs) || null}
                          </p>
                        </div>
                      </>
                    ) : null}
                    {activities?.follow_up_activity ? (
                      <>
                        <div className="result__details__row mb-[20px]">
                          <h6 className="title text-[16px] font-biotif__Medium text-sdNormal__textColor mb-[7px]">
                            Follow-up Schedule
                          </h6>
                          <p className="text-darkTextColorSD text-[14px] font-biotif__Regular">
                            {activities?.follow_up_activity?.start_date
                              ? format(
                                  new Date(
                                    activities?.follow_up_activity
                                      ?.start_date || ''
                                  ),
                                  ' MMM dd, yyyy'
                                )
                              : ''}
                            {activities?.follow_up_activity?.start_date
                              ? format(
                                  new Date(
                                    activities?.follow_up_activity
                                      ?.start_date || ''
                                  ),
                                  ' hh:mm aa'
                                )
                              : ''}
                          </p>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              )}
          </div>
        )}

      {message?.fieldName === 'New Activity Created' && (
        <div className="timeline__contant__wrapper w-[calc(100%_-_41px)] pl-[18px] pt-[9px] sm:w-[calc(100%_-_29px)] sm:pt-[7px] sm:pl-[10px]">
          <div className="text-[16px] font-biotif__Regular tracking-[0.5px]">
            {message?.newValue?.value}
          </div>
        </div>
      )}
      {message?.fieldName === undefined && (
        <div className="activity__timeline__wrapper flex flex-wrap w-full py-[26px]">
          <div
            className={`first__column flex flex-wrap  px-[26px] border-r border-r-whiteScreenBorderColor ${
              activity_meeting_bot?.length > 0 ? 'w-1/3' : 'w-1/2'
            }`}
          >
            <div className="flex flex-wrap w-full">
              {activity_type?.icon && (
                <Icon
                  className="w-[52px] h-[52px] rounded-[6px] p-[8px] activity__type__icon bg-primaryColorSD shadow-[1px_1px_3px_0px_#383158e5_inset]"
                  iconType={activity_type?.icon}
                />
              )}
              <div className="contant__wrapper pl-[20px] w-[calc(100%_-_52px)]">
                <div
                  className="text-darkTextColorSD text-[18px] font-biotif__Medium mb-[12px] hover:text-primaryColorSD"
                  onClick={() => {
                    if (timeline_model_name !== 'activities') {
                      if (setOpenActivityModal) {
                        setOpenActivityModal({
                          activityTopic: topic,
                          id: activityId || null,
                          view: true,
                          edit: false,
                          complete: false,
                          historyId: historyId || null,
                        });
                      }
                    }
                  }}
                >
                  {topic}
                </div>
                <div className="details__wrapper mb-[16px]">
                  {headerInfo.contactName && (
                    <div className="text-[16px] font-biotif__Regular text-darkTextColorSD leading-normal mb-[2px]">
                      {headerInfo.contactName}
                    </div>
                  )}
                  {(headerInfo.contactJobRole || headerInfo.accountName) && (
                    <div className="text-[16px] font-biotif__Regular text-darkTextColorSD leading-normal mb-[2px]">
                      {headerInfo.contactJobRole}
                      {headerInfo.contactNameAndJobRoleComma}
                      {headerInfo.accountName}
                    </div>
                  )}
                  {headerInfo.dealOrLeadName && (
                    <div className="text-[16px] font-biotif__Regular text-darkTextColorSD leading-normal mb-[2px]">
                      Lead : {headerInfo.dealOrLeadName}
                    </div>
                  )}
                </div>
                <div className="extra__details__wrapper">
                  {is_confirmed ? (
                    <div className="extra__details__row flex items-center mb-[14px]">
                      <Icon
                        className="w-[22px] h-[22px] p-[1px] shrink-0 relative top-[-2px] mr-[8px]"
                        iconType="greenRightTickFilledIcon"
                      />
                      <div className="value w-full text-[16px] text-darkTextColorSD font-biotif__Medium whitespace-pre overflow-hidden text-ellipsis">
                        Meeting Confirmed
                      </div>
                    </div>
                  ) : null}
                  <div className="extra__details__row flex items-center mb-[14px]">
                    <Icon
                      className="w-[22px] h-[22px] p-0 shrink-0 relative top-[-2px] mr-[8px]"
                      iconType="dottedClockIcon"
                    />
                    <div className="value w-full text-[16px] text-darkTextColorSD font-biotif__Medium whitespace-pre overflow-hidden text-ellipsis">
                      {headerInfo.formattedTime},{' '}
                      {headerInfo.formattedStartDate} for{' '}
                      {headerInfo.formattedDuration}
                    </div>
                  </div>
                  {headerInfo.location_details ? (
                    <div className="extra__details__row flex items-center mb-[14px]">
                      <Icon
                        className="w-[22px] h-[22px] p-0 shrink-0 relative top-[-2px] mr-[8px]"
                        iconType="locationIcon"
                      />
                      <div className="value w-full text-[16px] text-darkTextColorSD font-biotif__Regular whitespace-pre overflow-hidden text-ellipsis">
                        {headerInfo.location_details}
                      </div>
                    </div>
                  ) : (
                    <div className="extra__details__row flex items-center mb-[14px]">
                      <Icon
                        className="w-[22px] h-[22px] p-0 shrink-0 relative top-[-2px] mr-[8px]"
                        iconType="locationIcon"
                      />
                      <div className="value w-full text-[16px] text-darkTextColorSD font-biotif__Regular whitespace-pre overflow-hidden text-ellipsis">
                        -
                      </div>
                    </div>
                  )}
                  {headerInfo.reminder.isShow &&
                    notifications?.[0]?.duration && (
                      <div className="extra__details__row flex items-center mb-[14px]">
                        <Icon
                          className="w-[22px] h-[22px] p-0 shrink-0 relative top-[-2px] mr-[8px]"
                          iconType="notificationIcon"
                        />
                        <div className="value w-full text-[16px] text-darkTextColorSD font-biotif__Regular whitespace-pre overflow-hidden text-ellipsis">
                          {/* {headerInfo.reminder.title} */}
                          <div className="flex items-center">
                            <span className="inline-flex whitespace-pre overflow-hidden text-ellipsis max-w-full">
                              {headerInfo.reminder.singleReminder}
                            </span>
                            <span className="inline-block shrink-0 ml-[7px]">
                              {headerInfo.reminder.allReminder}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  {/* <div className="extra__details__row flex items-center mb-[14px]">
                    <Icon
                      className="w-[22px] h-[22px] p-0 shrink-0 relative top-[-2px] mr-[8px]"
                      iconType="notificationIcon"
                    />
                    <div className="value w-full text-[16px] text-darkTextColorSD font-biotif__Regular whitespace-pre overflow-hidden text-ellipsis">
                      {headerInfo.logOnTime}
                    </div>
                  </div> */}
                  <div className="extra__details__row flex items-center mb-[14px]">
                    <Icon
                      className="w-[22px] h-[22px] p-0 shrink-0 relative top-[-2px] mr-[8px]"
                      iconType="groupNewIcon"
                    />
                    <div className="value w-full text-[16px] text-darkTextColorSD font-biotif__Regular whitespace-pre overflow-hidden text-ellipsis">
                      <div className="w-full flex items-center">
                        <span className="inline-block max-w-full whitespace-pre overflow-hidden text-ellipsis">
                          {showMore
                            ? activity_collaborators
                                ?.map(
                                  (item: any) =>
                                    `${item.user.first_name} ${item.user.last_name}`
                                )
                                .join(', ')
                            : activity_collaborators
                                ?.map(
                                  (item: any) =>
                                    `${item.user.first_name} ${item.user.last_name}`
                                )
                                .slice(0, 2)}
                        </span>
                        {!showMore &&
                          activity_collaborators &&
                          activity_collaborators?.length > 2 && (
                            <span
                              className="inline-block cursor-pointer text-primaryColorSD shrink-0 ml-[7px] hover:underline"
                              onClick={() => {
                                setShowMore(true);
                              }}
                            >
                              {' '}
                              +{activity_collaborators.length - 2} More
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                  <div className="extra__details__row flex items-center mb-[14px]">
                    <Icon
                      className="w-[22px] h-[22px] p-0 shrink-0 relative top-[-2px] mr-[8px]"
                      iconType="videoIcon"
                    />
                    <div className="value w-full text-[16px] text-darkTextColorSD font-biotif__Regular whitespace-pre overflow-hidden text-ellipsis">
                      <div className="w-full flex items-center">
                        <span className="inline-block shrink-0 mr-[7px]">
                          Zoom
                        </span>
                        {(
                          <a
                            className="inline-block cursor-pointer text-primaryColorSD max-w-full whitespace-pre overflow-hidden text-ellipsis hover:underline"
                            href={zoom_meeting_details?.join_url}
                          >
                            {zoom_meeting_details?.join_url}
                          </a>
                        ) ?? null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {activity_meeting_bot?.length > 0 && (
            <div className="second__column w-1/3 px-[26px] border-r border-r-whiteScreenBorderColor">
              {headerInfo.viewRecording}
              {message?.fieldName &&
                message?.fieldName === '---Zoom-Phone-Call---' && (
                  <>
                    <div className="timeline__contant__wrapper w-[calc(100%_-_41px)] pl-[18px] pt-[9px] sm:w-[calc(100%_-_29px)] sm:pt-[7px] sm:pl-[10px]">
                      <div className="text-[16px] font-biotif__Regular tracking-[0.5px]">
                        {message?.newValue?.value}
                      </div>
                    </div>
                    <div className="timeline__contant__wrapper w-[calc(100%_-_41px)] pl-[18px] pt-[9px] ml-[40px] sm:w-[calc(100%_-_29px)] sm:pt-[7px] sm:pl-[10px]">
                      <div className="meetingCN__box flex flex-wrap  3xl:justify-start xl:pr-0">
                        {message?.newValue && message?.newValue.result ? (
                          <div className="inline-block w-full text-[14px] text-ipBlack__textColor font-biotif__Medium relative pr-[10px] mr-[10px] mb-[6px] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[calc(100%_-_4px)] before:w-[1px] before:bg-whiteScreen__BorderColor before:hidden">
                            <span className="text-black/50 pr-[4px]">
                              Result:
                            </span>
                            {message?.newValue && message?.newValue.result
                              ? message?.newValue?.result
                              : null}
                          </div>
                        ) : (
                          <></>
                        )}
                        {message?.newValue && message?.newValue.duration ? (
                          <div className="inline-block w-full text-[14px] text-ipBlack__textColor font-biotif__Medium relative pr-[10px] mr-[10px] mb-[6px] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[calc(100%_-_4px)] before:w-[1px] before:bg-whiteScreen__BorderColor before:hidden">
                            <span className="text-black/50 pr-[4px]">
                              Duration:
                            </span>
                            {message?.newValue?.duration}
                          </div>
                        ) : (
                          <></>
                        )}
                        {message?.newValue && message?.newValue.call_time ? (
                          <div className="inline-block w-full text-[14px] text-ipBlack__textColor font-biotif__Medium relative pr-[10px] mr-[10px] mb-[6px] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[calc(100%_-_4px)] before:w-[1px] before:bg-whiteScreen__BorderColor before:hidden">
                            <span className="text-black/50 pr-[4px]">
                              Call Time:
                            </span>
                            {format(
                              new Date(message?.newValue?.call_time || ''),
                              'MM/dd/yyyy hh:mm aa'
                            )}
                          </div>
                        ) : (
                          <></>
                        )}
                        {activity_zoom_call_recordings?.length ? (
                          <div className="inline-block w-full text-[14px] text-ipBlack__textColor font-biotif__Medium relative pr-[10px] mr-[10px] mb-[6px] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[calc(100%_-_4px)] before:w-[1px] before:bg-whiteScreen__BorderColor before:hidden">
                            <span className="text-black/50 pr-[4px]">
                              View Recordings:
                            </span>
                            {activity_zoom_call_recordings.map(
                              (item, index) => {
                                return (
                                  <button
                                    type="button"
                                    className="py-[4px] px-[14px] inline-flex items-center rounded-[6px] border-[1px] border-whiteScreen__BorderColor mr-[10px] last:mr-0"
                                  >
                                    <span className="inline-block">
                                      Recording {index + 1}
                                    </span>
                                    <span
                                      className="w-[24px] h-[24px] ml-[8px] rounded-full duration-300 flex items-center justify-center bg-[#f3f3f3] hover:bg-black group"
                                      onClick={() => {
                                        setPlayerModelData({
                                          path: item.path,
                                          meetingType: 'audio',
                                          transcript_path: item.transcript_path,
                                        });
                                        setOpenRecordingPlayerModel(true);
                                      }}
                                    >
                                      <span className="inline-block w-0 h-0 border-[5px] border-transparent border-l-[8px] border-l-black relative left-[3px] group-hover:border-l-white" />
                                    </span>
                                  </button>
                                );
                              }
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </>
                )}
            </div>
          )}
          <div
            className={`third__column px-[26px] ${
              activity_meeting_bot?.length > 0 ? 'w-1/3' : 'w-1/2'
            }`}
          >
            {result ? (
              <div className="result__top__header flex items-start mb-[20px]">
                <div className="left__text w-full pr-[13px]">
                  <h6 className="title text-[16px] font-biotif__Medium text-sdNormal__textColor mb-[7px]">
                    Result
                  </h6>
                  <p className="text-darkTextColorSD text-[16px] font-biotif__Medium">
                    {result}
                  </p>
                </div>
              </div>
            ) : null}
            <div className="result__details__wrapper">
              <div className="result__details__row mb-[20px]">
                {memo ? (
                  <>
                    <h6 className="title text-[16px] font-biotif__Medium text-sdNormal__textColor mb-[7px]">
                      Memo
                    </h6>
                    <p className="text-darkTextColorSD text-[14px] font-biotif__Regular">
                      {result ? (
                        <DisplayRichTextContent
                          information={convertAtoB(memo)}
                        />
                      ) : null}
                    </p>
                  </>
                ) : null}
              </div>
              {activities?.notesData ? (
                <>
                  <div className="result__details__row mb-[20px] hidden">
                    {activities?.notesData?.length ? (
                      <>
                        <h6 className="title text-[16px] font-biotif__Medium text-sdNormal__textColor mb-[7px]">
                          Notes
                        </h6>
                        <p className="text-darkTextColorSD text-[14px] font-biotif__Regular">
                          {activities?.notesData?.[0]?.description ? (
                            <DisplayRichTextContent
                              information={convertAtoB(
                                activities?.notesData[0].description
                              )}
                            />
                          ) : null}
                        </p>
                      </>
                    ) : null}
                  </div>
                </>
              ) : null}

              {activity_time_logs?.length ? (
                <>
                  <div className="result__details__row mb-[20px]">
                    <h6 className="title text-[16px] font-biotif__Medium text-sdNormal__textColor mb-[7px]">
                      Time Logged
                    </h6>
                    <p className="text-darkTextColorSD text-[14px] font-biotif__Regular">
                      {calculateLogOnTime(activity_time_logs) || null}
                    </p>
                  </div>
                </>
              ) : null}

              {activities?.follow_up_activity ? (
                <>
                  <div className="result__details__row mb-[20px]">
                    <h6 className="title text-[16px] font-biotif__Medium text-sdNormal__textColor mb-[7px]">
                      Follow-up Schedule
                    </h6>
                    <p className="text-darkTextColorSD text-[14px] font-biotif__Regular">
                      {activities?.follow_up_activity?.start_date
                        ? format(
                            new Date(
                              activities?.follow_up_activity?.start_date || ''
                            ),
                            ' MMM dd, yyyy'
                          )
                        : ''}
                      {activities?.follow_up_activity?.start_date
                        ? format(
                            new Date(
                              activities?.follow_up_activity?.start_date || ''
                            ),
                            ' hh:mm aa'
                          )
                        : ''}
                    </p>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
      {/* see All reminder Modal */}
      {openNotificationReminderModal ? (
        <NotificationReminderModal
          closeModal={() => setIsOpenNotificationReminderModal(false)}
          isOpen={openNotificationReminderModal}
          activityId={activityId}
          notifications={notifications || []}
          onUpdate={() => {
            dispatch(setLoadTimeLines({ timeline: true }));
            setIsOpenNotificationReminderModal(false);
          }}
        />
      ) : (
        <></>
      )}

      {openRecordingPlayerModel && (
        <Modal
          onClose={() => {
            setOpenRecordingPlayerModel(false);
            setPlayerModelData({
              meetingType: 'video',
              path: null,
              transcript_path: null,
              summary: null,
            });
          }}
          modalWrapperClass="recording__play"
          width="calc(100vw - 60px)"
          title="Recording Play"
          visible
          showFooter={false}
        >
          <RecordingTranscript playerModelData={playerModelData} />
        </Modal>
      )}
    </>
  );
};

export default ActivityModuleWiseTimelineDisplay;
