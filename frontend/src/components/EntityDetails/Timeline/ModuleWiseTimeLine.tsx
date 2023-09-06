// ** Import Packages **
import Tippy from '@tippyjs/react';
import { format } from 'date-fns-tz';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// ** Components **
import CommentTimeline from './components/CommentTimeline';
import DeleteCommentModal from './components/DeleteCommentModal';
import DateTimeSince from 'components/DateFormat/DateTimeSince';
import DefaultTimeline from './DefaultTimeline';
import TimelineAction from './components/TimelineAction';

// ** Constants **
import { REACTION_MODEL, TimelineModelName } from 'constant/timeline.constant';
import { TIMELINE_MODEL } from './constant/timelineField.constant';

// ** Types **
import { CustomLabel } from 'pages/Email/types/email.type';
import { TimelineOpenActivityModalType, TimelineType } from './types';

// ** Helper **
import {
  convertPluralToSingularModalName,
  timeLineModelNameConverter,
  timeLineNameConverter,
} from './helper';
import {
  useAddReactionAPIMutation,
  useDeleteCommentMutation,
} from 'redux/api/commentApi';

// here make the switch cases for modules
type ModuleWiseTimeLineProps = {
  history: TimelineType;
  modelName: TimelineModelName;
  setHistoryData: React.Dispatch<React.SetStateAction<TimelineType[]>>;
  setOpenActivityModal: React.Dispatch<
    React.SetStateAction<TimelineOpenActivityModalType>
  >;
  openActivityModal: TimelineOpenActivityModalType;
  closeModal: (data?: any) => void;
  setPermissionArray: React.Dispatch<
    React.SetStateAction<{
      data: {
        label: string;
        onClick: () => void;
      }[];
      timelineId: number | null;
    }>
  >;
  permissionArray: {
    data: {
      label: string;
      onClick: () => void;
    }[];
    timelineId: number | null;
  };
};

