// ** import packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

// ** components **
import Button from 'components/Button';
import FormField from 'components/FormField';

// ** types  **
import { Option } from 'components/FormField/types/formField.types';
import type {
  PermissionObj,
  ProfileData,
} from 'pages/Setting/user-setting/ProfilePermissions/types/profile-permissions.types';
import ProfileSkeleton from '../skeletons/ProfileSkeleton';

import {
  useLazyProfileIsExistQuery,
  useLazyUseGetProfilesQuery,
} from 'redux/api/profileApi';
import { useLazyGetProfilePermissionsByIdQuery } from 'redux/api/permissionsApi';

export interface Props {
  profileData?: ProfileData;
  setProfileData: (data: ProfileData) => void;
  setPermissionData: (data: PermissionObj[]) => void;
  goBack?: () => void;
}

const profileSchema = yup.object({
  name: yup.string().required('Profile name is required'),
});

const Profile = (props: Props) => {
  let abortFlag = false;

  const { profileData, setProfileData, setPermissionData, goBack } = props;

  let defaultValues = {};
  if (profileData) {
    defaultValues = {
      name: profileData.name,
      clone_from: profileData.clone_from,
      description: profileData.description,
    };
  }

  // ================= States ===================
  const [profileOptions, setProfileOptions] = useState<Option[]>([]);

  // ================= Custom hooks =============
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<ProfileData>({
    resolver: yupResolver(profileSchema),
    defaultValues,
  });
  const selectedProfile = watch('clone_from');

  // ** APIS **
  const [getProfilesAPI, { isLoading: isProfileLoading }] =
    useLazyUseGetProfilesQuery();
  const [getProfileIsExistAPI, { isLoading: checkingProfileIsExist }] =
    useLazyProfileIsExistQuery();
  const [getProfilePermissionsByIdAPI, { isLoading: isFetchingPermissions }] =
    useLazyGetProfilePermissionsByIdQuery();

  useEffect(() => {
    if (selectedProfile) {
      const profileId = selectedProfile;
      if (profileId) getPermissionsByProfileId(profileId);
    }
    return () => {
      abortFlag = true;
    };
  }, [selectedProfile]);

  const getAllProfileOptions = async () => {
    const data = await getProfilesAPI({}, true);
    const { rows } = data.data;
    if (rows && !('error' in data) && !abortFlag) {
      const options = rows.map((option: { name: string; id: number }) => ({
        label: option.name,
        value: option.id,
      }));
      setProfileOptions(options);
    }
  };

  useEffect(() => {
    getAllProfileOptions();
    return () => {
      abortFlag = true;
    };
  }, []);

  const getPermissionsByProfileId = async (id: number) => {
    const data = await getProfilePermissionsByIdAPI({ id });
    if ('data' in data && Array.isArray(data?.data) && !abortFlag) {
      setPermissionData(data?.data);
    }
  };

  const onSubmit = async (profileDataArgs: ProfileData) => {
    const { data, error } = await getProfileIsExistAPI({
      params: {
        name: profileDataArgs.name,
      },
    });

    if (data && error) {
      setError('name', { type: 'custom', message: error.message });
    } else {
      setProfileData(profileDataArgs);
    }
  };

  return (
    <>
      {isProfileLoading ? (
        <>
          <ProfileSkeleton />
        </>
      ) : (
        <>
          <div className="fixed__wrapper__CreateProfile w-[1080px] max-w-full pb-[70px] md:pb-[50px]">
            <p className="text-[16px] font-biotifRegular text-light__TextColor mb-[30px]">
              Profile is a set of permissions dealing with module access and
              operations, setup customizations, and access to various apps. You
              can provide different set of permissions to various users.
            </p>
            <div className="w-[660px] max-w-full">
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormField<ProfileData>
                  required
                  type="text"
                  name="name"
                  label="Profile Name"
                  labelClass="if__label__blue"
                  placeholder="Profile Name"
                  register={register}
                  error={errors.name}
                  fieldLimit={50}
                />
                <FormField<ProfileData>
                  isClearable
                  id="clone_from"
                  options={profileOptions}
                  type="select"
                  name="clone_from"
                  label="Clone From"
                  labelClass="if__label__blue"
                  control={control}
                  error={errors.clone_from}
                />
                <FormField<ProfileData>
                  type="textarea"
                  name="description"
                  label="Description"
                  labelClass="if__label__blue"
                  placeholder="Description"
                  register={register}
                  fieldLimit={500}
                  error={errors.description}
                />

                <div className="flex flex-wrap action__fixed__btn__CreateProfile">
                  <Button
                    className="cancel__btn secondary__Btn mr-[7px] min-w-[120px] sm:min-w-[calc(50%_-_7px)]"
                    onClick={goBack}
                  >
                    Cancel
                  </Button>
                  <Button
                    isLoading={checkingProfileIsExist}
                    type="submit"
                    className="save__btn primary__Btn min-w-[120px] py-[11px] ml-[7px] sm:min-w-[calc(50%_-_7px)]"
                    isDisabled={isProfileLoading || isFetchingPermissions}
                  >
                    Next
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
