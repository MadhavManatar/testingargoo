// ** Import Packages **
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// ** Redux **
import { setCalenderActivity } from 'redux/slices/commonSlice';
import { setNotificationInterval } from 'redux/slices/notificationSlice';
import {
  getCurrentUser,
  setAuthenticated,
  setOrganizationUUID,
  setPermissions,
  setUserData,
} from 'redux/slices/authSlice';

// ** Types **
import {
  LoginFormFields,
  loginMethod,
  LoginWithAppleSchema,
  OrganizationOptions,
  TwoFactorTypes,
} from './types/login.types';

// ** Services **

import { useGetReportsUser } from 'pages/Setting/user-setting/User/hooks/useUserService';

import {
  useAppleLoginAPI,
  useGoogleLoginAPI,
  useLoginAPI,
} from '../services/auth.service';
import { convertBtoA } from 'utils/util';

// ** Constant **
import { ModuleNames, POLYMORPHIC_MODELS } from 'constant/permissions.constant';
import {
  GENERAL_SETTING_VALID_KEYS,
  LOGIN_STEP,
  NOTIFICATION_INTERVAL_TIME,
} from 'constant';
import { useLazyGetLoggedUserQuery } from 'redux/api/userApi';
import { useLazyGetGeneralSettingQuery } from 'redux/api/generalSettingApi';
import { useNavigate } from 'react-router-dom';
import { PUBLIC_NAVIGATION } from 'constant/navigation.constant';

interface Props {
  setCurrentStep: React.Dispatch<React.SetStateAction<string>>;
  setOrganizationList: React.Dispatch<
    React.SetStateAction<OrganizationOptions[]>
  >;
  setSocialLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setTwoFactorData: React.Dispatch<
    React.SetStateAction<TwoFactorTypes | undefined>
  >;
}

