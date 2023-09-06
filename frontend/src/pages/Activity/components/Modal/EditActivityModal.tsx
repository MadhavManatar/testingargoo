/* eslint-disable @typescript-eslint/no-unused-vars */

// ** Import packages ** //
import { yupResolver } from '@hookform/resolvers/yup';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import {
  FieldNamesMarkedBoolean,
  FormProvider,
  useForm,
  UseFormGetValues,
  UseFormReset,
  useWatch,
} from 'react-hook-form';
import _ from 'lodash';

// ** redux ** //
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'redux/slices/authSlice';

// ** components ** //
import ActivityForm from '../ActivityForm';
import ActivityFormSkeleton from '../../skeletons/ActivityFormSkeleton';
import DiscardActivityModal from './DiscardActivityModal';
import ActivityModal from './ActivityModal';
import MarkAsDoneModal from './MarkAsDoneModal';
import Button from 'components/Button';
import { SaveAndCloseBtn } from './SaveAndCloseBtn';
import FormField from 'components/FormField';

// ** types ** //
import { Option } from 'components/FormField/types/formField.types';
import {
  activityGuestsType,
  ActivityResponseType,
  activityTypeResponse,
  AddActivityFormFields,
  ContactGuestEmailsType,
  MarkAsDoneFormFields,
  ModalProps,
  zoomIsExistResponseType,
} from '../../types/activity.types';

// ** use-services ** //
import { useLoadOtherActivityRelatedDataHooks } from '../../hooks/useActivityService';
import { useUpdateZoomMeetingHook } from 'pages/Activity/hooks/useZoomServices';

// ** helper ** //
import {
  convertActivityParticipantToContactGuests,
  generateEditTimeActivityFormData,
} from '../../helper/activity.helper';

//  ** others **
import { activitySchema } from '../../validation-schema/activity.schema';
import { useUpdateActivityMutation } from 'redux/api/activityApi';
import { useUpdateActivityTypeMutation } from 'redux/api/activityTypeApi';
import {
  AuthProviderConnectURLS,
  TokenProvider,
} from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';
import ReConnectCalendarModal from './ReConnectCalendarModal'
import { ACTIVITY_TYPE_MAIL_STATUS } from 'constant/activity.constant';