export const ModuleWiseTimeLine = (props: ModuleWiseTimeLineProps) => {
  const {
    history,
    setHistoryData,
    modelName,
    setOpenActivityModal,
    setPermissionArray,
    permissionArray,
  } = props;
  const {
    creator,
    message,
    model_name,
    timeline_date,
    relation_model_name,
    comments,
    reactions,
    model_record_id,
    activities,
  } = history;

  // ** Ref **
  const emojiModalRef = useRef<HTMLDivElement>(null);
  const commentTextRef = useRef<HTMLTextAreaElement>(null);
  const emojiIconRef = useRef<HTMLDivElement>(null);

  // ** states ** //
  // for comment modal open
  const [commentSection, setCommentSection] = useState<{
    isOpen?: boolean;
    delete?: boolean;
    id?: number;
    delete_id?: number;
  }>({
    isOpen: false,
    delete: false,
  });
  const [commentText, setCommentText] = useState<string>('');

  // for reaction modal open
  const [reactionSection, setReactionSection] = useState<{
    delete?: boolean;
    comment_id?: number;
    emoji?: string;
    timeLine_id?: number;
  }>({
    delete: false,
  });

  // ** custom hooks **//
  const [addReactionAPI, { isLoading: addReactionLoading }] =
    useAddReactionAPIMutation();

  // ** apis ** //

  const [
    deleteCommentAPI,
    { isLoading: deleteCommentLoading, error: deleteError },
  ] = useDeleteCommentMutation();

  useEffect(() => {
    if (commentSection.isOpen) {
      commentTextRef.current?.focus();
    }
  }, [commentSection.isOpen]);

  const getFieldNameOfTimeline = () => {
    if (message?.fieldName === 'New Activity Created') {
      return 'New Activity Created';
    }
    if (activities) {
      return activities?.activity_type?.name;
    }
    if (relation_model_name) {
      return timeLineNameConverter(relation_model_name);
    }
    if (message?.fieldName?.search('Created') !== -1) {
      return `New ${timeLineModelNameConverter(
        model_name as TimelineModelName
      )} Created`;
    }
    return timeLineNameConverter(message?.fieldName);
  };

  const modifierName = `${creator?.first_name || ''} ${
    creator?.last_name || ''
  }`;

  const deleteComment = async () => {
    if (commentSection?.delete_id) {
      const data = await deleteCommentAPI({
        id: commentSection.delete_id,
      });

      if ('data' in data && !deleteError) {
        setCommentSection({
          delete: false,
        });
        setHistoryData((prev) => {
          const finIndex = prev.findIndex((obj) => obj.id === data.data.id);
          if (finIndex >= 0) {
            prev[finIndex] = data.data;
          }
          return [...prev];
        });
      }
    }
  };

  const convertEmoji = (emojiCode: string) => {
    const code = emojiCode.split('-');

    return code
      .map((item) => {
        return String.fromCodePoint(parseInt(item, 16));
      })
      .join('');
  };

  const onEmojiClick = async (
    unified: string,
    reaction_model_record_id: number,
    reaction_model_name: REACTION_MODEL
  ) => {
    const data = await addReactionAPI({
      data: {
        reaction: unified,
        reaction_model_name,
        model_name: history.model_name,
        reaction_model_record_id,
        timeline_id: history.id,
        model_record_id: history.model_record_id,
      },
    });

    if ('data' in data && !('error' in data)) {
      setHistoryData((prev) => {
        const finIndex = prev.findIndex((obj) => obj.id === data.data?.id);
        prev[finIndex] = data?.data;
        return [...prev];
      });
    }
  };

  // time line reaction
  const groupTimelineReaction = _.groupBy(reactions, (react) => react.reaction);

  const timeLineCommentAction = (commentData: any) => {
    setHistoryData((prev) => {
      const finIndex = prev.findIndex((obj) => obj.id === commentData.id);
      prev[finIndex] = commentData;
      return [...prev];
    });
    setCommentSection({
      isOpen: false,
    });
  };

  const originFromModalName = () => {
    if (
      ['notes', 'documents', 'activities'].includes(
        relation_model_name || ''
      ) &&
      model_name !== modelName
    ) {
      return (
        <span className="inline-block text-[#808080]/80 text-[14px] font-biotif__Regular mb-[4px]">
          Generated from{' '}
          <Link
            className="inline-flex flex-wrap items-center text-[14px] text-primaryColor font-biotif__Regular max-w-full hover:underline"
            to={`/${model_name}/${model_record_id}`}
          >
            {convertPluralToSingularModalName(model_name)}
          </Link>
        </span>
      );
    }
    if (
      relation_model_name === TIMELINE_MODEL.EMAIL &&
      history?.email?.labels[0] === CustomLabel.SCHEDULED &&
      history?.email?.schedule_mail?.delay_date_time
    ) {
      return (
        <span className="inline-block text-[#808080]/80 text-[14px] font-biotif__Regular mb-[4px]">
          Scheduled:{' '}
          {format(
            new Date(history.email.schedule_mail.delay_date_time),
            'E, MMM dd, yyyy KK:mm a'
          )}
        </span>
      );
    }
    return '';
  };

  const isDraftNote =
    history?.note &&
    history?.note?.deleted_at === null &&
    history.note?.is_drafted;

  return (
    <>
      {history?.documents &&
      history.documents.length > 0 &&
      history.documents[0].deleted_at !== null ? (
        ''
      ) : (
        <div className="timeline__box__new__inner relative mb-[13px] pt-[3px] pb-[12px] border-b border-b-[#CCCCCC]/50 last:pb-0 last:mb-0 last:border-b-0">
          <div className="timeline__box__new flex flex-wrap items-start">
            <div className="timeline__header__action flex items-center w-full justify-between">
              <h3 className="timeline__title w-[calc(100%_-_60px)] text-[18px] font-biotif__Medium text-primaryColor mb-[8px] pr-[14px]">
                {getFieldNameOfTimeline()} {originFromModalName()}
                {isDraftNote && (
                  <span className="badge square__round text-white py-[2px] pt-[4px] px-[10px] text-[11px] tracking-[0.5px] ml-[3px] relative top-[-1px] bg-[#27ae60]">
                    Draft
                  </span>
                )}
              </h3>
              <TimelineAction
                {...history}
                setReactionSection={setReactionSection}
                reactionSection={reactionSection}
                onEmojiClick={onEmojiClick}
                emojiModalRef={emojiModalRef}
                onCommentIconClick={() => {
                  setCommentSection({
                    isOpen: !commentSection.isOpen,
                  });
                  setCommentText('');
                }}
                emojiIconRef={emojiIconRef}
                addReactionLoading={addReactionLoading}
                setHistoryData={setHistoryData}
                setOpenActivityModal={setOpenActivityModal}
                setPermissionArray={setPermissionArray}
                permissionArray={permissionArray}
              />
            </div>
            <div
              className={
                history?.documents && history?.documents?.length > 0
                  ? 'timeline__document__listing w-full'
                  : 'w-full'
              }
            >
              <DefaultTimeline
                timelineData={{
                  ...history,
                  message: history?.message,
                }}
                key={history.id}
                setHistoryData={setHistoryData}
                setOpenActivityModal={setOpenActivityModal}
              />
            </div>
            <div className="author__time__wrapper mt-[12px]">
              <span className="author__tag inline-block text-[14px] font-biotif__Medium text-black mr-[11px] mb-[4px]">
                {modifierName}
              </span>
              <span className="inline-block text-[#808080]/80 text-[14px] font-biotif__Regular mb-[4px]">
                <DateTimeSince date={timeline_date as string} />
              </span>
              <div className="emoji__react__wrapper inline-flex flex-wrap relative mb-[4px] ">
                {(Object.entries(groupTimelineReaction) || []).map((val) => {
                  return (
                    <Tippy
                      key={`emoji_${val[0]}`}
                      content={
                        <span>
                          {(val[1] || [])
                            .map((creator_obj) => {
                              return `${
                                creator_obj?.creator?.first_name || ''
                              } ${creator_obj?.creator?.last_name || ''}`;
                            })
                            .join(', ')}
                        </span>
                      }
                    >
                      <div
                        onClick={async () =>
                          onEmojiClick(
                            val[0],
                            history.id,
                            REACTION_MODEL.TIMELINE
                          )
                        }
                        className="emoji__react__box pt-[5px] pb-[3px] px-[5px] inline-flex items-center border-[1px] border-[#000000]/50 rounded-[5px] mr-[5px] cursor-pointer last:mr-0"
                      >
                        <span className="count text-[14px] font-biotif__Medium leading-[16px] text-black/50 mr-[4px]">
                          {val[1].length}
                        </span>
                        <span className="emoji__icon text-[14px] font-biotif__Medium leading-[16px]">
                          {convertEmoji(val[0])}
                        </span>
                      </div>
                    </Tippy>
                  );
                })}
              </div>
            </div>

            {/* comment model  */}

            {comments?.length || commentSection.isOpen ? (
              <CommentTimeline
                convertEmoji={convertEmoji}
                creator={creator}
                onEmojiClick={onEmojiClick}
                reactionSection={reactionSection}
                timeLineCommentAction={timeLineCommentAction}
                setCommentSection={setCommentSection}
                commentSection={commentSection}
                setCommentText={setCommentText}
                commentText={commentText}
                history={history}
                comments={comments}
                emojiIconRef={emojiIconRef}
                addReactionLoading={addReactionLoading}
                setReactionSection={setReactionSection}
                emojiModalRef={emojiModalRef}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      )}

      {commentSection.delete && (
        <DeleteCommentModal
          isOpen={commentSection.delete}
          closeModal={() => setCommentSection({ delete: false })}
          deleteComment={() => deleteComment()}
          isLoading={deleteCommentLoading}
        />
      )}
    </>
  );
};

export default ModuleWiseTimeLine;
