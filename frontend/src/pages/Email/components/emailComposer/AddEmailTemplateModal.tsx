// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { Fragment, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';

// ** Third party components **
import { RichTextEditorComponent } from '@syncfusion/ej2-react-richtexteditor';

// ** Components **
import Button from 'components/Button';
import Dropdown from 'components/Dropdown';
import FormField from 'components/FormField';
import Icon from 'components/Icon';
import CreateEmailTemplateEditor from '../CreateEmailTemplateEditor';
import InsertField from '../emailTemplate/InsertField';
import ToolBarSection from './ToolBarSection';

// ** Redux **
import {
  useAddEmailTemplateMutation,
  useUpdateEmailTemplateByIdMutation,
} from 'redux/api/emailTemplateApi';

// ** types **
import { UploadResponseInMail } from 'pages/Email/types/email.type';
import {
  CreateEmailTemplateFormFieldType,
  EmailTemplate,
  EmailTemplateVisibility,
} from 'pages/Email/types/emailTemplate.type';

// ** hook **
import { useAttachmentUpload } from 'pages/Email/hooks/useAttachmentUpload';

// ** others **
import { emailTemplateSchema } from 'pages/Email/validation-schema/emailTemplate.schema';

// ** Helper **
import { useGetMailTemplateById } from 'pages/Email/hooks/useMailTemplateHelper';

// ** Util **
import { Capitalize } from 'utils/util';

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  setEmailTemplates: React.Dispatch<React.SetStateAction<EmailTemplate[]>>;
  id?: number | null;
}

