// ** import packages **
import * as yup from 'yup';

// ** constant ** 
import { AssignTagSchemaError } from 'constant/formErrorMessage.constant';

export const assignTagSchema = yup
  .object({
    tags: yup
      .array()
      .min(1, AssignTagSchemaError.min)
      .required(AssignTagSchemaError.required)
      .nullable(true),
  })
  .required();
