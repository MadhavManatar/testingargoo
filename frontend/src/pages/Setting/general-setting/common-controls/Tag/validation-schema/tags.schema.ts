// ** import packages **
import * as yup from 'yup';

// ** constant **
import { TagSchemaError } from 'constant/formErrorMessage.constant';

const {name, color} = TagSchemaError

export const tagSchema = yup
  .object({
    name: yup.string().required(name),
    color: yup.string().required(color),
  })
  .required();
