/* eslint-disable no-lonely-if */

// ** Import Packages ** //
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm, UseFormReset, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

// ** Redux ** //
import { getCurrentUser } from 'redux/slices/authSlice';
import {
  getCalenderActivity,
  setActivityQuickAdd,
  setLoadModuleActivityTimelines,
  setLoadTimeLines,
} from 'redux/slices/commonSlice';

// ** Components ** //
import ActivityFormSkeleton from '../../skeletons/ActivityFormSkeleton';
import ActivityForm from '../ActivityForm';
import ActivityModal from './ActivityModal';
import Button from 'components/Button';
import { SaveAndCloseBtn } from './SaveAndCloseBtn';
import FormField from 'components/FormField';

// ** use-services ** //
import { useLoadOtherActivityRelatedDataHooks } from '../../hooks/useActivityService';
import { useUpdateZoomMeetingHook } from 'pages/Activity/hooks/useZoomServices';

// ** Types ** //
import {
  activityGuestsType,
  activityTypeResponse,
  AddActivityFormFields,
  ContactGuestEmailsType,
  entityDataType,
  MarkAsDoneFormFields,
  OpenActivityModalFrom,
  relatedEntityDataType,
  zoomIsExistResponseType,
} from '../../types/activity.types';

// ** Schema **
import { activitySchema } from '../../validation-schema/activity.schema';

//  ** Constants **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { ModuleNames, POLYMORPHIC_MODELS } from 'constant/permissions.constant';

// ** helper **
import { generateActivityFormData } from '../../helper/activity.helper';
import MarkAsDoneModal from './MarkAsDoneModal';
import { GENERAL_SETTING_VALID_KEYS } from 'constant';
import {
  useLazyGetActivityTypesQuery,
  useUpdateActivityTypeMutation,
} from 'redux/api/activityTypeApi';
import { useAddActivityMutation } from 'redux/api/activityApi';
import {
  AuthProviderConnectURLS,
  TokenProvider,
} from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';
import ReConnectCalendarModal from './ReConnectCalendarModal';
import { ACTIVITY_TYPE_MAIL_STATUS } from 'constant/activity.constant';

interface Props {
  isQuickModal?: boolean;
  isOpen: boolean;
  onAdd?: (data?: any) => void;
  closeModal: () => void;
  entityData?: entityDataType;
  relatedEntityData?: relatedEntityDataType;
  modalOpenFrom?: OpenActivityModalFrom;
  quickAutoFill?: boolean;
}

export interface DurationProps {
  id: number;
  activity_interval?: number;
  activity_type_id?: number;
  default_anytime?: string;
}

