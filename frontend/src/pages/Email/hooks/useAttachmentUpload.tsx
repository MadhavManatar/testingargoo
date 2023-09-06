import { TokenProvider } from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';
import { useRef, useState } from 'react';
import { UseFormClearErrors, UseFormSetError } from 'react-hook-form';
import _ from 'lodash';
import {
  EmailComposerFieldType,
  UploadResponseInMail,
} from '../types/email.type';
import { CreateEmailTemplateFormFieldType } from '../types/emailTemplate.type';
import { useUploadFilleMutation } from 'redux/api/fileApi';

type Props = {
  clearErrors: UseFormClearErrors<
    EmailComposerFieldType | CreateEmailTemplateFormFieldType
  >;
  setError: UseFormSetError<
    EmailComposerFieldType | CreateEmailTemplateFormFieldType
  >;
  folderName?: TokenProvider | string;
};

export const useAttachmentUpload = (props: Props) => {
  const { clearErrors, setError, folderName } = props;

  // ** custom hook *
  const [uploadFilleAPI] = useUploadFilleMutation();

  // ** states
  const [loadingFiles, setLoadingFiles] = useState(0);
  const loadingFilesRef = useRef(loadingFiles);
  const [uploadFileDataSize, setUploadFileDataSize] = useState<number>(0);
  const [uploadFileData, setUploadFileData] = useState<UploadResponseInMail[]>(
    []
  );
  // ** ref
  const uploadFileDataSizeRef = useRef<number>(uploadFileDataSize);

  const attachmentUpload:
    | React.ChangeEventHandler<HTMLInputElement>
    | undefined = async (e) => {
    const { files } = e.target;
    const tempFileLength = _.clone(files?.length) || 0;

    let tempLoadingSize = loadingFilesRef.current;
    let isValidate = true;
    let totalFileSize = 0;

    if (files && files.length) {
      const fileFormData = new FormData();
      Array.from(files).forEach((file) => {
        totalFileSize += file.size;
        if (file.size < 2 * 1024 * 1024) {
          clearErrors('attachments');
          fileFormData.append('file', file);
        } else {
          isValidate = false;
          setError('attachments', {
            type: 'custom',
            message: 'Please upload less than 2MB',
          });
        }
      });

      uploadFileDataSizeRef.current = totalFileSize;

      if (uploadFileDataSizeRef.current > 5 * 1024 * 1024) {
        setError('attachments', {
          type: 'custom',
          message: 'Please upload attachments less than 5MB',
        });
        loadingFilesRef.current = 0;
        e.target.value = '';
      } else if (isValidate) {
        tempLoadingSize += tempFileLength;
        loadingFilesRef.current = tempLoadingSize;
        setLoadingFiles(tempLoadingSize);

        setUploadFileDataSize(uploadFileDataSizeRef.current);
        if (folderName) {
          const data = await uploadFilleAPI({
            data: fileFormData,
            params: {
              folder_name: folderName,
            },
          });
          if ('data' in data) {
            setUploadFileData((prev) => [...data.data, ...prev]);
          }
        }
        tempLoadingSize = loadingFilesRef.current - tempFileLength;
        loadingFilesRef.current = tempLoadingSize;
        setLoadingFiles(tempLoadingSize);
        e.target.value = '';
      } else {
        tempLoadingSize = loadingFilesRef.current - tempFileLength;
        loadingFilesRef.current = tempLoadingSize;
        setLoadingFiles(tempLoadingSize);
        e.target.value = '';
      }
    }
  };

  const removeAttachment = (index: number) => {
    uploadFileData.splice(index, 1);
    setUploadFileData([...uploadFileData]);
    setUploadFileData([...uploadFileData]);
  };

  const removeSizeAttachment = (index: number) => {
    const updatedSize = uploadFileDataSize - uploadFileData[index].size;
    uploadFileDataSizeRef.current = updatedSize;
    setUploadFileDataSize(updatedSize);
    clearErrors('attachments');
  };

  return {
    setUploadFileData,
    uploadFileData,
    loadingFiles,
    attachmentUpload,
    removeAttachment,
    removeSizeAttachment,
  };
};
