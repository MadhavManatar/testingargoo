// ** Import packages ** //
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import Tippy from '@tippyjs/react';
import { useFormContext, UseFormSetValue, useWatch } from 'react-hook-form';
import ReactGoogleAutocomplete from 'react-google-autocomplete';

// ** redux ** //
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'redux/slices/authSlice';

// ** Components ** //
import Button from 'components/Button';
import FormField from 'components/FormField';
import { Option } from 'components/FormField/types/formField.types';
import Icon from 'components/Icon';

import { useUpdateZoomMeetingHook } from 'pages/Activity/hooks/useZoomServices';

// ** Types ** //
import {
  ActivityResponseType,
  activityTypeResponse,
  AddActivityFormFields,
  zoomIsExistResponseType,
} from 'pages/Activity/types/activity.types';

// ** Others ** //
import {
  REACT_APP_API_URL_WITHOUT_VERSION,
  REACT_APP_GOOGLE_MAP_API_KEY,
  REACT_APP_ZOOM_REDIRECT_URI,
} from 'config';
import { copyToClipboard } from 'utils/util';
import {
  useCreateZoomMeetingMutation,
  useDeleteZoomMeetingMutation,
} from 'redux/api/zoomApi';
import IconAnimation from 'components/IconAnimation';
import { IconTypeJson } from 'indexDB/indexdb.type';

type ToggleOtherFieldsType = {
  guests: boolean;
  location: boolean;
  videoCall: boolean;
  description: boolean;
};
type ZoomMeetingDataType = {
  join_link: string;
  zoom_meeting_details: object;
  provider_meeting_id: string;
  start_link: string;
};

type AdditionFieldProps = {
  userZoomAuthStatus: zoomIsExistResponseType;
  activityDetail?: ActivityResponseType;
  currentActivityType: activityTypeResponse | undefined;
  address?: Option;
  toggleOtherFields: ToggleOtherFieldsType;
  setToggleOtherFields: Dispatch<SetStateAction<ToggleOtherFieldsType>>;
  setStartDateUpdateCount: Dispatch<SetStateAction<number>>;
};

