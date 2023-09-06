/* eslint-disable no-prototype-builtins */

// ** Import packages **
import {
  Children,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

// ** Redux **
import { getDetailSection } from 'redux/slices/authSlice';
import {
  getIsLoadDetailsLoad,
  setDetailSectionView,
  setLoadDetails,
} from 'redux/slices/commonSlice';

// ** Components **
import ClickableMobile from 'components/ClickableComponents/ClickableMobile';
import Editable from 'components/Editable';
import FollowersSection from 'components/EntityDetails/FollowFollowing';
import InfoWrapper from 'components/EntityDetails/InfoWrapper';
import FormField from 'components/FormField';
import Image from 'components/Image';
import Map from 'components/Map';
import Button from 'components/Button';

// ** Hooks-Services **
import useAuth from 'hooks/useAuth';
import useActivityInlineFormObject from 'pages/Activity/hooks/useActivityInlineFormObject';

// ** Constants **
import {
  BasicPermissionTypes,
  ModuleNames,
} from 'constant/permissions.constant';

// ** Types **
import {
  ActivityGuest,
  ActivityInfoPropsType,
  AddInlineActivityFormFields,
} from 'pages/Activity/types/activity.types';
import GuestList from './GuestList';
import { filterAccountData } from 'pages/Lead/helper/leads.helper';
import DateFormat from 'components/DateFormat';
import { NOTIFICATION_TYPE } from 'constant';
import {
  useSendInvitationMailMutation,
  useUpdateActivityMutation,
} from 'redux/api/activityApi';
import {
  useGetActivityDetail,
  useLoadOtherActivityRelatedDataHooks,
} from 'pages/Activity/hooks/useActivityService';
import { ACTIVITY_TYPE_MAIL_STATUS } from 'constant/activity.constant';

const ActivityInfo = (props: ActivityInfoPropsType) => {
  const {
    isLoading,
    activityDetail,
    onEdit,
    setIsOpenNotificationReminderModal,
    changeSetOpenModal,
  } = props;
  // ** Hooks ** //
  const dispatch = useDispatch();
  const section = useSelector(getDetailSection);
  const IsContactDetailsLoad = useSelector(getIsLoadDetailsLoad);

  // ** Ref **
  const buttonRef = useRef<HTMLButtonElement>(null);
  const divRefForInputField = useRef<HTMLDivElement>(null);
  const isKeyDownCreatableRef = useRef<any>(null);

  // ** states ** //
  const [isEditing, setIsEditing] =
    useState<keyof AddInlineActivityFormFields>();
  const [guestList, setGuestList] = useState<ActivityGuest[]>([]);
  const [isKeyDownCreatable, setIsKeyDownCreatable] = useState(false);
  const [accordion, setAccordion] = useState<{ [key: string]: boolean }>({
    ...(section?.[`${activityDetail.id}_activity`] || {
      info: true,
      lead: true,
      desc: true,
      guest: true,
      cusField: true,
      coll: true,
      followers: true,
      relContact: true,
    }),
  });

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    watch,
    getValues,
    control,
  } = useForm<AddInlineActivityFormFields>();

  const { formObject } = useActivityInlineFormObject({
    errors,
    register,
    control,
    setValue,
    setError,
    clearErrors,
    watch,
    isKeyDownCreatableRef,
    setIsKeyDownCreatable,
    activityDetail,
    getValues,
  });
  // ** APIS **
  const [updateActivityByIdAPI, { isLoading: isUpdateActivityLoading }] =
    useUpdateActivityMutation();
  const [
    senInvitationMailByIdAPI,
    { isLoading: isChangeActivityStatusLoading },
  ] = useSendInvitationMailMutation();

  // ** Custom Hooks
  const { hasAuthorized } = useAuth();
  const { activityTypeEmailStatus } = useLoadOtherActivityRelatedDataHooks();
  const { getActivity } = useGetActivityDetail();

  // constant ** //
  const editPermission = hasAuthorized([
    { module: ModuleNames.ACTIVITY, type: BasicPermissionTypes.UPDATE },
  ]);

  useEffect(() => {
    dispatch(
      setDetailSectionView({
        [`${activityDetail.id}_activity`]: { ...accordion },
      })
    );
  }, [accordion]);

  useEffect(() => {
    isKeyDownCreatableRef.current = '';
    setIsKeyDownCreatable(false);
  }, [isKeyDownCreatable]);

  useEffect(() => {
    if (isEditing) {
      divRefForInputField?.current?.querySelector('input')?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    // Reset For Inline Editing
    reset({
      topic: activityDetail.topic,
      agenda: activityDetail?.agenda,
      duration: activityDetail?.duration,
      availability: activityDetail?.availability,
      assigned_to_id: activityDetail?.assigned_to_id,
      activity_account: activityDetail?.activity_account?.id,
      activity_contact: activityDetail?.activity_contact?.id,
      activity_lead_id: activityDetail?.activity_lead_id,
      activity_type_id: activityDetail?.activity_type_id,
      start_date: activityDetail?.start_date,
    });
    updateGuestData();
  }, [
    activityDetail.agenda,
    activityDetail?.activity_participants?.length,
    activityDetail?.guests?.length,
    activityDetail,
  ]);

  useEffect(() => {
    updateGuestData();
  }, [activityDetail?.activity_participants, activityDetail?.guests]);

  const openCloseAccordion = (accType: string) => {
    setAccordion({
      ...accordion,
      [accType]: !accordion[accType],
    });
  };

  const updateGuestData = () => {
    const contactGuest = _.cloneDeep(activityDetail?.activity_participants)
      ?.sort((a, b) => a.id - b.id)
      ?.map((val) => ({
        name: val?.contact?.name,
        email: val?.contact?.emails?.filter((mail) => mail?.is_primary)[0]
          ?.value,
        phone: val?.contact?.phones?.filter((phone) => phone?.is_primary)[0]
          ?.value,
        phoneType:
          val?.contact?.phones?.filter((phone) => phone?.is_primary)[0]
            ?.phoneType || '',
        is_confirm: val?.is_confirm,
        job_role: val?.contact?.job_role,
        id: val?.contact?.id,
        address1: val.contact?.address1 || '',
        address2: val.contact?.address2,
        city: val.contact?.city,
        state: val?.contact?.state,
        country: val?.contact?.country,
        zip: val.contact?.zip,
        meeting_status: val?.meeting_status,
        activity_email_setting: val?.activity_email_setting,
        email_status: val?.activity_email_setting?.[0].email_status,
        is_mail_sent_success:
          val?.activity_email_setting?.[0].is_mail_sent_success,
      }));

    const guestData = (activityDetail?.guests || [])?.map((val) => ({
      email: val.email,
      is_confirm: val.is_confirm,
      is_new_guest: true,
      meeting_status: val?.meeting_status,
      email_status: val?.email_status,
      is_mail_sent_success: val?.is_mail_sent_success,
    }));

    setGuestList([...guestData, ...contactGuest]);
  };

  const guestEmailStatus = Object.values(activityDetail?.guests)?.every(item => {
    if (!item.hasOwnProperty('is_mail_sent_success')) {
      return item.email_status === ACTIVITY_TYPE_MAIL_STATUS.MANUAL;
    }
    return item.is_mail_sent_success === false && item.email_status === ACTIVITY_TYPE_MAIL_STATUS.MANUAL;
  });

  const participateEmailStatus = Object.values(activityDetail?.activity_participants)?.every(item => {
    const activeData = item?.activity_email_setting?.[0];
    if (item?.activity_email_setting == null) {
      return false;
    }
    if (!activeData?.hasOwnProperty('is_mail_sent_success')) {
      return item?.activity_email_setting?.[0].email_status === ACTIVITY_TYPE_MAIL_STATUS.MANUAL;
    }
    return item?.activity_email_setting?.every(items => items?.is_mail_sent_success === false && items?.email_status === ACTIVITY_TYPE_MAIL_STATUS.MANUAL);
  });


  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.shiftKey && e.key === 'Enter' && isEditing === 'agenda') {
      return;
    }
    if (e.key === 'Enter' && isEditing === 'agenda') {
      e.preventDefault();
      return handleAutoSave();
    }
    if (e.key === 'Enter') {
      handleAutoSave();
    }
  };

  const handleAutoSave = () => {
    const excludeFields = [''];
    if (buttonRef?.current && !excludeFields.includes(isEditing || '')) {
      buttonRef.current?.click();
    }
    if (
      buttonRef?.current &&
      excludeFields.includes(isEditing || '') &&
      isKeyDownCreatableRef.current !== 'is_new'
    ) {
      buttonRef.current?.click();
    }
    isKeyDownCreatableRef.current = '';
  };

  const onSave = (key: keyof AddInlineActivityFormFields) =>
    handleSubmit(async (values) => {
      const ActivityFormObj = new FormData();
      Object.keys(values).forEach((val) => {
        const keyName = val as keyof typeof values;

        if (values[keyName] || values[keyName] === null) {
          ActivityFormObj.set(val, values[keyName]?.toString()?.trim() || '');
        }
      });
      const ActivityFormData = new FormData();
      ActivityFormData.set(key, ActivityFormObj.get(key) || '');

      // Inline Editing Update Account
      if (values.activity_account) {
        ActivityFormData.set(
          'activity_account',
          JSON.stringify(
            filterAccountData({
              entity_record_id: values.activity_account,
              isLeadOrLead: false,
            })
          )
        );
      }

      // inline editing set mail status
      const activityTypeEmailStatusData = activityTypeEmailStatus?.get(
        values.activity_type_id || 0
      );

      if (activityTypeEmailStatusData === ACTIVITY_TYPE_MAIL_STATUS.AUTOMATIC) {
        ActivityFormData.set('should_send_mail', 'true');
      } else if (
        activityTypeEmailStatusData === ACTIVITY_TYPE_MAIL_STATUS.MANUAL
      ) {
        ActivityFormData.set('should_send_mail', 'false');
      } else {
        ActivityFormData.set('should_send_mail', 'false');
      }

      ActivityFormData.set('email_status', `${activityTypeEmailStatusData}`);

      // Inline Editing Update Contact
      if (values.activity_contact) {
        ActivityFormData.set(
          'activity_contact',
          JSON.stringify(
            filterAccountData({
              entity_record_id: values.activity_contact,
              isLeadOrLead: false,
            })
          )
        );
      }

      // Inline Editing Collaborators
      const deleteActivityUsers = activityDetail?.activity_collaborators
        ?.filter(
          (user: { user_id: number }) =>
            !values.activity_collaborators?.includes(user.user_id)
        )
        ?.map((val: { id: number }) => val.id);
      const newActivityUsers = values.activity_collaborators?.filter(
        (val) =>
          !activityDetail?.activity_collaborators?.find(
            (user: { user_id: number }) => user.user_id === val
          )
      );
      ActivityFormData.set(
        'activity_collaborators',
        JSON.stringify({
          new: newActivityUsers,
          deleted: deleteActivityUsers,
        })
      );
      // inline Editing Location
      const ActivityLocation = values.location as any;
      ActivityFormData.set(
        'location_details',
        JSON.stringify(
          typeof ActivityLocation === 'object'
            ? ActivityLocation
            : { title: ActivityLocation }
        )
      );
      if (_.isEqual(activityDetail?.location, values.location)) {
        ActivityFormData.delete('location_details');
      }
      // Inline Editing Start Time
      if (values.start_time) {
        ActivityFormData.set('start_date', values.start_time as string);
      }
      ActivityFormData.delete('start_time');
      // API Call For Update
      const data = await updateActivityByIdAPI({
        id: activityDetail.id,
        data: ActivityFormData,
      });

      if ('data' in data && IsContactDetailsLoad) {
        dispatch(
          setLoadDetails({
            loadModuleDetails: {
              ...IsContactDetailsLoad,
              activity: true,
            },
          })
        );
        if (data?.data?.start_date) {
          // setIsEditing(undefined);

          onEdit?.(data);
        }
      }
    });

  // sent activity invitation mail
  const sendActivityInvitationMail = async (
    guestData: ActivityGuest[],
    id: number
  ) => {
    await sendMailToGuestApi(guestData, id);
  };

  const sendMailToGuestApi = async (guestData: ActivityGuest[], id: number) => {
    const GuestEmailData: ActivityGuest[] = [];
    const ParticipantData: ActivityGuest[] = [];

    // generate guest and participant form data
    const ActivityTypeFormData = new FormData();
    guestData?.forEach((val) => {
      if (val?.name) {
        const obj = {
          email: val?.email,
          participantId: val?.id,
        };
        ParticipantData.push(obj);
      } else {
        const obj = {
          email: val?.email,
        };
        GuestEmailData.push(obj);
      }
    });

    const activityTypeMailStatusData = activityTypeEmailStatus?.get(
      activityDetail?.activity_type_id
    );

    ActivityTypeFormData.append(
      'email_status',
      JSON.stringify(activityTypeMailStatusData)
    );
    ActivityTypeFormData.append('should_send_mail', 'true');
    ActivityTypeFormData.append('guest', JSON.stringify(GuestEmailData));
    ActivityTypeFormData.append('participant', JSON.stringify(ParticipantData));
    ActivityTypeFormData.append('activityId', JSON.stringify(id));

    const data = await senInvitationMailByIdAPI({
      data: ActivityTypeFormData,
    });
    if (data) {
      getActivity(activityDetail?.id);
    }
  };

  // Reminder Content
  const ReminderContent = useCallback(() => {
    return activityDetail?.notifications?.length > 0 ? (
      <div>
        <span className="inline-block mr-[5px]">
          {activityDetail?.notifications?.[0]?.duration}{' '}
          {
            NOTIFICATION_TYPE?.find(
              (type) =>
                type.value === activityDetail?.notifications?.[0]?.durationType
            )?.label
          }{' '}
          Before
        </span>
        {activityDetail?.notifications?.length > 1 ? (
          <span
            className="inline-block text-primaryColor cursor-pointer hover:underline"
            onClick={() => setIsOpenNotificationReminderModal(true)}
          >
            See all
          </span>
        ) : (
          <></>
        )}
      </div>
    ) : (
      <span
        className="text-light__TextColor cursor-pointer"
        onClick={() => setIsOpenNotificationReminderModal(true)}
      >
        + Add
      </span>
    );
  }, [activityDetail]);

  // Collaborators Content
  const CollaboratorsContent = useCallback(() => {
    const totalColl = activityDetail?.activity_collaborators?.length;
    const firstTwoColl = activityDetail?.activity_collaborators?.slice(0, 2);
    return activityDetail?.activity_collaborators?.length > 0 ? (
      <div>
        <span className="mr-[5px]">
          {(firstTwoColl || []).map((coll, index) => {
            return (
              <span key={coll.id}>
                {coll.user.first_name} {coll.user.last_name}
                {index === 0 && totalColl > 1 ? ', ' : ''}
              </span>
            );
          })}
        </span>
        {activityDetail?.activity_collaborators?.length > 2 ? (
          <span className="inline-block text-primaryColor cursor-pointer hover:underline">
            +{totalColl - 2} Other
          </span>
        ) : (
          <></>
        )}
      </div>
    ) : (
      <span className="text-black__TextColor600">+ Add</span>
    );
  }, [activityDetail]);
  // Guests Content
  const GuestsContent = useCallback(() => {
    const totalPar = activityDetail?.activity_participants?.length;
    const allGuests: { id: number; label: string }[] = [];

    // HELLO
    activityDetail?.activity_participants.forEach((participant) => {
      if (
        participant?.contact?.id &&
        participant.contact?.name &&
        participant?.contact?.emails?.length > 0
      ) {
        allGuests.push({
          id: participant.contact?.id,
          label: participant.contact?.name,
        });
      }
    });
    activityDetail?.guests?.forEach((guests, index) => {
      allGuests.push({
        id: totalPar + index,
        label: guests.email,
      });
    });
    const firstTwoColl = allGuests?.slice(0, 1);

    return allGuests?.length > 0 ? (
      <div
        className="cursor-pointer"
        onClick={() => {
          changeSetOpenModal('editScroll');
        }}
      >
        <span className="mr-[5px]">
          {(firstTwoColl || []).map((participant, index) => {
            return (
              <span key={participant.id}>
                {participant.label}
                {index === 0 && totalPar > 1 ? ', ' : ''}
              </span>
            );
          })}
        </span>
        {allGuests.length > 1 ? (
          <span className="inline-block text-primaryColor cursor-pointer hover:underline">
            +{allGuests.length - 1} Other
          </span>
        ) : (
          <></>
        )}
      </div>
    ) : (
      <span
        className="text-light__TextColor cursor-pointer"
        onClick={() => {
          changeSetOpenModal('editScroll');
        }}
      >
        + Add
      </span>
    );
  }, [activityDetail]);

  const guestData = guestList.filter((val) => val.email);

  useEffect(() => {
    if (isLoading === false) {
      setIsEditing(undefined);
    }
  }, [isLoading]);

  return (
    <>
      <div className="activity__innerPage__wrapper">
        <div className="activity__info mb-[30px]">
          <div className="flex flex-wrap items-center bg-[#ECF2F6] rounded-[12px] py-[10px] px-[24px] pr-[10px] mb-[15px] 3xl:pl-[15px]">
            <span className="text text-[16px] font-biotif__Medium text-ipBlack__textColor w-[calc(100%_-_32px)] pr-[10px]">
              Activity Details
            </span>
            <button
              className={`section__toggle__btn w-[30px] h-[30px] rounded-[7px] text-[0px] relative duration-500 hover:bg-white before:content-[""] before:absolute before:top-[12px] before:left-[10px] before:w-[10px] before:h-[10px] before:border-l-[2px] before:border-l-black before:border-b-[2px] before:border-b-black ${accordion.info
                ? 'before:rotate-[135deg] before:top-[12px]'
                : 'before:-rotate-45 before:top-[7px]'
                } `}
              onClick={() => openCloseAccordion('info')}
            >
              .
            </button>
          </div>
          {accordion.info && (
            <div className="border border-[#CCCCCC]/50 rounded-[12px] p-[24px] 3xl:p-[15px]">
              <div className="inline__editing__btn__static">
                <div
                  onKeyDown={(e) => handleKeyDown(e)}
                  ref={divRefForInputField}
                  className="flex flex-wrap mx-[-10px]"
                >
                  <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Title</p>
                    <pre className="ipInfo__View__Value whitespace-normal">
                      <Editable
                        onCancel={() => setIsEditing(undefined)}
                        setIsEditing={() => setIsEditing('topic')}
                        isEditing={isEditing === 'topic'}
                        isLoading={isUpdateActivityLoading}
                        onSave={onSave('topic')}
                        editComponent={formObject.information.topic}
                        disabled={!editPermission}
                        buttonRef={buttonRef}
                      >
                        <InfoWrapper field={`${activityDetail?.topic}`} />
                      </Editable>
                    </pre>
                  </div>
                  <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Deal or Lead</p>
                    <pre className="ipInfo__View__Value whitespace-normal">
                      <Editable
                        onCancel={() => setIsEditing(undefined)}
                        setIsEditing={() => setIsEditing('activity_lead_id')}
                        isEditing={isEditing === 'activity_lead_id'}
                        isLoading={isUpdateActivityLoading}
                        onSave={onSave('activity_lead_id')}
                        editComponent={formObject.information.activity_lead_id}
                        disabled={!editPermission}
                        buttonRef={buttonRef}
                      >
                        <InfoWrapper
                          field={`${activityDetail?.activity_lead?.name}`}
                        />
                      </Editable>
                    </pre>
                  </div>
                  <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Guests</p>
                    <span className="ipInfo__View__Value whitespace-normal ">
                      <GuestsContent />
                    </span>
                  </div>
                  <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Activity Type</p>
                    <pre className="ipInfo__View__Value whitespace-normal">
                      <Editable
                        onCancel={() => setIsEditing(undefined)}
                        setIsEditing={() => setIsEditing('activity_type_id')}
                        isEditing={isEditing === 'activity_type_id'}
                        isLoading={isUpdateActivityLoading}
                        onSave={onSave('activity_type_id')}
                        editComponent={formObject.information.activity_type_id}
                        disabled={!editPermission}
                        buttonRef={buttonRef}
                      >
                        <InfoWrapper
                          field={`${activityDetail?.activity_type?.name}`}
                        />
                      </Editable>
                    </pre>
                  </div>
                  <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Account</p>
                    <pre className="ipInfo__View__Value whitespace-normal">
                      <Editable
                        onCancel={() => setIsEditing(undefined)}
                        setIsEditing={() => setIsEditing('activity_account')}
                        isEditing={isEditing === 'activity_account'}
                        isLoading={isUpdateActivityLoading}
                        onSave={onSave('activity_account')}
                        editComponent={formObject.information.activity_account}
                        disabled={!editPermission}
                        buttonRef={buttonRef}
                        isSaveButtonDisable={false}
                      >
                        <InfoWrapper
                          field={`${activityDetail?.activity_account?.name}`}
                        />
                      </Editable>
                    </pre>
                  </div>
                  <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Video Call</p>
                    <span className="ipInfo__View__Value whitespace-normal">
                      {activityDetail?.zoom_meeting_details?.start_url ? (
                        <a
                          href={`${activityDetail.zoom_meeting_details.start_url}`}
                        >
                          Zoom Integration
                        </a>
                      ) : (
                        <>-</>
                      )}
                    </span>
                  </div>
                  <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Start Date</p>
                    <pre className="ipInfo__View__Value whitespace-normal">
                      <Editable
                        onCancel={() => setIsEditing(undefined)}
                        setIsEditing={() => setIsEditing('start_date')}
                        isEditing={isEditing === 'start_date'}
                        isLoading={isUpdateActivityLoading}
                        onSave={onSave('start_date')}
                        editComponent={formObject.information.start_date}
                        disabled={!editPermission}
                        buttonRef={buttonRef}
                      >
                        <InfoWrapper
                          field={
                            <DateFormat
                              format="EEEE, d MMM yyyy"
                              date={activityDetail.start_date}
                            />
                          }
                        />
                      </Editable>
                    </pre>
                  </div>
                  <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Location</p>
                    <pre className="ipInfo__View__Value whitespace-normal">
                      <Editable
                        onCancel={() => setIsEditing(undefined)}
                        setIsEditing={() => setIsEditing('location')}
                        isEditing={isEditing === 'location'}
                        isLoading={isUpdateActivityLoading}
                        onSave={onSave('location')}
                        editComponent={formObject.information.location}
                        disabled={!editPermission}
                        buttonRef={buttonRef}
                      >
                        <InfoWrapper
                          field={activityDetail?.location_details?.title}
                        />
                      </Editable>
                    </pre>
                  </div>
                  <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Reminder</p>
                    <span className="ipInfo__View__Value whitespace-normal">
                      <ReminderContent />
                    </span>
                  </div>
                  <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Start Time</p>
                    <pre className="ipInfo__View__Value whitespace-normal">
                      <Editable
                        onCancel={() => setIsEditing(undefined)}
                        setIsEditing={() => setIsEditing('start_time')}
                        isEditing={isEditing === 'start_time'}
                        isLoading={isUpdateActivityLoading}
                        onSave={onSave('start_time')}
                        editComponent={formObject.information.start_time}
                        disabled={!editPermission}
                        buttonRef={buttonRef}
                      >
                        <InfoWrapper
                          field={
                            <DateFormat
                              format="hh:mm aa"
                              date={activityDetail.start_date}
                            />
                          }
                        />
                      </Editable>
                    </pre>
                  </div>
                  <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Availability</p>
                    <pre className="ipInfo__View__Value whitespace-normal">
                      <Editable
                        onCancel={() => setIsEditing(undefined)}
                        setIsEditing={() => setIsEditing('availability')}
                        isEditing={isEditing === 'availability'}
                        isLoading={isUpdateActivityLoading}
                        onSave={onSave('availability')}
                        editComponent={formObject.information.availability}
                        disabled={!editPermission}
                        buttonRef={buttonRef}
                      >
                        <InfoWrapper field={activityDetail?.availability} />
                      </Editable>
                    </pre>
                  </div>
                  <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Contact</p>
                    <pre className="ipInfo__View__Value whitespace-normal">
                      <Editable
                        onCancel={() => setIsEditing(undefined)}
                        setIsEditing={() => setIsEditing('activity_contact')}
                        isEditing={isEditing === 'activity_contact'}
                        isLoading={isUpdateActivityLoading}
                        onSave={onSave('activity_contact')}
                        editComponent={formObject.information.activity_contact}
                        disabled={!editPermission}
                        buttonRef={buttonRef}
                      >
                        <InfoWrapper
                          field={`${activityDetail?.activity_contact?.name}`}
                        />
                      </Editable>
                    </pre>
                  </div>
                  <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Duration</p>
                    {activityDetail.all_day ? (
                      <span className="ipInfo__View__Value whitespace-normal">
                        All day
                      </span>
                    ) : (
                      <pre className="ipInfo__View__Value whitespace-normal">
                        <Editable
                          onCancel={() => setIsEditing(undefined)}
                          setIsEditing={() => setIsEditing('duration')}
                          isEditing={isEditing === 'duration'}
                          isLoading={isUpdateActivityLoading}
                          onSave={onSave('duration')}
                          editComponent={formObject.information.duration}
                          disabled={!editPermission}
                          buttonRef={buttonRef}
                        >
                          <InfoWrapper
                            field={`${activityDetail?.duration} Minute`}
                          />
                        </Editable>
                      </pre>
                    )}
                  </div>
                  <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Collaborators</p>
                    <pre className="ipInfo__View__Value whitespace-normal">
                      <Editable
                        onCancel={() => setIsEditing(undefined)}
                        setIsEditing={() =>
                          setIsEditing('activity_collaborators')
                        }
                        isEditing={isEditing === 'activity_collaborators'}
                        isLoading={isUpdateActivityLoading}
                        onSave={onSave('activity_collaborators')}
                        editComponent={
                          formObject.information.activity_collaborators
                        }
                        disabled={!editPermission}
                        buttonRef={buttonRef}
                      >
                        <CollaboratorsContent />
                      </Editable>
                    </pre>
                  </div>
                  <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Assigned To</p>
                    <pre className="ipInfo__View__Value whitespace-normal">
                      <Editable
                        onCancel={() => setIsEditing(undefined)}
                        setIsEditing={() => setIsEditing('assigned_to_id')}
                        isEditing={isEditing === 'assigned_to_id'}
                        isLoading={isUpdateActivityLoading}
                        onSave={onSave('assigned_to_id')}
                        editComponent={formObject.information.assigned_to_id}
                        disabled={!editPermission}
                        buttonRef={buttonRef}
                      >
                        <InfoWrapper
                          field={`${activityDetail?.assigned_to?.first_name} ${activityDetail?.assigned_to?.last_name}`}
                        />
                      </Editable>
                    </pre>
                  </div>
                  <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Description</p>
                    <pre className="ipInfo__View__Value">
                      <Editable
                        onCancel={() => setIsEditing(undefined)}
                        setIsEditing={() => setIsEditing('agenda')}
                        isEditing={isEditing === 'agenda'}
                        isLoading={isUpdateActivityLoading}
                        onSave={onSave('agenda')}
                        editComponent={formObject.information.agenda}
                        disabled={!editPermission}
                        buttonRef={buttonRef}
                      >
                        <InfoWrapper
                          field={activityDetail?.agenda}
                          readMoreEnable
                        />
                      </Editable>
                    </pre>
                  </div>
                  <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Completion Time</p>
                    <span className="ipInfo__View__Value whitespace-normal">
                      {activityDetail.completion_date ? (
                        <DateFormat
                          format="EEEE, d MMM yyyy"
                          date={activityDetail.completion_date}
                        />
                      ) : (
                        '-'
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {guestData.length > 0 && (
          <>
            <div className="guests__wrapper mb-[30px]">
              <div className="flex flex-wrap items-center justify-between bg-[#ECF2F6] rounded-[12px] py-[10px] px-[24px] pr-[10px] mb-[15px] 3xl:pl-[15px]">
                <span className="text text-[16px] font-biotif__Medium text-ipBlack__textColor w-[calc(100%_-_174px)] pr-[10px]">
                  Guests
                </span>
                <div className="flex items-center">
                  {participateEmailStatus && guestEmailStatus ? (
                    <Button
                      isLoading={isChangeActivityStatusLoading}
                      className="i__Button primary__Btn smaller__with__icon h-[30px] px-[20px] mr-[10px]"
                      onClick={() =>
                        sendActivityInvitationMail(guestData, activityDetail.id)
                      }
                    >
                      Send mail
                    </Button>
                  ) : (
                    <></>
                  )}
                  <button
                    className={`section__toggle__btn w-[30px] h-[30px] rounded-[7px] text-[0px] relative duration-500 hover:bg-white before:content-[""] before:absolute before:top-[12px] before:left-[10px] before:w-[10px] before:h-[10px] before:border-l-[2px] before:border-l-black before:border-b-[2px] before:border-b-black ${accordion.guest
                      ? 'before:rotate-[135deg] before:top-[12px]'
                      : 'before:-rotate-45 before:top-[7px]'
                      } `}
                    onClick={() => openCloseAccordion('guest')}
                  >
                    .
                  </button>
                </div>
              </div>
              {accordion.guest && (
                <div className="border border-[#CCCCCC]/50 rounded-[12px] p-[24px] pb-[4px] 3xl:p-[15px] 3xl:pb-0 sm:p-0 sm:border-0">
                  <div className="flex flex-wrap mx-[-10px] 3xl:mx-[-7px]">
                    {Children.toArray(
                      guestData?.map((guest) => {
                        return (
                          <GuestList
                            guest={guest}
                            key={guest.id}
                            activityDetail={activityDetail}
                          />
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <div className="mb-[30px] sm:mb-[10px] hidden">
          <div className="flex flex-wrap items-center bg-[#ECF2F6] rounded-[12px] py-[10px] px-[24px] pr-[10px] mb-[15px] 3xl:pl-[15px]">
            <span className="text text-[16px] font-biotif__Medium text-ipBlack__textColor w-[calc(100%_-_32px)] pr-[10px]">
              Custom Fields
            </span>
            <button
              className={`section__toggle__btn w-[30px] h-[30px] rounded-[7px] text-[0px] relative duration-500 hover:bg-white before:content-[""] before:absolute before:top-[12px] before:left-[10px] before:w-[10px] before:h-[10px] before:border-l-[2px] before:border-l-black before:border-b-[2px] before:border-b-black ${accordion.cusField
                ? 'before:rotate-[135deg] before:top-[12px]'
                : 'before:-rotate-45 before:top-[7px]'
                } `}
              onClick={() => openCloseAccordion('cusField')}
            >
              .
            </button>
          </div>
          {accordion.cusField && (
            <div className="customFields__wrapper border border-[#CCCCCC]/50 rounded-[12px] p-[24px] pb-[4px] 3xl:p-[15px] 3xl:pb-0 sm:p-0 sm:border-0">
              <div className="inner__width w-[860px] max-w-full">
                <div className="mx-[-15px] flex flex-wrap sm:mx-[-8px]">
                  <div className="px-[15px] w-1/2 sm:px-[8px]">
                    <FormField
                      type="text"
                      name="name"
                      label="Current road Blocks"
                      labelClass="if__label__blue"
                      placeholder="Call"
                    />
                  </div>
                  <div className="px-[15px] w-1/2 sm:px-[8px]">
                    <FormField
                      type="text"
                      name="name"
                      label="pain Points"
                      labelClass="if__label__blue"
                      placeholder="Call"
                    />
                  </div>
                </div>
                <div className="mx-[-15px] flex flex-wrap sm:mx-[-8px]">
                  <div className="px-[15px] w-1/2 sm:px-[8px]">
                    <FormField
                      type="text"
                      name="name"
                      label="Other Decision Makers"
                      labelClass="if__label__blue"
                      placeholder="Call"
                    />
                  </div>
                  <div className="px-[15px] w-1/2 sm:px-[8px]">
                    <FormField
                      type="text"
                      name="name"
                      label="Current Software"
                      labelClass="if__label__blue"
                      placeholder="Call"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {(activityDetail?.activity_collaborators || [])?.length > 0 && (
          <>
            <div className="collaborators__wrapper mb-[30px]">
              <div className="flex flex-wrap items-center bg-[#ECF2F6] rounded-[12px] py-[10px] px-[24px] pr-[10px] mb-[15px] 3xl:pl-[15px]">
                <span className="text text-[16px] font-biotif__Medium text-ipBlack__textColor w-[calc(100%_-_32px)] pr-[10px]">
                  Collaborators
                </span>
                <button
                  className={`section__toggle__btn w-[30px] h-[30px] rounded-[7px] text-[0px] relative duration-500 hover:bg-white before:content-[""] before:absolute before:top-[12px] before:left-[10px] before:w-[10px] before:h-[10px] before:border-l-[2px] before:border-l-black before:border-b-[2px] before:border-b-black ${accordion.coll
                    ? 'before:rotate-[135deg] before:top-[12px]'
                    : 'before:-rotate-45 before:top-[7px]'
                    } `}
                  onClick={() => openCloseAccordion('coll')}
                >
                  .
                </button>
              </div>
              {accordion.coll && (
                <div className="border border-[#CCCCCC]/50 rounded-[12px] p-[24px] pb-[4px] 3xl:p-[15px] 3xl:pb-0 sm:p-0 sm:border-0">
                  <div className="flex flex-wrap mx-[-10px] 3xl:mx-[-7px]">
                    {Children.toArray(
                      (activityDetail?.activity_collaborators || []).map(
                        (val) => {
                          const { user } = val;
                          return (
                            <div className="w-1/4 px-[10px] mb-[20px] 4xl:w-1/3 3xl:w-1/2 3xl:px-[7px] 3xl:mb-[15px] xl:w-1/2 md:w-full sm:w-full sm:mb-[10px] sm:last:mb-0">
                              <div className="related__card__box related__collaborators__card__box">
                                <div className="inner__wrapper">
                                  <div className="img__wrapper">
                                    <Image
                                      imgPath={user?.profile_image}
                                      serverPath
                                      {...(!user?.profile_image && {
                                        first_name: user?.first_name,
                                        last_name: user?.last_name,
                                      })}
                                    />
                                  </div>
                                  <div className="right__details">
                                    <div className="details__wrapper w-full leading-[16px] mb-[3px]">
                                      {user?.first_name && (
                                        <span className="contact__name w-full hover:!no-underline">
                                          {user?.first_name}
                                        </span>
                                      )}
                                      {user?.phone ? (
                                        <p className="inline-flex text-[14px] text-black__TextColor600 font-biotif__Regular duration-500 hover:text-primaryColor hover:underline">
                                          <ClickableMobile
                                            number={user?.phone.toString()}
                                          />
                                        </p>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <FollowersSection
          accordion={accordion}
          followers={activityDetail?.activity_followers || []}
          count={activityDetail?.total_followers}
          openCloseAccordion={openCloseAccordion}
          module_name={ModuleNames.ACTIVITY}
          entityId={activityDetail.id || 0}
        />

        {activityDetail.location_details?.position?.lat &&
          activityDetail.location_details.position?.lng && (
            <div className="details__address__wrapper">
              <div className="flex flex-wrap items-center bg-[#ECF2F6] rounded-[12px] py-[10px] px-[15px] mb-[15px]">
                <span className="text text-[16px] font-biotif__Medium text-ipBlack__textColor w-[calc(100%_-_24px)] pl-[6px]">
                  Location
                </span>
              </div>
              <div className="activity__map border border-whiteScreen__BorderColor py-[10px] px-[10px] rounded-[12px]">
                <Map
                  data={{
                    latitude: activityDetail.location_details.position.lat,
                    longitude: activityDetail.location_details.position.lng,
                    name: activityDetail.location_details.title || '',
                  }}
                />
              </div>
            </div>
          )}
      </div>
    </>
  );
};

export default ActivityInfo;
