// ** import packages **
import * as yup from 'yup';
// ** constants **
import {
  LoginSchemaError,
  OrganizationSchemaError,
} from 'constant/formErrorMessage.constant';

export const loginSchema = yup
  .object({
    email: yup
      .string()
      .required(LoginSchemaError.email.required)
      .email(LoginSchemaError.email.valid)
      .lowercase(),
    password: yup.string().required(LoginSchemaError.password),
  })
  .required();

export const organizationSchema = yup.object({
  organization: yup.string().required(OrganizationSchemaError.organization),
});
