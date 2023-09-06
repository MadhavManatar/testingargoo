// ** import packages **
import { BasicErrorMessage } from 'constant/formErrorMessage.constant';
import * as yup from 'yup';

export const leadStatusSchema = yup
  .object({
    name: yup.string().trim().required(BasicErrorMessage.name).nullable(),
    color: yup.string().required(BasicErrorMessage.color).nullable(),
  })
  .required();
