// ** external packages **
import { AxiosRequestConfig } from 'axios';

// ** axios hooks **
import { useAxiosPost as usePostNotificationMutation } from 'hooks/useAxios';

export const NOTIFICATION_API_BASE_PATH = '/notifications';

export const useReadNotificationAPI = () => {
  // ** Custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] =
    usePostNotificationMutation();

  const readNotificationAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${NOTIFICATION_API_BASE_PATH}/read`, data, config);
  };

  return { readNotificationAPI, isLoading, isError, isSuccess };
};
