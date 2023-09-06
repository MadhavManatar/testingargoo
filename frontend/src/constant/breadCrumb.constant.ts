// ** Constant **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

const isMobileView = window.screen.width < 756;

export const BREAD_CRUMB = Object.freeze({
  lead: {
    trails: [{ title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view }],
    title: 'Leads',
  },
  leadDetails: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Leads', path: PRIVATE_NAVIGATION.leads.view },
    ],
    title: 'Lead Details',
  },
  editLead: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Leads', path: PRIVATE_NAVIGATION.leads.view },
    ],
    title: 'Edit Lead',
  },
  addLead: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Leads', path: PRIVATE_NAVIGATION.leads.view },
    ],
    title: 'Add Lead',
  },
  contacts: {
    trails: [{ title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view }],
    title: 'Contacts',
  },
  contactDetails: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Contacts', path: PRIVATE_NAVIGATION.contacts.view },
    ],
    title: 'Contact Details',
  },
  addContact: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Contacts', path: PRIVATE_NAVIGATION.contacts.view },
    ],
    title: 'Add Contact',
  },
  editContact: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Contacts', path: PRIVATE_NAVIGATION.contacts.view },
    ],
    title: 'Edit Contact',
  },
  accounts: {
    trails: [{ title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view }],
    title: 'Accounts',
  },
  accountDetails: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Accounts', path: PRIVATE_NAVIGATION.accounts.view },
    ],
    title: 'Account Details',
  },
  addAccount: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Accounts', path: PRIVATE_NAVIGATION.accounts.view },
    ],
    title: 'Add Account',
  },
  editAccount: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Accounts', path: PRIVATE_NAVIGATION.accounts.view },
    ],
    title: 'Edit Account',
  },
  activities: {
    trails: [{ title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view }],
    title: 'Activities',
  },
  activityDetails: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Activities', path: PRIVATE_NAVIGATION.activities.view },
    ],
    title: 'Activity Details',
  },
  deals: {
    trails: [{ title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view }],
    title: 'Deals',
  },
  dealDetails: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Deals', path: PRIVATE_NAVIGATION.deals.view },
    ],
    title: 'Deal Details',
  },
  addDeal: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Deals', path: PRIVATE_NAVIGATION.deals.view },
    ],
    title: 'Add Deal',
  },
  editDeal: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Deals', path: PRIVATE_NAVIGATION.deals.view },
    ],
    title: 'Edit Deal',
  },
  convertLead: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Leads', path: PRIVATE_NAVIGATION.leads.view },
    ],
    title: 'Convert Lead',
  },
  convertDeal: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Deals', path: PRIVATE_NAVIGATION.deals.view },
    ],
    title: 'Convert Deal',
  },
  email: {
    trails: [{ title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view }],
    title: 'Emails',
  },
  emailDetails: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Email', path: PRIVATE_NAVIGATION.email.view },
    ],
    title: 'Email Details',
  },
  setting: {
    trails: [{ title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view }],
    title: 'Settings',
  },
  personalSetting: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
      { title: 'General Settings', path: PRIVATE_NAVIGATION.settings.view },
    ],
    title: 'Personal Settings',
  },
  profileAndPermissionsSetting: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
      { title: 'Users And Control', path: PRIVATE_NAVIGATION.settings.view },
    ],
    title: 'Profile and Permissions',
  },
  departmentSetting: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
      {
        title: 'Department And Control',
        path: PRIVATE_NAVIGATION.settings.view,
      },
    ],
    title: 'Department',
  },

  orgDepartmentSetting: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
      {
        title: 'Org Department And Control',
        path: PRIVATE_NAVIGATION.settings.view,
      },
    ],
    title: 'Org Department',
  },

  createProfilePermissions: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
      { title: 'Users And Control', path: PRIVATE_NAVIGATION.settings.view },
      {
        title: 'Profile and Permissions',
        path: PRIVATE_NAVIGATION.settings.profileAndPermissions.view,
      },
    ],
    title: 'Create Profile',
  },
  updateProfilePermissions: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
      { title: 'Users And Control', path: PRIVATE_NAVIGATION.settings.view },
      {
        title: 'Profile and Permissions',
        path: PRIVATE_NAVIGATION.settings.profileAndPermissions.view,
      },
    ],
    title: 'Update Profile',
  },
  hierarchy: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
      { title: 'Users And Control', path: PRIVATE_NAVIGATION.settings.view },
    ],
    title: 'Hierarchy',
  },
  department: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
      { title: 'Users And Control', path: PRIVATE_NAVIGATION.settings.view },
    ],
    title: 'Department',
  },

  createDepartment: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
      { title: 'Users And Control', path: PRIVATE_NAVIGATION.settings.view },
      {
        title: 'Department',
        path: PRIVATE_NAVIGATION.settings.department.view,
      },
    ],
    title: 'Create Department',
  },
  updateDepartment: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
      { title: 'Users And Control', path: PRIVATE_NAVIGATION.settings.view },
      {
        title: 'Department',
        path: PRIVATE_NAVIGATION.settings.department.view,
      },
    ],
    title: 'Update Department',
  },
  companyDetails: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
      { title: 'General Settings', path: PRIVATE_NAVIGATION.settings.view },
    ],
    title: 'Company Details',
  },
  user: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
      { title: 'Users And Control', path: PRIVATE_NAVIGATION.settings.view },
    ],
    title: 'Users',
  },
  editUser: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
      { title: 'Users And Control', path: PRIVATE_NAVIGATION.settings.view },
      { title: 'Users', path: PRIVATE_NAVIGATION.settings.user.view },
    ],
    title: 'Edit User',
  },
  viewUser: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
      { title: 'Users And Control', path: PRIVATE_NAVIGATION.settings.view },
      { title: 'Users', path: PRIVATE_NAVIGATION.settings.user.view },
    ],
    title: 'View User',
  },

  settings: {
    generalSettings: {
      securitySettings: {
        manageSessions: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'General Settings',
              path: PRIVATE_NAVIGATION.settings.view,
            },
            {
              title: 'Security Settings',
              path: PRIVATE_NAVIGATION.settings.generalSettings.securitySettings
                .view,
            },
          ],
          title: 'Manage Sessions',
        },
        twoFactorAuth: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'General Settings',
              path: PRIVATE_NAVIGATION.settings.view,
            },
            {
              title: 'Security Settings',
              path: PRIVATE_NAVIGATION.settings.generalSettings.securitySettings
                .view,
            },
          ],
          title: 'Two Factor Authentication ',
        },
        rules: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'General Settings',
              path: PRIVATE_NAVIGATION.settings.view,
            },
            {
              title: 'Security Settings',
              path: PRIVATE_NAVIGATION.settings.generalSettings.securitySettings
                .view,
            },
          ],
          title: 'Rules',
        },
        Alerts: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'General Settings',
              path: PRIVATE_NAVIGATION.settings.view,
            },
            {
              title: 'Security Settings',
              path: PRIVATE_NAVIGATION.settings.generalSettings.securitySettings
                .view,
            },
          ],
          title: 'Alerts',
        },
      },
      commonControls: {
        tagControl: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'General Settings',
              path: PRIVATE_NAVIGATION.settings.view,
            },
            {
              title: 'Common Control',
              path: isMobileView
                ? PRIVATE_NAVIGATION.settings.generalSettings.commonControls
                    .commonControl.view
                : PRIVATE_NAVIGATION.settings.generalSettings.commonControls
                    .tagControl.view,
            },
          ],
          title: 'Tag Control',
        },
        addressSetting: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'General Settings',
              path: PRIVATE_NAVIGATION.settings.view,
            },
            {
              title: 'Common Control',
              path: isMobileView
                ? PRIVATE_NAVIGATION.settings.generalSettings.commonControls
                    .commonControl.view
                : PRIVATE_NAVIGATION.settings.generalSettings.commonControls
                    .tagControl.view,
            },
          ],
          title: 'Address Setting',
        },
        phoneType: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'General Settings',
              path: PRIVATE_NAVIGATION.settings.view,
            },
            {
              title: 'Common Control',
              path: isMobileView
                ? PRIVATE_NAVIGATION.settings.generalSettings.commonControls
                    .commonControl.view
                : PRIVATE_NAVIGATION.settings.generalSettings.commonControls
                    .tagControl.view,
            },
          ],
          title: 'Phone Type Control',
        },
        leadDealSource: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'General Settings',
              path: PRIVATE_NAVIGATION.settings.view,
            },
            {
              title: 'Common Control',
              path: isMobileView
                ? PRIVATE_NAVIGATION.settings.generalSettings.commonControls
                    .commonControl.view
                : PRIVATE_NAVIGATION.settings.generalSettings.commonControls
                    .tagControl.view,
            },
          ],
          title: 'Lead/Deal Source',
        },
        restoreTime: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'General Settings',
              path: PRIVATE_NAVIGATION.settings.view,
            },
            {
              title: 'Common Control',
              path: isMobileView
                ? PRIVATE_NAVIGATION.settings.generalSettings.commonControls
                    .commonControl.view
                : PRIVATE_NAVIGATION.settings.generalSettings.commonControls
                    .restoreTime.view,
            },
          ],
          title: 'restore-setting',
        },
        snippet: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'General Settings',
              path: PRIVATE_NAVIGATION.settings.view,
            },
            {
              title: 'Common Control',
              path: isMobileView
                ? PRIVATE_NAVIGATION.settings.generalSettings.commonControls
                    .commonControl.view
                : PRIVATE_NAVIGATION.settings.generalSettings.commonControls
                    .snippet.view,
            },
          ],
          title: 'Snippet Setting',
        },
        // zoomSettings: {
        //   trails: [
        //     { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
        //     { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
        //     {
        //       title: 'General Settings',
        //       path: PRIVATE_NAVIGATION.settings.view,
        //     },
        //     {
        //       title: 'Common Control',
        //       path: isMobileView
        //         ? PRIVATE_NAVIGATION.settings.generalSettings.commonControls
        //             .commonControl.view
        //         : PRIVATE_NAVIGATION.settings.generalSettings.commonControls
        //             .zoomSettings.view,
        //     },
        //   ],
        //   title: 'Zoom Settings',
        // },
        trash: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'General Settings',
              path: PRIVATE_NAVIGATION.settings.view,
            },
            {
              title: 'Common Control',
              path: isMobileView
                ? PRIVATE_NAVIGATION.settings.generalSettings.commonControls
                    .commonControl.view
                : PRIVATE_NAVIGATION.settings.generalSettings.commonControls
                    .tagControl.view,
            },
          ],
          title: 'Trash',
        },
        iconSetting: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'General Settings',
              path: PRIVATE_NAVIGATION.settings.view,
            },
          ],
          title: 'Icon Setting',
        },
      },
      notification: {
        trails: [
          { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
          { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
          {
            title: 'General Settings',
            path: PRIVATE_NAVIGATION.settings.view,
          },
        ],
        title: 'Notification',
      },
    },
    moduleSetting: {
      lead: {
        temperatureStatus: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            { title: 'Module Setting', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'Lead',
              path: isMobileView
                ? PRIVATE_NAVIGATION.settings.moduleSetting.lead.leadSetting
                    .view
                : PRIVATE_NAVIGATION.settings.moduleSetting.lead.tempStatus
                    .view,
            },
          ],
          title: 'Temperature Status',
        },
        status: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            { title: 'Module Setting', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'Lead',
              path: isMobileView
                ? PRIVATE_NAVIGATION.settings.moduleSetting.lead.leadSetting
                    .view
                : PRIVATE_NAVIGATION.settings.moduleSetting.lead.tempStatus
                    .view,
            },
          ],
          title: 'Lead Status',
        },
        name: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            { title: 'Module Setting', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'Lead',
              path: isMobileView
                ? PRIVATE_NAVIGATION.settings.moduleSetting.lead.leadSetting
                    .view
                : PRIVATE_NAVIGATION.settings.moduleSetting.lead.tempStatus
                    .view,
            },
          ],
          title: 'Lead Name',
        },
      },
      deal: {
        generalSettings: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            { title: 'Module Setting', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'Deal',
              path: isMobileView
                ? PRIVATE_NAVIGATION.settings.moduleSetting.deal.dealSetting
                    .view
                : PRIVATE_NAVIGATION.settings.moduleSetting.deal.generalSetting
                    .view,
            },
          ],
          title: 'General Settings',
        },
        lostReasons: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            { title: 'Module Setting', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'Deal',
              path: isMobileView
                ? PRIVATE_NAVIGATION.settings.moduleSetting.deal.dealSetting
                    .view
                : PRIVATE_NAVIGATION.settings.moduleSetting.deal.generalSetting
                    .view,
            },
          ],
          title: 'Lost Reasons',
        },
        pipeline: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            { title: 'Module Setting', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'Deal',
              path: isMobileView
                ? PRIVATE_NAVIGATION.settings.moduleSetting.deal.dealSetting
                    .view
                : PRIVATE_NAVIGATION.settings.moduleSetting.deal.generalSetting
                    .view,
            },
          ],
          title: 'Pipeline',
        },
        closingDateSettings: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            { title: 'Module Setting', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'Deal',
              path: isMobileView
                ? PRIVATE_NAVIGATION.settings.moduleSetting.deal.dealSetting
                    .view
                : PRIVATE_NAVIGATION.settings.moduleSetting.deal.generalSetting
                    .view,
            },
          ],
          title: 'Closing Date Settings',
        },
        name: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            { title: 'Module Setting', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'Deal',
              path: isMobileView
                ? PRIVATE_NAVIGATION.settings.moduleSetting.deal.dealSetting
                    .view
                : PRIVATE_NAVIGATION.settings.moduleSetting.deal.generalSetting
                    .view,
            },
          ],
          title: 'Deal Name',
        },
        source: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            { title: 'Module Setting', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'Deal',
              path: isMobileView
                ? PRIVATE_NAVIGATION.settings.moduleSetting.deal.dealSetting
                    .view
                : PRIVATE_NAVIGATION.settings.moduleSetting.deal.generalSetting
                    .view,
            },
          ],
          title: 'Deal Source',
        },
      },
      activity: {
        generalSettings: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            { title: 'Module Setting', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'Activity',
              path: isMobileView
                ? PRIVATE_NAVIGATION.settings.moduleSetting.activity
                    .activitySetting.view
                : PRIVATE_NAVIGATION.settings.moduleSetting.activity.timeSet
                    .view,
            },
          ],
          title: 'General Settings',
        },
        defaultTimeSet: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            { title: 'Module Setting', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'Activity',
              path: isMobileView
                ? PRIVATE_NAVIGATION.settings.moduleSetting.activity
                    .activitySetting.view
                : PRIVATE_NAVIGATION.settings.moduleSetting.activity.timeSet
                    .view,
            },
          ],
          title: 'Default Time Set',
        },
        calendarVisibility: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            { title: 'Module Setting', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'Activity',
              path: isMobileView
                ? PRIVATE_NAVIGATION.settings.moduleSetting.activity
                    .activitySetting.view
                : PRIVATE_NAVIGATION.settings.moduleSetting.activity
                    .calendarVisibility.view,
            },
          ],
          title: 'calendar-visibility',
        },
        defaultReminders: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            { title: 'Module Setting', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'Activity',
              path: isMobileView
                ? PRIVATE_NAVIGATION.settings.moduleSetting.activity
                    .activitySetting.view
                : PRIVATE_NAVIGATION.settings.moduleSetting.activity.timeSet
                    .view,
            },
          ],
          title: 'Default Reminders',
        },
        defaultAvailability: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            { title: 'Module Setting', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'Activity',
              path: isMobileView
                ? PRIVATE_NAVIGATION.settings.moduleSetting.activity
                    .activitySetting.view
                : PRIVATE_NAVIGATION.settings.moduleSetting.activity.timeSet
                    .view,
            },
          ],
          title: 'Default Availability Set',
        },
        type: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            { title: 'Module Setting', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'Activity',
              path: isMobileView
                ? PRIVATE_NAVIGATION.settings.moduleSetting.activity
                    .activitySetting.view
                : PRIVATE_NAVIGATION.settings.moduleSetting.activity.timeSet
                    .view,
            },
          ],
          title: 'Activity Type',
        },
        result: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            { title: 'Module Setting', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'Activity',
              path: isMobileView
                ? PRIVATE_NAVIGATION.settings.moduleSetting.activity
                    .activitySetting.view
                : PRIVATE_NAVIGATION.settings.moduleSetting.activity.timeSet
                    .view,
            },
          ],
          title: 'Activity Result',
        },
      },
      contact: {
        role: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            { title: 'Module Setting', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'Contact',
              path: isMobileView
                ? PRIVATE_NAVIGATION.settings.moduleSetting.contact
                    .contactSetting.view
                : PRIVATE_NAVIGATION.settings.moduleSetting.contact.role.view,
            },
          ],
          title: 'Role',
        },
      },
      account: {
        type: {
          trails: [
            { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
            { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
            { title: 'Module Setting', path: PRIVATE_NAVIGATION.settings.view },
            {
              title: 'Account',
              path: isMobileView
                ? PRIVATE_NAVIGATION.settings.moduleSetting.account.setting.view
                : PRIVATE_NAVIGATION.settings.moduleSetting.account
                    .ParentAccount.view,
            },
          ],
          title: 'Account Setting',
        },
      },
    },
  },
  connectEmail: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
      {
        title: 'Email Setting',
        path: isMobileView
          ? PRIVATE_NAVIGATION.settings.emailSetting.emailSetting.view
          : PRIVATE_NAVIGATION.settings.emailSetting.connect.view,
      },
    ],
    title: 'Connect Email',
  },
  calendarAndConferencing: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
      {
        title: 'Email Setting',
        path: isMobileView
          ? PRIVATE_NAVIGATION.settings.emailSetting.emailSetting.view
          : PRIVATE_NAVIGATION.settings.emailSetting.connect.view,
      },
    ],
    title: 'Calendar & Conferencing',
  },
  emailUndoSetting: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Settings', path: PRIVATE_NAVIGATION.settings.view },
      {
        title: 'Email Setting',
        path: isMobileView
          ? PRIVATE_NAVIGATION.settings.emailSetting.emailSetting.view
          : PRIVATE_NAVIGATION.settings.emailSetting.connect.view,
      },
    ],
    title: 'Email Setting',
  },
  streams: {
    trails: [{ title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view }],
    title: 'Streams',
  },
  addStream: {
    trails: [
      { title: 'Home', path: PRIVATE_NAVIGATION.dashboard.view },
      { title: 'Steams', path: PRIVATE_NAVIGATION.streams.view },
    ],
    title: 'Add Stream',
  },
});