interface Props {
  id: number;
  isOpen: boolean;
  onEdit?: (data?: any) => void;
  closeModal: () => void;
  openModal?: ModalProps;
}
const EditActivityModal = (props: Props) => {
  const { closeModal, isOpen, onEdit, id, openModal } = props;
  const activityModalRef = useRef<HTMLDivElement>(null);

  // ** states ** //
  const [openDiscardModal, setOpenDiscardModal] = useState<boolean>(false);
  const [address, setAddress] = useState<Option>();
  const [guestEmails, setGuestsEmails] = useState<activityGuestsType[]>([]);
  const [contactGuestEmails, setContactGuestsEmails] =
    useState<ContactGuestEmailsType>([]);
  const [startDateUpdateCount, setStartDateUpdateCount] = useState<number>(0);
  const [selectedActivityType, setSelectedActivityType] =
    useState<activityTypeResponse>();
  const [openReconnectModal, setOpenReconnectModal] = useState<{
    isOpen: boolean;
    provider: {
      value: TokenProvider | '';
      urlValue: AuthProviderConnectURLS | '';
    };
  }>({
    isOpen: false,
    provider: {
      urlValue: '',
      value: '',
    },
  });


  const [openCompleteModal, setOpenCompleteModal] = useState<boolean>(false);
  const [editActivityFormData, setEditActivityFormData] =
    useState<AddActivityFormFields>();

  // ** Custom hooks **
  const formMethods = useForm<AddActivityFormFields>({
    resolver: yupResolver(activitySchema),
  });


  const {
    activityDetail,
    activityTypeData,
    getActivity,
    loadingCondition,
    defaultRemindersData,
    userZoomAuthStatus,
    availabilityData,
    activityTypeEmailStatus,
  } = useLoadOtherActivityRelatedDataHooks();

  const {
    handleSubmit,
    reset,
    formState: { dirtyFields },
    getValues,
    control,
    setValue,
    register,
    watch
  } = formMethods;
  const useWatchData = useWatch({
    control,
  });
  const startDateWatch = useWatchData.start_date;


  useEffect(() => {
    if (startDateWatch) {
      setStartDateUpdateCount(startDateUpdateCount + 1);
    }
  }, [startDateWatch]);


  useEffect(() => {
    if (!activityDetail?.activity_type?.id) {
      const is_default_activity_type = activityTypeData.find(
        (val) => val.is_default
      );
      setSelectedActivityType?.(is_default_activity_type);
    }
  }, [activityTypeData, activityDetail]);

  useEffect(() => {
    if (id) {
      getActivity(id);
    }
  }, [id]);

  useResetEditActivityForm({
    activityDetail,
    reset,
    setAddress,
    setContactGuestsEmails,
    setGuestsEmails,
    getValues,
  });

  const close = (data?: any) => {
    if (data?.refresh_expired?.isExpiry) {
      setOpenReconnectModal({
        isOpen: true,
        provider: {
          urlValue:
            data?.refresh_expired?.token_provider ===
              TokenProvider.GOOGLE_CALENDAR
              ? AuthProviderConnectURLS.google
              : AuthProviderConnectURLS.microsoft || '',
          value: data?.refresh_expired?.token_provider || '',
        },
      });

      if (activityModalRef.current) {
        activityModalRef.current.style.display = 'none';
      }
    } else {
      setOpenDiscardModal(false);
      reset();
      closeModal();
    }
  };

  const { updateActivity, isSubmitLoading } = useUpdateActivityHook({
    activityDetail,
    close,
    contactGuestEmails,
    guestEmails,
    id,
    onEdit,
    userZoomAuthStatus,
    startDateUpdateCount,
    activityTypeEmailStatus
  });

  const onSubmit = handleSubmit(async (value: AddActivityFormFields) => {
    if (!value.topic) {
      const typeName = activityTypeData.find(
        (r) => r.id === value.activity_type_id
      );
      setValue('topic', typeName?.name ?? '');
      value.topic = typeName?.name ?? '';
    }
    await updateActivity({
      ...value,
    });
    closeModal();
  });

  // Save & Send mail button click
  const sendMailButtonClick = () => {
    setValue('should_send_mail', true);
    onSubmit()
  }

  const setDiscardFlow = () => {
    setDiscardModalFlow({
      activityDetail,
      close,
      contactGuestEmails,
      dirtyFields,
      getValues,
      guestEmails,
      openDiscardModal,
      setOpenDiscardModal,
      loadingCondition,
    });
  };

  // Save & Done Check Validation & Open Complate Modal
  const saveButtonClick = handleSubmit(async (value: AddActivityFormFields) => {
    setOpenCompleteModal(true);
    setEditActivityFormData(value);
  });

  // Save & Done Final Submit Button
  const saveAndDoneApiCall = async (
    saveDoneFormValues: MarkAsDoneFormFields
  ) => {
    if (saveDoneFormValues && editActivityFormData) {
      const markAsDoneData = {
        memo: saveDoneFormValues.memo,
        result: saveDoneFormValues.result,
      };
      const newObj = {
        ...markAsDoneData,
        ...editActivityFormData,
      };
      newObj.completed = true;
      await updateActivity(newObj);
    }
  };
  return isOpen ? (
    <>
      <ActivityModal
        title="Update Activity"
        visible={isOpen}
        onClose={setDiscardFlow}
        onCancel={setDiscardFlow}
        width="968px"
        modalRef={activityModalRef}
        modalWrapperClass={`createActivityModal ${loadingCondition ? 'createActivityModal__leading' : ''
          }`}
      >
        {loadingCondition || !activityDetail.id ? (
          <>
            <ActivityFormSkeleton />
          </>
        ) : (
          <>
            {activityDetail.id && (
              <FormProvider {...formMethods}>
                <form
                  onKeyDownCapture={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                  onSubmit={onSubmit}
                >
                  <div className="ip__Modal__Body ip__FancyScroll relative">
                    <ActivityForm
                      formFlag="edit"
                      activityDetail={activityDetail}
                      availabilityData={availabilityData}
                      activityTypeData={activityTypeData}
                      userZoomAuthStatus={userZoomAuthStatus}
                      address={address}
                      guestEmails={guestEmails}
                      setGuestsEmails={setGuestsEmails}
                      contactGuestEmails={contactGuestEmails}
                      setContactGuestsEmails={setContactGuestsEmails}
                      defaultRemindersData={defaultRemindersData}
                      setStartDateUpdateCount={setStartDateUpdateCount}
                      setSelectedActivityType={setSelectedActivityType}
                      selectedActivityType={selectedActivityType}
                      openModal={openModal}
                    />
                  </div>
                  <div className="ip__Modal__Footer !px-[30px]">
                    <div className="ip__Checkbox form__Groupip__Checkbox">
                      <FormField<AddActivityFormFields>
                        type="checkbox"
                        name="is_visibility"
                        className="mb-0"
                        register={register}
                        label="Display on the calendar"
                      />
                    </div>
                    <div className="">
                      <div className="inline-flex sm:flex sm:w-full sm:justify-end">
                        <Button
                          className="secondary__Btn smaller min-w-[100px]"
                          onClick={() => close()}
                        >
                          Cancel
                        </Button>
                        <Button
                          isDisabled={loadingCondition}
                          className="smaller primary__Btn min-w-[100px]"
                          onClick={onSubmit}
                          isLoading={isSubmitLoading}
                        >
                          Save
                        </Button>
                        <SaveAndCloseBtn
                          saveButtonText="Save and Mark Done"
                          saveButtonDisabled={false}
                          saveButtonClick={saveButtonClick}
                          isVisible={(activityTypeEmailStatus?.get(useWatchData.activity_type_id || 0) === ACTIVITY_TYPE_MAIL_STATUS.MANUAL) && ((useWatchData.start_date !== activityDetail.start_date) || (useWatchData.duration !== activityDetail.duration) || (useWatchData.start_time !== activityDetail.start_date))}
                          sendMailButtonClick={sendMailButtonClick}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </FormProvider>
            )}
          </>
        )}
      </ActivityModal>
      {openDiscardModal ? (
        <DiscardActivityModal
          discardActivity={close}
          isOpen={openDiscardModal}
          closeModal={() => setOpenDiscardModal(false)}
        />
      ) : (
        <></>
      )}
      {openCompleteModal ? (
        <MarkAsDoneModal
          isOpen
          closeModal={() => setOpenCompleteModal(false)}
          activityId={id}
          activityTypeId={activityDetail.activity_type_id}
          setOpenCompleteModal={setOpenCompleteModal}
          saveAndDoneApiCall={saveAndDoneApiCall}
          isSubmitLoading={isSubmitLoading}
        />
      ) : (
        <></>
      )}
      {openReconnectModal.isOpen ? (
        <ReConnectCalendarModal
          closeModal={() => {
            setOpenDiscardModal(false);
            reset();
            closeModal();
            setOpenReconnectModal({
              isOpen: false,
              provider: {
                urlValue: '',
                value: '',
              },
            });
          }}
          isOpen={openReconnectModal.isOpen}
          provider={openReconnectModal.provider}
        />
      ) : null}
    </>
  ) : (
    <></>
  );
};

export default EditActivityModal;

type SetDiscardFlowType = {
  activityDetail: ActivityResponseType;
  openDiscardModal: boolean;
  guestEmails: activityGuestsType[];
  contactGuestEmails: ContactGuestEmailsType;
  setOpenDiscardModal: Dispatch<SetStateAction<boolean>>;
  getValues: UseFormGetValues<AddActivityFormFields>;
  dirtyFields: Partial<
    Readonly<FieldNamesMarkedBoolean<AddActivityFormFields>>
  >;
  close: () => void;
  loadingCondition: boolean;
};
const setDiscardModalFlow = (args: SetDiscardFlowType) => {
  const {
    activityDetail,
    openDiscardModal,
    contactGuestEmails,
    guestEmails,
    setOpenDiscardModal,
    getValues,
    dirtyFields,
    close,
    loadingCondition,
  } = args;
  if (loadingCondition) {
    close();
    return;
  }
  const oldGuestContactEmail = convertActivityParticipantToContactGuests(
    activityDetail?.activity_participants || []
  );
  if (
    !openDiscardModal &&
    (getValues('start_date') !== activityDetail.start_date ||
      getValues('activity_type_id') !== activityDetail?.activity_type_id ||
      !_.isEqual(oldGuestContactEmail, contactGuestEmails) ||
      !_.isEqual(guestEmails, activityDetail.guests) ||
      Object.keys(dirtyFields).length)
  ) {
    setOpenDiscardModal(true);
  } else {
    close();
  }
};

type UseUpdateActivityHookType = {
  activityDetail: ActivityResponseType;
  contactGuestEmails: ContactGuestEmailsType;
  guestEmails: activityGuestsType[];
  id?: number;
  onEdit?: (data?: any) => void;
  close: (data?: any) => void;
  userZoomAuthStatus: zoomIsExistResponseType;
  startDateUpdateCount: number;
  activityTypeEmailStatus: Map<number, string> | undefined
};
const useUpdateActivityHook = (args: UseUpdateActivityHookType) => {
  const {
    activityDetail,
    contactGuestEmails,
    guestEmails,
    close,
    id,
    onEdit,
    userZoomAuthStatus,
    startDateUpdateCount,
    activityTypeEmailStatus
  } = args;

  const currentUser = useSelector(getCurrentUser);

  // ** APIS **
  const [updateActivityTypeByIdAPI, { isLoading: updateActivityTypesLoading }] =
    useUpdateActivityTypeMutation();
  const [updateActivityByIdAPI, { isLoading: isUpdateActivityLoading }] =
    useUpdateActivityMutation();

  const { updateZoomMeetingFunction, isUpdateZoomLoading } =
    useUpdateZoomMeetingHook();

  const isSubmitLoading =
    isUpdateActivityLoading ||
    isUpdateZoomLoading ||
    updateActivityTypesLoading;
  const updateActivity = async (value: AddActivityFormFields) => {
    const ActivityFormData = generateEditTimeActivityFormData({
      activityDetail,
      contactGuestEmails,
      guestEmails,
      value,
      activityTypeEmailStatus
    });


    if (id) {
      const zoomApiCallParams = {
        topic: value.topic,
        duration: value.duration,
        email: userZoomAuthStatus?.tokenData?.[0]?.token_provider_mail,
        host_id: currentUser?.id,
        start_date: value.start_date,
        provider_meeting_id: value.provider_meeting_id,
      };

      const apiCondition =
        userZoomAuthStatus?.tokenData?.[0]?.token_provider_mail &&
        value?.provider_meeting_id &&
        startDateUpdateCount > 1;
      const conditionalPromise = apiCondition
        ? [
          updateActivityByIdAPI({ id, data: ActivityFormData }),
          updateZoomMeetingFunction(zoomApiCallParams),
        ]
        : [updateActivityByIdAPI({ id, data: ActivityFormData })];

      if (value?.activity_type_is_default) {
        updateActivityTypeById(value);
      }

      const [data] = await Promise.all(conditionalPromise);
      if ('data' in data) {
        close(data);
        if (onEdit) {
          onEdit(data);
        }
      }
    }
  };

  const updateActivityTypeById = async (value: AddActivityFormFields) => {
    // generate activity type form data
    const ActivityTypeFormData = new FormData();
    ActivityTypeFormData.set(
      'is_default',
      JSON.stringify(value?.activity_type_is_default) || ''
    );

    await updateActivityTypeByIdAPI({
      id: value?.activity_type_id,
      data: ActivityTypeFormData,
      params: { toast: false },
    });
  };

  return {
    updateActivity,
    isSubmitLoading,
  };
};

type UseResetEditActivityFormType = {
  activityDetail: ActivityResponseType;
  reset: UseFormReset<AddActivityFormFields>;
  setAddress: Dispatch<SetStateAction<Option | undefined>>;
  setGuestsEmails: Dispatch<SetStateAction<activityGuestsType[]>>;
  setContactGuestsEmails: Dispatch<SetStateAction<ContactGuestEmailsType>>;
  getValues: UseFormGetValues<AddActivityFormFields>;
};
const useResetEditActivityForm = (props: UseResetEditActivityFormType) => {
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
        topic: activityDetail?.topic,
        agenda: activityDetail?.agenda || undefined,
        duration: activityDetail?.duration,
        activity_account: activityDetail?.activity_account_id || undefined,
        activity_collaborators: (activityDetail?.activity_collaborators || [])
          ?.length
          ? activityDetail?.activity_collaborators?.map(
            (user: { user: { id: number } }) => user.user.id
          )
          : undefined,
        activity_contact: activityDetail?.activity_contact?.id || undefined,
        join_link: activityDetail?.zoom_meeting_details?.join_url || undefined,
        is_visibility: activityDetail?.is_visibility || false,
      });
      // ** updating the states and set Value of others field ** //
      ResetEditActivityFormPartTwo({
        activityDetail,
        setAddress,
        setContactGuestsEmails,
        setGuestsEmails,
        reset,
        getValues,
      });
    }
  }, [activityDetail.id]);
};

