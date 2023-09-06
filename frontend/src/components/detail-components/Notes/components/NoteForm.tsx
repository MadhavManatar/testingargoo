// ** Import Packages **
import { useEffect, useRef, useState } from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
} from 'react-hook-form';

// ** Components **
import FormField from 'components/FormField';
import Icon from 'components/Icon';
import Image from 'components/Image';
import LinkPreview from 'components/LinkPreview';
import MentionIntegration from './MentionComponents';
import FileTypeRenderer from './NoteFileTypeRender';

// ** Types **
import { attachmentResponse } from 'components/detail-components/Attachment/types/attachment.types';
import {
  NoteFieldType,
  NoteResponse,
  NoteResponseFileType,
} from '../types/notes.type';

// ** Constant **
import { FILE_DROPZONE_ACCEPTS_EXTENSION } from 'constant/fileArray.constant';

// ** Helper **
import { downloadAttachmentFile, focusOnError } from 'helper';

interface NoteFormProps {
  isAddForm?: boolean;
  errors: FieldErrors<NoteFieldType>;
  control: Control<NoteFieldType>;
  setValue: UseFormSetValue<NoteFieldType>;
  register: UseFormRegister<NoteFieldType>;
  notes: (File | NoteResponseFileType)[];
  setError: UseFormSetError<NoteFieldType>;
  clearErrors: UseFormClearErrors<NoteFieldType>;
  deleteFile: (id: number, attach_id: number) => void;
  setNoteFile: (file: FileList) => void;
  documentRef: React.MutableRefObject<(() => void) | undefined>;
  noteData?: NoteResponse;
  getValue: UseFormGetValues<NoteFieldType>;
  setPin: React.Dispatch<React.SetStateAction<boolean>>;
  hidden?: boolean;
  setUserIds?: React.Dispatch<React.SetStateAction<number[] | undefined>>;
}

