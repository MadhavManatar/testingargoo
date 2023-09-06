// ** import packages ** //
import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import Tippy from '@tippyjs/react';
import { useNavigate } from 'react-router-dom';

// ** components ** //
import DeleteAttachmentModal from 'components/detail-components/Attachment/components/DeleteAttachmentModal';
import Icon from 'components/Icon';
import AddNoteModal from './AddNoteModal';
import DownloadConfirmationModal from './AllDownloadConformationModal';
import DeleteNoteModal from './DeleteNoteModal';
import { useDispatch, useSelector } from 'react-redux';
import { format as Format } from 'date-fns-tz';
import TimelineEmailReplyModal from './TimelineEmailReplyModal';
import Dropdown from 'components/Dropdown';

// ** helper ** //
import { downloadAttachmentFile } from 'helper';

// ** types ** //
import {
  DocumentTimeline,
  NoteTimeline,
  TimelineOpenActivityModalType,
  TimelineType,
} from '../types';
import { ActivityResponseType } from 'pages/Activity/types/activity.types';

// ** redux **
import {
  getMailProviderOption,
  setLoadModuleActivityTimelines,
  setLoadPinTimeLines,
} from 'redux/slices/commonSlice';

// ** hooks **
import useWindowDimensions from 'hooks/useWindowDimensions';

// ** others ** //
import { REACTION_MODEL } from 'constant/timeline.constant';
import { setUrlParams } from 'utils/util';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import usePermission from 'hooks/usePermission';
import LinkEntityListModal from 'pages/Email/components/LinkEmailTimeline/LinkEntityListModal';
import LinkEntityModal from 'pages/Email/components/LinkEmailTimeline/LinkEntityModal';
import {
  useChangeActivityStatusByIdMutation,
  useUpdateActivityMutation,
} from 'redux/api/activityApi';
import { useDeleteNoteMutation } from 'redux/api/noteApi';
import { useDeleteAttachmentsMutation } from 'redux/api/attachmentApi';
import { usePinOrUnPinTimelineRecordMutation } from 'redux/api/timelineApi';
import IconAnimation from 'components/IconAnimation';
import { IconTypeJson } from 'indexDB/indexdb.type';
import { getPresignedImageUrl } from 'services/wasabi.service';
import { ReplyFormType } from 'pages/Email/types/email.type';

type ModalState = {
  delete?: boolean;
  edit?: boolean;
  download?: boolean;
  note: NoteTimeline | null;
  document: DocumentTimeline[] | null;
};

