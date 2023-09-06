import { AxiosRequestConfig } from 'axios';
import baseQueryApi from './baseQueryApi';

const TIMEZONE_API_BASE_PATH = '/general';

export const timezoneApi = baseQueryApi.injectEndpoints({
  endpoints: (builder) => ({
    getTimezoneList: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${TIMEZONE_API_BASE_PATH}/timezone-list`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2) => {
        return [
          {
            type: 'TIMEZONE',
          },
        ];
      },
    }),
    getTimezone: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${TIMEZONE_API_BASE_PATH}/get-time-zone`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2) => {
        return [
          {
            type: 'TIMEZONE',
          },
        ];
      },
    }),
  }),
});

export const { useLazyGetTimezoneListQuery, useLazyGetTimezoneQuery } =
  timezoneApi;
