// ** Import Packages **
import Tippy from '@tippyjs/react';
import EmojiPicker from 'emoji-picker-react';
import _ from 'lodash';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// ** Components **
import Button from 'components/Button';
import DateTimeSince from 'components/DateFormat/DateTimeSince';
import Dropdown from 'components/Dropdown';
import Icon from 'components/Icon';
import Image from 'components/Image';
import LinkPreview from 'components/LinkPreview';
import DisplayRichTextContent from 'components/RichTextEditor/DisplayRichTextContent';
import MentionIntegration from 'components/detail-components/Notes/components/MentionComponents';

// ** Redux **
import {
  useAddCommentMutation,
  useUpdateCommentMutation,
} from 'redux/api/commentApi';
import { getCurrentUser } from 'redux/slices/authSlice';

// ** Constant **
import { REACTION_MODEL } from 'constant/timeline.constant';

// ** Type **
import { Comments, TimelineType } from '../types';
import { commentSchema } from '../validation-schema/comments.schema';
import { CommentTimelineSchemaError } from 'constant/formErrorMessage.constant';

interface propsInterface {
  convertEmoji: (emojiCode: string) => string;
  creator: {
    first_name: string;
    last_name: string;
    profile_image: string;
    initial_color?: string;
  };
  onEmojiClick: (
    unified: string,
    reaction_model_record_id: number,
    reaction_model_name: REACTION_MODEL
  ) => Promise<void>;
  reactionSection: {
    delete?: boolean | undefined;
    comment_id?: number | undefined;
    emoji?: string | undefined;
    timeLine_id?: number | undefined;
  };
  timeLineCommentAction: (commentData: any) => void;
  setCommentSection: React.Dispatch<
    React.SetStateAction<{
      isOpen?: boolean | undefined;
      delete?: boolean | undefined;
      id?: number | undefined;
      delete_id?: number | undefined;
    }>
  >;

  commentSection: {
    isOpen?: boolean | undefined;
    delete?: boolean | undefined;
    id?: number | undefined;
    delete_id?: number | undefined;
  };
  setCommentText: React.Dispatch<React.SetStateAction<string>>;
  commentText: string;
  history: TimelineType;
  comments: Comments[];
  emojiIconRef: React.RefObject<HTMLDivElement>;
  addReactionLoading: boolean;
  setReactionSection: React.Dispatch<
    React.SetStateAction<{
      delete?: boolean | undefined;
      comment_id?: number | undefined;
      emoji?: string | undefined;
      timeLine_id?: number | undefined;
    }>
  >;
  emojiModalRef: React.RefObject<HTMLDivElement>;
}

