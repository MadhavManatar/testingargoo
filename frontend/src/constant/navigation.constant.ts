export const PUBLIC_NAVIGATION = Object.freeze({
  theme: '/theme',
  login: '/login',
  verify2FA: '/verify-2FA',
  register: '/register',
  forgotPassword: '/forgot-password',
  setPassword: '/set-password',
  verifyAccount: '/verify-account',
  notAuthorized: '/not-authorized',
  resetPassword: '/reset-password',
  mailConformation: '/mail-conformation',
  notFoundPage: '/404',
  meetingConfirmation: '/meeting-confirmation/:action',
});

export const PRIVATE_NAVIGATION = Object.freeze({
  dashboard: { view: '/' },
  leads: {
    view: '/leads',
    detailPage: '/leads/:id',
    edit: '/leads/edit/:id',
    convert: '/convert-lead/:id',
    add: '/lead',
  },
  contacts: {
    view: '/contacts',
    detailPage: '/contacts/:id',
    add: '/contact',
    edit: '/contacts/edit/:id',
  },
  deals: {
    view: '/deals',
    add: '/deal',
    detailPage: '/deals/:id',
    edit: '/deals/edit/:id',
    convert: '/convert-deal/:id',
  },
  accounts: {
    view: '/accounts',
    add: '/account',
    detailPage: '/accounts/:id',
    edit: '/accounts/edit/:id',
  },
  activities: {
    view: '/activities',
    detailPage: '/activities/:id',
    AddActivityMobileView: '/activities/mobile',
    EditActivityMobileView: '/activities/mobile/:id',
  },
  calendar: { view: '/calendar' },
  email: { view: '/email', detailPage: '/email/:id' },
  settings: {
    view: '/settings',
    generalSettings: {
      companyDetails: { view: '/settings/company-details' },
      personalSettings: { view: '/settings/personal-settings' },
      securitySettings: {
        view: '/settings/security-settings',
        manageSessions: {
          view: '/settings/security-settings/manage-sessions',
        },
        twoFactorAuthentication: {
          view: '/settings/security-settings/two-factor-authentication',
        },
        rules: {
          view: '/settings/security-settings/rules',
        },
        alerts: {
          view: '/settings/security-settings/alerts',
        },
      },
      commonControls: {
        tagControl: {
          view: '/settings/general-settings/common-control/tag-control',
        },
        restoreTime: {
          view: '/settings/general-settings/common-control/restore-setting',
        },
        phoneTypeSetting: {
          view: '/settings/general-settings/common-control/phone-type-setting',
        },
        leadDealSource: {
          view: '/settings/general-settings/common-control/lead-deal-source',
        },
        leadDealStatus: {
          view: '/settings/general-settings/common-control/lead-deal-status',
        },
        commonControl: {
          view: '/settings/general-settings/common-control',
        },
        notification: {
          view: '/settings/general-settings/common-control/notification',
        },
        trash: {
          view: '/settings/general-settings/common-control/trash',
        },
        snippet: {
          view: '/settings/general-settings/common-control/snippet',
        },
        zoomSettings: {
          view: '/settings/general-settings/common-control/zoom-settings',
        },
        iconSettings: {
          view: '/settings/general-settings/common-control/icon-settings',
        },
      },
      notifications: {
        notification: {
          view: '/settings/general-settings/notification',
        },
        following: {
          view: '/settings/general-settings/following',
        },
        schedule_email_timing: {
          view: '/settings/general-settings/schedule-email-timing',
        },
      },
    },
    user: {
      view: '/settings/user',
      edit: '/settings/user/edit/:id',
      detailPage: '/settings/user/:id',
    },
    profileAndPermissions: {
      view: '/settings/profile-permissions',
      create: '/settings/profile-permissions/new',
      edit: '/settings/profile-permissions/edit',
    },
    hierarchy: { view: '/settings/hierarchy' },
    department: {
      view: '/settings/department',
      create: '/settings/department/new',
      edit: '/settings/department/edit',
    },
    orgDepartment: {
      view: '/settings/org-department',
    },

    moduleSetting: {
      lead: {
        tempStatus: {
          view: '/settings/module-setting/lead/temperature-status',
        },
        status: { view: '/settings/module-setting/lead/status' },
        name: { view: '/settings/module-setting/lead/name' },
        leadSetting: {
          view: '/settings/module-setting/lead-setting',
        },
      },
      deal: {
        generalSetting: {
          view: '/settings/module-setting/deal/general-settings',
        },
        lostReason: {
          view: '/settings/module-setting/deal/lost-reasons',
        },
        pipeline: { view: '/settings/module-setting/deal/pipeline' },
        dealSetting: { view: '/settings/module-setting/deal-setting' },
        closingDateSetting: {
          view: '/settings/module-setting/deal/closing-date-settings',
        },
        name: { view: '/settings/module-setting/deal/name' },
      },
      activity: {
        timeSet: { view: '/settings/module-setting/activity/default-time-set' },
        activitySetting: { view: '/settings/module-setting/activity-setting' },
        defaultReminders: {
          view: '/settings/module-setting/activity/default-reminder',
          update: '/settings/module-setting/activity/default-reminder/:id',
        },
        calendarVisibility: {
          view: '/settings/module-setting/activity/calendar-visibility',
        },
        type: { view: '/settings/module-setting/activity/type' },
        result: { view: '/settings/module-setting/activity/result' },
        availability: {
          view: '/settings/module-setting/activity/availability',
        },
      },
      contact: {
        role: { view: '/settings/module-setting/contact/contact-type' },
        contactSetting: { view: '/settings/module-setting/contact-setting' },
      },
      account: {
        setting: { view: '/settings/module-setting/account/account-setting' },
        ParentAccount: {
          view: '/settings/module-setting/account/account/parent-account-enable',
        },
      },
    },
    emailSetting: {
      connect: { view: '/settings/email-setting/connect-email' },
      emailSetting: { view: '/settings/email-setting/email-setting' },
      calendarConferencing: {
        view: '/settings/email-setting/calendar-conferencing',
      },
      emailUndoSetting: { view: '/settings/email-setting/email-undo-setting' },
    },
  },
  streams: { view: '/streams', add: '/stream', detailPage: '/streams/:id' },
});

export const DESIGN_PAGE = Object.freeze({
  lead: '/design/lead',
  deal: '/design/deal',
  activity: '/design/activity',
  email: '/design/email',
  emailSetting: '/design/emailSetting',
  newActivityModal: '/design/new-activity-type-modal',
});
