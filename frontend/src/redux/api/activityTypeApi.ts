// ** Import Packages **
import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { AxiosRequestConfig } from 'axios';

// ** Axios **
import { axiosBaseQuery } from 'axios/axios';

const ACTIVITY_TYPE_API_BASE_PATH = '/activity-type';

export const activityTypeApi = createApi({
  reducerPath: 'activityTypeApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getActivityTypes: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${ACTIVITY_TYPE_API_BASE_PATH}/get-data`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [{ type: 'ACTIVITY_TYPE', id: 'LIST' }];
      },
    }),
    getActivityTypeById: builder.query<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({ id, data, ...rest }) => {
        return {
          url: `${ACTIVITY_TYPE_API_BASE_PATH}/${id}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2, { id }) => {
        return [{ type: 'ACTIVITY_TYPE', id }];
      },
    }),
    addActivityType: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${ACTIVITY_TYPE_API_BASE_PATH}`,
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
            api.dispatch(activityTypeApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    updateActivityType: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${ACTIVITY_TYPE_API_BASE_PATH}/${id}`,
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
            api.dispatch(activityTypeApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    updateActivityTypeMailStatus: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${ACTIVITY_TYPE_API_BASE_PATH}/emailStatus/${id}`,
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
            api.dispatch(activityTypeApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    deleteActivityType: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: ACTIVITY_TYPE_API_BASE_PATH,
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
            api.dispatch(activityTypeApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
  }),
  tagTypes: ['ACTIVITY_TYPE'],
});

export const {
  useLazyGetActivityTypesQuery,
  useLazyGetActivityTypeByIdQuery,
  useAddActivityTypeMutation,
  useUpdateActivityTypeMutation,
  useUpdateActivityTypeMailStatusMutation,
  useDeleteActivityTypeMutation,
} = activityTypeApi;
