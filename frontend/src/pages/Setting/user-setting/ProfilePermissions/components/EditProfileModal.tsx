// ** import packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

// ** components **
import FormField from 'components/FormField';
import Modal from 'components/Modal';
import DiscardConfirmationModal from '../../../../../components/Modal/DiscardConfirmationModal';

// ** types **
import type { ProfileData } from 'pages/Setting/user-setting/ProfilePermissions/types/profile-permissions.types';

// ** others **
import { hasPermissionForChangeProfileName } from 'utils/has';
import { useState } from 'react';

const profileSchema = yup.object({
  name: yup.string().required('Profile name is required'),
});

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  profileData: ProfileData;
  setProfileData: (data: ProfileData) => void;
  loading: boolean;
}

const EditProfileModal = (props: Props) => {
  const { isOpen, closeModal, profileData, setProfileData, loading } = props;
  // ** states **
  const [openDiscardModal, setOpenDiscardModal] = useState<boolean>(false);
  // ** Custom hooks **
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<ProfileData>({
    resolver: yupResolver(profileSchema),
    defaultValues: profileData,
  });

  const onSubmit = (data: ProfileData) => setProfileData(data);

  const close = () => {
    reset();
    closeModal();
  };

  const onCancelForm = () => {
    const isDirtyFields = Object.values(dirtyFields);
    if (isDirtyFields.length) {
      setOpenDiscardModal(true);
    } else {
      close();
    }
  };

  return isOpen ? (
    <Modal
      title="Edit Profile"
      onCancel={() => onCancelForm()}
      onClose={() => onCancelForm()}
      onSubmit={handleSubmit(onSubmit)}
      visible={isOpen}
      submitLoading={loading}
      submitButtonText="Update"
    >
      <FormField<ProfileData>
        disabled={hasPermissionForChangeProfileName(profileData.name)}
        type="text"
        name="name"
        label="Profile Name"
        labelClass="if__label__blue"
        placeholder="Profile Name"
        register={register}
        error={errors.name}
      />
      <FormField<ProfileData>
        type="textarea"
        name="description"
        label="Description"
        labelClass="if__label__blue"
        placeholder="Description"
        register={register}
        error={errors.description}
        fieldLimit={500}
      />
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

export default EditProfileModal;
