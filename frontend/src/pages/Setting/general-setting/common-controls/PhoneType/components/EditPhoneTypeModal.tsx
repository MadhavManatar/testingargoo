// ** import packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

// ** components **
import Modal from 'components/Modal';
import DiscardConfirmationModal from '../../../../../../components/Modal/DiscardConfirmationModal';
import PhoneTypeFormSkeleton from '../skeletons/PhoneTypeFormSkeleton';
import PhoneTypeForm from './PhoneTypeForm';

// ** types **
import {
  EditPhoneTypeModalPropsType,
  phoneTypeFieldType,
} from '../types/phone-type.types';

// ** services **
import {
  EntityAttributesEnum,
} from 'redux/api/entityAttributesApi';

// ** schema **
import { phoneTypeSchema } from '../validation-schema/phoneType.schema';

// ** Constants **
import { MODULE_PERMISSION } from 'constant/permissions.constant';
import { ToastMsg } from 'constant/toast.constants';
import { useLazyGetPhoneTypeByIdQuery, useUpdatePhoneTypeMutation } from 'redux/api/phoneTypeApi';

const EditPhoneTypeModal = (props: EditPhoneTypeModalPropsType) => {
  const { closeModal, isOpen, onEdit, id } = props;

  // ** Hooks **
  const {
    register,
    formState: { errors, dirtyFields },
    handleSubmit,
    reset,
  } = useForm<phoneTypeFieldType>({
    resolver: yupResolver(phoneTypeSchema),
  });

  // ** states **
  const [openDiscardModal, setOpenDiscardModal] = useState<boolean>(false);
  const [isSystem, setIsSystem] = useState(false);

  // ** APIS **
  const [getPhoneTypesById, { isLoading }] =
    useLazyGetPhoneTypeByIdQuery();
  const [updatePhoneType, { isLoading: isUpdateLoading }] =
    useUpdatePhoneTypeMutation();

  useEffect(() => {
    if (id) {
      getPhoneTypeById(id);
    }
  }, [id]);

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen]);

  const getPhoneTypeById = async (phoneTypeId: number) => {
    const { data, error } = await getPhoneTypesById({ id: phoneTypeId });
    if (data && !error) {
      setIsSystem(!!data?.is_system);
      reset({
        name: data?.name || '',
      });
    }
  };

  const onSubmit = handleSubmit(async (value) => {
    if (id) {
      const data = await updatePhoneType({
        id,
        data: {
          name: value.name,
          type: EntityAttributesEnum.PHONE_TYPE,
          toastMsg:
            ToastMsg.settings.generalSettings.commonControls.phoneType
              .updateMsg,
        },
        params: { ...MODULE_PERMISSION.CONTACT.update },
      });

      if (data) {
        if (onEdit) {
          onEdit();
        }
        close();
      }
    }
  });

  const close = () => {
    reset();
    closeModal();
  };
  const onCancelModal = () => {
    const isDirtyFields = Object.values(dirtyFields);
    if (isDirtyFields.length) {
      setOpenDiscardModal(true);
    } else {
      close();
    }
  };
  return isOpen ? (
    <Modal
      title={isSystem ? 'View Phone Type' : 'Update Phone Type'}
      visible={isOpen}
      onClose={() => onCancelModal()}
      onCancel={() => onCancelModal()}
      onSubmit={onSubmit}
      submitButtonText="Update"
      submitBtnDisabled={isSystem}
      submitLoading={isLoading || isUpdateLoading}
    >
      {isLoading ? (
        <PhoneTypeFormSkeleton />
      ) : (
        <form onSubmit={onSubmit}>
          <PhoneTypeForm
            errors={errors}
            register={register}
            isSystem={isSystem}
          />
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

export default EditPhoneTypeModal;
