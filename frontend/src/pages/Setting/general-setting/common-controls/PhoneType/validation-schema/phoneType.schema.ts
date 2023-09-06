// ** import packages **
import * as yup from 'yup';

// ** constant **
import { PhoneType } from 'constant/formErrorMessage.constant';

export const phoneTypeSchema = yup
  .object({
    name: yup.string().required(PhoneType).nullable(),
  })
  .required();