const useLoginService = ({
  setCurrentStep,
  setOrganizationList,
  setSocialLogin,
  setTwoFactorData,
}: Props) => {
  // ** hooks **
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(getCurrentUser);
  // const twoFactorVerify = useSelector(getTwoFactorVerified);
  // ** Custom Hooks **
  const { loginAPI, isLoading: simpleLoginLoading } = useLoginAPI();
  const { googleLoginAPI, isLoading: googleLoginLoading } = useGoogleLoginAPI();
  const { appleLoginAPI, isLoading: appleLoginLoading } = useAppleLoginAPI();
  const [getLoggedInUserAPI, { isLoading: loggedInUserLoading }] =
    useLazyGetLoggedUserQuery();
  const [getGeneralSettingsAPI] = useLazyGetGeneralSettingQuery();
  const { userOrDescendantUserOptions } = useGetReportsUser();

  // ** states **
  const [currentLoginMethod, setCurrentLoginMethod] = useState<loginMethod>(
    loginMethod.LOGIN
  );

  // login loading manage
  const formLoading = {
    simpleLoginLoader:
      currentLoginMethod === loginMethod.LOGIN &&
      (simpleLoginLoading || loggedInUserLoading),
    googleLoginLoader:
      currentLoginMethod === loginMethod.GOOGLE_LOGIN &&
      (googleLoginLoading || loggedInUserLoading),
    appleLoginLoader:
      currentLoginMethod === loginMethod.APPLE_LOGIN &&
      (appleLoginLoading || loggedInUserLoading),
  };

  // *** general login ***
  const loginUser = async (loginData: LoginFormFields) => {
    setCurrentLoginMethod(loginMethod.LOGIN);
    const formData = { ...loginData };
    delete formData.remember;

    const { data, error } = await loginAPI(formData);

    if (!error && data) {
      setUserRememberToLocal(loginData);
      loginVerifyHandler(data);
    } else if (data?.statusCode === 5002)
      navigate(`${PUBLIC_NAVIGATION.setPassword}?token=${data?.token}`, {
        state: { expiredChangesPass: true },
      });
  };

  // *** login with google account ***
  const loginWithGoogle = async (idToken: string) => {
    setCurrentLoginMethod(loginMethod.GOOGLE_LOGIN);
    setSocialLogin(true);
    const { data, error } = await googleLoginAPI({
      idToken,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    if (data && !error) loginVerifyHandler(data);
    else if (data?.statusCode === 5002)
      navigate(`/set-password?token=${data?.token}`);
  };

  // *** login with apple account ***
  const loginWithApple = async (response: LoginWithAppleSchema) => {
    setCurrentLoginMethod(loginMethod.APPLE_LOGIN);
    setSocialLogin(true);
    const { data, error } = await appleLoginAPI({
      ...response,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    if (data && !error) loginVerifyHandler(data);
    else if (data?.statusCode === 5002)
      navigate(`/set-password?token=${data?.token}`);
  };

  // *** handle to login response data to verify user and decide to next step to verification ***
  const loginVerifyHandler = (data: any) => {
    const {
      organizations = [],
      two_factor_enabled,
      two_factor_verified,
      org_twoFA_status,
    } = data;
    dispatch(setAuthenticated({ isAuthenticated: true }));

    const twoFactorEnabled =
      (two_factor_enabled || org_twoFA_status) && two_factor_verified === false;
    if (!organizations.length) {
      setCurrentStep(LOGIN_STEP.COMPANY_DETAILS);
    } else if (organizations.length === 1) {
      const organizationId = organizations[0].uuid;
      dispatch(setOrganizationUUID(organizationId));
      if (twoFactorEnabled) {
        moveToTwoFactorVerify({
          org_twoFA_status,
          QRCode: data?.QRCode,
          secret: data?.secret,
        });
      } else {
        isVerified();
      }
    } else {
      setOrganizationList(organizations);
      if (twoFactorEnabled) {
        moveToTwoFactorVerify({
          org_twoFA_status,
          QRCode: data?.QRCode,
          secret: data?.secret,
        });
      } else {
        setCurrentStep(LOGIN_STEP.ORGANIZATION_FORM);
      }
    }
  };

  const moveToTwoFactorVerify = (data: {
    org_twoFA_status: boolean;
    QRCode: string;
    secret: string;
  }) => {
    const { org_twoFA_status, QRCode, secret } = data;
    if (org_twoFA_status) {
      setTwoFactorData({ QRCode, secret, verified: false });
    }
    setCurrentStep(LOGIN_STEP.VERIFY_2FA);
  };

  // *** mark to remember user data store ***
  const setUserRememberToLocal = (loginData: LoginFormFields) => {
    if (loginData.remember)
      localStorage.setItem(
        'remember-me',
        JSON.stringify({
          ...loginData,
          password: convertBtoA(loginData.password),
        })
      );
    else localStorage.removeItem('remember-me');
  };

  // *** set organization id to user verify ***
  const addOrganization = (organizationId: string) => {
    dispatch(setOrganizationUUID(organizationId));
    isVerified();
  };

  // *** logged user verify to data ***
  const isVerified = async () => {
    const { data, error } = await getLoggedInUserAPI({});
    const { data: is_visibility, error: activityCalenderVisibilityError } =
      await getGeneralSettingsAPI({
        params: {
          'q[key]': GENERAL_SETTING_VALID_KEYS.is_activity_calender_visibility,
          'q[model_name]': POLYMORPHIC_MODELS.ACTIVITY,
          'q[model_record_id]': currentUser?.id,
          module: ModuleNames.ACTIVITY,
        },
      });
    if (!error && data) {
      const { two_factor_enabled, two_factor_verified } = data;

      if (!data?.user?.verified) {
        setCurrentStep(LOGIN_STEP.VERIFY_EMAIL);
      } else if (data && two_factor_enabled && !two_factor_verified) {
        setCurrentStep(LOGIN_STEP.VERIFY_2FA);
      } else if (
        !two_factor_enabled ||
        (two_factor_enabled && two_factor_verified)
      ) {
        const { user, permissions } = data;
        dispatch(setUserData({ user }));
        dispatch(setPermissions(permissions));
        await userOrDescendantUserOptions(user);
        dispatch(setNotificationInterval(NOTIFICATION_INTERVAL_TIME));
      } else if (
        is_visibility?.[0]?.value &&
        !activityCalenderVisibilityError
      ) {
        dispatch(setCalenderActivity(is_visibility?.[0].value));
      }
    } else if (data && data?.statusCode === 5001) {
      setTwoFactorData({
        verified: false,
        QRCode: data?.QRCode,
        secret: data?.secret,
      });
    } else if (data && data?.two_factor_enabled && !data?.two_factor_verified) {
      setCurrentStep(LOGIN_STEP.VERIFY_2FA);
    } else {
      setCurrentStep(LOGIN_STEP.LOGIN_FORM);
    }
  };

  return {
    loginUser,
    loginWithGoogle,
    loginWithApple,
    isVerified,
    addOrganization,
    loggedInUserLoading,
    formLoading,
  };
};

export default useLoginService;
