// ** import packages **
import React, { useEffect, useState } from 'react';

// ** redux **
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'redux/slices/authSlice';

// ** components **
import PersonalSettingsViewSkeleton from 'pages/Setting/general-setting/PersonalSettings/skeletons/PersonalSettingsViewSkeleton';
import { PersonalSettingViewDetails } from './PersonalSettingViewDetails';


import { useLazyGetUserByIdQuery } from 'redux/api/userApi';

interface Props {
  setViewMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const PersonalSettingsView = ({ setViewMode }: Props) => {
  let abortFlag = false;
  // * Hooks **
  const currentUserId = useSelector(getCurrentUser)?.id;

  // ** State **
  const [currentUser, setCurrentUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    mobile: '',
    website: '',
    city: '',
    state: {
      id: 0,
      name: '',
      state_code: '',
    },
    country: {
      id: 0,
      name: '',
      iso3: '',
      iso2: '',
    },
    address1: '',
    address2: '',
    zip: '',
    birth_date: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    profileName: '',
    platformName: '',
    organizationName: '',
    profile_image: '',
    reportToName: '',
    fax: '',
    date_format: '',
    added_by_user: { id: null, first_name: '', last_name: '', full_name: '' },
  });


  // ** APIS **
  const [getUserByIdAPI, { isLoading: getUserLoading }] = useLazyGetUserByIdQuery();

  const getUserDetail = async (currentUserIdArg: number) => {
    const data = await getUserByIdAPI({
      id: currentUserIdArg,
      params: {
        'include[roles]': 'id,name',
        'include[added_by_user]': 'id,full_name,first_name,last_name',
        'include[state]': 'id,name',
        'include[country]': 'id,name,iso3,iso2',
      },
    },
      true
    );
    if ("data" in data && !abortFlag) {
      const {
        UserOrganization,
        UserPlatform,
        roles,
        report_to_user,
        ...otherData
      } = data.data;
      if (UserOrganization?.[0]?.organization) {
        otherData.organizationName =
          UserOrganization?.[0]?.organization.name || '';
      }
      if (UserPlatform?.[0]?.platform) {
        otherData.platformName = UserPlatform?.[0]?.platform.name || '';
      }
      if (roles?.[0]) {
        otherData.profileName = roles?.[0].name || '';
      }
      if (report_to_user?.user_reporter) {
        otherData.reportToName =
          report_to_user?.user_reporter?.full_name ||
          `${report_to_user?.user_reporter.first_name} ${report_to_user?.user_reporter.last_name}`;
      }
      setCurrentUser({ ...currentUser, ...otherData });
    }
  };

  useEffect(() => {
    if (currentUserId) getUserDetail(currentUserId);
    return () => {
      abortFlag = true;
    };
  }, [currentUserId]);

  const handleEdit = () => setViewMode((prev) => !prev);

  return (
    <div>
      {!getUserLoading ? (
        <>
          <PersonalSettingViewDetails
            currentUserId={currentUserId}
            handleEdit={handleEdit}
            userData={currentUser}
          />
        </>
      ) : (
        <PersonalSettingsViewSkeleton />
      )}
    </div>
  );
};

export default PersonalSettingsView;
