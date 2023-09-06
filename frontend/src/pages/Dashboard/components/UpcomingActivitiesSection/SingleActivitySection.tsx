// ** Import Packages **
import { useEffect, useState } from 'react';

// ** Components **
import Icon from 'components/Icon';
import Image from 'components/Image';
import ActivityActionComponent from '../ActivityActionComponent';

// ** Type **
import { SingleActivitySectionProps } from './types/index.types';

// ** Util **
import { setUrlParams } from 'utils/util';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { useNavigate } from 'react-router-dom';
import format from 'date-fns-tz/format';

const SingleActivitySection = (props: SingleActivitySectionProps) => {
  const {
    activity,
    aIndex,
    setOpenModal,
    row,
    handleActivityClick,
    permissionArray,
  } = props;

  const navigate = useNavigate();

  const [isActivityDue, setIsActivityDue] = useState<{
    [x: number]: boolean;
  }>();

  useEffect(() => {
    if (activity) {
      setIsActivityDue({
        [activity.id]:
          new Date(activity.end_date).getTime() < new Date().getTime(),
      });
    }
  }, [activity]);

  const intervalId = setInterval(() => {
    const activityIsDue =
      new Date(activity.end_date).getTime() < new Date().getTime();
    if (activityIsDue !== isActivityDue?.[activity.id]) {
      setIsActivityDue((prev) => ({ ...prev, [activity.id]: activityIsDue }));
    }
  }, 60 * 1000);

  if (isActivityDue?.[activity.id]) {
    clearInterval(intervalId);
  }

  const showMarkAsDone = () => {
    if (activity.completed_by) {
      return (
        <div className="inline-flex marked__done__sign justify-end items-center absolute top-0 right-[5px] sm:hidden">
          <span className="inline-block text-[16px] font-biotif__Regular text-[#7C7C7C] mr-[7px]">
            Done
          </span>
          <div className='w-[19px] h-[19px] rounded-full bg-[#219653] relative before:content-[""] before:absolute before:top-[6px] before:left-[5px] before:w-[9px] before:h-[5px] before:border-l-[2px] before:border-l-white before:border-b-[2px] before:border-b-white before:-rotate-45' />
        </div>
      );
    }
    if (isActivityDue?.[activity.id]) {
      return (
        <div className="inline-flex due__sign justify-end items-center absolute top-[50%] translate-y-[-50%] right-[5px] sm:hidden">
          <span className="inline-block text-[16px] font-biotif__Regular text-ip__Red mr-[7px]">
            Due
          </span>
          <Icon className="!p-0 w-[19px] h-[19px]" iconType="dueFilledIcon" />
        </div>
      );
    }

    return (
      <div className="inline-flex due__sign justify-end items-center absolute top-[50%] translate-y-[-50%] right-[5px] sm:hidden" />
    );
  };

  const showMarkAsDoneResponsive = () => {
    if (activity.completed_by) {
      return (
        <div className="hidden marked__done__sign justify-end items-center sm:inline-flex sm:mt-[8px]">
          <div className='w-[19px] h-[19px] rounded-full bg-[#219653] relative before:content-[""] before:absolute before:top-[6px] before:left-[5px] before:w-[9px] before:h-[5px] before:border-l-[2px] before:border-l-white before:border-b-[2px] before:border-b-white before:-rotate-45' />
          <span className="inline-block relative top-[1px] text-[16px] font-biotif__Regular text-[#7C7C7C] ml-[7px]">
            Done
          </span>
        </div>
      );
    }
    if (activity?.is_activity_pass) {
      return (
        <div className="hidden due__sign justify-end items-center sm:inline-flex sm:mt-[8px]">
          <Icon className="!p-0 w-[19px] h-[19px]" iconType="dueFilledIcon" />
          <span className="inline-block relative top-[1px] text-[16px] font-biotif__Regular text-[#FF4F3C] ml-[7px]">
            Due
          </span>
        </div>
      );
    }

    return (
      <div className="hidden due__sign justify-end items-center sm:inline-flex sm:mt-[8px]" />
    );
  };

  const wrapperClass = activity.completed_by
    ? 'up__ac__item__done'
    : isActivityDue?.[activity.id]
    ? 'up__ac__item__due'
    : 'up__ac__item__upcoming';

  return (
    <div
      key={aIndex}
      className={`up__ac__item flex flex-wrap items-center mb-[8px] bg-ipWhite__bgColor rounded-[10px] p-[15px] ${wrapperClass}`}
    >
      <div className="cn__text flex flex-wrap items-center w-[calc(100%_-_30px)]">
        {activity?.activity_type?.icon_type === 'Custom' ? (
          <>
            <Image serverPath imgPath={activity?.activity_type?.icon} />
          </>
        ) : (
          <Icon
            className="w-[28px] h-[28px] relative top-[-2px] rounded-[5px] bg-primaryColor"
            iconType={activity?.activity_type?.icon}
          />
        )}
        <div
          className={`contant__center w-[calc(100%_-_30px)] flex flex-wrap items-center pl-[10px] text-[16px] text-black font-biotif__Regular relative
                      ${
                        isActivityDue
                          ? 'pr-[73px] sm:pr-[5px]'
                          : 'pr-[70px] sm:pr-[5px]'
                      }
                      `}
        >
          <div className="time w-full relative text-black__TextColor800 text-[12px] font-biotif__Medium pl-[15px] mb-[3px] before:content-[''] before:w-[9px] before:h-[9px] before:rounded-full before:absolute before:top-[3px] before:left-[0px]">
            <span className="">
              {activity?.all_day
                ? 'All Day'
                : activity?.start_date &&
                  format(new Date(activity?.start_date), 'h:mm')}
              {' - '}
              {activity?.all_day
                ? ` ${activity?.duration} Min`
                : activity?.end_date &&
                  format(new Date(activity?.end_date), 'h:mm aa')}
            </span>
          </div>
          <span className="text-[16px] font-biotif__Regular text-black__TextColor800 leading-normal whitespace-pre overflow-hidden text-ellipsis">
            <span
              onClick={() => {
                setOpenModal({
                  add: false,
                  edit: false,
                  complete: false,
                  id: activity?.id,
                  activityTypeId: activity?.activity_type?.id,
                  activityTopic: activity?.topic,
                  view: true,
                });
              }}
              className="cursor-pointer hover:text-primaryColorSD hover:underline"
            >
              {activity?.topic || ''}
            </span>
            <span className="text-[#333333]/50">
              {activity?.activity_contact?.name ? ' with ' : ''}
            </span>
            {activity?.activity_contact?.name ? (
              <span
                onClick={() => {
                  if (activity?.activity_contact?.id) {
                    navigate(
                      setUrlParams(
                        PRIVATE_NAVIGATION.contacts.detailPage,
                        activity?.activity_contact?.id
                      )
                    );
                  }
                }}
                className="cursor-pointer hover:text-primaryColorSD hover:underline"
              >
                {activity?.activity_contact?.name}
              </span>
            ) : null}
          </span>
          {showMarkAsDone()}
        </div>
      </div>
      <div className="toggle__wrapper relative">
        <button
          className="toggleBtn"
          type="button"
          onClick={() => handleActivityClick(activity)}
        >
          <Icon
            className="toggle__btn relative cursor-pointer w-[28px] h-[28px] duration-500 hover:bg-parentBgWhite__grayBtnBG rounded-[6px] p-[7px]"
            iconType="toggle3dotsIcon"
          />
        </button>
        <div
          className={`add__dropdown__menu  ${
            row === activity.id ? '' : 'hidden'
          }  absolute top-[calc(100%_-_4px)] right-[0px] pt-[5px] z-[4]`}
        >
          <div className="inner__wrapper bg-ipWhite__bgColor min-w-[150px] relative rounded-[10px]">
            <div>
              {permissionArray.length > 0 &&
                (permissionArray || []).map(
                  (val: { label: string; onClick: () => void }) => {
                    return (
                      <div
                        key={window.self.crypto.randomUUID()}
                        className="item"
                        onClick={val.onClick}
                      >
                        <div className="flex items-center relative z-[2] cursor-pointer">
                          <span className="text whitespace-pre text-[14px] font-biotif__Medium inline-block ml-[2px] text-ipBlack__textColor">
                            {val.label}
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden">
        <ActivityActionComponent
          handleActivityClick={handleActivityClick}
          permissionArray={permissionArray}
          aVal={activity}
        />
      </div>
      {showMarkAsDoneResponsive()}
    </div>
  );
};

export default SingleActivitySection;
