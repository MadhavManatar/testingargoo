import { ModuleNames } from 'constant/permissions.constant';
import { AccountFollowersType } from 'pages/Account/types/account.types';
import { ActivityFollowersType } from 'pages/Activity/types/activity.types';
import { ContactFollowersType } from 'pages/Contact/types/contacts.types';
import { DealFollowersType } from 'pages/Deal/types/deals.types';
import { LeadFollowersType } from 'pages/Lead/types/lead.type';
import { UserInterface } from 'redux/slices/authSlice';

export type FollowerTypes =
  | LeadFollowersType
  | DealFollowersType
  | AccountFollowersType
  | ActivityFollowersType
  | ContactFollowersType;

export type FollowersSectionPropsType = {
  accordion?: { [key: string]: boolean };
  followers?: FollowerTypes[];
  module_name: ModuleNames;
  entityId: number;
  count?: number;
  openCloseAccordion: (value: string) => void;
};

export type FollowingEntityCommonType = {
  id: number;
  name?: string;
  topic?: string;
};

export type FollowingEntitiesType = {
  leads: LeadFollowersType[] | null;
  deals: DealFollowersType[] | null;
  accounts: AccountFollowersType[] | null;
  contacts: ContactFollowersType[] | null;
  activities: ActivityFollowersType[] | null;
};

export type EntityTabLabel = 'lead' | 'deal' | 'contact' | 'account' | 'activity';
export type FollowingTabType = { label: EntityTabLabel; value: ModuleNames };


export type TrashTabLabel = 'all' | 'lead' | 'deal' | 'contact' | 'account' | 'activity';
export type TrashTabType = { label: TrashTabLabel; value: ModuleNames };

export type followingCount = {
  contact_followers_count: number | null;
  account_followers_count: number | null;
  lead_followers_count: number | null;
  deal_followers_count: number | null;
  activity_followers_count: number | null;
  count: number | null;
  totalFollowing: number | null;
};

export interface FollowersReduxState {
  follower: null | {
    follower: UserInterface;
    follower_id: number;
    action: 'add' | 'remove';
  };
  following: FollowingEntitiesType;
  followingCount: followingCount;
}
