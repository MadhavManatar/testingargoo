// ** import packages **
import * as yup from 'yup';

export const profileTransferSchema = yup.object({
  id: yup.number().required('Profile is required'),
  transfer_id: yup.number().required('Profile is required'),
});
