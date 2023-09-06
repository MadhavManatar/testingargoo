// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

// ** Components **
import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/Button';
import FileUpload from 'components/FileUpload';
import RouteChangeConformationModal from 'components/Modal/RouteChangeConformationModal';
import PersonalSettingsFormSkeleton from 'pages/Setting/general-setting/PersonalSettings/skeletons/PersonalSettingsFormSkeleton';
import UserForm from 'pages/Setting/user-setting/User/components/UserForm';

// ** Types **
import { AddUserFormFields } from '../types/user.types';

// ** Services **
import { useGetUserDetails } from '../hooks/useUserService';

// ** Schema **
import { userSchema } from '../validation-schema/user.schema';

// ** Constant **
import { ALLOWED_MIME_TYPES, BREAD_CRUMB } from 'constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

// ** Others **
import { convertNumberOrNull, isInt, setUrlParams } from 'utils/util';
import generateUserFormData from '../helper/user.helper';
import { Option } from 'components/FormField/types/formField.types';
import { useUpdateUserMutation } from 'redux/api/userApi';

const EditUser = () => {
  // ** Hooks **
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = convertNumberOrNull(id);

  // ** States **
  const [customIsDirty, setCustomIsDirty] = useState<boolean>(true);
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

  // ** Custom Hooks **
  const { currentUser, isUserLoading } = useGetUserDetails(userId);

  // ** APIS **
  const [updateUserByIdAPI, { isLoading }] = useUpdateUserMutation();

  const formMethods = useForm<AddUserFormFields>({
    resolver: yupResolver(userSchema),
  });

  const {
    register,
    formState: { errors, dirtyFields },
    handleSubmit,
    reset,
    control,
    watch,
    setError,
    clearErrors,
    setValue,
  } = formMethods;

  const profile_image = watch('profile_image');

  useEffect(() => {
    const {
      first_name,
      last_name,
      phone,
      email,
      mobile,
      country_id,
      state_id,
      city,
      county,
      address1,
      address2,
      facebook,
      twitter,
      linkedin,
      birth_date,
      zip,
      fax,
      website,
      roles,
      report_to_user,
      user_signature,
      timezone,
      profile_image: user_profile_image,
      id: user_id,
    } = currentUser;

    const state_code = isInt(Number(currentUser?.state?.state_code))
      ? `${currentUser?.country?.iso2 || ''}${currentUser?.state?.state_code}`
      : currentUser?.state?.state_code || '';

    setAddressOptions({
      country: {
        label: currentUser?.country?.name || 'United States',
        value: currentUser?.country?.id || 233,
      },
      state: {
        label: state_code || 'FL',
        value: currentUser?.state?.id || 1436,
      },
    });

    reset({
      first_name: first_name || '',
      last_name: last_name || '',
      phone: phone || '',
      email: email || '',
      mobile: mobile || '',
      country_id: user_id && country_id ? country_id : 233,
      state_id: user_id && country_id ? state_id : 1436,
      city: city || '',
      county: county || '',
      address1: address1 || '',
      address2: address2 || '',
      facebook: facebook || '',
      twitter: twitter || '',
      linkedin: linkedin || '',
      birth_date: birth_date || '',
      zip: zip || '',
      profile_image: user_profile_image || '',
      fax: fax || '',
      website: website || '',
      role: roles[0]?.id ? `${roles[0]?.id}` : '',
      report_to: report_to_user?.user_reporter.id,
      user_signature: user_signature || '',
      timezone: timezone || 'America/New_York',
    });
  }, [currentUser]);

  const cancelForm = () => {
    navigate(-1);
  };

  const onSubmit = handleSubmit(async (formValue) => {
    if (userId) {
      // we are set setCustomIsDirty to false cause after submit DirtyField value is always true
      setCustomIsDirty(false);
      const UserFormData = generateUserFormData(formValue);
      const data = await updateUserByIdAPI({ id: userId, data: UserFormData });
      if ('data' in data) {
        navigate(setUrlParams(PRIVATE_NAVIGATION.settings.user.detailPage, id));
        reset();
      }
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
        setValue('profile_image', file);
      } else {
        setError('profile_image', {
          type: 'custom',
          message: 'Please upload image less than 10 MB',
        });
      }
    } else {
      setError('profile_image', {
        type: 'custom',
        message: 'Only PNG,JPEG,JPG are allowed',
      });
    }
  };

  return (
    <>
      {userId && (
        <>
          <Breadcrumbs path={BREAD_CRUMB.editUser} />
          <div>
            <div className="ipTabsWrapper">
              <div className="ipTabs">
                <div className="ipTabsContantWrapper">
                  {!isUserLoading && currentUser.id ? (
                    <div className="fixed__wrapper__UserEditSettings">
                      <FormProvider {...formMethods}>
                        <form onSubmit={onSubmit}>
                          <div className="upload__File__grayBox upload__File">
                            <FileUpload
                              error={errors.profile_image}
                              setFileObjectCb={(value) =>
                                setValue('profile_image', value)
                              }
                              image={profile_image}
                              onFileChange={onFileSelect}
                              fileUploadText="Upload User Image"
                            />
                          </div>
                          <UserForm
                            userId={userId}
                            control={control}
                            errors={errors}
                            user_signature={currentUser.user_signature}
                            register={register}
                            id={currentUser.id}
                            roles={currentUser.roles}
                            reportTo={currentUser.report_to_user}
                            verifiedUser={currentUser.verified}
                            timezone={currentUser.timezone}
                            setAddressOptions={setAddressOptions}
                            addressOptions={addressOptions}
                          />
                          <div className="flex flex-wrap action__fixed__btn__UserEditSettings">
                            <Button
                              className="cancel__btn secondary__Btn mr-[7px] min-w-[120px] sm:min-w-[calc(50%_-_7px)]"
                              onClick={() => cancelForm()}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="save__btn primary__Btn min-w-[120px] py-[11px] ml-[7px] sm:min-w-[calc(50%_-_7px)]"
                              type="submit"
                              isLoading={isLoading}
                            >
                              Update
                            </Button>
                          </div>
                        </form>
                      </FormProvider>
                    </div>
                  ) : (
                    <PersonalSettingsFormSkeleton />
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <RouteChangeConformationModal
        isDirtyCondition={
          Object.values(dirtyFields)?.length > 0 && customIsDirty
        }
      />
    </>
  );
};

export default EditUser;
