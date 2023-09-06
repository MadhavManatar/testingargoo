// ** import packages **
import { TLDs } from 'global-tld-list';
import _ from 'lodash';
import * as yup from 'yup';

// ** schema **
import { basicInfoSchema } from 'pages/Setting/user-setting/User/validation-schema/user.schema';

// ** constant **
import { ContactSchemaErrorMessage } from 'constant/formErrorMessage.constant';

// ** Util **
import { isValidEmail } from 'utils/util';

const {
  contact_owner_id,
  email,
  phone: PhoneError,
  related_contacts,
  timezone,
  related_accounts,
} = ContactSchemaErrorMessage;

export const emailTestValidate = (v: string | null | undefined, value: any) => {
  const { emails } = value.from[1].value;
  const checkMailLength = ((emails && emails?.length) || 0) > 1;
  const currentValue = value?.parent?.value?.trim();

  const tld = (currentValue || '').split('.').slice(-1)[0];
  const isValidTLDs = TLDs.indexOf(tld) >= 0;

  if (!isValidTLDs && currentValue) {
    return value?.createError({
      message: email.valid,
    });
  }

  if (checkMailLength && value?.parent?.is_primary && !currentValue) {
    return value?.createError({
      message: email.required,
    });
  }

  if (currentValue && isValidEmail(currentValue) && checkMailLength) {
    const tempMail = _.cloneDeep(emails);
    tempMail.splice(value?.options.index, 1);

    const checkMailIsExist = tempMail.find(
      (emailObj: { value: string }) =>
        emailObj?.value?.trim().toLowerCase() === currentValue?.toLowerCase()
    );

    if (checkMailIsExist) {
      return value?.createError({ message: 'Email already exists in list' });
    }
  }

  return true;
};

export const contactSchema = yup
  .object({
    name: basicInfoSchema.contact_name,
    emails: yup.array().of(
      yup.object().shape({
        value: yup
          .string()
          .lowercase()
          .nullable(true)
          .email(email.valid)
          .test('email', emailTestValidate),
      })
    ),
    contact_owner_id: yup.string().required(contact_owner_id),
    account_id: yup.array().of(yup.string().nullable()),
    timezone: yup.string().required(timezone).nullable(),
    phones: yup.array().of(
      yup.object().shape(
        {
          phoneType: yup
            .string()
            .test('phone_type', PhoneError.phoneType, (v, value: any) => {
              const {
                phone,
              }: {
                phone: {
                  is_primary: boolean;
                  value: string | number;
                  phoneType: string;
                }[];
              } = value.options.from[1].value;
              if (
                (value?.parent?.value ||
                  (((phone && phone?.length) || 0) > 1 &&
                    value?.parent?.is_primary)) &&
                !value?.parent?.phoneType
              ) {
                return false;
              }
              return true;
            })
            .nullable(),
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
        },
        [['value', 'phoneType']]
      )
    ),

    related_contacts: yup
      .array()
      .of(
        yup.object().shape({
          job_role: yup
            .string()
            .test('job_role', related_contacts.job_role, (v, value: any) => {
              if (value.parent.contact_id && !value?.parent?.job_role) {
                return false;
              }
              return true;
            }),
          contact_id: yup.lazy((value) => {
            switch (typeof value) {
              case 'number':
                return yup.number().when('job_role', {
                  is: (val: string) => !!val,
                  then: yup.number().required(related_contacts.contact),
                  otherwise: yup.number().nullable(true),
                });
              case 'string':
                return yup.string().when('job_role', {
                  is: (val: string) => !!val,
                  then: yup.string().required(related_contacts.contact),
                  otherwise: yup.string().nullable(true),
                });
              default:
                return yup.mixed();
            }
          }),
        })
      )
      .nullable(),

    related_accounts: yup
      .array()
      .of(
        yup.object().shape({
          job_role: yup
            .string()
            .test('job_role', related_accounts.job_role, (v, value: any) => {
              if (value.parent.account_id && !value?.parent?.job_role) {
                return false;
              }
              return true;
            }),
          account_id: yup.lazy((value) => {
            switch (typeof value) {
              case 'number':
                return yup.number().when('job_role', {
                  is: (val: string) => !!val,
                  then: yup.number().required(related_accounts.account),
                  otherwise: yup.number().nullable(true),
                });
              case 'string':
                return yup.string().when('job_role', {
                  is: (val: string) => !!val,
                  then: yup.string().required(related_accounts.account),
                  otherwise: yup.string().nullable(true),
                });
              default:
                return yup.mixed();
            }
          }),
        })
      )
      .nullable(),
    fax: basicInfoSchema.fax,
    skype: basicInfoSchema.url,
    twitter: basicInfoSchema.url,
    zip: basicInfoSchema.zip,
  })
  .required();

export const relatedContactSchema = yup
  .object({
    name: basicInfoSchema.name,
    emails: yup.array().of(
      yup.object().shape({
        value: basicInfoSchema.email,
      })
    ),
    phone: yup.array().of(
      yup.object().shape({
        phoneType: yup.string().required(PhoneError.phoneType),
        value: basicInfoSchema.phone.required(PhoneError.required),
      })
    ),
  })
  .required();
