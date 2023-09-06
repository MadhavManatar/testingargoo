// ** Import packages **
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
import { Fragment, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';

// ** Components **
import Button from 'components/Button';
import Icon from 'components/Icon';
import ConnectedEmailListDropdown from 'pages/Email/components/ConnectedEmailListDropdown';
import ScheduleMailModal from 'pages/Email/components/Modals/ScheduleMailModal';
import EmailComposeForm from 'pages/Email/components/emailComposer/EmailComposeForm';
import SendMailDropDown from 'pages/Email/components/emailComposer/SendMailDropDown';
import ToolBarSection from 'pages/Email/components/emailComposer/ToolBarSection';
import ReConnectProvider from 'pages/Setting/email-setting/EmailSetting/ConnectEmail/components/ReConnectProvider';
import BulkEmailComposerRightSection from './BulkEmailComposerRightSection';
import BulkMailConfirmationModal from './BulkMailConfirmationModal';

// ** Services **
import {
  useCheckEmailAuthAPI,
  useScheduledBulkMailForGoogle,
  useScheduledBulkMailForOutlook,
  useScheduledBulkMailForSmtp,
  useSendBulkMailForGoogle,
  useSendBulkMailForOutlook,
  useSendBulkMailForSmtp,
} from 'pages/Email/services/email.service';

// ** Hooks **
import { useAttachmentUpload } from 'pages/Email/hooks/useAttachmentUpload';

// ** Types **
import { Option } from 'components/FormField/types/formField.types';
import { ContactDetails } from 'pages/Contact/types/contacts.types';
import {
  EmailComposerFieldType,
  PreventRecipientType,
  UploadResponseInMail,
} from 'pages/Email/types/email.type';
import {
  MailTokenProvider,
  TokenProvider,
} from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';
import { bulkMailChildModalType } from '../types/contacts.types';

// ** Schema **
import { emailComposerSchema } from 'pages/Email/validation-schema/emailComposer.schema';

// ** Helper **
import { getProviderConnectionValue } from 'pages/Email/helper/email.helper';

// ** Util **
import { dateToMilliseconds } from 'utils/util';

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  providerOption: Option[];
  providers: {
    id: number;
    token_provider: TokenProvider;
    token_provider_mail: string;
  }[];
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
  selectionList: any;
  selectionRef?: any;
  setSelectionList?: any;
}

