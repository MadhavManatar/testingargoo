// ** import packages **
import * as yup from 'yup';

export const AddSnippetTypeSchema = yup
  .object({
    title: yup.string().required('title is required'),
    type: yup.string().required('type is required'),
    category: yup.mixed().required('category is required'),
    accessibility: yup.string().required('accessibility is required'),
    snippet_text: yup.string().required('Snippet is required'),
  })
  .required();
