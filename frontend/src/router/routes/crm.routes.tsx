// ** Import Packages **
import React from 'react';

// ** Components **
import { RouteAttribute } from 'router/RouteComponent';

// ** Constants **
import { MODULE_PERMISSION } from 'constant/permissions.constant';
import {
  PRIVATE_NAVIGATION,
  PUBLIC_NAVIGATION,
} from 'constant/navigation.constant';
import ManageColumn from 'pages/StaticDesign/ManageColumn';
import ActivityVisibilityCalender from 'pages/Setting/module-setting/Activity/activityCalenderView';

// Dummy Static design pages

// ** PUBLIC PAGES **
const Login = React.lazy(() => import('pages/auth/Login'));
const Register = React.lazy(() => import('pages/auth/Register'));
const ForgotPassword = React.lazy(() => import('pages/auth/ForgotPassword'));
const MeetingConfirmation = React.lazy(
  () => import('pages/auth/MeetingConfirmation')
);
const ResetPassword = React.lazy(() => import('pages/auth/ResetPassword'));
const SetPassword = React.lazy(() => import('pages/auth/SetPassword'));
const AccountVerified = React.lazy(() => import('pages/auth/AccountVerify'));

// ** USER MODULE **
const User = React.lazy(() => import('pages/Setting/user-setting/User'));
const EditUser = React.lazy(
  () => import('pages/Setting/user-setting/User/components/EditUser')
);
const ViewUser = React.lazy(
  () => import('pages/Setting/user-setting/User/components/UserDetail')
);

// ** PROFILE MODULE **
const ProfilePermissions = React.lazy(
  () => import('pages/Setting/user-setting/ProfilePermissions')
);
const AddProfile = React.lazy(
  () =>
    import(
      'pages/Setting/user-setting/ProfilePermissions/components/AddProfile'
    )
);
const UpdateProfile = React.lazy(
  () =>
    import(
      'pages/Setting/user-setting/ProfilePermissions/components/EditProfile'
    )
);

// ** DASHBOARD **
const Dashboard = React.lazy(() => import('pages/Dashboard'));

// ** LEAD MODULE **
const Leads = React.lazy(() => import('pages/Lead'));
const LeadDetails = React.lazy(
  () => import('pages/Lead/components/LeadDetails')
);
const AddEditLead = React.lazy(
  () => import('pages/Lead/components/AddEditLead')
);
const ConvertLead = React.lazy(
  () => import('pages/Lead/components/ConvertLead')
);

// ** CONTACT MODULE **
const Contacts = React.lazy(() => import('pages/Contact'));
const ContactDetails = React.lazy(() => import('pages/Contact/ContactDetails'));

const EditContact = React.lazy(
  () => import('pages/Contact/components/AddEditContact')
);

// ** ACCOUNT MODULE **
const Account = React.lazy(() => import('pages/Account/index'));
const AccountDetails = React.lazy(
  () => import('pages/Account/components/AccountDetails')
);
const AddEditAccount = React.lazy(
  () => import('pages/Account/components/AddEditAccount')
);

// ** ACTIVITY MODULE **
const Activity = React.lazy(() => import('pages/Activity/index'));
const AddActivityMobileForm = React.lazy(
  () => import('pages/Activity/components/Modal/AddActivityMobileForm')
);
const EditActivityMobileForm = React.lazy(
  () => import('pages/Activity/components/Modal/EditActivityMobileForm')
);
const ActivityDetails = React.lazy(
  () => import('pages/Activity/components/ActivityDetails')
);
const MailConformation = React.lazy(
  () => import('pages/Activity/components/MailConformation')
);

// ** CALENDAR **
const Calendar = React.lazy(() => import('pages/Calendar/index'));

// ** DEAL MODULE **
const Deals = React.lazy(() => import('pages/Deal'));
const DealDetails = React.lazy(() => import('pages/Deal/DealDetails'));
const AddEditDeal = React.lazy(
  () => import('pages/Deal/components/AddEditDeal')
);
const ConvertDeal = React.lazy(
  () => import('pages/Deal/components/ConvertDeal')
);

// ** EMAIL MODULE **
const Email = React.lazy(() => import('pages/Email'));
const EmailDetails = React.lazy(
  () => import('pages/Email/components/EmailDetails')
);

