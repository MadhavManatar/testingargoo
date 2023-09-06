// ** Import Packages **
import { useDispatch, useSelector } from 'react-redux';

// ** Redux **
import {
  getCurrentUserPermissions,
  setLogoutData,
} from 'redux/slices/authSlice';
import { getUserNotificationSubscription } from 'redux/slices/commonSlice';

// ** Services **
import { useDeleteUserSubscriptionsAPI } from 'services/notification.service';
import { useLogOutAPI } from 'pages/auth/services/auth.service';

// ** Type **
import { permissionOperatorEnum } from 'pages/auth/types/authGuard.types';

// ** Constant **
import {
  ActivityPermissions,
  BasicPermissionTypes,
  ModuleNames,
  TagPermissions,
} from 'constant/permissions.constant';

// ** Other **
import { isOrganizationOwner } from 'utils/is';
import { persistor } from 'redux/store';

const useAuth = () => {
  // ** Hooks **
  const dispatch = useDispatch();
  const currentUserPermissions = useSelector(getCurrentUserPermissions);
  const { deleteUserSubscriptionsAPI } = useDeleteUserSubscriptionsAPI();
  const { logOutUser } = useLogOutAPI();
  const userSubscription = useSelector(getUserNotificationSubscription);

  const hasAuthorized = (
    permissions: {
      module?: ModuleNames;
      type?:
        | BasicPermissionTypes
        | TagPermissions
        | ActivityPermissions
        | ModuleNames;
    }[],
    operator: permissionOperatorEnum = permissionOperatorEnum.AND
  ) => {
    const isOrgOwner = isOrganizationOwner();
    if (isOrgOwner) {
      return true;
    }

    if (operator === permissionOperatorEnum.AND) {
      return permissions.every((permission) =>
        currentUserPermissions.some(
          (currModule) =>
            currModule.name === permission.module &&
            currModule.permissions.find((per) => per.name === permission.type)
              ?.status === 'ACTIVE'
        )
      );
    }
    return permissions.some((permission) =>
      currentUserPermissions.some(
        (currModule) =>
          currModule.name === permission.module &&
          currModule.permissions.find((per) => per.name === permission.type)
            ?.status === 'ACTIVE'
      )
    );
  };

  const logout = async () => {
    try {
      if (userSubscription?.id) {
        await deleteUserSubscriptionsAPI({
          data: { allId: [userSubscription.id] },
        });
      }
      await logOutUser();
      dispatch(setLogoutData());
      persistor.purge();
      // navigate('/login');
      window.location.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return { hasAuthorized, logout };
};

export default useAuth;