const AddActivityModal = (props: Props) => {
  const {
    closeModal,
    isOpen,
    onAdd,
    isQuickModal = false,
    entityData,
    relatedEntityData,
    modalOpenFrom,
    quickAutoFill = false,
  } = props;
  const activityModalRef = useRef<HTMLDivElement>(null);

  // ** hooks **
  const currentUser = useSelector(getCurrentUser);

  // ** states ** //
  const [guestEmails, setGuestsEmails] = useState<activityGuestsType[]>([]);
  const [defaultDuration, setDefaultDuration] = useState<DurationProps[]>([]);
  const [contactGuestEmails, setContactGuestsEmails] =
    useState<ContactGuestEmailsType>([]);
  const [startDateUpdateCount, setStartDateUpdateCount] = useState<number>(0);
  const [selectedActivityType, setSelectedActivityType] =
    useState<activityTypeResponse>();
  const [openCompleteModal, setOpenCompleteModal] = useState<boolean>(false);
  const [editActivityFormData, setEditActivityFormData] =
    useState<AddActivityFormFields>();
  const [addActivityTypeID, setAddActivityTypeID] = useState<number>(0);
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
  const ActivityDefaultVisibility = useSelector(getCalenderActivity);
  // ** APIS **
  const [getActivityTypes] = useLazyGetActivityTypesQuery();


  // ** Custom hooks ** //
  const formMethods = useForm<AddActivityFormFields>({
    resolver: yupResolver(activitySchema),
    defaultValues: { topic: '' },
  });
  const { handleSubmit, reset, control, getValues, setValue, register, watch } =
    formMethods;

  const useWatchData = useWatch({
    control,
  });


  const startDateWatch = useWatchData.start_date;
  useEffect(() => {
    if (startDateWatch) {
      setStartDateUpdateCount(startDateUpdateCount + 1);
    }
  }, [startDateWatch]);
  const [initialLoadingState, setInitialLoadingState] = useState(true);
  const {
    activityTypeData,
    loadingCondition,
    defaultRemindersData,
    userZoomAuthStatus,
    getGeneralSetting,
    availabilityData,
    activityTypeEmailStatus,
  } = useLoadOtherActivityRelatedDataHooks();


  useEffect(() => {
    setInitialLoadingState(loadingCondition);
  }, [loadingCondition]);
  useEffect(() => {
    let is_default_activity_type = activityTypeData.find(
      (val) => val.is_default
    );
    if (modalOpenFrom && modalOpenFrom === 'compose') {
      is_default_activity_type = activityTypeData.find(
        (val) => val.name === 'Email'
      );
    }
    setSelectedActivityType?.(is_default_activity_type);
  }, [activityTypeData, modalOpenFrom]);

  const fetchDefaultActivityTypeTime = async () => {
    const [{ data: intervalData, error: intervalError }, { data, error }] =
      await Promise.all([
        getGeneralSetting(
          {
            params: {
              'q[or][0][key]': 'default_activity_time_interval',
              'q[or][1][key]': 'default_activity_default_anytime',
              'q[model_name]': POLYMORPHIC_MODELS.USER,
              'q[model_record_id]': currentUser?.id,
              module: ModuleNames.ACTIVITY,
              limit: 100,
            },
          },
          true
        ),
        getActivityTypes(
          {
            data: {
              query: {},
            },
          },
          true
        ),
      ]);

    if (data && !error && !intervalError && intervalData) {
      const timeIntervalData: {
        key: string;
        related_model_id: number;
        value: string;
        id: number;
      }[] = intervalData || [];
      const { rows } = data;
      const activityTypesData = rows.map(
        (item: {
          id: number;
          icon: string;
          icon_type: string;
          name: string;
        }) => {
          return {
            activity_interval:
              timeIntervalData.find(
                (obj) =>
                  obj.related_model_id === item.id &&
                  obj.key === 'default_activity_time_interval'
              )?.value || 30,
            default_anytime: timeIntervalData.find(
              (obj) =>
                obj.related_model_id === item.id &&
                obj.key === 'default_activity_default_anytime' &&
                obj.value === '1'
            )
              ? true || false
              : false,
            id: item.id,
            activity_type_id: item.id,
          };
        }
      );
      setDefaultDuration(activityTypesData);
    }
  };
  const fetchCalenderActivitySettingData = async () => {
    const {
      data: isActivityCalenderVisibilityData,
      error: activityCalenderVisibilityError,
    } = await getGeneralSetting({
      params: {
        'q[key]': GENERAL_SETTING_VALID_KEYS.is_activity_calender_visibility,
        'q[model_name]': POLYMORPHIC_MODELS.ACTIVITY,
        'q[model_record_id]': currentUser?.id,
        module: ModuleNames.ACTIVITY,
      },
    });
    if (
      isActivityCalenderVisibilityData?.[0]?.value &&
      !activityCalenderVisibilityError
    ) {
      setValue('is_visibility', isActivityCalenderVisibilityData[0].value);
    }
  };

  useEffect(() => {
    if (useWatchData.activity_type_id) {
      fetchCalenderActivitySettingData();
      const activityTypeDuration = defaultDuration.find(
        (data) => data.activity_type_id === useWatchData.activity_type_id
      );
      const topicName = activityTypeData.find(
        (data) => data.id === useWatchData.activity_type_id
      );
      const isCustomName = getValues('topic') !== topicName?.name;
      reset({
        ...getValues(),
        duration: activityTypeDuration?.activity_interval || 30,
        topic: isCustomName ? getValues('topic') : '',
      });
    }
  }, [useWatchData.activity_type_id]);

  useResetAddActivityForm({
    fetchDefaultActivityTypeTime,
    reset,
    entityData,
    relatedEntityData,
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
      reset();
      closeModal();
    }
  };

  const { addActivity, isSubmitLoading } = useAddActivityHook({
    close,
    contactGuestEmails,
    guestEmails,
    userZoomAuthStatus,
    isQuickModal,
    onAdd,
    startDateUpdateCount,
    activityTypeEmailStatus
  });

  const onSubmit = handleSubmit(async (value: AddActivityFormFields) => {
    if (!value.topic) {
      setActivityDefaultTopic(value.activity_type_id);
    }
    if (value.topic) {
      await addActivity(value);
    }
  });

  // Save & Done Check Validation & Open Complete Modal
  const saveButtonClick = handleSubmit(async (value: AddActivityFormFields) => {
    setOpenCompleteModal(true);
    setEditActivityFormData(value);
    setAddActivityTypeID(value.activity_type_id);
  });

  // Save & Send mail button click
  const sendMailButtonClick = () => {
    setValue('should_send_mail', true);
    onSubmit()
  }


  const setActivityDefaultTopic = (activity_type_id: number) => {
    const typeName = activityTypeData.find((r) => r.id === activity_type_id);
    setValue('topic', typeName?.name ?? '');
  };

  // Save & Done Final Submit Button
  const saveAndDoneApiCall = async (
    saveDoneFormValues: MarkAsDoneFormFields
  ) => {
    if (saveDoneFormValues && editActivityFormData) {
      if (!editActivityFormData.topic) {
        setActivityDefaultTopic(editActivityFormData.activity_type_id);
      }
      const markAsDoneData = {
        memo: saveDoneFormValues.memo,
        result: saveDoneFormValues.result,
      };
      const newObj = {
        ...markAsDoneData,
        ...editActivityFormData,
      };
      newObj.completed = true;
      await addActivity(newObj);
    }
  };

  return isOpen ? (
    <>
      <ActivityModal
        title="Schedule An Activity"
        visible={isOpen}
        onClose={() => close()}
        onCancel={() => close()}
        modalWrapperClass={`createActivityModal ${loadingCondition ? 'createActivityModal__leading' : ''
          }`}
        width="968px"
      >
        {loadingCondition || initialLoadingState ? (
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
                <div className="ip__Modal__Body ip__FancyScroll relative">
                  <ActivityForm
                    formFlag="add"
                    activityTypeData={activityTypeData}
                    availabilityData={availabilityData}
                    defaultDuration={defaultDuration}
                    userZoomAuthStatus={userZoomAuthStatus}
                    entityData={entityData}
                    relatedEntityData={relatedEntityData}
                    setStartDateUpdateCount={setStartDateUpdateCount}
                    guestEmails={guestEmails}
                    setGuestsEmails={setGuestsEmails}
                    contactGuestEmails={contactGuestEmails}
                    setContactGuestsEmails={setContactGuestsEmails}
                    defaultRemindersData={defaultRemindersData}
                    setSelectedActivityType={setSelectedActivityType}
                    selectedActivityType={selectedActivityType}
                    quickAutoFill={quickAutoFill}
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
                      defaultChecked={!ActivityDefaultVisibility}

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
                        isVisible={(activityTypeEmailStatus?.get(useWatchData.activity_type_id || 0) === ACTIVITY_TYPE_MAIL_STATUS.MANUAL) && (contactGuestEmails.length || watch('activity_contact') || guestEmails.length)}
                        saveButtonClick={saveButtonClick}
                        sendMailButtonClick={sendMailButtonClick}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </FormProvider>
          </>
        )}
      </ActivityModal>
      {openCompleteModal ? (
        <MarkAsDoneModal
          isOpen
          closeModal={() => setOpenCompleteModal(false)}
          activityTypeId={addActivityTypeID}
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
  ) : null;
};

export default AddActivityModal;

type UseAddActivityHookType = {
  contactGuestEmails: ContactGuestEmailsType;
  guestEmails: activityGuestsType[];
  isQuickModal?: boolean;
  onAdd?: (data?: any) => void;
  close: (data?: any) => void;
  userZoomAuthStatus: zoomIsExistResponseType;
  startDateUpdateCount: number;
  activityTypeEmailStatus: Map<number, string> | undefined;
};

const useAddActivityHook = (args: UseAddActivityHookType) => {
  const {
    contactGuestEmails,
    guestEmails,
    isQuickModal,
    onAdd,
    close,
    userZoomAuthStatus,
    startDateUpdateCount,
    activityTypeEmailStatus
  } = args;

  // ** hooks ** //
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const currentUser = useSelector(getCurrentUser);

  // ** APIS **
  const [updateActivityTypeById, { isLoading: updateActivityTypesLoading }] =
    useUpdateActivityTypeMutation();
  const [addActivityAPI, { isLoading: isAddActivityLoading }] =
    useAddActivityMutation();

  // ** custom hooks ** //
  const { updateZoomMeetingFunction, isUpdateZoomLoading } =
    useUpdateZoomMeetingHook();

  const isSubmitLoading =
    isAddActivityLoading || isUpdateZoomLoading || updateActivityTypesLoading;

  const addActivity = async (value: AddActivityFormFields) => {
    // Add this logic for if creation date and schedule date same then make schedule date at least 1 second greater

    const ActivityFormData = generateActivityFormData(value, activityTypeEmailStatus);

    ActivityFormData.set('host_id', `${currentUser?.id}`);
    ActivityFormData.set(
      'toast_message',
      `${value.activity_type} Scheduled Successfully`
    );

    const activityTypeMailStatusData = activityTypeEmailStatus?.get(value?.activity_type_id);

    let should_send_mail: boolean;

    const email_status = activityTypeMailStatusData ||
      ACTIVITY_TYPE_MAIL_STATUS.DISABLED;



    // set activity guest data
    if (value?.should_send_mail) {
      should_send_mail = value?.should_send_mail;
    } else {
      if (activityTypeMailStatusData === ACTIVITY_TYPE_MAIL_STATUS.AUTOMATIC) {
        should_send_mail = true
      } else {
        should_send_mail = false
      }
    }

    guestEmails?.map((data) => {
      data.email_status = email_status
      data.should_send_mail = should_send_mail
      return data;
    })
    ActivityFormData.set('guests', JSON.stringify(guestEmails));

    if (!(value?.should_send_mail)) {
      if (activityTypeMailStatusData === ACTIVITY_TYPE_MAIL_STATUS.AUTOMATIC) {
        ActivityFormData.set('should_send_mail', 'true');
      } else {
        ActivityFormData.set('should_send_mail', 'false');
      }
    }

    // set form data for activity contact guest
    const ContactGuestData: { email_status: string, should_send_mail: boolean }[] = [
      { "email_status": email_status, "should_send_mail": should_send_mail },
    ];

    contactGuestEmails?.map((data) => {
      data.activity_email_setting = ContactGuestData;
      return data;
    })

    ActivityFormData.set(
      'activity_participants',
      JSON.stringify({
        new: contactGuestEmails,
      })
    );

    // generate activity type form data
    const ActivityTypeFormData = new FormData();
    ActivityTypeFormData.set(
      'is_default',
      JSON.stringify(value?.activity_type_is_default) || ''
    );


    // ** api Calls ** //
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
        addActivityAPI({ data: ActivityFormData }),
        updateZoomMeetingFunction(zoomApiCallParams),
      ]
      : [addActivityAPI({ data: ActivityFormData })];

    if (value.activity_type_is_default) {
      updateActivityTypeById({
        id: value?.activity_type_id,
        data: ActivityTypeFormData,
        params: { toast: false },
      });
    }

    const [data] = await Promise.all(conditionalPromise);

    if ('data' in data) {
      close(data);
      dispatch(setLoadTimeLines({ timeline: true }));
      dispatch(
        setLoadModuleActivityTimelines({
          moduleActivityTimeline: true,
        })
      );
      if (isQuickModal && pathname === PRIVATE_NAVIGATION.activities.view) {
        dispatch(setActivityQuickAdd({ activity: true }));
      }

      if (onAdd) {
        onAdd(data);
      }
    }
  };

  return {
    addActivity,
    isSubmitLoading,
  };
};

type UseResetAddActivityFormType = {
  fetchDefaultActivityTypeTime: () => Promise<void>;
  entityData?: entityDataType;
  reset: UseFormReset<AddActivityFormFields>;
  relatedEntityData?: relatedEntityDataType;
};

const useResetAddActivityForm = (args: UseResetAddActivityFormType) => {
  const { fetchDefaultActivityTypeTime, entityData, reset, relatedEntityData } =
    args;

  // ** hooks ** //
  const currentUser = useSelector(getCurrentUser);
  useEffect(() => {
    fetchDefaultActivityTypeTime();
    let entitySetObject;

    if (entityData) {
      if ([ModuleNames.DEAL, ModuleNames.LEAD].includes(entityData.type)) {
        entitySetObject = { activity_lead_id: entityData.id || undefined };
      } else if (entityData.type === ModuleNames.CONTACT) {
        entitySetObject = { activity_contact: entityData.id };
      } else if (entityData.type === ModuleNames.ACCOUNT) {
        entitySetObject = { activity_account: entityData.id };
      }
    }

    reset({
      start_date: new Date().toISOString(),
      start_time: new Date().toISOString(),
      duration: 30,
      activity_contact:
        entitySetObject?.activity_contact || relatedEntityData?.contact?.id,
      ...entitySetObject,
      activity_account:
        entitySetObject?.activity_account || relatedEntityData?.account?.id,
      assigned_to_id: currentUser?.id,
    });
  }, [entityData]);
};
