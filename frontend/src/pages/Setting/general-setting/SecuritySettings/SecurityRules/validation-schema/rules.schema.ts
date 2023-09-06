// ** import packages **
import { RULES_SCHEMA_ERROR } from 'constant/formErrorMessage.constant';
import * as yup from 'yup';

const orgIpFieldSchema = yup.array().of(
  yup.object().shape({
    ip: yup
      .string()
      .matches(
        /^(?!0+(\.0+){3})(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])){3}$/,
        RULES_SCHEMA_ERROR.ip
      )
      .matches(
        /^(?!10\.|127\.|172\.(?:1[6-9]|2[0-9]|3[0-1])\.|192\.168\.).*$/,
        RULES_SCHEMA_ERROR.ip
      )
      .nullable(),
  })
);

export const rulesSchema = yup
  .object({
    pass_length: yup
      .number()
      .min(8,"Password length must be greater than or equal to 8")
      .max(16,"Password length must be less than or equal to 16")
      .label('Password length')
      .typeError("Password length is required*")
      .nullable(),
    org_ips: yup.object().shape({
      new: orgIpFieldSchema,
      update: orgIpFieldSchema,
    }),
  })
  .required();
