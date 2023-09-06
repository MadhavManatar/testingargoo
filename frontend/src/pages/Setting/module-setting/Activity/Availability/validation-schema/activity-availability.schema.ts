// ** import packages **
import { ActivityAvailabilitySchemaError } from 'constant/formErrorMessage.constant';
import * as yup from 'yup';

export const activityAvailabilitySchema = yup
  .object({
    stages: yup.array().of(
      yup.object().shape({
        availability: yup
          .string()
          .required(ActivityAvailabilitySchemaError.required)
          .typeError(ActivityAvailabilitySchemaError.valid),
      })
    ),
  })
  .required();
