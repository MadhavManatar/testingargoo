/* eslint-disable @typescript-eslint/no-unused-vars */
import { AxiosRequestConfig } from 'axios';
import baseQueryApi from './baseQueryApi';
import { RELOAD_DATA_KEY, RELOAD_DATA_SUB_KEY } from 'types/reloadData.type';

export const reloadApi = baseQueryApi.injectEndpoints({
  endpoints: (builder) => ({
    reloadData: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data }) => {
        return {
          extraOptions: {
            baseURL: '/',
          },
          url: '',
          method: 'GET',
          data,
        };
      },
      invalidatesTags: (result, ResultType, QueryArg) => {
        return QueryArg.data.map(
          (obj: {
            type: keyof typeof RELOAD_DATA_KEY;
            id: keyof typeof RELOAD_DATA_SUB_KEY | number;
          }) => ({
            type: obj?.type,
            id: obj?.id,
          })
        );
      },
    }),
  }),
});

export const { useReloadDataMutation } = reloadApi;
