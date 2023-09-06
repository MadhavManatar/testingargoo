// ** import packages ** //
import * as yup from 'yup';

// ** constants ** //
import { onlyNumberRegex } from 'constant/regex.constant';
import {
  ActivitySchemaErrorMessage,
  MarkAsDoneActivitySchemaError,
} from 'constant/formErrorMessage.constant';

const {
  start_date,
  duration,
  assigned_to_id,
  activity_type_id,
  notifications,
} = ActivitySchemaErrorMessage;

const durationValidator = (value: string | undefined) =>
  value ? !!value?.match(onlyNumberRegex) : true;

export const activityReminderSchema = yup.array().of(
  yup
    .object()
    .shape({
      duration: yup
        .string()
        .test('numberOnly', duration.valid, durationValidator)
        .nullable(true)
        .required(notifications.duration.required),
      durationType: yup
        .number()
        .nullable(true)
        .required(notifications.durationType),
      notificationType: yup
        .string()
        .nullable(true)
        .required(notifications.notificationType),
    })
    .required()
);
export const activitySchema = yup
  .object({
    start_date: yup.string().required(start_date).nullable(),
    duration: yup
      .string()
      .test('numberOnly', duration.valid, durationValidator)
      .required(duration.required)
      .max(1440, duration.max),
    topic: yup.string().trim().nullable(),
    assigned_to_id: yup.number().required(assigned_to_id).nullable(),
    activity_type_id: yup.number().required(activity_type_id).nullable(),
    availability: yup.string().nullable(true),
    notifications: yup.mixed().when('start_time', {
      is: (val: string) => val,
      then: activityReminderSchema,
      otherwise: yup.array().nullable(true),
    }),
  })
  .required();

const { result, memo } = MarkAsDoneActivitySchemaError;

export const markAsDoneActivitySchema = yup
  .object({
    result: yup.string().required(result).nullable(),
    // other_result: yup
    //   .string()
    //   .when('result', {
    //     is: (val: string) => val === 'other',
    //     then: yup.string().required(other_result),
    //     otherwise: yup.string(),
    //   })
    //   .nullable(),
    memo: yup
      .string()
      .when('is_memo_required', {
        is: (val: boolean) => val,
        then: yup.string().required(memo),
        otherwise: yup.string(),
      })
      .nullable(),
  })
  .required();
