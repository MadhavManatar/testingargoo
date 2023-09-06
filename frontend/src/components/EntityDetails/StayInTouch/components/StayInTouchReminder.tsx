// ** import packages **
import { useNavigate } from 'react-router-dom';
import { format, formatISO } from 'date-fns';

// ** Component **
import DateFormat from 'components/DateFormat';
import Icon from 'components/Icon';
import Image from 'components/Image';

// ** types **
import { StayInTouchReminderProps } from '../types/stay-in-touch.type';

// ** others **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { Capitalize, OrdinalSuffixOf, setUrlParams } from 'utils/util';
import { getNextActivityDate } from '../helper';
import { utcToZonedTime } from 'date-fns-tz';
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'redux/slices/authSlice';
import { useUpdateScheduleActivityByIdMutation } from 'redux/api/stayInTouchApi';

const StayInTouchReminder = (props: StayInTouchReminderProps) => {
  const {
    info,
    setIsStayInTouchOpen,
    activityName,
    model_record_id,
    getScheduleActivity,
    isScheduleActivityLoading,
    accordion: accordian,
    openCloseAccordion: openCloseAccordian,
  } = props;
  const {
    frequency,
    interval,
    month_date_type,
    week_occurrence,
    start_date,
    id,
    Activity,
  } = info;
  const previousActivity = Activity?.[0];

  // ** Hooks **
  const currentUser = useSelector(getCurrentUser);
  const navigate = useNavigate();

  // ** APIS **
  const [updateScheduleActivityByIdAPI, { isLoading }] =
    useUpdateScheduleActivityByIdMutation();

  const date_suffix_each = OrdinalSuffixOf(new Date(start_date).getDate());
  const date_suffix_on_the =
    OrdinalSuffixOf(week_occurrence) === '-1th'
      ? 'last'
      : OrdinalSuffixOf(week_occurrence);
  const intervalText = interval > 1 ? `after every ${interval}` : 'of every';
  const weekDay = format(new Date(start_date), 'EEEE');
  const month = format(new Date(start_date), 'LLLL');

  const getWeeklyReminderInfo = () => {
    return `Every ${interval > 1 ? interval : ''} week on  ${weekDay} `;
  };

  const getMonthlyReminderInfo = () => {
    if (month_date_type === 'each') {
      return `On ${date_suffix_each} ${intervalText} months.`;
    }

    if (month_date_type === 'on_the') {
      return `Every ${
        interval === 1 ? '' : interval
      } month in ${date_suffix_on_the} ${weekDay}`;
    }
  };

  const getYearlyReminderInfo = () => {
    if (interval === 1) {
      return `In ${month} on ${date_suffix_on_the} ${weekDay}`;
    }
    return `Every ${interval} years on the ${date_suffix_on_the} ${weekDay} in ${month}`;
  };

  const getCreationDayText = () => {
    if (frequency === 'monthly') {
      return getMonthlyReminderInfo();
    }

    if (frequency === 'weekly') {
      return getWeeklyReminderInfo();
    }

    if (frequency === 'yearly') {
      return getYearlyReminderInfo();
    }

    if (frequency === 'daily') {
      return 'Daily';
    }
  };

  const skipUpcomingDate = async () => {
    const monthSelectYear = new Date(start_date).getMonth();
    const selectMonthDate = new Date(start_date).getDate();
    const week_day = new Date(start_date).getDay();
    const week_day_for_week = new Date(start_date).getDay();

    const creation_date = getNextActivityDate(
      {
        freq: frequency,
        interval,
        monthDateType: month_date_type as 'each' | 'on_the' | null,
        monthSelectYear,
        selectMonthDate,
        week_day,
        week_day_for_week,
        week_occur: week_occurrence || 1,
        date: new Date(start_date),
      },
      true
    );

    const updated_creation_date = format(
      utcToZonedTime(
        new Date(start_date || ''),
        currentUser?.timezone || 'Etc/GMT-4'
      ),
      'dd_MM_yyyy'
    );

    const formatScheduleTime = format(new Date(start_date), 'HH:mm');

    const scheduledTimeHour = Number(formatScheduleTime.split(':')[0]);
    const scheduledTimeMinute = Number(formatScheduleTime.split(':')[1]);

    const startDate = creation_date
      ? formatISO(
          new Date(creation_date).setHours(
            scheduledTimeHour,
            scheduledTimeMinute,
            0,
            0
          )
        )
      : '';

    const bodyObj = {
      start_date: utcToZonedTime(
        new Date(startDate || ''),
        currentUser?.timezone || 'Etc/GMT-4'
      ),
      creation_date: updated_creation_date,
    };

    const data = await updateScheduleActivityByIdAPI({
      id: id || 0,
      data: bodyObj,
    });
    if ('data' in data) {
      getScheduleActivity(model_record_id || 0);
    }
  };

  return (
    <div className="stay__in__touch__reminder mb-[30px]">
      <div
        className="section__header"
        onClick={() => openCloseAccordian('stay')}
      >
        <span className="text text-[16px] font-biotif__Medium text-ipBlack__textColor w-[calc(100%_-_32px)] pr-[10px]">
          Stay In Touch Reminder
        </span>
        <button
          className={`section__toggle__btn w-[30px] h-[30px] rounded-[7px] text-[0px] relative duration-500 hover:bg-white before:content-[""] before:absolute before:left-[10px] before:w-[10px] before:h-[10px] before:border-l-[2px] before:border-l-ipBlack__borderColor before:border-b-[2px] before:border-b-ipBlack__borderColor before:-rotate-45 before:top-[8px] ${
            accordian.stay ? 'active' : ''
          } `}
        >
          .
        </button>
      </div>
      {accordian.stay && (
        <div className="border border-whiteScreen__BorderColor rounded-[12px] p-[24px] pb-[4px] 3xl:p-[15px] 3xl:pb-0 lg:pb-[15px] sm:p-0 sm:border-0">
          <div className="flex flex-wrap mx-[-10px]">
            {previousActivity && (
              <div className="stay__touch__reminder__Box w-[360px] max-w-[33.3333%] px-[10px] mb-[20px] xl:w-1/2 xl:max-w-[50%] lg:w-full lg:max-w-full">
                <div className="inner__wrapper border border-whiteScreen__BorderColor rounded-[10px] py-[18px] px-[24px] h-full 3xl:py-[14px] 3xl:px-[15px]">
                  <h3 className="text-[20px] font-biotif__Medium text-[#2E3234] mb-[15px] lg:mb-[10px]">
                    Previous
                  </h3>
                  <div className="contant__wrapper flex flex-wrap">
                    <div className="icon__wrapper w-[31px] h-[31px]">
                      {previousActivity?.activity_type?.icon_type ===
                      'Default' ? (
                        <Icon
                          className="highlighted p-[8px]"
                          iconType={previousActivity?.activity_type?.icon}
                        />
                      ) : (
                        <Image
                          imgPath={previousActivity?.activity_type?.icon || ''}
                          serverPath
                        />
                      )}
                    </div>
                    <div className="right__wrapper w-[calc(100%_-_32px)] pl-[10px] pt-[6px]">
                      <h5 className="text-[16px] font-biotif__Medium text-[#2E3234] mb-[5px] cursor-pointer">
                        <span
                          onClick={() =>
                            navigate(
                              setUrlParams(
                                PRIVATE_NAVIGATION.activities.detailPage,
                                previousActivity?.id
                              )
                            )
                          }
                        >
                          {previousActivity?.activity_type?.name || ''}
                        </span>
                      </h5>
                      <h5 className="text-[16px] font-biotif__Medium text-[#2E3234] mb-[3px] cursor-pointer">
                        <span
                          onClick={() =>
                            navigate(
                              setUrlParams(
                                PRIVATE_NAVIGATION.activities.detailPage,
                                previousActivity?.id
                              )
                            )
                          }
                        >
                          {previousActivity?.topic || ''}
                        </span>
                      </h5>
                      <div className="time flex flex-wrap items-center">
                        <Icon iconType="watchFilled" />
                        <span className="text-primaryColor text-[12px] font-biotif__Medium w-[calc(100%_-_25px)] pl-[2px]">
                          {previousActivity?.start_date ? (
                            <DateFormat
                              date={previousActivity?.start_date}
                              format="MMM dd, yyyy, hh:mm aa"
                            />
                          ) : (
                            ''
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="stay__touch__reminder__Box w-[360px] max-w-[33.3333%] px-[10px] mb-[20px] xl:w-1/2 xl:max-w-[50%] lg:w-full lg:max-w-full">
              <div className="inner__wrapper border border-whiteScreen__BorderColor rounded-[10px] py-[18px] px-[24px] h-full 3xl:py-[14px] 3xl:px-[15px]">
                <h3 className="text-[20px] font-biotif__Medium text-black__TextColor800 mb-[15px] relative pr-[35px] lg:mb-[10px]">
                  Upcoming
                  {isLoading || isScheduleActivityLoading ? (
                    <>
                      <div className="i__ButtonLoader i__ButtonLoader__ForLight mr-0 ml-[10px] inline-flex absolute top-[5px] right-0" />
                    </>
                  ) : (
                    <>
                      <button
                        className="text-primaryColor inline-flex items-center text-[14px] font-biotif__Medium absolute top-[5px] right-[-5px] z-[2] hover:underline"
                        type="button"
                        onClick={() => skipUpcomingDate()}
                      >
                        Skip
                      </button>
                    </>
                  )}
                </h3>
                <div className="contant__wrapper flex flex-wrap">
                  <div className="icon__wrapper w-[31px] h-[31px]">
                    {info?.activity_type?.icon_type === 'Default' ? (
                      <Icon className="" iconType={info?.activity_type?.icon} />
                    ) : (
                      <Image
                        imgPath={info?.activity_type?.icon || ''}
                        serverPath
                      />
                    )}
                  </div>
                  <div className="right__wrapper w-[calc(100%_-_32px)] pl-[10px] pt-[6px]">
                    <h5 className="text-[16px] font-biotif__Medium text-black__TextColor800 mb-[5px]">
                      {info?.activity_type?.name || ''}
                    </h5>
                    <h5 className="text-[16px] font-biotif__Medium text-black__TextColor800 mb-[3px]">
                      {activityName}
                    </h5>
                    <div className="time flex flex-wrap items-center">
                      <Icon iconType="watchFilled" />
                      <span className="text-primaryColor text-[12px] font-biotif__Medium w-[calc(100%_-_25px)] pl-[2px]">
                        {info?.start_date ? (
                          <DateFormat
                            date={info?.start_date}
                            format="MMM dd, yyyy, hh:mm aa"
                          />
                        ) : (
                          ''
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stay__touch__reminder__Box w-[360px] max-w-[33.3333%] px-[10px] mb-[20px] xl:w-1/2 xl:max-w-[50%] lg:w-full lg:max-w-full lg:mb-0">
              <div className="inner__wrapper border border-whiteScreen__BorderColor rounded-[10px] py-[18px] px-[24px] h-full 3xl:py-[14px] 3xl:px-[15px]">
                <h3 className="text-[20px] font-biotif__Medium text-black__TextColor800 mb-[15px] pr-[32px] relative lg:mb-[10px]">
                  Reminder Info
                  <button className="absolute top-0 right-[-9px] xl:top-[-1px]">
                    <Icon
                      onClick={() => setIsStayInTouchOpen(true)}
                      iconType="editFilled"
                      className="highlighted !w-[30px] !h-[30px] !p-[6px] !rounded-[7px] !bg-transparent hover:!bg-parentBgWhite__grayBtnBG"
                    />
                  </button>
                </h3>
                <div className="details__row flex flex-wrap mb-[10px] lg:mb-[5px]">
                  <span className='label w-[103px] text-[16px] font-biotif__Regular text-black__TextColor600 relative before:content-[":"] before:absolute before:top-0 before:right-0'>
                    Frequency
                  </span>
                  <span className="value w-[calc(100%_-_103px)] pl-[5px] text-[16px] font-biotif__Regular text-ipBlack__textColor">
                    {Capitalize(info?.frequency) || ''}
                  </span>
                </div>
                <div className="details__row flex flex-wrap mb-[10px] lg:mb-[2px]">
                  <span className='label w-[103px] text-[16px] font-biotif__Regular text-black__TextColor600 relative before:content-[":"] before:absolute before:top-0 before:right-0'>
                    Creation day
                  </span>

                  <span className="value w-[calc(100%_-_103px)] pl-[5px]  text-[16px] font-biotif__Regular text-ipBlack__textColor">
                    {getCreationDayText()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StayInTouchReminder;
