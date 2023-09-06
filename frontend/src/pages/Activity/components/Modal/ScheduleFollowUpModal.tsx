// ** Import Packages ** //
import { yupResolver } from '@hookform/resolvers/yup';
import {
  BaseSyntheticEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import {
  Control,
  FieldErrors,
  FormProvider,
  useForm,
  UseFormGetValues,
  UseFormReset,
  UseFormReturn,
  UseFormSetValue,
  UseFormWatch,
  useWatch,
} from 'react-hook-form';

// ** Redux ** //
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'redux/slices/authSlice';

// ** Components ** //
import Modal from 'components/Modal';
import ActivityFormSkeleton from '../../skeletons/ActivityFormSkeleton';
import ActivityForm from '../ActivityForm';
import MarkAsDoneForm from '../Form/MarkAsDoneForm';

// ** Types ** //
import { Option } from 'components/FormField/types/formField.types';
import { DefaultTimeReminderResponse } from 'pages/Setting/module-setting/Activity/DefaultReminders/types/default-reminder.types';
import {
  activityGuestsType,
  ActivityResponseType,
  activityTypeResponse,
  AddActivityFormFields,
  ContactGuestEmailsType,
  MarkAsDoneFormFields,
  zoomIsExistResponseType,
} from '../../types/activity.types';
import {
  AuthProviderConnectURLS,
  TokenProvider,
} from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';

// ** Hook-Services ** //
import { useLoadOtherActivityRelatedDataHooks } from '../../hooks/useActivityService';
import { useUpdateZoomMeetingHook } from 'pages/Activity/hooks/useZoomServices';

// ** Schema **
import {
  activitySchema,
  markAsDoneActivitySchema,
} from '../../validation-schema/activity.schema';

// ** Helper **
import { getDefaultActivityResult } from 'pages/Setting/module-setting/Activity/ActivityType/helper/activityType.helper';
import {
  convertActivityParticipantToContactGuests,
  filterActivityParticipantsData,
  generateActivityFormData,
} from '../../helper/activity.helper';
import {
  useFollowUpScheduleUpActivityMutation,
  useLazyGetActivityByIdQuery,
} from 'redux/api/activityApi';

interface Props {
  id: number;
  isOpen: boolean;
  closeModal: () => void;
  followUpStartDate?: Date;
  closeViewModal?: (activityDetail?: ActivityResponseType) => void;
  onEdit: ((data: any) => void) | undefined;
  setOpenReconnectModal: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      provider: {
        value: TokenProvider | '';
        urlValue: AuthProviderConnectURLS | '';
      };
    }>
  >;
}
const ScheduleFollowUpModal = (props: Props) => {
  const {
    closeModal,
    isOpen,
    id,
    followUpStartDate,
    closeViewModal,
    onEdit,
    setOpenReconnectModal,
  } = props;

  // ** Hooks ** //
  const [defaultResult, setDefaultResult] = useState<{
    id: number;
    result: string;
  }>({ id: 0, result: '' });
  const formMethods = useForm<AddActivityFormFields>({
    resolver: yupResolver(activitySchema),
    defaultValues: {
      result: defaultResult?.id?.toString() || '',
    },
  });
  const { handleSubmit, reset, getValues, control, setValue } = formMethods;
  const useWatchData = useWatch({ control });
  const startDateWatch = useWatchData.start_date;

  // ** States ** //
  const [address, setAddress] = useState<Option>();
  const [guestEmails, setGuestsEmails] = useState<activityGuestsType[]>([]);
  const [activityResultName, setActivityResultName] = useState<string>();
  const [startDateUpdateCount, setStartDateUpdateCount] = useState<number>(0);
  const [step, setStep] = useState<'scheduleModal' | 'completeModal'>(
    'scheduleModal'
  );
  const [contactGuestEmails, setContactGuestsEmails] =
    useState<ContactGuestEmailsType>([]);

  // ** APIS **
  const [getActivityByIdAPI, { isLoading: isGetActivityLoading }] =
    useLazyGetActivityByIdQuery();

  useEffect(() => {
    if (id) {
      getActivityResult(id);
    }
  }, [id]);

  useEffect(() => {
    if (startDateWatch) {
      setStartDateUpdateCount(startDateUpdateCount + 1);
    }
  }, [startDateWatch]);

  // ** Custom hooks ** //
  const {
    formState: { errors: completeErrors },
    control: completeControl,
    reset: completeReset,
    watch: completeWatch,
    setValue: completeSetValue,
    handleSubmit: completeHandleSubmit,
  } = useForm<MarkAsDoneFormFields>({
    resolver: yupResolver(markAsDoneActivitySchema),
  });
  const {
    getActivity,
    userZoomAuthStatus,
    activityTypeData,
    activityDetail,
    loadingCondition,
    availabilityData,
    defaultRemindersData,
  } = useLoadOtherActivityRelatedDataHooks();
  useResetScheduleFollowUpActivityForm({
    activityDetail,
    getValues,
    reset,
    setAddress,
    setContactGuestsEmails,
    setGuestsEmails,
  });
  const { scheduleFollowUpActivity, isSubmitLoading } =
    useScheduleFollowUpActivityHook({
      contactGuestEmails,
      getValues,
      guestEmails,
      id,
      startDateUpdateCount,
      userZoomAuthStatus,
      activityDetail,
      closeModal,
      closeViewModal,
      onEdit,
      setOpenReconnectModal,
    });

  useEffect(() => {
    if (id) {
      getActivity(id);
    }
  }, [id]);

  const getActivityResult = async (activityId: number) => {
    const { data, error } = await getActivityByIdAPI({
      id: activityId,
      data: {
        query: {
          'include[activity_type][include][types_results][include][activity_result][select]':
            'id,result',
        },
      },
    });
    if (data && !error) {
      const activityResult = getDefaultActivityResult(data);
      setDefaultResult(activityResult);
      setValue('result', activityResult?.id?.toString() || '');
    }
  };

  const onSubmit = handleSubmit(() => {
    if (!activityDetail?.completed_by) {
      setStep('completeModal');
    } else {
      const { result } = activityDetail;
      scheduleFollowUpActivity({ result });
    }
  });

  const mainSubmit = completeHandleSubmit(async (formValue) => {
    const { memo } = formValue;

    await scheduleFollowUpActivity({
      result: memo || activityResultName || 'other',
    });
  });

  const close = () => {
    reset();
    completeReset();
    closeModal();
    closeViewModal?.(activityDetail);
  };
  return isOpen ? (
    <Modal
      title="Schedule Follow-Up Activity"
      visible={isOpen}
      onClose={() => close()}
      onCancel={() => {
        cancelFlow({
          close,
          setStep,
          step,
        });
      }}
      onSubmit={() => {
        submitFlow({
          mainSubmit,
          onSubmit,
          step,
        });
      }}
      submitLoading={isSubmitLoading}
      width={`${step === 'scheduleModal' ? 968 : 668}px`}
      submitButtonText={submitOrCancelButtonText({
        completed: !!activityDetail?.completed_by,
        step,
        type: 'submit',
      })}
      cancelButtonText={submitOrCancelButtonText({
        completed: !!activityDetail?.completed_by,
        step,
        type: 'cancel',
      })}
      modalWrapperClass={`createActivityModal
      ${loadingCondition ? 'createActivityModal__leading' : ''}
      ${step === 'completeModal' ? 'ScheduleFollowUp' : ''}
      `}
    >
      <ModalChildren
        control={completeControl}
        errors={completeErrors}
        watch={completeWatch}
        setValue={completeSetValue}
        activityTypeId={activityDetail?.activity_type_id}
        step={step}
        mainSubmit={mainSubmit}
        availabilityData={availabilityData}
        activityTypeData={activityTypeData}
        contactGuestEmails={contactGuestEmails}
        formMethods={formMethods}
        followUpStartDate={followUpStartDate}
        address={address}
        guestEmails={guestEmails}
        activityDetail={activityDetail}
        userZoomAuthStatus={userZoomAuthStatus}
        setGuestsEmails={setGuestsEmails}
        setContactGuestsEmails={setContactGuestsEmails}
        loadingCondition={loadingCondition}
        onSubmit={onSubmit}
        defaultRemindersData={defaultRemindersData}
        setStartDateUpdateCount={setStartDateUpdateCount}
        setActivityResultName={setActivityResultName}
        defaultResult={defaultResult}
        isGetActivityLoading={isGetActivityLoading}
      />
    </Modal>
  ) : (
    <></>
  );
};

