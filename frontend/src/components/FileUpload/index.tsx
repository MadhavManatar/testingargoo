// =================== import packages ==================
import { MutableRefObject, useRef } from 'react';
import { FieldError } from 'react-hook-form';
// ======================================================
import Image from 'components/Image';
import Icon from 'components/Icon';

interface FileUploadProps {
  setFileObjectCb: (fileObj: File | string) => void;
  image?: string | File;
  onFileChange?: React.ChangeEventHandler<HTMLInputElement>;
  fileUploadText: string;
  error: FieldError | undefined;
}

function FileUpload({
  setFileObjectCb: setImage,
  image,
  onFileChange,
  fileUploadText,
  error,
}: FileUploadProps) {
  // ================= hooks ====================
  const imageRef = useRef<HTMLInputElement | null>(null);
  return (
    <>
      <div className="flex flex-wrap items-center mb-[25px]">
        <div className="inline-block relative">
          {image && (
            <button
              onClick={() => {
                setImage('');
              }}
              className="delete__Btn"
            >
              <Icon iconType="closeBtnFilled" />
            </button>
          )}
          <div
            className="inline-block profile__img"
            onClick={() => {
              (imageRef as MutableRefObject<HTMLInputElement>).current.click();
            }}
          >
            <Image imgPath={image || ''} serverPath />
          </div>
        </div>
        <div className="w-[calc(100%_-_72px)] pl-[12px] sm:w-[calc(100%_-_72px)]">
          <h6 className="text-[16px] text-primaryColor font-biotif__Medium mb-[5px]">
            <div className="cursor-pointer relative">
              <span
                onClick={() => {
                  (
                    imageRef as MutableRefObject<HTMLInputElement>
                  ).current.click();
                }}
              >
                {fileUploadText}
              </span>
              <input
                ref={imageRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
                onChange={onFileChange}
              />
            </div>
          </h6>
          <p className="text-[12px] text-black__TextColor600 font-biotif__Medium w-[300px] max-w-full">
            (The profile picture must be uploaded in PNG, JPEG &amp; JPG format
            and cant be more than 10 MBs in size)
          </p>
        </div>
      </div>

      {error && <p className="ip__Error">{error.message}</p>}
    </>
  );
}

export default FileUpload;
