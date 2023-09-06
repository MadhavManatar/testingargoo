import { TimelineMessageValueType } from '../types';

interface propsInterface {
  isOpen: boolean;
  emailBodyRef: React.RefObject<HTMLDivElement>;
  emailValue: TimelineMessageValueType;
}

const TimelineEmailDescription = ({
  emailBodyRef,
  isOpen,
  emailValue,
}: propsInterface) => {
  return (
    <div
      style={{ maxHeight: isOpen ? '100%' : '108px' }}
      className="`note__text__readmore mt-[15px] relative max-h-[108px] overflow-y-hidden before:content-[''] before:absolute before:left-0 before:right-0 before:bottom-0 before:w-full before:h-[58px] before:bg-gradient-to-b before:from-[#fff6] before:to-[#fff] before:to-[90%] before:hidden"
    >
      {isOpen ? (
        <div
          className="text-[16px] font-biotif__Regular text-black leading-[27px]"
          ref={emailBodyRef}
        />
      ) : (
        <div className="text-[16px] font-biotif__Regular text-black leading-[27px]">
          {emailValue.short_description}
        </div>
      )}
    </div>
  );
};
export default TimelineEmailDescription;
