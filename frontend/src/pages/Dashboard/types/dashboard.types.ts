import {
  HistoryDataType,
  HISTORY_ACTION,
} from 'components/EntityDetails/Timeline/types';
import { IconTypes } from 'components/Icon';
import { TimelineModelName } from 'constant/timeline.constant';

type activity_type = {
  icon: IconTypes;
  icon_type: string;
  name: string;
  id: number;
};

export type activitiesResponse = {
  id: number;
  activity_type: activity_type;
  activity_type_id: number;
  start_date: string;
  end_date: string;
  topic: string;
  activity_participants: any[];
  activity_contact?: {
    id: number;
    name: string;
  };
  activity_lead?: {
    id: number;
    name: string;
  };
  activity_account?: {
    id: number;
    name: string;
  };
  join_link: string;
  is_active: boolean;
  completed_by: number;
  duration?: number;
  all_day: boolean;
  is_activity_pass?: boolean;
  agenda?: string;
};

export type recentLogsResponse = {
  data: HistoryDataType;
  model_name: TimelineModelName;
  action: HISTORY_ACTION;
  created_at: string;
  record_label: string;
  model_record_id: number;
  title: string;
};

export type DashboardCountShowPropsType = {
  setRecentLogsFlag: React.Dispatch<React.SetStateAction<boolean>>;
  recentLogsFlag: boolean;
  setPageInfo: React.Dispatch<
    React.SetStateAction<{
      page: number;
      hasMore: boolean;
    }>
  >;
  refresh?:boolean
};

export type HeaderPropsType = { headerTitle: string };

export type QuickModalType =
  | 'lead'
  | 'contact'
  | 'account'
  | 'deal'
  | 'activity';

export type EmailModalType =
  | 'lead'
  | 'contact'
  | 'account'
  | 'deal'
  | 'activity';
