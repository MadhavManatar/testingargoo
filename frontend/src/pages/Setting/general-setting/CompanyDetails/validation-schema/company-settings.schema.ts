// ** external packages **
import * as yup from 'yup';

// ** others **
import { basicInfoSchema } from '../../../user-setting/User/validation-schema/user.schema';

// ** constant **
import { CompanySettingsSchemaError } from 'constant/formErrorMessage.constant';

export const companySettingsSchema = yup
  .object({
    name: yup.string().required(CompanySettingsSchemaError.name).nullable(),

    phone: basicInfoSchema.phone.required(CompanySettingsSchemaError.phone),
    mobile: basicInfoSchema.mobile,
    website: yup.string().nullable(),
    organization_category: yup
      .string()
      .required(CompanySettingsSchemaError.organization_category)
      .nullable(),
    email: basicInfoSchema.email.required(CompanySettingsSchemaError.email),
  })
  .required();
