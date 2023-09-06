import Tippy from '@tippyjs/react';
import { format as Format } from 'date-fns-tz';
import { sinceOfDateTime } from 'helper/timeline.helper';
import { useEffect, useState } from 'react';

const DateTimeSince = ({
  date,
  tooltipEnable = true,
}: {
  date: Date | string;
  tooltipEnable?: boolean;
}) => {
  const [message, setMessage] = useState<string | undefined>(
    sinceOfDateTime(date)
  );
  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessage(sinceOfDateTime(date));
    }, 3000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const messageExist = message?.split('|');
  const renderData = (
    <div className="inline-flex flex-wrap mr-[12px]">
      {messageExist && messageExist?.length > 1 && (
        <span className="inline-block relative text-[#808080]/80 text-[14px] font-biotif__Regular mb-[4px] pr-[10px] mr-[10px] before:content-[''] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:w-[1px] before:h-[calc(100%_-_4px)] before:bg-[#CCCCCC] last:mr-0 last:pr-0 last:before:hidden">
          {messageExist[0]}
        </span>
      )}
      <span className="inline-block relative text-[#808080]/80 text-[14px] font-biotif__Regular mb-[4px] pr-[10px] mr-[10px] before:content-[''] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:w-[1px] before:h-[calc(100%_-_4px)] before:bg-[#CCCCCC] last:mr-0 last:pr-0 last:before:hidden">
        {messageExist && messageExist?.length > 1 ? messageExist[1] : message}
      </span>
    </div>
  );
  return tooltipEnable ? (
    <Tippy
      zIndex={5}
      content={Format(new Date(date), "eeee',' MMM dd',' yyyy 'at' hh:mm a")}
    >
      {renderData}
    </Tippy>
  ) : (
    <>{renderData}</>
  );
};

export default DateTimeSince;
