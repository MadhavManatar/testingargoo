// ** external packages **
import { AxiosRequestConfig } from 'axios';

// ** axios hooks **
import { useAxiosGet as useGetTimeLinesMutation } from 'hooks/useAxios';

const TIME_LINE_API_BASE_PATH = '/timeline';

export const useGetTimelineForStreamApi = () => {
  // ** Custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] =
    useGetTimeLinesMutation();

  const getGetTimelineForStreamAPI = async (
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${TIME_LINE_API_BASE_PATH}/stream-timeline`, config);
  };
  return { getGetTimelineForStreamAPI, isLoading, isError, isSuccess };
};
