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
import { Fragment, MutableRefObject, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

// ** components **
import Button from 'components/Button';
import Icon from 'components/Icon';
import ConnectedEmailListDropdown from 'pages/Email/components/ConnectedEmailListDropdown';
import ScheduleMailModal from 'pages/Email/components/Modals/ScheduleMailModal';
import EmailComposeForm from 'pages/Email/components/emailComposer/EmailComposeForm';
import EmailComposerRightSection from 'pages/Email/components/emailComposer/EmailComposerRightSection';
import SendMailDropDown from 'pages/Email/components/emailComposer/SendMailDropDown';
import ToolBarSection from 'pages/Email/components/emailComposer/ToolBarSection';
import ReConnectProvider from 'pages/Setting/email-setting/EmailSetting/ConnectEmail/components/ReConnectProvider';

// ** types **
import { Option } from 'components/FormField/types/formField.types';
import { bulkMailChildModalType } from 'pages/Contact/types/contacts.types';
import {
  MailTokenProvider,
  TokenProvider,
} from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';
import {
  ComposeMailAccountData,
  ComposeMailContactData,
  ComposeMailDealData,
  ComposeMailLeadData,
  EmailComposerFieldType,
  EmailModalType,
  PreventRecipientType,
  ReplyFormType,
  UploadResponseInMail,
} from '../../types/email.type';

// ** services **
import {
  useCheckEmailAuthAPI,
  useReplyMailForGoogle,
  useReplyMailForOutlook,
  useScheduleMailForGoogle,
  useScheduleMailForOutlook,
  useScheduleMailForSmtp,
  useSendMailForOutlook,
  useSendMailForSmtp,
} from 'pages/Email/services/email.service';

// ** hooks **
import { useAttachmentUpload } from 'pages/Email/hooks/useAttachmentUpload';
import { useGetEmailDataAndSetIntoComposeForm } from 'pages/Email/hooks/useEmailService';

// **  Redux **
import {
  getCurrentMailProvider,
  setLoadTimeLines,
} from 'redux/slices/commonSlice';

// ** API **
import { useRemoveEntityFromComposeMaiByIdMutation } from 'redux/api/composeMailConnectEntityApi';
import { useSendMailMutation } from 'redux/api/gmailApi';

// ** validation schema **
import { emailComposerSchema } from '../../validation-schema/emailComposer.schema';

// ** Constant **
import { ModuleNames } from 'constant/permissions.constant';

// ** Helper **
import {
  getProviderConnectionValue,
  getReplyNewSubject,
} from 'pages/Email/helper/email.helper';

// ** Util **
import { dateToMilliseconds } from 'utils/util';
import { TLDs } from 'global-tld-list';

export interface EditEmail {
  emailId: number;
  conversionId: number;
  schedule_time?: string;
  showReplyForm?: ReplyFormType;
  hideSubject?: boolean;
  htmlBody?: string;
  replyAttachments?: UploadResponseInMail[];
}
interface Props {
  editEmail?: EditEmail;
  defaultRecipient?: Option[];
  defaultEmail?: boolean;
  isOpen: boolean;
  closeModal: () => void;
  providerOption: Option[];
  setModal: React.Dispatch<React.SetStateAction<EmailModalType | undefined>>;
  emailUndoHelperObj: {
    id?: number | undefined;
    delay_time: number;
  };
  setEmailUndoHelperObj: React.Dispatch<
    React.SetStateAction<{
      id?: number;
      delay_time: number;
      provider?: MailTokenProvider;
      isScheduled?: string;
      isEdited?: boolean;
    }>
  >;
  connectEntityModelName?: ModuleNames;
  connectEntityModelRecordId?: number;
  modalRef: MutableRefObject<EmailModalType | undefined>;
}

const AddEmailComposerModal = (props: Props) => {
  const {
    closeModal,
    isOpen,
    providerOption,
    setModal,
    emailUndoHelperObj,
    setEmailUndoHelperObj,
    defaultRecipient,
    defaultEmail,
    connectEntityModelName,
    connectEntityModelRecordId,
    editEmail,
    modalRef,
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
      if (!globalEmailTestValidate(emails?.email || emails?.value)) {
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

  const [connectedEntity, setConnectedEntity] = useState<{
    modelName: string | undefined;
    detail: ComposeMailContactData &
      ComposeMailLeadData &
      ComposeMailDealData &
      ComposeMailAccountData;
  }>();

  const [removeEntityFromComposeMaiByIdAPI] =
    useRemoveEntityFromComposeMaiByIdMutation();
  const [selectedProviderOption, setSelectedProvider] = useState<Option>({
    label: '',
    value: '',
  });
  const selectedEmail = (selectedProviderOption?.value as string)?.split(',')[0];
  const selectedProvider = (selectedProviderOption?.value as string)?.split(
    ','
  )[1];
  const [isPreventRecipient, setIsPreventRecipient] =
    useState<PreventRecipientType>({
      cc: false,
      bcc: false,
      to: false,
    });
  const [isSideNavigation, setIsSideNavigation] = useState(false);
  const [defaultRecipientList, setDefaultRecipientList] =
    useState(defaultRecipient);
  const [defaultBCCRecipient, setDefaultBCCRecipient] = useState<Option[]>([]);
  const [defaultCCRecipient, setDefaultCCRecipient] = useState<Option[]>([]);
  const [openModal, setOpenModal] = useState<bulkMailChildModalType>({
    scheduleModal: false,
    reconnectProvider: false,
  });
  const [runSetFieldValueScript, setRunSetFieldValueScript] = useState(1);
  const [isInlineModeOpen, setIsInlineModeOpen] = useState<boolean>(false);
  const [scheduledMailName, setScheduledMailName] = useState<string>('');
  const dispatch = useDispatch();

  const currentMailProvider = useSelector(getCurrentMailProvider);

  //  ** ref
  const editorRef = useRef<RichTextEditorComponent>(null);

  // ** Vars
  const { urlValue, value } = getProviderConnectionValue(
    selectedProvider as TokenProvider
  );

  // ** Custom hooks **
  const [sendGmailAPI, { isLoading: sendGoogleEmailLoading }] =
    useSendMailMutation();
  const { scheduleGmailAPI, isScheduleGmailLoading } =
    useScheduleMailForGoogle();
  const { sendOutlookAPI, isLoading: sendOutlookEmailLoading } =
    useSendMailForOutlook();
  const { scheduleOutlookAPI, isScheduleOutLookMailLoading } =
    useScheduleMailForOutlook();
  const { sendSmtpAPI, isLoading: sendSmtpEmailLoading } = useSendMailForSmtp();
  const { scheduleSmtpAPI, isScheduleSmtpLoading } = useScheduleMailForSmtp();
  const { checkEmailAuthAPI, isLoading: checkAuthLoading } =
    useCheckEmailAuthAPI();

  const { replyOutlookAPI, isReplyOutlookLoading } = useReplyMailForOutlook();
  const { replyGmailAPI, isReplyGmailLoading } = useReplyMailForGoogle();

  const {
    attachmentUpload,
    loadingFiles,
    removeAttachment,
    removeSizeAttachment,
    uploadFileData,
    setUploadFileData,
  } = useAttachmentUpload({
    clearErrors,
    folderName: selectedProvider,
    setError,
  });

  const {
    getEmailDataAndSetIntoComposeForm,
    emailDetailLoading,
    emailDetails,
  } = useGetEmailDataAndSetIntoComposeForm({
    reset,
    setDefaultRecipientList,
    setDefaultBCCRecipient,
    setDefaultCCRecipient,
    setUploadFileData,
  });

  // initial load set default provider
  useEffect(() => {
    if (
      currentMailProvider === undefined ||
      currentMailProvider.label === 'All'
    ) {
      setSelectedProvider(providerOption[0]);
    } else {
      setSelectedProvider(currentMailProvider);
    }
  }, [providerOption, currentMailProvider]);
  // set focus when body required error
  useEffect(() => {
    if (Object.keys(errors).length === 1 && errors.html?.message) {
      const anchor = document.querySelector('#email-compose-body-error');
      anchor?.scrollIntoView();
    }
  }, [errors]);

  useEffect(() => {
    if (!editEmail) {
      const hours = new Date().getHours();
      const mins = new Date().getMinutes();
      reset({
        schedule_date: format(new Date(), 'dd, MMM yyyy'),
        schedule_time: `${hours}:${mins}`,
        ...(defaultRecipient && {
          to: defaultRecipient,
        }),
      });
    } else {
      getEmailDataAndSetIntoComposeForm(editEmail);
    }
  }, [editEmail]);

  useEffect(() => {
    if (defaultRecipientList && defaultRecipientList.length > 0 && !editEmail) {
      setValue('to', [...defaultRecipientList]);
    }
  }, [defaultRecipientList]);

  const setRecipientList = (list: Option[] | undefined) => {
    return list?.map((bccObj) => bccObj?.email || bccObj?.label);
  };

  const onSubmit = handleSubmit(async (values: EmailComposerFieldType) => {
    const valid = checkValidEmails();
    if (!valid?.includes(false)) {
      const { data: providerData } = await checkEmailAuthAPI({
        provider_name: selectedProvider,
        email: selectedEmail,
      });

      if (providerData?.is_active === false) {
        setOpenModal((prev) => ({ ...prev, reconnectProvider: true }));
      } else if (providerData?.is_active === true) {
        const { bcc, subject, scheduled_after, to, cc } = values;
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
        const updatedUploadFileData =
          uploadFileData &&
          uploadFileData.map((item: UploadResponseInMail) => {
            return {
              path: item.path,
              contentType: item.mimetype,
              filename: item.originalname,
            };
          });

        const bodyObj = {
          emailId: editEmail?.emailId,
          conversionId: editEmail?.conversionId,
          bcc: setRecipientList(bcc),
          to: setRecipientList(to),
          cc: setRecipientList(cc),
          html,
          subject,
          scheduled_after: scheduledAfter,
          from: selectedEmail,
          email: selectedEmail,
          attachments:
            updatedUploadFileData.length > 0 ? updatedUploadFileData : null,
          connectEntityModelName: connectedEntity?.modelName,
          connectEntityModelRecordId: connectedEntity?.detail?.id,
        };

        const newSubject = getReplyNewSubject(
          editEmail?.showReplyForm,
          emailDetails?.messages?.[0].subject
        );
        if (
          editEmail?.showReplyForm &&
          newSubject === subject &&
          !bodyObj.scheduled_after
        ) {
          delete bodyObj.emailId;
          delete bodyObj.conversionId;
          if (selectedProvider === TokenProvider.GOOGLE_MAIL) {
            const { data, error } = await replyGmailAPI({
              ...bodyObj,
              threadId: emailDetails?.provider_conversion_id,
              email_conversion_id: editEmail.conversionId,
              inReplyToMailId: editEmail.emailId,
            });
            if (data && !error) {
              const { mailDetails } = data;

              dispatch(setLoadTimeLines({ timeline: false }));
              setEmailUndoHelperObj({
                ...emailUndoHelperObj,
                id: mailDetails?.id,
                provider: MailTokenProvider.GMAIL,
                isScheduled: 'send',
                isEdited: !!editEmail?.emailId,
              });
              close();
              setModal('undo_modal');
              setTimeout(() => {
                setModal(
                  modalRef.current && modalRef.current !== 'undo_modal'
                    ? modalRef.current
                    : undefined
                );
              }, emailUndoHelperObj.delay_time * 1000);
            }
          }
          if (selectedProvider === TokenProvider.OUTLOOK) {
            const { data, error } = await replyOutlookAPI({
              ...bodyObj,
              replyType: editEmail?.showReplyForm,
              email_conversion_id: editEmail.conversionId,
              inReplyToMailId: editEmail.emailId,
            });
            if (data && !error) {
              const { mailDetails } = data;

              dispatch(setLoadTimeLines({ timeline: false }));
              setEmailUndoHelperObj({
                ...emailUndoHelperObj,
                id: mailDetails?.id,
                provider: MailTokenProvider.OUTLOOK,
                isScheduled: 'send',
                isEdited: !!editEmail?.emailId,
              });
              close();
              setModal('undo_modal');
              setTimeout(() => {
                setModal(
                  modalRef.current && modalRef.current !== 'undo_modal'
                    ? modalRef.current
                    : undefined
                );
              }, emailUndoHelperObj.delay_time * 1000);
            }
          }
        } else {
          if (editEmail?.showReplyForm) {
            delete bodyObj.emailId;
            delete bodyObj.conversionId;
          }
          if (selectedProvider === TokenProvider.GOOGLE_MAIL) {
            const data = bodyObj.scheduled_after
              ? await scheduleGmailAPI({ data: bodyObj })
              : await sendGmailAPI({ data: bodyObj });
            if ('data' in data) {
              dispatch(setLoadTimeLines({ timeline: true }));
              setEmailUndoHelperObj({
                ...emailUndoHelperObj,
                id: bodyObj.scheduled_after
                  ? data?.data?.scheduled_mail_id
                  : data?.data.messages?.[0]?.id || data.data.mail_id,
                provider: MailTokenProvider.GMAIL,
                isScheduled: bodyObj.scheduled_after ? 'scheduled' : 'send',
                isEdited: !!editEmail?.emailId,
              });
              close();
              setModal('undo_modal');
              setTimeout(() => {
                setModal(
                  modalRef.current && modalRef.current !== 'undo_modal'
                    ? modalRef.current
                    : undefined
                );
              }, emailUndoHelperObj.delay_time * 1000);
            }
          }

          if (selectedProvider === TokenProvider.OUTLOOK) {
            const { data, error } = bodyObj.scheduled_after
              ? await scheduleOutlookAPI(bodyObj)
              : await sendOutlookAPI(bodyObj);

            if (data && !error) {
              dispatch(setLoadTimeLines({ timeline: true }));
              setEmailUndoHelperObj({
                ...emailUndoHelperObj,
                id: data?.messages?.[0]?.id || data.mail_id,
                provider: MailTokenProvider.OUTLOOK,
                isScheduled: bodyObj.scheduled_after ? 'scheduled' : 'send',
                isEdited: !!editEmail?.emailId,
              });
              close();
              setModal('undo_modal');
              setTimeout(() => {
                setModal(
                  modalRef.current && modalRef.current !== 'undo_modal'
                    ? modalRef.current
                    : undefined
                );
              }, emailUndoHelperObj.delay_time * 1000);
            }
          }

          if (selectedProvider === TokenProvider.SMTP) {
            const { data, error } = bodyObj.scheduled_after
              ? await scheduleSmtpAPI(bodyObj)
              : await sendSmtpAPI(bodyObj);

            if (data && !error) {
              dispatch(setLoadTimeLines({ timeline: true }));
              setEmailUndoHelperObj({
                ...emailUndoHelperObj,
                id: data?.messages?.[0]?.id || data.mail_id,
                provider: MailTokenProvider.SMTP,
                isScheduled: bodyObj.scheduled_after ? 'scheduled' : 'send',
                isEdited: !!editEmail?.emailId,
              });
              close();
              setModal('undo_modal');
              setTimeout(() => {
                setModal(
                  modalRef.current && modalRef.current !== 'undo_modal'
                    ? modalRef.current
                    : undefined
                );
              }, emailUndoHelperObj.delay_time * 1000);
            }
          }
        }
      }
    }
  });

  const close = () => {
    if (connectedEntity?.detail?.id) {
      removeEntityFromComposeMaiByIdAPI({});
      setConnectedEntity(undefined);
    }
    reset();
    closeModal();
  };

  const isMailLoading =
    sendGoogleEmailLoading ||
    sendOutlookEmailLoading ||
    sendSmtpEmailLoading ||
    isScheduleGmailLoading ||
    isScheduleOutLookMailLoading ||
    isScheduleSmtpLoading ||
    checkAuthLoading ||
    isReplyGmailLoading ||
    isReplyOutlookLoading;

  return isOpen ? (
    <>
      {createPortal(
        <div
          className={`ip__Modal__Wrapper composeMail__modal  ${
            !isOpen ? 'hidden' : ''
          }`}
        >
          <div className="ip__Modal__Overlay" onClick={close} />
          <div className="ip__Modal__ContentWrap" style={{ width: '1082px' }}>
            <div className="modalAction__btn inline-flex flex-wrap items-center">
              <button className="hidden items-center justify-center w-[30px] h-[30px] rounded-full duration-500 hover:bg-[#ffffff] mr-[3px]">
                <span className="inline-block w-[10px] h-[2px] bg-black" />
              </button>
              <Icon iconType="closeBtnFilled" onClick={close} />
            </div>
            <div className="ip__Modal__Header !py-[16px] !pr-[330px] md:!pr-[86px]">
              <h3 className="title !text-[18px] !w-full">New Message</h3>
            </div>
            <div className="ip__Modal__Body ip__FancyScroll !p-[20px] !pb-0 !pr-[330px]">
              {emailDetailLoading ? (
                <h1>Loading</h1>
              ) : (
                <>
                  <div className="left">
                    <div className="flex flex-wrap items-center justify-between">
                      <div className="max-w-full md:max-w-[calc(100%_-_52px)]">
                        <ConnectedEmailListDropdown
                          options={providerOption}
                          selectedValue={selectedProviderOption}
                          setSelectedProvider={setSelectedProvider}
                        />
                      </div>
                      {editEmail?.schedule_time ? (
                        <div className="inline-flex justify-end flex-wrap">
                          <div className="text-primaryColor font-biotif__SemiBold text-[14px] inline-block w-full text-right">
                            Scheduled Time:
                          </div>
                          <div className="text-black font-biotif__SemiBold text-[14px] inline-block w-full text-right">
                            {format(
                              new Date(editEmail?.schedule_time),
                              'E, MMM dd, yyyy KK:mm a'
                            )}
                          </div>
                        </div>
                      ) : null}
                      <button
                        className="mobile__viewBtn mb-[7px] ml-[10px] hidden md:block"
                        onClick={() => setIsSideNavigation(true)}
                      >
                        <Icon
                          className="w-[41px] h-[41px] rounded-[10px] bg-[#ECF2F6] p-[9px] duration-500 hover:bg-primaryColor"
                          iconType="linkLeadDealFilledIcon"
                        />
                      </button>
                    </div>
                    <form onSubmit={onSubmit}>
                      <EmailComposeForm
                        isPreventRecipient={isPreventRecipient}
                        setIsPreventRecipient={setIsPreventRecipient}
                        setRunSetFieldValueScript={setRunSetFieldValueScript}
                        defaultRecipient={defaultRecipientList}
                        defaultBCCRecipient={defaultBCCRecipient}
                        defaultCCRecipient={defaultCCRecipient}
                        setValue={setValue}
                        setUploadFileData={setUploadFileData}
                        editorRef={editorRef}
                        register={register}
                        control={control}
                        errors={errors}
                        hideSubject={editEmail?.hideSubject}
                        {...{ isInlineModeOpen, setIsInlineModeOpen }}
                      />
                      <div className="bg-[#ECF2F6] rounded-b-[12px] px-[16px] pr-[10px] py-[12px] pt-[30px] mt-[-10px] relative z-[2]">
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
                        {uploadFileData?.map(
                          (item: UploadResponseInMail, index: number) => {
                            return (
                              <Fragment key={index}>
                                <div className="attachments__box">
                                  <div className="attachments__details !w-[calc(100%_-_130px)] sm:!w-[calc(100%_-_114px)]">
                                    <Icon iconType="imageIconFilledPrimaryColor" />
                                    <span className="attachments__name ellipsis__2">{`${item?.originalname}`}</span>
                                  </div>
                                  {item.size && (
                                    <div className="attachments__size !w-[100px] sm:!w-[90px]">{`${
                                      item.size / 1000
                                    }k`}</div>
                                  )}
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
                        <p className="ip__Error">
                          {errors?.attachments.message}
                        </p>
                      )}
                      {errors && (
                        <p className="ip__Error" id="email-compose-body-error">
                          {errors?.html?.message}
                        </p>
                      )}
                    </form>
                  </div>
                  <EmailComposerRightSection
                    connectedEntity={connectedEntity}
                    setConnectedEntity={setConnectedEntity}
                    isSideNavigation={isSideNavigation}
                    setIsSideNavigation={setIsSideNavigation}
                    setDefaultRecipientList={setDefaultRecipientList}
                    defaultEmail={defaultEmail}
                    control={control}
                    setValue={setValue}
                    runSetFieldValueScript={runSetFieldValueScript}
                    connectEntityModelName={connectEntityModelName}
                    connectEntityModelRecordId={connectEntityModelRecordId}
                  />
                </>
              )}
            </div>
            <div className="ip__Modal__Footer !justify-between items-center !border-t-0 !pb-[15px] !pt-[25px] !pr-[330px]">
              <ToolBarSection
                attachmentUpload={attachmentUpload}
                editorRef={editorRef}
                {...{ isInlineModeOpen, setIsInlineModeOpen }}
              />
              <div className="right inline-flex items-center mb-[10px] lg:w-full lg:justify-end sm:mb-0">
                <Button
                  className="secondary__Btn min-w-[100px] !mr-[10px] sm:w-[calc(50%_-_26px)]"
                  onClick={close}
                >
                  Discard
                </Button>

                <Button
                  type="button"
                  isDisabled={loadingFiles > 0}
                  className="primary__Btn min-w-[100px] !mr-[5px] sm:!mr-[10px] sm:w-[calc(50%_-_26px)]"
                  onClick={(val) =>
                    Object.values(isPreventRecipient).find((e) => e)
                      ? setOpenModal((prev) => ({
                          ...prev,
                          warningModal: true,
                        }))
                      : onSubmit(val)
                  }
                  isLoading={isMailLoading}
                >
                  {editEmail?.emailId ? 'Send Now' : 'Send'}
                </Button>
                <SendMailDropDown
                  editEmail={editEmail}
                  htmlContent={htmlContent}
                  recipient={recipient}
                  setOpenModal={setOpenModal}
                />
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
      {openModal.scheduleModal && (
        <ScheduleMailModal
          editScheduleTime={
            !editEmail?.showReplyForm && emailDetails
              ? new Date(
                  emailDetails.messages?.[0].schedule_mail.delay_date_time
                )
              : undefined
          }
          watch={watch}
          errors={errors}
          control={control}
          register={register}
          setValue={setValue}
          setError={setError}
          onSubmit={onSubmit}
          resetField={resetField}
          clearErrors={clearErrors}
          isLoading={isMailLoading}
          isOpen={openModal.scheduleModal}
          scheduledMailName={scheduledMailName}
          setScheduledMailName={setScheduledMailName}
          closeModal={() => setOpenModal({ scheduleModal: false })}
        />
      )}
      {openModal.reconnectProvider && urlValue && value && (
        <ReConnectProvider
          provider={{
            email: selectedEmail,
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
  ) : (
    <></>
  );
};

export default AddEmailComposerModal;
