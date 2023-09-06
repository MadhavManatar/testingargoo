// ** import packages **
import * as yup from 'yup';

// ** constant **
import { NoteSchemaError } from 'constant/formErrorMessage.constant';

export const noteSchema = yup
  .object({
    description: yup
      .string()
      .nullable()
      .test('description', NoteSchemaError.description, (html) => {
        const strippedHtml = (html || '')
          .replace(/<[^>]+>/g, '')
          .replace(/&nbsp;/g, '');
        return !!strippedHtml.replace(/ /g, '').length;
      }),
  })
  .required();

export const noteSchemaAutoSave = yup.object({
  description: yup
    .string()
    .nullable()
    .test('description', NoteSchemaError.description, (html) => {
      const strippedHtml = (html || '')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, '');
      return !!strippedHtml.replace(/ /g, '').length;
    }),
});
