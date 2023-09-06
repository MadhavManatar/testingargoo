// ** import packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

// ** components **
import Modal from 'components/Modal';
import PhoneTypeForm from './PhoneTypeForm';

// ** types **
import {
  AddPhoneTypeModalPropsType,
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
import { useAddPhoneTypeMutation } from 'redux/api/phoneTypeApi';

const AddPhoneTypeModal = (props: AddPhoneTypeModalPropsType) => {
  const { closeModal, isOpen, onAdd, setPhoneTypeInfo } = props;

  // ** Custom hooks **
  const [addPhoneTypeAPI, { isLoading: isAddContactTypeLoading }] =
    useAddPhoneTypeMutation();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<phoneTypeFieldType>({
    resolver: yupResolver(phoneTypeSchema),
  });

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen]);

  const onSubmit = handleSubmit(async (value) => {
    const data = await addPhoneTypeAPI({
      data: {
        name: value.name,
        type: EntityAttributesEnum.PHONE_TYPE,
        toastMsg:
          ToastMsg.settings.generalSettings.commonControls.phoneType.createMsg,
      },
      params: { ...MODULE_PERMISSION.CONTACT.create },
    });

    if (data) {
      if (setPhoneTypeInfo) setPhoneTypeInfo([]);
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
      title="New Phone Type"
      visible={isOpen}
      onClose={() => close()}
      onCancel={() => close()}
      onSubmit={onSubmit}
      submitButtonText="Add"
      submitLoading={isAddContactTypeLoading}
    >
      <form onSubmit={onSubmit}>
        <PhoneTypeForm errors={errors} register={register} />
      </form>
    </Modal>
  ) : (
    <></>
  );
};

export default AddPhoneTypeModal;
