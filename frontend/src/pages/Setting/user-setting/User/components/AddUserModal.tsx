// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

// ** Components **
import FileUpload from 'components/FileUpload';
import Modal from 'components/Modal';
import UserForm from './UserForm';

// ** Types **
import {
  AddUserFormFields,
  AddUserModalPropsType,
} from 'pages/Setting/user-setting/User/types/user.types';

// ** Services **
import { useEmailIsExistsAPI } from 'pages/auth/services/auth.service';

// ** Schema **
import { userSchema } from 'pages/Setting/user-setting/User/validation-schema/user.schema';

// ** Constant **
import { ALLOWED_MIME_TYPES, NAME_BADGE_COLOR_COMBINATIONS } from 'constant';
import { Option } from 'components/FormField/types/formField.types';

const AddUserModal = (props: AddUserModalPropsType) => {
  const { addUser, closeModal, isOpen, isLoading, setUserInfo } = props;

  const [profileImage, setProfileImage] = useState<string | File>('');
  const [addressOptions, setAddressOptions] = useState<{
    state: Option;
    country: Option;
  }>({
    country: {
      label: 'United States',
      value: 233,
    },
    state: {
      label: 'FL',
      value: 1436,
    },
  });

  const { emailIsExistsAPI, isLoading: checkMailLoading } =
    useEmailIsExistsAPI();
  const formMethods = useForm<AddUserFormFields>({
    resolver: yupResolver(userSchema),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control,
    setError,
    clearErrors,
  } = formMethods;

  useEffect(() => {
    if (isOpen) {
      reset();
      setProfileImage('');
    }
  }, [isOpen]);

  useEffect(() => {
    reset({
      timezone: 'America/New_York',
      state_id: 1436,
      country_id: 233,
      address1: '',
      zip: '',
    });
  }, []);

  const onSubmit = handleSubmit(async (value) => {
    const { error } = await emailIsExistsAPI({
      email: value.email,
    });
    if (error) {
      if (error === 'Email already exist!')
        setError('email', {
          type: 'custom',
          message: error,
        });
    } else {
      if (setUserInfo) setUserInfo([]);
      addUser({
        ...value,
        profile_image: profileImage,
        initial_color: NAME_BADGE_COLOR_COMBINATIONS[
            Math.floor(Math.random() * NAME_BADGE_COLOR_COMBINATIONS.length)
          ]?.Color,
      });
    }
  });

  const onFileSelect: React.ChangeEventHandler<HTMLInputElement> | undefined = (
    e
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file && ALLOWED_MIME_TYPES.includes(file.type)) {
      if (file.size < 10 * 1024 * 1024) {
        clearErrors('profile_image');
        setProfileImage(file);
      } else {
        setError('profile_image', {
          type: 'custom',
          message: 'Please upload image less than 2MB',
        });
      }
    } else {
      setError('profile_image', {
        type: 'custom',
        message: 'Only PNG,JPEG,JPG are allowed',
      });
    }
  };
  const close = () => {
    reset();
    closeModal();
    setProfileImage('');
  };

  return isOpen ? (
    <Modal
      title="Add New User"
      visible={isOpen}
      onClose={() => close()}
      onCancel={() => close()}
      onSubmit={onSubmit}
      submitLoading={isLoading || checkMailLoading}
      width="800px"
    >
      <FormProvider {...formMethods}>
        <form onSubmit={onSubmit}>
          <div className="upload__File__grayBox upload__File">
            <FileUpload
              error={errors.profile_image}
              setFileObjectCb={setProfileImage}
              image={profileImage}
              onFileChange={onFileSelect}
              fileUploadText="Upload User Image"
            />
          </div>
          <UserForm
            control={control}
            errors={errors}
            register={register}
            setAddressOptions={setAddressOptions}
            addressOptions={addressOptions}
          />
        </form>
      </FormProvider>
    </Modal>
  ) : (
    <></>
  );
};

export default AddUserModal;
