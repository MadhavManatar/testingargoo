import { AxiosRequestConfig } from 'axios';
import baseQueryApi from './baseQueryApi';

const ADDRESS_API_BASE_PATH = '/address';

export const addressApi = baseQueryApi.injectEndpoints({
  endpoints: (builder) => ({
    getCountry: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${ADDRESS_API_BASE_PATH}/countries`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2) => {
        return [
          {
            type: 'ADDRESS',
          },
        ];
      },
    }),
    getStates: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${ADDRESS_API_BASE_PATH}/states`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2) => {
        return [
          {
            type: 'ADDRESS',
          },
        ];
      },
    }),
  }),
});

export const { useLazyGetCountryQuery, useLazyGetStatesQuery } = addressApi;
