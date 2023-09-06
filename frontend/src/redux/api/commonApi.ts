import { AxiosRequestConfig } from 'axios';
import baseQueryApi from './baseQueryApi';

const VERSION_API_BASE_PATH = '/product-version';

export const commonApi = baseQueryApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductVersion: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${VERSION_API_BASE_PATH}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
    }),
  }),
});

export const { useLazyGetProductVersionQuery } = commonApi;
