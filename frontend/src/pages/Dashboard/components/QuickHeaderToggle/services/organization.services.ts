// ** external packages **
import { AxiosRequestConfig } from 'axios';

// ** axios hooks **
import {
  useAxiosGet as useGetNotificationMutation,
} from 'hooks/useAxios';

const NOTIFICATION_API_BASE_PATH = '/auth';

// ** get **
export const useSwitchOrganizationApi = () => {
  // ** Custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] =
    useGetNotificationMutation();

  const getSwitchOrganizationAPI = async (
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${NOTIFICATION_API_BASE_PATH}/switch-organization`, config);
  };
  return { getSwitchOrganizationAPI, isLoading, isError, isSuccess };
};