// ** components ** //
import { CountryType, StateType } from 'components/Address/types/address.types';
import { IconTypes } from 'components/Icon';

// ** Types ** //
import { AssignTagCommonProps } from 'components/detail-components/AssignTags/types/assignTags.type';

// ** others ** //
import { ModuleNames } from 'constant/permissions.constant';
import { User } from 'pages/Setting/user-setting/User/types/user.types';
import { FollowEntityType } from 'pages/types';
import { Dispatch, SetStateAction } from 'react';

export type AddActivityFormFields = {
  completed?: boolean;
  is_visibility?: boolean;
  result?: string;
  topic: string;
  activity_type_id: number;
  activity_type_is_default: boolean;
  activity_type: string;
  host_id: string;
  status: number;
  all_day: boolean;
  agenda: string;
  location: string | object;
  location_details: object;
  provider_type: string;
  availability: string;
  guests: [];
  activity_collaborators: number[];
  activity_account: string | number;
  activity_contact: string | number;
  activity_lead_id: number;
  join_link: string;
  zoom_meeting_details: object;
  provider_meeting_id: string;
  start_link: string;
  start_date: string;
  start_time: string;
  duration: number;
  assigned_to_id: number;
  notifications: {
    notificationType: string;
    duration: number;
    durationType: number;
  }[];
  should_send_mail: boolean;
  email_status: string;
};

export type ActivityGuest = {
  id?: number;
  job_role?: string;
  name?: string;
  email: string;
  is_confirm?: boolean;
  meeting_status?: string;
  phone?: string;
  phoneType?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  is_new_guest?: boolean;
  email_status?: string;
  is_mail_sent_success?: boolean;
  activity_email_setting?: {
    email_status?: string;
    is_mail_sent_success?: boolean;
  }[];
};

export type ActivityModalName = {
  add: boolean;
  edit: boolean;
  delete: boolean;
  addTag: boolean;
  complete: boolean;
  activityId?: number;
  activityTypeId?: number;
  view: boolean;
  activityTopic?: string;
  manageColumn?: boolean;
  editActivityFormData?: AddActivityFormFields;
  saveAndDoneApiCall?: (formValue: MarkAsDoneFormFields) => void;
  saveAsView: boolean;
};

export type OpenActivityModalFrom = 'compose' | undefined;

export type AddInlineActivityFormFields = {
  agenda: string;
  duration: number | string;
  availability?: string;
  assigned_to_id: number;
  activity_account?: number | string;
  activity_contact?: number | string;
  activity_lead_id?: number;
  activity_type_id?: number;
  start_date: string | Date;
  start_time: string | Date;
  topic: string;
  activity_collaborators: number[];
  location: {
    title: string;
    position: {
      lat: number | string;
      lng: number | string;
    };
  };
};

type ActivityInlineInfoFieldType =
  | 'duration'
  | 'topic'
  | 'availability'
  | 'activity_account'
  | 'activity_contact'
  | 'activity_lead_id'
  | 'activity_type_id'
  | 'start_date'
  | 'start_time'
  | 'activity_collaborators'
  | 'agenda'
  | 'location'
  | 'assigned_to_id';

export type ActivityFormObject = {
  information: {
    [key in ActivityInlineInfoFieldType]: JSX.Element;
  };
};

export type activityGuestsType = {
  email: string;
  is_confirm: boolean;
  id?: number;
  meeting_status?: string;
  email_status?: string;
  should_send_mail?: boolean;
  is_mail_sent_success?: boolean;
};

export type ActivityParticipantType = {
  participant_type: string;
  participant_id: number;
  id: number;
  meeting_status?: string;
  contact: {
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
    job_role: string;
    id: number;
    name: string;
    emails: { value: string; is_primary: boolean }[];
    phones: { is_primary: false; phoneType: null; value: '' }[];
  };
  is_confirm: boolean;
  activity_email_setting?: {
    email_status?: string;
    is_mail_sent_success?: boolean;
  }[];
};

