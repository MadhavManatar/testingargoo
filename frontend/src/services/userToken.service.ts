// ** external packages **
import { AxiosRequestConfig } from 'axios';

// ** axios hooks **
import {
  useAxiosGet as useGetUserTokenMutation,
  useAxiosPost as usePostUserTokenMutation,
  useAxiosDelete as useDeleteUserMutation,
} from 'hooks/useAxios';

// ** types **
import { TokenProvider } from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';

const USER_TOKEN_API_BASE_PATH = '/user-social-account';
const SMTP_SYNC_TOKEN_API_BASE_PATH = 'advance-option/smtp-imap/me';

// ** get **
export const useGetLoggedInUserTokensAPI = () => {
  // ** Custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] =
    useGetUserTokenMutation();
  const getLoggedInUserTokensAPI = async (
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${USER_TOKEN_API_BASE_PATH}`, config);
  };
  return { getLoggedInUserTokensAPI, isLoading, isError, isSuccess };
};

// ** get **
export const useIsConnectedFacebookAuth = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] =
    useGetUserTokenMutation();

  const isConnectedFacebookAuth = async () => {
    return callApi(
      `${USER_TOKEN_API_BASE_PATH}/${TokenProvider.FACEBOOK}/is-connected`
    );
  };

  return { isConnectedFacebookAuth, isLoading, isError, isSuccess };
};

export const useIsConnectedMicrosoftAuth = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] =
    useGetUserTokenMutation();

  const isConnectedMicrosoftAuth = async () => {
    return callApi(
      `${USER_TOKEN_API_BASE_PATH}/${TokenProvider.MICROSOFT}/is-connected`
    );
  };

  return { isConnectedMicrosoftAuth, isLoading, isError, isSuccess };
};

export const useIsConnectedGoogleMailAuth = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] =
    useGetUserTokenMutation();

  const isConnectedGoogleMailAuth = async () => {
    return callApi(
      `${USER_TOKEN_API_BASE_PATH}/${TokenProvider.GOOGLE_MAIL}/is-connected`
    );
  };

  return { isConnectedGoogleMailAuth, isLoading, isError, isSuccess };
};

export const useDisConnectCalendarAuth = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] =
    usePostUserTokenMutation();

  const disConnectCalendar = async (data: {
    email: string;
    token_provider: TokenProvider;
  }) => {
    return callApi(
      `${USER_TOKEN_API_BASE_PATH}/${data.token_provider}/disconnect`,
      data
    );
  };

  return { disConnectCalendar, isLoading, isError, isSuccess };
};

// ** delete **
export const useDeleteUserTokenAPI = () => {
  // ** Custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = useDeleteUserMutation();

  const deleteUserTokenByIdAPI = async (
    id: number,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${USER_TOKEN_API_BASE_PATH}/${id}`, config);
  };
  return { deleteUserTokenByIdAPI, isLoading, isError, isSuccess };
};

export const useDeleteSmtpSyncUserAPI = () => {
  // ** Custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = useDeleteUserMutation();

  const deleteSmtpSyncUserAPI = async (
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${SMTP_SYNC_TOKEN_API_BASE_PATH}/`, config);
  };
  return { deleteSmtpSyncUserAPI, isLoading, isError, isSuccess };
};

