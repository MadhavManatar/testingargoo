// ** Icon **
import { IconTypes } from 'components/Icon';

// ** Constant **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

export interface SettingSidebarInterface {
  id: string;
  label: string;
  link: string;
  icon?: IconTypes;
}

export const SETTING_SIDEBAR = Object.freeze({
  commonControls: [
    {
      id: 'tag-control',
      label: 'Tag Control',
      link: PRIVATE_NAVIGATION.settings.generalSettings.commonControls
        .tagControl.view,
    },
    {
      id: 'restore-setting',
      label: 'Restore Setting',
      link: PRIVATE_NAVIGATION.settings.generalSettings.commonControls
        .restoreTime.view,
    },
    {
      id: 'phone-type-settings',
      label: 'Phone Type Control',
      link: PRIVATE_NAVIGATION.settings.generalSettings.commonControls
        .phoneTypeSetting.view,
    },
    {
      id: 'lead-deal-source',
      label: 'Lead/Deal Source',
      link: PRIVATE_NAVIGATION.settings.generalSettings.commonControls
        .leadDealSource.view,
    },
    {
      id: 'trash',
      label: 'Trash',
      link: PRIVATE_NAVIGATION.settings.generalSettings.commonControls.trash
        .view,
    },
    {
      id: 'lead-deal-status',
      label: 'Lead/Deal Status',
      link: PRIVATE_NAVIGATION.settings.generalSettings.commonControls
        .leadDealStatus.view,
    },
    {
      id: 'snippet-settings',
      label: 'Snippet Settings',
      link: PRIVATE_NAVIGATION.settings.generalSettings.commonControls.snippet
        .view,
    },
    // {
    //   id: 'zoom-settings',
    //   label: 'Zoom Settings',
    //   link: PRIVATE_NAVIGATION.settings.generalSettings.commonControls
    //     .zoomSettings.view,
    // },
    {
      id: 'icon-setting',
      label: 'Animated Icon Settings',
      link: PRIVATE_NAVIGATION.settings.generalSettings.commonControls
        .iconSettings.view,
    },
  ],

  notification: [
    {
      id: 'notification',
      label: 'Notification',
      link: PRIVATE_NAVIGATION.settings.generalSettings.notifications
        .notification.view,
    },
    {
      id: 'following',
      label: 'Following',
      link: PRIVATE_NAVIGATION.settings.generalSettings.notifications.following
        .view,
    },
    {
      id: 'schedule-email-timing',
      label: 'Schedule Email Timing',
      link: PRIVATE_NAVIGATION.settings.generalSettings.notifications
        .schedule_email_timing.view,
    },
  ],

  leadSettings: [
    {
      id: 'temp-status',
      label: 'Temperature Status',
      link: PRIVATE_NAVIGATION.settings.moduleSetting.lead.tempStatus.view,
    },
  ],
  dealSetting: [
    {
      id: 'general-settings',
      label: 'General Settings',
      link: PRIVATE_NAVIGATION.settings.moduleSetting.deal.generalSetting.view,
    },
    {
      id: 'lost-reasons',
      label: 'Lost Reasons',
      link: PRIVATE_NAVIGATION.settings.moduleSetting.deal.lostReason.view,
    },
    {
      id: 'pipeline',
      label: 'Pipeline',
      link: PRIVATE_NAVIGATION.settings.moduleSetting.deal.pipeline.view,
    },
    {
      id: 'closing-date-settings',
      label: 'Closing Date Settings',
      link: PRIVATE_NAVIGATION.settings.moduleSetting.deal.closingDateSetting
        .view,
    },
  ],
  activitySetting: [
    {
      id: 'default-time-set',
      label: 'Default Time Set',
      link: PRIVATE_NAVIGATION.settings.moduleSetting.activity.timeSet.view,
    },
    {
      id: 'activity-type',
      label: 'Type',
      link: PRIVATE_NAVIGATION.settings.moduleSetting.activity.type.view,
    },
    {
      id: 'calendar-visibility',
      label: 'Activity Visibility',
      link: PRIVATE_NAVIGATION.settings.moduleSetting.activity
        .calendarVisibility.view,
    },
    {
      id: 'activity-result',
      label: 'Result',
      link: PRIVATE_NAVIGATION.settings.moduleSetting.activity.result.view,
    },
    {
      id: 'activity-availability',
      label: 'Availability',
      link: PRIVATE_NAVIGATION.settings.moduleSetting.activity.availability
        .view,
    },
    {
      id: 'notification-time',
      label: 'Default Reminders',
      link: PRIVATE_NAVIGATION.settings.moduleSetting.activity.defaultReminders
        .view,
    },
  ],
  contactSetting: [
    {
      id: 'contact-type',
      label: 'Job Role',
      link: PRIVATE_NAVIGATION.settings.moduleSetting.contact.role.view,
    },
  ],
  accountSetting: [
    {
      id: 'parent-account-enable',
      label: 'Parent Account Enable Setting',
      link: PRIVATE_NAVIGATION.settings.moduleSetting.account.ParentAccount
        .view,
    },
  ],
  emailSetting: [
    {
      id: 'connect-email',
      label: 'Connect Email',
      link: PRIVATE_NAVIGATION.settings.emailSetting.connect.view,
    },
    {
      id: 'calendar-conferencing',
      label: 'Calendar & Conferencing',
      link: PRIVATE_NAVIGATION.settings.emailSetting.calendarConferencing.view,
    },
    {
      id: 'email-undo-setting',
      label: 'Email Undo Setting',
      link: PRIVATE_NAVIGATION.settings.emailSetting.emailUndoSetting.view,
    },
  ],
  securitySettings: [
    {
      id: 'manage-sessions',
      label: 'Manage Sessions',
      link: PRIVATE_NAVIGATION.settings.generalSettings.securitySettings
        .manageSessions.view,
    },
    {
      id: 'two-factor-authentication',
      label: 'Two Factor Authentication',
      link: PRIVATE_NAVIGATION.settings.generalSettings.securitySettings
        .twoFactorAuthentication.view,
    },
    {
      id: 'rules',
      label: 'Rules',
      link: PRIVATE_NAVIGATION.settings.generalSettings.securitySettings.rules
        .view,
    },
    {
      id: 'alerts',
      label: 'Alerts',
      link: PRIVATE_NAVIGATION.settings.generalSettings.securitySettings.alerts
        .view,
    },
  ],
});
