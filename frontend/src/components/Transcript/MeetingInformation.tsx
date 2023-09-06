import { useState } from 'react';
import { TranscriptStateType } from 'components/Transcript/types/transcript.types';
import TranscriptComponent from 'components/Transcript/TranscriptComponent';
import SummaryComponent from 'components/Transcript/SummaryComponent';

interface Props {
  currentTime: number;
  transcript: Record<string, any> | null;
  summary: string | null;
  updateCurrentTime: (time: number) => void;
  transcriptState: TranscriptStateType;
  updateTranscriptState: (data: Partial<TranscriptStateType>) => void;
}

const MEETING_TABS = {
  TRANSCRIPT: 'transcript',
  SUMMARY: 'summary',
};

const MeetingInformation = (props: Props) => {
  // ** Props **
  const { summary } = props;

  // ** State **
  const [currentTab, setCurrentTab] = useState(MEETING_TABS.TRANSCRIPT);

  return (
    <div className="video-des-sec w-[40%]">
      <div className="inner__wrapper bg-[#ffffff] rounded-[10px] relative">
        <div className="header__title text-[16px] font-biotif__Medium text-[#2E3234] border-b-[1px] border-b-[#E5E5E5] overflow-x-auto">
          <span
            className={`inline-block py-[10px] px-[20px] relative duration-300 cursor-pointer hover:bg-btnGrayColor ${currentTab === MEETING_TABS.TRANSCRIPT
                ? 'before:content-[""] before:absolute before:bottom-0 before:left-0 before:w-full before:h-[2px] before:bg-primaryColorSD'
                : ''
              }`}
            onClick={() => setCurrentTab(MEETING_TABS.TRANSCRIPT)}
          >
            Transcript
          </span>
          {summary && (
            <span
              className={`inline-block py-[10px] px-[20px] relative duration-300 cursor-pointer hover:bg-btnGrayColor ${currentTab === MEETING_TABS.SUMMARY
                  ? 'before:content-[""] before:absolute before:bottom-0 before:left-0 before:w-full before:h-[2px] before:bg-primaryColorSD'
                  : ''
                }`}
              onClick={() => setCurrentTab(MEETING_TABS.SUMMARY)}
            >
              Summary
            </span>
          )}

        </div>

        {currentTab === MEETING_TABS.TRANSCRIPT && (
          <div>
            <TranscriptComponent {...props} />
          </div>
        )}

        {currentTab === MEETING_TABS.SUMMARY && (
          <div>
            <SummaryComponent summary={summary} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingInformation;
