// ** import packages **
import { DurationError } from 'constant/formErrorMessage.constant';
import * as yup from 'yup';

export const activityTimeSetSchema = yup
  .object({
    stages: yup.array().of(
      yup.object().shape({
        activity_interval: yup
          .number()
          .required(DurationError.required)
          .typeError(DurationError.valid)
          .min(1, DurationError.min),
      })
    ),
  })
  .required();
