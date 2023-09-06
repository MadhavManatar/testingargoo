import Dropdown from 'components/Dropdown';
import { EmailTemplateVisibility } from 'pages/Email/types/emailTemplate.type';

type Props = {
  handleVisibility: (visibility: EmailTemplateVisibility) => void;
  visibility: EmailTemplateVisibility | undefined;
};

export const VisibilityDropDown = (props: Props) => {
  const { handleVisibility, visibility } = props;

  return (
    <Dropdown
      className="!translate-y-[0px]"
      content={({ close: closeDropdown }) => (
        <div
          className="tippy__dropdown__ul !min-w-[135px]"
          onClick={closeDropdown}
        >
          <div
            className="item"
            onClick={() => handleVisibility(EmailTemplateVisibility.PRIVATE)}
          >
            <div className="item__link">
              <span className="item__text">Private</span>
            </div>
          </div>
          <div
            className="item"
            onClick={() => handleVisibility(EmailTemplateVisibility.PUBLIC)}
          >
            <div className="item__link">
              <span className="item__text">Public</span>
            </div>
          </div>
        </div>
      )}
    >
      <button className='w-[134px] bg-primaryColor text-[#ffffff] rounded-[10px] h-[42px] text-[14px] font-biotif__Medium text-left px-[14px] capitalize relative mb-[10px] before:content-[""] before:absolute before:top-[15px] before:right-[12px] before:w-[8px] before:h-[8px] before:border-l-[2px] before:border-l-[#ffffff] before:border-b-[2px] before:border-b-[#ffffff] before:rotate-[-45deg] sm:w-[calc(50%_-_5px)]'>
        {visibility || 'Visibility'}{' '}
      </button>
    </Dropdown>
  );
};

export default VisibilityDropDown;
