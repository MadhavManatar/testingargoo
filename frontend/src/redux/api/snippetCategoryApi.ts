import { AxiosRequestConfig } from 'axios';

import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from 'axios/axios';

const SNIPPET_CATEGORY_API_BASE_PATH = '/snippet-category';

export const snippetCategoryApi = createApi({
  reducerPath: 'snippetCategoryApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getSnippetCategory: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${SNIPPET_CATEGORY_API_BASE_PATH}/get-data`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [{ type: 'SNIPPET_CATEGORY', id: 'LIST' }];
      },
    }),
    getSnippetCategoryById: builder.query<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({ id, data, ...rest }) => {
        return {
          url: `${SNIPPET_CATEGORY_API_BASE_PATH}/${id}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2, { id }) => {
        return [
          {
            type: 'SNIPPET_CATEGORY',
            id,
          },
        ];
      },
    }),
    addSnippetCategory: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${SNIPPET_CATEGORY_API_BASE_PATH}`,
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
            api.dispatch(snippetCategoryApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    updateSnippetCategory: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${SNIPPET_CATEGORY_API_BASE_PATH}/${id}`,
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
            api.dispatch(snippetCategoryApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    deleteSnippetCategory: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: SNIPPET_CATEGORY_API_BASE_PATH,
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
            api.dispatch(snippetCategoryApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
  }),
  tagTypes: ['SNIPPET_CATEGORY'],
});

export const {
  useLazyGetSnippetCategoryQuery,
  useAddSnippetCategoryMutation,
  useUpdateSnippetCategoryMutation,
  useLazyGetSnippetCategoryByIdQuery,
  useDeleteSnippetCategoryMutation,
} = snippetCategoryApi;
