// ** import packages **
import * as yup from 'yup';

export const AddSnippetCategoryTypeSchema = yup
  .object({ name: yup.string().required('name is required') })
  .required();
