// ** Import Package **
import { EmailError } from 'constant/formErrorMessage.constant';
import * as yup from "yup"

export const forgotPasswordSchema = yup.object({
  email: yup.string().required(EmailError.required).email(EmailError.valid),
});
