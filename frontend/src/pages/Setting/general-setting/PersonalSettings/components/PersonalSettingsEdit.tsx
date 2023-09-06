// ** import packages **
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// ** redux **
import {
  getCurrentUser,
  setUserDateFormat,
  setUserProfile,
  setUserData as setUserDataForRedux,
} from 'redux/slices/authSlice';

// ** components **
import PersonalSettingsForm from 'pages/Setting/general-setting/PersonalSettings/components/PersonalSettingsForm';
import PersonalSettingsFormSkeleton from 'pages/Setting/general-setting/PersonalSettings/skeletons/PersonalSettingsFormSkeleton';

// ** types **
import {
  PersonalInfoType,
  PersonalSettingsFormFields,
} from 'pages/Setting/general-setting/PersonalSettings/types/personal-settings.types';

// ** others **
import generatePersonalSettingFormData from '../helper/personalSettings.helper';
import { Option } from 'components/FormField/types/formField.types';
import { isInt } from 'utils/util';
import {
  useLazyGetUserByIdQuery,
  useUpdateUserMutation,
} from 'redux/api/userApi';

interface Props {
  setViewMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserSettingsEdit = ({ setViewMode }: Props) => {
  let abortFlag = false;
  // ** Hooks **
  const dispatch = useDispatch();
  const currentUserId = useSelector(getCurrentUser)?.id;

  // ** State **
  const [userData, setUserData] = useState<PersonalInfoType>();
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

  // ** APIS **
  const [getUserByIdAPI, { isLoading: getUserLoading }] =
    useLazyGetUserByIdQuery();
  const [updateUserByIdAPI, { isLoading }] = useUpdateUserMutation();

  useEffect(() => {
    if (currentUserId) {
      getUserDetail(currentUserId);
    }
    return () => {
      abortFlag = true;
    };
  }, [currentUserId]);

  const onCancelForm = () => {
    setViewMode(true);
  };

  const getUserDetail = async (currentUserIdArgs: number) => {
    const data = await getUserByIdAPI(
      {
        id: currentUserIdArgs,
        params: {
          'include[roles]': 'id',
          'include[state]': 'id,name',
          'include[country]': 'id,name,iso3,iso2',
        },
      },
      true
    );

    if ('data' in data && !abortFlag) {
      const { UserPlatform, UserProfile, ...otherData } = data.data;
      otherData.role = otherData.roles?.[0]?.id;
      if (UserPlatform?.[0]?.platform) {
        otherData.platformName = UserPlatform?.[0]?.platform.name || '';
      }
      if (UserProfile?.[0]?.profile) {
        const { name, id } = UserProfile[0].profile;
        if (name && id) {
          otherData.profile = id;
          otherData.profileName = name || '';
        }
      }

      const {
        id,
        first_name,
        last_name,
        phone,
        mobile,
        email,
        country,
        state,
        city,
        county,
        address1,
        address2,
        website,
        facebook,
        twitter,
        linkedin,
        birth_date,
        zip,
        fax,
        profile_image,
        role,
        report_to,
        date_format,
        user_signature,
        timezone,
      } = otherData;

      const state_code = isInt(Number(state?.state_code))
        ? `${country?.iso2 || ''}-${state?.state_code}`
        : state?.state_code || '';

      setAddressOptions({
        country: {
          label: country?.name || 'United States',
          value: country?.id || 233,
        },
        state: {
          label: state_code || 'FL',
          value: state?.id || 1436,
        },
      });

      setUserData({
        id,
        first_name,
        last_name,
        phone,
        mobile,
        email,
        country_id: id && country?.id ? country?.id : 233,
        state_id: id && country?.id ? state?.id || 0 : 1436,
        city: city || '',
        county: county || '',
        address1: address1 || '',
        address2,
        website,
        facebook,
        twitter,
        linkedin,
        birth_date,
        zip: zip || '',
        fax,
        profile_image,
        role,
        report_to,
        date_format,
        user_signature,
        timezone: timezone || 'America/New_York',
      });
    }
  };

  const userDataSubmit = async (formVal: PersonalSettingsFormFields) => {
    const PersonalSettingFormData = generatePersonalSettingFormData(formVal);

    if (userData?.id) {
      const data = await updateUserByIdAPI({
        id: userData.id,
        data: PersonalSettingFormData,
      });
      if ('data' in data) {
        dispatch(
          setUserDataForRedux({
            user: data.data.user,
          })
        );

        if (data?.data?.user && data?.data?.user?.profile_image)
          dispatch(setUserProfile(data?.data?.user.profile_image));
        if (data?.data?.user && data?.data?.user?.date_format)
          dispatch(setUserDateFormat(data?.data?.user.date_format));
        setViewMode((prev) => !prev);
      }
    }
  };

  return (
    <div className="ipTabsWrapper">
      <div className="ipTabs">
        <div className="ipTabsContantWrapper">
          {!getUserLoading ? (
            userData ? (
              <PersonalSettingsForm
                submitForm={userDataSubmit}
                initialValue={userData}
                cancelForm={onCancelForm}
                isLoading={isLoading}
                currentUser
                setAddressOptions={setAddressOptions}
                addressOptions={addressOptions}
              />
            ) : (
              <></>
            )
          ) : (
            <PersonalSettingsFormSkeleton />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSettingsEdit;
