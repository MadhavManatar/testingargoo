import { useLocation } from 'react-router-dom';
import { PrimaryFieldType, TagTimeline } from './components/TimelineListTypes';
import NoteTimeline from './NoteTimeLine';
import {
  NoteTimeline as NoteTimelineType,
  TimelineMessageType,
  TimelineMessageValueType,
  TimelineOpenActivityModalType,
  TimelineType,
} from './types';
import TimelineEmail from './components/TimelineEmail';
import DocumentTimeline from './DocumentTimeline';
import Creator from './components/Creator';
import ActivityModuleWiseTimelineDisplay from './ActivityModuleWiseTimelineDisplay';
import DisplayRichTextContent from 'components/RichTextEditor/DisplayRichTextContent';
import { convertAtoB, usCurrencyFormat } from 'utils/util';

type Props = {
  timelineData: TimelineType;
  setHistoryData: React.Dispatch<React.SetStateAction<TimelineType[]>>;
  setOpenActivityModal?:
    | React.Dispatch<React.SetStateAction<TimelineOpenActivityModalType>>
    | undefined;
};

const DefaultTimeline = ({
  timelineData,
  setHistoryData,
  setOpenActivityModal,
}: Props) => {
  const location = useLocation();

  const { creator, message, documents } = timelineData;
  const path = location.pathname;
  const isDocument = documents && !(documents?.length > 0);
  return (
    <>
      <div
        className={
          isDocument
            ? 'flex flex-wrap mb-[10px] last:mb-[0px]'
            : 'timeline__box__new flex flex-wrap items-start'
        }
      >
        {isDocument &&
          path !== '/streams' &&
          path !== '/' &&
          message?.fieldName !== '---ScHeDuLed---AcTiViTy---TiMeLiNe---' &&
          message?.fieldName !== '---Zoom-Phone-Call---' && (
            <Creator {...creator} />
          )}
        <TimelineUpdatedValue
          timelineData={timelineData}
          messageData={message}
          setHistoryData={setHistoryData}
          setOpenActivityModal={setOpenActivityModal}
        />
      </div>
    </>
  );
};

