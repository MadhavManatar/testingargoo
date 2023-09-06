import {
  TimelineMessageType,
  TimelineType,
} from 'components/EntityDetails/Timeline/types';
import { UserInterface } from 'redux/slices/authSlice';

export enum notificationStatus {
  READ = 'READ',
  UNREAD = 'UNREAD',
}

export interface UserNotification {
  id: number;
  organization_id: number;
  user_id: number;
  notification_id: number;
  status: notificationStatus;
  notification: Notification;
  groupNotifications?: UserNotification[];
  notification_user?: UserInterface;
  created_at: Date | string;
  updated_at: Date | string;
  deleted_at: Date | string;
}

export type NotificationMessageType = {
  changes: TimelineMessageType[];
  timeline: TimelineType;
  reaction?: boolean;
  comment?: string;
  alertType?: string;
  alertData?: object;
};

export interface Notification {
  timelines: any;
  id: number;
  organization_id: number;
  title: string;
  message: NotificationMessageType | Record<string, any>;
  model_record_id: number;
  created_by?: number;
  model_name?: string;
  creator: UserInterface;
  created_at: Date | string;
  updated_at: Date | string;
  deleted_at: Date | string;
}
