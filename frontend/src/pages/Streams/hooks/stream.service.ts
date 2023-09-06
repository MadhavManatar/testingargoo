// ** external packages **
import { AxiosRequestConfig } from 'axios';

// ** Services **
import {
  useAxiosPost as useAddStreamMutation,
  useAxiosGet as useGetStreamMutation,
  useAxiosPut as useEditStreamMutation,
  useAxiosDelete as useDeleteStreamMutation,
} from 'hooks/useAxios';

// ** Constant **
const STREAM_API_BASE_PATH = '/streams';

// ** Add **
export const useAddStreamAPI = () => {
  const [callApi, { isLoading, isError, isSuccess }] = useAddStreamMutation();
  const addStreamAPi = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${STREAM_API_BASE_PATH}`, data, config);
  };
  return { addStreamAPi, isLoading, isError, isSuccess };
};
// ** Edit **
export const useEditStreamAPI = () => {
  const [callApi, { isLoading, isError, isSuccess }] = useEditStreamMutation();
  const editStreamAPI = async (
    id: number,
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${STREAM_API_BASE_PATH}/${id}`, data, config);
  };
  return { editStreamAPI, isLoading, isError, isSuccess };
};
// ** Get **
export const useGetStreamData = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = useGetStreamMutation();

  const getStreamAPI = async (config: AxiosRequestConfig<object> = {}) => {
    return callApi(`${STREAM_API_BASE_PATH}`, config);
  };

  return { getStreamAPI, isLoading, isError, isSuccess };
};
// ** delete **
export const useDeleteStreamByIdAPI = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] =
    useDeleteStreamMutation();

  const deleteStreamByIdAPI = async (id: number) => {
    return callApi(`${STREAM_API_BASE_PATH}/${id}`);
  };

  return { deleteStreamByIdAPI, isLoading, isError, isSuccess };
};
