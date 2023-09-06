// ** external packages **
import { AxiosRequestConfig } from 'axios';

// ** axios hooks **
import { useAxiosPost as usePostSmtpMutation } from 'hooks/useAxios';

const SMTP_API_BASE_PATH = '/advance-option/smtp-imap';

export const useSmtpConnect = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = usePostSmtpMutation();
  const smtpConnectAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${SMTP_API_BASE_PATH}/connect`, data, config);
  };
  return { smtpConnectAPI, isLoading, isError, isSuccess };
};

export const useSmtpSearch = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = usePostSmtpMutation();
  const smtpSearchAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${SMTP_API_BASE_PATH}/connect`, data, config);
  };
  return { smtpSearchAPI, isLoading, isError, isSuccess };
};
