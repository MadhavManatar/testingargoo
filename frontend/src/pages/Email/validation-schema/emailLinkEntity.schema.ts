// ** import packages **
import * as yup from 'yup';

export const emailLinkEntitySchema = yup
  .object({
    entity: yup.string().required("Entity is a required field").nullable(),
  })
  .required();
