// ** import packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { RichTextEditorComponent } from '@syncfusion/ej2-react-richtexteditor';
import {
  addDays,
  addHours,
  nextMonday,
  setHours,
  setMinutes,
  startOfTomorrow,
} from 'date-fns';
import { format } from 'date-fns-tz';
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';

// ** components **
import Button from 'components/Button';
import Icon from 'components/Icon';
import ScheduleMailModal from 'pages/Email/components/Modals/ScheduleMailModal';
import ToolBarSection from 'pages/Email/components/emailComposer/ToolBarSection';
import ReConnectProvider from 'pages/Setting/email-setting/EmailSetting/ConnectEmail/components/ReConnectProvider';
import { EditEmail } from './emailComposer/AddEmailComposerModal';
import EmailReplyForm from './emailComposer/EmailReplyForm';
import SendMailDropDown from './emailComposer/SendMailDropDown';

// ** types **
import { TimelineType } from 'components/EntityDetails/Timeline/types';
import { Option } from 'components/FormField/types/formField.types';
import { bulkMailChildModalType } from 'pages/Contact/types/contacts.types';
import {
  EmailComposerFieldType,
  EmailDetail,
  EmailFileType,
  EmailModalType,
  EmailRecipient,
  EmailThreadDetail,
  PreventRecipientType,
  ReplyFormType,
  UploadResponseInMail,
} from 'pages/Email/types/email.type';
import {
  MailTokenProvider,
  TokenProvider,
} from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';

// ** services **
import {
  useCheckEmailAuthAPI,
  useReplyMailForGoogle,
  useReplyMailForOutlook,
  useReplyMailForSmtp,
} from 'pages/Email/services/email.service';

// ** hooks **
import { useAttachmentUpload } from 'pages/Email/hooks/useAttachmentUpload';

// ** validation schema **
import { emailComposerSchema } from 'pages/Email/validation-schema/emailComposer.schema';

// ** Helper **
import {
  contentIdReplaceWithSrc,
  getMailRecipientsForReply,
  getProviderConnectionValue,
  getReplyNewSubject,
} from '../helper/email.helper';
import {
  getEmptyTemplate,
  getForwardBodyTemplate,
} from '../helper/emailTemplate';

// ** Util **
import { dateToMilliseconds } from 'utils/util';
import { TLDs } from 'global-tld-list';

interface Props {
  defaultRecipient?: EmailRecipient[];
  setModal: React.Dispatch<React.SetStateAction<EmailModalType | undefined>>;
  emailUndoHelperObj: {
    id?: number;
    delay_time: number;
  };

  setEmailUndoHelperObj: React.Dispatch<
    React.SetStateAction<{
      id?: number;
      delay_time: number;
      provider?: MailTokenProvider;
      isScheduled?: string;
    }>
  >;
  emailDetails?: EmailThreadDetail;
  emailData?: EmailDetail;
  setShowReplyForm: Dispatch<SetStateAction<ReplyFormType>>;
  setEmailDetails?: Dispatch<
    React.SetStateAction<EmailThreadDetail | undefined>
  >;
  setReplyAttechments?: Dispatch<React.SetStateAction<UploadResponseInMail[]>>;
  closeReplyModal?: (timeLineEmailData?: TimelineType) => void;
  model_name?: string;
  model_record_id?: number;
  showReplyForm?: ReplyFormType;
  changeEmailSubject?: (email: EditEmail) => void;
  isHideReply: boolean;
}