// ** SETTING MODULE **
const Settings = React.lazy(() => import('pages/Setting'));

// ** STREAM MODULE **
const Streams = React.lazy(() => import('pages/Streams/index'));

const AddStream = React.lazy(
  () => import('pages/Streams/components/addStream/index')
);

// ** PERSONAL SETTING **
const PersonalSettings = React.lazy(
  () => import('pages/Setting/general-setting/PersonalSettings')
);

// ** SECURITY SETTING **
const SecuritySettings = React.lazy(
  () =>
    import('pages/Setting/general-setting/SecuritySettings/SecuritySettings')
);
const ManageSessions = React.lazy(
  () => import('pages/Setting/general-setting/SecuritySettings/ManageSessions')
);

const SecurityRules = React.lazy(
  () => import('pages/Setting/general-setting/SecuritySettings/SecurityRules')
);

const SecurityAlerts = React.lazy(
  () => import('pages/Setting/general-setting/SecuritySettings/SecurityAlerts')
);

const ManageTwoFactorAuthentication = React.lazy(
  () =>
    import(
      'pages/Setting/general-setting/SecuritySettings/two-factor-authentication'
    )
);

// ** COMMON CONTROL **
const CommonControl = React.lazy(
  () => import('pages/Setting/general-setting/common-controls/CommonControl')
);
const TrashControl = React.lazy(
  () => import('pages/Setting/general-setting/common-controls/Trash')
);
const TagControl = React.lazy(
  () => import('pages/Setting/general-setting/common-controls/Tag')
);
const ScheduleRestoreTiming = React.lazy(
  () => import('pages/Setting/general-setting/common-controls/restoreData')
);
const PhoneType = React.lazy(
  () => import('pages/Setting/general-setting/common-controls/PhoneType')
);
const LeadDealSource = React.lazy(
  () => import('pages/Setting/general-setting/common-controls/LeadDealSource')
);
const LeadDealStatus = React.lazy(
  () => import('pages/Setting/general-setting/common-controls/LeadDealStatus')
);
const Snippet = React.lazy(
  () => import('pages/Setting/general-setting/common-controls/Snippet')
);
// const ZoomSettings = React.lazy(
//   () => import('pages/Setting/general-setting/common-controls/ZoomSettings')
// );
const IconSettings = React.lazy(
  () => import('pages/Setting/general-setting/common-controls/IconSettings')
);
// const Notification = React.lazy(
//   () => import('pages/Setting/general-setting/common-controls/Notification')
// );

// ** NOTIFICATION SETTINGS **
const NotificationSetting = React.lazy(
  () => import('pages/Setting/general-setting/NotificationsSettings/Index')
);
const FollowingEntities = React.lazy(
  () =>
    import(
      'pages/Setting/general-setting/NotificationsSettings/FollowingEntities'
    )
);
const ScheduleEmailTiming = React.lazy(
  () =>
    import(
      'pages/Setting/general-setting/NotificationsSettings/ScheduleEmailTiming'
    )
);

// ** COMPANY DETAILS **
const CompanyDetails = React.lazy(
  () => import('pages/Setting/general-setting/CompanyDetails')
);

// ** DEPARTMENT **
const Department = React.lazy(
  () => import('pages/Setting/department-and-control/Department')
);
const AddDepartment = React.lazy(
  () =>
    import(
      'pages/Setting/department-and-control/Department/components/AddDepartment'
    )
);

// ** ORG DEPARTMENT **
const OrgDepartments = React.lazy(
  () => import('pages/Setting/department-and-control/OrgDepartments')
);

// ** LEAD SETTINGS **
const LeadTemperatureStatus = React.lazy(
  () => import('pages/Setting/module-setting/Lead/LeadTemperatureStatus')
);
const LeadSetting = React.lazy(
  () => import('pages/Setting/module-setting/Lead/LeadSetting')
);