const AdditionFields = (props: AdditionFieldProps) => {
  const {
    userZoomAuthStatus,
    currentActivityType,
    address,
    setToggleOtherFields,
    toggleOtherFields,
    setStartDateUpdateCount,
    activityDetail,
  } = props;
  // ** const ** //
  const zoomMeetingTextareaRef = useRef<HTMLIFrameElement>(null);
  const currentUser = useSelector(getCurrentUser);

  // ** Form Context ** //
  const { control, setValue, getValues, setFocus } =
    useFormContext<AddActivityFormFields>();

  const useWatchData = useWatch({
    control,
  });

  // ** states ** //
  const [zoomMeetingData, setZoomMeetingData] = useState<ZoomMeetingDataType>({
    join_link:
      getValues('join_link') ||
      activityDetail?.zoom_meeting_details?.join_url ||
      '',
    zoom_meeting_details:
      getValues('zoom_meeting_details') ||
      activityDetail?.zoom_meeting_details ||
      {},
    provider_meeting_id:
      getValues('provider_meeting_id') ||
      activityDetail?.zoom_meeting_details?.provider_meeting_id ||
      '',
    start_link:
      getValues('start_link') ||
      activityDetail?.zoom_meeting_details?.start_url ||
      '',
  });

  // ** APIS **
  const [deleteZoomMeetingAPI, { isLoading: isDeleteZoomLoading }] =
    useDeleteZoomMeetingMutation();

  // ** Custom Hooks ** //
  const { updateZoomMeetingFunction, isUpdateZoomLoading } =
    useUpdateZoomMeetingHook();

  useEffect(() => {
    setValue('join_link', zoomMeetingData?.join_link || '');
    setValue(
      'zoom_meeting_details',
      zoomMeetingData?.zoom_meeting_details || {}
    );
    setValue('provider_meeting_id', zoomMeetingData?.provider_meeting_id || '');
    setValue('start_link', zoomMeetingData?.start_link || '');
    if (zoomMeetingTextareaRef.current) {
      if (zoomMeetingData?.join_link) {
        zoomMeetingTextareaRef.current.srcdoc = `
          <div>
          <p>Your Zoom Meeting</p>
          <a href='${zoomMeetingData.join_link}'target='_blank'>${zoomMeetingData.join_link}</a>
          </div>
          
          `;
      } else {
        zoomMeetingTextareaRef.current.srcdoc = '';
      }
    }
  }, [zoomMeetingData]);

  const openOtherFields = (key: string) => {
    setToggleOtherFields((prev) => ({
      ...prev,
      [key]: true,
    }));
    setTimeout(() => {
      if (key === 'videoCall') {
        setZoomMeetingData({
          join_link: getValues('join_link') || '',
          zoom_meeting_details: getValues('zoom_meeting_details') || {},
          provider_meeting_id: getValues('provider_meeting_id') || '',
          start_link: getValues('start_link') || '',
        });
      }
      if (key === 'location') {
        setFocus('location');
      }
      if (key === 'description') {
        setFocus('agenda');
      }
    }, 0);
  };

  // ** Zoom Functions ** //

  const connectZoom = () => {
    const token = window.btoa(
      JSON.stringify({
        userId: currentUser?.id,
        organizationUUID: localStorage.getItem('organization_uuid'),
        successURL: REACT_APP_ZOOM_REDIRECT_URI,
        failureURL: REACT_APP_ZOOM_REDIRECT_URI,
      })
    );
    window.open(
      `${REACT_APP_API_URL_WITHOUT_VERSION}/auth/zoom/connect?token=${token}`,
      '_blank'
    );
  };

  const updateZoomMeeting = async (start_date?: Date, duration?: number) => {
    if (
      getValues('provider_meeting_id') &&
      userZoomAuthStatus.tokenData[0].token_provider_mail
    ) {
      const data = await updateZoomMeetingFunction({
        topic: getValues('topic') || currentActivityType?.name || '',
        activity_type: currentActivityType?.name,
        email: userZoomAuthStatus.tokenData[0].token_provider_mail,
        host_id: currentUser?.id,
        start_date:
          start_date?.toISOString() ||
          getValues('start_date') ||
          getValues('start_time'),
        duration: duration || getValues('duration'),
        provider_meeting_id: getValues('provider_meeting_id'),
      });
      if ('data' in data && data.data) {
        const { zoom_meeting_details } = data.data;
        const updatedData: ZoomMeetingDataType = {
          join_link: zoom_meeting_details?.join_url || '',
          provider_meeting_id: zoom_meeting_details?.provider_meeting_id || '',
          start_link: zoom_meeting_details?.start_url || '',
          zoom_meeting_details,
        };

        setZoomMeetingData(updatedData);
        setStartDateUpdateCount(1);
      }
    }
  };

  const deleteZoomMeeting = async () => {
    if (getValues('provider_meeting_id')) {
      const data = await deleteZoomMeetingAPI({
        id: getValues('provider_meeting_id'),
        data: {
          host_id: currentUser?.id,
          email: userZoomAuthStatus.tokenData[0].token_provider_mail,
        },
      });
      if (!('error' in data)) {
        setZoomMeetingData({
          join_link: '',
          zoom_meeting_details: {},
          provider_meeting_id: '',
          start_link: '',
        });
      }
    }
  };

  const AgendaCondition =
    useWatchData.activity_type === 'Meeting' ? 'Agenda' : 'Description';

  return (
    <>
      <div className="add__box relative pl-[45px] mb-[10px]">
        <span
          className={`label inline-block font-biotif__Medium text-[16px] leading-[22px] text-ip__black__text__color absolute top-[2px] left-0 ${
            Object.values(toggleOtherFields).every((val) => val === true)
              ? 'hidden'
              : ''
          }`}
        >
          Add:
        </span>
        <div className="links__wrapper ip__hideScrollbar sm:flex sm:overflow-x-auto sm:whitespace-pre">
          {React.Children.toArray(
            ['guests', 'location', 'videoCall', 'description'].map((val) => {
              return (
                <div
                  className={`item inline-block mb-[8px] font-biotif__Medium text-[16px] leading-[22px] text-ip__Blue pr-[9px] mr-[9px] relative hover:underline before:content-[""] before:absolute before:right-0 before:top-[2px] before:h-[16px] before:w-[2px] before:bg-ip__Grey__hoverDark cursor-pointer ${
                    toggleOtherFields[val as keyof typeof toggleOtherFields]
                      ? 'hidden'
                      : ''
                  }`}
                  onClick={() => openOtherFields(val)}
                >
                  {val === 'description'
                    ? AgendaCondition
                    : val.charAt(0).toUpperCase() + val.slice(1)}
                </div>
              );
            })
          )}
        </div>
      </div>
      <div>
        {toggleOtherFields.videoCall ? (
          <>
            <div className="form__external__wrapper mb-[20px]">
              <label className="if__label if__label__blue flex flex-wrap">
                <IconAnimation
                  iconType="userProfileFilledIcon"
                  animationIconType={IconTypeJson.VideoCall}
                  className="items-center"
                  textLabel="Video Call"
                  iconClassName="icon__wrapper mr-[5px] w-[30px] h-[30px] p-[1px] shrink-0 top-[-3px]"
                />
              </label>
              {userZoomAuthStatus?.exist ? (
                <>
                  <div className="flex flex-wrap items-center justify-between">
                    <CreateMeeting
                      zoomMeetingData={zoomMeetingData}
                      setZoomMeetingData={setZoomMeetingData}
                      userZoomAuthStatus={userZoomAuthStatus}
                      currentActivityType={currentActivityType}
                      isUpdateZoomLoading={isUpdateZoomLoading}
                      updateZoomMeeting={updateZoomMeeting}
                      setStartDateUpdateCount={setStartDateUpdateCount}
                    />

                    <div
                      className={`flex flex-wrap items-center ${
                        zoomMeetingData?.provider_meeting_id ? '' : 'hidden'
                      } `}
                    >
                      <Tippy content="Copy Link">
                        <div className="">
                          <Button
                            className="smaller primary__Btn copyMeeting__btn !py-[7px] pl-[14px] pr-[6px] mr-[10px]"
                            icon="copyFilledIcon"
                            onClick={() =>
                              copyToClipboard(zoomMeetingData?.join_link)
                            }
                          />
                        </div>
                      </Tippy>
                      <Button
                        isLoading={isDeleteZoomLoading}
                        className="smaller delete__Btn deleteMeeting__btn !py-[7px] pl-[14px] pr-[6px]"
                        icon="deleteFilled"
                        onClick={() => deleteZoomMeeting()}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <Button
                  type="button"
                  className="smaller primary__Btn createMeeting__btn !py-[12px] px-[18px] mr-[10px]"
                  onClick={() => connectZoom()}
                >
                  Connect Zoom
                </Button>
              )}
            </div>
            <div
              className={`form__external__wrapper mb-[20px] ${
                zoomMeetingData?.join_link ? '' : 'hidden'
              }`}
            >
              <label className="if__label if__label__blue flex flex-wrap">
                <IconAnimation
                  iconType="userProfileFilledIcon"
                  animationIconType={IconTypeJson.Meeting}
                  className="items-center"
                  textLabel="Meeting Details"
                  iconClassName="icon__wrapper mr-[5px] w-[30px] h-[30px] p-[1px] shrink-0 top-[-3px]"
                />
              </label>
              <iframe
                title="zoom"
                ref={zoomMeetingTextareaRef}
                placeholder="Type Something"
                name="location_details"
                className="ip__textarea ip__FancyScroll"
              />
            </div>
          </>
        ) : null}

        <ToggleLocation
          address={address}
          toggleOtherFields={toggleOtherFields}
          setValue={setValue}
        />

        <ToggleDescription
          AgendaCondition={AgendaCondition}
          toggleOtherFields={toggleOtherFields}
        />
      </div>
    </>
  );
};

