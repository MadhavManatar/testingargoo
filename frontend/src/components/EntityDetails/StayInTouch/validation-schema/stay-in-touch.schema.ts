import * as yup from 'yup';

// ** constant **
import { StayInTouchSchemaError } from 'constant/formErrorMessage.constant';

const { activity_type, interval, frequency, scheduled_time } =
  StayInTouchSchemaError;

export const stayInTouchSchema = yup
  .object({
    activity_type: yup.number().required(activity_type).nullable(true),
    frequency: yup.string().required(frequency).nullable(true),
    scheduled_time: yup
      .string()
      .min(5, scheduled_time.min)
      .required(scheduled_time.required)
      .nullable(true),
    interval: yup
      .number()
      .max(364, "Interval must be less than 365")
      .min(1,"Please enter only natural number.")
      .integer("Please enter only natural number.")
      .typeError(interval.valid)
      .nullable(),
  })
  .required();
