// =================== import packages ==================
import axios, { AxiosRequestConfig } from 'axios';
import { Store } from '@reduxjs/toolkit';
// ======================================================
import { removeToast, setToast } from 'redux/slices/toastSlice';
import { setLogoutData } from 'redux/slices/authSlice';
import { REACT_APP_API_URL } from 'config';
import { apiResponseType } from 'pages/types';

export const Axios = axios.create({ baseURL: REACT_APP_API_URL });

export const setupAxios = (store: Store) => {
  // logic of set token in header
  Axios.interceptors.request.use((request: AxiosRequestConfig) => {
    const authToken = localStorage.getItem('access_token');
    const organizationUUID = localStorage.getItem('organization_uuid');
    const clientIp = localStorage.getItem('clientIp');

    if (request.headers !== undefined && authToken) {
      request.headers.Authorization = `JWT ${authToken}`;
    }
    if (request.headers !== undefined && organizationUUID) {
      request.headers.XOrganization = `${organizationUUID}`;
    }

    if (request.headers && clientIp) {
      request.headers['x-client-ip'] = `${clientIp}`;
    }

    if (request.headers && process.env.NODE_ENV === 'development') {
      request.headers['ngrok-skip-browser-warning'] = true;
    }

    if (request.headers) {
      request.headers['x-client-tz'] =
        Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    request.withCredentials = true;
    return request;
  });
  // for toast message setup
  Axios.interceptors.response.use(
    (res) => {
      const { toast } = res.data;
      if (toast) {
        // ----------- set api response toast -----------
        const toastId = new Date().getTime();
        store.dispatch(
          setToast({
            message: res.data.message,
            type: res.data.responseType,
            id: toastId,
          })
        );
        setTimeout(() => {
          store.dispatch(removeToast({ id: toastId }));
        }, 2000);
      }
      return res.data;
    },
    (e) => {
      if (e.response.status === 401) {
        const storeData = store.getState();
        if (storeData.token !== null) {
          store.dispatch(setLogoutData());
        }
      }
      if (
        e.response.status === 400 ||
        e.response.status === 500 ||
        e.response.status === 401
      ) {
        const { toast } = e.response.data;
        if (toast) {
          // ----------- set api response toast -----------
          const toastId = new Date().getTime();
          store.dispatch(
            setToast({
              message: e.response.data.message,
              type: e.response.data.responseType,
              id: toastId,
            })
          );
          setTimeout(() => {
            store.dispatch(removeToast({ id: toastId }));
          }, 2000);
        }
      }
      if ([5001, 5002].includes(e.response.data?.data?.statusCode)) {
        const rememberData = localStorage.getItem('remember-me');
        localStorage.clear();
        if (rememberData) localStorage.setItem('remember-me', rememberData);
      }

      throw e.response.data;
    }
  );
};

// ******************
type axiosArgs = Readonly<{
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  extraOptions?: AxiosRequestConfig;
}>;

export const axiosBaseQuery = async (args: axiosArgs) => {
  try {
    const result = await Axios({
      url: args.url,
      method: args.method,
      data: args.data,
      params: args.params,
      ...args.extraOptions,
    });
    return { data: result.data };
  } catch (axiosError) {
    const err = axiosError as apiResponseType;
    return {
      error: err,
    };
  }
};

export default axios;
