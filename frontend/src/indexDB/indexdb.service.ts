// ** external packages **
import { AxiosRequestConfig } from 'axios';
// ** axios hooks **
import { useAxiosGet as useGetIconJsonMutation } from 'hooks/useAxios';

const ICON_JSON_API_BASE_PATH = '/icon-type/get-data';

export const useGetIconJsonAPI = () => {
  // ** Custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = useGetIconJsonMutation();
  const getIconJsonAPI = async (config: AxiosRequestConfig<object> = {}) => {
    return callApi(`${ICON_JSON_API_BASE_PATH}`, config);
  };
  return { getIconJsonAPI, isLoading, isError, isSuccess };
};
