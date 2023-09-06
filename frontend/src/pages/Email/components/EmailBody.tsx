import { Dispatch, useCallback, useEffect, useRef, useState } from 'react';
import Image from 'components/Image';
import { format } from 'date-fns';

import {
  CustomLabel,
  EmailDetail,
  EmailFileType,
  EmailModalType,
  EmailThreadDetail,
  ReplyFormType,
  UploadResponseInMail,
} from '../types/email.type';
import Icon from 'components/Icon';
import { getEmailBody } from '../hooks/useEmailService';
import EmailReply from './EmailReply';
import { MailTokenProvider } from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';
import FromToInfoCard from './EmailTabs/Components/FromToInfoCard';
import { agoTimeShow } from 'helper/dateAndTimeHelper';
import { EmailAttachmentRender } from './EmailAttachmentRender';
import {
  contentIdReplaceWithSrc,
  hideReplyAllBtn,
} from '../helper/email.helper';
import AddEmailComposerModal, {
  EditEmail,
} from './emailComposer/AddEmailComposerModal';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMailProviderOption,
  setLoadEmailThreads,
} from 'redux/slices/commonSlice';
import LinkEntityListModal from './LinkEmailTimeline/LinkEntityListModal';
import LinkEntityModal from './LinkEmailTimeline/LinkEntityModal';
import { getPresignedImageUrl } from 'services/wasabi.service';
import { downloadAttachmentFile } from 'helper';

type Props = {
  setEmailUndoHelperObj: React.Dispatch<
    React.SetStateAction<{
      id?: number | undefined;
      delay_time: number;
      provider?: MailTokenProvider | undefined;
      isScheduled?: string;
    }>
  >;
  emailData: EmailDetail;
  index: number;
  emailDetails: EmailThreadDetail;
  emailUndoHelperObj: {
    id?: number | undefined;
    delay_time: number;
    provider?: MailTokenProvider | undefined;
  };
  setModal: Dispatch<React.SetStateAction<EmailModalType | undefined>>;
  setEmailDetails: Dispatch<
    React.SetStateAction<EmailThreadDetail | undefined>
  >;
};