const TimelineAction = (
  timeline: TimelineType & {
    setReactionSection: React.Dispatch<
      React.SetStateAction<{
        isOpen?: boolean | undefined;
        delete?: boolean | undefined;
        comment_id?: number | undefined;
        emoji?: string | undefined;
        timeLine_id?: number | undefined;
      }>
    >;
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
    reactionSection: {
      isOpen?: boolean | undefined;
      delete?: boolean | undefined;
      comment_id?: number | undefined;
      emoji?: string | undefined;
      timeLine_id?: number | undefined;
    };
    onCommentIconClick: () => void;
    onEmojiClick: (
      unified: string,
      model_record_id: number,
      reaction_model_name: REACTION_MODEL
    ) => Promise<void>;
    emojiModalRef: React.RefObject<HTMLDivElement>;
    emojiIconRef: React.RefObject<HTMLDivElement>;
    addReactionLoading: boolean;
    setHistoryData: React.Dispatch<React.SetStateAction<TimelineType[]>>;
    setOpenActivityModal: React.Dispatch<
      React.SetStateAction<TimelineOpenActivityModalType>
    >;
  }
) => {
  const {
    relation_model_name,
    model_name: modelName,
    model_record_id: modelRecordId,
    documents,
    activities,
    note,
    message,
    is_pinned,
    setReactionSection,
    reactionSection,
    onEmojiClick,
    id: timeline_id,
    emojiModalRef,
    onCommentIconClick,
    emojiIconRef,
    addReactionLoading,
    setHistoryData,
    setOpenActivityModal,
    setPermissionArray,
    permissionArray,
    email,
  } = timeline;

  const checkMails: { label: string }[] = [];

  const mailProviders = useSelector(getMailProviderOption);

  mailProviders?.forEach((emails) => {
    if (emails?.label !== 'All') {
      const obj = {
        label: emails.label,
      };
      checkMails.push(obj);
    }
  });

  // ** hook **//
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    updateNotePermission,
    deleteNotePermission,
    deleteDocumentPermission,
  } = usePermission();

  // ** APIS **
  const [updateActivityByIdAPI] = useUpdateActivityMutation();
  const [changeActivityStatusByIdAPI] = useChangeActivityStatusByIdMutation();
  const [deleteNoteAPI, { isLoading: isDeleteNoteLoading }] =
    useDeleteNoteMutation();
  const [deleteManyAttachmentAPI, { isLoading: isDeleteAttachmentLoading }] =
    useDeleteAttachmentsMutation();

  const { isMobileView } = useWindowDimensions();

  // ** states **
  const [openAddLinkModal, openAddLinkEntityModal] = useState<boolean>(false);
  const [openLinkListModal, openLinkListEntityModal] = useState<boolean>(false);
  const [actionOpen, setActionOpen] = useState<{
    noteSection: boolean;
  }>({
    noteSection: false,
  });
  const [modalState, setModalState] = useState<ModalState>({
    delete: false,
    edit: false,
    note: timeline?.note || null,
    document: timeline?.documents?.length ? timeline?.documents : null,
  });
  const [emailOpen, setEmailOpen] = useState<{
    isOpen: boolean;
    email_id?: number;
    replyFormName?: ReplyFormType;
  }>({
    isOpen: false,
    email_id: undefined,
  });

  const deleteNote = async () => {
    if (modalState.delete && modalState?.note) {
      const data = await deleteNoteAPI({ id: modalState?.note?.id });

      if ('data' in data) {
        setModalState({ ...modalState, note: null });
        setHistoryData((prev) => {
          const finIndex = prev.findIndex((obj) => obj.id === data.data.id);
          prev.splice(finIndex, 1);
          return [...prev];
        });

        dispatch(setLoadPinTimeLines({ pinTimeline: true }));
      }
    }
  };

  async function changeActivityStatus(id: number, is_active: boolean) {
    const data = await changeActivityStatusByIdAPI({
      id,
      data: {
        is_active,
      },
    });
    if ('data' in data && data.data) {
      setHistoryData((prev) => {
        const finIndex = prev.findIndex((obj) => obj.id === timeline_id);
        prev[finIndex].activities.is_active = data.data.is_active;
        return [...prev];
      });
      setPermissionArray({
        data: [],
        timelineId: null,
      });
      dispatch(
        setLoadModuleActivityTimelines({
          moduleActivityTimeline: true,
        })
      );
    }
  }

  async function reOpenActivity(id: number) {
    const data = await updateActivityByIdAPI({
      id,
      data: {
        completed: false,
      },
    });

    if ('data' in data) {
      setHistoryData((prev) => {
        const finIndex = prev.findIndex((obj) => obj.id === timeline_id);
        prev[finIndex].activities.completed_by = data.data.completed_by;
        return [...prev];
      });
      dispatch(
        setLoadModuleActivityTimelines({
          moduleActivityTimeline: true,
        })
      );

      setPermissionArray({
        data: [],
        timelineId: null,
      });
    }
  }

  const deleteAttachment = async (documentId?: number) => {
    if (
      modalState.delete &&
      modalState?.document &&
      modalState?.document?.length > 0
    ) {
      const allId = documentId
        ? [documentId]
        : documents
            ?.filter((item) => item?.deleted_at === null)
            .map((item) => item?.id);

      const data = await deleteManyAttachmentAPI({
        data: {
          allId,
        },
      });

      if ('data' in data) {
        setHistoryData((prev) => {
          const finIndex = prev.findIndex((obj) => obj.id === data.data.id);
          prev.splice(finIndex, 1);
          return [...prev];
        });
        setModalState({ ...modalState, document: null });
        dispatch(setLoadPinTimeLines({ pinTimeline: true }));
      }
    }
  };

  const downloadDocuments = async () => {
    await Promise.all(
      (documents || [])?.map(async (document) => {
        return downloadAttachmentFile({
          url: await getPresignedImageUrl(document?.url),
          fileName: document?.doc_details.original_name,
        });
      })
    );

    setModalState({ ...modalState, download: false });
  };

  const isAlreadyDeleted = documents?.filter(
    (item) => item.deleted_at === null
  )?.length;

  const isLink = documents?.filter((item) => item.type === 'link')?.length;

  const isEmail = message?.newValue?.model_name === 'emails';
  const isValid =
    checkMails.filter((val) => val.label === email?.from_email_address).length >
    0;

  // ** apis **
  const [pinOrUnPinTimelineRecordApi] = usePinOrUnPinTimelineRecordMutation();

  const pinOrUnpinTimeline = async () => {
    const { id } = timeline as any;

    const data = await pinOrUnPinTimelineRecordApi({
      id,
      data: {
        is_pinned: !is_pinned,
      },
    });

    if ('data' in data || !('error' in data)) {
      // refetch timeline
      setHistoryData((prev) => {
        const finIndex = prev.findIndex((obj) => obj.id === data?.data?.id);
        if (finIndex >= 0) {
          prev[finIndex] = data.data;
        }
        return [...prev];
      });

      dispatch(setLoadPinTimeLines({ pinTimeline: true }));
    }
  };

  const openEmailModal = (replyFormMailName: ReplyFormType) => {
    if (isValid) {
      setEmailOpen({
        isOpen: true,
        email_id: message?.newValue?.model_record_id,
        replyFormName: replyFormMailName,
      });
    }
  };

  const isDeleted =
    relation_model_name === 'notes' &&
    (note === undefined || note.deleted_at !== null);

  const isDraftNote =
    relation_model_name === 'notes' &&
    note?.deleted_at === null &&
    note?.is_drafted;
  if (isDeleted) return <></>;

  const handleActivityClick = (
    aVal: ActivityResponseType,
    timelineId: number
  ) => {
    if (permissionArray.data.length) {
      return setPermissionArray({
        data: [],
        timelineId: null,
      });
    }

    const tempPermissionArray = [];

    tempPermissionArray.push({
      label: 'Edit',
      onClick: () => {
        if (isMobileView) {
          navigate(
            setUrlParams(
              PRIVATE_NAVIGATION.activities.EditActivityMobileView,
              aVal?.id
            )
          );
        } else {
          setOpenActivityModal({
            edit: true,
            complete: false,
            view: false,
            id: aVal?.id,
            activityTypeId: aVal?.activity_type?.id,
            activityTopic: aVal?.topic,
            historyId: timeline_id,
            model_name: modelName,
            model_record_id: modelRecordId,
          });
        }
      },
    });

    tempPermissionArray.push(
      {
        label: `${aVal?.is_active ? 'Stop' : 'Start'} ${
          aVal?.activity_type?.name || ''
        }`,
        onClick: () => {
          changeActivityStatus(aVal?.id, !aVal?.is_active);
        },
      },
      {
        label: `${aVal?.completed_by ? 'Re-Open' : 'Mark As Done'}`,
        onClick: () => {
          if (aVal?.completed_by) {
            reOpenActivity(aVal?.id);
          } else {
            setOpenActivityModal({
              edit: false,
              complete: true,
              id: aVal?.id,
              activityTypeId: aVal?.activity_type?.id,
              view: false,
              activityTopic: aVal.topic,
              historyId: timeline_id,
              model_name: modelName,
              model_record_id: modelRecordId,
            });
          }
        },
      }
    );
    setPermissionArray({
      data: tempPermissionArray,
      timelineId,
    });
  };

  return (
    <>
      <div className="action__btn__wrapper inline-flex items-center mb-[8px]">
        {isEmail && (
          <div className="email__action__btn__wrapper flex items-center relative pr-[10px] mr-[10px] before:content-[''] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:w-[1px] before:h-[calc(100%_-_4px)] before:bg-[#CCCCCC]">
            <span onClick={() => openEmailModal('reply')}>
              <IconAnimation
                iconType="inboxViewReplyBlueArrowFilled"
                animationIconType={IconTypeJson.Reply}
                className={`email__reply__btn cursor-pointer bg-transparent rounded-[6px] w-[32px] h-[32px] p-[4px] duration-300 hover:bg-[#F2F6F9] ${
                  !isValid ? '!cursor-not-allowed opacity-60' : ''
                }`}
              />
            </span>
            <span onClick={() => openEmailModal('replyAll')}>
              <IconAnimation
                iconType="inboxViewReplyAllBlueArrowFilled"
                animationIconType={IconTypeJson.ReplyAll}
                className={`email__reply__btn cursor-pointer bg-transparent rounded-[6px] w-[32px] h-[32px] p-[4px] duration-300 hover:bg-[#F2F6F9] ${
                  !isValid ? '!cursor-not-allowed opacity-60' : ''
                }`}
              />
            </span>
            <span onClick={() => openEmailModal('forward')}>
              <IconAnimation
                iconType="inboxViewForwardBlueArrowFilled"
                animationIconType={IconTypeJson.Forward}
                className={`email__reply__btn cursor-pointer bg-transparent rounded-[6px] w-[32px] h-[32px] p-[4px] duration-300 hover:bg-[#F2F6F9] ${
                  !isValid ? '!cursor-not-allowed opacity-60' : ''
                }`}
              />
            </span>
            <span onClick={() => openLinkListEntityModal(true)}>
              <IconAnimation
                iconType="composeMailLinkFilledIcon"
                animationIconType={IconTypeJson.Link}
                className="email__reply__btn cursor-pointer bg-transparent rounded-[6px] w-[32px] h-[32px] p-[4px] duration-300 hover:bg-[#F2F6F9]"
              />
            </span>
          </div>
        )}

        {message?.newValue?.model_name === 'activities' &&
        modelName !== 'activities' ? (
          <>
            {activities?.completed_by ? (
              <Tippy
                zIndex={5}
                className="!max-w-[400px]"
                content={
                  <>
                    <span className="">
                      Marked done at :{' '}
                      {Format(
                        new Date(activities?.completion_date),
                        "eeee',' MMM dd',' yyyy 'at' hh:mm a"
                      )}
                    </span>
                  </>
                }
              >
                <div className="inline-flex marked__done__sign justify-end items-center mr-2 whitespace-pre">
                  <span className="inline-block text-[16px] font-biotif__Regular text-[#7C7C7C] mr-[7px]">
                    Done
                  </span>
                  <div className="w-[19px] h-[19px] rounded-full bg-[#219653] relative before:content-['&quot;&quot;'] before:absolute before:top-[6px] before:left-[5px] before:w-[9px] before:h-[5px] before:border-l-[2px] before:border-l-white before:border-b-[2px] before:border-b-white before:-rotate-45" />
                </div>
              </Tippy>
            ) : null}
            <Icon
              className="cursor-pointer bg-[#F2F6F9] rounded-[6px] w-[32px] h-[32px] p-[6px] mr-[10px] last:mr-0 duration-300 hover:bg-primaryColor"
              iconType="eyeFilled"
              onClick={() =>
                setOpenActivityModal({
                  activityTopic: `${message?.newValue?.value}`,
                  id: message?.newValue?.model_record_id || null,
                  view: true,
                  edit: false,
                  complete: false,
                  historyId: timeline_id,
                  model_name: modelName,
                  model_record_id: modelRecordId,
                })
              }
            />
          </>
        ) : null}
        <div onClick={() => onCommentIconClick()}>
          <IconAnimation
            iconType="timlineMessageIcon"
            animationIconType={IconTypeJson.Message}
            className="message__btn w-[32px] h-[32px] p-[7px] mr-[10px] bg-[#F2F6F9] hover:bg-primaryColor cursor-pointer"
          />
        </div>
        <div className="emoji__dropdown__wrapper inline-block relative cursor-pointer">
          <Dropdown
            placement="bottom-start"
            hideOnClick
            content={({ close }) => (
              <>
                {reactionSection.timeLine_id === timeline_id ? (
                  <div ref={emojiModalRef}>
                    <EmojiPicker
                      lazyLoadEmojis
                      onEmojiClick={async (data) => {
                        onEmojiClick(
                          data.unified,
                          reactionSection.timeLine_id || 0,
                          REACTION_MODEL.TIMELINE
                        );
                        close();
                      }}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </>
            )}
          >
            {addReactionLoading &&
            reactionSection.timeLine_id === timeline_id ? (
              <div className="i__Icon emoji__btn cursor-pointer bg-[#F2F6F9] rounded-[6px] w-[32px] h-[32px] p-[7px] duration-300 hover:bg-primaryColor">
                <div className="i__ButtonLoader !m-0 top-0" />
              </div>
            ) : (
              <div ref={emojiIconRef}>
                <span
                  onClick={() => {
                    setReactionSection({
                      timeLine_id: timeline_id,
                    });
                  }}
                >
                  <IconAnimation
                    iconType="timelineEmojiIcon"
                    animationIconType={IconTypeJson.Emoji}
                    className="message__btn w-[32px] h-[32px] p-[7px] mr-[10px] bg-[#F2F6F9] hover:bg-primaryColor cursor-pointer"
                  />
                </span>
              </div>
            )}
          </Dropdown>
        </div>
        {isDraftNote ? (
          <Tippy zIndex={5} content="Cannot unpinned draft notes">
            <span className="pr-[7px]">
              <IconAnimation
                iconType="timelinePinIcon"
                animationIconType={IconTypeJson.Pin}
                className="bg-i__Icon  pin__btn cursor-pointer bg-primaryColor rounded-[6px] w-[32px] h-[32px] p-[7px] mr-[10px] duration-300 hover:bg-primaryColor active !rounded-[8px] cursor-pointer solidIcon message__btn w-[32px] h-[32px] p-[7px] mr-[10px] bg-[#F2F6F9] hover:bg-primaryColor cursor-pointer"
              />
            </span>
          </Tippy>
        ) : (
          <span onClick={() => pinOrUnpinTimeline()}>
            <IconAnimation
              iconType="timelinePinIcon"
              animationIconType={IconTypeJson.Pin}
              className={`pin__btn cursor-pointer ${
                is_pinned ? 'bg-primaryColor' : 'bg-[#F2F6F9]'
              } rounded-[6px] w-[32px] h-[32px] p-[7px] mr-[10px] duration-300 hover:bg-primaryColor ${
                is_pinned ? 'active' : ''
              }`}
            />
          </span>
        )}

        {message?.newValue?.model_name === 'activities' &&
        modelName !== 'activities' ? (
          <div className="inline-block relative">
            <Icon
              onClick={() => handleActivityClick(activities, timeline_id)}
              className="toggle__btn cursor-pointer bg-[#F2F6F9] rounded-[6px] w-[32px] h-[32px] p-[9px] last:mr-0 duration-300 hover:bg-primaryColor"
              iconType="toggle3dotsIcon"
            />

            {permissionArray.data.length &&
            timeline_id === permissionArray.timelineId ? (
              <div className="add__dropdown__menu absolute z-[3] top-[calc(100%_-_2px)] right-[0px] pt-[9px]">
                <div className="inner__wrapper bg-ipWhite__bgColor min-w-[108px] relative rounded-[10px]">
                  {permissionArray.data.map((val, index) => {
                    return (
                      <div key={index} className="item" onClick={val.onClick}>
                        <div className="flex items-center relative z-[2] cursor-pointer">
                          <span className="text whitespace-pre text-[14px] font-biotif__Medium inline-block ml-[2px] text-ipBlack__textColor">
                            {val.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {relation_model_name &&
          ((relation_model_name === 'notes' &&
            modalState?.note &&
            note?.deleted_at === null) ||
            (relation_model_name === 'documents' &&
              modalState?.document &&
              isAlreadyDeleted !== 0)) && (
            <div className="inline-block relative">
              <Icon
                onClick={() =>
                  setActionOpen({
                    ...actionOpen,
                    noteSection: !actionOpen.noteSection,
                  })
                }
                className="toggle__btn cursor-pointer bg-[#F2F6F9] rounded-[6px] w-[32px] h-[32px] p-[9px] last:mr-0 duration-300 hover:bg-primaryColor"
                iconType="toggle3dotsIcon"
              />
              {actionOpen.noteSection && (
                <div className="add__dropdown__menu absolute z-[3] top-[calc(100%_-_2px)] right-[0px] pt-[9px]">
                  <div className="inner__wrapper bg-ipWhite__bgColor min-w-[108px] relative rounded-[10px]">
                    {note &&
                      note.deleted_at === null &&
                      updateNotePermission && (
                        <div
                          className="item"
                          onClick={() =>
                            setModalState({ ...modalState, edit: true })
                          }
                        >
                          <div className="flex items-center relative z-[2] cursor-pointer">
                            <span className="text whitespace-pre text-[14px] font-biotif__Medium inline-block ml-[2px] text-ipBlack__textColor">
                              Edit
                            </span>
                          </div>
                        </div>
                      )}
                    {documents &&
                      documents?.length > 0 &&
                      isAlreadyDeleted !== 0 &&
                      isLink !== 1 && (
                        <div
                          className="item"
                          onClick={() =>
                            setModalState({ ...modalState, download: true })
                          }
                        >
                          <div className="flex items-center relative z-[2] cursor-pointer">
                            <span className="text whitespace-pre text-[14px] font-biotif__Medium inline-block ml-[2px] text-ipBlack__textColor">
                              Download
                            </span>
                          </div>
                        </div>
                      )}
                    {((documents &&
                      documents.length > 0 &&
                      deleteDocumentPermission &&
                      isAlreadyDeleted !== 0) ||
                      (note &&
                        note.deleted_at === null &&
                        deleteNotePermission)) && (
                      <div
                        className="item"
                        onClick={() =>
                          setModalState({ ...modalState, delete: true })
                        }
                      >
                        <div className="flex items-center relative z-[2] cursor-pointer">
                          <span className="text whitespace-pre text-[14px] font-biotif__Medium inline-block ml-[2px] text-ipBlack__textColor">
                            Delete
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
      </div>
      {emailOpen?.email_id && emailOpen.isOpen && (
        <>
          <TimelineEmailReplyModal
            close={(timeLineEmailData?: TimelineType) => {
              setEmailOpen({
                isOpen: false,
                email_id: undefined,
              });
              if (timeLineEmailData) {
                setHistoryData((prev) => {
                  return [timeLineEmailData, ...prev];
                });
              }
            }}
            email_id={emailOpen.email_id}
            isOpen={emailOpen.isOpen}
            model_name={modelName}
            model_record_id={modelRecordId}
            showReplyForm={emailOpen.replyFormName}
            isHideReply={false}
          />
        </>
      )}

      {modalState?.edit && modalState?.note && (
        <AddNoteModal
          closeModal={() => setModalState({ ...modalState, edit: false })}
          isOpen={modalState?.edit}
          modelName={modelName}
          modelRecordId={modelRecordId}
          id={modalState?.note?.id}
          updatedNote={() => {
            setActionOpen({
              ...actionOpen,
              noteSection: !actionOpen.noteSection,
            });
          }}
          setHistoryData={setHistoryData}
        />
      )}
      {modalState?.delete && modalState?.note && (
        <DeleteNoteModal
          closeModal={() => setModalState({ ...modalState, delete: false })}
          isOpen={modalState?.delete}
          isLoading={isDeleteNoteLoading}
          deleteNote={deleteNote}
        />
      )}
      {modalState.download && (
        <DownloadConfirmationModal
          downloadDocument={downloadDocuments}
          isOpen={modalState.download}
          closeModal={() => setModalState({ ...modalState, download: false })}
        />
      )}
      {modalState.delete && modalState?.document && (
        <DeleteAttachmentModal
          isOpen={modalState.delete}
          closeModal={() => setModalState({ ...modalState, delete: false })}
          deleteAttachment={() => deleteAttachment()}
          isLoading={isDeleteAttachmentLoading}
        />
      )}

      {openLinkListModal && message?.newValue?.model_record_id && (
        <LinkEntityListModal
          isOpen={openLinkListModal}
          closeModal={() => openLinkListEntityModal(false)}
          email_id={message?.newValue?.model_record_id}
          openAddLinkEntityModal={openAddLinkEntityModal}
        />
      )}

      {openAddLinkModal && message?.newValue?.model_record_id && (
        <LinkEntityModal
          isOpen={openAddLinkModal}
          closeModal={() => {
            openAddLinkEntityModal(false);
          }}
          email_id={message?.newValue?.model_record_id}
        />
      )}
    </>
  );
};

export default TimelineAction;
