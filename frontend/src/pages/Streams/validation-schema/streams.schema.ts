// ** import packages **
import * as yup from 'yup';

// ** constant **
import { STREAM_ERROR } from 'constant/formErrorMessage.constant';

export const streamSchema = yup
  .object({
    name: yup.string().trim().required(STREAM_ERROR),
  })
  .required();
