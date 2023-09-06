// ** external packages **
import { AxiosRequestConfig } from 'axios';
// ** axios hooks **
import { useAxiosPost as usePostFollowEntityMutation } from 'hooks/useAxios';

const FOLLOW_ENTITY_API_BASE_PATH = '/follow-entity';

// ** post **
export const useAddFollowEntityAPI = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] =
    usePostFollowEntityMutation();

  const addFollowEntityAPI = async (
    entityId: number,
    module: string,
    isFollow: 'follow' | 'un-follow',
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(
      `${FOLLOW_ENTITY_API_BASE_PATH}/${module}/${entityId}/${isFollow}`,
      data,
      config
    );
  };

  return { addFollowEntityAPI, isLoading, isError, isSuccess };
};

export const useGetFollowingEntitiesAPI = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] =
    usePostFollowEntityMutation();

  const getFollowingEntitiesAPI = async (
    data: object = {},
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${FOLLOW_ENTITY_API_BASE_PATH}/get-data`, data, config);
  };

  return { getFollowingEntitiesAPI, isLoading, isError, isSuccess };
};

export const useGetFollowingEntityCount = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] =
    usePostFollowEntityMutation();

  const getFollowingEntityCountAPI = async (
    data: object = {},
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${FOLLOW_ENTITY_API_BASE_PATH}/get-count`, data, config);
  };

  return { getFollowingEntityCountAPI, isLoading, isError, isSuccess };
};