const ResetEditActivityFormPartTwo = (args: UseResetEditActivityFormType) => {
  const {
    setAddress,
    setContactGuestsEmails,
    setGuestsEmails,
    activityDetail,
    reset,
    getValues,
  } = args;

  reset({
    ...getValues(),
    zoom_meeting_details: Object.keys(
      activityDetail?.zoom_meeting_details || {}
    ).length
      ? activityDetail?.zoom_meeting_details
      : undefined,
    provider_meeting_id:
      activityDetail?.zoom_meeting_details?.provider_meeting_id || undefined,
    start_link: activityDetail?.zoom_meeting_details?.start_url || undefined,
    activity_lead_id: activityDetail?.activity_lead_id || undefined,
    location: activityDetail?.location_details || undefined,
    location_details: activityDetail?.location_details || undefined,
    assigned_to_id: activityDetail?.assigned_to_id || undefined,
    activity_type_id: activityDetail?.activity_type?.id || undefined,
    activity_type: activityDetail?.activity_type?.name || undefined,
    notifications: (activityDetail?.notifications || [])?.length
      ? activityDetail?.notifications
      : undefined,
    all_day: activityDetail?.all_day,
    is_visibility: activityDetail?.is_visibility || false,
  });

  setAddress({
    label: activityDetail?.location_details?.title,
    value: activityDetail?.location_details?.title,
    selected: true,
  });
  setContactGuestsEmails(
    convertActivityParticipantToContactGuests(
      activityDetail?.activity_participants?.filter((v) => v?.contact) || []
    )
  );
  setGuestsEmails(activityDetail?.guests || []);
};
