// ** Import Packages **
import { useLayoutEffect, useRef, useState } from 'react';

// ** Components **
import LinkPreview from 'components/LinkPreview';
import FileTypeRenderer from 'components/detail-components/Notes/components/NoteFileTypeRender';
import { NoteResponseFileType } from 'components/detail-components/Notes/types/notes.type';

// ** Types **
import { NoteTimeline as NoteTimelineType, TimelineType } from './types';

// ** Util **
import { convertAtoB } from 'utils/util';

interface Props {
  note: NoteTimelineType;
  timelineData?: TimelineType;
}

const NoteTimeline = ({ note, timelineData }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [url, setUrl] = useState<string>();
  const [readMore, setReadMore] = useState<{
    documents: boolean;
    text: boolean;
  }>({
    documents: false,
    text: false,
  });
  const noteRef = useRef<HTMLParagraphElement>(null);
  const docRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (noteRef.current) {
      const data = convertAtoB(note?.description);
      if (noteRef?.current) {
        const urlValidator = /https?:\/\/[^"\s]+/g;
        const firstUrl = data?.match(urlValidator);
        setUrl(firstUrl?.[0]);

        noteRef.current.innerHTML = data;
      }
      const { offsetHeight } = noteRef.current;
      setReadMore({
        documents: note?.documents.length > 5,
        text: offsetHeight > 90,
      });
    }
  }, [note?.description]);

  if (timelineData?.message?.newValue?.value === 'note_deleted') {
    return (
      <div className="timeline__contant__wrapper w-[calc(100%_-_41px)] pl-[18px] pt-[9px] sm:w-[calc(100%_-_29px)] sm:pt-[7px] sm:pl-[10px]">
        <div className="flex flex-wrap items-center">
          <div className="text-[16px] font-biotif__Regular text-black max-w-[418px]">
            Note has been removed
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="timeline__contant__wrapper w-[calc(100%_-_41px)] pl-[18px] pt-[9px] sm:w-[calc(100%_-_29px)] sm:pt-[7px] sm:pl-[10px]">
      <div
        className={`note__text__readmore relative overflow-hidden before:content-[''] before:absolute before:left-0 before:right-0 before:bottom-0 before:w-full before:h-[58px] before:bg-gradient-to-b before:from-[#fff6] before:to-[#fff] before:to-[90%] ${
          !readMore.text || isOpen ? 'before:hidden' : 'before:block '
        } ${url ? 'linkPreview__Box' : ''}`}
        style={{ maxHeight: isOpen ? '100%' : '108px' }}
      >
        <div
          ref={noteRef}
          className="text-[16px] font-biotif__Regular text-black leading-[27px]"
        />
        {url ? (
          <>
            <a
              className="text-[16px] text-primaryColor font-biotif__Regular underline inline-block"
              href={url}
              target="_blank"
              rel="noreferrer"
            >
              <LinkPreview url={url} />
            </a>
          </>
        ) : null}
      </div>
      {note?.documents &&
        note?.documents?.map((item, index) => (
          <div className="attachment__view__wrapper">
            <div
              className="mx-[-10px] flex flex-wrap mt-[15px] w-[752px] overflow-hidden max-w-full"
              ref={docRef}
              style={{
                maxHeight: !readMore.documents || isOpen ? '100%' : '130px',
              }}
            >
              <div
                key={`${Number(index)}_note_image`}
                className="attachment__col w-[150px] px-[10px] mb-[10px] md:w-1/4 sm:w-1/3 xsm:w-1/2"
              >
                <div className="w-full pt-[100%] relative overflow-hidden group before:content-[''] before:duration-500 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-[10px] before:bg-black/70 before:z-[2] before:opacity-0 hover:before:opacity-100">
                  <a href={item?.url} target="_blank" rel="noreferrer">
                    <FileTypeRenderer
                      file={item as unknown as NoteResponseFileType}
                      mimeType={item.doc_details.mimeType}
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      {(readMore.text || readMore.documents) && (
        <div className="mt-[4px] readMore__btn__wrapper">
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
    </div>
  );
};

export default NoteTimeline;
