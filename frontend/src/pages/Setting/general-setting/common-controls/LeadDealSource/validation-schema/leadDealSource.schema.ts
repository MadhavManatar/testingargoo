// ** import packages **
import * as yup from 'yup';

// ** constant **
import { LeadDealSourceSchemaError } from 'constant/formErrorMessage.constant';

export const leadDealSourceSchema = yup
  .object({
    name: yup.string().required(LeadDealSourceSchemaError.name).nullable(),
  })
  .required();


