// ** external packages **
import { AxiosRequestConfig } from 'axios';

// ** axios hooks **
import { useAxiosGet as useGetUserSessionsMutation } from 'hooks/useAxios';

const USER_SESSION_API_BASE_PATH = '/user-sessions';

// ** get **
export const useGetUserSessionsAPI = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] =
    useGetUserSessionsMutation();

  const getUserSessionsAPI = async (
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${USER_SESSION_API_BASE_PATH}/get-data`, config);
  };

  return { getUserSessionsAPI, isLoading, isError, isSuccess };
};

export const useRemoveUserSessionAPI = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] =
    useGetUserSessionsMutation();

  const removeUserSessionAPI = async (
    id: string,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${USER_SESSION_API_BASE_PATH}/${id}`, config);
  };

  return { removeUserSessionAPI, isLoading, isError, isSuccess };
};
