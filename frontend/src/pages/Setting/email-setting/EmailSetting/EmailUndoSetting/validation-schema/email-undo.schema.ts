// ** import packages **
import { EmailUndoTimeSchemaError } from 'constant/formErrorMessage.constant';
import * as yup from 'yup';

export const emailUndoTimeSchema = yup.object({
  delay_time: yup
    .number()
    .max(30)
    .label('Delay time')
    .required(EmailUndoTimeSchemaError.delay_time.required)
    .typeError(EmailUndoTimeSchemaError.delay_time.valid),
});
