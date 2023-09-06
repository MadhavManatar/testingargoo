import { AxiosRequestConfig } from 'axios';

import { createApi } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from 'axios/axios';

const SNIPPET_API_BASE_PATH = '/snippet';

export const snippetSettingApi = createApi({
  reducerPath: 'snippetSettingApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getSnippetSetting: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${SNIPPET_API_BASE_PATH}/get-data`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [{ type: 'SNIPPET_SETTING', id: 'LIST' }];
      },
    }),
    getSnippetSettingById: builder.query<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({ id, data, ...rest }) => {
        return {
          url: `${SNIPPET_API_BASE_PATH}/${id}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
    }),
    addSnippetSetting: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${SNIPPET_API_BASE_PATH}`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      async onQueryStarted(arg, api) {
        try {
          const { queryFulfilled } = api;
          const updatedInfo = await queryFulfilled;
          if (updatedInfo) {
            api.dispatch(snippetSettingApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    updateSnippetSetting: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${SNIPPET_API_BASE_PATH}/${id}`,
          method: 'PUT',
          data,
          extraOptions: { ...rest },
        };
      },
      async onQueryStarted(arg, api) {
        try {
          const { queryFulfilled } = api;
          const updatedInfo = await queryFulfilled;
          if (updatedInfo) {
            api.dispatch(snippetSettingApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    deleteSnippetSetting: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: SNIPPET_API_BASE_PATH,
          method: 'DELETE',
          data,
          extraOptions: { ...rest },
        };
      },
      async onQueryStarted(arg, api) {
        try {
          const { queryFulfilled } = api;
          const updatedInfo = await queryFulfilled;
          if (updatedInfo) {
            api.dispatch(snippetSettingApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
  }),
  tagTypes: ['SNIPPET_SETTING'],
});

export const {
  useLazyGetSnippetSettingQuery,
  useAddSnippetSettingMutation,
  useUpdateSnippetSettingMutation,
  useLazyGetSnippetSettingByIdQuery,
  useDeleteSnippetSettingMutation,
} = snippetSettingApi;
