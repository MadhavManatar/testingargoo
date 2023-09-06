// ** external packages **
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// ** redux **
import {
  getAuth,
  setAuthInitialized,
  setCredentials,
  setOrganizationUUID,
  setPermissions,
} from 'redux/slices/authSlice';

// ** services **
import { setNotificationInterval } from 'redux/slices/notificationSlice';
import { NOTIFICATION_INTERVAL_TIME } from 'constant';
import { useLazyGetLoggedUserQuery } from 'redux/api/userApi';

const useAuthGuard = () => {
  let abortFlag = false;

  // ===================== Hooks =======================
  const dispatch = useDispatch();
  const { isAuthenticated, isAuthInitialized } = useSelector(getAuth);

  // ** APIS **
  const [getLoggedInUserAPI, { isLoading }] = useLazyGetLoggedUserQuery();

  useEffect(() => {
    loadUser();
    return () => {
      abortFlag = true;
    };
  }, []);

  const loadUser = async () => {
    if (!isAuthenticated && !isAuthInitialized) {
      const organizationUUID = localStorage.getItem('organization_uuid');
      if (organizationUUID) {
        const { data, error } = await getLoggedInUserAPI({});

        if (!error && data && !abortFlag) {
          const { user, permissions, two_factor_enabled, two_factor_verified } =
            data;
          if (
            !two_factor_enabled ||
            (two_factor_enabled && two_factor_verified)
          ) {
            if (organizationUUID)
              dispatch(setOrganizationUUID(organizationUUID));
            dispatch(setCredentials({ user }));
            dispatch(setPermissions(permissions));
            dispatch(setNotificationInterval(NOTIFICATION_INTERVAL_TIME));
          }
        }
      }
      dispatch(setAuthInitialized());
    }
  };

  return {
    isLoading,
    isAuthenticated,
    isAuthInitialized,
  };
};

export default useAuthGuard;
