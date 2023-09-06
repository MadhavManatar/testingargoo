// ** Redux **
import { EntityAttributesEnum } from 'redux/api/entityAttributesApi';
import { GENERAL_SETTING_KEY } from 'redux/api/types/generalSettingApit.types';

export const RELOAD_DATA_KEY = {
  GENERAL_SETTING: 'GENERAL_SETTING',
  ENTITY_ATTRIBUTE: 'ENTITY_ATTRIBUTE',
  SNIPPET_SETTING: 'SNIPPET_SETTING',
  SNIPPET_CATEGORY: 'SNIPPET_CATEGORY',
  TAG: 'TAG',
  PIPELINE: 'PIPELINE',
  ACTIVITY: 'ACTIVITY',
  ACTIVITY_TYPE: 'ACTIVITY_TYPE',
  ACTIVITY_RESULT: 'ACTIVITY_RESULT',
};

export const RELOAD_DATA_SUB_KEY = {
  ...GENERAL_SETTING_KEY,
  ...EntityAttributesEnum,
};

export type INVALID_TAG_TYPE =
  | 'GENERAL_SETTING'
  | 'ENTITY_ATTRIBUTE'
  | 'SNIPPET_SETTING'
  | 'SNIPPET_CATEGORY'
  | 'GMAIL'
  | 'TAG'
  | 'PIPELINE'
  | 'ACTIVITY'
  | 'ACTIVITY_TYPE'
  | 'ACTIVITY_RESULT'
  | 'ZOOM'
  | 'CONTACT'
  | 'NOTE'
  | 'ROLE'
  | 'DEPARTMENT'
  | 'LEAD'
  | 'ACCOUNT'
  | 'DEAL_STAGE_HISTORY'
  | 'NOTIFICATION_SETTING'
  | 'SCHEDULE_ACTIVITY'
  | 'COMPANY_DETAIL'
  | 'TIMELINE'
  | 'USER'
  | 'COLUMN'
  | 'COLUMN_VIEWS'
  | 'DEAL_STAGE_HISTORY'
  | 'COMMENT';

export type INVALID_ENTITY_TAG_TYPE =
  | 'LEAD_TEMP_STATUS'
  | 'LEAD_STATUS'
  | 'PHONE_TYPE'
  | 'JOB_ROLE'
  | 'LEAD_DEAL_SOURCE'
  | 'DEAL_LOST_REASON'
  | 'is_address_auto_typed'
  | 'default_activity_time_interval'
  | 'is_memo_allowed_in_deal_lost'
  | 'is_memo_allowed_in_activity_result'
  | 'lead_name_settings'
  | 'deal_closing_date_color_settings_time_frame'
  | 'deal_closing_date_color_settings_neutral_color'
  | 'deal_closing_date_color_settings_warning_color'
  | 'deal_closing_date_color_settings_passed_due_color'
  | 'is_sub_account_enable'
  | 'deal_name_settings'
  | 'default_activity_availability'
  | 'mail_undo_send';
