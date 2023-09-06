import Dropdown from 'components/Dropdown';

interface Props {
  saveButtonText?: string;
  saveButtonDisabled?: boolean;
  saveButtonClick?: () => void;
  sendMailButtonClick?: () => void;
  isVisible?: boolean | undefined | number | string;
}
export const SaveAndCloseBtn = (props: Props) => {
  const { saveButtonText, saveButtonClick, sendMailButtonClick, saveButtonDisabled = true, isVisible } = props;

  const renderDropDownContent = (closeDropdown: () => void) => {
    return (
      <div onClick={closeDropdown}>
        <div
          className="min-w-[148px] cursor-pointer text-[14px] font-biotif__SemiBold !text-primaryColor bg-ipWhite__bgColor rounded-[6px] shadow-[0px_0px_2px_#00000040] py-[12px] px-[15px] mb-[6px] hover:bg-primaryColor hover:!text-[#ffffff]"
          onClick={saveButtonClick}
        >
          {saveButtonText}
        </div>
        {isVisible ? (
          <div className="min-w-[148px] cursor-pointer text-[14px] font-biotif__SemiBold !text-primaryColor bg-ipWhite__bgColor rounded-[6px] shadow-[0px_0px_2px_#00000040] py-[12px] px-[15px] mb-[6px] hover:bg-primaryColor hover:!text-[#ffffff] "
            onClick={sendMailButtonClick}
          >
            Save and send mail
          </div>
        ) : (<></>)
        }

      </div>
    );
  };
  return (
    <Dropdown
      className="compose__mail__submit"
      placement="top-end"
      content={({ close: closeDropdown }) =>
        renderDropDownContent(closeDropdown)
      }
      zIndex={10}
    >
      <button
        type="button"
        disabled={saveButtonDisabled}
        className="i__Button primary__Btn relative w-[42px] h-[42px] p-0 sm:w-[36px] sm:h-[36px]"
      >
        <span className="absolute top-[calc(50%_-_2px)] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[9px] h-[9px] border-l-[2px] border-l-[#ffffff] border-b-[2px] border-b-[#ffffff] rotate-[-45deg]" />
      </button>
    </Dropdown>
  );
};
