// ** Import packages ** //
import { yupResolver } from '@hookform/resolvers/yup';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  FieldNamesMarkedBoolean,
  FormProvider,
  useForm,
  UseFormGetValues,
  UseFormReset,
  useWatch,
} from 'react-hook-form';
import _ from 'lodash';
import { useNavigate, useParams } from 'react-router-dom';

// ** redux ** //
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'redux/slices/authSlice';

// ** components ** //
import ActivityForm from '../ActivityForm';
import ActivityFormSkeleton from '../../skeletons/ActivityFormSkeleton';
import DiscardActivityModal from './DiscardActivityModal';
import Button from 'components/Button';

// ** types ** //
import { Option } from 'components/FormField/types/formField.types';
import {
  activityGuestsType,
  ActivityResponseType,
  activityTypeResponse,
  AddActivityFormFields,
  ContactGuestEmailsType,
  zoomIsExistResponseType,
} from '../../types/activity.types';

// ** use-services ** //
import { useLoadOtherActivityRelatedDataHooks } from '../../hooks/useActivityService';
import { useUpdateZoomMeetingHook } from 'pages/Activity/hooks/useZoomServices';
import useWindowDimensions from 'hooks/useWindowDimensions';

// ** helper ** //
import {
  convertActivityParticipantToContactGuests,
  // generateEditTimeActivityFormData,
} from '../../helper/activity.helper';

//  ** others **
import { activitySchema } from '../../validation-schema/activity.schema';
import { convertNumberOrNull } from 'utils/util';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { useUpdateActivityMutation } from 'redux/api/activityApi';

const EditActivityMobileForm = () => {
  const params = useParams();
  const id = convertNumberOrNull(params.id);
  const navigate = useNavigate();
  // ** states ** //
  const [openDiscardModal, setOpenDiscardModal] = useState<boolean>(false);
  const [address, setAddress] = useState<Option>();
  const [guestEmails, setGuestsEmails] = useState<activityGuestsType[]>([]);
  const [contactGuestEmails, setContactGuestsEmails] =
    useState<ContactGuestEmailsType>([]);
  const [startDateUpdateCount, setStartDateUpdateCount] = useState<number>(0);
  const [selectedActivityType, setSelectedActivityType] =
    useState<activityTypeResponse>();

  // ** Custom hooks **
  const { isMobileView } = useWindowDimensions();

  const formMethods = useForm<AddActivityFormFields>({
    resolver: yupResolver(activitySchema),
  });
  const {
    handleSubmit,
    reset,
    formState: { dirtyFields },
    getValues,
    control,
  } = formMethods;

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
    activityDetail,
    activityTypeData,
    getActivity,
    loadingCondition,
    defaultRemindersData,
    userZoomAuthStatus,
    availabilityData,
  } = useLoadOtherActivityRelatedDataHooks();

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

  const close = () => {
    setOpenDiscardModal(false);
    navigate(-1);
    reset();
  };

  const { updateActivity, isSubmitLoading } = useUpdateActivityHook({
    activityDetail,
    close,
    contactGuestEmails,
    guestEmails,
    id,
    userZoomAuthStatus,
    startDateUpdateCount,
  });

  const onSubmit = handleSubmit(async (value: AddActivityFormFields) => {
    await updateActivity(value);
  });

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

  return (
    <>
      <div
        className={`createActivityModal createActivityModal__mobile__page ${loadingCondition ? 'createActivityModal__leading' : ''
          }`}
      >
        {loadingCondition ? (
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
                />
                <div className="action__fixed__btn__activityEdit flex flex-wrap">
                  <Button
                    className="cancel__btn secondary__Btn mr-[7px] min-w-[120px] sm:min-w-[calc(50%_-_7px)]"
                    onClick={setDiscardFlow}
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
      {openDiscardModal ? (
        <DiscardActivityModal
          discardActivity={close}
          isOpen={openDiscardModal}
          closeModal={() => setOpenDiscardModal(false)}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default EditActivityMobileForm;

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
  id: number | null;
  close: () => void;
  userZoomAuthStatus: zoomIsExistResponseType;
  startDateUpdateCount: number;
};
const useUpdateActivityHook = (args: UseUpdateActivityHookType) => {
  const {
    // activityDetail,
    // contactGuestEmails,
    // guestEmails,
    close,
    id,
    userZoomAuthStatus,
    startDateUpdateCount,
  } = args;

  const currentUser = useSelector(getCurrentUser);

  // ** APIS **
  const [updateActivityByIdAPI, { isLoading: isUpdateActivityLoading }] =
    useUpdateActivityMutation();

  const { updateZoomMeetingFunction, isUpdateZoomLoading } =
    useUpdateZoomMeetingHook();

  const isSubmitLoading = isUpdateActivityLoading || isUpdateZoomLoading;
  const updateActivity = async (value: AddActivityFormFields) => {
    const ActivityFormData = new FormData()

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
      const [data] = await Promise.all(conditionalPromise);
      if ('data' in data && data.data?.length) {
        close();
      }
    }
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
    location: activityDetail?.location_details?.title || undefined,
    assigned_to_id: activityDetail?.assigned_to_id || undefined,
    activity_type_id: activityDetail?.activity_type?.id || undefined,
    activity_type: activityDetail?.activity_type?.name || undefined,
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
