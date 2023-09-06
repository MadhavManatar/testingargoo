// ** import packages **
import { EmailComposerSchemaError } from 'constant/formErrorMessage.constant';
import * as yup from 'yup';

export const emailComposerSchema = yup
  .object({
    to: yup
      .array()
      .min(1, EmailComposerSchemaError.to)
      .required(EmailComposerSchemaError.to),
    html: yup.string().required(EmailComposerSchemaError.html).nullable(),
  })
  .required();
