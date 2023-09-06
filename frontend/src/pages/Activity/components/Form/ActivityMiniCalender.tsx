// ** Import Packages ** //
import { Dispatch, RefObject, SetStateAction, useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { differenceInMinutes } from 'date-fns';
import {
  Day,
  DragAndDrop,
  DragEventArgs,
  Inject,
  NavigatingEventArgs,
  PopupOpenEventArgs,
  Resize,
  ResizeEventArgs,
  ScheduleComponent,
  ViewDirective,
  ViewsDirective,
} from '@syncfusion/ej2-react-schedule';

// ** Components ** //
import { DayViewEventTemplate } from './DayViewEventTemplate';

// ** Others ** //
import {
  AddActivityFormFields,
  activityTypeResponse,
  miniCalenderDataType,
} from 'pages/Activity/types/activity.types';
import { generateCustomizeDate } from 'pages/Activity/helper/dateAndTime.helper';

type ActivityMiniCalenderPropsType = {
  schedularRef: RefObject<ScheduleComponent>;
  changeSchedulerDataSourceOnNavigation: (
    {
      startDate,
      endGapDate,
    }: {
      startDate: Date;
      endGapDate: Date;
    },
    IsAllDay: boolean
  ) => void;
  setMiniCalenderData: Dispatch<SetStateAction<miniCalenderDataType>>;
  currentActivityType?: activityTypeResponse;
  activityId?: number;
  miniCalenderData: miniCalenderDataType;
  readOnlyActivityData: miniCalenderDataType[];
  getReadOnlyActivities: (
    date: Date,
    activityId?: number | undefined
  ) => Promise<void>;
  toggleCalender: boolean;
  setToggleCalender: Dispatch<SetStateAction<boolean>>;
};

const ActivityMiniCalender = (props: ActivityMiniCalenderPropsType) => {
  const {
    changeSchedulerDataSourceOnNavigation,
    schedularRef,
    setMiniCalenderData,
    currentActivityType,
    getReadOnlyActivities,
    miniCalenderData,
    readOnlyActivityData,
    setToggleCalender,
    toggleCalender,
    activityId,
  } = props;
  const DayTemplate = useCallback(
    (args: miniCalenderDataType) => <DayViewEventTemplate {...args} />,
    []
  );
  const { setValue, getValues, control } =
    useFormContext<AddActivityFormFields>();

  const useWatchData = useWatch({
    control,
  });

  // ** constants ** //
  const activityTypeWatch = useWatchData.activity_type;

  const popUpOpenEvent = (args: PopupOpenEventArgs) => {
    args.cancel = true;

    if (schedularRef.current && args.data) {
      const EndTimeDate = generateCustomizeDate(
        args.data.StartTime,
        args.data.StartTime,
        getValues('duration')
      );
      setMiniCalenderData({
        Id: 1,
        Subject: getValues('topic') || activityTypeWatch || 'Activity',
        StartTime: args.data.StartTime,
        EndTime: EndTimeDate,
        ActivityIcon: currentActivityType?.icon || '',
        icon_type: currentActivityType?.icon_type || '',
        IsAllDay: false,
        isReadonly: false,
      });

      setValue('start_date', new Date(args.data.StartTime).toISOString());
      setValue('start_time', new Date(args.data.StartTime).toISOString());
      setValue(
        'duration',
        differenceInMinutes(EndTimeDate, args.data.StartTime)
      );
    }
  };

  const onSchedulerNavigation = (nav: NavigatingEventArgs) => {
    if (nav?.currentDate) {
      if (getValues('start_time')) {
        const startDate = generateCustomizeDate(
          nav.currentDate,
          new Date(getValues('start_time'))
        );
        const endGapDate = generateCustomizeDate(
          startDate,
          startDate,
          getValues('duration')
        );
        setValue('start_date', startDate.toISOString());
        setValue('start_time', startDate.toISOString());
        changeSchedulerDataSourceOnNavigation({ endGapDate, startDate }, false);
      } else {
        changeSchedulerDataSourceOnNavigation(
          { startDate: nav.currentDate, endGapDate: nav.currentDate },
          true
        );
        setValue('start_date', nav?.currentDate?.toISOString());
      }

      getReadOnlyActivities(nav.currentDate, activityId);
    }
  };

  const resizeAndDragStopEvent = (args: DragEventArgs | ResizeEventArgs) => {
    const { data } = args;
    if (data.StartTime && data.EndTime) {
      setValue('start_date', new Date(data.StartTime).toISOString());
      setValue('start_time', new Date(data.StartTime).toISOString());
      setValue('duration', differenceInMinutes(data.EndTime, data.StartTime));
    }
  };

  return (
    <>
      <div
        className={`right w-[332px] h-[calc(100dvh_-_310px)] md:w-[50%] sm:w-full ${
          toggleCalender ? 'show' : ''
        }`}
      >
        <h3 className="calendar__title text-[18px] font-biotif__Medium leading-[24px]">
          <div
            onClick={() => setToggleCalender(false)}
            className='backBtn cursor-pointer w-[20px] h-[15px] bg-red relative top-[1px] hidden sm:inline-block after:content-[""] after:absolute after:top-[4px] after:left-0 after:w-[8px] after:h-[8px] after:border-l-[2px] after:border-l-ipBlack__borderColor after:border-b-[2px] after:border-b-ipBlack__borderColor after:rotate-45 before:content-[""] before:absolute before:top-[7px] before:left-[0px] before:w-[12px] before:bg-ipBlack__bgColor before:h-[2px]'
          />{' '}
          Calendar
        </h3>
        <ScheduleComponent
          rowAutoHeight
          showTimeIndicator
          enableAllDayScroll
          ref={schedularRef}
          timezone={Intl.DateTimeFormat().resolvedOptions().timeZone}
          eventSettings={{
            dataSource: [miniCalenderData, ...readOnlyActivityData],
            fields: {
              isReadonly: 'isReadonly',
            },
          }}
          height="100%"
          dateFormat="ddd MMM yyyy"
          popupOpen={popUpOpenEvent}
          navigating={onSchedulerNavigation}
          resizeStart={(resizeArgs: ResizeEventArgs) => {
            resizeArgs.interval = 15;
          }}
          dragStart={(dragStartArgs: DragEventArgs) =>
            (dragStartArgs.interval = 15)
          }
          resizeStop={(resizeStopArgs: ResizeEventArgs) => {
            resizeAndDragStopEvent(resizeStopArgs);
          }}
          dragStop={(dragStopArgs: DragEventArgs) => {
            resizeAndDragStopEvent(dragStopArgs);
          }}
          currentView="Day"
        >
          <ViewsDirective>
            <ViewDirective option="Day" eventTemplate={DayTemplate} />
          </ViewsDirective>
          <Inject services={[Day, DragAndDrop, Resize]} />
        </ScheduleComponent>
      </div>
    </>
  );
};

export default ActivityMiniCalender;
