// ** import packages **
import * as yup from 'yup';

// ** schema **
import {
  basicInfoSchema,
  commonAddressSchema,
  commonSocialMediaSchema,
} from 'pages/Setting/user-setting/User/validation-schema/user.schema';
import { UserSchemaErrorMessage } from 'constant/formErrorMessage.constant';

export const personalSettingsSchema = yup
  .object({
    first_name: basicInfoSchema.first_name,
    last_name: basicInfoSchema.last_name,
    mobile: basicInfoSchema.mobile,
    phone: basicInfoSchema.phone,
    email: basicInfoSchema.email,
    website: yup.string().nullable(),
    role: yup.number().required(UserSchemaErrorMessage.profile).nullable(),
    country: yup.string().nullable(),
    state: yup.string().nullable(),
    address1: yup.string().nullable(),
    zip: commonAddressSchema.zip,
    city: yup.string().nullable(),
    birth_date: yup.string().nullable(),
    facebook: commonSocialMediaSchema.facebook,
    linkedin: commonSocialMediaSchema.linkedin,
    twitter: commonSocialMediaSchema.twitter,
  })
  .required();
