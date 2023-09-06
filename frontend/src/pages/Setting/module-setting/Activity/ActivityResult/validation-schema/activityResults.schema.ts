// ** import packages **
import * as yup from 'yup';

// ** constant **
import { ActivityResultsSchemaError } from 'constant/formErrorMessage.constant';

const { activity_types, name } = ActivityResultsSchemaError;

export const activityResultsSchema = yup
  .object({
    result: yup.string().required(name).nullable(),
    activity_types: yup
      .array()
      .when('is_universal', {
        is: false,
        then: yup
          .array()
          .required(activity_types.required)
          .min(1, activity_types.min),
      })
      .nullable(true),
  })
  .required();