const EmailReply = (props: Props) => {
  const {
    setModal,
    emailUndoHelperObj,
    setEmailUndoHelperObj,
    defaultRecipient = [],
    emailDetails,
    emailData,
    setShowReplyForm,
    setEmailDetails,
    closeReplyModal,
    model_name,
    model_record_id,
    showReplyForm,
    changeEmailSubject,
    setReplyAttechments: setReplyAttachments,
    isHideReply,
  } = props;
  // ** Hooks
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control,
    setError,
    clearErrors,
    watch,
    setValue,
    resetField,
  } = useForm<EmailComposerFieldType>({
    resolver: yupResolver(emailComposerSchema),
  });

  const htmlContent = watch('html');
  const recipient = watch('to');
  const mainMail = emailDetails?.messages[0];

  // ** states **
  const [isPreventRecipient, setIsPreventRecipient] =
    useState<PreventRecipientType>({
      cc: false,
      bcc: false,
      to: false,
    });
  const [openModal, setOpenModal] = useState<bulkMailChildModalType>({
    scheduleModal: false,
  });

  const [email_attachments, setEmailAttachments] = useState<EmailFileType[]>(
    []
  );
  const [scheduledMailName, setScheduledMailName] = useState<string>('');
  const [isInlineModeOpen, setIsInlineModeOpen] = useState<boolean>(false);

  //  ** ref
  const editorRef = useRef<RichTextEditorComponent>(null);

  // ** Vars
  const { urlValue, value } = getProviderConnectionValue(
    emailDetails?.provider as unknown as TokenProvider
  );

  // ** Custom hooks **
  const { replyOutlookAPI, isReplyOutlookLoading } = useReplyMailForOutlook();
  const { replySmtpAPI, isReplySmtpLoading } = useReplyMailForSmtp();
  const { replyGmailAPI, isReplyGmailLoading } = useReplyMailForGoogle();
  const { checkEmailAuthAPI, isLoading: checkAuthLoading } =
    useCheckEmailAuthAPI();

  const isMailLoading =
    isReplySmtpLoading ||
    isReplyOutlookLoading ||
    isReplyGmailLoading ||
    checkAuthLoading;

  const {
    attachmentUpload,
    loadingFiles,
    removeAttachment,
    removeSizeAttachment,
    uploadFileData,
    setUploadFileData,
  } = useAttachmentUpload({
    clearErrors,
    folderName: emailDetails?.provider,
    setError,
  });

  // eslint-disable-next-line prefer-const
  const { defaultBCCRecipient, defaultCCRecipient, defaultToRecipient } =
    getMailRecipientsForReply({
      emailRecipient: emailData?.email_recipients,
      from_email_address: emailData?.from_email_address,
      currentAccountEmail: emailDetails?.email,
    });

  const globalEmailTestValidate = (v: string | null | undefined) => {
    const tld = (v || '').split('.').slice(-1)[0];
    const isValidTLDs = TLDs.indexOf(tld) >= 0;
    if (!isValidTLDs) {
      return false;
    }
    return true;
  };
  const checkValidEmails = () => {
    const isValid = recipient?.map((emails: any) => {
      if (!globalEmailTestValidate(emails?.value)) {
        setError('to', { message: 'Please Enter Valid Email' });
        return false;
      }
      return true;
    });
    return isValid;
  };

  useEffect(() => {
    checkValidEmails();
  }, [recipient]);

  useEffect(() => {
    setHtmlContent();
  }, [emailData, showReplyForm]);

  useEffect(() => {
    if (setReplyAttachments) {
      setReplyAttachments(uploadFileData);
    }
  }, [uploadFileData]);

  // set focus when body required error
  useEffect(() => {
    if (Object.keys(errors).length === 1 && errors.html?.message) {
      const anchor = document.querySelector('#email-compose-body-error');
      anchor?.scrollIntoView();
    }
  }, [errors]);

  useEffect(() => {
    const hours = new Date().getHours();
    const mins = new Date().getMinutes();
    reset({
      schedule_date: format(new Date(), 'dd, MMM yyyy'),
      schedule_time: `${hours}:${mins}`,
      to: showReplyForm !== 'forward' ? defaultToRecipient : [],
      cc: defaultCCRecipient,
      bcc: defaultBCCRecipient,
    });
  }, []);

  const setHtmlContent = async () => {
    if (emailData && editorRef.current && showReplyForm === 'forward') {
      if (emailData.email_attachments?.length) {
        const { html, attachments } = await contentIdReplaceWithSrc({
          emailAttachments: emailData.email_attachments,
          html: emailData.html,
        });
        setEmailAttachments(attachments);
        emailData.html = html;
      }

      editorRef.current.valueTemplate = getForwardBodyTemplate(emailData);
      setValue('html', getForwardBodyTemplate(emailData));
    } else if (
      emailData &&
      editorRef.current &&
      (showReplyForm === 'reply' || showReplyForm === 'replyAll')
    ) {
      setEmailAttachments([]);
      editorRef.current.valueTemplate = getEmptyTemplate();
      setValue('html', getEmptyTemplate());
    }
  };

  const setRecipientList = (list: Option[] | undefined) => {
    return list?.map((bccObj) => bccObj?.email || bccObj?.label);
  };

  const onSubmit = handleSubmit(async (values: EmailComposerFieldType) => {
    const valid = checkValidEmails();
    if (!valid?.includes(false)) {
      const { data: providerData } = await checkEmailAuthAPI({
        provider_name: emailDetails?.provider,
        email: emailDetails?.email,
      });

      if (providerData?.is_active === false) {
        setOpenModal((prev) => ({ ...prev, reconnectProvider: true }));
      } else {
        const { bcc, scheduled_after, to, cc } = values;

        let scheduledAfter = scheduled_after;

        switch (scheduledMailName) {
          case 'hours1':
            scheduledAfter = dateToMilliseconds({
              endDate: addHours(new Date(), 1),
            });
            break;
          case 'hours2':
            scheduledAfter = dateToMilliseconds({
              endDate: addHours(new Date(), 2),
            });
            break;
          case 'hours4':
            scheduledAfter = dateToMilliseconds({
              endDate: addHours(new Date(), 4),
            });
            break;
          case 'tomorrow_morning':
            scheduledAfter = dateToMilliseconds({
              endDate: setHours(setMinutes(addDays(new Date(), 1), 0), 8),
            });
            break;
          case 'tomorrow_afternoon':
            scheduledAfter = dateToMilliseconds({
              endDate: setHours(startOfTomorrow(), 13),
            });
            break;
          case 'monday_morning':
            scheduledAfter = dateToMilliseconds({
              endDate: setHours(setMinutes(nextMonday(new Date()), 0), 8),
            });
            break;
          default:
            break;
        }

        const editorFormFields = document.getElementsByClassName(
          'templateInput__field'
        );

        // remove unwanted style from input element
        [...Array(editorFormFields.length)].forEach((_, index) => {
          const field = editorFormFields[index] as HTMLInputElement;
          field.removeAttribute('style');
        });

        let html = document.getElementById(
          'inlineRTE_rte-edit-view'
        )?.innerHTML;

        [...Array(editorFormFields.length)].forEach((_, index) => {
          const field = editorFormFields[index] as HTMLInputElement;
          html = html?.replaceAll(
            `<input class="${field?.classList?.value}" id="${field.id}" placeholder="${field.placeholder}">`,
            field.value ? `${field.value}` : ''
          );
        });

        let updatedUploadFileData =
          uploadFileData &&
          uploadFileData.map((item: UploadResponseInMail) => {
            return {
              path: item.path,
              contentType: item.mimetype,
              filename: item.originalname,
            };
          });
        if (email_attachments && email_attachments.length) {
          const savedAttechment = email_attachments.map(
            (item: EmailFileType) => {
              return {
                path: item.path,
                contentType: item.contentType,
                filename: item.filename,
              };
            }
          );
          updatedUploadFileData = [
            ...updatedUploadFileData,
            ...savedAttechment,
          ];
        }
        const newSubject = getReplyNewSubject(showReplyForm, mainMail?.subject);
        const bodyObj = {
          bcc: setRecipientList(bcc),
          to: setRecipientList(to),
          cc: setRecipientList(cc),
          html,
          subject: newSubject,
          scheduled_after: scheduledAfter,
          from: emailDetails?.email,
          email: emailDetails?.email,
          email_conversion_id: emailData?.email_conversion_id,
          attachments:
            updatedUploadFileData.length > 0 ? updatedUploadFileData : null,
          inReplyToMailId: emailData?.id,
          ...(model_record_id &&
            model_name && {
              model_record_id,
              model_name,
            }),
        };
        sendProviderMail(bodyObj);
      }
    }
  });

  const sendProviderMail = async (bodyObj: any) => {
    if (emailDetails?.provider === MailTokenProvider.GMAIL) {
      const { data, error } = await replyGmailAPI({
        ...bodyObj,
        threadId: emailDetails?.provider_conversion_id,
      });
      if (data && !error) {
        const { mailDetails, timeLineEmailData } = data;

        setEmailDetails?.(
          (prev) =>
            prev && {
              ...prev,
              messages: [
                ...prev.messages,
                { ...mailDetails, initialBodyLoad: true },
              ],
            }
        );
        setEmailUndoHelperObj({
          ...emailUndoHelperObj,
          id: mailDetails.id,
          provider: MailTokenProvider.GMAIL,
          isScheduled: 'send',
        });
        setModal('undo_modal');
        setTimeout(() => {
          setModal(undefined);
        }, emailUndoHelperObj.delay_time * 1000);

        setShowReplyForm(undefined);
        closeReplyModal?.(timeLineEmailData);
      }
    }

    if (emailDetails?.provider === MailTokenProvider.OUTLOOK) {
      const { data, error } = await replyOutlookAPI({
        ...bodyObj,
        replyType: showReplyForm,
      });
      const { mailDetails, timeLineEmailData } = data;

      if (mailDetails && !error) {
        setEmailDetails?.(
          (prev) =>
            prev && {
              ...prev,
              messages: [
                ...prev.messages,
                { ...mailDetails, initialBodyLoad: true },
              ],
            }
        );
        setEmailUndoHelperObj({
          ...emailUndoHelperObj,
          id: mailDetails.id,
          provider: MailTokenProvider.OUTLOOK,
          isScheduled: 'send',
        });
        setModal('undo_modal');
        setTimeout(() => {
          setModal(undefined);
        }, emailUndoHelperObj.delay_time * 1000);
        setShowReplyForm(undefined);
        closeReplyModal?.(timeLineEmailData);
      }
    }

    if (emailDetails?.provider === MailTokenProvider.SMTP) {
      const { data, error } = await replySmtpAPI(bodyObj);
      const { mailDetails, timeLineEmailData } = data;

      if (mailDetails && !error) {
        setEmailDetails?.(
          (prev) =>
            prev && {
              ...prev,
              messages: [
                ...prev.messages,
                { ...mailDetails, initialBodyLoad: true },
              ],
            }
        );
        setEmailUndoHelperObj({
          ...emailUndoHelperObj,
          id: mailDetails.id,
          provider: MailTokenProvider.SMTP,
          isScheduled: 'send',
        });
        setModal('undo_modal');
        setTimeout(() => {
          setModal(undefined);
        }, emailUndoHelperObj.delay_time * 1000);
        setShowReplyForm(undefined);
        closeReplyModal?.(timeLineEmailData);
      }
    }
  };

  const removeEmailAttachment = (index: number) => {
    if (index >= 0) {
      const arr = [...email_attachments];
      arr.splice(index, 1);
      setEmailAttachments(arr);
    }
  };

  return (
    <>
      <div className="composeMail__modal border-[1px] border-[#CCCCCC]/30 rounded-[10px] p-[15px] pb-0 sm:p-[10px] sm:pt-[5px] sm:pb-[5px]">
        <div className="composeMail__modal__contant__body ip__FancyScroll">
          <div className="left">
            <form onSubmit={onSubmit}>
              <EmailReplyForm
                setShowReplyForm={setShowReplyForm}
                isPreventRecipient={isPreventRecipient}
                setIsPreventRecipient={setIsPreventRecipient}
                defaultRecipient={defaultRecipient}
                setValue={setValue}
                emailData={emailData}
                setUploadFileData={setUploadFileData}
                editorRef={editorRef}
                control={control}
                errors={errors}
                currentAccountEmail={emailDetails?.email}
                {...{ isInlineModeOpen, setIsInlineModeOpen }}
                showReplyForm={showReplyForm}
                changeEmailSubject={changeEmailSubject}
                isHideReply={isHideReply}
              />
              <div className="rounded-b-[12px] relative z-[2]">
                {loadingFiles ? (
                  [...Array(loadingFiles)].map((_, index) => (
                    <Fragment key={index}>
                      <div className="attachments__box">
                        <div className="attachments__details !w-[calc(100%_-_100px)] sm:!w-[calc(100%_-_90px)]">
                          <div className="i__Icon !top-0 p-0">
                            <div className="skeletonBox w-full h-full rounded-full" />
                          </div>
                          <div className="attachments__name ellipsis__2 !pl-[12px]">
                            <div className="skeletonBox w-full" />
                          </div>
                        </div>
                        <div className="attachments__size !w-[100px] sm:!w-[90px]">
                          <div className="skeletonBox w-full" />
                        </div>
                      </div>
                    </Fragment>
                  ))
                ) : (
                  <></>
                )}
                {email_attachments.map((item: EmailFileType, index: number) => {
                  return (
                    <Fragment key={index}>
                      <div className="attachments__box">
                        <div className="attachments__details !w-[calc(100%_-_130px)] sm:!w-[calc(100%_-_114px)]">
                          <Icon iconType="imageIconFilledPrimaryColor" />
                          <span className="attachments__name ellipsis__2">{`${item?.filename}`}</span>
                        </div>
                        <div className="attachments__size !w-[100px] sm:!w-[90px]" />

                        <div
                          className="attachment__close__btn hover:!bg-white relative top-[-2px]"
                          onClick={() => {
                            removeEmailAttachment(index);
                          }}
                        >
                          <Icon iconType="closeBtnFilled" />
                        </div>
                      </div>
                    </Fragment>
                  );
                })}
                {uploadFileData.map(
                  (item: UploadResponseInMail, index: number) => {
                    return (
                      <Fragment key={index}>
                        <div className="attachments__box">
                          <div className="attachments__details !w-[calc(100%_-_130px)] sm:!w-[calc(100%_-_114px)]">
                            <Icon iconType="imageIconFilledPrimaryColor" />
                            <span className="attachments__name ellipsis__2">{`${item?.originalname}`}</span>
                          </div>
                          <div className="attachments__size !w-[100px] sm:!w-[90px]">{`${
                            item.size / 1000
                          }k`}</div>
                          <div
                            className="attachment__close__btn hover:!bg-white relative top-[-2px]"
                            onClick={() => {
                              removeSizeAttachment(index);
                              removeAttachment(index);
                            }}
                          >
                            <Icon iconType="closeBtnFilled" />
                          </div>
                        </div>
                      </Fragment>
                    );
                  }
                )}
              </div>

              {errors?.attachments && (
                <p className="ip__Error">{errors?.attachments.message}</p>
              )}
              {errors && (
                <p className="ip__Error" id="email-compose-body-error">
                  {errors?.html?.message}
                </p>
              )}
            </form>
          </div>
        </div>
        <div className="ip__Modal__Footer flex flex-wrap !justify-between items-center !border-t-0 !pb-[15px] !pt-[15px] lg:!pb-[5px]">
          <ToolBarSection
            attachmentUpload={attachmentUpload}
            editorRef={editorRef}
            {...{ isInlineModeOpen, setIsInlineModeOpen }}
          />
          <div className="right inline-flex items-center lg:w-auto lg:ml-auto lg:justify-end lg:mb-[10px]">
            <Button
              className="secondary__Btn min-w-[100px] !mr-[10px] sm:w-[calc(50%_-_26px)]"
              onClick={() => {
                setShowReplyForm(undefined);
                closeReplyModal?.();
              }}
            >
              Discard
            </Button>
            <Button
              isDisabled={loadingFiles > 0}
              className="primary__Btn min-w-[100px] !mr-[5px] sm:!mr-[10px] sm:w-[calc(50%_-_26px)]"
              onClick={(val) => onSubmit(val)}
              isLoading={isMailLoading}
            >
              Send
            </Button>
            <SendMailDropDown
              htmlContent={htmlContent}
              recipient={recipient}
              setOpenModal={setOpenModal}
            />
          </div>
        </div>
      </div>

      {openModal.scheduleModal && (
        <ScheduleMailModal
          watch={watch}
          errors={errors}
          control={control}
          onSubmit={onSubmit}
          register={register}
          setValue={setValue}
          setError={setError}
          resetField={resetField}
          clearErrors={clearErrors}
          isLoading={isMailLoading}
          isOpen={openModal.scheduleModal}
          scheduledMailName={scheduledMailName}
          setScheduledMailName={setScheduledMailName}
          closeModal={() => setOpenModal({ scheduleModal: false })}
        />
      )}

      {openModal.reconnectProvider &&
        urlValue &&
        value &&
        emailDetails?.email && (
          <ReConnectProvider
            provider={{
              email: emailDetails?.email,
              urlValue,
              value,
            }}
            isOpen={openModal.reconnectProvider}
            closeModal={() => {
              setOpenModal((prev) => ({ ...prev, reconnectProvider: false }));
            }}
            setModal={setModal}
          />
        )}
    </>
  );
};

export default EmailReply;
