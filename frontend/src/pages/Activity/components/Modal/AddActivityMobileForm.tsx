// ** Import Packages ** //
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { FormProvider, useForm, UseFormReset, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

// ** Redux ** //
import { getCurrentUser } from 'redux/slices/authSlice';

// ** Components ** //
import ActivityFormSkeleton from '../../skeletons/ActivityFormSkeleton';
import ActivityForm from '../ActivityForm';
import Button from 'components/Button';

// ** Hooks & use-services ** //
import { useLoadOtherActivityRelatedDataHooks } from '../../hooks/useActivityService';
import { useUpdateZoomMeetingHook } from 'pages/Activity/hooks/useZoomServices';
import useWindowDimensions from 'hooks/useWindowDimensions';

// ** Types ** //
import {
  activityGuestsType,
  activityTypeResponse,
  AddActivityFormFields,
  ContactGuestEmailsType,
  entityDataType,
  relatedEntityDataType,
  zoomIsExistResponseType,
} from '../../types/activity.types';

// ** Schema ** //
import { activitySchema } from '../../validation-schema/activity.schema';

//  ** Constants ** //
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { ModuleNames, POLYMORPHIC_MODELS } from 'constant/permissions.constant';

// ** helper ** //
// import { generateActivityFormData } from '../../helper/activity.helper';
import { useAddActivityMutation } from 'redux/api/activityApi';

interface DurationProps {
  id: number;
  activity_interval?: number;
}

const AddActivityMobileForm = () => {
  // ** hooks **
  const navigate = useNavigate();
  const currentUser = useSelector(getCurrentUser);
  const { state } = useLocation();

  const locationState = state as {
    entityData?: entityDataType;
    relatedEntityData?: relatedEntityDataType;
  };

  // ** states ** //
  const [guestEmails, setGuestsEmails] = useState<activityGuestsType[]>([]);
  const [defaultDuration, setDefaultDuration] = useState<DurationProps[]>([]);
  const [contactGuestEmails, setContactGuestsEmails] =
    useState<ContactGuestEmailsType>([]);
  const [startDateUpdateCount, setStartDateUpdateCount] = useState<number>(0);
  const [selectedActivityType, setSelectedActivityType] =
    useState<activityTypeResponse>();

  // ** Custom hooks ** //
  const formMethods = useForm<AddActivityFormFields>({
    resolver: yupResolver(activitySchema),
  });
  const { isMobileView } = useWindowDimensions();

  const { handleSubmit, reset, control } = formMethods;

  const useWatchData = useWatch({
    control,
  });
  const startDateWatch = useWatchData.start_date;
  useEffect(() => {
    if (!isMobileView) navigate(PRIVATE_NAVIGATION.activities.view);
  }, [isMobileView]);
  useEffect(() => {
    if (startDateWatch) {
      setStartDateUpdateCount(startDateUpdateCount + 1);
    }
  }, [startDateWatch]);

  const {
    activityTypeData,
    loadingCondition,
    defaultRemindersData,
    userZoomAuthStatus,
    getGeneralSetting,
    availabilityData,
    getGeneralSettingLoading,
  } = useLoadOtherActivityRelatedDataHooks();

  useEffect(() => {
    const is_default_activity_type = activityTypeData.find(
      (val) => val.is_default
    );
    setSelectedActivityType?.(is_default_activity_type);
  }, [activityTypeData]);

  const fetchDefaultActivityTypeTime = async () => {
    const { data, error } = await getGeneralSetting(
      {
        params: {
          'q[key]': 'default_activity_time_interval',
          'q[model_name]': POLYMORPHIC_MODELS.USER,
          'q[model_record_id]': currentUser?.id,
          module: ModuleNames.ACTIVITY,
        },
      },
      true
    );

    if (data && !error && data?.rows && data.rows[0]?.value?.time_interval) {
      setDefaultDuration([...data.rows[0].value.time_interval]);
    }
  };

  useResetAddActivityForm({
    fetchDefaultActivityTypeTime,
    reset,
    entityData: locationState?.entityData,
    relatedEntityData: locationState?.relatedEntityData,
  });

  const onCancelForm = () => {
    navigate(-1);
    reset();
  };

  const { addActivity, isSubmitLoading } = useAddActivityHook({
    contactGuestEmails,
    guestEmails,
    userZoomAuthStatus,
    startDateUpdateCount,
  });

  const onSubmit = handleSubmit(async (value: AddActivityFormFields) => {
    await addActivity(value);
  });

  return (
    <div
      className={`createActivityModal createActivityModal__mobile__page ${loadingCondition ? 'createActivityModal__leading' : ''
        }`}
    >
      {loadingCondition && getGeneralSettingLoading ? (
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
                formFlag="add"
                activityTypeData={activityTypeData}
                availabilityData={availabilityData}
                defaultDuration={defaultDuration}
                userZoomAuthStatus={userZoomAuthStatus}
                entityData={locationState?.entityData}
                relatedEntityData={locationState?.relatedEntityData}
                setStartDateUpdateCount={setStartDateUpdateCount}
                guestEmails={guestEmails}
                setGuestsEmails={setGuestsEmails}
                contactGuestEmails={contactGuestEmails}
                setContactGuestsEmails={setContactGuestsEmails}
                defaultRemindersData={defaultRemindersData}
                setSelectedActivityType={setSelectedActivityType}
                selectedActivityType={selectedActivityType}
              />
              <div className="action__fixed__btn__accountEdit flex flex-wrap">
                <Button
                  className="cancel__btn secondary__Btn mr-[7px] min-w-[120px] sm:min-w-[calc(50%_-_7px)]"
                  onClick={onCancelForm}
                >
                  Cancel
                </Button>
                <Button
                  className="save__btn primary__Btn min-w-[120px] py-[11px] ml-[7px] sm:min-w-[calc(50%_-_7px)]"
                  type="submit"
                  isLoading={isSubmitLoading}
                >
                  Update
                </Button>
              </div>
            </form>
          </FormProvider>
        </>
      )}
    </div>
  );
};

export default AddActivityMobileForm;

type UseAddActivityHookType = {
  contactGuestEmails: ContactGuestEmailsType;
  guestEmails: activityGuestsType[];
  userZoomAuthStatus: zoomIsExistResponseType;
  startDateUpdateCount: number;
};

const useAddActivityHook = (args: UseAddActivityHookType) => {
  const {
    contactGuestEmails,
    guestEmails,
    userZoomAuthStatus,
    startDateUpdateCount,
  } = args;

  // ** hooks ** //
  const currentUser = useSelector(getCurrentUser);
  const navigate = useNavigate();

  // ** APIS **
  const [addActivityAPI, { isLoading: isAddActivityLoading }] =
    useAddActivityMutation();

  // ** custom hooks ** //
  const { updateZoomMeetingFunction, isUpdateZoomLoading } =
    useUpdateZoomMeetingHook();

  const isSubmitLoading = isAddActivityLoading || isUpdateZoomLoading;

  const addActivity = async (value: AddActivityFormFields) => {
    const ActivityFormData = new FormData();

    ActivityFormData.set('host_id', `${currentUser?.id}`);
    ActivityFormData.set(
      'toast_message',
      `${value.activity_type} Scheduled Successfully`
    );

    ActivityFormData.set('guests', JSON.stringify(guestEmails));
    ActivityFormData.set(
      'activity_participants',
      JSON.stringify({
        new: contactGuestEmails,
      })
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

    const [data] = await Promise.all(conditionalPromise);

    if ('data' in data && data.data?.length) {
      navigate(PRIVATE_NAVIGATION.activities.view);
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
