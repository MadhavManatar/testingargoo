export interface NotificationSetting {
  id: number;
  organization_id: number;
  name: string;
  user_id: number;
  created_by: number;
  updated_by: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  types: NotificationType[];
}

export interface NotificationType {
  id: number;
  organization_id: number;
  name: string;
  notification_setting_id: number;
  status: boolean;
  user_id: number;
  receive_notification_time?: string | Date;
  created_by: number;
  updated_by: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
