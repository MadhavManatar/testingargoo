import { FollowingTabType, TrashTabType } from 'components/EntityDetails/FollowFollowing/types/follower.types';
import { ModuleNames } from './permissions.constant';

export const TEXT_COLUMN_FILTER_OPTIONS = Object.freeze([
  'contains',
  'notContains',
  'equals',
  'notEqual',
  'startsWith',
  'endsWith',
]);

export const NUMBER_COLUMN_FILTER_OPTIONS = Object.freeze([
  'equals',
  'notEqual',
  'lessThan',
  'lessThanOrEqual',
  'greaterThan',
  'greaterThanOrEqual',
  'inRange',
]);

export const DATE_COLUMN_FILTER_OPTIONS = Object.freeze([
  'equals',
  'greaterThan',
  'lessThan',
  'notEqual',
  'inRange',
]);

export const ModuleTabs: FollowingTabType[] = [
  { label: 'lead', value: ModuleNames.LEAD },
  { label: 'deal', value: ModuleNames.DEAL },
  { label: 'account', value: ModuleNames.ACCOUNT },
  { label: 'contact', value: ModuleNames.CONTACT },
  { label: 'activity', value: ModuleNames.ACTIVITY },
];

export const TrashTabs: TrashTabType[] = [
  { label: 'all', value: ModuleNames.ALL},
  { label: 'lead', value: ModuleNames.LEAD },
  { label: 'deal', value: ModuleNames.DEAL },
  { label: 'account', value: ModuleNames.ACCOUNT },
  { label: 'contact', value: ModuleNames.CONTACT },
  { label: 'activity', value: ModuleNames.ACTIVITY },
];