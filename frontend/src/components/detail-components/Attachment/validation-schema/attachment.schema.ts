// =================== import packages ==================
import * as yup from 'yup';
// ======================================================

export const attachmentSchema = yup
  .object({
    link: yup.string().url(),
  })
  .required();
