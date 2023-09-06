// ** import packages **
import { useForm } from 'react-hook-form';
import { format, formatISO } from 'date-fns';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';

// ** components **
import Modal from 'components/Modal';
import ScheduleActivityForm from './StayInTouchForm';

// ** validation schema **
import { stayInTouchSchema } from '../validation-schema/stay-in-touch.schema';

// ** types **
import {
  scheduleActivityResponse,
  StayInTouchType,
} from '../types/stay-in-touch.type';

// ** others **
import { POLYMORPHIC_MODELS } from 'constant/permissions.constant';
import { getNextActivityDate } from '../helper';
import { WEEKDAYS } from 'constant';
import { utcToZonedTime } from 'date-fns-tz';
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'redux/slices/authSlice';
import {
  useScheduleActivityMutation,
  useUpdateScheduleActivityByIdMutation,
} from 'redux/api/stayInTouchApi';

interface PropsInterface {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  model_record_id: number;
  scheduleActivityData?: scheduleActivityResponse;
  getScheduleActivity: (id: number) => Promise<void>;
  model_name: POLYMORPHIC_MODELS;
}

const AddStayInTouchModal = (props: PropsInterface) => {
  const {
    isOpen,
    setIsOpen,
    model_record_id,
    scheduleActivityData,
    getScheduleActivity,
    model_name,
  } = props;

  // ** APIS **
  const [scheduleActivityAPI, { isLoading }] = useScheduleActivityMutation();
  const [updateScheduleActivityByIdAPI, { isLoading: updateLoading }] =
    useUpdateScheduleActivityByIdMutation();

  const currentUser = useSelector(getCurrentUser);

  const formMethods = useForm<StayInTouchType>({
    resolver: yupResolver(stayInTouchSchema),
  });

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
    register,
    setError,
    getValues,
    clearErrors,
    setValue,
  } = formMethods;

  // ** states **
  const [weekDay, setWeekDay] = useState<{
    label: string;
    value: number | null;
  }>({
    label: '',
    value: null,
  });
  const [selectMonthDate, setSelectMonthDate] = useState<number>(1);
  const [monthSelectYear, setYearSelectMonth] = useState<number>(1);
  const [monthDateType, setMonthDateType] = useState<'each' | 'on_the' | null>(
    'each'
  );
  const week_day_for_week = weekDay.value;

  // ** watch **
  const interval = Number(watch('interval'));
  const week_day = watch('week_day');
  const week_occur = watch('week_occurrence');

  useEffect(() => {
    reset({
      scheduled_time:
        scheduleActivityData?.start_date || new Date().toISOString(),
      activity_type: scheduleActivityData?.activity_type_id,
      frequency: scheduleActivityData?.frequency || '',
      interval: scheduleActivityData?.interval,
      week_occurrence: scheduleActivityData?.week_occurrence || 1,
      week_day: new Date(
        scheduleActivityData?.start_date || new Date().toISOString()
      ).getDay(),
    });

    setSelectMonthDate(
      new Date(
        scheduleActivityData?.start_date || new Date().toISOString()
      ).getDate()
    );

    setYearSelectMonth(
      new Date(
        scheduleActivityData?.start_date || new Date().toISOString()
      ).getMonth()
    );

    setWeekDay({
      label:
        WEEKDAYS.find(
          (val) =>
            val.value ===
            new Date(
              scheduleActivityData?.start_date || new Date().toISOString()
            ).getDay()
        )?.label || '',
      value: new Date(
        scheduleActivityData?.start_date || new Date().toISOString()
      ).getDay(),
    });

    setMonthDateType(
      (scheduleActivityData?.month_date_type as 'each' | 'on_the' | null) ||
        'each'
    );
  }, []);

  const onSubmit = handleSubmit(async (formValue) => {
    const creation_date = getNextActivityDate({
      freq: formValue.frequency,
      interval,
      monthDateType,
      monthSelectYear,
      selectMonthDate,
      week_day,
      week_day_for_week,
      week_occur,
      date: new Date(),
    });

    const updated_creation_date = format(
      utcToZonedTime(
        new Date(creation_date || ''),
        currentUser?.timezone || 'Etc/GMT-4'
      ),
      'dd_MM_yyyy'
    );

    const formatScheduleTime = format(
      new Date(formValue.scheduled_time),
      'HH:mm'
    );

    const scheduledTimeHour = Number(formatScheduleTime.split(':')[0]);
    const scheduledTimeMinute = Number(formatScheduleTime.split(':')[1]);

    const start_date = creation_date
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
      modal_record_id: model_record_id,
      model_name,
      activity_type_id: formValue.activity_type,
      start_date: utcToZonedTime(
        new Date(start_date || ''),
        currentUser?.timezone || 'Etc/GMT-4'
      ),
      creation_date: updated_creation_date,
      frequency: formValue.frequency,
      month_date_type: monthDateType,
      interval: formValue.interval,
      week_occurrence:
        monthDateType === 'on_the' ? formValue.week_occurrence : null,
    };

    if (scheduleActivityData?.id) {
      const data = await updateScheduleActivityByIdAPI({
        id: scheduleActivityData?.id,
        data: bodyObj,
      });
      if ('data' in data) {
        getScheduleActivity(model_record_id);
        close();
      }
    } else {
      const data = await scheduleActivityAPI({ data: bodyObj });
      if ('data' in data) {
        getScheduleActivity(model_record_id);
        close();
      }
    }
  });

  const close = () => {
    setIsOpen(false);
    reset();
  };

  return (
    <Modal
      modalWrapperClass="stayinTouch__modal"
      title="Stay in Touch"
      visible={isOpen}
      onClose={() => close()}
      onCancel={() => close()}
      onSubmit={onSubmit}
      submitLoading={isLoading || updateLoading}
      width="476px"
      submitButtonText="Save"
    >
      <form onSubmit={onSubmit}>
        <ScheduleActivityForm
          control={control}
          watch={watch}
          errors={errors}
          activity_type={scheduleActivityData?.activity_type}
          setWeekDay={setWeekDay}
          setSelectMonthDate={setSelectMonthDate}
          setYearSelectMonth={setYearSelectMonth}
          setMonthDateType={setMonthDateType}
          monthDateType={monthDateType}
          weekDay={weekDay}
          register={register}
          selectMonthDate={selectMonthDate}
          monthSelectYear={monthSelectYear}
          setError={setError}
          getValues={getValues}
          clearErrors={clearErrors}
          setValue={setValue}
        />
      </form>
    </Modal>
  );
};

export default AddStayInTouchModal;
