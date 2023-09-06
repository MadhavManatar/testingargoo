// ** external packages **
import { formatISO, startOfTomorrow, sub } from 'date-fns';
import { format } from 'date-fns-tz';
import addDays from 'date-fns/addDays';
import addHours from 'date-fns/addHours';
import nextMonday from 'date-fns/nextMonday';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';

// ** Types **
import { OrganizationCategoryOptions } from 'pages/auth/Register/types/register.types';
import { TokenProvider } from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';
import { snippetType } from 'pages/Setting/general-setting/common-controls/Snippet/SnippetSetting/types/snippetText.types';

export const ALLOWED_MIME_TYPES = Object.freeze([
  'image/png',
  'image/jpg',
  'image/jpeg',
]);

export const ORGANIZATION_CATEGORY_OPTIONS: readonly OrganizationCategoryOptions[] =
  Object.freeze([
    { label: 'E-commerce Business', value: 'E-commerce Business' },
    { label: 'Professional Services', value: 'Professional Services' },
    { label: 'Healthcare', value: 'Health Care' },
    { label: 'Computer Software', value: 'Computer Software' },
    { label: 'Financial Services', value: 'Financial Services' },
    { label: 'Other', value: 'Other' },
  ]);

export { BREAD_CRUMB } from './breadCrumb.constant';
export { FILE_EXTENSION } from './fileArray.constant';

export const DATE_FORMAT_ARRAY = Object.freeze([
  { label: 'DD/MM/YYYY', value: 'dd/MM/yyyy' },
  { label: 'YYYY/MM/DD', value: 'yyyy/MM/dd' },
  { label: 'MM/DD/YYYY', value: 'MM/dd/yyyy' },
]);

export const RATING_VALUE = Object.freeze([
  { label: '5', value: '5' },
  { label: '4', value: '4' },
  { label: '3', value: '3' },
  { label: '2', value: '2' },
  { label: '1', value: '1' },
]);

export const TAGS_COLOR = Object.freeze([
  '#1776ba',
  '#27ae60',
  '#ff3c3c',
  '#ffbf00',
  '#000000',
  '#6b31a0',
  '#3a25f1',
  '#91139e',
  '#076f9b',
]);

export enum TAB_NAME {
  LEAD = 'leads',
  ACTIVITIES = 'activities',
  CONTACTS = 'contacts',
  ACCOUNTS = 'accounts',
  DEALS = 'deals',
  DEPARTMENT = 'department',
}

export const TAB = {
  LEAD: TAB_NAME.LEAD,
  ACTIVITIES: TAB_NAME.ACTIVITIES,
  CONTACTS: TAB_NAME.CONTACTS,
  ACCOUNTS: TAB_NAME.ACCOUNTS,
  DEALS: TAB_NAME.DEALS,
  DEPARTMENT: TAB_NAME.DEPARTMENT,
};

export enum MODULE {
  Lead = 'Lead',
  Contact = 'Contact',
  Deal = 'Deal',
  Account = 'Account',
  Activity = 'Activity',
}

export const DATE_SLUG = {
  SEVEN_DAYS: '07_d',
  THIRTY_DAYS: '30_d',
  SIX_MONTHS: '06_m',
  ONE_YEARS: '01_y',
};

export const DATE_RANGE_DROPDOWN = Object.freeze([
  {
    label: 'Last 07 days',
    slug: DATE_SLUG.SEVEN_DAYS,
    value: formatISO(sub(new Date(), { days: 7 })),
  },
  {
    label: 'Last 30 days',
    slug: DATE_SLUG.THIRTY_DAYS,
    value: formatISO(sub(new Date(), { days: 30 })),
  },
  {
    label: 'Last 6 month',
    slug: DATE_SLUG.SIX_MONTHS,
    value: formatISO(sub(new Date(), { months: 6 })),
  },
  {
    label: 'Last Year',
    slug: DATE_SLUG.ONE_YEARS,
    value: formatISO(sub(new Date(), { years: 1 })),
  },
]);

export const LEAD_SCORE = Object.freeze([
  { label: '0', value: 0 },
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '30', value: 30 },
  { label: '40', value: 40 },
  { label: '50', value: 50 },
  { label: '60', value: 60 },
  { label: '70', value: 70 },
  { label: '80', value: 80 },
  { label: '90', value: 90 },
  { label: '100', value: 100 },
]);

export const STAGE_TYPES = Object.freeze([
  { label: 'Win', value: 'Win', color: 'green__' },
  { label: 'Lost', value: 'Lost', color: 'orange__' },
  { label: 'Neutral', value: 'Neutral', color: 'blue__' },
]);

