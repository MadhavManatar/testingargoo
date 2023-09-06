import { AxiosRequestConfig } from 'axios';
import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { axiosBaseQuery } from 'axios/axios';

const ACTIVITY_RESULT_API_BASE_PATH = '/activity-result';

export const activityResultApi = createApi({
  reducerPath: 'activityResultApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getActivityResults: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${ACTIVITY_RESULT_API_BASE_PATH}/get-data`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [{ type: 'ACTIVITY_RESULT', id: 'LIST', },];
      },
    }),
    getActivityResultById: builder.query<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({ id, data, ...rest }) => {
        return {
          url: `${ACTIVITY_RESULT_API_BASE_PATH}/${id}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2, { id }) => {
        return [{ type: 'ACTIVITY_RESULT', id, },];
      },
    }),
    addActivityResult: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${ACTIVITY_RESULT_API_BASE_PATH}`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      async onQueryStarted(arg, api) {
        try {
          const { queryFulfilled } = api;
          const updatedInfo = await queryFulfilled;
          if (updatedInfo?.data) {
            api.dispatch(activityResultApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    updateActivityResult: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${ACTIVITY_RESULT_API_BASE_PATH}/${id}`,
          method: 'PUT',
          data,
          extraOptions: { ...rest },
        };
      },
      async onQueryStarted(arg, api) {
        try {
          const { queryFulfilled } = api;
          const updatedInfo = await queryFulfilled;
          if (updatedInfo?.data) {
            api.dispatch(activityResultApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    deleteActivityResult: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: ACTIVITY_RESULT_API_BASE_PATH,
          method: 'DELETE',
          data,
          extraOptions: { ...rest },
        };
      },
      async onQueryStarted(arg, api) {
        try {
          const { queryFulfilled } = api;
          const updatedInfo = await queryFulfilled;
          if (updatedInfo?.data) {
            api.dispatch(activityResultApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
  }),
  tagTypes: ['ACTIVITY_RESULT']
});

export const {
  useLazyGetActivityResultsQuery,
  useLazyGetActivityResultByIdQuery,
  useAddActivityResultMutation,
  useUpdateActivityResultMutation,
  useDeleteActivityResultMutation,
} = activityResultApi;
