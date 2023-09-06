// ** Import Packages **
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// ** Components **
import Breadcrumbs from 'components/Breadcrumbs';
import Permissions from './Permissions';

// ** Redux **
import {
  getCurrentUserProfile,
  setPermissions as setCurrentPermissions,
} from 'redux/slices/authSlice';

// ** Hook **
import useToast from 'hooks/useToast';


// ** Type **
import { PermissionObj } from 'pages/Setting/user-setting/ProfilePermissions/types/profile-permissions.types';

// ** Constants **
import { BREAD_CRUMB } from 'constant';
import { ToastMsg } from 'constant/toast.constants';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { useLazyGetProfilePermissionsByIdQuery, useUpdateProfilePermissionMutation } from 'redux/api/permissionsApi';

const EditProfile = () => {
  let abortFlag = false;

  // ** hooks **
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: currentProfileId } = useSelector(getCurrentUserProfile);

  // ** State **
  const [permissions, setPermissions] = useState<PermissionObj[]>([]);

  // ** Custom hooks **
  const { setToastMessage } = useToast();

  // ** APIS **
  const [getProfilePermissionsByIdAPI, { isLoading: isGetPermissionLoading }] =
    useLazyGetProfilePermissionsByIdQuery();
  const [
    updateProfilePermissionsByIdAPI,
    { isLoading: isUpdatePermissionLoading }
  ] = useUpdateProfilePermissionMutation();


  const getPermissionsById = async (id: number) => {
    const data = await getProfilePermissionsByIdAPI({ id });
    if (("data" in data) && !abortFlag) {
      setPermissions(data.data);
    }
  };

  useEffect(() => {
    const profileId = Number(params.profileId);
    if (!profileId) {
      setToastMessage({
        message:
          ToastMsg.settings.userAndControl.profileAndPermission
            .inValidProfileId,
        type: 'error',
      });
      return navigate(PRIVATE_NAVIGATION.settings.profileAndPermissions.view);
    }

    getPermissionsById(profileId);
    return () => {
      abortFlag = true;
    };
  }, []);

  const savePermissions = async () => {
    const profileId = Number(params.profileId);

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

    const updateData = {
      modules: tempPermissions,
    };

    const data = await updateProfilePermissionsByIdAPI({ id: profileId, data: updateData });

    if (!("error" in data)) {
      /* If user update own profile */

      if (currentProfileId === profileId) {
        updateCurrentProfilePermissions(profileId);
      }
      navigate(PRIVATE_NAVIGATION.settings.profileAndPermissions.view);
    }
  };

  const updateCurrentProfilePermissions = async (id: number) => {
    const data = await getProfilePermissionsByIdAPI({
      id,
      params: { withAll: true }
    }, true);

    if ("data" in data && Array.isArray(data)) {
      dispatch(setCurrentPermissions(data));
    }
  };

  return (
    <div>
      <Breadcrumbs path={BREAD_CRUMB.updateProfilePermissions} />

      <Permissions
        getPermissionsLoading={isGetPermissionLoading}
        savePermissionsLoading={isUpdatePermissionLoading}
        permissionsData={permissions}
        setPermissionData={setPermissions}
        savePermissions={savePermissions}
        goBack={() =>
          navigate(PRIVATE_NAVIGATION.settings.profileAndPermissions.view)
        }
      />
    </div>
  );
};

export default EditProfile;