function NoteForm(props: NoteFormProps) {
  const {
    isAddForm = false,
    errors,
    register,
    notes,
    setUserIds,
    hidden,
    setValue,
    control,
    setError,
    clearErrors,
    setPin,
    noteData,
    deleteFile,
    setNoteFile,
    documentRef,
    getValue,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    if (errors?.files) {
      setTimeout(() => {
        clearErrors('files');
      }, 2000);
    }
    documentRef.current = openInput;
  }, [errors?.files]);

  useEffect(() => {
    setValue(
      'is_default',
      noteData?.timeline_data?.[0].is_pinned || noteData?.is_drafted || false
    );
  }, [noteData?.timeline_data?.[0].is_pinned, noteData?.is_drafted]);

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> | undefined = (
    e
  ) => {
    if (
      e.target.files?.length &&
      notes &&
      (e.target.files?.length || 0) + notes.length <= 10
    ) {
      const fileObj = e.target.files;
      const isFilesNotValid = Object.values(fileObj).filter(
        (file) => !file.type.length
      );
      const largeErrorMsgArr: string[] = [];

      Array(...e.target.files).forEach((file) => {
        if (file.size / 1024 / 1024 > 10) {
          largeErrorMsgArr.push(file.name);
        }
      });

      if (isFilesNotValid?.length > 0) {
        setError('files', {
          type: 'error',
          message: `You can't add this extension file`,
        });
      }

      if (largeErrorMsgArr?.length) {
        setError('files', {
          type: 'custom',
          message: `File size is too large, it must be less than 10 MB.`,
        });
      }

      if (isFilesNotValid && largeErrorMsgArr?.length <= 0) {
        setNoteFile(fileObj);
        clearErrors('files');
      }
    } else if (notes && (e.target.files?.length || 0) + notes.length > 10) {
      setError('files', {
        type: 'custom',
        message: 'Maximum 10 files is allowed',
      });
    }
    if (e.target.files?.length !== notes?.length) {
      setValue('files', [], { shouldDirty: true });
    }
  };

  const openInput = () => {
    if (inputRef.current) {
      inputRef.current?.click();
    }
  };

  const errorDivRef = useRef<Record<string, HTMLDivElement | null>>({});
  useEffect(() => {
    focusOnError(errorDivRef, errors);
  }, [errors]);

  const handelClick = () => {
    const data = getValue('is_default');
    setValue('is_default', !data);
    setPin(true);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-end">
        <FormField<NoteFieldType>
          wrapperClass={`mb-0 pin__note__checkbox ${
            hidden ? 'opacity-50 pointer-events-none' : null
          }`}
          type="checkbox"
          name="is_default"
          label="Pin this note"
          disabled={hidden}
          onClick={() => handelClick()}
          register={register}
          error={errors.is_default}
        />
      </div>
      <Controller
        name="description"
        key="mention_default"
        control={control}
        render={({ field: { onChange } }) => {
          //
          return (
            <>
              <MentionIntegration
                setUrl={setUrl}
                onChange={onChange}
                noteData={noteData}
                setUserIds={setUserIds}
              />
              {url ? (
                <>
                  <a
                    className="text-[16px] text-primaryColor font-biotif__Regular underline inline-block w-full mt-[-7px] relative z-[3]"
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <LinkPreview url={url} />
                  </a>
                </>
              ) : null}
            </>
          );
        }}
      />

      {errors.description && (
        <div ref={(element) => (errorDivRef.current.description = element)}>
          <p className="ip__Error">{errors.description?.message}</p>
        </div>
      )}

      <input
        className="fileDropZone__input hidden"
        type="file"
        ref={inputRef}
        onChange={onFileChange}
        multiple
        accept={`${FILE_DROPZONE_ACCEPTS_EXTENSION.join(',')}`}
      />
      {errors.files && (
        <div ref={(element) => (errorDivRef.current.files = element)}>
          <p className="ip__Error">{errors.files.message}</p>
        </div>
      )}
      <div
        className={`attachment__view__wrapper mt-[20px] ${
          notes?.length ? '' : 'no__data'
        }`}
      >
        <div className="mx-[-10px] flex flex-wrap">
          {notes?.map((val, index) => {
            const file = val as File;
            const responseFile = val as NoteResponseFileType;
            return (
              <div
                key={index}
                className="attachment__col w-1/5 px-[10px] mb-[16px] md:w-1/4 sm:w-1/3 xsm:w-1/2"
              >
                <div className="w-full pt-[100%] relative overflow-hidden group before:content-[''] before:duration-500 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-[10px] before:bg-black/70 before:z-[2] before:opacity-0 hover:before:opacity-100">
                  <FileTypeRenderer
                    file={file}
                    mimeType={file.type || responseFile.mimeType}
                    deleteFile={(id, attach_id) => {
                      if (inputRef.current) {
                        inputRef.current.value = '';
                      }

                      deleteFile(id, attach_id);
                    }}
                    index={index}
                    disableDownload={isAddForm}
                  />
                </div>
                <p className="font-biotif__Regular text-[14px] text-ip__black__text__color whitespace-pre overflow-hidden text-ellipsis mt-[5px] text-center">
                  {responseFile?.original_name || file.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default NoteForm;

type FileTypeRendererProps = {
  mimeType: string;
  file: File | NoteResponseFileType;
};

export const FileRender = (props: FileTypeRendererProps) => {
  const { file, mimeType } = props;
  const renderFile = () => {
    const responseFile = file as attachmentResponse;

    switch (mimeType?.split('/')[0]) {
      case 'image':
        return (
          <>
            <a
              className="text-[16px] text-primaryColor font-biotif__Regular underline inline-block"
              href={responseFile?.url}
              target="_blank"
              rel="noreferrer"
            >
              <Image
                imgPath={responseFile?.url}
                imgClassName="absolute top-0 left-0 !w-full !h-full object-cover object-center rounded-[10px] duration-500 hover:blur-[0px] border border-whiteScreen__BorderColor"
                serverPath={!!responseFile?.url}
              />
            </a>
            <Icon
              className="cursor-pointer shadow-[0px_0px_10px_#dbdbdb] rounded-[5px] absolute top-[6px] right-[32px] z-[2] duration-500 w-[20px] h-[20px] bg-white"
              onClick={() => {
                downloadAttachmentFile({
                  url: responseFile?.url,
                  fileName:
                    responseFile?.doc_details?.original_name || 'smackDab',
                });
              }}
              iconType="timelineDocumentDownloadIcon"
            />
          </>
        );
      case 'video':
        return (
          <>
            {' '}
            <a
              className="text-[16px] text-primaryColor font-biotif__Regular underline inline-block"
              href={responseFile?.url}
              target="_blank"
              rel="noreferrer"
            >
              <Image
                imgPath={responseFile?.url}
                imgClassName="absolute top-0 left-0 !w-full !h-full object-cover object-center rounded-[10px] duration-500 hover:blur-[0px] border border-whiteScreen__BorderColor"
                serverPath={!!responseFile?.url}
              />
            </a>
            <Icon
              className="cursor-pointer shadow-[0px_0px_10px_#dbdbdb] rounded-[5px] absolute top-[6px] right-[32px] z-[2] duration-500 w-[20px] h-[20px] bg-white"
              onClick={() => {
                downloadAttachmentFile({
                  url: responseFile?.url,
                  fileName:
                    responseFile?.doc_details?.original_name || 'smackDab',
                });
              }}
              iconType="timelineDocumentDownloadIcon"
            />
          </>
        );
      case 'application':
        return (
          <>
            <a
              className="text-[16px] text-primaryColor font-biotif__Regular underline inline-block"
              href={responseFile?.url}
              target="_blank"
              rel="noreferrer"
            >
              <Image
                imgPath={responseFile?.url}
                imgClassName="absolute top-0 left-0 !w-full !h-full object-cover object-center rounded-[10px] duration-500 hover:blur-[0px] border border-whiteScreen__BorderColor"
                serverPath={!!responseFile?.url}
              />
            </a>
            <Icon
              className="cursor-pointer shadow-[0px_0px_10px_#dbdbdb] rounded-[5px] absolute top-[6px] right-[32px] z-[2] duration-500 w-[20px] h-[20px] bg-white"
              onClick={() => {
                downloadAttachmentFile({
                  url: responseFile?.url,
                  fileName:
                    responseFile?.doc_details?.original_name || 'smackDab',
                });
              }}
              iconType="timelineDocumentDownloadIcon"
            />
          </>
        );
      default:
        return (
          <>
            <div className="hidden">
              <Image
                imgPath={responseFile?.url}
                serverPath
                imgClassName="absolute top-0 left-0 !w-full !h-full object-cover object-center rounded-[10px] duration-500 hover:blur-[0px] border border-whiteScreen__BorderColor"
              />
            </div>
            <Icon
              iconType="fileIconFilledPrimaryColor"
              className="p-[15px] bg-ipGray__transparentBG absolute top-0 left-0 !w-full !h-full object-cover object-center rounded-[10px] duration-500 hover:blur-[0px] border border-whiteScreen__BorderColor"
            />
          </>
        );
    }
  };

  return <>{renderFile()}</>;
};