// ** DEAL SETTINGS **
const DealGeneralSettings = React.lazy(
  () => import('pages/Setting/module-setting/Deal/GeneralSettings')
);
const DealSettings = React.lazy(
  () => import('pages/Setting/module-setting/Deal/DealSetting')
);
const DealLostReasons = React.lazy(
  () => import('pages/Setting/module-setting/Deal/LostReasons')
);
const DealPipeline = React.lazy(
  () => import('pages/Setting/module-setting/Deal/Pipeline')
);
const DealClosingDateSetting = React.lazy(
  () => import('pages/Setting/module-setting/Deal/ClosingDateSettings')
);

// ** ACTIVITY SETTINGS **
const ActivityDefaultTimeSet = React.lazy(
  () => import('pages/Setting/module-setting/Activity/TimSet')
);
const ActivitySetting = React.lazy(
  () => import('pages/Setting/module-setting/Activity/ActivitySetting')
);
const NotificationTime = React.lazy(
  () => import('pages/Setting/module-setting/Activity/DefaultReminders')
);
const NotificationTimeDetail = React.lazy(
  () =>
    import(
      'pages/Setting/module-setting/Activity/DefaultReminders/components/DefaultReminderDetail'
    )
);
const ActivityType = React.lazy(
  () => import('pages/Setting/module-setting/Activity/ActivityType')
);
const ActivityResult = React.lazy(
  () => import('pages/Setting/module-setting/Activity/ActivityResult')
);
const ActivityAvailability = React.lazy(
  () => import('pages/Setting/module-setting/Activity/Availability')
);

// ** CONTACT SETTINGS **
const ContactType = React.lazy(
  () => import('pages/Setting/module-setting/Contact/JobRole')
);
const ContactSetting = React.lazy(
  () => import('pages/Setting/module-setting/Contact/ContactSetting')
);

const Hierarchy = React.lazy(
  () => import('pages/Setting/user-setting/Hierarchy')
);

// ** ACCOUNT SETTING **
const AccountSetting = React.lazy(
  () => import('pages/Setting/module-setting/Account/AccountSetting')
);
const ParentAccountSetting = React.lazy(
  () => import('pages/Setting/module-setting/Account/ParentAccountSetting')
);

// ** EMAIL SETTINGS **
const ConnectEmail = React.lazy(
  () => import('pages/Setting/email-setting/EmailSetting/ConnectEmail')
);
const EmailSetting = React.lazy(
  () => import('pages/Setting/email-setting/EmailSetting/')
);
const CalendarAndConferencing = React.lazy(
  () =>
    import('pages/Setting/email-setting/EmailSetting/CalendarAndConferencing')
);
const EmailUndoSetting = React.lazy(
  () => import('pages/Setting/email-setting/EmailSetting/EmailUndoSetting')
);

// ** GENERAL **
const NotAuthorized = React.lazy(() => import('pages/NotAuthorized'));

// ** For Non-Authenticated user access **
export const publicRoutes = [
  { path: PUBLIC_NAVIGATION.login, component: <Login /> },
  { path: PUBLIC_NAVIGATION.register, component: <Register /> },
  { path: PUBLIC_NAVIGATION.forgotPassword, component: <ForgotPassword /> },
];

// ** For Authenticated and Non-Authenticated user both access **
export const generalRoutes = [
  { path: PUBLIC_NAVIGATION.verifyAccount, component: <AccountVerified /> },
  { path: PUBLIC_NAVIGATION.notAuthorized, component: <NotAuthorized /> },
  { path: PUBLIC_NAVIGATION.resetPassword, component: <ResetPassword /> },
  { path: PUBLIC_NAVIGATION.setPassword, component: <SetPassword /> },
  { path: PUBLIC_NAVIGATION.mailConformation, component: <MailConformation /> },
  {
    path: PUBLIC_NAVIGATION.meetingConfirmation,
    component: <MeetingConfirmation />,
  },
];

