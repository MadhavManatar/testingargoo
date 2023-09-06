// ** Import Packages **
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ** Components **
import Breadcrumbs from 'components/Breadcrumbs';
import Permissions from './Permissions';
import Profile from './Profile';

// ** Types **
import type {
  PermissionObj,
  ProfileData,
} from 'pages/Setting/user-setting/ProfilePermissions/types/profile-permissions.types';

// ** Constant **
import { BREAD_CRUMB } from 'constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { useAddProfileMutation } from 'redux/api/profileApi';
import { useLazyGetAllProfilePermissionsQuery } from 'redux/api/permissionsApi';

const AddProfile = () => {
  let abortFlag = false;
  // ** hooks **
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState('profile');
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    description: '',
  });
  const [permissions, setPermissions] = useState<PermissionObj[]>([]);

  // ** APIS **
  const [addProfileAPI, { isLoading: isAddProfileLoading }] =
    useAddProfileMutation();
  const [getProfileAllPermissionAPI, { isLoading: isAllPermissionsLoading }] =
    useLazyGetAllProfilePermissionsQuery();

  const setInitialPermissions = async () => {
    const data = await getProfileAllPermissionAPI({}, true);
    if ('data' in data && Array.isArray(data.data) && !abortFlag) {
      setPermissions(data.data);
    }
  };

  useEffect(() => {
    setInitialPermissions();
    return () => {
      abortFlag = true;
    };
  }, []);

  const setProfileData = (data: ProfileData) => {
    setFormData(data);
    setCurrentStep('permissions');
  };

  const savePermissions = async () => {
    const tempPermissions = _.cloneDeep(permissions);
    tempPermissions.forEach((obj) => {
      delete obj.child_section;
      delete obj.parent_section;
      delete obj.status;
      obj.permissions = obj.permissions.map((permission) => ({
        name: permission.name,
        value: permission.id,
        status: permission.status,
      }));
    });

    const finalData = {
      name: formData.name,
      description: formData.description,
      modules: tempPermissions,
    };

    const data = await addProfileAPI({ data: finalData });
    if (!('error' in data))
      navigate(PRIVATE_NAVIGATION.settings.profileAndPermissions.view);
  };

  return (
    <div>
      <Breadcrumbs path={BREAD_CRUMB.createProfilePermissions} />
      {currentStep === 'profile' && (
        <Profile
          profileData={formData}
          setProfileData={setProfileData}
          setPermissionData={setPermissions}
          goBack={() =>
            navigate(PRIVATE_NAVIGATION.settings.profileAndPermissions.view)
          }
        />
      )}
      {currentStep === 'permissions' && (
        <Permissions
          getPermissionsLoading={isAllPermissionsLoading}
          savePermissionsLoading={isAddProfileLoading}
          permissionsData={permissions}
          setPermissionData={setPermissions}
          savePermissions={savePermissions}
          goBack={() => setCurrentStep('profile')}
        />
      )}
    </div>
  );
};

export default AddProfile;
