import { useLayoutEffect, useRef, useState } from 'react';
import { InfoWrapperProps } from './types';

const Index = (props: InfoWrapperProps) => {
  const {
    field,
    customLabel = '+ Add',
    isCustomLabelHide = false,
    customClass,
    readMoreEnable,
  } = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [readMore, setReadMore] = useState<boolean>(false);
  const noteRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    if (noteRef.current && readMoreEnable) {
      if (noteRef?.current) {
        noteRef.current.innerHTML = field as string;
      }
      const { offsetHeight } = noteRef.current;
      setReadMore(offsetHeight > 90);
    }
  }, [field]);

  if (
    field !== 'undefined' &&
    ((typeof field === 'string' && field.length) || field)
  ) {
    return (
      <>
        <div
          className={
            readMoreEnable
              ? `note__text__readmore relative overflow-hidden before:content-[''] before:absolute before:left-0 before:right-0 before:bottom-0 before:w-full before:h-[58px] before:bg-gradient-to-b before:from-[#fff6] before:to-[#fff] before:to-[90%] ${
                  !readMore || isOpen ? 'before:hidden' : 'before:block'
                }`
              : ``
          }
          ref={noteRef}
          style={{ maxHeight: isOpen ? '100%' : '108px' }}
        >
          <span> {field}</span>
        </div>
        {readMoreEnable && readMore && (
          <div className="mt-[4px]">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-block text-[14px] font-biotif__Medium text-primaryColor pr-[16px] relative before:content-[''] before:absolute before:top-[4px] before:right-[2px] before:border-l-[2px] before:border-l-primaryColor before:border-b-[2px] before:border-b-primaryColor before:w-[8px] before:h-[8px] ${
                isOpen
                  ? 'before:rotate-[-225deg] before:top-[8px]'
                  : 'before:-rotate-45'
              }`}
            >
              {isOpen ? 'Read Less' : 'Read More'}
            </button>
          </div>
        )}
      </>
    );
  }
  if (!isCustomLabelHide) {
    return (
      <span className={`text-light__TextColor ${customClass || ''}`}>
        {customLabel}
      </span>
    );
  }
  return <></>;
};

export default Index;
