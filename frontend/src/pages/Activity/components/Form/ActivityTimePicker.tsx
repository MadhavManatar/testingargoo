// ** Import Packages ** //
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { format } from 'date-fns-tz';

// ** Components ** //
import TimePicker from 'components/CustomTimePicker/components/TimePicker';
import Icon from 'components/Icon';

// ** Others ** //
import { generateCustomizeDate } from 'pages/Activity/helper/dateAndTime.helper';
import {
  AddActivityFormFields,
  miniCalenderDataType,
} from 'pages/Activity/types/activity.types';

type ActivityTimePickerPropsType = {
  changeActivityTypeEvent: ({ topic }: { topic?: string }) => void;
  changeSchedulerDataSourceOnNavigation: (
    {
      startDate,
      endGapDate,
      isStartTimeUpdated,
    }: {
      startDate: Date;
      endGapDate: Date;
      isStartTimeUpdated?: boolean;
    },
    IsAllDay: boolean
  ) => void;
  setMiniCalenderData: Dispatch<SetStateAction<miniCalenderDataType>>;
};

const ActivityTimePicker = (props: ActivityTimePickerPropsType) => {
  const {
    changeActivityTypeEvent,
    changeSchedulerDataSourceOnNavigation,
    setMiniCalenderData,
  } = props;

  const {
    control,
    formState: { errors },
    setValue,
    getValues,
    setError,
    clearErrors,
  } = useFormContext<AddActivityFormFields>();

  const useWatchData = useWatch({
    control,
  });

  const startTimeWatch = useWatchData.start_time || '';
  const all_day = useWatchData.all_day || false;
  const [anyTimeEnable, setAnyTimeEnable] = useState<boolean>(all_day);
  useMemo(() => {
    if (!all_day) {
      setAnyTimeEnable(!startTimeWatch);
    }
  }, [startTimeWatch]);

  useEffect(() => {
    if (anyTimeEnable) {
      setValue('start_time', '');
      changeActivityTypeEvent({});
    }
    if (!startTimeWatch && !anyTimeEnable) {
      setValue('start_time', new Date().toISOString());
    }
  }, [anyTimeEnable]);

  const timePickerOnChange = (time: string) => {
    if (time) {
      if (time?.length < 8) {
        setError('start_time', { message: 'Invalid Date' });
        return false;
      }
      clearErrors('start_time');
      const separateTime = time?.split(':');
      const minutes = parseInt(separateTime[1]?.split(' ')[0], 10);
      const hourFormat = separateTime[1]?.split(' ')[1]?.toUpperCase();
      let hours = parseInt(separateTime[0], 10);
      if (hours === 12) {
        hours = 0;
      }

      if (hourFormat === 'PM') {
        hours += 12;
      }

      const startDate = generateCustomizeDate(
        new Date(getValues('start_date')),
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          hours,
          minutes
        )
      );

      if (getValues('start_time') === startDate.toISOString()) {
        return startDate.toISOString();
      }
      const endGapDate = generateCustomizeDate(
        startDate,
        startDate,
        getValues('duration')
      );
      setValue('start_time', startDate.toISOString());

      changeSchedulerDataSourceOnNavigation(
        { startDate, endGapDate, isStartTimeUpdated: true },
        false
      );
      return false;
    }

    setMiniCalenderData((prev) => ({
      ...prev,
      IsAllDay: true,
    }));
    clearErrors('start_time');
    setValue('start_time', '');
  };

  return (
    <>
      <div className="w-[180px] pr-[10px] md:w-full md:pr-0 md:mb-[12px] sm:w-[calc(50%_-_6px)] sm:ml-[6px] sm:mb-[15px]">
        <label className="if__label if__label__blue flex flex-wrap opacity-0 md:hidden sm:flex">
          <Icon className="mr-[5px]" iconType="watchFilled" />
          Start
        </label>
        <div className="mb-[20px] md:mb-[10px] sm:mb-[5px]">
          <TimePicker
            anyTimeEnable={anyTimeEnable}
            setAnyTimeEnable={setAnyTimeEnable}
            use12Hours
            onChange={timePickerOnChange}
            value={
              startTimeWatch ? format(new Date(startTimeWatch), 'hh:mm aa') : ''
            }
            separator={false}
          />

          {errors.start_time && (
            <p className="ip__Error">{errors.start_time.message}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ActivityTimePicker;