// ** For Authenticated user access **
export const privateRoutes: RouteAttribute[] = [
  {
    path: PRIVATE_NAVIGATION.dashboard.view,
    name: `Dashboard`,
    component: <Dashboard />,
  },
  {
    path: PRIVATE_NAVIGATION.leads.view,
    name: 'Leads',
    component: <Leads />,
    ...MODULE_PERMISSION.LEAD.read,
  },
  {
    path: PRIVATE_NAVIGATION.leads.add,
    name: 'Add Lead',
    component: <AddEditLead />,
    ...MODULE_PERMISSION.LEAD.create,
  },
  {
    path: PRIVATE_NAVIGATION.leads.detailPage,
    name: 'Lead Details',
    component: <LeadDetails />,
    ...MODULE_PERMISSION.LEAD.read,
  },
  {
    path: PRIVATE_NAVIGATION.leads.edit,
    name: 'Edit Lead',
    component: <AddEditLead />,
    ...MODULE_PERMISSION.LEAD.update,
  },
  {
    path: PRIVATE_NAVIGATION.leads.convert,
    name: 'Convert Lead',
    component: <ConvertLead />,
    ...MODULE_PERMISSION.LEAD.update,
  },
  {
    path: PRIVATE_NAVIGATION.contacts.view,
    name: 'Contacts',
    component: <Contacts />,
    ...MODULE_PERMISSION.CONTACT.read,
  },
  {
    path: PRIVATE_NAVIGATION.contacts.detailPage,
    name: 'Contact Details',
    component: <ContactDetails />,
    ...MODULE_PERMISSION.CONTACT.read,
  },
  {
    path: PRIVATE_NAVIGATION.contacts.edit,
    name: 'Edit Contact',
    component: <EditContact />,
    ...MODULE_PERMISSION.CONTACT.update,
  },
  {
    path: PRIVATE_NAVIGATION.contacts.add,
    name: 'Add Contact',
    component: <EditContact />,
    ...MODULE_PERMISSION.CONTACT.create,
  },
  {
    path: PRIVATE_NAVIGATION.deals.view,
    name: 'Deals',
    component: <Deals />,
    ...MODULE_PERMISSION.DEAL.read,
  },
  {
    path: PRIVATE_NAVIGATION.deals.detailPage,
    name: 'Deals Details',
    component: <DealDetails />,
    ...MODULE_PERMISSION.DEAL.read,
  },
  {
    path: PRIVATE_NAVIGATION.deals.convert,
    name: 'Convert Deal',
    component: <ConvertDeal />,
    ...MODULE_PERMISSION.DEAL.update,
  },
  {
    path: PRIVATE_NAVIGATION.deals.add,
    name: 'Add Deal',
    component: <AddEditDeal />,
    ...MODULE_PERMISSION.DEAL.update,
  },
  {
    path: PRIVATE_NAVIGATION.deals.edit,
    name: 'Edit Deals',
    component: <AddEditDeal />,
    ...MODULE_PERMISSION.DEAL.update,
  },
  {
    path: PRIVATE_NAVIGATION.accounts.view,
    name: 'Accounts',
    component: <Account />,
    ...MODULE_PERMISSION.ACCOUNT.read,
  },
  {
    path: PRIVATE_NAVIGATION.accounts.detailPage,
    name: 'Accounts Details',
    component: <AccountDetails />,
    ...MODULE_PERMISSION.ACCOUNT.read,
  },
  {
    path: PRIVATE_NAVIGATION.accounts.add,
    name: 'Add Accounts',
    component: <AddEditAccount />,
    ...MODULE_PERMISSION.ACCOUNT.create,
  },
  {
    path: PRIVATE_NAVIGATION.accounts.edit,
    name: 'Edit Accounts',
    component: <AddEditAccount />,
    ...MODULE_PERMISSION.ACCOUNT.update,
  },
  {
    path: PRIVATE_NAVIGATION.activities.view,
    name: 'Activities',
    component: <Activity />,
    ...MODULE_PERMISSION.ACTIVITY.read,
  },
  {
    path: PRIVATE_NAVIGATION.activities.AddActivityMobileView,
    name: 'Activities',
    component: <AddActivityMobileForm />,
    ...MODULE_PERMISSION.ACTIVITY.create,
  },
  {
    path: PRIVATE_NAVIGATION.activities.EditActivityMobileView,
    name: 'Activities',
    component: <EditActivityMobileForm />,
    ...MODULE_PERMISSION.ACTIVITY.update,
  },
  {
    path: PRIVATE_NAVIGATION.activities.detailPage,
    name: 'Activities Details',
    component: <ActivityDetails />,
    ...MODULE_PERMISSION.ACTIVITY.read,
  },

  {
    path: PRIVATE_NAVIGATION.calendar.view,
    name: 'Calendar',
    component: <Calendar />,
    ...MODULE_PERMISSION.ACTIVITY.read,
  },
  {
    path: PRIVATE_NAVIGATION.email.view,
    name: 'Email',
    component: <Email />,
  },
  {
    path: PRIVATE_NAVIGATION.email.detailPage,
    name: 'Email Details',
    component: <EmailDetails />,
  },

  {
    path: PRIVATE_NAVIGATION.settings.view,
    name: 'Settings',
    component: <Settings />,
  },
  {
    path: PRIVATE_NAVIGATION.streams.view,
    name: 'Streams',
    component: <Streams />,
  },
  {
    path: PRIVATE_NAVIGATION.streams.add,
    name: 'Add Streams',
    component: <AddStream />,
  },
  {
    path: PRIVATE_NAVIGATION.settings.generalSettings.personalSettings.view,
    name: 'Personal Settings',
    component: <PersonalSettings />,
  },
  {
    path: PRIVATE_NAVIGATION.settings.generalSettings.securitySettings.view,
    name: 'Security Settings',
    component: <SecuritySettings />,
  },

  {
    path: PRIVATE_NAVIGATION.settings.generalSettings.securitySettings
      .manageSessions.view,
    name: 'Menage Session',
    component: <ManageSessions />,
  },
  {
    path: PRIVATE_NAVIGATION.settings.generalSettings.securitySettings
      .twoFactorAuthentication.view,
    name: 'Tow Factor Authentication',
    component: <ManageTwoFactorAuthentication />,
  },
  {
    path: PRIVATE_NAVIGATION.settings.generalSettings.securitySettings.rules
      .view,
    name: 'Rules',
    component: <SecurityRules />,
    ...MODULE_PERMISSION.ORGANIZATION.update,
  },
  {
    path: PRIVATE_NAVIGATION.settings.generalSettings.securitySettings.alerts
      .view,
    name: 'Alert',
    component: <SecurityAlerts />,
    ...MODULE_PERMISSION.ORGANIZATION.update,
  },
  {
    path: PRIVATE_NAVIGATION.settings.generalSettings.companyDetails.view,
    name: 'Company Details',
    component: <CompanyDetails />,
    ...MODULE_PERMISSION.ORGANIZATION.read,
  },
  {
    path: PRIVATE_NAVIGATION.settings.generalSettings.commonControls
      .commonControl.view,
    name: 'Common Control',
    component: <CommonControl />,
  },
  {
    path: PRIVATE_NAVIGATION.settings.generalSettings.commonControls.trash.view,
    name: 'Common Control',
    component: <TrashControl />,
  },
  {
    path: PRIVATE_NAVIGATION.settings.generalSettings.commonControls.tagControl
      .view,
    name: 'Common Control',
    component: <TagControl />,
    ...MODULE_PERMISSION.ORGANIZATION.update,
  },

  {
    path: PRIVATE_NAVIGATION.settings.generalSettings.commonControls
      .phoneTypeSetting.view,
    name: 'Common Control',
    component: <PhoneType />,
  },
  {
    path: PRIVATE_NAVIGATION.settings.generalSettings.commonControls
      .leadDealSource.view,
    name: 'Common Control',
    component: <LeadDealSource />,
  },
  {
    path: PRIVATE_NAVIGATION.settings.generalSettings.commonControls.restoreTime
      .view,
    name: 'Common Control',
    component: <ScheduleRestoreTiming />,
  },
  {
    path: PRIVATE_NAVIGATION.settings.generalSettings.commonControls
      .leadDealStatus.view,
    name: 'Common Control',
    component: <LeadDealStatus />,
  },
  {
    path: PRIVATE_NAVIGATION.settings.generalSettings.commonControls.snippet
      .view,
    name: 'Common Control',
    component: <Snippet />,
  },
  // {
  //   path: PRIVATE_NAVIGATION.settings.generalSettings.commonControls
  //     .zoomSettings.view,
  //   name: 'Common Control',
  //   component: <ZoomSettings />,
  // },
  {
    path: PRIVATE_NAVIGATION.settings.generalSettings.commonControls
      .iconSettings.view,
    name: 'Common Control',
    component: <IconSettings />,
  },
  {
    path: PRIVATE_NAVIGATION.settings.generalSettings.notifications.notification
      .view,
    name: 'Notification',
    component: <NotificationSetting />,
  },
  {
    path: PRIVATE_NAVIGATION.settings.generalSettings.notifications.following
      .view,
    name: 'Following',
    component: <FollowingEntities />,
  },
  {
    path: PRIVATE_NAVIGATION.settings.generalSettings.notifications
      .schedule_email_timing.view,
    name: 'Following',
    component: <ScheduleEmailTiming />,
  },
  {
    path: PRIVATE_NAVIGATION.settings.user.view,
    name: 'User',
    component: <User />,
    ...MODULE_PERMISSION.USER.read,
  },
  {
    path: PRIVATE_NAVIGATION.settings.user.edit,
    name: 'Edit User',
    component: <EditUser />,
    ...MODULE_PERMISSION.USER.update,
  },
  {
    path: PRIVATE_NAVIGATION.settings.user.detailPage,
    name: 'View User',
    component: <ViewUser />,
    ...MODULE_PERMISSION.USER.read,
  },
  {
    path: PRIVATE_NAVIGATION.settings.profileAndPermissions.view,
    name: 'Profile',
    component: <ProfilePermissions />,
    ...MODULE_PERMISSION.PROFILE.read,
  },
  {
    path: PRIVATE_NAVIGATION.settings.profileAndPermissions.create,
    name: 'Create Profile',
    component: <AddProfile />,
    ...MODULE_PERMISSION.PROFILE.create,
  },
  {
    path: `${PRIVATE_NAVIGATION.settings.profileAndPermissions.edit}/:profileId`,
    name: 'Update Profile',
    component: <UpdateProfile />,
    ...MODULE_PERMISSION.PROFILE.update,
  },
  {
    path: PRIVATE_NAVIGATION.settings.hierarchy.view,
    name: 'Hierarchy',
    component: <Hierarchy />,
  },
  {
    path: PRIVATE_NAVIGATION.settings.department.view,
    name: 'Department',
    component: <Department />,
    ...MODULE_PERMISSION.DEPARTMENT.read,
  },
  {
    path: PRIVATE_NAVIGATION.settings.department.create,
    name: 'Create Department',
    component: <AddDepartment />,
    ...MODULE_PERMISSION.DEPARTMENT.create,
  },
  {
    path: `${PRIVATE_NAVIGATION.settings.department.edit}/:id`,
    name: 'Update Department',
    component: <AddDepartment />,
    ...MODULE_PERMISSION.DEPARTMENT.update,
  },
  {
    path: `${PRIVATE_NAVIGATION.settings.orgDepartment.view}`,
    name: 'Org Department',
    component: <OrgDepartments />,
    ...MODULE_PERMISSION.CONTACT.read,
  },

  {
    path: PRIVATE_NAVIGATION.settings.moduleSetting.lead.tempStatus.view,
    name: 'Lead Settings',
    component: <LeadTemperatureStatus />,
    ...MODULE_PERMISSION.LEAD.read,
  },
  {
    path: PRIVATE_NAVIGATION.settings.moduleSetting.lead.leadSetting.view,
    name: 'Lead Settings',
    component: <LeadSetting />,
    ...MODULE_PERMISSION.LEAD.read,
  },
  {
    path: PRIVATE_NAVIGATION.settings.moduleSetting.deal.generalSetting.view,
    name: 'Deal Settings',
    component: <DealGeneralSettings />,
    ...MODULE_PERMISSION.DEAL.read,
  },
  {
    path: PRIVATE_NAVIGATION.settings.moduleSetting.deal.dealSetting.view,
    name: 'Deal Settings',
    component: <DealSettings />,
    ...MODULE_PERMISSION.DEAL.read,
  },
  {
    path: PRIVATE_NAVIGATION.settings.moduleSetting.deal.lostReason.view,
    name: 'Deal Settings',
    component: <DealLostReasons />,
    ...MODULE_PERMISSION.DEAL.read,
  },
  {
    path: PRIVATE_NAVIGATION.settings.moduleSetting.deal.pipeline.view,
    name: 'Deal Settings',
    component: <DealPipeline />,
    ...MODULE_PERMISSION.DEAL.read,
  },
  {
    path: PRIVATE_NAVIGATION.settings.moduleSetting.deal.closingDateSetting
      .view,
    name: 'Deal Settings',
    component: <DealClosingDateSetting />,
    ...MODULE_PERMISSION.DEAL.read,
  },
  {
    path: PRIVATE_NAVIGATION.settings.moduleSetting.activity.activitySetting
      .view,
    name: 'Activity Settings',
    component: <ActivitySetting />,
    ...MODULE_PERMISSION.ACTIVITY.read,
  },
  {
    path: PRIVATE_NAVIGATION.settings.moduleSetting.activity.timeSet.view,
    name: 'Activity Settings',
    component: <ActivityDefaultTimeSet />,
    ...MODULE_PERMISSION.ACTIVITY.read,
  },

  {
    path: PRIVATE_NAVIGATION.settings.moduleSetting.activity.defaultReminders
      .view,
    name: 'Activity Settings',
    component: <NotificationTime />,
    ...MODULE_PERMISSION.ACTIVITY.read,
  },
  {
    path: PRIVATE_NAVIGATION.settings.moduleSetting.activity.defaultReminders
      .update,
    name: 'Activity Settings',
    component: <NotificationTimeDetail />,
    ...MODULE_PERMISSION.ACTIVITY.read,
  },
  {
    path: PRIVATE_NAVIGATION.settings.moduleSetting.activity.type.view,
    name: 'Activity Settings',
    component: <ActivityType />,
    ...MODULE_PERMISSION.ACTIVITY.read,
  },
  {
    path: PRIVATE_NAVIGATION.settings.moduleSetting.activity.calendarVisibility
      .view,
    name: 'Activity Settings',
    component: <ActivityVisibilityCalender />,
    ...MODULE_PERMISSION.ACTIVITY.read,
  },
  {
    path: PRIVATE_NAVIGATION.settings.moduleSetting.activity.result.view,
    name: 'Activity Settings',
    component: <ActivityResult />,
    ...MODULE_PERMISSION.ACTIVITY.read,
  },
  {
    path: PRIVATE_NAVIGATION.settings.moduleSetting.activity.availability.view,
    name: 'Activity Availability',
    component: <ActivityAvailability />,
    ...MODULE_PERMISSION.ACTIVITY.read,
  },

  {
    path: PRIVATE_NAVIGATION.settings.moduleSetting.contact.contactSetting.view,
    name: 'Contact Settings',
    component: <ContactSetting />,
    ...MODULE_PERMISSION.CONTACT.read,
  },
  {
    path: PRIVATE_NAVIGATION.settings.moduleSetting.contact.role.view,
    name: 'Contact Settings',
    component: <ContactType />,
    ...MODULE_PERMISSION.CONTACT.read,
  },
  {
    path: PRIVATE_NAVIGATION.settings.moduleSetting.account.setting.view,
    name: 'Account Settings',
    component: <AccountSetting />,
    ...MODULE_PERMISSION.ACCOUNT.read,
  },
  {
    path: PRIVATE_NAVIGATION.settings.moduleSetting.account.ParentAccount.view,
    name: 'Parent Account Settings',
    component: <ParentAccountSetting />,
    ...MODULE_PERMISSION.ACCOUNT.read,
  },

  // ** Email Setting **//
  {
    path: PRIVATE_NAVIGATION.settings.emailSetting.emailSetting.view,
    name: 'Email Setting',
    component: <EmailSetting />,
  },
  {
    path: PRIVATE_NAVIGATION.settings.emailSetting.connect.view,
    name: 'Email Setting',
    component: <ConnectEmail />,
  },
  {
    path: PRIVATE_NAVIGATION.settings.emailSetting.calendarConferencing.view,
    name: 'Email Setting',
    component: <CalendarAndConferencing />,
  },
  {
    path: PRIVATE_NAVIGATION.settings.emailSetting.emailUndoSetting.view,
    name: 'Email Undo Setting',
    component: <EmailUndoSetting />,
  },

  {
    path: '/design/managecolumn',
    name: 'ManageColumn',
    component: <ManageColumn />,
  },

  {
    path: '/dummy/test',
    name: 'Test',
    component: <ManageColumn />,
  },

  // Dummy Design
];
