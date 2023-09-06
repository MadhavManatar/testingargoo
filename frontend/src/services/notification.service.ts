// ** external packages **
import { AxiosRequestConfig } from 'axios';

// ** axios hooks **
import {
  useAxiosPost as usePostNotificationMutation,
  useAxiosDelete as useDeleteNotificationMutation,
} from 'hooks/useAxios';

const NOTIFICATION_API_BASE_PATH = '/subscribe';

export const useAddUserSubscriptionAPI = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] =
    usePostNotificationMutation();
  const addUserSubscriptionAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    // HELLO
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unUsed = { callApi, data, config };
    return { data: { subscription: '', id: 1 }, error: null };
    // return callApi(`${NOTIFICATION_API_BASE_PATH}/`, data, config);
  };
  return {
    addUserSubscriptionAPI,
    isLoading,
    isError,
    isSuccess,
  };
};

// ** delete ** //
export const useDeleteUserSubscriptionsAPI = () => {
  // ** Custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] =
    useDeleteNotificationMutation();

  const deleteUserSubscriptionsAPI = async (
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${NOTIFICATION_API_BASE_PATH}`, config);
  };

  return { deleteUserSubscriptionsAPI, isLoading, isError, isSuccess };
};
