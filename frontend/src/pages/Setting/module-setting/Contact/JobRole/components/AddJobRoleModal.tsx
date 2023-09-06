// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

// ** Components **
import Modal from 'components/Modal';
import ContactTypeForm from './JobRoleForm';

// ** Types **
import {
  AddContactTypeModalProps,
  contactTypeFieldType,
} from '../types/jobRole.types';

// ** services **
import {
  EntityAttributesEnum,
} from 'redux/api/entityAttributesApi';

// ** Constants **
import { MODULE_PERMISSION } from 'constant/permissions.constant';
import { ToastMsg } from 'constant/toast.constants';

// ** schema **
import { contactTypeSchema } from '../validation-schema/jobRole.schema';
import { useAddJobRoleMutation } from 'redux/api/jobRoleApi';

const AddContactTypeModal = (props: AddContactTypeModalProps) => {
  const { closeModal, isOpen, onAdd, setContactTypeInfo } = props;

  // ** APIS **
  const [addJobRoleApi, { isLoading }] = useAddJobRoleMutation();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<contactTypeFieldType>({
    resolver: yupResolver(contactTypeSchema),
  });

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen]);

  const onSubmit = handleSubmit(async (value) => {
    const data = await addJobRoleApi({
      data: {
        name: value.name,
        type: EntityAttributesEnum.JOB_ROLE,
        toastMsg: ToastMsg.settings.moduleSettings.contact.jobRole.createMsg,
      },
      params: { ...MODULE_PERMISSION.CONTACT.create },
    });
    if (data) {
      if (setContactTypeInfo) setContactTypeInfo([]);
      if (onAdd) {
        onAdd();
      }
      close();
    }
  });

  const close = () => {
    reset();
    closeModal();
  };

  return isOpen ? (
    <Modal
      title="New Contact Job Role"
      visible={isOpen}
      onClose={() => close()}
      onCancel={() => close()}
      onSubmit={onSubmit}
      submitButtonText="Add"
      submitLoading={isLoading}
      contentClass="add__pipeline__modal"
    >
      <form onSubmit={onSubmit}>
        <ContactTypeForm errors={errors} register={register} />
      </form>
    </Modal>
  ) : (
    <></>
  );
};

export default AddContactTypeModal;
