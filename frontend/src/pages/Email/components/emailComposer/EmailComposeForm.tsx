// ** Import Packages **
import { RichTextEditorComponent } from '@syncfusion/ej2-react-richtexteditor';
import { useState } from 'react';
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';

// ** Components **
import FormField from 'components/FormField';
import ContactWithEmailOption from 'pages/Contact/components/ContactWithEmailOption';
import MultiValueComponent from 'pages/Contact/components/MultiValueComponent';
import InsertField from '../emailTemplate/InsertField';
import { ChooseTemplate } from '../miniComponents';
import RichTextEditorForEmail from './RichTextEditorForEmail';

// ** Services **
import { useGetContactOptionsForEmail } from 'pages/Contact/hooks/useContactService';

// ** Types **
import { Option } from 'components/FormField/types/formField.types';
import {
  EmailComposerFieldType,
  PreventRecipientType,
  UploadResponseInMail,
} from '../../types/email.type';

// * Util **
import { isValidEmail } from 'utils/util';

interface Props {
  defaultRecipient?: Option[];
  register: UseFormRegister<EmailComposerFieldType>;
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
  defaultBCCRecipient?: Option[];
  defaultCCRecipient?: Option[];
  hideSubject?: boolean;
}

function EmailComposeForm(props: Props) {
  const {
    register,
    control,
    errors,
    editorRef,
    setValue,
    setUploadFileData,
    setRunSetFieldValueScript,
    isBulkMail,
    defaultRecipient = [],
    isInlineModeOpen,
    setIsInlineModeOpen,
    isPreventRecipient,
    setIsPreventRecipient,
    defaultBCCRecipient,
    defaultCCRecipient,
    hideSubject,
  } = props;

  // ** states **
  const [displayField, setDisplayField] = useState({ cc: false, bcc: false });

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
              defaultOptions={defaultRecipient}
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
            {/* <div className="reply__btn__wrapper">
              <div className="reply__btn cursor-pointer inline-flex items-center">
                <Icon iconType="inboxViewReplyBlueArrowFilled" />
                <span className="text inline-block text-[#00000080] text-[18px] font-biotif__Medium duration-300 lg:hidden">
                  Reply
                </span>
              </div>
              <div className='down__btn ml-[4px] cursor-pointer w-[22px] h-[22px] relative top-[3px] before:content-[""] before:absolute before:top-[calc(50%_-_3px)] before:left-[50%] before:w-[10px] before:h-[10px] before:border-l-[2px] before:border-l-[#00000080] before:border-b-[2px] before:border-b-[#00000080] before:translate-x-[-50%] before:translate-y-[-50%] before:-rotate-45 before:duration-300 hover:before:border-l-[2px] hover:before:border-l-primaryColor hover:before:border-b-[2px] hover:before:border-b-primaryColor' />
            </div> */}
          </div>
          {errors.to && <p className="ip__Error">{errors.to.message}</p>}
          {(displayField.cc ||
            (defaultCCRecipient && defaultCCRecipient.length > 0)) && (
            <div className="compose__mail__cc__field relative z-[3]">
              <span className="inline-block text-[#00000080] text-[18px] font-biotif__Medium absolute top-[9px] left-[10px] z-[2] sm:left-0">
                Cc:
              </span>
              <FormField<EmailComposerFieldType>
                wrapperClass={`mb-0 ${
                  isPreventRecipient.cc ? 'invalid__email' : ''
                }`}
                setInputValue={(value) => setFieldError('cc', value)}
                id="cc"
                serveSideSearch
                placeholder=""
                isMulti
                name="cc"
                control={control}
                getOptions={getContactOptionsForEmail}
                OptionComponent={ContactWithEmailOption}
                MultiValueComponent={MultiValueComponent}
                type="creatableAsyncSelectForEmail"
                inputMaxLength={50}
                isInputValuePrevent
                isMultiColor
                isLoading={isContactsOptionsLoading}
                menuPosition="fixed"
                defaultOptions={defaultCCRecipient}
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

          {(displayField.bcc ||
            (defaultBCCRecipient && defaultBCCRecipient.length > 0)) && (
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
                serveSideSearch
                name="bcc"
                control={control}
                inputMaxLength={50}
                isInputValuePrevent
                getOptions={getContactOptionsForEmail}
                setInputValue={(value) => setFieldError('bcc', value)}
                OptionComponent={ContactWithEmailOption}
                MultiValueComponent={MultiValueComponent}
                type="creatableAsyncSelectForEmail"
                isMultiColor
                isLoading={isContactsOptionsLoading}
                menuPosition="fixed"
                defaultOptions={defaultBCCRecipient}
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
      {!hideSubject && (
        <div className="compose__mail__subject__field relative z-[1]">
          <span className="inline-block text-[#00000080] text-[18px] font-biotif__Medium absolute top-[9px] left-[10px] z-[2] sm:left-0">
            Subject:
          </span>
          <FormField<EmailComposerFieldType>
            wrapperClass="mb-0"
            type="text"
            name="subject"
            placeholder=""
            register={register}
            fieldLimit={100}
          />
        </div>
      )}
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

export default EmailComposeForm;
