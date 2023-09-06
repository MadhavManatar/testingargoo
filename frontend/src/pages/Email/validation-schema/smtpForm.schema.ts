// ** import packages **
import { PasswordError } from 'constant/formErrorMessage.constant';
import { basicInfoSchema } from 'pages/Setting/user-setting/User/validation-schema/user.schema';
import * as yup from 'yup';

export const smtpFormSchema = yup
  .object({
    email: basicInfoSchema.email,
    password: yup.string().required(PasswordError.required),
  })
  .required();
