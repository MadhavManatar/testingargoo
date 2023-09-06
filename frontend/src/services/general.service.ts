// ** external packages **
import { AxiosRequestConfig } from 'axios';

// ** axios hooks **
import { useAxiosPost as usePostAuthMutation } from 'hooks/useAxios';

const CHECK_FIELD_IS_UNIQUE = '/check-field-is-unique';

export const useFieldIsUniqueAPI = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = usePostAuthMutation();

  const fieldIsExistsAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${CHECK_FIELD_IS_UNIQUE}`, data, config);
  };

  return { fieldIsExistsAPI, isLoading, isError, isSuccess };
};
