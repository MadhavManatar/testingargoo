// =================== import packages ==================
import * as yup from 'yup';
// ======================================================
import { basicInfoSchema } from 'pages/Setting/user-setting/User/validation-schema/user.schema';

export const lostReasonSchema = yup
  .object({
    reason: basicInfoSchema.name,
  })
  .required();
