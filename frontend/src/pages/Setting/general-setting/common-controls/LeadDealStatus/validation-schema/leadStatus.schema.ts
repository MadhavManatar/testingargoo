// ** import packages **
import { BasicErrorMessage } from 'constant/formErrorMessage.constant';
import * as yup from 'yup';

export const leadStatusSchema = yup
  .object({
    name: yup.string().required(BasicErrorMessage.status).nullable(),
    color: yup.string().required(BasicErrorMessage.color).nullable(),
  })
  .required();
