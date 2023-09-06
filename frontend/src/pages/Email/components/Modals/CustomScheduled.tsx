// ** import packages **
import { CalendarComponent } from '@syncfusion/ej2-react-calendars';
import { addDays, format, isValid } from 'date-fns';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import getHours from 'date-fns/getHours';
import getMinutes from 'date-fns/getMinutes';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import { useEffect, useState } from 'react';
import {
  Control,
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

// ** components **
import TimePicker from 'components/CustomTimePicker/components/TimePicker';
import FormField from 'components/FormField';

// ** type **
import { EmailComposerFieldType } from 'pages/Email/types/email.type';

// ** Util **
import { dateToMilliseconds, isValidDate } from 'utils/util';

interface Props {
  setError: UseFormSetError<EmailComposerFieldType>;
  setValue: UseFormSetValue<EmailComposerFieldType>;
  clearErrors: UseFormClearErrors<EmailComposerFieldType>;
  watch: UseFormWatch<EmailComposerFieldType>;
  errors: FieldErrors<EmailComposerFieldType>;
  control: Control<EmailComposerFieldType>;
  register: UseFormRegister<EmailComposerFieldType>;
  editScheduleTime?: Date;
}

const CustomScheduled = (props: Props) => {
  const {
    setValue,
    control,
    register,
    watch,
    errors,
    setError,
    clearErrors,
    editScheduleTime,
  } = props;
  const scheduleDate = watch('schedule_date');
  const scheduleTime = watch('schedule_time');

  const [currentDateState, setCurrentDateState] = useState(
    editScheduleTime || new Date(Date.now() + 5 * 60 * 1000)
  );

  useEffect(() => {
    const schedule_date_valid = isValid(new Date(scheduleDate || ''));

    if (!schedule_date_valid) {
      setError('schedule_date', { message: `Invalid date` });
    } else {
      clearErrors('schedule_date');
    }

    if (schedule_date_valid && scheduleDate) {
      const date1 = new Date(new Date(scheduleDate));

      if (addDays(date1, 1).getTime() < new Date().getTime()) {
        setError('schedule_date', { message: `You can't select past date` });
      } else {
        clearErrors('schedule_date');
      }
    }
  }, [scheduleDate]);

  useEffect(() => {
    if (currentDateState) {
      const scheduleDuration = dateToMilliseconds({
        endDate: new Date(currentDateState),
      });
      setValue('scheduled_after', scheduleDuration);
    }
  }, [currentDateState]);

  const checkDateFormat = (val: Date) => {
    if (isValid(new Date(val))) {
      const date = format(val, 'dd, MMM yyyy');
      setValue('schedule_date', date);
      const hrs = getHours(val) !== 0 ? getHours(val) : new Date().getHours();
      const min =
        getMinutes(val) !== 0 ? getMinutes(val) : new Date().getMinutes();

      setCurrentDateState(new Date(val.setHours(hrs, min, 0, 0)));
      setValue('schedule_time', `${hrs}:${min}`);
    }
  };

  const setDateToCalendar = (schedule_date: string | undefined) => {
    if (!schedule_date) {
      setError('schedule_date', { message: `Date is required` });
    }
  };

  const onChange = (time: string) => {
    if (time) {
      let hours = 0;
      const separateTime = time?.split(':');
      const selectedHours = parseInt(separateTime[0], 10);
      const minutes = parseInt(separateTime[1]?.split(' ')[0], 10);
      const hourFormat = separateTime[1]?.split(' ')[1]?.toUpperCase();
      const isAnteMeridiem = hourFormat === 'AM';
      const isPostMeridiem = hourFormat === 'PM';
      const isMoreThen12Hours = selectedHours === 12 && minutes >= 0;

      if (selectedHours <= 0) {
        setError('schedule_time', { message: 'Invalid time' });
        return false;
      }

      if (isPostMeridiem && isMoreThen12Hours) {
        hours = 12;
      } else {
        hours = isPostMeridiem ? selectedHours + 12 : selectedHours;
      }

      if (hours > 23 || minutes > 59 || !(isPostMeridiem || isAnteMeridiem)) {
        setError('schedule_time', { message: 'Invalid time' });
        return false;
      }
      clearErrors('schedule_time');

      if (isPostMeridiem && isMoreThen12Hours) {
        hours = 12;
      } else if (isAnteMeridiem && isMoreThen12Hours) {
        hours = 0;
      } else {
        hours = isPostMeridiem ? selectedHours + 12 : selectedHours;
      }
      setValue('schedule_time', `${hours}:${minutes}`);

      if (isValidDate(watch('schedule_date'))) {
        const currentDate = setHours(
          setMinutes(
            new Date(watch('schedule_date') || currentDateState),
            minutes
          ),
          hours
        );
        const durationDiff = differenceInMinutes(currentDate, new Date());
        setCurrentDateState(currentDate);
        if (hours > 23 || minutes > 59) {
          setError('schedule_time', { message: 'Enter valid Time' });
        }
        if (durationDiff >= 5) {
          clearErrors('schedule_time');
        }
      }
      return false;
    }
    setError('schedule_time', { message: `Time is required` });
  };

  return (
    <>
      <h3 className="text-[16px] text-ipBlack__textColor font-biotif__Medium mb-[15px]">
        Pick Date & Time
      </h3>
      <div className="flex">
        <CalendarComponent
          min={new Date()}
          change={(e: any) => {
            if (isValid(new Date(e.value))) {
              checkDateFormat(e.value);
            }
          }}
          showTodayButton={false}
          id="calendar"
          value={currentDateState}
        />
        <div className="ml-[20px]">
          <FormField<EmailComposerFieldType>
            required
            type="text"
            label="Date"
            name="schedule_date"
            placeholder="EX. MM/DD/YYYY"
            register={register}
            control={control}
            error={errors.schedule_date}
            onBlur={(e) => {
              setDateToCalendar(scheduleDate);
              checkDateFormat(new Date(e.target.value));
            }}
          />
          <div className="mb-[20px] md:mb-[10px] sm:mb-[5px]">
            <TimePicker
              key={scheduleTime}
              use12Hours
              onChange={onChange}
              value={format(new Date(currentDateState), 'hh:mm aa')}
              separator={false}
            />
            {errors.schedule_time && (
              <p className="ip__Error">{errors.schedule_time.message}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomScheduled;
