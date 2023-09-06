// ** import packages **
import * as yup from 'yup';

// ** constant ** 
import { EmailTemplateSchemaError } from 'constant/formErrorMessage.constant';

const { template_name, subject, description } = EmailTemplateSchemaError;

export const emailTemplateSchema = yup
  .object({
    template_name: yup.string().required(template_name),
    subject: yup.string().required(subject),
    description: yup.string().required(description).nullable(),
  })
  .required();
