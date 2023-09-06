// ** import packages **
import * as yup from 'yup';
// ** schema **
import { basicInfoSchema } from 'pages/Setting/user-setting/User/validation-schema/user.schema';

// ** constant **
import { RegisterSchemaError } from 'constant/formErrorMessage.constant';

const {
  firstName,
  lastName,
  businessEmail,
  password,
  agreeTerms,
  organizationName,
} = RegisterSchemaError;

export const basicDetailsSchema = yup
  .object({
    firstName: yup.string().required(firstName),
    lastName: yup.string().required(lastName),
    businessEmail: yup
      .string()
      .required(businessEmail.required)
      .email(businessEmail.valid)
      .lowercase(),
    mobile: basicInfoSchema.mobile,
  })
  .required();

export const passwordDetailsSchema = yup
  .object({
    password: yup.string().required(password.required).min(8, password.min),
    confirmPassword: yup
      .string()
      .required(password.confirm_required)
      .oneOf([yup.ref('password'), null], password.match),
    agreeTerms: yup.boolean().oneOf([true], agreeTerms),
  })
  .required();

export const companyDetailsSchema = yup.object({
  organizationName: yup.string().required(organizationName),
});
