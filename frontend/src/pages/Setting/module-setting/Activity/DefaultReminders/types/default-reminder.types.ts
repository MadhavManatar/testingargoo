// ** types ** //
import { IconTypes } from "components/Icon";

export type DefaultReminderFieldType = {
  notificationType: string, duration: number, durationType: number
};

export type DefaultTimeReminderResponse = {

  id: number,
  notifications: string,
  activity_type_id: number,
  user_id: number,
  activity_type: {
    id: number,
    name: string,
    icon: IconTypes,
    icon_type: string
  }

}