export type ActivityResponseType = {
  id: number;
  is_visibility: boolean;
  follow_up_activity?: {
    start_date: string;
  };
  notesData?: {
    description: string;
  }[];
  job_role?: string;
  following_activity_id?: number;
  following_activites?: { id: number; topic: string; start_date: Date };
  topic: string;
  status?: string;
  is_confirmed?: boolean;
  meeting_status?: string;
  notifications: {
    notificationType: string;
    duration: number;
    durationType: number;
  }[];
  deal_stage_history?: [
    { id: string | number; stage: { id: number; name: string } }
  ];
  activity_type_id: number;
  activity_account_id: number;
  activity_lead_id: number;
  availability: string;
  guests: activityGuestsType[];
  is_active: boolean;
  all_day: boolean;
  start_date: string;
  completion_date: string;
  duration: number;
  host_id: number;
  completed_by: number;
  location: string;
  location_details: { [key: string]: any };
  provider_meeting_id: string;
  start_link: string;
  join_link: string;
  zoom_meeting_details: { [key: string]: any };
  agenda: string;
  organization_id: number;
  activity_result: { id: number; result: string };
  host: {
    id: number;
    username: string | null;
    first_name: string;
    last_name: string;
    email: string;
  };
  assigned_to_id: number;
  assigned_to: { id: number; first_name: string; last_name: string };
  activity_type: {
    icon?: IconTypes;
    icon_type: string;
    name: string;
    id: number;
    is_default?: boolean;
    color: string;
  };
  activity_meeting_bot: {
    activity_id: number;
    bot_id: string | null;
    transcript_path: any;
    path: string | null;
    summary?: string | null;
  }[];
  activity_collaborators: ActivityCollaboratorsType[];
  collaborators?: {
    full_name: string;
  }[];

  creator: { first_name: string; last_name: string };
  modifier: { first_name: string; last_name: string };
  activity_time_logs: activityLogResponse;
  activity_lead: {
    deal_stage_history?: [
      { id: string | number; stage: { id: number; name: string } }
    ];
    id: number;
    name: string;
    is_deal: boolean;
    closing_date?: string;
    deal_value?: string;
    lead_owner?: { id: number; first_name: string; last_name: string };
    lead_source?: { id: number; name: string };
    pipeline?: { id: number; name: string };
  };
  activity_account: {
    id: number;
    name: string;
    emails: { value: string; isPrimary: boolean }[];
    phones: { value: string; phoneType: string; isPrimary: boolean }[];
    address1?: string;
    address2?: string;
    zip?: string;
    country?: CountryType;
    state?: StateType;
    city?: string;
  };
  activity_participants: ActivityParticipantType[];

  activity_contact: {
    id: number;
    name: string;
    job_role: string;
    address1?: string;
    address2?: string;
    zip?: string;
    country?: CountryType;
    state?: StateType;
    city?: string;
    emails: { value: string; is_primary: boolean }[];
    phones: { value: string; phoneType: string; is_primary: boolean }[];
  };
  activity_zoom_call_recordings: {
    activity_id: number;
    call_id: string;
    created_at: string;
    deleted_at?: string;
    id: number;
    organization_id: number;
    path: string;
    transcript_path: string;
    updated_at: string;
  }[];
  created_at: string;
  updated_at: string;
  result: string;
  memo: string;
  activity_followers?: ActivityFollowersType[];
  total_followers?: number;
  is_following?: 0 | 1;
};

export type ActivityCollaboratorsType = {
  id: number;
  activity_id: number;
  user_id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    username: null;
    profile_image: string;
    email: string;
    phone: string;
  };
};

export type activityLogResponse = {
  id: number;
  activity_id: number;
  start_date: string;
  end_date: string;
  organization_id: number;
  created_by: number;
  updated_by: number;
  deleted_at: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}[];
export type activityTypeResponse = {
  icon: IconTypes;
  icon_type: string;
  name: string;
  id: number;
  parent_type_id?: number;
  is_default?: boolean;
};

export type zoomIsExistResponseType = {
  exist: boolean;
  tokenData: {
    token_provider_mail: string;
    user_id: number;
  }[];
};

export type MarkAsDoneFormFields = {
  result: string;
  other_result: string;
  memo: string;
  is_memo_required: boolean;
};

export type upcomingActivityTypes = {
  start_date: string;
  activity_type: { name: string };
  id: number;
  type: string;
  from: string;
  topic: string;
};

export type ActivityGuestContactsDataType = {
  id: number;
  name: string;
  emails: { is_primary: boolean; value: string }[];
}[];

export type ContactGuestEmailsType = {
  participant_id: number;
  participant_type: string;
  participant_emails: string[];
  activity_email_setting?: {
    email_status: string;
    should_send_mail: boolean;
  }[];
}[];

export type entityDataType = {
  type: ModuleNames;
  id: number;
  name: string;
};
export type relatedEntityDataType = {
  contact?: {
    id: number;
    name: string;
    email?: string;
  };
  account?: {
    id: number;
    name: string;
  };
};
export type activityEntityDataType = {
  type: ModuleNames;
  id: number;
  name: string;
};
export type miniCalenderDataType = {
  Id: number;
  Subject: string;
  ActivityIcon: string;
  StartTime: Date;
  EndTime: Date;
  IsAllDay?: boolean;
  icon_type: string;
  isReadonly?: boolean;
  isTimeUpdated?: boolean;
};

