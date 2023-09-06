// ** Import Packages **
import { useEffect } from 'react';
import { UseFormReset, UseFormSetValue } from 'react-hook-form';

// ** Types **
import {
  EmailComposerFieldType,
  UploadResponseInMail,
} from '../types/email.type';
import { CreateEmailTemplateFormFieldType } from '../types/emailTemplate.type';

// ** Helper **
import { convertEmailTemplateFieldsDisabledToNormal } from '../helper/emailTemplate';
import { useLazyGetEmailTemplateByIdQuery } from 'redux/api/emailTemplateApi';

export const useGetMailTemplateById = ({
  reset,
  id,
  setUploadFileData,
}: {
  reset: UseFormReset<CreateEmailTemplateFormFieldType>;
  id: number | null;
  setUploadFileData: React.Dispatch<
    React.SetStateAction<UploadResponseInMail[]>
  >;
}) => {
  const [getEmailTempByIdAPI] = useLazyGetEmailTemplateByIdQuery();

  useEffect(() => {
    if (id) {
      getMailTemplateDetail(id);
    }
  }, [id]);

  const getMailTemplateDetail = async (templateId: number) => {
    const { data, error } = await getEmailTempByIdAPI({ id: templateId }, true);

    if (data && !error) {
      const { attachments, description, template_name, subject, visibility } =
        data;

      const tempAttachments = attachments.map(
        (obj: {
          contentType: string;
          filename: string;
          path: string;
          size: number;
        }) => ({
          mimetype: obj.contentType,
          originalname: obj.filename,
          path: obj.path,
          size: obj.size,
        })
      );
      setUploadFileData(tempAttachments);
      reset({ attachments, description, template_name, subject, visibility });
    }
  };

  return { getMailTemplateDetail };
};

export const useSetTemplateValueInEmailComposeById = ({
  setValue,
  setUploadFileData,
  setRunSetFieldValueScript,
}: {
  setValue: UseFormSetValue<EmailComposerFieldType>;
  setUploadFileData: React.Dispatch<
    React.SetStateAction<UploadResponseInMail[]>
  >;
  setRunSetFieldValueScript?: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [getEmailTempByIdAPI] = useLazyGetEmailTemplateByIdQuery();

  const setTemplateValueInEmailComposeById = async (templateId: number) => {
    const { data, error } = await getEmailTempByIdAPI({ id: templateId }, true);

    if (data && !error) {
      const { attachments, description, subject } = data;
      const tempAttachments = attachments.map(
        (obj: {
          contentType: string;
          filename: string;
          path: string;
          size: number;
        }) => ({
          mimetype: obj.contentType,
          originalname: obj.filename,
          path: obj.path,
          size: obj.size,
        })
      );
      setUploadFileData(tempAttachments);
      setValue('attachments', attachments);
      setValue('html', convertEmailTemplateFieldsDisabledToNormal(description));
      setValue('subject', subject);
      if (setRunSetFieldValueScript) {
        setRunSetFieldValueScript(Math.random());
      }
    }
  };
  return { setTemplateValueInEmailComposeById };
};
