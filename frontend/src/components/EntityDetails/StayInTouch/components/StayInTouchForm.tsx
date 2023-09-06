// ** import packages **
import {
  Control,
  FieldErrors,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { format } from 'date-fns';

// ** components **
import FormField from 'components/FormField';

// ** types **
import { StayInTouchType } from '../types/stay-in-touch.type';
import { useGetActivityTypesOptions } from '../hook/useGetActivityTypesOptions';
import {
  MONTHS,
  WEEKDAYS,
  OCCURRENCE_ARRAY_FOR_MONTHS,
  MONTH_DAYS,
} from 'constant';
import TimePicker from 'components/CustomTimePicker/components/TimePicker';
import { generateCustomizeDate } from 'pages/Activity/helper/dateAndTime.helper';
import { useEffect, useRef } from 'react';
import { focusOnError } from 'helper';

interface PropsInterface {
  control: Control<StayInTouchType, any>;
  watch: UseFormWatch<StayInTouchType>;
  errors: FieldErrors<StayInTouchType>;
  activity_type?: {
    id: number;
    name: string;
  };
  setWeekDay: React.Dispatch<
    React.SetStateAction<{
      value: number | null;
      label: string;
    }>
  >;
  setSelectMonthDate: React.Dispatch<React.SetStateAction<number>>;
  setYearSelectMonth: React.Dispatch<React.SetStateAction<number>>;
  weekDay: {
    label: string;
    value: number | null;
  };
  setMonthDateType: React.Dispatch<
    React.SetStateAction<'each' | 'on_the' | null>
  >;
  monthDateType: 'each' | 'on_the' | null;
  register: UseFormRegister<StayInTouchType>;
  selectMonthDate: number;
  monthSelectYear: number;
  setError: UseFormSetError<StayInTouchType>;
  getValues: UseFormGetValues<StayInTouchType>;
  clearErrors: UseFormClearErrors<StayInTouchType>;
  setValue: UseFormSetValue<StayInTouchType>;
}

const StayInTouchForm = (props: PropsInterface) => {
  const {
    control,
    watch,
    errors,
    activity_type,
    setWeekDay,
    setSelectMonthDate,
    setYearSelectMonth,
    setMonthDateType,
    weekDay,
    monthDateType,
    register,
    selectMonthDate,
    monthSelectYear,
    clearErrors,
    getValues,
    setError,
    setValue,
  } = props;

  // ** custom hooks **
  const { getActivityTypesOptions, isActivityTypeLoading } =
    useGetActivityTypesOptions({});

  // ** watch **

  const frequency = watch('frequency');

  const scheduled_time = watch('scheduled_time');

  const onChange = (time: string) => {
    if (time) {
      if (time?.length < 8) {
        setError('scheduled_time', { message: 'Invalid Date' });
        return false;
      }
      clearErrors('scheduled_time');
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
        new Date(getValues('scheduled_time')),
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          hours,
          minutes
        )
      );

      if (scheduled_time === startDate?.toISOString()) {
        return startDate.toISOString();
      }

      setValue('scheduled_time', startDate.toISOString());

      return false;
    }

    clearErrors('scheduled_time');
    setValue('scheduled_time', '');
  };

  const errorDivRef = useRef<Record<string, HTMLDivElement | null>>({});
  useEffect(() => {
    focusOnError(errorDivRef, errors);
  }, [errors]);

  return (
    <>
      <div className="ip__Select relative z-[3]">
        <FormField<StayInTouchType>
          id="activity_type"
          placeholder="Select Connect Type"
          type="asyncSelect"
          name="activity_type"
          label="How to connect"
          labelClass="if__label__blue"
          error={errors.activity_type}
          getOptions={getActivityTypesOptions}
          defaultOptions={
            activity_type?.id
              ? [
                  {
                    label: activity_type?.name,
                    value: activity_type?.id,
                  },
                ]
              : []
          }
          required
          menuPosition="fixed"
          control={control}
          isLoading={isActivityTypeLoading}
          menuPlacement="auto"
        />
      </div>
      <label className="if__label if__label__blue block w-full mb-[10px]">
        How often
      </label>
      <div className="flex flex-wrap items-start mx-[-10px] mb-[20px]">
        <div className="frequency__wrapper w-[60%] px-[10px] flex flex-wrap items-center sm:w-full sm:mb-[10px]">
          <label className="inline-block mr-[10px] text-[16px] font-biotif__Medium text-[#A9A9A9] leading-[22px]">
            Frequency
          </label>
          <div className="w-[calc(100%_-_88px)]">
            <FormField<StayInTouchType>
              id="frequency"
              wrapperClass="mb-0"
              placeholder="Select Frequency"
              type="select"
              required
              name="frequency"
              labelClass="if__label__blue"
              control={control}
              options={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'yearly', label: 'Yearly' },
              ]}
              menuPlacement="auto"
              menuPosition="fixed"
            />{' '}
          </div>
          <div
            className="ip__Error w-full"
            ref={(element) => (errorDivRef.current.frequency = element)}
          >
            {errors.frequency?.message}
          </div>
        </div>
        <div className="everyDays__wrapper w-[40%] px-[10px] flex flex-wrap items-center sm:w-full">
          <label className="inline-block mr-[10px] text-[16px] font-biotif__Medium text-[#A9A9A9] leading-[22px] sm:w-[77px]">
            Every
          </label>
          <div className="w-[114px] max-w-[calc(100%_-_53px)] sm:w-[calc(100%_-_88px)]">
            <FormField<StayInTouchType>
              name="interval"
              wrapperClass="mb-0"
              type="number"
              register={register}
              min={1}
              max={364}
              fieldLimit={3}
              placeholder="EX: 1"
              labelClass="if__label__blue"
            />
          </div>
          <div
            className="ip__Error w-full"
            ref={(element) => (errorDivRef.current.interval = element)}
          >
            {errors.interval?.message}
          </div>
        </div>
      </div>
      {frequency === 'weekly' ? (
        <>
          <label className="if__label if__label__blue block w-full mb-[10px]">
            Repeat on
          </label>
          <div className="week__wrapper mb-[20px]">
            {WEEKDAYS.map((item) => {
              return (
                <FormField
                  key={window.crypto.randomUUID()}
                  type="radio"
                  name={item.label}
                  checked={item.value === weekDay.value}
                  value={item.value}
                  label={item.label}
                  onChange={(e) =>
                    setWeekDay({
                      label:
                        WEEKDAYS.find(
                          (val) => val.value === Number(e.target.value)
                        )?.label || '',
                      value: Number(e.target.value),
                    })
                  }
                />
              );
            })}
          </div>
        </>
      ) : (
        <></>
      )}
      {frequency === 'monthly' ? (
        <>
          <div className="rounded__radio">
            <FormField
              type="radio"
              name="each"
              label="Each"
              checked={monthDateType === 'each'}
              value="each"
              onChange={(e) =>
                setMonthDateType(e.target.value as 'each' | 'on_the')
              }
            />
          </div>
          <div
            className={`month__wrapper mb-[20px] ${
              monthDateType !== 'each' ? 'pointer-events-none disabled' : ''
            } `}
          >
            {MONTH_DAYS.map((item) => {
              return (
                <div
                  className={`month__box ${
                    selectMonthDate === item ? 'active' : ''
                  } `}
                  key={window.crypto.randomUUID()}
                >
                  <span
                    onClick={() => setSelectMonthDate(item)}
                    className="cursor-pointer text"
                  >
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="rounded__radio">
            <FormField
              wrapperClass="mb-0"
              type="radio"
              name="on_the"
              label="On the"
              checked={monthDateType === 'on_the'}
              value="on_the"
              onChange={(e) =>
                setMonthDateType(e.target.value as 'each' | 'on_the')
              }
            />
          </div>
          <div
            className={`${
              monthDateType !== 'on_the' ? 'pointer-events-none disabled' : ''
            } `}
          >
            <div className="on__the__select flex flex-wrap mx-[-10px] mb-[20px]">
              <div className="w-[125px] max-w-[50%] px-[10px]">
                <FormField
                  wrapperClass="mb-0"
                  id="week_occurrence"
                  placeholder="Select Week Occurrence"
                  type="select"
                  name="week_occurrence"
                  labelClass="if__label__blue"
                  control={control}
                  options={OCCURRENCE_ARRAY_FOR_MONTHS}
                  menuPlacement="auto"
                  menuPosition="fixed"
                />
              </div>
              <div className="w-[125px] max-w-[50%] px-[10px]">
                <FormField
                  wrapperClass="mb-0"
                  id="week_day"
                  placeholder="Select Week Day"
                  type="select"
                  name="week_day"
                  labelClass="if__label__blue"
                  control={control}
                  options={WEEKDAYS}
                  menuPosition="fixed"
                  menuPlacement="auto"
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      {frequency === 'yearly' ? (
        <>
          <div className="year__wrapper mb-[15px]">
            {MONTHS.map((item) => {
              return (
                <div
                  onClick={() => setYearSelectMonth(item.val)}
                  key={window.crypto.randomUUID()}
                  className={`year__box cursor-pointer ${
                    monthSelectYear === item.val ? 'active' : ''
                  }`}
                >
                  {item.label}
                </div>
              );
            })}
          </div>
          <div className="rounded__radio">
            <FormField
              type="checkbox"
              name="on_the"
              label="On the"
              checked={monthDateType === 'on_the'}
              value="on_the"
              onChange={(e) =>
                setMonthDateType(e.target.value as 'each' | 'on_the')
              }
            />
          </div>
          <div
            className={`${
              monthDateType !== 'on_the' ? 'pointer-events-none disabled' : ''
            } `}
          >
            <div className="on__the__select flex flex-wrap mx-[-10px] mb-[20px]">
              <div className="w-[125px] max-w-[50%] px-[10px]">
                <FormField
                  wrapperClass="mb-0"
                  id="week_occurrence"
                  placeholder="Select Week Occurrence"
                  type="select"
                  name="week_occurrence"
                  labelClass="if__label__blue"
                  control={control}
                  options={OCCURRENCE_ARRAY_FOR_MONTHS}
                  menuPlacement="auto"
                  menuPosition="fixed"
                />
              </div>
              <div className="w-[125px] max-w-[50%] px-[10px]">
                <FormField
                  wrapperClass="mb-0"
                  id="week_day"
                  placeholder="Select Week Day"
                  type="select"
                  name="week_day"
                  labelClass="if__label__blue"
                  control={control}
                  options={WEEKDAYS}
                  menuPosition="fixed"
                  menuPlacement="auto"
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

      <label className="if__label if__label__blue block w-full mb-[10px]">
        Start Time
      </label>
      <div
        className={`time__input__wrapper relative ${
          errors?.scheduled_time ? 'error__active' : ''
        }`}
      >
        <TimePicker
          key={scheduled_time}
          use12Hours
          onChange={onChange}
          value={
            scheduled_time ? format(new Date(scheduled_time), 'hh:mm aa') : ''
          }
          separator
        />
      </div>
    </>
  );
};

export default StayInTouchForm;
