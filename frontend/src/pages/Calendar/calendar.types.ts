import { IconTypes } from 'components/Icon';

export interface QuickPropsInterface {
  topic: string;
  activity_type: {
    id: number;
    name: string;
    icon: IconTypes;
    icon_type: string;
  };
  duration: number;
  join_link: string;
  activityId: number;
  reminder: string[];
  Guid: string;
  Id: number;
  elementType: string;
  end_date: Date;
  start_date: Date;
  is_active: boolean;
  completed_by: number;
  activity_type_id: number;
  agenda: string;
  all_day: boolean;
  is_visibility: boolean;
  activity_lead?: {
    id: number;
    name: string;
  }
  activity_contact?: {
    id: number;
    name: string;
  }
  activity_account?: {
    id: number;
    name: string;
  }
}