// ** Empty activity response ** //
export const emptyActivityResponse = {
  notifications: [],
  is_visibility: false,
  activity_account: { id: 0, name: '', phones: [], emails: [] },
  activity_account_id: 0,
  following_activity_id: 0,
  activity_contact: {
    id: 0,
    name: '',
    job_role: '',
    phones: [],
    emails: [],
    address1: '',
    address2: '',
    zip: '',
    city: '',
    state: {
      id: 0,
      name: '',
      state_code: '',
    },
    country: {
      id: 0,
      name: '',
      iso3: '',
      iso2: '',
    },
  },
  activity_meeting_bot: [
    {
      activity_id: 0,
      bot_id: '',
      transcript_path: null,
      path: '',
      summary: null,
    },
  ],
  activity_lead: {
    id: 0,
    name: '',
    is_deal: false,
    city: { id: 0, name: '' },
    state: { id: 0, name: '', state_code: '' },
    country: { id: 0, name: '', iso3: '', iso2: '' },
  },
  activity_lead_id: 0,
  activity_time_logs: [],
  activity_type: { icon_type: '', id: 0, name: '', color: '' },
  activity_result: { id: 0, result: '' },
  activity_type_id: 0,
  agenda: '',
  activity_collaborators: [],
  availability: '',
  completed_by: 0,
  completion_date: '',
  all_day: false,
  creator: { first_name: '', last_name: '' },
  assigned_to_id: 0,
  assigned_to: { id: 0, first_name: '', last_name: '' },
  duration: 0,
  guests: [],
  host: { email: '', first_name: '', id: 0, last_name: '', username: '' },
  host_id: 0,
  id: 0,
  is_active: false,
  join_link: '',
  location: '',
  location_details: {},
  modifier: { first_name: '', last_name: '' },
  organization_id: 0,
  activity_participants: [],
  zoom_meeting_details: {},
  provider_meeting_id: '',
  activity_zoom_call_recordings: [],
  start_date: '',
  start_link: '',
  status: '',
  topic: '',
  created_at: '',
  updated_at: '',
  result: '',
  memo: '',
};

export type ModalTypeProps =
  | 'complete'
  | 'edit'
  | 'tag'
  | 'note'
  | 'editScroll'
  | 'attachment'
  | 'reOpen';

export interface ActivityDetailHeaderProps extends AssignTagCommonProps {
  openNotificationReminderModal: boolean;
  setIsOpenNotificationReminderModal: Dispatch<SetStateAction<boolean>>;
  isMobileView: boolean;
  isUpdateActivityStatusLoading: boolean;
  activityDetail: ActivityResponseType;
  invokeActivityDetailApiCall: (valId: number | null) => void;
  getAssignedTags: () => Promise<void>;
  openModal: ModalProps;
  onEdit: ((data: any) => void) | undefined;
  isChangeActivityStatusLoading: boolean;
  activityRunningStatus: {
    status: boolean;
    log: activityLogResponse;
  };
  setActivityRunningStatus: React.Dispatch<
    React.SetStateAction<{ status: boolean; log: activityLogResponse }>
  >;
  changeSetOpenModal: (val: ModalTypeProps) => void;
  startOrStopActivity: (is_active: boolean) => Promise<void>;
  changeActivityCompleteStatus: () => void;
  closeModal: () => void;
  activityIdFromParentComponent: number;
  activityCompleteStatus: boolean;
}

export type ActivityHeaderInfo = {
  activityType: string;
  activityRunningStatus: string;
  contactName: JSX.Element;
  contactJobRole: string;
  contactNameAndJobRoleComma: string;
  accountName: JSX.Element;
  dealOrLeadName: JSX.Element;
  contactPrimaryEmail: string;
  contactPrimaryPhone: {
    value: string;
    phoneType: string;
    is_primary: boolean;
  };
  formattedStartDate: string;
  formattedTime: string;
  formattedDuration: string;
  zoomMeetingLink: string;
  activityStatus: string;
  logOnTime: JSX.Element;
  title3: JSX.Element;
  reminder: {
    isShow: boolean;
    title: JSX.Element;
    singleReminder: JSX.Element;
    allReminder: JSX.Element;
  };
  isMeetingConfirmed: boolean;
};

export type ActivityInfoPropsType = {
  isLoading: boolean;
  openNotificationReminderModal: boolean;
  setIsOpenNotificationReminderModal: Dispatch<SetStateAction<boolean>>;
  activityDetail: ActivityResponseType;
  isMobileView: boolean;
  onEdit: ((data: any) => void) | undefined;
  isGetActivityDetailLoading?: boolean;
  changeSetOpenModal: (val: ModalTypeProps) => void;
};

export type ActivityFollowersType = {
  id?: number;
  follower_id: number;
  activity_id: number;
  organization_id: number;
  created_by: number;
  updated_by: number;
  creator?: Partial<User>;
  modifier?: Partial<User>;
  activity?: Partial<ActivityResponseType>;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
  follower: FollowEntityType;
};

export type ModalProps = {
  complete: boolean;
  edit: boolean;
  tag: boolean;
  note: boolean;
  attachment: boolean;
  editScroll?: boolean | undefined;
  reOpen: boolean;
};
