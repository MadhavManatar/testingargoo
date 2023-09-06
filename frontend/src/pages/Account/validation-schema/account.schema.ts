// ** import packages **
import { TLDs } from 'global-tld-list';
import _ from 'lodash';
import * as yup from 'yup';

// ** schema **
import { basicInfoSchema } from 'pages/Setting/user-setting/User/validation-schema/user.schema';

// ** constants **
import { AccountSchemaErrorMessage } from 'constant/formErrorMessage.constant';
import { onlyNumberRegex } from 'constant/regex.constant';

// ** Util **
import { isValidEmail } from 'utils/util';

const {
  account_owner_id,
  email,
  employees,
  name,
  phone: PhoneError,
  related_contact,
} = AccountSchemaErrorMessage;

export const emailTestValidateAccount = (
  v: string | null | undefined,
  value: any
) => {
  const { emails } = value.from[1].value;
  const currentValue = value?.parent?.value?.trim()?.toLowerCase();
  const tld = (currentValue || '').split('.').slice(-1)[0];
  const isValidTLDs = TLDs.indexOf(tld) >= 0;

  if (!isValidTLDs && currentValue) {
    return value?.createError({ message: email.valid });
  }

  if (
    ((emails && emails?.length) || 0) > 1 &&
    value?.parent?.isPrimary &&
    !currentValue
  ) {
    return value?.createError({ message: email.required });
  }

  if (
    currentValue &&
    isValidEmail(currentValue) &&
    ((emails && emails?.length) || 0) > 1
  ) {
    const tempMail = _.cloneDeep(emails);
    tempMail.splice(value?.options.index, 1);

    const checkMailIsExist = tempMail.find(
      (emailObj: { value: string }) =>
        emailObj?.value?.trim().toLowerCase() === currentValue
    );

    if (checkMailIsExist) {
      return value?.createError({ message: 'Email already exists in list' });
    }
  }

  return true;
};

export const accountSchema = yup
  .object({
    account_owner_id: yup.string().required(account_owner_id).nullable(),
    name: yup.string().trim().required(name).nullable(true),
    phones: yup.array().of(
      yup.object().shape({
        phoneType: yup
          .string()
          .nullable(true)
          .test('phone_type', PhoneError.phoneType, (v, value: any) => {
            const {
              phone,
            }: {
              phone: {
                isPrimary: boolean;
                value: string | number;
                phoneType: string;
              }[];
            } = value.options.from[1].value;
            if (
              (value?.parent?.value ||
                (((phone && phone?.length) || 0) > 1 &&
                  value?.parent?.isPrimary)) &&
              !value?.parent?.phoneType
            ) {
              return false;
            }
            return true;
          }),
        value: basicInfoSchema.phone.test(
          'value',
          PhoneError.required,
          (v, value: any) => {
            const { phones } = value.options.from[1].value;
            const checkPhoneLength = ((phones && phones?.length) || 0) > 1;
            const currentValue = value?.parent?.value?.trim();

            if (
              (value?.parent?.phoneType ||
                (checkPhoneLength && value?.parent?.is_primary)) &&
              !currentValue
            ) {
              return false;
            }

            if (currentValue && checkPhoneLength) {
              const tempPhone = _.cloneDeep(phones);

              tempPhone.splice(value?.options.index, 1);
              const checkPhoneIsExist = tempPhone.find(
                (phoneObj: { value: string }) =>
                  phoneObj?.value?.trim().toLowerCase() ===
                  currentValue?.toLowerCase()
              );
              if (checkPhoneIsExist) {
                return value?.createError({
                  message: 'Phone already exists in list',
                });
              }
            }

            return true;
          }
        ),
      })
    ),
    emails: yup.array().of(
      yup.object().shape({
        value: yup
          .string()
          .lowercase()
          .email(email.valid)
          .nullable(true)
          .test('email', email.required, emailTestValidateAccount),
      })
    ),
    related_contacts: yup.array().of(
      yup.object().shape(
        {
          job_role: yup
            .string()
            .nullable()
            .test('job_role', related_contact.job_role, (v, value: any) => {
              const {
                related_contacts,
              }: {
                related_contacts: {
                  isPrimary: boolean;
                  value: string | number | null;
                  job_role: string | null;
                }[];
              } = value.options.from[1].value;
              if (
                (value?.parent?.value ||
                  (((related_contacts && related_contacts?.length) || 0) > 1 &&
                    value?.parent?.isPrimary)) &&
                !value?.parent?.job_role
              ) {
                return false;
              }
              return true;
            }),
          value: yup
            .string()
            .test('value', related_contact.contact, (v, value: any) => {
              const {
                related_contacts,
              }: {
                related_contacts: {
                  isPrimary: boolean;
                  value: string | number;
                  job_role: string | null;
                }[];
              } = value.options.from[1].value;
              if (
                (value?.parent?.job_role ||
                  (((related_contacts && related_contacts?.length) || 0) > 1 &&
                    value?.parent?.isPrimary)) &&
                !value?.parent?.value
              ) {
                return false;
              }
              return true;
            })
            .nullable(),
        },
        [['value', 'job_role']]
      )
    ),

    fax: basicInfoSchema.fax,

    employees: yup
      .string()
      .test('numberOnly', employees, (value) =>
        value ? !!value?.match(onlyNumberRegex) : true
      )
      .nullable(true),
    annual_revenue: yup.string().nullable(true),
    zip: basicInfoSchema.zip,
  })
  .required();
