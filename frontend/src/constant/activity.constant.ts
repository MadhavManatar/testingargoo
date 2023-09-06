export enum ACTIVITY_REPEAT_TYPE {
  NONE = 'NONE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum ACTIVITY_PROVIDER {
  ZOOM = 'zoom',
}

export const WEEK_DAYS = Object.freeze([
  { label: 'Mon', value: 'MO' },
  { label: 'Tue', value: 'TU' },
  { label: 'Wed', value: 'WE' },
  { label: 'Thu', value: 'TH' },
  { label: 'Fri', value: 'FR' },
  { label: 'Sat', value: 'SA' },
  { label: 'Sun', value: 'SU' },
]);

export const ACTIVITY_TYPE_MAIL_STATUS_OPTIONS = Object.freeze([
  { label: 'Automatic', value: 'automatic' },
  { label: 'Manual', value: 'manual' },
  { label: 'Disabled', value: 'disabled' },
]);

export const ACTIVITY_TYPE_MAIL_STATUS = Object.freeze({
  AUTOMATIC: 'automatic',
  MANUAL: 'manual',
  DISABLED: 'disabled',
});

export const ACTIVITY_REPEAT_TYPE_OPTIONS = Object.freeze([
  { label: 'None', value: 'NONE' },
  { label: 'Daily', value: 'DAILY' },
  { label: 'Weekly', value: 'WEEKLY' },
  { label: 'Monthly', value: 'MONTHLY' },
  { label: 'Yearly', value: 'YEARLY' },
]);

export const ACTIVITY_END = Object.freeze([
  { label: 'on', value: 'until' },
  { label: 'after', value: 'count' },
]);

export const ONE_DAY_MILLISECONDS = 1000 * 3600 * 24;
export const ONE_MINUTE_MILLISECONDS = 60000;
