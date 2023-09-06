// ** import packages **
import * as yup from 'yup';

// ** constant ** 
import { SMTPAdvanceSchemaError } from 'constant/formErrorMessage.constant';

const {imap_host,imap_port,smtp_host,smtp_port} = SMTPAdvanceSchemaError;

export const smtpAdvanceFormSchema = yup
  .object({
    imap_host: yup
      .string()
      .required(imap_host.required)
      .test('smtpHost', imap_host.valid, (value) =>
        value ? !!value.startsWith('imap') : true  
      )
      .nullable(true),
    imap_port: yup
      .number()
      .typeError(imap_port.number)
      .required(imap_port.required)
      .test('smtpPort', imap_port.valid, (value) =>
        value ? !![993, 143].includes(value) : true
      )
      .nullable(true),
    smtp_host: yup
      .string()
      .required(smtp_host.required)
      .test('smtpHost', smtp_host.valid, (value) =>
        value ? !!value.startsWith('smtp') : true
      )
      .nullable(true),
    smtp_port: yup
      .number()
      .test(
        'smtpPort',
        smtp_port.valid,
        (value) => (value ? !![25, 465, 587, 2525].includes(value) : true)
      )
      .typeError(smtp_port.number)
      .required(smtp_port.require)
      .nullable(true),
    smtp_secure: yup.boolean().nullable(true),
    imap_secure: yup.boolean().nullable(true),
  })
  .required();
