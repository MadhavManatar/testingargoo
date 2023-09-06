// ** Import Packages **
import { useRef } from 'react';

// ** Components **
import Icon from 'components/Icon';

// ** Types **
import { TranscriptStateType } from './types/transcript.types';

interface Props {
  transcriptState: TranscriptStateType;
  updateTranscriptState: (data: Partial<TranscriptStateType>) => void;
  updatePosition: (id: number) => void;
}

const TranscriptSearch = (props: Props) => {
  // ** Refs **
  const searchRef = useRef<HTMLInputElement>(null);

  // ** Props **
  const { transcriptState, updateTranscriptState, updatePosition } = props;
  const { utterances, searchVal, searchIds } = transcriptState;

  // ** Functions **
  const getReverseSearchIds = (searchText: string) => {
    const isExist = utterances
      .flatMap((u: any) => u.words)
      .some((w: any) => w.punctuated_word.toLowerCase().includes(searchText));

    if (!searchText || !isExist) {
      return { uId: -1, wId: -1 };
    }

    const uttCount = utterances.length - 1;
    const uttReverse = utterances.slice().reverse();

    if (searchVal !== searchText) {
      const revUId = uttReverse.findIndex((u: any) => {
        return u.words.some((w: any) =>
          w.punctuated_word.toLowerCase().includes(searchText)
        );
      });

      const uId = uttCount - revUId;

      const wordReverse = utterances[uId].words.slice().reverse();
      const wordCount = wordReverse.length - 1;
      const revWId = wordReverse.findIndex((w: any) =>
        w.punctuated_word.toLowerCase().includes(searchText)
      );
      const wId = wordCount - revWId;
      return { uId, wId };
    }

    const revUId = uttReverse.findIndex((u: any, idx: number) => {
      if (uttCount - idx === searchIds.uId) {
        return u.words.some((w: any, idx1: number) => {
          return (
            idx1 < searchIds.wId &&
            w.punctuated_word.toLowerCase().includes(searchText)
          );
        });
      }
      if (uttCount - idx < searchIds.uId) {
        return u.words.some((w: any) => {
          return w.punctuated_word.toLowerCase().includes(searchText);
        });
      }

      return false;
    });

    const isLast = !(revUId > -1) && isExist;

    if (isLast) {
      const revUIdInner = uttReverse.findIndex((u: any) => {
        return u.words.some((w: any) =>
          w.punctuated_word.toLowerCase().includes(searchText)
        );
      });

      const uIdInner = uttCount - revUIdInner;

      if (uIdInner > -1) {
        const wordReverse = utterances[uIdInner].words.slice().reverse();
        const wordCount = wordReverse.length - 1;

        const revWId = wordReverse.findIndex((w: any) =>
          w.punctuated_word.toLowerCase().includes(searchText)
        );
        const wId = wordCount - revWId;

        return { uId: uIdInner, wId };
      }
    }

    const uId = uttCount - revUId;
    const wordReverse = utterances[uId].words.slice().reverse();
    const wordCount = wordReverse.length - 1;

    const revWId = wordReverse.findIndex((w: any, idx: number) => {
      if (uId === searchIds.uId) {
        return (
          wordCount - idx < searchIds.wId &&
          w.punctuated_word.toLowerCase().includes(searchText)
        );
      }
      return w.punctuated_word.toLowerCase().includes(searchText);
    });

    const wId = wordCount - revWId;
    return { uId, wId };
  };

  const getSearchIds = (searchText: string) => {
    const isExist = utterances
      .flatMap((u: any) => u.words)
      .find((w: any) => w.punctuated_word.toLowerCase().includes(searchText));

    if (!searchText || !isExist) {
      return { uId: -1, wId: -1 };
    }

    if (searchVal !== searchText) {
      const uId = utterances.findIndex((u: any) => {
        return u.words.some((w: any) =>
          w.punctuated_word.toLowerCase().includes(searchText)
        );
      });

      const wId = utterances[uId].words.findIndex((w: any) =>
        w.punctuated_word.toLowerCase().includes(searchText)
      );
      return { uId, wId };
    }

    const uId = utterances.findIndex((u: any, idx: number) => {
      if (idx === searchIds.uId) {
        return u.words.some((w: any, idx1: number) => {
          return (
            idx1 > searchIds.wId &&
            w.punctuated_word.toLowerCase().includes(searchText)
          );
        });
      }
      if (idx > searchIds.uId) {
        return u.words.some((w: any) => {
          return w.punctuated_word.toLowerCase().includes(searchText);
        });
      }

      return false;
    });

    const isLast = !(uId > -1) && isExist;

    if (isLast) {
      const uIdInner = utterances.findIndex((u: any) => {
        return u.words.some((w: any) =>
          w.punctuated_word.toLowerCase().includes(searchText)
        );
      });

      const wId = utterances[uIdInner].words.findIndex((w: any) =>
        w.punctuated_word.toLowerCase().includes(searchText)
      );

      return { uId: uIdInner, wId };
    }

    const wId = utterances[uId].words.findIndex((w: any, idx: number) => {
      if (uId === searchIds.uId) {
        return (
          idx > searchIds.wId &&
          w.punctuated_word.toLowerCase().includes(searchText)
        );
      }
      return w.punctuated_word.toLowerCase().includes(searchText);
    });

    return { uId, wId };
  };

  const handleSearchTranscript = (isPrevious = false) => {
    let searchText = searchRef.current?.value || '';
    searchText = searchText.trim().toLowerCase();

    if (searchText) {
      const newSearchIds = isPrevious
        ? getReverseSearchIds(searchText)
        : getSearchIds(searchText);

      updateTranscriptState({
        searchVal: searchText,
        searchIds: newSearchIds,
      });

      return updatePosition(newSearchIds.uId);
    }
  };

  return (
    <div className="search__header__wrapper py-[15px] px-[15px] flex items-center">
      <div className="ip__form__hasIcon w-full">
        <input
          ref={searchRef}
          className="ip__input"
          placeholder="Search in transcript"
          type="text"
          onChange={(e) => {
            if (!e.target.value) {
              updateTranscriptState({
                searchVal: '',
                searchIds: { uId: -1, wId: -1 },
              });
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const isSearchPrevious = e.shiftKey;
              handleSearchTranscript(isSearchPrevious);
            }
          }}
        />
        <Icon iconType="searchStrokeIcon" className="grayscale !top-[5px]" />
      </div>
      <div className="inline-flex flex-wrap items-center shrink-0 ml-[15px]">
        <div
          className="w-[35px] h-[35px] rounded-full relative before:content-[''] before:absolute before:top-[12px] before:left-[14px] before:w-[10px] before:h-[10px] before:rotate-45 before:border-l-[2px] before:border-b-[2px] before:border-l-[#737373] before:border-b-[#737373] duration-500 cursor-pointer hover:bg-[#f0f0f0]"
          onClick={() => handleSearchTranscript(true)}
        />
        <div
          className="w-[35px] h-[35px] rounded-full relative before:content-[''] before:absolute before:top-[12px] before:left-[11px] before:w-[10px] before:h-[10px] before:rotate-[-135deg] before:border-l-[2px] before:border-b-[2px] before:border-l-[#737373] before:border-b-[#737373] duration-500 cursor-pointer hover:bg-[#f0f0f0]"
          onClick={() => handleSearchTranscript()}
        />
      </div>
    </div>
  );
};

export default TranscriptSearch;
