// ** external packages **
import { AxiosRequestConfig } from 'axios';
import { ModuleNames } from 'constant/permissions.constant';

// ** axios hooks **
import { useAxiosPost as usePostFollowingMutation } from 'hooks/useAxios';

const FOLLOWING_API_BASE_PATH = '/follow-entity';

// ** get **
export const useGetFollowingEntitiesApi = () => {
  // ** Custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] =
    usePostFollowingMutation();

  const getFollowingEntitiesAPI = async (
    moduleName: ModuleNames,
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(
      `${FOLLOWING_API_BASE_PATH}/${moduleName}/get-data`,
      data,
      config
    );
  };
  return { getFollowingEntitiesAPI, isLoading, isError, isSuccess };
};