export default ScheduleFollowUpModal;

type UseResetScheduleFollowUpActivityFormType = {
  activityDetail: ActivityResponseType;
  reset: UseFormReset<AddActivityFormFields>;
  setAddress: Dispatch<SetStateAction<Option | undefined>>;
  setGuestsEmails: Dispatch<SetStateAction<activityGuestsType[]>>;
  setContactGuestsEmails: Dispatch<SetStateAction<ContactGuestEmailsType>>;
  getValues: UseFormGetValues<AddActivityFormFields>;
};
const useResetScheduleFollowUpActivityForm = (
  props: UseResetScheduleFollowUpActivityFormType
) => {
  const {
    activityDetail,
    reset,
    setAddress,
    setContactGuestsEmails,
    setGuestsEmails,
    getValues,
  } = props;

  useEffect(() => {
    if (activityDetail) {
      reset({
        ...getValues(),
        availability: activityDetail?.availability || undefined,
        start_date: activityDetail?.start_date,
        start_time: activityDetail?.all_day
          ? undefined
          : activityDetail.start_date,
        topic: `${activityDetail?.topic || ''}`,
        agenda: activityDetail?.agenda || undefined,
        duration: activityDetail?.duration,
        activity_account: activityDetail?.activity_account_id || undefined,
        activity_collaborators: (activityDetail?.activity_collaborators || [])
          ?.length
          ? activityDetail?.activity_collaborators?.map(
              (user: { user: { id: number } }) => user.user.id
            )
          : undefined,
      });
      ResetScheduleFollowUpActivityFormPartTwo({
        activityDetail,
        getValues,
        reset,
        setAddress,
        setContactGuestsEmails,
        setGuestsEmails,
      });
    }
  }, [activityDetail.id]);
};

