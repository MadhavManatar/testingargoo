// ** Import Packages **
import { FieldErrors } from 'react-hook-form';

// ** Components **
import Button from 'components/Button';
import Image from 'components/Image';
import { useEffect, useRef } from 'react';
import { ActivityTypeFieldType } from '../types/activity-type.types';
import { focusOnError } from 'helper';

interface ActivityTypeIconProps {
  setFileObjectCb: (fileObj: File | string) => void;
  image?: string | File;
  onFileChange?: React.ChangeEventHandler<HTMLInputElement>;
  errors?: FieldErrors<ActivityTypeFieldType>;
  iconImageName: string;
  setIconImageName: React.Dispatch<React.SetStateAction<string>>;
  disabled: boolean | undefined;
}

const ActivityTypeIcon = (props: ActivityTypeIconProps) => {
  const {
    setFileObjectCb: setImage,
    image,
    onFileChange,
    errors,
    iconImageName,
    setIconImageName,
    disabled,
  } = props;
  const errorDivRef = useRef<Record<string, HTMLDivElement | null>>({});
  useEffect(() => {
    focusOnError(errorDivRef, errors);
  }, [errors]);

  return (
    <>
      {image && (
        <div className="px-[10px] mb-[15px] w-[100px] flex flex-col items-center">
          <div
            onClick={() => {
              setImage('');
              setIconImageName('');
            }}
            className={`icon__libraryBox inline-block active relative cursor-pointer before:content-[''] before:absolute before:left-[50%] before:top-[50%] before:translate-x-[-50%] before:translate-y-[-50%] before:w-[calc(100%_+_6px)] before:h-[calc(100%_+_6px)] before:border before:border-ipBlack__borderColor before:rounded-[8px] before:opacity-0 before:duration-500 hover:before:opacity-100`}
          >
            <Image imgPath={image} serverPath />
            <span className='close__btn hidden absolute top-[-8px] right-[-8px] w-[16px] h-[16px] rounded-full bg-white border-[1px] border-black before:content-[""] before:absolute before:top-[50%] before:left-[50%] before:translate-x-[-50%] before:translate-y-[-50%] before:w-[9px] before:h-[1px] before:bg-black before:rotate-45 after:content-[""] after:absolute after:top-[50%] after:left-[50%] after:translate-x-[-50%] after:translate-y-[-50%] after:w-[9px] after:h-[1px] after:bg-black after:-rotate-45' />
          </div>
          <p className="whitespace-pre text-[12px] mt-[5px] overflow-hidden text-ellipsis text-light__TextColor font-biotif__Regular w-full text-center">
            {iconImageName}
          </p>
        </div>
      )}
      <div
        aria-disabled={disabled}
        className="flex justify-center sm:mb-[12px]"
      >
        <div className="inline-block relative upload__icon__btn">
          <input
            className="absolute top-0 left-0 w-full h-full z-[2] opacity-0 cursor-pointer"
            type="file"
            accept="image/png, image/jpeg"
            onChange={onFileChange}
            disabled={disabled}
          />
          <Button isDisabled={disabled} className="primary__Btn">
            Upload Icon
          </Button>
        </div>
      </div>
      <div ref={(element) => (errorDivRef.current.icon = element)}>
        {errors?.icon && <p className="ip__Error">{errors?.icon.message}</p>}
      </div>
    </>
  );
};

export default ActivityTypeIcon;
