// ** external packages **
import { AxiosRequestConfig } from 'axios';

// ** axios hooks **
import {
  useAxiosGet as useGetUserSipMutation,
  useAxiosPost as useCreateUserSipMutation,
} from 'hooks/useAxios';

const USER_SIP_BASE_PATH = '/user-sip';

export const useGetUserSIP = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = useGetUserSipMutation();

  const getUserSipAPI = async (config: AxiosRequestConfig<object> = {}) => {
    return callApi(`${USER_SIP_BASE_PATH}`, config);
  };

  return { getUserSipAPI, isLoading, isError, isSuccess };
};

export const useCreateUserSIP = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] =
    useCreateUserSipMutation();

  const createUserSipAPI = async (config: AxiosRequestConfig<object> = {}) => {
    return callApi(`${USER_SIP_BASE_PATH}`, {}, config);
  };

  return { createUserSipAPI, isLoading, isError, isSuccess };
};
