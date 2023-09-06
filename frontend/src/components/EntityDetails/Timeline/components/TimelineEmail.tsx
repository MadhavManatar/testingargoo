import { useEffect, useRef, useState } from 'react';
import { TimelineType } from '../types';
import TimelineEmailDescription from './TimelineEmailDescription';
 import axios from 'axios';
import { EmailAttachmentTypeRender } from 'pages/Email/components/EmailAttachmentTypeRender';
import { getPresignedImageUrl } from 'services/wasabi.service';

type TimelineEmailPropsType = {
  timelineData: TimelineType;
};
function TimelineEmail(props: TimelineEmailPropsType) {
  const { timelineData } = props;
  const newValue =
    (timelineData?.message && timelineData.message.newValue) || undefined;
  const emailData = timelineData?.email || undefined;
  const emailBodyRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (emailBodyRef.current && newValue?.emailDescription && isOpen) {
      setHtmlToRef(newValue?.emailDescription);
    }
  }, [newValue, newValue?.emailDescription, isOpen]);

  const setHtmlToRef = async (url: string) => {
    const presignedURL = await getPresignedImageUrl(url);
    const htmlData = await axios(presignedURL);
    if (emailBodyRef.current) {
      emailBodyRef.current.innerHTML = htmlData?.data?.textHtml;
    }
  };

  return (
    <>
      <div className="timeline__contant__wrapper w-[calc(100%_-_41px)] pl-[18px] pt-[9px] sm:w-[calc(100%_-_29px)] sm:pt-[7px] sm:pl-[10px]">
        <div className="timeline__email__wrapper">
          <div className="text-[16px] font-biotif__Medium text-black mb-[4px]">
            <span className="label">From:</span>
            <span className="value">{newValue?.emailFrom}</span>
          </div>
          <div className="text-[16px] font-biotif__Medium text-black mb-[4px]">
            <span className="label">To:</span>
            <span className="value">{newValue?.emailTo}</span>
          </div>
          <div className="text-[16px] font-biotif__Medium text-black mb-[4px]">
            <span className="label">Subject:</span>
            <span className="value">{newValue?.emailSubject}</span>
          </div>
          <TimelineEmailDescription
            isOpen={isOpen}
            emailBodyRef={emailBodyRef}
            emailValue={newValue}
          />
          <div className="attachment__view__wrapper">
            <div
              className="mx-[-10px] flex flex-wrap mt-[15px] w-[752px] overflow-hidden max-w-full">
              {emailData?.email_attachments &&
                emailData?.email_attachments?.map((item, index) => (
                  <div
                    key={`${Number(index)}_note_image`}
                    className="attachment__col w-[150px] px-[10px] mb-[10px] md:w-1/4 sm:w-1/3 xsm:w-1/2"
                  >
                    <div className="w-full pt-[100%] relative overflow-hidden group before:content-[''] before:duration-500 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-[10px] before:bg-black/70 before:z-[2] before:opacity-0 hover:before:opacity-100">
                      <a href={item?.path} target="_blank" rel="noreferrer">
                        <EmailAttachmentTypeRender file={item} />
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-[4px]">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-block text-[14px] font-biotif__Medium text-primaryColor pr-[16px] relative before:content-[''] before:absolute before:top-[4px] before:right-[2px] before:border-l-[2px] before:border-l-primaryColor before:border-b-[2px] before:border-b-primaryColor before:w-[8px] ${
                isOpen
                  ? 'before:h-[8px] before:rotate-[-225deg] before:top-[8px]'
                  : 'before:h-[8px] before:-rotate-45'
              }`}
            >
              {isOpen ? 'Read Less' : 'Read More'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default TimelineEmail;
