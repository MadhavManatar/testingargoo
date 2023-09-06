// ** import packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

// ** components **
import AttachmentForm from './AttachmentForm';

// ** modal **
import Modal from 'components/Modal';

// ** redux  **
import { setLoadAttachments, setLoadTimeLines } from 'redux/slices/commonSlice';

// ** type **
import {
  AddAttachmentModalProps,
  AttachmentFieldType,
} from '../types/attachment.types';

// ** schema **
import { attachmentSchema } from '../validation-schema/attachment.schema';

import { useAddAttachmentMutation } from 'redux/api/attachmentApi';

const AddAttachmentModal = (props: AddAttachmentModalProps) => {
  const {
    closeModal,
    isOpen,
    modelName,
    modelRecordId,
    isLink = false,
  } = props;

  // ** Hooks **
  const dispatch = useDispatch();

  // ** States **
  const [attachment, setAttachments] = useState<File[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);


  // ** APIS **
  const [addAttachmentAPI, { isLoading }] = useAddAttachmentMutation();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    clearErrors,
    reset,
  } = useForm<AttachmentFieldType>({
    resolver: yupResolver(attachmentSchema),
  });

  useEffect(() => {
    if (!modelRecordId) close();
  }, [isOpen, modelRecordId]);

  const onSubmit = handleSubmit(async (val: AttachmentFieldType) => {
    setIsSubmitted(true);
    if (isLink && !val.link) {
      setError('link', {
        type: 'custom',
        message: 'Please provide link',
      });
    } else if (!isLink && !attachment?.length) {
      setError('files', {
        type: 'custom',
        message: 'Please select at least one file',
      });
    } else {
      const attachMentFormData = new FormData();
      attachMentFormData.append('model_name', modelName);
      attachMentFormData.append('model_record_id', `${modelRecordId || ''}`);
      if (isLink) {
        attachMentFormData.append('links', JSON.stringify([val.link || '']));
      } else {
        attachment.forEach((file) => {
          attachMentFormData.append(`attachments`, file);
        });
      }
      const data = await addAttachmentAPI({ data: attachMentFormData });
      if ("data" in data) {
        dispatch(setLoadAttachments({ attachment: true }));
        dispatch(setLoadTimeLines({ timeline: true }));
        close();
      }
    }
  });
  const close = () => {
    setAttachments([]);
    reset();
    closeModal();
  };

  return (
    <Modal
      title="Add Document"
      visible={isOpen}
      onClose={() => close()}
      onCancel={() => close()}
      onSubmit={onSubmit}
      submitLoading={isLoading}
      width="560px"
    >
      <form onSubmit={onSubmit}>
        <AttachmentForm
          errors={errors}
          register={register}
          setError={setError}
          clearErrors={clearErrors}
          setAttachments={setAttachments}
          attachment={attachment}
          isLink={isLink}
          isLoading={isLoading || isSubmitted}
        />
      </form>
    </Modal>
  );
};

export default AddAttachmentModal;
