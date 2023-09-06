// ** import packages **
import { BasicErrorMessage } from 'constant/formErrorMessage.constant';
import * as yup from 'yup';

export const orgDepartmentsSchema = yup
  .object({
    name: yup.string().required(BasicErrorMessage.name).nullable(),
  })
  .required();
