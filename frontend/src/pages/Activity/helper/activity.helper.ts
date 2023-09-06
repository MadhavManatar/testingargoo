/* eslint-disable no-lonely-if */
/* eslint-disable @typescript-eslint/no-unused-vars */
// ** import packages ** //
import { startOfDay } from 'date-fns';
import _ from 'lodash';

// ** types ** //
import {
  activityGuestsType,
  ActivityParticipantType,
  ActivityResponseType,
  AddActivityFormFields,
  ContactGuestEmailsType,
} from '../types/activity.types';

// ** others ** //
import { filterAccountData } from 'pages/Lead/helper/leads.helper';
import { generateCustomizeDate } from './dateAndTime.helper';
import { ACTIVITY_TYPE_MAIL_STATUS } from 'constant/activity.constant';

// ** Form Data Generation for Add Activity ** //
export const generateActivityFormData = (
  formVal: AddActivityFormFields,
  activityTypeEmailStatus?: Map<number, string> | undefined
) => {
  const ActivityLocation = formVal.location as any;

  const ActivityFormData = new FormData();
  const expectKeys = [
    'join_link',
    'provider_meeting_id',
    'start_link',
    'activity_type_is_default',
  ];
  Object.keys(formVal).forEach((val) => {
    const key = val as keyof typeof formVal;
    if ((!expectKeys.includes(key) && formVal[key]) || formVal[key] === null) {
      ActivityFormData.set(val, formVal[key]?.toString()?.trim() || '');
    }
  });

  if (formVal?.notifications && formVal?.notifications?.length) {
    ActivityFormData.set(
      'notifications',
      JSON.stringify(sortActivityReminders(formVal?.notifications))
    );
  }

  ActivityFormData.set(
    'zoom_meeting_details',
    JSON.stringify(formVal.zoom_meeting_details) || ''
  );

  ActivityFormData.set(
    'location_details',
    JSON.stringify(
      typeof ActivityLocation === 'object'
        ? ActivityLocation
        : { title: ActivityLocation }
    )
  );

  ActivityFormData.set(
    'activity_collaborators',
    JSON.stringify({
      new: formVal.activity_collaborators,
    })
  );
  if (activityTypeEmailStatus) {
    ActivityFormData.set(
      'email_status',
      activityTypeEmailStatus?.get(formVal?.activity_type_id) ||
        ACTIVITY_TYPE_MAIL_STATUS.DISABLED
    );
  }

  if (formVal.activity_contact) {
    ActivityFormData.set(
      'activity_contact',
      JSON.stringify(
        filterAccountData({
          entity_record_id: formVal.activity_contact,
          isLeadOrLead: true,
        })
      )
    );
  } else if (formVal.activity_contact === null) {
    ActivityFormData.set(
      'activity_contact',
      JSON.stringify(
        filterAccountData({
          entity_record_id: formVal.activity_contact,
          isLeadOrLead: true,
        })
      )
    );
  }
  if (formVal.activity_account) {
    ActivityFormData.set(
      'activity_account',
      JSON.stringify(
        filterAccountData({
          entity_record_id: formVal.activity_account,
          isLeadOrLead: true,
        })
      )
    );
  } else if (formVal.activity_account === null) {
    ActivityFormData.set(
      'activity_account',
      JSON.stringify(
        filterAccountData({
          entity_record_id: formVal.activity_account,
          isLeadOrLead: true,
        })
      )
    );
  }

  if (_.isBoolean(formVal?.is_visibility)) {
    ActivityFormData.set(
      'is_visibility',
      JSON.stringify(formVal.is_visibility)
    );
  }

  if (formVal.start_time) {
    ActivityFormData.set(
      'start_date',
      generateCustomizeDate(
        new Date(formVal.start_date),
        new Date(formVal.start_time)
      )?.toISOString()
    );
    ActivityFormData.set('all_day', 'false');
  } else {
    ActivityFormData.set(
      'start_date',
      startOfDay(new Date(formVal.start_date)).toISOString()
    );
    ActivityFormData.set('all_day', 'true');
  }

  ActivityFormData.delete('start_time');
  ActivityFormData.delete('activity_type');
  return ActivityFormData;
};

