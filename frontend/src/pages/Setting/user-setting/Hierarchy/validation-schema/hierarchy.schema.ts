// ** import packages **
// HELLO
import * as yup from 'yup';

// ** constant **
// import { TagSchemaError } from 'constant/formErrorMessage.constant';

export const hierarchyAccountSchema = yup
  .object({
    title: yup.string().required('Title'),
  })
  .required();

export const hierarchyRegionSchema = yup
  .object({
    title: yup.string().required('Title'),
  })
  .required();
