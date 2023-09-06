import { AxiosRequestConfig } from 'axios';
import baseQueryApi from './baseQueryApi';

const AUTH_API_BASE_PATH = '/auth';

export const authApi = baseQueryApi.injectEndpoints({
  endpoints: (builder) => ({
    updatePassword: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${AUTH_API_BASE_PATH}/set-user-password`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
    }),
  }),
});

export const { useLazyUpdatePasswordQuery } = authApi;