const CommentTimeline = (props: propsInterface) => {
  const {
    commentSection,
    commentText,
    convertEmoji,
    creator,
    onEmojiClick,
    reactionSection,
    setCommentSection,
    setCommentText,
    timeLineCommentAction,
    history,
    comments,
    emojiIconRef,
    addReactionLoading,
    setReactionSection,
    emojiModalRef,
  } = props;

  // ** apis **
  const [addCommentAPI, { isLoading }] = useAddCommentMutation();

  const [userIds, setUserIds] = useState<number[]>();
  const [url, setUrl] = useState<string>();
  const [
    updateCommentAPI,
    { isLoading: updateLoading, data: updateData, error: updateError },
  ] = useUpdateCommentMutation();
  const [commentError, setCommentError] = useState<string>('');

  const currentUser = useSelector(getCurrentUser);

  const [actionOpenComment, setActionOpenComment] = useState<{
    isOpen: boolean;
    id: number | null;
  }>({
    id: null,
    isOpen: false,
  });

  useEffect(() => {
    if (updateData && !updateError) {
      timeLineCommentAction(updateData);
    }
  }, [updateData]);

  const isNoteFormValid = async () => {
    try {
      await commentSchema.validate({ commentText }, { abortEarly: false });
      return true;
    } catch (error) {
      setCommentError(CommentTimelineSchemaError.required);
      return false;
    }
  };
  const handelSave = async () => {
    const isValid = await isNoteFormValid();
    if (isValid) {
      const text = commentText.replace(/&nbsp;/g, ' ')
      const userId = `[${JSON.stringify({
        new: userIds || [],
        old: [],
        deleted: [],
      })}]`;
      if (text.length && !commentSection.id) {
        const data = await addCommentAPI({
          data: {
            comment: text,
            userIds: userId,
            timeline_id: history.id,
            model_name: history.model_name,
            model_record_id: history.model_record_id,
          },
        });

        if ('data' in data && !('error' in data)) {
          timeLineCommentAction(data.data);
        }
      }
      if (commentSection.id && text.length) {
        await updateCommentAPI({
          id: commentSection.id,
          data: {
            comment: text,
            userIds: userId,
            timeline_id: history.id,
            model_name: history.model_name,
            model_record_id: history.model_record_id,
          },
        });
      }
      setCommentError('');
    }
  };
  const onChange = (value: any) => {
    setCommentText(value);
  };
  const oncancel = () => {
    setCommentSection({
      isOpen: !commentSection.isOpen,
    });
    setCommentError('');
  };
  return (
    <div className="timeline__note mt-[20px] mb-[8px] w-full flex flex-wrap items-start bg-[#ECF2F6] rounded-[10px] p-[24px] pb-[10px]">
      {commentSection.isOpen ? (
        <>
          <div className="img__wrapper w-[40px] h-[40px] mb-[20px]">
            <Image
              imgPath={creator?.profile_image}
              first_name={creator?.first_name}
              last_name={creator?.last_name}
              serverPath
              color={creator?.initial_color}
            />
          </div>

          <div className="right__wrapper pl-[15px] w-[calc(100%_-_40px)] mb-[20px]">
            <div className="bg-white rounded-[10px] p-[17px]">
              <MentionIntegration
                onChange={onChange}
                setUrl={setUrl}
                setUserIds={setUserIds}
                noteData={commentText}
              />
              {url ? (
                <>
                  <LinkPreview url={url} />
                </>
              ) : null}
              <div className="buttons__wrapper flex items-center justify-end pt-[15px]">
                <Button
                  onClick={() => oncancel()}
                  className="secondary__Btn py-[10px] mr-[10px] min-w-[100px] text-center"
                >
                  Cancel
                </Button>
                <Button
                  isLoading={isLoading || updateLoading}
                  className="primary__Btn py-[10px] min-w-[100px] text-center"
                  onClick={async () => {
                    handelSave();
                  }}
                >
                  Save
                </Button>
              </div>
              <p className="ip__Error">{commentError}</p>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      <div className="timeline__note__listing w-full">
        {(comments || []).map((item) => {
          const groupCommentsReaction = _.groupBy(
            item?.reactions,
            (react) => react.reaction
          );
          return (
            <Fragment key={`comment_${item.id}`}>
              {item.id !== commentSection.id && (
                <div className="timeline__note__list__box flex flex-wrap items-start pb-[14px] mb-[14px] border-b-[1px] border-b-[#CCCCCC] last:border-b-0 last:pb-[0px] last:mb-[0px]">
                  <div className="img__wrapper w-[40px] h-[40px] sm:w-[28px] sm:h-[28px] 456">
                    <Image
                      imgPath={item.creator?.profile_image}
                      first_name={item.creator?.first_name}
                      last_name={item.creator?.last_name}
                      serverPath
                      color={item.creator?.initial_color}
                    />
                  </div>
                  <div className="right w-[calc(100%_-_40px)] pl-[18px] pt-[5px] flex">
                    <div className="timeline__note__heading flex flex-wrap items-start w-full">
                      <h3 className="text-[16px] pt-[5px] font-biotif__Regular tracking-[0.5px] pr-[14px]">
                        <DisplayRichTextContent
                          information={item?.comment}
                          setUrl={setUrl}
                        />
                      </h3>
                      {url ? (
                        <a
                          className="text-[16px] text-primaryColor font-biotif__Regular underline inline-block"
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <LinkPreview url={url} />
                        </a>
                      ) : null}
                    </div>
                    <div className="action__btn__wrapper inline-flex items-center shrink-0">
                      <div className="emoji__dropdown__wrapper inline-block relative mr-[10px] last:mr-0">
                        <Dropdown
                          placement="bottom-start"
                          hideOnClick
                          content={({ close }) =>
                            reactionSection.comment_id === item.id ? (
                              <div ref={emojiIconRef}>
                                <EmojiPicker
                                  onEmojiClick={async (data) => {
                                    close();
                                    onEmojiClick(
                                      data.unified,
                                      reactionSection.comment_id || 0,
                                      REACTION_MODEL.COMMENT
                                    );
                                  }}
                                />
                              </div>
                            ) : (
                              <></>
                            )
                          }
                        >
                          {addReactionLoading &&
                          reactionSection.comment_id === item.id ? (
                            <div className="i__Icon emoji__btn cursor-pointer bg-white rounded-[6px] w-[32px] h-[32px] p-[7px] duration-300 hover:bg-primaryColor">
                              <div className="i__ButtonLoader !m-0 top-0" />
                            </div>
                          ) : (
                            <div ref={emojiModalRef}>
                              <Icon
                                className="emoji__btn cursor-pointer bg-white rounded-[6px] w-[32px] h-[32px] p-[7px] duration-300 hover:bg-primaryColor"
                                iconType="timelineEmojiIcon"
                                onClick={() => {
                                  setReactionSection({
                                    comment_id: item?.id,
                                  });
                                }}
                              />
                            </div>
                          )}
                        </Dropdown>
                      </div>
                      {item?.created_by === currentUser?.id ? (
                        <div className="inline-block relative">
                          <Icon
                            className="toggle__btn cursor-pointer bg-white rounded-[6px] w-[32px] h-[32px] p-[9px] last:mr-0 duration-300 hover:bg-primaryColor"
                            iconType="toggle3dotsIcon"
                            onClick={() =>
                              setActionOpenComment({
                                id: item.id,
                                isOpen: !actionOpenComment.isOpen,
                              })
                            }
                          />
                          {actionOpenComment.isOpen &&
                          item.id === actionOpenComment.id ? (
                            <div className="add__dropdown__menu absolute z-[3] top-[calc(100%_-_2px)] right-[0px] pt-[9px]">
                              <div className="inner__wrapper bg-ipWhite__bgColor min-w-[108px] relative rounded-[10px]">
                                <div className="item">
                                  <div className="flex items-center relative z-[2] cursor-pointer">
                                    <span
                                      onClick={() => {
                                        setCommentSection({
                                          isOpen: !commentSection.isOpen,
                                          id: item.id,
                                          delete_id: undefined,
                                        });
                                        setActionOpenComment({
                                          id: null,
                                          isOpen: false,
                                        });
                                        setCommentText(item.comment);
                                      }}
                                      className="text whitespace-pre text-[14px] font-biotif__Medium inline-block ml-[2px] text-ipBlack__textColor"
                                    >
                                      Edit
                                    </span>
                                  </div>
                                </div>
                                <div className="item">
                                  <div className="flex items-center relative z-[2] cursor-pointer">
                                    <span
                                      onClick={() => {
                                        setCommentSection({
                                          delete: true,
                                          delete_id: item?.id,
                                          id: undefined,
                                        });
                                        setActionOpenComment({
                                          id: null,
                                          isOpen: false,
                                        });
                                      }}
                                      className="text whitespace-pre text-[14px] font-biotif__Medium inline-block ml-[2px] text-ipBlack__textColor"
                                    >
                                      Delete
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="timeline__note__footer w-full mt-[8px]">
                    <span className="author__tag inline-block text-[14px] font-biotif__Medium text-black mr-[11px] mb-[4px]">
                      {`${item?.creator?.first_name || ''} ${
                        item?.creator?.last_name || ''
                      }`}
                    </span>
                    <DateTimeSince date={item.updated_at as string} />

                    <div className="emoji__react__wrapper inline-flex flex-wrap relative mb-[4px]">
                      {(Object.entries(groupCommentsReaction) || []).map(
                        (emoji) => {
                          return (
                            <Tippy
                              key={`_emoji_${emoji[0]}`}
                              content={
                                <span>
                                  {(emoji[1] || [])
                                    .map((creator_obj) => {
                                      return `${
                                        creator_obj?.creator?.first_name || ''
                                      } ${
                                        creator_obj?.creator?.last_name || ''
                                      }`;
                                    })
                                    .join(', ')}
                                </span>
                              }
                            >
                              <div
                                onClick={async () =>
                                  onEmojiClick(
                                    emoji[0],
                                    item.id,
                                    REACTION_MODEL.COMMENT
                                  )
                                }
                                className="emoji__react__box pt-[5px] pb-[3px] px-[5px] inline-flex items-center border-[1px] border-[#000000]/50 rounded-[5px] mr-[5px] bg-white cursor-pointer last:mr-0"
                              >
                                <span className="count text-[14px] font-biotif__Medium leading-[16px] text-black/50 mr-[4px]">
                                  {emoji[1].length}
                                </span>
                                <span className="emoji__icon text-[14px] font-biotif__Medium leading-[16px]">
                                  {convertEmoji(emoji[0])}
                                </span>
                              </div>
                            </Tippy>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CommentTimeline;
