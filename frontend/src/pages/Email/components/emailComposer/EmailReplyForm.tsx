// ** Import Packages **
import { RichTextEditorComponent } from '@syncfusion/ej2-react-richtexteditor';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Control, FieldErrors, UseFormSetValue } from 'react-hook-form';

// ** Components **
import FormField from 'components/FormField';
import Icon from 'components/Icon';
import ContactWithEmailOption from 'pages/Contact/components/ContactWithEmailOption';
import MultiValueComponent from 'pages/Contact/components/MultiValueComponent';
import InsertField from '../emailTemplate/InsertField';
import { ChooseTemplate } from '../miniComponents';
import { EditEmail } from './AddEmailComposerModal';
import RichTextEditorForEmail from './RichTextEditorForEmail';

// ** Services **
import { useGetContactOptionsForEmail } from 'pages/Contact/hooks/useContactService';

// ** Hook **
import { useToggleDropdown } from 'hooks/useToggleDropdown';

// ** Types **
import {
  EmailComposerFieldType,
  EmailDetail,
  EmailRecipient,
  PreventRecipientType,
  ReplyFormType,
  UploadResponseInMail,
} from '../../types/email.type';

// ** Util **
import { isValidEmail } from 'utils/util';

// ** Helper **
import {
  RecipientOption,
  getMailRecipientsForReply,
  hideReplyAllBtn,
} from 'pages/Email/helper/email.helper';

interface Props {
  defaultRecipient?: EmailRecipient[];
  control: Control<EmailComposerFieldType>;
  errors: FieldErrors<EmailComposerFieldType>;
  editorRef: React.RefObject<RichTextEditorComponent>;
  setValue: UseFormSetValue<EmailComposerFieldType>;
  setUploadFileData: React.Dispatch<
    React.SetStateAction<UploadResponseInMail[]>
  >;
  setRunSetFieldValueScript?: React.Dispatch<React.SetStateAction<number>>;
  isBulkMail?: boolean;
  setIsInlineModeOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isInlineModeOpen?: boolean;
  isPreventRecipient: PreventRecipientType;
  setIsPreventRecipient: React.Dispatch<
    React.SetStateAction<PreventRecipientType>
  >;
  emailData?: EmailDetail;
  currentAccountEmail?: string;
  setShowReplyForm: Dispatch<SetStateAction<ReplyFormType>>;
  showReplyForm?: ReplyFormType;
  changeEmailSubject?: (email: EditEmail) => void;
  isHideReply: boolean  
}