const ResetScheduleFollowUpActivityFormPartTwo = (
  args: UseResetScheduleFollowUpActivityFormType
) => {
  const {
    setAddress,
    setContactGuestsEmails,
    setGuestsEmails,
    activityDetail,
    getValues,
    reset,
  } = args;

  reset({
    ...getValues(),
    activity_contact: activityDetail?.activity_contact?.id || undefined,
    activity_lead_id: activityDetail?.activity_lead_id || undefined,
    location: activityDetail?.location_details?.title || undefined,
    assigned_to_id: activityDetail?.assigned_to_id || undefined,
    activity_type_id: activityDetail?.activity_type?.id || undefined,
    notifications: (activityDetail?.notifications || [])?.length
      ? activityDetail?.notifications
      : undefined,
    all_day: activityDetail?.all_day,
  });

  setAddress({
    label: activityDetail.location,
    value: activityDetail.location,
    selected: true,
  });
  setContactGuestsEmails(
    convertActivityParticipantToContactGuests(
      activityDetail?.activity_participants || []
    )
  );
  setGuestsEmails(activityDetail?.guests || []);
};

type UseScheduleFollowUpActivityHook = {
  getValues: UseFormGetValues<AddActivityFormFields>;
  guestEmails: activityGuestsType[];
  contactGuestEmails: ContactGuestEmailsType;
  id: number;
  startDateUpdateCount: number;
  userZoomAuthStatus: zoomIsExistResponseType;
  activityDetail: ActivityResponseType;
  closeModal: () => void;
  closeViewModal: ((activityDetail?: ActivityResponseType) => void) | undefined;
  onEdit: ((data: any) => void) | undefined;
  setOpenReconnectModal: Dispatch<
    SetStateAction<{
      isOpen: boolean;
      provider: {
        value: TokenProvider | '';
        urlValue: AuthProviderConnectURLS | '';
      };
    }>
  >;
};
const useScheduleFollowUpActivityHook = (
  args: UseScheduleFollowUpActivityHook
) => {
  const {
    getValues,
    contactGuestEmails,
    guestEmails,
    id,
    startDateUpdateCount,
    userZoomAuthStatus,
    activityDetail,
    closeModal,
    closeViewModal,
    onEdit,
    setOpenReconnectModal,
  } = args;
  const currentUser = useSelector(getCurrentUser);

  // ** APIS **
  const [followUpScheduleUpActivity, { isLoading }] =
    useFollowUpScheduleUpActivityMutation();

  const { updateZoomMeetingFunction, isUpdateZoomLoading } =
    useUpdateZoomMeetingHook();
  const isSubmitLoading = isLoading || isUpdateZoomLoading;

  const scheduleFollowUpActivity = async ({ result }: { result: string }) => {
    const ActivityFormData = generateActivityFormData(getValues());

    ActivityFormData.set('host_id', `${currentUser?.id}`);
    ActivityFormData.set('guests', JSON.stringify(guestEmails));

    ActivityFormData.set(
      'activity_participants',
      JSON.stringify(
        filterActivityParticipantsData(
          activityDetail?.activity_participants,
          contactGuestEmails,
          'followUp'
        )
      )
    );
    ActivityFormData.set('result', result);
    ActivityFormData.delete('zoom_meeting_details');
    ActivityFormData.delete('provider_meeting_id');
    ActivityFormData.delete('start_link');
    ActivityFormData.delete('join_link');

    // ** api Calls ** //
    const providerMeetingId = getValues('provider_meeting_id');
    const zoomApiCallParams = {
      topic: getValues('topic'),
      duration: getValues('duration'),
      email: userZoomAuthStatus?.tokenData?.[0]?.token_provider_mail,
      host_id: currentUser?.id,
      start_date: getValues('start_date'),
      provider_meeting_id: providerMeetingId,
    };

    const apiCondition =
      userZoomAuthStatus?.tokenData?.[0]?.token_provider_mail &&
      providerMeetingId &&
      startDateUpdateCount > 1;

    const conditionalPromise = apiCondition
      ? [
          followUpScheduleUpActivity({ id, data: ActivityFormData }),
          updateZoomMeetingFunction(zoomApiCallParams),
        ]
      : [followUpScheduleUpActivity({ id, data: ActivityFormData })];

    const [data] = await Promise.all(conditionalPromise);

    if ('data' in data) {
      closeModal();
      closeViewModal?.();
      onEdit?.(data);

      if (data.data?.refresh_expired?.isExpiry) {
        setOpenReconnectModal({
          isOpen: true,
          provider: {
            urlValue:
              data.data?.refresh_expired?.token_provider ===
              TokenProvider.GOOGLE_CALENDAR
                ? AuthProviderConnectURLS.google
                : AuthProviderConnectURLS.microsoft || '',
            value: data.data?.refresh_expired?.token_provider || '',
          },
        });
      }
    }
  };
  return {
    scheduleFollowUpActivity,
    isSubmitLoading,
  };
};

