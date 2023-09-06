// ** external packages **
import { AxiosRequestConfig } from 'axios';

// ** axios hooks **
import {
  useAxiosGet as useGetAuthMutation,
  useAxiosPost as usePostAuthMutation,
} from 'hooks/useAxios';

const AUTH_API_BASE_PATH = '/auth';

// ** get **
// ** verification **
export const useResendVerificationAPI = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = useGetAuthMutation();

  const resendVerificationAPI = async (
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${AUTH_API_BASE_PATH}/resend-verification`, config);
  };

  return { resendVerificationAPI, isLoading, isError, isSuccess };
};

export const useLogOutAPI = () => {
  // ** Custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = useGetAuthMutation();

  const logOutUser = async (config: AxiosRequestConfig<object> = {}) => {
    return callApi(`${AUTH_API_BASE_PATH}/logout`, config);
  };

  return { logOutUser, isLoading, isError, isSuccess };
};

// ** post **
//  ** email **
export const useEmailIsExistsAPI = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = usePostAuthMutation();

  const emailIsExistsAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${AUTH_API_BASE_PATH}/email-exist`, data, config);
  };

  return { emailIsExistsAPI, isLoading, isError, isSuccess };
};

export const useVerifyEmailAPI = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = usePostAuthMutation();

  const verifyEmailAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(
      `${AUTH_API_BASE_PATH}/verify-account-by-email`,
      data,
      config
    );
  };

  return { verifyEmailAPI, isLoading, isError, isSuccess };
};

// ** password **
export const useSetPasswordAPI = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = usePostAuthMutation();

  const setPasswordAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${AUTH_API_BASE_PATH}/set-password`, data, config);
  };

  return { setPasswordAPI, isLoading, isError, isSuccess };
};

export const useResetPasswordAPI = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = usePostAuthMutation();

  const resetPasswordAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${AUTH_API_BASE_PATH}/reset-password`, data, config);
  };

  return { resetPasswordAPI, isLoading, isError, isSuccess };
};

export const useForgotPasswordAPI = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = usePostAuthMutation();

  const forgotPasswordAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${AUTH_API_BASE_PATH}/forgot-password`, data, config);
  };

  return { forgotPasswordAPI, isLoading, isError, isSuccess };
};

// ** register **
export const useRegisterAPI = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = usePostAuthMutation();

  const registerAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${AUTH_API_BASE_PATH}/register`, data, config);
  };

  return { registerAPI, isLoading, isError, isSuccess };
};

// ** login **
export const useLoginAPI = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = usePostAuthMutation();

  const loginAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${AUTH_API_BASE_PATH}/login`, data, config);
  };

  return { loginAPI, isLoading, isError, isSuccess };
};

export const use2FACodeVerifyAPI = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = usePostAuthMutation();

  const verify2FACodeAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${AUTH_API_BASE_PATH}/2FA/verify`, data, config);
  };

  return { verify2FACodeAPI, isLoading, isError, isSuccess };
};

export const useGoogleLoginAPI = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = usePostAuthMutation();

  const googleLoginAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${AUTH_API_BASE_PATH}/google`, data, config);
  };

  return { googleLoginAPI, isLoading, isError, isSuccess };
};

export const useAppleLoginAPI = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = usePostAuthMutation();

  const appleLoginAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${AUTH_API_BASE_PATH}/apple`, data, config);
  };

  return { appleLoginAPI, isLoading, isError, isSuccess };
};

// ** organization **
export const useAddCompanyInfoAPI = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = usePostAuthMutation();

  const addCompanyInfoAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(
      `${AUTH_API_BASE_PATH}/create-organization-with-initial-profile`,
      data,
      config
    );
  };

  return { addCompanyInfoAPI, isLoading, isError, isSuccess };
};