const TimelineUpdatedValue = ({
  timelineData,
  messageData,
  setHistoryData,
  setOpenActivityModal,
}: {
  timelineData: TimelineType;
  messageData: TimelineMessageValueType;
  setHistoryData: React.Dispatch<React.SetStateAction<TimelineType[]>>;
  setOpenActivityModal?:
    | React.Dispatch<React.SetStateAction<TimelineOpenActivityModalType>>
    | undefined;
}) => {
  const { note, documents, activities } = timelineData;

  const newValue =
    (messageData?.newValue?.value === 'Blank'
      ? 'Blank Value'
      : messageData?.newValue?.value) ?? 'Blank Value';
  const oldValue =
    (messageData?.oldValue?.value === 'Blank'
      ? ''
      : messageData?.oldValue?.value) ?? '';

  switch (modelFieldNameType(timelineData)) {
    case 'Email':
      return <TimelineEmail timelineData={timelineData} />;
    case 'Emails':
      return (
        <PrimaryFieldType messageData={messageData as TimelineMessageType} />
      );
    case 'Phone':
      return (
        <PrimaryFieldType messageData={messageData as TimelineMessageType} />
      );
    case 'Phones':
      return (
        <PrimaryFieldType messageData={messageData as TimelineMessageType} />
      );
    case 'Guests':
      return (
        <PrimaryFieldType
          messageData={messageData as TimelineMessageType}
          isDisablePrimary
        />
      );
    case 'Related Contacts':
      return (
        <PrimaryFieldType messageData={messageData as TimelineMessageType} />
      );
    case 'Related Accounts':
      return (
        <PrimaryFieldType messageData={messageData as TimelineMessageType} />
      );
    case 'Collaborators':
      return (
        <PrimaryFieldType
          messageData={messageData as TimelineMessageType}
          isDisablePrimary
        />
      );
    case 'Description':
      return (
        <div className="timeline__contant__wrapper w-[calc(100%_-_41px)] pl-[18px] pt-[9px] sm:w-[calc(100%_-_29px)] sm:pt-[7px] sm:pl-[10px]">
          <div className="flex flex-wrap items-center">
            {oldValue !== 'Blank Value' && (
              <>
                <div className="text-[16px] font-biotif__Regular text-black max-w-[418px]">
                  {oldValue}
                </div>
                {oldValue.length ? (
                  <span className="timeline__arrow inline-block mx-[15px] h-[2px] w-[20px] bg-black/50 relative before:content-[''] before:w-[8px] before:h-[8px] before:absolute before:top-[50%] before:right-0 before:translate-y-[-50%] before:border-r-[2px] before:border-r-black/50 before:border-b-[2px] before:border-b-black/50 before:-rotate-45" />
                ) : null}
              </>
            )}
            <div className="text-[16px] font-biotif__Regular text-black max-w-[418px]">
              {newValue}
            </div>
          </div>
        </div>
      );
    case 'Memo':
      return (
        <div className="timeline__contant__wrapper w-[calc(100%_-_41px)] pl-[18px] pt-[9px] sm:w-[calc(100%_-_29px)] sm:pt-[7px] sm:pl-[10px]">
          <div className="flex flex-wrap items-center">
            {oldValue !== 'Blank Value' && (
              <>
                <div className="text-[16px] font-biotif__Regular text-black max-w-[418px]">
                  {oldValue && (
                    <DisplayRichTextContent
                      information={convertAtoB(oldValue)}
                    />
                  )}
                </div>
                {oldValue.length ? (
                  <span className="timeline__arrow inline-block mx-[15px] h-[2px] w-[20px] bg-black/50 relative before:content-[''] before:w-[8px] before:h-[8px] before:absolute before:top-[50%] before:right-0 before:translate-y-[-50%] before:border-r-[2px] before:border-r-black/50 before:border-b-[2px] before:border-b-black/50 before:-rotate-45" />
                ) : null}
              </>
            )}
            <div className="text-[16px] font-biotif__Regular text-black max-w-[418px]">
              {newValue && newValue !== 'Blank Value' ? (
                <DisplayRichTextContent information={convertAtoB(newValue)} />
              ) : (
                newValue
              )}
            </div>
          </div>
        </div>
      );
    case 'Created':
      return (
        <div className="timeline__contant__wrapper w-[calc(100%_-_41px)] pl-[18px] pt-[9px] sm:w-[calc(100%_-_29px)] sm:pt-[7px] sm:pl-[10px]">
          <div className="text-[16px] font-biotif__Regular tracking-[0.5px]">
            {newValue}
          </div>
        </div>
      );
    case 'activities':
      return (
        <>
          {activities ? (
            <ActivityModuleWiseTimelineDisplay
              setOpenActivityModal={setOpenActivityModal}
              activities={activities}
              timeline_model_name={timelineData?.model_name}
              message={timelineData.message}
              historyId={timelineData.id}
            />
          ) : (
            <></>
          )}
        </>
      );
    case 'notes':
      return (
        <NoteTimeline
          note={note as NoteTimelineType}
          timelineData={timelineData}
        />
      );
    case 'documents':
      return (
        <DocumentTimeline
          documents={documents}
          setHistoryData={setHistoryData}
          key={window.crypto.randomUUID()}
        />
      );
    case 'Tag':
      return <TagTimeline data={messageData} />;
    case 'Deal Value':
      return (
        <div className="timeline__contant__wrapper w-[calc(100%_-_41px)] pl-[18px] pt-[9px] sm:w-[calc(100%_-_29px)] sm:pt-[7px] sm:pl-[10px]">
          <div className="flex flex-wrap items-center">
            <div className="text-[16px] font-biotif__Regular text-black tracking-[0.5px]">
              {oldValue.length ? (
                <div className="text-[16px] font-biotif__Regular text-black tracking-[0.5px] text-ip__SuccessGreen">
                  {usCurrencyFormat(oldValue)}
                </div>
              ) : (
                oldValue
              )}
            </div>
            {oldValue.length ? (
              <span className="timeline__arrow inline-block mx-[15px] h-[2px] w-[20px] bg-black/50 relative before:content-[''] before:w-[8px] before:h-[8px] before:absolute before:top-[50%] before:right-0 before:translate-y-[-50%] before:border-r-[2px] before:border-r-black/50 before:border-b-[2px] before:border-b-black/50 before:-rotate-45" />
            ) : null}
            <div className="text-[16px] font-biotif__Regular text-black tracking-[0.5px]">
              {newValue !== 'Blank Value' ? (
                <pre className="ipInfo__View__Value whitespace-normal !text-[#24BD64]">
                  <div className="inline-edit-off">
                    {usCurrencyFormat(newValue)}
                  </div>
                </pre>
              ) : (
                newValue
              )}
            </div>
          </div>
        </div>
      );
    case 'Contact Image':
    case 'Account Image':
      return (
        <div className="timeline__contant__wrapper w-[calc(100%_-_41px)] pl-[18px] pt-[9px] sm:w-[calc(100%_-_29px)] sm:pt-[7px] sm:pl-[10px]">
          <div className="flex flex-wrap items-center">
            <div className="text-[16px] font-biotif__Regular text-black tracking-[0.5px]">
              Profile picture{' '}
              {newValue !== 'Blank Value' ? 'updated' : 'removed'}
            </div>
          </div>
        </div>
      );
    case 'Annual Revenue':
      return (
        <div className="timeline__contant__wrapper w-[calc(100%_-_41px)] pl-[18px] pt-[9px] sm:w-[calc(100%_-_29px)] sm:pt-[7px] sm:pl-[10px]">
          <div className="flex flex-wrap items-center">
            <div className="text-[16px] font-biotif__Regular text-black tracking-[0.5px]">
              {oldValue.length ? (
                <div className="text-[16px] font-biotif__Regular text-black tracking-[0.5px] text-ip__SuccessGreen">
                  {usCurrencyFormat(oldValue)}
                </div>
              ) : (
                oldValue
              )}
            </div>
            {oldValue.length ? (
              <span className="timeline__arrow inline-block mx-[15px] h-[2px] w-[20px] bg-black/50 relative before:content-[''] before:w-[8px] before:h-[8px] before:absolute before:top-[50%] before:right-0 before:translate-y-[-50%] before:border-r-[2px] before:border-r-black/50 before:border-b-[2px] before:border-b-black/50 before:-rotate-45" />
            ) : null}
            <div className="text-[16px] font-biotif__Regular text-black tracking-[0.5px]">
              {newValue !== 'Blank Value' ? (
                <pre className="ipInfo__View__Value whitespace-normal !text-[#24BD64]">
                  <div className="inline-edit-off">
                    {usCurrencyFormat(newValue)}
                  </div>
                </pre>
              ) : (
                newValue
              )}
            </div>
          </div>
        </div>
      );
    default:
      return (
        <div className="timeline__contant__wrapper w-[calc(100%_-_41px)] pl-[18px] pt-[9px] sm:w-[calc(100%_-_29px)] sm:pt-[7px] sm:pl-[10px]">
          <div className="flex flex-wrap items-center">
            <div className="text-[16px] font-biotif__Regular text-black tracking-[0.5px]">
              {oldValue}
            </div>
            {oldValue.length ? (
              <span className="timeline__arrow inline-block mx-[15px] h-[2px] w-[20px] bg-black/50 relative before:content-[''] before:w-[8px] before:h-[8px] before:absolute before:top-[50%] before:right-0 before:translate-y-[-50%] before:border-r-[2px] before:border-r-black/50 before:border-b-[2px] before:border-b-black/50 before:-rotate-45" />
            ) : null}
            <div className="text-[16px] font-biotif__Regular text-black tracking-[0.5px]">
              {newValue}
            </div>
          </div>
        </div>
      );
  }
};
const modelFieldNameType = (timeline: TimelineType) => {
  if (timeline?.message?.newValue?.model_name === 'emails') {
    return 'Email';
  }
  if (
    timeline?.relation_model_name &&
    timeline?.relation_model_name !== 'tags'
  ) {
    return timeline?.relation_model_name;
  }
  if (
    timeline?.model_name !== 'activities' &&
    timeline?.message?.newValue?.model_name === 'activities'
  ) {
    return 'activities';
  }
  if (timeline?.message?.fieldName?.search('Created') !== -1) {
    return 'Created';
  }
  return timeline?.message?.fieldName;
};

export default DefaultTimeline;
