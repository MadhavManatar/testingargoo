import { useEffect, useRef, useState } from "react";

interface Props {
  data: string,
  showMoreSummary: ()=> void
}
const ActivityTimelineSummary = ({ data,showMoreSummary }: Props) => {
  const [isOpen] = useState<boolean>(false);
  const [readMore, setReadMore] = useState<boolean>(false);

  const noteRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (noteRef?.current) {
      noteRef.current.innerHTML = data;
      const { offsetHeight } = noteRef.current;
      setReadMore(offsetHeight > 90);
    }
  }, [data]);

  return (
    <>
      <div
        className={`text-[16px] font-biotif__Regular text-sdNormal__textColor relative ip__FancyScroll before:content-[''] before:absolute before:left-0 before:right-0 before:bottom-0 before:w-full before:h-[58px] before:bg-gradient-to-b before:from-[#fff6] before:to-[#fff] before:to-[90%] ${!readMore || isOpen ? 'before:hidden overflow-auto' : 'before:block overflow-hidden'
          }`}
        style={{ maxHeight: isOpen ? '144px' : '108px' }}
      >
        <div
          ref={noteRef}
          className="text-[16px] font-biotif__Regular text-black leading-[27px]"
        />

      </div>
      {(readMore) && (
        <div className="mt-[4px] readMore__btn__wrapper">
          <button
            onClick={() => showMoreSummary()}
            className={`inline-block text-[14px] font-biotif__Medium text-primaryColorSD pr-[16px] relative before:content-[''] before:absolute before:top-[4px] before:right-[2px] before:border-l-[1px] before:border-l-primaryColorSD before:border-b-[1px] before:border-b-primaryColorSD before:w-[8px] before:h-[8px] ${isOpen
                ? 'before:rotate-[-225deg] before:top-[8px]'
                : 'before:-rotate-45'
              }`}
          >
            Read More
          </button>
        </div>
      )}
    </>
  )
}

export default ActivityTimelineSummary;