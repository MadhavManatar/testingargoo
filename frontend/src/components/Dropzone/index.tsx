// ** import packages **
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { FieldErrors } from 'react-hook-form';
// ======================================================
import Icon from 'components/Icon';
import { FILE_DROPZONE_ACCEPTS_EXTENSION } from 'constant/fileArray.constant';
import { fileSizeGenerator } from 'utils/util';
import { AttachmentFieldType } from 'components/detail-components/Attachment/types/attachment.types';
import { focusOnError } from 'helper';

type FileType = string | File;

interface Props {
  label?: string;
  name: string;
  files?: FileType[];
  onFileChange?: React.ChangeEventHandler<HTMLInputElement>;
  setFile: Dispatch<SetStateAction<File[]>>;
  isLoading: boolean;
  errors?: FieldErrors<AttachmentFieldType>;
}

const FileDropZone = (props: Props) => {
  const { label, name, onFileChange, errors, files, setFile, isLoading } =
    props;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const deleteAttachment = (id: number) => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFile((prev) => {
      return prev.filter((_val, index) => id !== index);
    });
  };
  const errorDivRef = useRef<Record<string, HTMLDivElement | null>>({});
  useEffect(() => {
    focusOnError(errorDivRef, errors);
  }, [errors]);

  return (
    <>
      {label && <div>{label}</div>}
      <div className="fileDropZone__wrapper">
        <div className="inner__wrapper">
          <div className="flex flex-wrap items-center justify-center">
            <Icon iconType="uploadFileFilledIcon" />
          </div>
          <p className="text">Select Or Drag & Drop files here to upload.</p>
        </div>
        <input
          ref={fileInputRef}
          className="fileDropZone__input"
          type="file"
          name={name}
          title=""
          onChange={onFileChange}
          multiple
          accept={`${FILE_DROPZONE_ACCEPTS_EXTENSION.join(',')}`}
        />
      </div>
      {errors?.files && (
        <div ref={(element) => (errorDivRef.current.files = element)}>
          <p className="ip__Error">{errors?.files.message}</p>
        </div>
      )}

      <div className="attachments__up__wrapper mt-[17px]">
        {files?.map((val: FileType, index) => {
          const file = val as File;
          const fileSize = fileSizeGenerator(file.size);
          return (
            <div className="attachments__box" key={index + 1}>
              <div className="attachments__details !w-[calc(100%_-_130px)] sm:!w-[calc(100%_-_114px)]">
                <Icon iconType="imageIconFilledPrimaryColor" />
                <span className="attachments__name ellipsis__2">
                  {file?.name || ''}
                </span>
              </div>
              <div className="attachments__size !w-[100px] sm:!w-[90px]">{`${fileSize.size} ${fileSize.sizeType}`}</div>
              <div className="attachment__close__btn">
                <Icon
                  iconType="closeBtnFilled"
                  onClick={() => {
                    if (!isLoading) {
                      deleteAttachment(index);
                    }
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default FileDropZone;
