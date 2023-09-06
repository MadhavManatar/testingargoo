// ** Import Packages **
import { useEffect, useState } from 'react';

// ** components **
import FileDropZone from 'components/Dropzone';
import FormField from 'components/FormField';
import LinkPreview from 'components/LinkPreview';

// ** Types **
import {
  AttachmentFieldType,
  AttachmentFormProps,
} from '../types/attachment.types';

// ** Constants **
import { FILE_DROPZONE_ACCEPTS_EXTENSION } from 'constant/fileArray.constant';

const AttachmentForm = (props: AttachmentFormProps) => {
  const {
    errors,
    register,
    setError,
    clearErrors,
    setAttachments,
    attachment,
    isLink,
    isLoading,
  } = props;

  const [url, setUrl] = useState<string>();

  useEffect(() => {
    if (errors?.files) {
      setTimeout(() => {
        clearErrors('files');
      }, 2000);
    }
  }, [errors?.files]);

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> | undefined = (
    e
  ) => {
    if (e.target.files?.length) {
      const errorMsgArr: string[] = [];
      const largeErrorMsgArr: string[] = [];
      const FilteredFiles: File[] = [];

      Array(...e.target.files).forEach((file) => {
        const fileType = FILE_DROPZONE_ACCEPTS_EXTENSION.some(
          (val) => val === file.type
        );

        if (!fileType) {
          errorMsgArr.push(file.name);
        } else if (file.size / 1024 / 1024 > 10) {
          largeErrorMsgArr.push(file.name);
        } else {
          FilteredFiles.push(file);
        }
      });

      if (FilteredFiles.length + attachment.length <= 10) {
        setAttachments((prev) => [...prev, ...FilteredFiles]);
        clearErrors('files');
      } else {
        setError('files', {
          type: 'custom',
          message: 'Maximum 10 files is allowed',
        });
      }

      if (errorMsgArr.length) {
        setError('files', {
          type: 'custom',
          message: `${errorMsgArr.join(', ')} is not Allowed`,
        });
      }
      if (largeErrorMsgArr.length) {
        setError('files', {
          type: 'custom',
          message: `File size is too large, it must be less than 10 MB.`,
        });
      }
    }
  };
  const handleValue = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const urlValidator =
      /(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})[\\/\w .-]*\/?/;
    if (urlValidator.test(event?.target?.value)) {
      clearErrors('link');
      setUrl(event?.target?.value);
    } else {
      setUrl(undefined);
      setError('link', {
        type: 'custom',
        message: 'Please provide link',
      });
    }
  };
  return isLink ? (
    <div className="">
      <FormField<AttachmentFieldType>
        type="text"
        name="link"
        onChange={(event) => {
          handleValue(event);
        }}
        label="Enter URL"
        placeholder="Paste Link (URL)"
        register={register}
        error={errors.link}
        fieldLimit={100}
        required
      />
      {url ? (
        <>
          <LinkPreview url={url} />
        </>
      ) : null}
    </div>
  ) : (
    <div className="px-[10px]  sm:w-full sm:px-0">
      <FileDropZone
        onFileChange={onFileChange}
        files={attachment}
        setFile={setAttachments}
        name="files"
        isLoading={isLoading}
        errors={errors}
      />
    </div>
  );
};

export default AttachmentForm;