type ModalChildrenType = {
  step: 'scheduleModal' | 'completeModal';
  mainSubmit: (
    e?: React.BaseSyntheticEvent<object, any, any> | undefined
  ) => Promise<void>;
  control: Control<MarkAsDoneFormFields>;
  errors: FieldErrors<MarkAsDoneFormFields>;
  watch: UseFormWatch<MarkAsDoneFormFields>;
  setValue: UseFormSetValue<MarkAsDoneFormFields>;
  activityTypeId: number | undefined;
  loadingCondition: boolean;
  formMethods: UseFormReturn<AddActivityFormFields>;
  onSubmit: (
    e?: React.BaseSyntheticEvent<object, any, any> | undefined
  ) => Promise<void>;
  activityDetail?: ActivityResponseType;
  activityTypeData: activityTypeResponse[];
  defaultRemindersData: DefaultTimeReminderResponse[];
  userZoomAuthStatus: zoomIsExistResponseType;
  guestEmails: activityGuestsType[];
  setGuestsEmails: Dispatch<SetStateAction<activityGuestsType[]>>;
  contactGuestEmails: ContactGuestEmailsType;
  setContactGuestsEmails: Dispatch<SetStateAction<ContactGuestEmailsType>>;
  address?: Option;
  followUpStartDate?: Date;
  setStartDateUpdateCount: Dispatch<SetStateAction<number>>;
  availabilityData: {
    id: number;
    availability: string;
  }[];
  setActivityResultName: Dispatch<SetStateAction<string | undefined>>;
  defaultResult: { id: number; result: string };
  isGetActivityLoading: boolean;
};
const ModalChildren = (args: ModalChildrenType) => {
  const {
    mainSubmit,
    step,
    activityTypeId,
    control,
    errors,
    formMethods,
    loadingCondition,
    onSubmit,
    setValue,
    watch,
    activityTypeData,
    contactGuestEmails,
    guestEmails,
    setContactGuestsEmails,
    setGuestsEmails,
    userZoomAuthStatus,
    activityDetail,
    address,
    followUpStartDate,
    setStartDateUpdateCount,
    defaultRemindersData,
    availabilityData,
    setActivityResultName,
    defaultResult,
    isGetActivityLoading,
  } = args;

  // ** states **
  const [selectedActivityType, setSelectedActivityType] =
    useState<activityTypeResponse>();

  return (
    <>
      <div className={`${step === 'scheduleModal' ? '' : 'hidden'} `}>
        {loadingCondition && !activityDetail?.id ? (
          <>
            <ActivityFormSkeleton />
          </>
        ) : (
          <>
            <FormProvider {...formMethods}>
              <form
                onKeyDownCapture={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
                onSubmit={onSubmit}
              >
                <ActivityForm
                  key={activityDetail?.id}
                  formFlag="followUp"
                  availabilityData={availabilityData}
                  activityTypeData={activityTypeData}
                  followUpStartDate={followUpStartDate}
                  activityDetail={activityDetail}
                  userZoomAuthStatus={userZoomAuthStatus}
                  address={address}
                  setStartDateUpdateCount={setStartDateUpdateCount}
                  guestEmails={guestEmails}
                  setGuestsEmails={setGuestsEmails}
                  contactGuestEmails={contactGuestEmails}
                  setContactGuestsEmails={setContactGuestsEmails}
                  defaultRemindersData={defaultRemindersData}
                  setSelectedActivityType={setSelectedActivityType}
                  selectedActivityType={selectedActivityType}
                />
              </form>
            </FormProvider>
          </>
        )}
      </div>
      <div className={`${step === 'completeModal' ? '' : 'hidden'}`}>
        <form onSubmit={mainSubmit}>
          <div className="mr-[30px]">
            <MarkAsDoneForm
              activityTypeId={activityTypeId}
              control={control}
              errors={errors}
              setValue={setValue}
              watch={watch}
              setActivityResultName={setActivityResultName}
              defaultResult={defaultResult}
              isGetActivityLoading={isGetActivityLoading}
            />
          </div>
        </form>
      </div>
    </>
  );
};

type SubmitFlowType = {
  step: 'scheduleModal' | 'completeModal';
  mainSubmit: (
    e?: BaseSyntheticEvent<object, any, any> | undefined
  ) => Promise<void>;
  onSubmit: (
    e?: BaseSyntheticEvent<object, any, any> | undefined
  ) => Promise<void>;
};
const submitFlow = (args: SubmitFlowType) => {
  const { mainSubmit, onSubmit, step } = args;
  if (step === 'scheduleModal') {
    onSubmit();
  } else if (step === 'completeModal') {
    mainSubmit();
  }
};

type CancelFlow = {
  step: 'scheduleModal' | 'completeModal';
  setStep: Dispatch<SetStateAction<'scheduleModal' | 'completeModal'>>;
  close: () => void;
};

const cancelFlow = (args: CancelFlow) => {
  const { close, setStep, step } = args;
  if (step === 'completeModal') {
    setStep('scheduleModal');
  } else {
    close();
  }
};

type SubmitOrCancelButtonText = {
  step: 'scheduleModal' | 'completeModal';
  type: 'submit' | 'cancel';
  completed: boolean;
};
const submitOrCancelButtonText = (args: SubmitOrCancelButtonText) => {
  const { type, completed, step } = args;

  if (type === 'submit') {
    return step === 'scheduleModal' && !completed ? 'Next' : 'FollowUp';
  }
  return step === 'completeModal' && !completed ? 'Previous' : 'Cancel';
};
