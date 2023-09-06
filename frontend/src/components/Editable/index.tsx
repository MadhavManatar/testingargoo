import React, { Dispatch, useEffect, useRef } from 'react';
import Button from 'components/Button';

interface EditableProps {
  children: React.ReactNode;
  editComponent: React.ReactNode;
  onCancel?: () => void;
  onSave?: () => void;
  isLoading?: boolean;
  isError?: boolean;
  setIsEditing: Dispatch<React.SetStateAction<boolean>>;
  isEditing: boolean;
  disabled: boolean;
  isSaveButtonDisable?: boolean;
  buttonRef?: React.RefObject<HTMLButtonElement>;
  divRefForInputField?: React.MutableRefObject<any>;
}

const Editable = (props: EditableProps) => {
  const {
    children,
    editComponent,
    onCancel,
    onSave,
    isLoading,
    setIsEditing,
    isEditing,
    disabled,
    isError,
    isSaveButtonDisable,
    buttonRef,
    divRefForInputField,
  } = props;

  const inlineEditActionRef = useRef<Element | null>();

  useEffect(() => {
    if (inlineEditActionRef.current && !isLoading && !isError) {
      const infoViewElements = document.getElementsByClassName(
        'ipInfo__View__Value'
      );

      for (let i = 0; i < infoViewElements.length; i++) {
        infoViewElements?.[i]?.classList?.remove?.('inline__edit__on__wrapper');
      }

      inlineEditActionRef.current?.classList.remove(
        'inline__edit__on__wrapper'
      );
    }
  }, [isLoading]);

  const cancel = () => {
    setIsEditing(false);
    if (onCancel) onCancel();
  };

  const save = () => {
    setIsEditing(false);
    if (onSave) onSave();
  };

  return isEditing && !disabled ? (
    <div
      className="inlineEdit__On relative"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      ref={divRefForInputField}
    >
      {editComponent}
      <div className="inlineEdit__action static flex items-center justify-end w-full pt-[7px]">
        <button
          className='cancelBtn w-[30px] h-[30px] rounded-[6px] bg-parentBgWhite__grayBtnBG text-[0px] relative shadow-[1px_1px_2px_#a4a4a4] duration-500 before:content-[""] before:absolute before:top-[50%] before:left-[50%] before:translate-x-[-50%] before:translate-y-[-50%] before:rotate-45 before:w-[14px] before:h-[2px] before:bg-ipBlack__bgColor before:duration-500 after:content-[""] after:absolute after:top-[50%] after:left-[50%] after:translate-x-[-50%] after:translate-y-[-50%] after:-rotate-45 after:w-[14px] after:h-[2px] after:bg-ipBlack__bgColor after:duration-500 hover:bg-ipBlack__bgColor hover:before:bg-ipWhite__bgColor hover:after:bg-ipWhite__bgColor'
          onClick={(e) => {
            (e.target as HTMLElement)
              ?.closest('.ipInfo__View__Value')
              ?.classList.remove('inline__edit__on__wrapper');
            cancel();
          }}
        >
          Cancel
        </button>
        <Button
          className={`submitBtn flex items-center justify-center ml-[5px] w-[30px] h-[30px] !p-0 rounded-[6px] bg-primaryColor text-[0px] relative shadow-[1px_1px_2px_#a4a4a4] before:content-[""] before:absolute before:top-[9px] before:left-[9px] before:w-[13px] before:h-[8px] duration-500 before:border-l-[2px] before:border-l-white before:border-b-[2px] before:border-b-white before:-rotate-45 hover:bg-primaryColor__hoverDark ${
            isLoading ? 'loaderActive' : ''
          }`}
          isLoading={isLoading}
          onClick={(e) => {
            inlineEditActionRef.current = (e.target as HTMLElement)?.closest(
              '.ipInfo__View__Value'
            );
            save();
          }}
          buttonRef={buttonRef}
          isDisabled={isSaveButtonDisable}
        >
          Save
        </Button>
      </div>
    </div>
  ) : (
    <div
      onClick={(e) => {
        if (!isLoading) {
          const infoViewElements = document.getElementsByClassName(
            'ipInfo__View__Value'
          );

          for (let i = 0; i < infoViewElements.length; i++) {
            infoViewElements?.[i]?.classList?.remove?.(
              'inline__edit__on__wrapper'
            );
          }
          const parent = (e.currentTarget as HTMLElement).parentElement;
          if (parent) {
            parent.classList.add('inline__edit__on__wrapper');
          }
          setIsEditing(true);
        }
      }}
      className="inline-edit-off"
    >
      {children}
    </div>
  );
};

export default Editable;
