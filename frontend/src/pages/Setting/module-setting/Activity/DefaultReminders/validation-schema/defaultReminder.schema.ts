// ** import packages **
import * as yup from 'yup';

// ** constant ** 
import { ActivitySchemaErrorMessage } from 'constant/formErrorMessage.constant';

const {notifications} = ActivitySchemaErrorMessage;

export const defaultReminderSchema = yup
  .object({
    duration: yup
      .number()
      .required(notifications.duration.required)
      .typeError(notifications.duration.valid),
    durationType: yup.number().required(notifications.durationType),
    notificationType: yup.string().required(notifications.notificationType),
  })
  .required();