const AddEmailTemplateModal = (props: Props) => {
  const { closeModal, isOpen, setEmailTemplates, id = null } = props;

  const {
    reset,
    setValue,
    control,
    clearErrors,
    register,
    setError,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateEmailTemplateFormFieldType>({
    resolver: yupResolver(emailTemplateSchema),
    defaultValues: { visibility: EmailTemplateVisibility.PUBLIC },
  });
  const visibility = watch('visibility');

  //  ** ref
  const editorRef = useRef<RichTextEditorComponent>(null);

  // ** states
  const [isInlineModeOpen, setIsInlineModeOpen] = useState<boolean>(false);

  // ** Custom hooks **
  const [addEmailTemplateAPI, { isLoading: addLoading }] =
    useAddEmailTemplateMutation();
  const [updateEmailTemplateByIdAPI, { isLoading: updateLoading }] =
    useUpdateEmailTemplateByIdMutation();
  const {
    attachmentUpload,
    loadingFiles,
    removeAttachment,
    removeSizeAttachment,
    uploadFileData,
    setUploadFileData,
  } = useAttachmentUpload({
    clearErrors,
    setError,
    folderName: 'email-template',
  });
  // use this hook for set value edit time
  useGetMailTemplateById({ reset, id, setUploadFileData });

  // set focus when body required error
  useEffect(() => {
    if (Object.keys(errors).length === 1 && errors.description?.message) {
      const anchor = document.querySelector('#template-body-error');
      anchor?.scrollIntoView();
    }
  }, [errors]);

  const onSubmit = handleSubmit(async (value) => {
    const updatedUploadFileData =
      uploadFileData &&
      uploadFileData.map((item: UploadResponseInMail) => {
        return {
          path: item.path,
          contentType: item.mimetype,
          filename: item.originalname,
          size: item.size,
        };
      });

    const html = editorRef.current?.getHtml() || '';
    value.description = html;
    value.attachments =
      updatedUploadFileData.length > 0 ? updatedUploadFileData : [];

    if (id) {
      const data = await updateEmailTemplateByIdAPI({ id: +id, data: value });

      if ('data' in data) {
        setEmailTemplates((prev) =>
          prev.map((obj) => (obj.id === id ? data.data : obj))
        );
        closeModal();
      }
    } else {
      const data = await addEmailTemplateAPI({
        data: value,
      });
      if ('data' in data) {
        setEmailTemplates((prev) => [...prev, data.data]);
        closeModal();
      }
    }
  });

  return isOpen ? (
    <>
      {createPortal(
        <div
          className={`ip__Modal__Wrapper new__email__template  ${
            !isOpen ? 'hidden' : ''
          }`}
        >
          <div className="ip__Modal__Overlay" onClick={closeModal} />
          <div className="ip__Modal__ContentWrap" style={{ width: '923px' }}>
            <div className="ip__Modal__Header">
              <h3 className="title !text-[18px]">
                {id ? 'Update Email Template' : 'Add New Email Template'}
              </h3>
              <Icon iconType="closeBtnFilled" onClick={closeModal} />
            </div>
            <div className="ip__Modal__Body ip__FancyScroll">
              <form onSubmit={onSubmit}>
                <div className="flex flex-wrap">
                  <div className="w-[calc(100%_-_134px)] pr-[12px] sm:w-full sm:pr-0 xsm:w-full">
                    <FormField<CreateEmailTemplateFormFieldType>
                      type="text"
                      required
                      name="template_name"
                      label="Template Name"
                      labelClass="if__label__blue"
                      placeholder="Enter template name"
                      register={register}
                      error={errors?.template_name}
                      fieldLimit={50}
                    />
                  </div>
                  <div className="sm:w-full sm:mb-[15px] sm:order-[-1]">
                    <label className="if__label if__label__blue">
                      Visibility
                    </label>
                    <Dropdown
                      className="!translate-y-[0px]"
                      content={({ close: closeDropdown }) => (
                        <div
                          className="tippy__dropdown__ul !min-w-[135px]"
                          onClick={closeDropdown}
                        >
                          <div className="item">
                            <div
                              className="item__link"
                              onClick={() =>
                                setValue(
                                  'visibility',
                                  EmailTemplateVisibility.PRIVATE
                                )
                              }
                            >
                              <span className="item__text">Private</span>
                            </div>
                          </div>
                          <div className="item">
                            <div
                              className="item__link"
                              onClick={() =>
                                setValue(
                                  'visibility',
                                  EmailTemplateVisibility.PUBLIC
                                )
                              }
                            >
                              <span className="item__text">Public</span>
                            </div>
                          </div>
                        </div>
                      )}
                    >
                      <button
                        className='w-[134px] bg-primaryColor text-[#ffffff] rounded-[10px] h-[44px] text-[14px] font-biotif__Medium text-left px-[14px] capitalize relative before:content-[""] before:absolute before:top-[15px] before:right-[12px] before:w-[8px] before:h-[8px] before:border-l-[2px] before:border-l-[#ffffff] before:border-b-[2px] before:border-b-[#ffffff] before:rotate-[-45deg] sm:w-[110px] xsm:w-full'
                        type="button"
                      >
                        {visibility && Capitalize(visibility)}
                      </button>
                    </Dropdown>
                  </div>
                </div>
                <div className="new__email__template__subject bg-formField__BGColor rounded-[10px] p-[20px] pb-[14px] sm:px-[14px] sm:pt-[14px] sm:pb-[8px]">
                  <FormField<CreateEmailTemplateFormFieldType>
                    wrapperClass="subject__field"
                    type="text"
                    name="subject"
                    label="Subject"
                    labelClass="if__label__blue"
                    register={register}
                    fieldLimit={50}
                  />
                  <div className="compose__mail__select__field relative z-[1]">
                    <span className="inline-block text-[#00000080] text-[16px] font-biotif__Regular absolute top-[3px] left-[0px] z-[2]">
                      Select:
                    </span>
                    <InsertField editorRef={editorRef} />
                  </div>
                </div>
                {errors && (
                  <p className="ip__Error mt-[10px]">
                    {errors?.subject?.message}
                  </p>
                )}
                <div className="mt-[20px]">
                  <CreateEmailTemplateEditor
                    editorRef={editorRef}
                    control={control}
                    {...{ isInlineModeOpen, setIsInlineModeOpen }}
                  />
                </div>
                <>
                  <div className="bg-[#ECF2F6] rounded-b-[12px] px-[16px] pr-[10px] py-[12px] pt-[30px] mt-[-10px] relative z-[2] sm:pl-[12px]">
                    {loadingFiles ? (
                      [...Array(loadingFiles)].map((_, index) => (
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
                    ) : (
                      <></>
                    )}
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
                  <p className="ip__Error" id="template-body-error">
                    {errors?.description?.message}
                  </p>
                )}
              </form>
            </div>
            <div className="ip__Modal__Footer !justify-between items-center !border-t-0 !pb-[25px] !pt-[25px]">
              <ToolBarSection
                attachmentUpload={attachmentUpload}
                editorRef={editorRef}
                {...{ isInlineModeOpen, setIsInlineModeOpen }}
              />
              <div className="right inline-flex items-center mb-[10px] lg:w-full">
                <Button
                  className="secondary__Btn min-w-[100px] !mr-[10px]"
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button
                  isDisabled={loadingFiles > 0}
                  className="primary__Btn min-w-[100px] !mr-[5px]"
                  onClick={onSubmit}
                  isLoading={addLoading || updateLoading}
                >
                  {id ? 'Update' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  ) : (
    <></>
  );
};

export default AddEmailTemplateModal;
