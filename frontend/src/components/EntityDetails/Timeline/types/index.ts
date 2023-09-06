// ** Import Package **

// ** Constant **
import { TimelineModelName } from 'constant/timeline.constant';
import { ActivityResponseType } from 'pages/Activity/types/activity.types';
import { EmailDetail } from 'pages/Email/types/email.type';

// ** Type **
import { UserResponse } from 'pages/Setting/user-setting/User/types/user.types';

export enum TIMELINE_SECTION_TYPE {
  INFO = 'info',
  ACTIVITY = 'activities',
  NOTE = 'note',
  DOCUMENT = 'document',
  EMAIL = 'emails',
}

export type TimelineMessageType = {
  fieldName: string;
  oldValue: TimelineMessageValueType;
  newValue: TimelineMessageValueType;
};

export type TimelineMessageValueType = {
  [key: string]: any;
  model_name?: string;
  model_record_id?: number;
  value?: string | number;
  tagColor?: string;
  emailFrom?: string;
  emailTo?: string;
  emailSubject?: string;
  emailDescription?: string;
  short_description?: string;
};

export type TimelineType = {
  id: number;
  organization_id: number;
  model_name: string;
  model_record_id: number;
  message: TimelineMessageType;
  is_pinned?: boolean;
  type: string;
  relation_model_name?: string;
  relation_model_record_id?: number;
  relation_model_group_record_id?: string;
  creation_mode: string;
  creation_source?: string;
  created_by: number;
  note?: NoteTimeline;
  email?: EmailDetail;
  documents?: DocumentTimeline[];
  creator: { first_name: string; last_name: string; profile_image: string, initial_color?: string };
  timeline_date?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
  comments: Comments[];
  reactions: Reactions[];
  activities: ActivityResponseType;
  action: string;
  accounts: {
    id: number;
    name: string;
  };
  related_activities: {
    id: number;
    topic: string;
  };
  leads: {
    id: number;
    name: string;
  };
  contacts: {
    id: number;
    name: string;
  };
};

export type Comments = {
  id: number;
  organization_id: number;
  timeline_id: number;
  creator: {
    full_name: string;
    id: number;
    first_name: string;
    last_name: string;
    profile_image: string;
    initial_color?: string;
  };
  reactions: Reactions[];
  comment: string;
  user_id: number;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
};

export type Reactions = {
  id: number;
  organization_id: number;
  model_name: string;
  model_record_id: number;
  reaction: string;
  user_id: number;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  creator: {
    full_name: string;
    id: number;
    first_name: string;
    last_name: string;
    profile_image: string;
  };
};

export type DocumentTimeline = {
  id: number;
  organization_id: number;
  model_record_id: number;
  model_name: string;
  type: string;
  url: string;
  group_id?: string;
  doc_details: Record<string, any>;
  created_by: number;
  updated_by: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
};

export type NoteTimeline = {
  id: number;
  organization_id: number;
  name: string;
  model_record_id: number;
  model_name: string;
  description: string;
  documents: DocumentTimeline[];
  is_drafted: boolean;
  created_by: number;
  updated_by: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
};

export type TagTimeline = {
  id: number;
  model_name: string;
  model_record_id: number;
  organization_id: number;
  created_at: Date | string;
  updated_at: Date | string;
  tag_id: number;
  deleted_at?: Date | string;
  tag: Tag;
};

export type Tag = {
  id: number;
  name: string;
  color: string;
  organization_id?: number;
  created_by: number;
  updated_by: number;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
};

export type TagListType = {
  newValue: Tag[];
  oldValue: Tag[] | null;
};

export enum HISTORY_ACTION {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  CONVERT = 'CONVERT',
  COMPLETED = 'COMPLETED',
  REOPENED = 'REOPENED',
}

export enum HistoryDataTypes {
  TIME = 'Time',
  DATE_TIME = 'DateTime',
  DATE = 'Date',
  MOBILE_NO = 'MobileNo',
  CURRENCY = 'Currency',
}
export type HistoryDataChildType = {
  id?: number;
  value?: any;
  type?: HistoryDataTypes;
};
export interface LogPairValue {
  old_value: HistoryDataChildType | HistoryDataChildType[];
  new_value: HistoryDataChildType | HistoryDataChildType[];
  displayLabel?: string;
}

// this type inner history data type
export type HistoryDataType = {
  [key: string]: LogPairValue;
};

// document timeline start -->
export type DocumentDataChildType = {
  mimeType?: HistoryDataChildType;
  original_name?: HistoryDataChildType;
  size?: HistoryDataChildType;
  type?: { value: 'file' | 'link' };
  url?: HistoryDataChildType;
  id?: HistoryDataChildType;
};

export interface DocumentHistoryLogPairValue {
  old_value: DocumentDataChildType | DocumentDataChildType[];
  new_value: DocumentDataChildType | DocumentDataChildType[];
}

export type DocumentHistoryDataType = {
  [key: string]: DocumentHistoryLogPairValue;
};

// this type inner history data type
export type CombineHistoryDataType = {
  [key: string]:
    | {
        old_value: HistoryDataChildType | HistoryDataChildType[];
        new_value: HistoryDataChildType | HistoryDataChildType[];
        displayLabel?: string;
      }
    | HistoryDataType;
};

// this type main history obj
export type HistoryType = {
  title: string | null;
  record_label: string | null;
  action: HISTORY_ACTION;
  model_name: TimelineModelName;
  model_record_id: number;
  data: CombineHistoryDataType;
  created_at: string;
  creator: UserResponse;
};

export enum TIMELINE_ACTION {
  CREATE = 'Created',
  UPDATE = 'Updated',
  RESTORED='Restored',
  DELETE = 'Deleted',
  CONVERT = 'Converted',
  COMPLETE = 'Completed',
  REOPEN = 'Reopened',
  REMOVE = 'Removed',
  ASSIGN = 'Assigned',
  FOLLOW_UP = 'Follow Up',
}

export type TimelineFilterType = {
  allItemFilter?: AllItemFilter;
  userIds: number[];
  relatedContactIds: number[];
  startDate: string;
  endDate: string;
  search: string;
};

export type object_type = {
  [key: string]: {
    ids: number[];
  };
};

export type TimelineFilerIdsObj = {
  [key: string]: object_type;
};

export type selectAllForActivityType = {
  [key: string]: {
    isSelect: boolean;
  };
};

export type AllItemFilter = {
  activityTypeIds: number[];
  notes: boolean;
  documents: boolean;
  info: boolean;
  emails_sent: boolean;
  emails_received: boolean;
  selectAllForActivityType?: selectAllForActivityType;
  hideRelatedRecord: boolean;
};

export type TimelineOpenActivityModalType = {
  view: boolean;
  id: number | null;
  activityTopic: string;
  edit: boolean;
  complete: boolean;
  activityTypeId?: number;
  historyId?: number | null;
  model_record_id?: number | null;
  model_name?: string;
};
