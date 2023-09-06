import { IconTypes } from 'components/Icon';
import { MODULE } from 'constant';

export enum TAB {
  INFO = 'INFO',
  TIMELINE = 'TIMELINE',
}

export enum ModalType {
  TAG = 'TAG',
  ATTACHMENT = 'ATTACHMENT',
  ACTIVITY = 'ACTIVITY',
  NOTE = 'NOTE',
  EDIT_NOTE = 'EDIT_NOTE',
  DELETE_NOTE = 'DELETE_NOTE',
  DOCUMENT = 'DOCUMENT',
  DOCUMENT_DELETE = 'DOCUMENT_DELETE',
  CONVERT_LEAD = 'CONVERT_LEAD',
  EDIT_ACTIVITY = 'EDIT_ACTIVITY',
}

export const TAB_DETAIL_OBJ: {
  [key in TAB]: { icon: IconTypes; label: string };
} = {
  [TAB.INFO]: {
    icon: 'infoFilled',
    label: 'Info',
  },
  [TAB.TIMELINE]: {
    icon: 'watchSquareFilled',
    label: 'Timeline',
    
  },
};

export const MODULE_ICON: {
  [key in MODULE]: { icon: IconTypes; label: string };
} = {
  [MODULE.Lead]: {
    icon: 'leadsFilledBlueIcon',
    label: 'Info',
  },
  [MODULE.Contact]: {
    icon: 'phoneFilled',
    label: 'Timeline',
  },
  [MODULE.Deal]: {
    icon: 'dealsFilledBlueIcon',
    label: 'Linked Activities',
  },
  [MODULE.Account]: {
    icon: 'accountFilledBlueIcon',
    label: 'Past Activities',
  },
  [MODULE.Activity]: {
    icon: 'activitiesFilledBlueIcon',
    label: 'Activity',
  },
};

export const STAY_TOUCH = [
  { label: 'View & Edit', value: 'addAndEdit' },
  { label: 'Remove Reminder', value: 'removeAndReminder' },
];
