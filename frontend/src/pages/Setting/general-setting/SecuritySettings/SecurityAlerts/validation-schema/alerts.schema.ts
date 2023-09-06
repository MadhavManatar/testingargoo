import { SecuritySettingAlertSchemaError } from 'constant/formErrorMessage.constant';
import * as yup from 'yup';

const {
  delAccountCount,
  delContactCount,
  delDealsCount,
  delAccountCountMin,
  delContactCountMin,
  delDealsCountMin,
} = SecuritySettingAlertSchemaError;

export const alertsSchema = yup
  .object({
    del_contact_count: yup
      .number()
      .min(1, delContactCountMin)
      .typeError(delContactCount),
    del_account_count: yup
      .number()
      .min(1, delAccountCountMin)
      .typeError(delAccountCount),
    del_deals_count: yup
      .number()
      .min(1, delDealsCountMin)
      .typeError(delDealsCount),
  })
  .required();
