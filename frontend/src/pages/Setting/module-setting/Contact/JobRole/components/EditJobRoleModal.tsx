// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

// ** Components **
import Modal from 'components/Modal';
import DiscardConfirmationModal from 'components/Modal/DiscardConfirmationModal';
import ContactTypeFormSkeleton from '../skeletons/JobRoleFormSkeleton';
import ContactTypeForm from './JobRoleForm';

// ** Types **
import {
  EditContactTypeModalProps,
  contactTypeFieldType,
} from '../types/jobRole.types';

// ** Services **
import {
  EntityAttributesEnum,
} from 'redux/api/entityAttributesApi';

// ** Constants **
import { MODULE_PERMISSION } from 'constant/permissions.constant';
import { ToastMsg } from 'constant/toast.constants';

// ** Schema **
import { contactTypeSchema } from '../validation-schema/jobRole.schema';
import { useLazyGetJobRoleByIdQuery, useUpdateJobRoleMutation } from 'redux/api/jobRoleApi';

const EditContactTypeModal = (props: EditContactTypeModalProps) => {
  const { closeModal, isOpen, onEdit, id, setContactTypeInfo } = props;

  // ** Hooks
  const {
    register,
    formState: { errors, dirtyFields },
    handleSubmit,
    reset,
  } = useForm<contactTypeFieldType>({
    resolver: yupResolver(contactTypeSchema),
  });

  // ** states **
  const [openDiscardModal, setOpenDiscardModal] = useState<boolean>(false);

  // ** API **
  const [getEntityAttributesById, { isLoading }] =
    useLazyGetJobRoleByIdQuery();
  const [updateJobRoleApi, { isLoading: isUpdateLoading }] =
    useUpdateJobRoleMutation();

  useEffect(() => {
    if (id) {
      getContactTypeById(id);
    }
  }, [id]);

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen]);

  const getContactTypeById = async (contactTypeId: number) => {
    const { data, error } = await getEntityAttributesById({
      id: contactTypeId,
    });

    if (data && !error) {
      reset({ name: data?.name || '' });
    }
  };

  const onSubmit = handleSubmit(async (value) => {
    if (id) {
      const data = await updateJobRoleApi({
        id,
        data: {
          name: value.name,
          type: EntityAttributesEnum.JOB_ROLE,
          toastMsg: ToastMsg.settings.moduleSettings.contact.jobRole.updateMsg,
        },
        params: { ...MODULE_PERMISSION.CONTACT.update },
      });
      if (data) {
        if (setContactTypeInfo) setContactTypeInfo([]);
        if (onEdit) {
          onEdit();
        }
        close();
      }
    }
  });
  const onCancelForm = () => {
    const isDirtyFields = Object.values(dirtyFields);
    if (isDirtyFields.length) {
      setOpenDiscardModal(true);
    } else {
      close();
    }
  };
  const close = () => {
    reset();
    closeModal();
  };

  return isOpen ? (
    <Modal
      title="Update Contact Job Role"
      visible={isOpen}
      onClose={onCancelForm}
      onCancel={onCancelForm}
      onSubmit={onSubmit}
      submitButtonText="Update"
      submitLoading={isUpdateLoading}
      contentClass="add__pipeline__modal"
    >
      {isLoading ? (
        <ContactTypeFormSkeleton />
      ) : (
        <form onSubmit={onSubmit}>
          <ContactTypeForm errors={errors} register={register} />
        </form>
      )}
      {openDiscardModal ? (
        <DiscardConfirmationModal
          discardActivity={close}
          isOpen={openDiscardModal}
          closeModal={() => setOpenDiscardModal(false)}
        />
      ) : null}
    </Modal>
  ) : (
    <></>
  );
};

export default EditContactTypeModal;
