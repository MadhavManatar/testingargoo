// ** Component **
import { IconTypes } from 'components/Icon';

// ** Constant **
import {
  ModuleNames,
  BasicPermissionTypes,
  MODULE_PERMISSION,
} from './permissions.constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { IconTypeJson } from 'indexDB/indexdb.type';

interface SidebarInterface {
  id: string;
  label: string;
  link: string;
  children: Array<{ id: string; label: string; link: string }>;
  icon: IconTypes;
  animationIcon: IconTypeJson;
  module?: ModuleNames;
  type?: BasicPermissionTypes;
}

export const SIDE_BAR: readonly SidebarInterface[] = Object.freeze([
  {
    id: 'search',
    label: 'Search',
    link: '/search',
    children: [],
    icon: 'searchFilledBlueIcon',
    animationIcon: IconTypeJson.Search,
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    link: PRIVATE_NAVIGATION.dashboard.view,
    children: [],
    icon: 'dashboardFilledBlueIcon',
    animationIcon: IconTypeJson.Dashboard,
  },
  {
    id: 'leads',
    label: 'Leads',
    link: PRIVATE_NAVIGATION.leads.view,
    children: [],
    icon: 'leadsFilledBlueIcon',
    ...MODULE_PERMISSION.LEAD.read,
    animationIcon: IconTypeJson.Lead,
  },
  {
    id: 'deals',
    label: 'Deals',
    link: PRIVATE_NAVIGATION.deals.view,
    children: [],
    icon: 'dealsFilledBlueIcon',
    ...MODULE_PERMISSION.DEAL.read,
    animationIcon: IconTypeJson.Deal,
  },
  {
    id: 'contacts',
    label: 'Contacts',
    link: PRIVATE_NAVIGATION.contacts.view,
    children: [],
    icon: 'phoneFilled',
    ...MODULE_PERMISSION.CONTACT.read,
    animationIcon: IconTypeJson.Contact,
  },
  {
    id: 'accounts',
    label: 'Accounts',
    link: PRIVATE_NAVIGATION.accounts.view,
    children: [],
    icon: 'accountFilledBlueIcon',
    ...MODULE_PERMISSION.ACCOUNT.read,
    animationIcon: IconTypeJson.Account,
  },
  {
    id: 'activities',
    label: 'Activities',
    link: PRIVATE_NAVIGATION.activities.view,
    children: [],
    icon: 'activitiesFilledBlueIcon',
    ...MODULE_PERMISSION.ACTIVITY.read,
    animationIcon: IconTypeJson.Activity,
  },
  {
    id: 'calendar',
    label: 'Calendar',
    link: PRIVATE_NAVIGATION.calendar.view,
    children: [],
    module: ModuleNames.ACTIVITY,
    icon: 'calendarFilledBlueIcon',
    animationIcon: IconTypeJson.Calendar,
  },
  {
    id: 'email',
    label: 'Email',
    link: PRIVATE_NAVIGATION.email.view,
    children: [],
    icon: 'emailFilledBlueIcon',
    animationIcon: IconTypeJson.Email,
  },
  {
    id: 'streams',
    label: 'Streams',
    link: PRIVATE_NAVIGATION.streams.view,
    children: [],
    icon: 'streamFilledIcon',
    animationIcon: IconTypeJson.Settings,
  },
  {
    id: 'settings',
    label: 'Settings',
    link: PRIVATE_NAVIGATION.settings.view,
    children: [],
    icon: 'settingFilled',
    animationIcon: IconTypeJson.Streams,
  },
]);
