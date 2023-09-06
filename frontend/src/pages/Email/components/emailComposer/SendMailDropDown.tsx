import Dropdown from 'components/Dropdown';

import { Option } from 'components/FormField/types/formField.types';
import { bulkMailChildModalType } from 'pages/Contact/types/contacts.types';
import { ReplyFormType } from 'pages/Email/types/email.type';

type Props = {
  setOpenModal: React.Dispatch<React.SetStateAction<bulkMailChildModalType>>;
  htmlContent: string | undefined;
  recipient: Option[] | undefined;
  isDisabled?: boolean;
  editEmail?: {
    emailId: number;
    conversionId: number;
    showReplyForm?: ReplyFormType;
  };
};

export const SendMailDropDown = (props: Props) => {
  const { htmlContent, recipient, setOpenModal, isDisabled, editEmail } = props;

  const renderDropDownContent = (closeDropdown: () => void) => {
    return (
      <div onClick={closeDropdown}>
        <div
          className="min-w-[148px] cursor-pointer text-[14px] font-biotif__SemiBold !text-primaryColor bg-ipWhite__bgColor rounded-[6px] shadow-[0px_0px_2px_#00000040] py-[12px] px-[15px] mb-[6px] hover:bg-primaryColor hover:!text-[#ffffff]"
          onClick={() =>
            setOpenModal((prev) => ({ ...prev, scheduleModal: true }))
          }
        >
          {editEmail?.emailId && !editEmail?.showReplyForm ? 'Edit Schedule Send' : 'Schedule Send'}
        </div>
        <div className="min-w-[148px] cursor-pointer text-[14px] font-biotif__SemiBold !text-primaryColor bg-ipWhite__bgColor rounded-[6px] shadow-[0px_0px_2px_#00000040] py-[12px] px-[15px] mb-[6px] hover:bg-primaryColor hover:!text-[#ffffff] hidden">
          Save as Draft
        </div>
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
        disabled={
          isDisabled ||
          !(
            htmlContent &&
            recipient &&
            !(htmlContent?.length <= 0 && recipient?.length <= 0)
          )
        }
        className="i__Button primary__Btn relative w-[42px] h-[42px] p-0 sm:w-[36px] sm:h-[36px]"
      >
        <span className="absolute top-[calc(50%_-_2px)] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[9px] h-[9px] border-l-[2px] border-l-[#ffffff] border-b-[2px] border-b-[#ffffff] rotate-[-45deg]" />
      </button>
    </Dropdown>
  );
};

export default SendMailDropDown;
