// ** Import packages ** //
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Tippy from '@tippyjs/react';
import { format, isValid, startOfDay, subMinutes } from 'date-fns';
import {
  DeepPartial,
  EventType,
  FieldPath,
  UseFormGetValues,
  UseFormSetValue,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { ScheduleComponent } from '@syncfusion/ej2-react-schedule';

// ** redux ** //
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'redux/slices/authSlice';

// ** components ** //
import FormField from 'components/FormField';
import Icon, { IconTypes } from 'components/Icon';
import EntityFields from './Form/EntityFields';
import ActivityTypeFieldComponent from './Form/ActivityTypeFieldComponent';
import AdditionFields from './Form/AdditionFields';
import NotificationTimeFields from './Form/NotificationTimeFields';
import ActivityMiniCalender from './Form/ActivityMiniCalender';
import ActivityTimePicker from './Form/ActivityTimePicker';

// ** types ** //
import {
  AddActivityFormFields,
  activityTypeResponse,
  zoomIsExistResponseType,
  ActivityResponseType,
  ContactGuestEmailsType,
  entityDataType,
  relatedEntityDataType,
  miniCalenderDataType,
  activityGuestsType,
  ModalProps,
} from '../types/activity.types';
import { DefaultTimeReminderResponse } from 'pages/Setting/module-setting/Activity/DefaultReminders/types/default-reminder.types';
import { Option } from 'components/FormField/types/formField.types';

// ** Hooks & services ** //
import {
  useGetUserOptions,
  useGetUserOrDescendantUserOptions,
} from 'pages/Setting/user-setting/User/hooks/useUserService';
import { useGetReadOnlyActivities } from '../hooks/useActivityService';
import useWindowDimensions from 'hooks/useWindowDimensions';

// ** other ** //
import { ACTIVITY_AVAILABILITY } from 'constant';
import {
  BasicPermissionTypes,
  ModuleNames,
} from 'constant/permissions.constant';
import { checkInputIsNumber } from 'utils/util';
import { generateCustomizeDate } from '../helper/dateAndTime.helper';
import { DurationProps } from './Modal/AddActivityModal';
import { getQuickPopup } from 'redux/slices/quickPopupDefaultSlice';
import IconAnimation from 'components/IconAnimation';
import { IconTypeJson } from 'indexDB/indexdb.type';

interface ActivityFormPropsType {
  activityDetail?: ActivityResponseType;
  activityTypeData: activityTypeResponse[];
  defaultRemindersData: DefaultTimeReminderResponse[];
  userZoomAuthStatus: zoomIsExistResponseType;
  guestEmails: activityGuestsType[];
  setGuestsEmails: Dispatch<SetStateAction<activityGuestsType[]>>;
  contactGuestEmails: ContactGuestEmailsType;
  availabilityData: {
    id: number;
    availability: string;
  }[];
  setContactGuestsEmails: Dispatch<SetStateAction<ContactGuestEmailsType>>;
  entityData?: entityDataType;
  relatedEntityData?: relatedEntityDataType;
  address?: Option;
  defaultDuration?: DurationProps[];
  followUpStartDate?: Date;
  formFlag: 'add' | 'edit' | 'followUp';
  setStartDateUpdateCount: Dispatch<SetStateAction<number>>;
  setSelectedActivityType: React.Dispatch<
    React.SetStateAction<activityTypeResponse | undefined>
  >;
  selectedActivityType: activityTypeResponse | undefined;
  openModal?: ModalProps;
  quickAutoFill?: boolean;
}

const ActivityForm = (props: ActivityFormPropsType) => {
  const {
    defaultDuration,
    activityDetail,
    contactGuestEmails,
    guestEmails,
    setContactGuestsEmails,
    setGuestsEmails,
    entityData,
    relatedEntityData,
    userZoomAuthStatus,
    address,
    activityTypeData,
    followUpStartDate,
    formFlag,
    setStartDateUpdateCount,
    availabilityData,
    defaultRemindersData,
    selectedActivityType,
    setSelectedActivityType,
    openModal,
    quickAutoFill,
  } = props;
  // ** Hooks ** //
  const schedularRef = useRef<ScheduleComponent>(null);

  // ** States ** //
  const [currentActivityType, setCurrentActivityType] =
    useState<activityTypeResponse>();
  const [toggleCalender, setToggleCalender] = useState(false);
  const [miniCalenderData, setMiniCalenderData] =
    useState<miniCalenderDataType>({
      Id: 1,
      Subject: activityDetail?.topic
        ? activityDetail?.topic
        : currentActivityType?.name || 'Activity',
      StartTime: new Date(),
      EndTime: generateCustomizeDate(new Date(), new Date(), 30),
      ActivityIcon: currentActivityType?.icon || '',
      IsAllDay: true,
      icon_type: currentActivityType?.icon_type || '',
      isReadonly: false,
    });

  const [toggleOtherFields, setToggleOtherFields] = useState<{
    guests: boolean;
    location: boolean;
    videoCall: boolean;
    description: boolean;
  }>({
    description: true,
    guests: true,
    location: true,
    videoCall: true,
  });

  // ** Custom hooks & services ** //
  const {
    control,
    formState: { errors },
    watch,
    setValue,
    register,
    getValues,
    reset,
  } = useFormContext<AddActivityFormFields>();

  const useWatchData = useWatch({
    control,
  });

  /* Reset Form From Quick Popup */
  const selectorQuick = useSelector(getQuickPopup);
  useEffect(() => {
    if (selectorQuick && quickAutoFill) {
      reset({
        activity_account: Number(selectorQuick.account?.id) || undefined,
        activity_contact: Number(selectorQuick.contact?.id) || undefined,
        activity_lead_id:
          Number(selectorQuick.deal?.id) ||
          Number(selectorQuick.lead?.id) ||
          undefined,
      });
    }
  }, [selectorQuick]);

  // ** constants ** //
  const startDateWatch = useWatchData.start_date || '';
  const startTimeWatch = useWatchData.start_time || '';
  const durationWatch = useWatchData.duration;
  const activityTypeWatch = useWatchData.activity_type;
  const activityTopic = useWatchData.topic;

  const endDate = generateCustomizeDate(
    new Date(startDateWatch),
    new Date(startTimeWatch || startDateWatch),
    durationWatch
  );

  const { getReadOnlyActivities, readOnlyActivityData } =
    useGetReadOnlyActivities();

  // ** MiniCalender Function Hook ** //
  const {
    watchUseEffectFunction,
    updateMiniCalenderDataSource,
    changeSchedulerDataSourceOnNavigation,
    changeActivityTypeEvent,
  } = useMiniCalenderFunctionsHook({
    activityTypeWatch,
    currentActivityType,
    getValues,
    activityTopic,
    schedularRef,
    setMiniCalenderData,
  });

  // ** Activity Form Functions ** //
  const {
    setAllValueFromActivityDetail,
    setDurationAndTopicWhenActivityTypeChange,
    setAvailabilityWhenActivityTypeChange,
  } = useActivityFormFunctions();

  useMemo(() => {
    updateMiniCalenderDataSource({
      miniCalenderData,
      readOnlyActivityData,
    });
  }, [miniCalenderData, readOnlyActivityData]);

  useEffect(() => {
    getReadOnlyActivities(new Date(), activityDetail?.id);
  }, []);

  useEffect(() => {
    setAllValueFromActivityDetail({
      formFlag,
      schedularRef,
      setCurrentActivityType,
      setMiniCalenderData,
      activityDetail,
      activityTypeWatch,
      followUpStartDate,
    });
  }, [activityDetail?.id]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      watchUseEffectFunction({
        changeActivityTypeEvent,
        changeSchedulerDataSourceOnNavigation,
        name,
        type,
        value,
        topic: value.topic,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, currentActivityType, activityTopic]);

  useEffect(() => {
    setDurationAndTopicWhenActivityTypeChange({
      changeActivityTypeEvent,
      currentActivityType,
      formFlag,
      getValues,
      setValue,
      defaultDuration,
      activityTypeData,
    });
  }, [currentActivityType]);

  useEffect(() => {
    setAvailabilityWhenActivityTypeChange({
      availabilityData,
      currentActivityType,
      formFlag,
      setValue,
    });
  }, [currentActivityType, availabilityData]);

  return (
    <>
      <div className="schedule__activity__contant__wrapper flex flex-wrap">
        <div className="left pr-[30px] w-[calc(100%_-_332px)] h-[calc(100dvh_-_310px)] overflow-y-auto ip__hideScrollbar md:w-[50%] sm:w-full sm:pr-[15px]">
          <div className="buttons__wrapper activityInner__btnWrapper flex flex-wrap justify-between items-start mb-[15px]">
            <ActivityTypeFieldComponent
              activityTypeData={activityTypeData}
              setCurrentActivityType={setCurrentActivityType}
              activityDetail={activityDetail}
              defaultRemindersData={defaultRemindersData}
              formFlag={formFlag}
              setSelectedActivityType={setSelectedActivityType}
              selectedActivityType={selectedActivityType}
            />
            <button
              className="button__cs items-start mb-[5px] hidden sm:inline-flex"
              type="button"
              onClick={() => setToggleCalender(true)}
            >
              <Icon
                className="highlighted bg-[#ECF2F6] !w-[43px] !h-[43px] p-[11px] !rounded-[10px] duration-500"
                iconType="calendarFilled"
              />
            </button>
          </div>
          <div className="form__external__wrapper">
            <label className="if__label if__label__blue">
              {activityTypeWatch} Title
              <span className="required__sign">*</span>
            </label>
            <FormField<AddActivityFormFields>
              type="activity_topic"
              label=""
              fieldLimit={1024}
              name="topic"
              placeholder={currentActivityType?.name}
              register={register}
              onBlur={(e) => setValue('topic', e.target.value)}
              error={errors.topic}
            />
          </div>

          <div className="activity__timing__wrapper flex flex-wrap items-start">
            <div className="w-[145px] pr-[10px] md:w-full md:pr-0 sm:w-[calc(50%_-_6px)] sm:mr-[6px]">
              <label className="if__label if__label__blue flex flex-wrap">
                <IconAnimation
                  iconType="watchFilled"
                  animationIconType={IconTypeJson.Clock}
                  className="items-center"
                  textLabel="Start"
                  iconClassName="icon__wrapper mr-[5px] w-[30px] h-[30px] p-[1px] shrink-0 top-[-3px]"
                />
              </label>
              <FormField<AddActivityFormFields>
                type="date"
                wrapperClass="withoutIcon__datepicker"
                label=""
                placeholder="Call"
                name="start_date"
                control={control}
                register={register}
                error={errors.start_date}
              />
            </div>
            <ActivityTimePicker
              {...{
                changeActivityTypeEvent,
                changeSchedulerDataSourceOnNavigation,
                setMiniCalenderData,
              }}
            />
            <div className="duration w-[156px] relative pr-[65px] md:w-full">
              <label className="if__label if__label__blue flex flex-wrap">
                Duration <span className="required__sign">*</span>
              </label>
              <FormField<AddActivityFormFields>
                type="text"
                name="duration"
                placeholder="Duration"
                register={register}
                error={errors.duration}
                onKeyDown={checkInputIsNumber}
                fieldLimit={4}
                required
                inputMode="decimal"
              />
              <span className="text-[16px] font-biotif__Medium text-black__TextColor300 inline-block absolute top-[41px] right-0 sm:top-[37px]">
                Minutes
              </span>
            </div>
          </div>

          <div className="endTime__wrapper flex flex-wrap items-center mb-[20px]">
            <span className="label inline-block text-[16px] font-biotif__Medium text-ip__Red mb-[8px] mr-[5px]">
              End Time :
            </span>
            <span className="value inline-block text-[14px] font-biotif__Medium text-black__TextColor400 mb-[8px]">
              {startDateWatch && isValid(endDate)
                ? format(endDate, 'MM/dd/yyyy')
                : ''}
              {startTimeWatch && isValid(endDate)
                ? `-${format(endDate, 'hh:mm aa')}`
                : ''}
            </span>
          </div>

          <div className="mb-[20px]">
            {startTimeWatch && <NotificationTimeFields />}
          </div>

          <AdditionFields
            currentActivityType={currentActivityType}
            setToggleOtherFields={setToggleOtherFields}
            toggleOtherFields={toggleOtherFields}
            userZoomAuthStatus={userZoomAuthStatus}
            address={address}
            setStartDateUpdateCount={setStartDateUpdateCount}
            activityDetail={activityDetail}
          />

          <EntityFields
            openModal={openModal}
            activityDetail={activityDetail}
            entityData={entityData}
            relatedEntityData={relatedEntityData}
            contactGuestEmails={contactGuestEmails}
            guestEmails={guestEmails}
            setContactGuestsEmails={setContactGuestsEmails}
            setGuestsEmails={setGuestsEmails}
            toggleOtherFields={toggleOtherFields}
          />

          <AvailabilityAssignToCollaborators activityDetail={activityDetail} />
        </div>
        <ActivityMiniCalender
          {...{
            changeSchedulerDataSourceOnNavigation,
            currentActivityType,
            getReadOnlyActivities,
            miniCalenderData,
            readOnlyActivityData,
            schedularRef,
            setMiniCalenderData,
            setToggleCalender,
            toggleCalender,
            activityId: activityDetail?.id,
          }}
        />
      </div>
    </>
  );
};

export default ActivityForm;

// **   Components ** //

type AvailabilityAssignToCollaboratorsPropsType = {
  activityDetail?: ActivityResponseType;
};
const AvailabilityAssignToCollaborators = (
  props: AvailabilityAssignToCollaboratorsPropsType
) => {
  const { activityDetail } = props;
  const {
    control,
    formState: { errors },
  } = useFormContext<AddActivityFormFields>();
  const { isMobileView } = useWindowDimensions();
  const {
    userOrDescendantUserOptions,
    isDescendantUsersLoading,
    isUsersLoading: isAssignedToUserLoading,
  } = useGetUserOrDescendantUserOptions({
    module: ModuleNames.ACTIVITY,
    type: activityDetail
      ? BasicPermissionTypes.UPDATE
      : BasicPermissionTypes.CREATE,
  });
  const currentUser = useSelector(getCurrentUser);

  const assignToDefaultUserOption = currentUser?.id
    ? [
      {
        label: `${currentUser?.first_name} ${currentUser?.last_name}`,
        value: currentUser?.id,
      },
    ]
    : [];
  const { getUserOptions, isUsersLoading } = useGetUserOptions({});

  return (
    <>
      <div className="form__external__wrapper">
        <label className="if__label if__label__blue flex flex-wrap items-center">
          <IconAnimation
            iconType="dots3HorizontalFilledIcon"
            animationIconType={IconTypeJson.Availability}
            textLabel="Availability"
            className="items-center status__icon !bg-transparent !mt-[0px] rounded-full mr-[5px]"
            iconClassName="icon__wrapper mr-[5px] w-[30px] h-[30px] p-[1px] shrink-0"
          />
          <Tippy
            content="Availability info : This option shows whether you are shown as available or unavailable for other meetings"
            placement={isMobileView ? 'auto' : 'right'}
          >
            <div className="tooltip__iButton ml-[6px] cursor-pointer">
              <div className="inner__wrapper">
                <span className="dot" />
                <span className="line" />
              </div>
            </div>
          </Tippy>
        </label>
        <FormField<AddActivityFormFields>
          id="availability"
          placeholder="Availability"
          type="select"
          name="availability"
          control={control}
          error={errors?.availability}
          options={ACTIVITY_AVAILABILITY}
          menuPlacement="bottom"
          menuPosition="absolute"
        />
      </div>

      <div className="sm:w-full">
        <FormField<AddActivityFormFields>
          id="assigned_to_id"
          placeholder="Select Assigned To"
          type="asyncSelect"
          name="assigned_to_id"
          label="Assigned To"
          icon="userProfileFilledIcon"
          iconPosition="left"
          labelClass="if__label__blue"
          menuPosition="absolute"
          menuPlacement="auto"
          control={control}
          error={errors?.assigned_to_id}
          isLoading={isDescendantUsersLoading || isAssignedToUserLoading}
          getOptions={userOrDescendantUserOptions}
          defaultOptions={
            activityDetail?.assigned_to?.id
              ? [
                {
                  label: `${activityDetail?.assigned_to?.first_name} ${activityDetail?.assigned_to?.last_name}`,
                  value: activityDetail?.assigned_to?.id,
                },
              ]
              : assignToDefaultUserOption
          }
        />
      </div>

      <div className="form__external__wrapper">
        <label className="if__label if__label__blue flex flex-wrap">
          <IconAnimation
            iconType="userProfileFilledIcon"
            animationIconType={IconTypeJson.Collaborators}
            className="items-center"
            textLabel="Collaborators"
            iconClassName="icon__wrapper mr-[5px] w-[30px] h-[30px] p-[1px] shrink-0 top-[-3px]"
          />
        </label>
        <FormField<AddActivityFormFields>
          id="activity_collaborators"
          placeholder="Select Collaborators"
          type="asyncSelect"
          name="activity_collaborators"
          label=""
          isMulti
          control={control}
          error={errors?.activity_collaborators}
          getOptions={getUserOptions}
          isLoading={isUsersLoading}
          defaultOptions={
            activityDetail?.activity_collaborators?.length
              ? activityDetail?.activity_collaborators?.map(
                (val: {
                  user: {
                    first_name: string;
                    last_name: string;
                    id: number;
                  };
                }) => {
                  return {
                    label: `${val?.user?.first_name} ${val?.user?.last_name}`,
                    value: val?.user?.id,
                  };
                }
              )
              : []
          }
          menuPlacement="top"
          menuPosition="absolute"
        />
      </div>
    </>
  );
};

// ** Mini Calender Functions ** //
type UseMiniCalenderFunctionsHookPropsType = {
  schedularRef: RefObject<ScheduleComponent>;
  getValues: UseFormGetValues<AddActivityFormFields>;
  currentActivityType: activityTypeResponse | undefined;
  setMiniCalenderData: Dispatch<SetStateAction<miniCalenderDataType>>;
  activityTypeWatch: string | undefined;
  activityTopic: string | undefined;
};

type WatchEffectFunctionArgsType = {
  name?: FieldPath<AddActivityFormFields>;
  type?: EventType;
  value: DeepPartial<AddActivityFormFields>;
  topic?: string | undefined;
  changeSchedulerDataSourceOnNavigation: (
    {
      startDate,
      endGapDate,
      topic,
    }: {
      startDate: Date;
      endGapDate: Date;
      topic: string | undefined;
      isStartDateUpdated?: boolean;
    },
    IsAllDay: boolean
  ) => void;
  changeActivityTypeEvent: ({ topic }: { topic?: string }) => void;
};

type UpdateMiniCalenderDataSourceArgsType = {
  miniCalenderData: miniCalenderDataType;
  readOnlyActivityData: miniCalenderDataType[];
};
const useMiniCalenderFunctionsHook = (
  props: UseMiniCalenderFunctionsHookPropsType
) => {
  const {
    schedularRef,
    getValues,
    currentActivityType,
    setMiniCalenderData,
    activityTypeWatch,
    activityTopic,
  } = props;

  const watchUseEffectFunction = (args: WatchEffectFunctionArgsType) => {
    const {
      name,
      type,
      value,
      topic,
      changeSchedulerDataSourceOnNavigation,
      changeActivityTypeEvent,
    } = args;

    if (name === 'topic' && topic) {
      changeActivityTypeEvent({ topic });
    }

    if (
      (name === 'start_date' && type === 'change') ||
      (name === 'duration' && type === 'change')
    ) {
      if (schedularRef.current && value?.start_date) {
        const startDate = generateCustomizeDate(
          new Date(getValues('start_date')),
          new Date(getValues('start_time'))
        );
        const endGapDate = generateCustomizeDate(
          startDate,
          startDate,
          getValues('duration')
        );

        changeSchedulerDataSourceOnNavigation(
          {
            startDate,
            endGapDate,
            topic,
          },
          false
        );
        schedularRef.current.selectedDate = new Date(value?.start_date);
      }
    }
  };

  const updateMiniCalenderDataSource = (
    args: UpdateMiniCalenderDataSourceArgsType
  ) => {
    const { miniCalenderData, readOnlyActivityData } = args;
    if (schedularRef.current) {
      schedularRef.current.eventSettings.dataSource = [
        miniCalenderData,
        ...readOnlyActivityData,
      ];
      // don't remove this comment client may be requested this feature again.

      if (
        isValid(miniCalenderData.StartTime) &&
        !miniCalenderData.IsAllDay &&
        miniCalenderData?.isTimeUpdated
      ) {
        if (format(miniCalenderData.StartTime, 'HH') === '12') {
          schedularRef.current.scrollTo('11:07');
        } else if (format(miniCalenderData.StartTime, 'HH') === '00') {
          schedularRef.current.scrollTo('12', new Date());
        } else {
          schedularRef.current.scrollTo(
            `${format(subMinutes(miniCalenderData.StartTime, 60), 'HH:mm')}`,
            new Date()
          );
        }
      }
    }
  };

  const changeSchedulerDataSourceOnNavigation = (
    {
      startDate,
      endGapDate,
      topic,
      isStartTimeUpdated,
    }: {
      startDate: Date;
      endGapDate: Date;
      topic?: string;
      isStartTimeUpdated?: boolean;
    },
    IsAllDay: boolean
  ) => {
    setMiniCalenderData({
      Id: 1,
      Subject: topic || activityTopic || activityTypeWatch || 'Activity',
      StartTime: startDate,
      EndTime: endGapDate,
      ActivityIcon: currentActivityType?.icon || '',
      icon_type: currentActivityType?.icon_type || '',
      IsAllDay,
      isReadonly: false,
      isTimeUpdated: !!isStartTimeUpdated,
    });
  };

  const changeActivityTypeEvent = ({ topic }: { topic?: string }) => {
    const startDateValue = getValues('start_date');
    const startTimeValue = getValues('start_time');
    const isAllDay = !(startTimeValue && startDateValue);
    const startOfStartDate = startOfDay(new Date(startDateValue));

    const startDate = isAllDay
      ? startOfStartDate
      : generateCustomizeDate(
        new Date(startDateValue),
        new Date(startTimeValue)
      );
    const endGapDate = isAllDay
      ? startOfStartDate
      : generateCustomizeDate(startDate, startDate, getValues('duration'));

    changeSchedulerDataSourceOnNavigation(
      { startDate, endGapDate, topic },
      isAllDay
    );
  };

  return {
    watchUseEffectFunction,
    updateMiniCalenderDataSource,
    changeSchedulerDataSourceOnNavigation,
    changeActivityTypeEvent,
  };
};

// ** Form Functions ** //

type SetAllValueFromActivityDetailArgsType = {
  activityDetail?: ActivityResponseType;
  formFlag: 'add' | 'edit' | 'followUp';
  schedularRef: RefObject<ScheduleComponent>;
  followUpStartDate?: Date;
  setMiniCalenderData: Dispatch<SetStateAction<miniCalenderDataType>>;
  activityTypeWatch?: string;
  setCurrentActivityType: Dispatch<
    SetStateAction<activityTypeResponse | undefined>
  >;
};

type SetDurationAndTopicWhenActivityTypeChangeArgsType = {
  getValues: UseFormGetValues<AddActivityFormFields>;
  setValue: UseFormSetValue<AddActivityFormFields>;
  formFlag: 'add' | 'edit' | 'followUp';
  currentActivityType: activityTypeResponse | undefined;
  defaultDuration?: DurationProps[];
  changeActivityTypeEvent: ({ topic }: { topic?: string }) => void;
  activityTypeData: activityTypeResponse[];
};

type SetAvailabilityWhenActivityTypeChangeArgsType = {
  setValue: UseFormSetValue<AddActivityFormFields>;
  currentActivityType: activityTypeResponse | undefined;
  formFlag: 'add' | 'edit' | 'followUp';
  availabilityData: {
    id: number;
    availability: string;
  }[];
};
const useActivityFormFunctions = () => {
  const setAllValueFromActivityDetail = (
    args: SetAllValueFromActivityDetailArgsType
  ) => {
    const {
      formFlag,
      schedularRef,
      activityDetail,
      setMiniCalenderData,
      followUpStartDate,
      setCurrentActivityType,
      activityTypeWatch,
    } = args;
    if (activityDetail && formFlag !== 'add') {
      if (schedularRef.current && activityDetail?.start_date) {
        let startDate = new Date(activityDetail.start_date);
        let endGapDate = generateCustomizeDate(
          startDate,
          startDate,
          activityDetail.duration
        );

        if (formFlag === 'followUp' && followUpStartDate) {
          startDate = generateCustomizeDate(
            followUpStartDate,
            new Date(activityDetail.start_date)
          );
          endGapDate = generateCustomizeDate(
            startDate,
            startDate,
            activityDetail.duration
          );
        }

        schedularRef.current.selectedDate = startDate;

        setMiniCalenderData({
          Id: 1,
          Subject: activityDetail.topic || activityTypeWatch || 'Activity',
          StartTime: startDate,
          EndTime: endGapDate,
          ActivityIcon: activityDetail?.activity_type?.icon as IconTypes,
          IsAllDay: activityDetail?.all_day,
          icon_type: activityDetail?.activity_type?.icon_type,
          isReadonly: false,
        });

        if (activityDetail?.activity_type?.id) {
          setCurrentActivityType({
            id: activityDetail?.activity_type?.id,
            name: activityDetail?.activity_type?.name,
            icon: activityDetail?.activity_type?.icon as IconTypes,
            icon_type: activityDetail?.activity_type?.icon_type,
          });
        }
      }
    }
  };

  const setDurationAndTopicWhenActivityTypeChange = (
    args: SetDurationAndTopicWhenActivityTypeChangeArgsType
  ) => {
    const {
      formFlag,
      getValues,
      setValue,
      currentActivityType,
      defaultDuration,
      changeActivityTypeEvent,
      activityTypeData,
    } = args;

    const isCustomTitle = activityTypeData.some(
      (a) => a.name === getValues('topic')
    );

    if (!getValues('topic') && currentActivityType?.name && isCustomTitle) {
      setValue('topic', currentActivityType.name);
    }

    const default_anytime_val = defaultDuration?.find(
      (data) => data.id === currentActivityType?.id
    );

    const start_time_old = getValues('start_time');
    const allDay = getValues('all_day');
    if (default_anytime_val?.default_anytime || allDay) {
      setValue('start_time', '');
    } else if (start_time_old) {
      setValue('start_time', start_time_old);
    } else {
      setValue('start_time', new Date().toISOString());
    }

    if (
      currentActivityType?.id &&
      !getValues('duration') &&
      formFlag === 'add'
    ) {
      const duration = defaultDuration?.find(
        (data) => data.id === currentActivityType.id
      );

      setValue(
        'duration',
        duration?.activity_interval ? +duration.activity_interval : 30
      );
    }
    changeActivityTypeEvent({});
  };

  const setAvailabilityWhenActivityTypeChange = (
    args: SetAvailabilityWhenActivityTypeChangeArgsType
  ) => {
    const { currentActivityType, formFlag, setValue, availabilityData } = args;
    if (availabilityData && currentActivityType?.id && formFlag === 'add') {
      setValue(
        'availability',
        availabilityData?.find((obj) => obj.id === currentActivityType.id)
          ?.availability || 'Busy'
      );
    }
  };
  return {
    setAllValueFromActivityDetail,
    setDurationAndTopicWhenActivityTypeChange,
    setAvailabilityWhenActivityTypeChange,
  };
};