export const LEAD_DEAL_STATUS = Object.freeze([
  { label: 'Active', value: 'Active' },
  { label: 'Running', value: 'Running' },
  { label: 'Inactive', value: 'Inactive' },
]);

export const GENERAL_SETTING_VALID_KEYS = Object.freeze({
  is_address_auto_typed: 'is_address_auto_typed',
  restore_data_time: 'restore_data_time',
  is_activity_calender_visibility: 'is_activity_calender_visibility',
  is_two_factor_authentication: 'is_two_factor_authentication',
  default_activity_time_interval: 'default_activity_time_interval',
  is_memo_allowed_in_deal_lost: 'is_memo_allowed_in_deal_lost',
  is_memo_allowed_in_activity_result: 'is_memo_allowed_in_activity_result',
  lead_name_settings: 'lead_name_settings',
  deal_name_settings: 'deal_name_settings',
  deal_closing_date_color_settings_time_frame:
    'deal_closing_date_color_settings_time_frame',
  deal_closing_date_color_settings_neutral_color:
    'deal_closing_date_color_settings_neutral_color',
  deal_closing_date_color_settings_warning_color:
    'deal_closing_date_color_settings_warning_color',
  deal_closing_date_color_settings_passed_due_color:
    'deal_closing_date_color_settings_passed_due_color',
  is_parent_account_enable: 'is_parent_account_enable',
  is_signature_auto_load: 'is_signature_auto_load',
  is_icon_animation_required: 'is_icon_animation_required',
});
export const ACTIVITY_AVAILABILITY = Object.freeze([
  { label: 'Free', value: 'Free' },
  { label: 'Busy', value: 'Busy' },
]);

export const EMAIL_DELAY_UNDO_TIME = Object.freeze([
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '30', value: 30 },
]);

export const INITIAL_MAIL_PROVIDER_ARRAY = Object.freeze([
  TokenProvider.GOOGLE_MAIL,
  TokenProvider.OUTLOOK,
]);

export const INITIAL_CALENDAR_PROVIDER_ARRAY_AND_CONFIGURE = Object.freeze([
  TokenProvider.GOOGLE_CALENDAR,
  TokenProvider.OFFICE_365_CALENDAR,
  TokenProvider.ZOOM,
]);

export const CALENDAR_PROVIDER_ARRAY = Object.freeze([
  TokenProvider.GOOGLE_CALENDAR,
  TokenProvider.OFFICE_365_CALENDAR,
]);

export const CONTACT_TYPES = Object.freeze([
  { label: 'Mobile', value: 'Mobile' },
  { label: 'Fax', value: 'Fax' },
  { label: 'Office', value: 'Office' },
]);

export const SCHEDULE_TIME = Object.freeze([
  {
    title: '1 Hour',
    name: 'hours1',
    value: addHours(new Date(), 1),
  },
  {
    title: '2 Hours',
    name: 'hours2',
    value: addHours(new Date(), 2),
  },
  {
    title: '4 Hours',
    name: 'hours4',
    value: addHours(new Date(), 4),
  },
  {
    title: 'Tomorrow morning',
    name: 'tomorrow_morning',
    subTitle: format(
      new Date(setHours(setMinutes(addDays(new Date(), 1), 0), 8)),
      'MMM, dd p'
    ),
    value: setHours(setMinutes(addDays(new Date(), 1), 0), 8),
  },
  {
    title: 'Tomorrow afternoon',
    name: 'tomorrow_afternoon',
    subTitle: format(
      new Date(setHours(startOfTomorrow(), 13)),
      'MMM, dd K:mm aa'
    ),
    value: setHours(startOfTomorrow(), 13),
  },
  {
    title: 'Monday Morning',
    name: 'monday_morning',
    subTitle: format(
      new Date(setHours(setMinutes(nextMonday(new Date()), 0), 8)),
      'MMM, dd p'
    ),
    value: setHours(setMinutes(nextMonday(new Date()), 0), 8),
  },
]);

export const STEPS = Object.freeze({
  COMPANY_DETAILS: 'companyDetail',
  VERIFY_EMAIL: 'verifyEmail',
  ORGANIZATION_FORM: 'organizationForm',
});

export const REGISTER_STEP = Object.freeze({
  BASIC_DETAILS: 'basicDetail',
  COMPANY_DETAILS: 'companyDetail',
  PASSWORD_DETAILS: 'passwordDetail',
  REGISTER_SUCCESS: 'registerSuccess',
  QUESTION_LIST: 'questionsList',
  VERIFY_EMAIL: 'verifyEmail',
  ORGANIZATION_FORM: 'organizationForm',
});

