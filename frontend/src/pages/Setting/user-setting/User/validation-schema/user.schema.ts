// ** import packages **
import * as yup from 'yup';
import { TLDs } from 'global-tld-list';

// ** constants **
import { UserSchemaErrorMessage } from 'constant/formErrorMessage.constant';
import {
  facebookProfileURLRegex,
  faxRegex,
  linkedInProfileURLRegex,
  onlyNumberRegex,
  phoneRegex,
  twitterProfileURLRegex,
  urlRegex,
  // zipCodeRegex,
} from 'constant/regex.constant';

const {
  first_name,
  last_name,
  name,
  phone,
  email,
  // zip,
  url,
  numberOnly,
  fax,
  facebook,
  linkedin,
  twitter,
  profile,
} = UserSchemaErrorMessage;

const globalEmailTestValidate = (v: string | null | undefined) => {
  const tld = (v || '').split('.').slice(-1)[0];
  const isValidTLDs = TLDs.indexOf(tld) >= 0;

  if (!isValidTLDs) {
    return false;
  }

  return true;
};

export const basicInfoSchema = {
  first_name: yup.string().trim().required(first_name).nullable(true),
  last_name: yup.string().trim().required(last_name).nullable(true),
  name: yup.string().required(name).nullable(true),
  contact_name: yup.string().trim().required(name).nullable(true),
  phone: yup
    .string()
    .test('mobile', phone.valid, (value) =>
      value ? !!value?.match(phoneRegex) : true
    )
    .nullable(true),
  mobile: yup
    .string()
    .test('mobile', phone.valid, (value) =>
      value ? !!value?.match(phoneRegex) : true
    )
    .nullable(true),
  email: yup
    .string()
    .required(email.required)
    .lowercase()
    .email(email.valid)
    .test('email', email.valid, globalEmailTestValidate)
    .nullable(true),
  country: yup.string().nullable(true),
  state: yup.string().nullable(true),
  address1: yup.string().nullable(true),
  address2: yup.string().nullable(true),
  zip: yup
    .string()
    .nullable(true),
    // .test('zip', zip.min, (value) => (value ? value.length > 4 : true))
    // .test('zip', zip.valid, (value) =>
    //   value ? !!value.match(zipCodeRegex) : true
    // ),
  city: yup.string().nullable(true),
  birth_date: yup.string().nullable(true),
  url: yup
    .string()
    .test('url', url, (value) => (value ? !!value?.match(urlRegex) : true))
    .nullable(true),
  numberOnly: yup
    .string()
    .test('numberOnly', numberOnly, (value) =>
      value ? !!value?.match(onlyNumberRegex) : true
    )
    .nullable(true),
  fax: yup
    .string()
    .test('fax', fax, (value) => (value ? !!value?.match(faxRegex) : true))
    .nullable(true),
  stringAndNumber: yup.lazy((value) => {
    switch (typeof value) {
      case 'number':
        return yup.number();
      case 'string':
        return yup.string();
      default:
        return yup.mixed();
    }
  }),
};

export const commonAddressSchema = {
  country: basicInfoSchema.country,
  state: basicInfoSchema.state,
  address1: basicInfoSchema.address1,
  address2: basicInfoSchema.address2,
  zip: basicInfoSchema.zip,
  city: basicInfoSchema.city,
};

export const commonSocialMediaSchema = {
  facebook: yup
    .string()
    .test('facebook', facebook, (value) =>
      value ? !!value?.match(facebookProfileURLRegex) : true
    )
    .nullable(true),
  linkedin: yup
    .string()
    .test('linkedin', linkedin, (value) =>
      value ? !!value?.match(linkedInProfileURLRegex) : true
    )
    .nullable(true),
  twitter: yup
    .string()
    .test('twitter', twitter, (value) =>
      value ? !!value?.match(twitterProfileURLRegex) : true
    )
    .nullable(true),
};

export const userSchema = yup
  .object({
    first_name: basicInfoSchema.first_name,
    last_name: basicInfoSchema.last_name,
    phone: basicInfoSchema.phone,
    mobile: basicInfoSchema.mobile,
    email: basicInfoSchema.email,
    role: yup.string().required(profile).nullable(),
    birth_date: basicInfoSchema.birth_date,
    zip: basicInfoSchema.zip,
    ...commonSocialMediaSchema,
  })
  .required();

export const userTransferSchema = yup.object({
  user: yup.array().of(
    yup.object({
      id: yup.number().required(),
      transfer_id: yup.number().required("User is required"),
    })
  ),
});
