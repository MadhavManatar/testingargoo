// ** import packages **
import * as yup from 'yup';

export const restoreDaysSchema = yup
  .object({
    days: yup
      .number()
      .typeError('Please enter a valid number')
      .integer('Please enter a whole number')
      .min(7, 'Enter value from the range provided below')
      .max(180, 'Enter value from the range provided below')
      .required('Value is required'),
  })
  .required();