const BulkEmailComposerModal = (props: Props) => {
  const {
    closeModal,
    isOpen,
    providerOption,
    providers,
    selectionList,
    emailUndoHelperObj,
    setEmailUndoHelperObj,
    selectionRef,
    setSelectionList,
  } = props;

  // ** Hooks
  const editorRef = useRef<RichTextEditorComponent>(null);

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

  // ** states **
  const [selectedProviderOption, setSelectedProviderOption] = useState<Option>({
    label: '',
    value: '',
  });
  const [currentLoggedInUserData, setCurrentLoggedInUserData] = useState<{
    email: string;
    user_id?: number;
    provider?: TokenProvider;
  }>({ email: '' });
  const [allEmailExist, setAllEmailExist] = useState(false);
  const [openModal, setOpenModal] = useState<bulkMailChildModalType>({
    scheduleModal: false,
    confirmationModal: false,
  });

  const [scheduledMailName, setScheduledMailName] = useState<string>('');
  const [isInlineModeOpen, setIsInlineModeOpen] = useState<boolean>(false);
  const [isPreventRecipient, setIsPreventRecipient] =
    useState<PreventRecipientType>({
      cc: false,
      bcc: false,
      to: false,
    });

  // ** vars **
  const htmlContent = watch('html');
  const recipient = watch('to');
  const selectedEmail = (selectedProviderOption.value as string).split(',')[0];
  const selectedProvider = (selectedProviderOption.value as string).split(
    ','
  )[1];

  // ** Vars
  const { urlValue, value } = getProviderConnectionValue(
    selectedProvider as TokenProvider
  );

  // ** Custom hooks **
  const { sendBulkGmailAPI, isBulkGmailLoading } = useSendBulkMailForGoogle();
  const { scheduledBulkGmailAPI, isScheduledBulkGmailLoading } =
    useScheduledBulkMailForGoogle();
  const { sendBulkOutLookAPI, isBulkOutLookLoading } =
    useSendBulkMailForOutlook();
  const { scheduledBulkOutLookAPI, isScheduledBulkOutLookLoading } =
    useScheduledBulkMailForOutlook();
  const { sendBulkSmtpAPI, isBulkSmtpLoading } = useSendBulkMailForSmtp();
  const { scheduledBulkSmtpAPI, isScheduledBulkSmtpLoading } =
    useScheduledBulkMailForSmtp();
  const { checkEmailAuthAPI, isLoading: checkAuthLoading } =
    useCheckEmailAuthAPI();

  const isMailLoading =
    isBulkGmailLoading ||
    isScheduledBulkGmailLoading ||
    isBulkOutLookLoading ||
    isScheduledBulkOutLookLoading ||
    isBulkSmtpLoading ||
    isScheduledBulkSmtpLoading;

  const {
    attachmentUpload,
    loadingFiles,
    removeAttachment,
    removeSizeAttachment,
    uploadFileData,
    setUploadFileData,
  } = useAttachmentUpload({
    clearErrors,
    folderName: currentLoggedInUserData.provider,
    setError,
  });

  const isDisabled = loadingFiles > 0 || !((recipient?.length || 0) > 0);

  // initial load set default provider
  useEffect(() => {
    if (providerOption[0]) {
      setSelectedProviderOption(providerOption[0]);
    }
  }, [providerOption]);

  useEffect(() => {
    if (selectedProviderOption?.value) {
      const selectedUser = providers.find(
        (provider) =>
          provider.token_provider_mail ===
          (selectedProviderOption.value as string).split(',')[0]
      );

      if (selectedUser) {
        setCurrentLoggedInUserData({
          email: selectedUser.token_provider_mail,
          provider: selectedUser.token_provider,
        });
      }
    }
  }, [selectedProviderOption]);

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
    const emails = Object.values(selectionList)
      .map(
        (contact: any) =>
          contact?.emails?.find((val: any) => val.is_primary)?.value
      )
      .filter((element) => element !== undefined);
    reset({
      to: emails,
      schedule_date: format(new Date(), 'dd, MMM yyyy'),
      schedule_time: `${hours}:${mins}`,
    });
  }, []);

  useEffect(() => {
    const emails = checkSelectionList();
    setAllEmailExist(selectionList?.length === emails?.length);
    setValue(
      'to',
      emails.map((email) => ({ label: email, value: email })) as Option[]
    );
  }, [selectionList]);

  const checkSelectionList = () => {
    const selectedContacts: ContactDetails[] = Object.values(selectionList);

    const emails = selectedContacts
      .map(
        (contact: ContactDetails) =>
          contact?.emails?.find((obj) => obj.is_primary)?.value
      )
      .filter((element) => element !== undefined);
    return emails;
  };

  const checkRecipients = async () => {
    const { data: providerData } = await checkEmailAuthAPI({
      provider_name: selectedProvider,
      email: selectedEmail,
    });

    if (providerData?.is_active === false) {
      setOpenModal((prev) => ({ ...prev, reconnectProvider: true }));
    } else {
      const CheckList = recipient?.filter((obj) => obj.length);
      if (Object.values(selectionList).length === CheckList?.length) {
        onSubmit();
      } else if (allEmailExist) {
        setOpenModal((prev) => ({ ...prev, confirmationModal: true }));
      } else {
        setOpenModal({
          confirmationModal: true,
          scheduleModal: false,
        });
      }
    }
  };

  const onSubmit = handleSubmit(async (values: EmailComposerFieldType) => {
    let { html } = values;

    const editorFormFields = document.getElementsByClassName(
      'templateInput__field'
    );

    [...Array(editorFormFields.length)].forEach((_, index) => {
      const field = editorFormFields[index] as HTMLInputElement;
      if (field.value) {
        html = html?.replace(
          `<input class="templateInput__field" id="${field.id}" placeholder="${field.placeholder}">&nbsp;`,
          `${field.value}&nbsp;`
        );
      } else {
        html = html?.replace(
          `<input class="templateInput__field" id="${field.id}" placeholder="${field.placeholder}">&nbsp;`,
          ''
        );
      }
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

    let scheduledAfter = values.scheduled_after;

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

    const bodyObj = {
      html,
      to: values.to?.map((obj) => obj.value),
      subject: values.subject,
      scheduled_after: scheduledAfter,
      from: currentLoggedInUserData.email,
      email: currentLoggedInUserData.email,
      attachments:
        updatedUploadFileData.length > 0 ? updatedUploadFileData : null,
    };

    if (currentLoggedInUserData.provider === TokenProvider.GOOGLE_MAIL) {
      const { data, error } = bodyObj.scheduled_after
        ? await scheduledBulkGmailAPI(bodyObj)
        : await sendBulkGmailAPI(bodyObj);

      if (data && !error) {
        setEmailUndoHelperObj({
          ...emailUndoHelperObj,
          id: bodyObj.scheduled_after
            ? data.scheduled_mail_id
            : data.id || data.mail_id,
          provider: MailTokenProvider.GMAIL,
          isScheduled: bodyObj.scheduled_after ? 'scheduled' : 'send',
        });
        close();
      }
    }

    if (currentLoggedInUserData.provider === TokenProvider.OUTLOOK) {
      const { data, error } = bodyObj.scheduled_after
        ? await scheduledBulkOutLookAPI(bodyObj)
        : await sendBulkOutLookAPI(bodyObj);

      if (data && !error) {
        setEmailUndoHelperObj({
          ...emailUndoHelperObj,
          id: data.id || data.mail_id,
          provider: MailTokenProvider.OUTLOOK,
          isScheduled: bodyObj.scheduled_after ? 'scheduled' : 'send',
        });
        close();
      }
    }

    if (currentLoggedInUserData.provider === TokenProvider.SMTP) {
      const { data, error } = bodyObj.scheduled_after
        ? await scheduledBulkSmtpAPI(bodyObj)
        : await sendBulkSmtpAPI(bodyObj);

      if (data && !error) {
        setEmailUndoHelperObj({
          ...emailUndoHelperObj,
          id: data.id || data.mail_id,
          provider: MailTokenProvider.SMTP,
          isScheduled: bodyObj.scheduled_after ? 'scheduled' : 'send',
        });
        close();
      }
    }
  });

  const close = () => {
    closeModal();
    setOpenModal({ scheduleModal: false, confirmationModal: false });
    selectionRef.current = {};
    setSelectionList({});
  };

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
              <button className="inline-flex items-center justify-center w-[30px] h-[30px] rounded-full duration-500 hover:bg-[#ffffff] mr-[3px]">
                <span className="inline-block w-[10px] h-[2px] bg-black" />
              </button>
              <Icon iconType="closeBtnFilled" onClick={close} />
            </div>
            <div className="ip__Modal__Header !py-[16px] !pr-[330px] md:!pr-[86px]">
              <h3 className="title !text-[18px] !w-full">Send Bulk Mail</h3>
            </div>
            <div className="ip__Modal__Body ip__FancyScroll !p-[20px] !pb-0 !pr-[330px]">
              <div className="left">
                <div className="flex flex-wrap items-center justify-between">
                  <div className="max-w-full md:max-w-[calc(100%_-_52px)]">
                    <ConnectedEmailListDropdown
                      options={providerOption}
                      selectedValue={selectedProviderOption}
                      setSelectedProvider={setSelectedProviderOption}
                    />
                  </div>
                  <button className="mobile__viewBtn mb-[7px] ml-[10px] hidden md:block">
                    <Icon
                      className="w-[41px] h-[41px] rounded-[10px] bg-[#ECF2F6] p-[9px] duration-500 hover:bg-primaryColor"
                      iconType="inboxViewBackFilledIcon"
                    />
                  </button>
                </div>
                <form onSubmit={onSubmit}>
                  <EmailComposeForm
                    isPreventRecipient={isPreventRecipient}
                    setIsPreventRecipient={setIsPreventRecipient}
                    isBulkMail
                    setValue={setValue}
                    setUploadFileData={setUploadFileData}
                    editorRef={editorRef}
                    register={register}
                    control={control}
                    errors={errors}
                    {...{ isInlineModeOpen, setIsInlineModeOpen }}
                  />
                  <>
                    <div className="bg-[#ECF2F6] rounded-b-[12px] px-[16px] pr-[10px] py-[12px] pt-[30px] mt-[-10px] relative z-[2] sm:pl-[12px]">
                      {loadingFiles
                        ? [...Array(loadingFiles)].map((_, index) => (
                            <Fragment key={index}>
                              <>
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
                              </>
                            </Fragment>
                          ))
                        : null}
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
                  </>
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
              <BulkEmailComposerRightSection
                selectedContact={selectionList}
                setSelectionList={setSelectionList}
                selectionRef={selectionRef}
              />
            </div>
            <div className="ip__Modal__Footer !justify-between items-center !border-t-0 !pb-[15px] !pt-[25px] !pr-[330px]">
              <ToolBarSection
                attachmentUpload={attachmentUpload}
                editorRef={editorRef}
                {...{ isInlineModeOpen, setIsInlineModeOpen }}
              />
              <div className="right inline-flex items-center mb-[10px] lg:w-full lg:justify-end">
                <Button
                  className="secondary__Btn min-w-[100px] !mr-[10px] sm:w-[calc(50%_-_26px)]"
                  onClick={close}
                >
                  Discard
                </Button>
                <Button
                  isDisabled={isDisabled}
                  className="primary__Btn min-w-[100px] !mr-[5px] sm:!mr-[10px] sm:w-[calc(50%_-_26px)]"
                  onClick={() => checkRecipients()}
                  isLoading={isMailLoading || checkAuthLoading}
                >
                  Send
                </Button>
                <SendMailDropDown
                  isDisabled={isDisabled}
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
      {openModal.scheduleModal ? (
        <ScheduleMailModal
          watch={watch}
          errors={errors}
          control={control}
          register={register}
          setValue={setValue}
          setError={setError}
          resetField={resetField}
          clearErrors={clearErrors}
          isLoading={isMailLoading}
          isOpen={openModal.scheduleModal}
          onSubmit={() => checkRecipients()}
          scheduledMailName={scheduledMailName}
          setScheduledMailName={setScheduledMailName}
          closeModal={() =>
            setOpenModal({ scheduleModal: false, confirmationModal: false })
          }
          {...(allEmailExist ? { setOpenModal } : {})}
        />
      ) : null}
      {openModal.confirmationModal ? (
        <BulkMailConfirmationModal
          isOpen={openModal.confirmationModal}
          closeModal={() =>
            setOpenModal({ scheduleModal: false, confirmationModal: false })
          }
          onSubmit={() => {
            setOpenModal({ scheduleModal: false, confirmationModal: false });
            onSubmit();
          }}
          totalRecipient={recipient?.length || 0}
        />
      ) : null}
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
        />
      )}
    </>
  ) : null;
};

export default BulkEmailComposerModal;
