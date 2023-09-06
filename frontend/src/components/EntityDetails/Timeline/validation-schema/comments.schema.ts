// ** import packages **
import * as yup from 'yup';

// ** constant **
import { CommentTimelineSchemaError } from 'constant/formErrorMessage.constant';

export const commentSchema = yup
  .object({
    commentText: yup
      .string()
      .nullable(true)
      .test('commentText', CommentTimelineSchemaError.required, (html) => {
        const strippedHtml = (html || '')
          .replace(/<[^>]+>/g, '')
          .replace(/&nbsp;/g, '');
        return !!strippedHtml.replace(/ /g, '').length;
      }),
  })
  .required();


  