function EmailReplyForm(props: Props) {
  const {
    control,
    errors,
    editorRef,
    setValue,
    emailData,
    setUploadFileData,
    setRunSetFieldValueScript,
    isBulkMail,
    isInlineModeOpen,
    setIsInlineModeOpen,
    isPreventRecipient,
    setIsPreventRecipient,
    defaultRecipient,
    currentAccountEmail,
    setShowReplyForm,
    showReplyForm,
    changeEmailSubject,
    isHideReply,
  } = props;
  // ** states **
  const [displayField, setDisplayField] = useState({ cc: false, bcc: false });
  const [emailFields, setFieldData] = useState<{
    defaultBCCRecipient: RecipientOption[];
    defaultCCRecipient: RecipientOption[];
    defaultToRecipient: RecipientOption[];
  }>({
    defaultCCRecipient: [],
    defaultToRecipient: [],
    defaultBCCRecipient: [],
  });

  // const [replayDropdown, setReplayDropdown] = useState<boolean>(false);
  const { dropdownRef, isDropdownOpen, toggleDropdown } = useToggleDropdown();

  const { getContactOptionsForEmail, isContactsOptionsLoading } =
    useGetContactOptionsForEmail({
      emailWithLabel: true,
    });

  const setFieldError = (
    field: string,
    value: React.SetStateAction<boolean>
  ) => {
    setIsPreventRecipient((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const { defaultBCCRecipient, defaultCCRecipient, defaultToRecipient } =
      getMailRecipientsForReply({
        emailRecipient: defaultRecipient,
        from_email_address: emailData?.from_email_address,
        currentAccountEmail,
        allRecipient: emailData?.email_recipients,
        showReplyForm,
        filterData: true,
      });
    setFieldData({
      defaultBCCRecipient,
      defaultCCRecipient,
      defaultToRecipient,
    });
    setValue('to', defaultToRecipient);
    setValue('cc', defaultCCRecipient);
    setValue('bcc', defaultBCCRecipient);
  }, [showReplyForm]);

  const openSubjectComposerModal = (hideSubject: boolean) => {
    if (changeEmailSubject) {
      let htmlBody = document.getElementById(
        'inlineRTE_rte-edit-view'
      )?.innerHTML;
      const editorFormFields = document.getElementsByClassName(
        'templateInput__field'
      );

      [...Array(editorFormFields.length)].forEach((_, index) => {
        const field = editorFormFields[index] as HTMLInputElement;
        htmlBody = htmlBody?.replaceAll(
          `<input class="${field?.classList?.value}" id="${field.id}" placeholder="${field.placeholder}">`,
          field.value ? `${field.value}` : ''
        );
      });
      changeEmailSubject({
        emailId: emailData?.id ?? 0,
        conversionId: emailData?.email_conversion_id ?? 0,
        showReplyForm,
        hideSubject,
        htmlBody,
      });
    }
  };
  const emailRecipients = emailData?.email_recipients
    ?.map((obj) => obj.emails.map((innerObj) => innerObj.email))
    .flat();

  const isSameEmailsForCCBcc = hideReplyAllBtn(emailRecipients);

  return (
    <>
      {!isBulkMail ? (
        <>
          <div className="compose__mail__to__field relative z-[4]">
            <span className="inline-block text-[#00000080] text-[18px] font-biotif__Medium absolute top-[9px] left-[10px] z-[2] sm:left-0">
              To:
            </span>
            <FormField<EmailComposerFieldType>
              wrapperClass={`mb-0 ${
                isPreventRecipient.to ? 'invalid__email' : ''
              }`}
              setInputValue={(value) => setFieldError('to', value)}
              id="to"
              serveSideSearch
              placeholder=""
              getOptions={getContactOptionsForEmail}
              OptionComponent={ContactWithEmailOption}
              MultiValueComponent={MultiValueComponent}
              type="creatableAsyncSelectForEmail"
              inputMaxLength={50}
              isInputValuePrevent
              isLoading={isContactsOptionsLoading}
              isMulti
              name="to"
              control={control}
              menuPosition="fixed"
              isMultiColor
              defaultOptions={emailFields.defaultToRecipient}
              isValidNewOption={isValidEmail}
            />
            {!(displayField.cc || displayField.bcc) && (
              <div className="ccBcc__btn__wrapper inline-block absolute bottom-[9px] right-[10px] z-[2]">
                <span
                  className="inline-block text-[#00000080] text-[18px] font-biotif__Medium mr-[15px] cursor-pointer duration-500 hover:text-primaryColor"
                  onClick={() => setDisplayField({ ...displayField, cc: true })}
                >
                  Cc
                </span>
                <span
                  className="inline-block text-[#00000080] text-[18px] font-biotif__Medium cursor-pointer duration-500 hover:text-primaryColor"
                  onClick={() =>
                    setDisplayField({ ...displayField, bcc: true })
                  }
                >
                  Bcc
                </span>
              </div>
            )}
            {showReplyForm && isHideReply === true  && (
              <div className="reply__btn__wrapper relative" ref={dropdownRef}>
                <div className="reply__btn cursor-pointer inline-flex items-center">
                  {showReplyForm === 'forward' && (
                    <span className="inline-block text-[#00000080] text-[18px] font-biotif__Medium mr-[2px] cursor-pointer duration-500 hover:text-primaryColor">
                      Forward
                    </span>
                  )}
                  {showReplyForm === 'reply' && (
                    <span className="inline-block text-[#00000080] text-[18px] font-biotif__Medium mr-[2px] cursor-pointer duration-500 hover:text-primaryColor">
                      Reply
                    </span>
                  )}
                  {showReplyForm === 'replyAll' && (
                    <span className="inline-block text-[#00000080] text-[18px] font-biotif__Medium mr-[2px] cursor-pointer duration-500 hover:text-primaryColor">
                      Reply All
                    </span>
                  )}
                  <span className="text inline-block text-[#00000080] text-[18px] font-biotif__Medium duration-300 lg:hidden" />
                </div>
                <div
                  onClick={toggleDropdown}
                  className='down__btn ml-[4px] cursor-pointer w-[22px] h-[22px] relative top-[2px] before:content-[""] before:absolute before:top-[calc(50%_-_3px)] before:left-[50%] before:w-[10px] before:h-[10px] before:border-l-[2px] before:border-l-[#00000080] before:border-b-[2px] before:border-b-[#00000080] before:translate-x-[-50%] before:translate-y-[-50%] before:-rotate-45 before:duration-300 hover:before:border-l-[2px] hover:before:border-l-primaryColor hover:before:border-b-[2px] hover:before:border-b-primaryColor'
                />
                {isDropdownOpen && (
                  <div className="add__dropdown__menu absolute top-[calc(100%_+_5px)] right-[0px] pt-[5px]">
                    <div className="inner__wrapper bg-ipWhite__bgColor min-w-[150px] relative rounded-[10px]">
                      <div className="">
                        <div
                          className="item"
                          onClick={() => {
                            setShowReplyForm('reply');
                            toggleDropdown();
                          }}
                        >
                          <div className="flex items-center relative z-[2] cursor-pointer">
                            <Icon
                              className="p-[2px]"
                              iconType="inboxViewReplyFilledIcon"
                            />
                            <span className="text whitespace-pre text-[14px] font-biotif__Medium inline-block ml-[2px] text-ipBlack__textColor">
                              Reply
                            </span>
                          </div>
                        </div>
                        {emailRecipients &&
                          emailRecipients.length > 1 &&
                          !isSameEmailsForCCBcc && (
                            <div
                              className="item"
                              onClick={() => {
                                setShowReplyForm('replyAll');
                                toggleDropdown();
                              }}
                            >
                              <div className="flex items-center relative z-[2] cursor-pointer">
                                <Icon
                                  className="p-[2px]"
                                  iconType="inboxViewReplyAllBlueArrowFilled"
                                />
                                <span className="text whitespace-pre text-[14px] font-biotif__Medium inline-block ml-[2px] text-ipBlack__textColor">
                                  Reply All
                                </span>
                              </div>
                            </div>
                          )}

                        <div
                          className="item"
                          onClick={() => {
                            setShowReplyForm('forward');
                            toggleDropdown();
                          }}
                        >
                          <div className="flex items-center relative z-[2] cursor-pointer">
                            <Icon
                              className="p-[2px]"
                              iconType="inboxViewForwardBlueArrowFilled"
                            />
                            <span className="text whitespace-pre text-[14px] font-biotif__Medium inline-block ml-[2px] text-ipBlack__textColor">
                              Forward
                            </span>
                          </div>
                        </div>
                        <div
                          className="item"
                          onClick={() => {
                            if (changeEmailSubject) {
                              openSubjectComposerModal(false);
                            }
                            toggleDropdown();
                          }}
                        >
                          <div className="flex items-center relative z-[2] cursor-pointer">
                            <Icon
                              className="p-[2px]"
                              iconType="editPencilFilledIcon"
                            />
                            <span className="text whitespace-pre text-[14px] font-biotif__Medium inline-block ml-[2px] text-ipBlack__textColor">
                              Edit subject
                            </span>
                          </div>
                        </div>
                        <div
                          className="item"
                          onClick={() => {
                            if (changeEmailSubject) {
                              openSubjectComposerModal(true);
                            }
                            toggleDropdown();
                          }}
                        >
                          <div className="flex items-center relative z-[2] cursor-pointer">
                            <Icon
                              className="p-[2px]"
                              iconType="editPencilFilledIcon"
                            />
                            <span className="text whitespace-pre text-[14px] font-biotif__Medium inline-block ml-[2px] text-ipBlack__textColor">
                              Pop-out Reply
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {errors.to && <p className="ip__Error">{errors.to.message}</p>}
          {(displayField.cc || emailFields.defaultCCRecipient.length > 0) && (
            <div className="compose__mail__cc__field relative z-[3]">
              <span className="inline-block text-[#00000080] text-[18px] font-biotif__Medium absolute top-[9px] left-[10px] z-[2] sm:left-0">
                Cc:
              </span>
              <FormField<EmailComposerFieldType>
                wrapperClass={`mb-0 ${
                  isPreventRecipient.cc ? 'invalid__email' : ''
                }`}
                id="cc"
                placeholder=""
                isMulti
                name="cc"
                control={control}
                getOptions={getContactOptionsForEmail}
                setInputValue={(value) => setFieldError('cc', value)}
                OptionComponent={ContactWithEmailOption}
                inputMaxLength={50}
                isInputValuePrevent
                isMultiColor
                MultiValueComponent={MultiValueComponent}
                type="creatableAsyncSelectForEmail"
                isLoading={isContactsOptionsLoading}
                menuPosition="fixed"
                defaultOptions={emailFields.defaultCCRecipient}
                isValidNewOption={isValidEmail}
              />
              {!displayField.bcc && (
                <div className="inline-block absolute bottom-[9px] right-[10px] z-[2]">
                  <span
                    className="inline-block text-[#00000080] text-[18px] font-biotif__Medium cursor-pointer duration-500 hover:text-primaryColor"
                    onClick={() =>
                      setDisplayField({ ...displayField, bcc: true })
                    }
                  >
                    Bcc
                  </span>
                </div>
              )}
            </div>
          )}
          {(displayField.bcc || emailFields.defaultBCCRecipient.length > 0) && (
            <div className="compose__mail__bcc__field relative z-[2]">
              <span className="inline-block text-[#00000080] text-[18px] font-biotif__Medium absolute top-[9px] left-[10px] z-[2] sm:left-0">
                Bcc:
              </span>
              <FormField<EmailComposerFieldType>
                wrapperClass={`mb-0 ${
                  isPreventRecipient.bcc ? 'invalid__email' : ''
                }`}
                id="bcc"
                placeholder=""
                isMulti
                name="bcc"
                control={control}
                inputMaxLength={50}
                isInputValuePrevent
                getOptions={getContactOptionsForEmail}
                setInputValue={(value) => setFieldError('bcc', value)}
                OptionComponent={ContactWithEmailOption}
                MultiValueComponent={MultiValueComponent}
                type="creatableAsyncSelectForEmail"
                isLoading={isContactsOptionsLoading}
                menuPosition="fixed"
                isMultiColor
                defaultOptions={emailFields.defaultBCCRecipient}
                isValidNewOption={isValidEmail}
              />
              {!displayField.cc && (
                <div className="inline-block absolute bottom-[9px] right-[10px] z-[2]">
                  <span
                    className="inline-block text-[#00000080] text-[18px] font-biotif__Medium cursor-pointer duration-500 hover:text-primaryColor"
                    onClick={() =>
                      setDisplayField({ ...displayField, cc: true })
                    }
                  >
                    Cc
                  </span>
                </div>
              )}
            </div>
          )}
        </>
      ) : null}
      <div className="compose__mail__select__field relative z-[1]">
        <span className="inline-block text-[#00000080] text-[18px] font-biotif__Medium absolute top-[9px] left-[10px] z-[2] sm:left-0">
          Select:
        </span>
        <ChooseTemplate
          setRunSetFieldValueScript={setRunSetFieldValueScript}
          setValue={setValue}
          setUploadFileData={setUploadFileData}
        />
        <InsertField
          editorRef={editorRef}
          isDisabledField={false}
          setRunSetFieldValueScript={setRunSetFieldValueScript}
        />
      </div>
      <div className="compose__mail__textarea mt-[15px]">
        <RichTextEditorForEmail
          editorRef={editorRef}
          control={control}
          {...{ isInlineModeOpen, setIsInlineModeOpen }}
        />
      </div>
    </>
  );
}

export default EmailReplyForm;
