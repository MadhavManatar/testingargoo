// ** external packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

// ** components **
import Address from 'components/Address';
import Button from 'components/Button';
import FormField from 'components/FormField';
import PersonalDetails from 'pages/Setting/general-setting/PersonalSettings/components/PersonalDetails';
import SocialDetails from 'pages/Setting/general-setting/PersonalSettings/components/SocialDetails';
import DiscardConfirmationModal from '../../../../../components/Modal/DiscardConfirmationModal';

// ** types **
import { Option } from 'components/FormField/types/formField.types';
import { PersonalSettingsFormFields } from 'pages/Setting/general-setting/PersonalSettings/types/personal-settings.types';

// ** schema **
import { personalSettingsSchema } from 'pages/Setting/general-setting/PersonalSettings/validation-schema/peronal-settings.schema';

interface Props {
  submitForm: (data: PersonalSettingsFormFields) => void;
  initialValue: PersonalSettingsFormFields;
  cancelForm: () => void;
  isLoading: boolean;
  currentUser?: boolean;
  setAddressOptions: React.Dispatch<
    React.SetStateAction<{
      state: Option;
      country: Option;
    }>
  >;
  addressOptions: {
    state: Option;
    country: Option;
  };
}

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];

const PersonalSettingsForm = ({
  submitForm,
  initialValue,
  cancelForm,
  isLoading,
  currentUser,
  addressOptions,
  setAddressOptions,
}: Props) => {
  // ** State **
  const [profileImg, setProfileImg] = useState<string | File>('');

  // ** Custom hooks **
  const methods = useForm<PersonalSettingsFormFields>({
    resolver: yupResolver(personalSettingsSchema),
  });

  // ** states **
  const [openDiscardModal, setOpenDiscardModal] = useState<boolean>(false);

  const {
    handleSubmit,
    reset,
    setError,
    clearErrors,
    register,
    setValue,
    control,
    formState: { errors, dirtyFields },
  } = methods;

  useEffect(() => {
    reset(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (initialValue?.profile_image) setProfileImg(initialValue?.profile_image);
  }, [initialValue.profile_image]);

  const onFileSelect: React.ChangeEventHandler<HTMLInputElement> | undefined = (
    e
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file && ALLOWED_MIME_TYPES.includes(file.type)) {
      if (file.size < 10 * 1024 * 1024) {
        clearErrors('profile_image');
        setProfileImg(file);
      } else {
        setError('profile_image', {
          type: 'custom',
          message: 'Please upload image less than 10MB',
        });
      }
    } else {
      setError('profile_image', {
        type: 'custom',
        message: 'Only PNG,JPEG,JPG are allowed',
      });
    }
  };

  const onSubmit = handleSubmit((value) =>
    submitForm({ ...value, profile_image: profileImg })
  );
  // ** Model Handling **

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
    cancelForm();
  };

  return (
    <>
      <div className="ipTabsContant">
        <div className="fixed__wrapper__PersonalSettings">
          <FormProvider {...methods}>
            <form onSubmit={onSubmit}>
              <PersonalDetails
                setProfileImg={setProfileImg}
                profileImg={profileImg}
                onFileSelect={onFileSelect}
                currentUser={!!currentUser}
                defaultTimezone={{
                  label: initialValue?.timezone || 'America/New_York',
                  value: initialValue?.timezone || 'America/New_York',
                }}
              />
              <div className="personalDetails__address__fields mb-[30px] md:mb-[20px]">
                <Address
                  setAddressOptions={setAddressOptions}
                  addressOptions={addressOptions}
                />
              </div>
              <SocialDetails />
              <div className="mt-[15px]">
                <h3 className="setting__FieldTitle">User Signature</h3>
                <FormField<PersonalSettingsFormFields>
                  type="richTextEditor"
                  control={control}
                  name="user_signature"
                  register={register}
                  setValue={(value) => setValue('user_signature', value)}
                  error={errors?.user_signature}
                />
              </div>
              <div className="flex flex-wrap action__fixed__btn__PersonalSettings">
                <Button
                  className="cancel__btn secondary__Btn mr-[7px] min-w-[120px] sm:min-w-[calc(50%_-_7px)]"
                  onClick={onCancelForm}
                >
                  Cancel
                </Button>
                <Button
                  className="save__btn primary__Btn min-w-[120px] py-[11px] ml-[7px] sm:min-w-[calc(50%_-_7px)]"
                  type="submit"
                  isLoading={isLoading}
                >
                  Save
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
      {openDiscardModal ? (
        <DiscardConfirmationModal
          discardActivity={close}
          isOpen={openDiscardModal}
          closeModal={() => setOpenDiscardModal(false)}
        />
      ) : null}
    </>
  );
};

export default PersonalSettingsForm;