// ** Form Data Generation for Edit Activity ** //
type GenerateEditTimeActivityFormDataType = {
  value: AddActivityFormFields;
  activityDetail: ActivityResponseType;
  contactGuestEmails: ContactGuestEmailsType;
  guestEmails: activityGuestsType[];
  activityTypeEmailStatus: Map<number, string> | undefined;
};
export const generateEditTimeActivityFormData = (
  args: GenerateEditTimeActivityFormDataType
) => {
  const {
    activityDetail,
    contactGuestEmails,
    value,
    guestEmails,
    activityTypeEmailStatus,
  } = args;
  const ActivityFormData = generateActivityFormData(
    value,
    activityTypeEmailStatus
  );

  if (_.isEqual(activityDetail?.location, value.location)) {
    ActivityFormData.delete('location_details');
  }

  const activityTypeMailStatusData = activityTypeEmailStatus?.get(
    value?.activity_type_id
  );
  if (!value?.should_send_mail) {
    if (activityTypeMailStatusData === ACTIVITY_TYPE_MAIL_STATUS.AUTOMATIC) {
      ActivityFormData.set('should_send_mail', 'true');
    } else {
      ActivityFormData.set('should_send_mail', 'false');
    }
  }
  // filtering data for an users

  // ** collaborators(user) ** //
  // return the deleted collaborators  from the existing collaborators which is deleted by user
  const deleteActivityUsers = activityDetail?.activity_collaborators
    ?.filter(
      (user: { user_id: number }) =>
        !value.activity_collaborators?.includes(user.user_id)
    )
    ?.map((val: { id: number }) => val.id);

  // return the new participants apart from the existing collaborators which is added by user
  const newActivityUsers = value.activity_collaborators?.filter(
    (val) =>
      !activityDetail?.activity_collaborators?.find(
        (user: { user_id: number }) => user.user_id === val
      )
  );

  // ** update Activity **

  ActivityFormData.delete('activity_participants');
  ActivityFormData.delete('activity_collaborators');

  ActivityFormData.set(
    'activity_participants',
    JSON.stringify(
      filterActivityParticipantsData(
        activityDetail?.activity_participants,
        contactGuestEmails,
        'edit'
      )
    )
  );

  ActivityFormData.set(
    'activity_collaborators',
    JSON.stringify({
      new: newActivityUsers,
      deleted: deleteActivityUsers,
    })
  );
  let should_send_mail: boolean;
  const email_status =
    activityTypeMailStatusData || ACTIVITY_TYPE_MAIL_STATUS.DISABLED;

  // set activity guest data
  if (value?.should_send_mail) {
    should_send_mail = value?.should_send_mail;
  } else {
    if (activityTypeMailStatusData === ACTIVITY_TYPE_MAIL_STATUS.AUTOMATIC) {
      should_send_mail = true;
    } else {
      should_send_mail = false;
    }
  }

  const GuestEmailData = _.cloneDeep(guestEmails)?.map((data) => {
    if (!data?.email_status) {
      data.email_status = email_status;
    }
    if (!data.should_send_mail) {
      data.should_send_mail = should_send_mail;
    }
    return data;
  });

  ActivityFormData.set('guests', JSON.stringify(GuestEmailData));

  ActivityFormData.set(
    'toast_message',
    `${value.activity_type} Update Successfully`
  );

  return ActivityFormData;
};

// ** convert activity Participant to contact Guest ** //
export const convertActivityParticipantToContactGuests = (
  data: ActivityParticipantType[]
) => {
  const result =
    data?.map((participant) => {
      return {
        participant_id: participant?.id,
        participant_type: participant?.participant_type,
        participant_emails:
          participant.contact?.emails
            ?.filter((email) => email?.is_primary)
            .map((item) => item.value) || [],
        participant_name: participant?.contact?.name,
      };
    }) || [];
  return result;
};

// ** notification reminder sort**

export const sortActivityReminders = (
  notifications: {
    notificationType: string;
    duration: number;
    durationType: number;
  }[]
) => {
  const childSort = (
    a: {
      notificationType: string;
      duration: number;
      durationType: number;
    },
    b: {
      notificationType: string;
      duration: number;
      durationType: number;
    }
  ) => b.duration * b.durationType - a.duration * a.durationType;

  return notifications.sort(childSort);
};

// filtering data for guest

export const filterActivityParticipantsData = (
  activity_participants: ActivityParticipantType[],
  contactGuestEmails: ContactGuestEmailsType,
  action: 'add' | 'edit' | 'followUp'
) => {
  // ** participants(Guests)  ** //
  // return the deleted activity participants from the existing activity participants which is deleted by user

  const deletedParticipants = activity_participants
    ?.filter(
      (participant: { id: number }) =>
        !contactGuestEmails?.find(
          (contact) => contact.participant_id === participant.id
        )
    )
    ?.map((val: { id: number }) => val?.id);

  let newParticipants;
  if (action === 'followUp') {
    // we have to pass contactGuestEmails as new newParticipants;
    // so we find the contact details from existing data and generate ds according to when we pass participant on add activity.
    newParticipants = activity_participants
      ?.filter((participant: { id: number }) =>
        contactGuestEmails?.find(
          (contact) => contact.participant_id === participant.id
        )
      )
      ?.map((val) => ({
        participant_emails: val?.contact?.emails?.map((v) => v?.value),
        participant_id: val?.contact?.id,
        participant_name: val?.contact?.name,
        participant_type: 'contact',
      }));
  } else {
    // return the new activity participants apart from the existing activity participants which is added by user
    newParticipants = contactGuestEmails?.filter(
      (contact) =>
        !activity_participants?.find(
          (participant: { id: number }) =>
            participant.id === contact.participant_id
        )
    );
  }
  return {
    new: newParticipants,
    ...(action !== 'followUp' && { deleted: deletedParticipants }),
  };
};
