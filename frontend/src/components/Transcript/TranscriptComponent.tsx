// ** Import Packages **
import { createRef, useCallback, useEffect, useMemo, useRef } from 'react';

// ** Types **
import { TranscriptStateType } from 'components/Transcript/types/transcript.types';

// ** Helpers **
import {
  isBetween,
  formattedVideoTime,
  getUpdatedUtterances,
} from 'components/Transcript/helper/transcript.helper';

// ** Components **
import TranscriptSearch from 'components/Transcript/TranscriptSearch';

interface Props {
  currentTime: number;
  transcript: Record<string, any> | null;
  updateCurrentTime: (time: number) => void;
  transcriptState: TranscriptStateType;
  updateTranscriptState: (data: Partial<TranscriptStateType>) => void;
}

const TranscriptComponent = (props: Props) => {
  // ** props **
  const { currentTime, updateCurrentTime } = props;
  const { transcriptState, updateTranscriptState } = props;
  const { transcript } = props;
  const { autoScroll, currentPosition, utterances, searchVal, searchIds } =
    transcriptState;

  // ** Refs **
  const scrollableElRef = useRef<HTMLDivElement | null>(null);
  const utteranceRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);
  utteranceRefs.current = utterances.map(
    (_, i) => utteranceRefs.current[i] ?? createRef()
  );

  const activeIndex = useMemo(
    () =>
      utterances.findIndex((u) => {
        return (
          currentTime &&
          (isBetween(currentTime, u.start, u.end) || u.start >= currentTime)
        );
      }),
    [currentTime, utterances]
  );

  useEffect(() => {
    if (transcript) {
      updateTranscriptState({
        utterances: getUpdatedUtterances(transcript.results.utterances),
      });
    }
  }, [updateTranscriptState, transcript]);

  const updateCurrentPosition = useCallback(() => {
    if (activeIndex > -1) {
      const container = scrollableElRef.current;
      const element = utteranceRefs.current[activeIndex].current;

      if (container && element) {
        const EXTRA_PADDING = 20;

        const cTop = container.scrollTop - EXTRA_PADDING;
        const cBottom = cTop + (container.clientHeight - EXTRA_PADDING);

        const eTop = element.offsetTop - EXTRA_PADDING;
        const eBottom = eTop + (element.clientHeight - EXTRA_PADDING);

        const top = eTop >= cTop || (eTop < cTop && eBottom > cTop);
        const bottom =
          eBottom <= cBottom || (eBottom > cBottom && eTop < cBottom);

        const position = !top ? 'TOP' : !bottom ? 'BOTTOM' : 'CENTER';

        updateTranscriptState({ currentPosition: position });
      }
    }
  }, [activeIndex, updateTranscriptState]);

  useEffect(() => {
    if (activeIndex > -1) {
      if (autoScroll) {
        return utteranceRefs.current[activeIndex].current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }

      updateCurrentPosition();
    }
  }, [autoScroll, activeIndex, updateCurrentPosition]);

  const updatePosition = (uId: number) => {
    if (uId > -1) {
      utteranceRefs.current[uId].current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      if (activeIndex > -1) {
        updateTranscriptState({ autoScroll: false });
        updateCurrentPosition();
      }
    }
  };

  const utteranceSearchClass = (uId: number, wId: number, wordInfo: any) => {
    const activeClass =
      searchIds.uId === uId && searchIds.wId === wId ? 'currentItem ' : '';

    const searchClass =
      searchVal && wordInfo.punctuated_word.toLowerCase().includes(searchVal)
        ? 'allSearchWord'
        : isBetween(currentTime, wordInfo.start, wordInfo.end)
        ? 'videoStateCurrentWord'
        : '';

    return activeClass + searchClass;
  };

  return (
    <>
      <div className="body__wrapper">
        <TranscriptSearch
          transcriptState={transcriptState}
          updateTranscriptState={updateTranscriptState}
          updatePosition={updatePosition}
        />
      </div>
      {!autoScroll && (
        <div className="flex justify-center py-[10px] pb-[13px] px-[16px] absolute bottom-0 left-0 w-full">
          <button
            className="scroll-btn text-[16px] font-biotif__Medium py-[8px] px-[14px] bg-[#7467B7] text-white rounded-[7px]"
            onClick={() => updateTranscriptState({ autoScroll: true })}
          >
            {currentPosition === 'CENTER' ? (
              <>Resume Scroll</>
            ) : (
              <>Jump to Current Time {formattedVideoTime(currentTime)}</>
            )}
          </button>
        </div>
      )}
      <div
        ref={scrollableElRef}
        className="inner-wrapper ip__hideScrollbar h-[calc(100vh_-_235px)] overflow-y-auto"
        onScroll={updateCurrentPosition}
        onWheel={() => {
          if (currentTime && autoScroll) {
            updateTranscriptState({
              autoScroll: !autoScroll,
            });
          }
        }}
      >
        {utterances.map((uData, uId) => {
          return (
            <div
              className="vide__des__item flex flex-wrap p-[15px] pb-[0px] first:pt-0 last:pb-[15px]"
              key={uId}
              ref={utteranceRefs.current[uId]}
            >
              <div className="img__wrapper w-[30px] h-[30px]">
                <div className="w-[70px] h-[70px] noName__letter rounded-full flex items-center justify-center">
                  <span
                    className="bg-wrapper absolute top-0 left-0 w-full h-full rounded-full opacity-10"
                    style={{ backgroundColor: '#7467B7' }}
                  />
                  <div
                    className="noName__letter__text text-2xl font-biotif__ExtraBold text-center"
                    style={{ color: '#7467B7' }}
                  >
                    S
                  </div>
                </div>
              </div>
              <div className="right__details w-[calc(100%_-_31px)] pl-[12px] pt-[5px]">
                <h3
                  className="name text-[16px] font-biotif__Regular mb-[8px]"
                  style={{ color: '#7467B7' }}
                >
                  Speaker {uData.speaker}
                </h3>
                <div className="time__details flex flex-wrap">
                  <div className="text-[16px] text-[#737373] font-biotif__Regular w-[83px]">
                    {formattedVideoTime(uData.start)}
                  </div>
                  <div className="contant__text text-[16px] text-[#737373] font-biotif__Regular w-[calc(100%_-_84px)] pl-[14px]">
                    {uData.words.map((wordInfo: any, wordId: number) => (
                      <span
                        key={wordId}
                        className={`inline-block leading-[18px] mr-[5px] 
                            ${utteranceSearchClass(uId, wordId, wordInfo)}`}
                        onClick={() => updateCurrentTime(wordInfo.start)}
                      >
                        {wordInfo.punctuated_word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TranscriptComponent;
