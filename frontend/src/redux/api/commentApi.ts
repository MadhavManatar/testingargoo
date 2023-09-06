import { AxiosRequestConfig } from 'axios';

import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from 'axios/axios';
import { timelineApi } from './timelineApi';

const COMMENTS_API_BASE_PATH = '/comments';
const REACTION_API_BASE_PATH = '/reaction';

export const commentApi = createApi({
  reducerPath: 'commentApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    addComment: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${COMMENTS_API_BASE_PATH}`,
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
            api.dispatch(
              timelineApi.util.invalidateTags([
                { type: 'TIMELINE', id: 'LIST' },
              ])
            );
            api.dispatch(commentApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),

    addReactionAPI: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${REACTION_API_BASE_PATH}`,
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
            api.dispatch(
              timelineApi.util.invalidateTags([
                { type: 'TIMELINE', id: 'LIST' },
              ])
            );
            api.dispatch(commentApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),

    updateComment: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${COMMENTS_API_BASE_PATH}/${id}`,
          method: 'PATCH',
          data,
          extraOptions: { ...rest },
        };
      },
      async onQueryStarted(arg, api) {
        try {
          const { queryFulfilled } = api;
          const updatedInfo = await queryFulfilled;
          if (updatedInfo) {
            api.dispatch(
              timelineApi.util.invalidateTags([
                { type: 'TIMELINE', id: 'LIST' },
              ])
            );
            api.dispatch(commentApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),

    deleteComment: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${COMMENTS_API_BASE_PATH}/${id}`,
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
            api.dispatch(
              timelineApi.util.invalidateTags([
                { type: 'TIMELINE', id: 'LIST' },
              ])
            );
            api.dispatch(commentApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
  }),
  tagTypes: ['COMMENT'],
});

export const {
  useAddCommentMutation,
  useAddReactionAPIMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentApi;
