// ** import packages **
import { PasswordError } from 'constant/formErrorMessage.constant';
import * as yup from 'yup';

export const resetPasswordSchema = yup
  .object({
    password: yup.string().required(PasswordError.required),
    confirmPassword: yup
      .string()
      .required(PasswordError.confirm_required)
      .oneOf([yup.ref('password'), null], PasswordError.match),
  })
  .required();
