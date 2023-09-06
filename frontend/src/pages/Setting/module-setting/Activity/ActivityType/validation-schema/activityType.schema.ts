// ** import packages **
import { ActivityTypeSchemaError } from 'constant/formErrorMessage.constant';
import * as yup from 'yup';

export const ActivityTypeSchema = yup
  .object({
    name: yup.string().required(ActivityTypeSchemaError.name),
    parent_type: yup.mixed().when('is_system', {
      is: (val: boolean) => !val,
      then: yup.number().required(ActivityTypeSchemaError.parent_type),
      otherwise: yup.mixed(),
    }),
    color: yup.string().required(ActivityTypeSchemaError.color),
    is_system: yup.boolean(),
  })
  .required();