export const LOGIN_STEP = Object.freeze({
  LOGIN_FORM: 'loginForm',
  VERIFY_2FA: 'verify2FA',
  PASSWORD_EXPIRED: 'passExpired',
  COMPANY_DETAILS: 'companyDetail',
  VERIFY_EMAIL: 'verifyEmail',
  ORGANIZATION_FORM: 'organizationForm',
});

/**
 * converted value in minutes from corresponding label
 */
export const NOTIFICATION_TYPE = Object.freeze([
  { label: 'Minutes', value: 1 },
  { label: 'Hour', value: 60 },
  { label: 'Day', value: 1440 },
  { label: 'Week', value: 10080 },
]);

export const NOTIFICATION_INTERVAL_TIME =
  process.env.NODE_ENV === 'development' ? 60000 : 120000;

export const SCREEN_VIEW = Object.freeze({
  MOBILE: 576,
  TABLET: 768,
  SMALL_SCREEN: 1200,
  LARGE_SCREEN: 1441,
});

export const WEEKDAYS = Object.freeze([
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
]);

export const FILTER_TEXT_OPTIONS = Object.freeze([
  { value: 'ne', label: 'notEqual' },
  { value: 'notILike', label: 'notContains' },
  { value: 'iLike', label: 'contains' },
  { value: 'eq', label: 'equals' },
  { value: 'startsWith', label: 'startsWith' },
  { value: 'endsWith', label: 'endsWith' },
]);

export const FILTER_NUMBER_OPTIONS = Object.freeze([
  { value: 'eq', label: 'Equal' },
  { value: 'ne', label: 'Not qual' },
  { value: 'lt', label: 'Less than' },
  { value: 'lte', label: 'Less than or equals' },
  { value: 'gt	', label: 'Greater than' },
  { value: 'gte', label: 'Greater than or equals' },
  // { value: 'inRange', label: 'In Range' },
  // { value: 'blank', label: 'Blank' },
  // { value: 'notBlank', label: 'Not blank' },
]);

export const FILTER_DATE_OPTIONS = Object.freeze([
  { value: 'eq', label: 'Equal' },
  { value: 'gt', label: 'Greater than' },
  { value: 'lt', label: 'Less than' },
  { value: 'ne', label: 'Not equal' },
  // { value: 'inRange', label: 'In Range' },
  // { value: 'blank', label: 'Blank' },
  // { value: 'notBlank', label: 'Not blank' },
]);

export const MONTHS = Object.freeze([
  { label: 'Jan', val: 0 },
  { label: 'Feb', val: 1 },
  { label: 'Mar', val: 2 },
  { label: 'Apr', val: 3 },
  { label: 'May', val: 4 },
  { label: 'Jun', val: 5 },
  { label: 'Jul', val: 6 },
  { label: 'Aug', val: 7 },
  { label: 'Sep', val: 8 },
  { label: 'Oct', val: 9 },
  { label: 'Nov', val: 10 },
  { label: 'Dec', val: 11 },
]);

export const OCCURRENCE_ARRAY_FOR_MONTHS = Object.freeze([
  { label: 'First', value: 1 },
  { label: 'Second', value: 2 },
  { label: 'Third', value: 3 },
  { label: 'Fourth', value: 4 },
  { label: 'Fifth', value: 5 },
  { label: 'Last', value: -1 },
]);

export const MONTH_DAYS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31,
];

export const SYSTEM_DEFAULT_LABEL = 'System Default';

export const SNIPPET_DEFAULT_TYPE: { label: string; value: snippetType }[] = [
  { label: 'Activity Result', value: 'activity_result' },
  { label: 'Note', value: 'note' },
  { label: 'Email', value: 'email' },
  { label: 'Anywhere', value: 'anywhere' },
];

export const ACCESSIBILITY = [
  { label: 'Public', value: 'public' },
  { label: 'Private', value: 'private' },
];

export const IS_CACHING_ACTIVE = true;

export const DEAL_STAGE_VALUE = {
  CLOSED_WON: 'Win',
  CLOSED_LOST: 'Lost',
};

export const NAME_BADGE_COLOR_COMBINATIONS = [
  {
    bgColor: 'ipBlue__transparentBG',
    Color: 'ip__Blue',
  },
  {
    bgColor: 'ipOrange__transparentBG',
    Color: 'ip__Orange',
  },
  {
    bgColor: 'ipGreen__transparentBG',
    Color: 'ip__Green',
  },
  {
    bgColor: 'ipRed__transparentBG',
    Color: 'ip__Red',
  },
  {
    bgColor: 'ipYellow__transparentBG',
    Color: 'ip__Yellow',
  },
  {
    bgColor: 'ipGray__transparentBG',
    Color: 'dark__TextColor',
  },
];