const EmailBody = (props: Props) => {
  const {
    setEmailDetails,
    emailDetails,
    setEmailUndoHelperObj,
    emailUndoHelperObj,
    emailData,
    index,
    setModal,
  } = props;

  // ** States **
  const containerRef = useRef<HTMLDivElement>(null);
  const [isShowBody, setIsShowBody] = useState(index === 0);
  const [isBodyLoading, setIsBodyLoading] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState<ReplyFormType>();
  const [openLinkListModal, openLinkListEntityModal] = useState<boolean>(false);

  const [emailComposeModal, setEmailComposeModal] = useState<boolean>(false);
  const [editEmail, setEditEmail] = useState<EditEmail | undefined>(undefined);
  const composeModalRef = useRef<EmailModalType>();
  const [openAddLinkModal, openAddLinkEntityModal] = useState<boolean>(false);
  const [emailAttachments, setEmailAttachments] = useState<EmailFileType[]>([]);
  const [replyAttachments, setReplyAttachments] = useState<
    UploadResponseInMail[]
  >([]);
  const mailProviders = useSelector(getMailProviderOption);

  const dispatch = useDispatch();

  const changeEmailSubject = (email: EditEmail) => {
    setEditEmail({ ...email, replyAttachments });
    setShowReplyForm(undefined);
    setTimeout(() => {
      setEmailComposeModal(true);
    });
  };
  const getEmailRecipientOptions = () => {
    const defaultRecipient = emailData.email_recipients?.filter((obj) =>
      showReplyForm === 'reply' ? obj.field === 'to' : true
    );
    const options = (defaultRecipient || []).flatMap((dr) => {
      return dr.emails.map((e) => {
        return { label: e.name ?? '', value: e.email };
      });
    });

    return options;
  };

  useEffect(() => {
    if (isShowBody && emailData.html && containerRef.current) {
      setHtmlContent();
    }
  }, [emailData, isShowBody]);

  useEffect(() => {
    if (emailData.initialBodyLoad) {
      handleCollapse();
    }
  }, [emailData.initialBodyLoad]);

  const setHtmlContent = useCallback(async () => {
    if (containerRef.current) {
      const { html, attachments } = await contentIdReplaceWithSrc({
        emailAttachments: emailData.email_attachments,
        html: emailData.html,
      });
      emailData.html = html;
      setEmailAttachments(attachments);
      containerRef.current.innerHTML = emailData.html;
    }
  }, [emailData]);

  const handleCollapse = async () => {
    setIsShowBody(!isShowBody);
    if (emailData.body_path && !emailData.html) {
      setIsBodyLoading(true);
      const bodyHtml = await getEmailBody(emailData.body_path);
      if (bodyHtml && containerRef.current) {
        emailData.html = bodyHtml;
        setHtmlContent();
      }
      setIsBodyLoading(false);
    }
  };

  const handleReplyForm = (type: ReplyFormType) => {
    if (!(showReplyForm && emailDetails.messages.length === index + 1)) {
      setShowReplyForm(type);
    }
  };

  const closeEmailComposeModal = () => {
    setEmailComposeModal(false);
    dispatch(
      setLoadEmailThreads({
        email_details: true,
      })
    );
  };

  const isVisibleReplyTab =
    emailDetails.messages.length === index + 1 && !showReplyForm;
  const emailRecipients: string[] | undefined = emailData.email_recipients
    ?.map((obj) => obj.emails.map((innerObj) => innerObj.email))
    .flat();

  const isSameEmailsForCCBcc = hideReplyAllBtn(emailRecipients);

  return (
    <>
      <div
        className={`inbox__view__mail__list__item border-b border-b-[#000000]/10 pb-[22px] mb-[22px] lg:pb-[10px] last-of-type:border-b-0 last-of-type:pb-0 last-of-type:mb-0 ${
          isVisibleReplyTab ? 'reply__tab__visible' : ''
        }`}
        key={emailData.id}
      >
        <div className="inbox__view__box relative min-h-[60px] pl-[84px] lg:pl-0">
          <div className="profile__img__wrapper w-[52px] h-[52px] absolute top-0 left-[12px] rounded-full lg:w-[38px] lg:h-[38px] lg:left-0">
            <Image
              imgClassName="w-[52px] h-[52px] absolute top-0 left-[12px] rounded-full object-cover object-center"
              first_name={emailData.from_email_address?.split('@')[0] || ''}
              serverPath
            />
          </div>
          <div className="sender__header flex flex-wrap items-center justify-between mb-[12px] lg:relative lg:pl-[50px]">
            <div className="flex flex-wrap w-full justify-between">
              <h4 className="w-full text-[18px] font-biotif__Medium text-ipBlack__textColor lg:text-[16px] lg:font-biotif__Medium lg:text-[#2E3234] lg:whitespace-pre lg:overflow-hidden lg:text-ellipsis lg:leading-[20px] max-w-[calc(100%_-_400px)] lg:w-[calc(100%_-_108px)] lg:max-w-[calc(100%_-_108px)] overflow-hidden">
                {emailData.from_email_address?.split('@')[0]}
                <span className="inline-block ml-[6px] text-[14px] font-biotif__Regular text-black/50 lg:hidden">
                  &#60; {emailData.from_email_address} &#62;
                </span>
              </h4>
              <div className="right inline-flex items-center">
                <p className="inline-block text-[12px] text-[#5F6368] font-biotif__Regular relative top-[2px] pr-[10px] lg:hidden">
                  {format(
                    new Date(emailData?.send_date),
                    'E, MMM yyyy HH:mm a'
                  )}{' '}
                  ({agoTimeShow(emailData?.send_date)})
                </p>
                <div className="ivb__action__box flex flex-wrap items-center lg:absolute lg:top-[2px] lg:right-[-10px]">
                  <Icon
                    className="mr-[6px] !w-[34px] !h-[34px] !p-[7px] duration-500 rounded-full hover:bg-ipGray__transparentBG cursor-pointer lg:w-[30px] lg:h-[30px] lg:!p-[6px] lg:mr-[2px] hidden"
                    iconType="inboxViewBookmarkFilledIcon"
                  />
                  {!emailData.labels.includes(CustomLabel.DRAFT) && (
                    <Icon
                      onClick={() => handleReplyForm('reply')}
                      className="mr-[6px] !w-[34px] !h-[34px] !p-[7px] duration-500 rounded-full hover:bg-ipGray__transparentBG cursor-pointer lg:w-[30px] lg:h-[30px] lg:!p-[6px] lg:mr-[2px]"
                      iconType="inboxViewReplyFilledIcon"
                    />
                  )}
                  <Icon
                    onClick={() => openLinkListEntityModal(true)}
                    className="mr-[6px] !w-[34px] !h-[34px] !p-[6px] duration-500 rounded-full hover:bg-ipGray__transparentBG cursor-pointer lg:w-[30px] lg:h-[30px] lg:!p-[6px]"
                    iconType="composeMailLinkFilledIcon"
                  />
                  <Icon
                    className="!w-[34px] !h-[34px] !p-[7px] duration-500 rounded-full hover:bg-ipGray__transparentBG cursor-pointer lg:w-[30px] lg:h-[30px] lg:!p-[6px] lg:mr-[2px] hidden"
                    iconType="inboxViewThreedotsFilledIcon"
                  />
                </div>
              </div>
            </div>
            <div className="left inline-flex flex-wrap relative top-[-8px] max-w-[calc(100%_-_400px)] lg:w-[calc(100%_-_108px)] lg:max-w-[calc(100%_-_108px)] lg:top-0">
              <FromToInfoCard
                emailData={emailData}
                currentAccountEmail={emailDetails.email}
              />
            </div>
            <p className="text-[12px] text-[#5F6368] font-biotif__Regular relative top-[2px] pr-[10px] hidden lg:inline-block lg:w-full lg:pr-0 lg:text-[10px]">
              {format(new Date(emailData?.send_date), 'E, MMM yyyy HH:mm a')} (
              {agoTimeShow(emailData?.send_date)})
            </p>
          </div>
          <div className="inline-flex items-center">
            <div
              className="readmore__toggle__btn inline-block relative cursor-pointer left-[10px] top-[-11px] before:content-[''] before:w-[34px] before:h-[16px] before:absolute before:top-[50%] before:left-[50%] before:translate-y-[-50%] before:translate-x-[-50%] before:bg-ipGray__transparentBG before:py-[2px] before:px-[8px] before:rounded-[100px] before:duration-300 hover:before:bg-ip__Grey__hoverDark"
              onClick={() => !isBodyLoading && handleCollapse()}
            >
              <Icon
                className="p-0 relative z-[2] h-[8px] w-[18px]"
                iconType="dots3HorizontalFilledIcon"
              />
            </div>
            {isBodyLoading && (
              <div className="i__ButtonLoader i__ButtonLoader__ForLight !mr-0 !ml-[28px] top-[-11px] p-[6px]" />
            )}
          </div>

          {isShowBody && (
            <div className="sender__contant">
              <div className="!w-full !max-w-full" ref={containerRef} />
            </div>
          )}
          <div className="attachment__view__wrapper mt-[20px]">
            <div className="mx-[-10px] flex flex-wrap">
              {emailAttachments.map((obj, key) => (
                <div
                  className="attachment__col w-[160px] px-[10px] mb-[16px]"
                  key={key}
                >
                  <div className="attachment__col__inner bg-ipGray__transparentBG rounded-[10px] border-[1px] border-[#e4e4e4]">
                    <div className="w-full pt-[100%] relative overflow-hidden group">
                      <div className="absolute top-0 left-0 !w-full !h-full p-[3px] rounded-[6px] overflow-hidden">
                        <div className="w-full h-full relative rounded-[6px] overflow-hidden">
                          <EmailAttachmentRender file={obj} />
                          <div className="overllay flex items-center justify-center absolute bg-black/70 top-0 left-0 w-full h-full opacity-0 pointer-events-none duration-500 group-hover:opacity-100 group-hover:pointer-events-auto">
                            <Icon
                              className="w-[30px] h-[30px] cursor-pointer ml-[2px] rounded-full p-[5px] download-btn duration-500 hover:bg-white/20"
                              iconType="downloadFilledIocn"
                              onClick={async () => {
                                const imgURL = obj?.path;
                                if (imgURL) {
                                  const downloadURL =
                                    await getPresignedImageUrl(imgURL);
                                  downloadAttachmentFile({
                                    url: downloadURL,
                                    fileName: obj.filename,
                                  });
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="details__wrapper bg-ipGray__transparentBG px-[8px] pt-[5px] pb-[3px] rounded-b-[10px]">
                      <span className="file__name inline-block w-full text-[12px] font-biotif__Regular text-black whitespace-pre overflow-hidden text-ellipsis">
                        {obj.filename}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showReplyForm && !emailData.labels.includes(CustomLabel.DRAFT) && (
          <div className="reply-email-wrapper flex flex-wrap items-start px-[12px] mt-[35px] relative z-[0]">
            <div className="profile__img__wrapper w-[52px] h-[52px] rounded-full lg:w-[38px] lg:h-[38px]">
              <div
                className="w-[70px] h-[70px] noName__letter rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--ipOrange__transparentBG)' }}
              >
                <Image
                  imgClassName="w-[52px] h-[52px] absolute top-0 left-[12px] rounded-full object-cover object-center"
                  first_name={emailDetails.email?.split('@')[0] || ''}
                  serverPath
                />
              </div>
            </div>
            <div className="emailReplyForm__wrapper">
              <EmailReply
                setEmailDetails={setEmailDetails}
                setShowReplyForm={setShowReplyForm}
                showReplyForm={showReplyForm}
                emailData={emailData}
                emailDetails={emailDetails}
                setEmailUndoHelperObj={setEmailUndoHelperObj}
                setReplyAttechments={setReplyAttachments}
                setModal={setModal}
                emailUndoHelperObj={emailUndoHelperObj}
                // ** here if reply then send mail only to recipients and reply all then with cc and bcc
                defaultRecipient={emailData.email_recipients?.filter((obj) =>
                  showReplyForm === 'reply' ? obj.field === 'to' : true
                )}
                changeEmailSubject={changeEmailSubject}
                isHideReply

              />
            </div>
          </div>
        )}

        {emailComposeModal && (
          <AddEmailComposerModal
            editEmail={editEmail}
            modalRef={composeModalRef}
            defaultRecipient={getEmailRecipientOptions()}
            providerOption={(mailProviders || []).filter(
              (item) =>
                ((item.value as string).split(',')[0] as string) ===
                emailDetails.email
            )}
            isOpen={emailComposeModal}
            closeModal={() => {
              closeEmailComposeModal();
            }}
            setModal={setModal}
            emailUndoHelperObj={emailUndoHelperObj}
            setEmailUndoHelperObj={setEmailUndoHelperObj}
          />
        )}
        {openLinkListModal && (
          <LinkEntityListModal
            isOpen={openLinkListModal}
            closeModal={() => openLinkListEntityModal(false)}
            email_id={emailData.id}
            openAddLinkEntityModal={openAddLinkEntityModal}
          />
        )}
        {openAddLinkModal && (
          <LinkEntityModal
            isOpen={openAddLinkModal}
            closeModal={() => {
              openAddLinkEntityModal(false);
            }}
            email_id={emailData.id}
          />
        )}
      </div>

      {isVisibleReplyTab && !emailData.labels.includes(CustomLabel.DRAFT) && (
        <>
          <div className="ivb__submit__btns pl-[84px] pt-[36px] lg:pl-0 lg:pt-[25px]">
            <button
              className="replyBtn mr-[12px] inline-flex items-center py-[6px] px-[22px] text-[14px] font-biotif__SemiBold text-primaryColor text-center border border-primaryColor rounded-[6px] duration-500 hover:bg-primaryColor hover:text-[#ffffff] lg:text-[12px] lg:py-[4px] lg:px-[15px] lg:pl-[7px] lg:mr-[7px]"
              onClick={() => setShowReplyForm('reply')}
            >
              <Icon iconType="inboxViewReplyBlueArrowFilled" />
              Reply
            </button>
            {emailRecipients &&
              emailRecipients.length > 1 &&
              !isSameEmailsForCCBcc && (
                <button
                  className="replyAllBtn mr-[12px] inline-flex items-center py-[6px] px-[22px] text-[14px] font-biotif__SemiBold text-primaryColor text-center border border-primaryColor rounded-[6px] duration-500 hover:bg-primaryColor hover:text-[#ffffff] lg:text-[12px] lg:py-[4px] lg:px-[15px] lg:pl-[7px] lg:mr-[7px]"
                  onClick={() => setShowReplyForm('replyAll')}
                >
                  <Icon iconType="inboxViewReplyAllBlueArrowFilled" />
                  Reply All
                </button>
              )}
            <button
              className="forwardBtn mr-[12px] inline-flex items-center py-[6px] px-[22px] text-[14px] font-biotif__SemiBold text-primaryColor text-center border border-primaryColor rounded-[6px] duration-500 hover:bg-primaryColor hover:text-[#ffffff] lg:text-[12px] lg:py-[4px] lg:px-[15px] lg:pl-[7px] lg:mr-0"
              onClick={() => setShowReplyForm('forward')}
            >
              <Icon iconType="inboxViewForwardBlueArrowFilled" />
              Forward
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default EmailBody;