export default AdditionFields;

// ** Location ** //

type ToggleLocationPropsType = {
  toggleOtherFields: ToggleOtherFieldsType;
  address: Option | undefined;
  setValue: UseFormSetValue<AddActivityFormFields>;
};

const ToggleLocation = (props: ToggleLocationPropsType) => {
  const { toggleOtherFields, address, setValue } = props;

  return (
    <>
      {toggleOtherFields.location ? (
        <div className="form__external__wrapper">
          <label className="if__label if__label__blue flex flex-wrap">
            <Icon className="mr-[5px]" iconType="userProfileFilledIcon" />
            Location
          </label>
          <div className="form__Group undefined">
            <div className="">
              <ReactGoogleAutocomplete
                apiKey={REACT_APP_GOOGLE_MAP_API_KEY}
                defaultValue={[address?.label || '']}
                className="ip__input undefined"
                options={{
                  types: [],
                  fields: [
                    'address_components',
                    'formatted_address',
                    'geometry',
                    'name',
                  ],
                }}
                onPlaceSelected={async (place) => {
                  const lat = place?.geometry?.location?.lat();
                  const lng = place?.geometry?.location?.lng();

                  if (lat && lng) {
                    setValue('location', {
                      position: {
                        lat,
                        lng,
                      },
                      title: `${place?.formatted_address}`,
                    });
                  }
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

// ** Description ** //
type ToggleDescriptionPropsType = {
  toggleOtherFields: ToggleOtherFieldsType;
  AgendaCondition: 'Agenda' | 'Description';
};
const ToggleDescription = (props: ToggleDescriptionPropsType) => {
  const { AgendaCondition, toggleOtherFields } = props;
  // ** Form Context ** //
  const {
    register,
    formState: { errors },
  } = useFormContext<AddActivityFormFields>();
  return (
    <>
      {toggleOtherFields.description ? (
        <div className="form__external__wrapper">
          <label className="if__label if__label__blue flex flex-wrap">
            <IconAnimation
              iconType="userProfileFilledIcon"
              animationIconType={IconTypeJson.Agenda}
              className="items-center"
              textLabel={AgendaCondition}
              iconClassName="icon__wrapper mr-[5px] w-[30px] h-[30px] p-[1px] shrink-0 top-[-3px]"
            />
          </label>
          <FormField<AddActivityFormFields>
            type="textarea"
            label=""
            placeholder="Type Something"
            name="agenda"
            fieldLimit={500}
            register={register}
            error={errors?.agenda}
          />
        </div>
      ) : null}
    </>
  );
};

type CreateMeetingPropsType = {
  userZoomAuthStatus: zoomIsExistResponseType;
  currentActivityType: activityTypeResponse | undefined;
  setZoomMeetingData: Dispatch<SetStateAction<ZoomMeetingDataType>>;
  isUpdateZoomLoading: boolean;
  updateZoomMeeting: (start_date?: Date, duration?: number) => Promise<void>;
  zoomMeetingData: ZoomMeetingDataType;
  setStartDateUpdateCount: Dispatch<SetStateAction<number>>;
};
const CreateMeeting = (props: CreateMeetingPropsType) => {
  const {
    userZoomAuthStatus,
    currentActivityType,
    setZoomMeetingData,
    isUpdateZoomLoading,
    updateZoomMeeting,
    zoomMeetingData,
    setStartDateUpdateCount,
  } = props;

  const currentUser = useSelector(getCurrentUser);

  // ** APIS **
  const [createZoomMeetingAPI, { isLoading: isCreateZoomLoading }] =
    useCreateZoomMeetingMutation();

  const { getValues, setError, setFocus } =
    useFormContext<AddActivityFormFields>();
  const createZoomMeeting = async () => {
    if (!getValues('topic')) {
      setError('topic', {
        message: 'Title is required',
      });
      setFocus('topic');
      return;
    }

    if (userZoomAuthStatus.tokenData[0].token_provider_mail) {
      const data = await createZoomMeetingAPI({
        data: {
          topic: getValues('topic'),
          activity_type: currentActivityType?.name,
          email: userZoomAuthStatus.tokenData[0].token_provider_mail,
          host_id: currentUser?.id,
          start_date: getValues('start_time') || getValues('start_date'),
          duration: getValues('duration'),
        },
      });
      if ('data' in data && data.data) {
        const { zoom_meeting_details } = data.data;

        const updatedData: ZoomMeetingDataType = {
          join_link: zoom_meeting_details?.join_url || '',
          provider_meeting_id: zoom_meeting_details?.provider_meeting_id || '',
          start_link: zoom_meeting_details?.start_url || '',
          zoom_meeting_details,
        };

        setZoomMeetingData(updatedData);
        setStartDateUpdateCount(1);
      }
    }
  };

  return (
    <>
      <Button
        isLoading={isCreateZoomLoading || isUpdateZoomLoading}
        className="primary__Btn createMeeting__btn !py-[7px] px-[20px] mr-[10px]"
        icon="meetingFilledIcon"
        onClick={() => {
          if (zoomMeetingData?.provider_meeting_id) {
            updateZoomMeeting();
          } else {
            createZoomMeeting();
          }
        }}
      >
        {zoomMeetingData?.provider_meeting_id ? 'Update ' : 'Create '} Meeting
      </Button>
    </>
  );
};
