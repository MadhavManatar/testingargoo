// ** Import Packages **
import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { AxiosRequestConfig } from 'axios';

// ** Axios **
import { axiosBaseQuery } from 'axios/axios';

const SCHEDULE_ACTIVITY_API_BASE_PATH = '/schedule-activity';

export const scheduleActivityApi = createApi({
  reducerPath: 'scheduleActivityApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getScheduleActivityById: builder.query<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({ id, data, ...rest }) => {
        return {
          url: `${SCHEDULE_ACTIVITY_API_BASE_PATH}/${id}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2, { id }) => {
        return [{ type: 'SCHEDULE_ACTIVITY', id }];
      },
    }),
    scheduleActivity: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${SCHEDULE_ACTIVITY_API_BASE_PATH}`,
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
            api.dispatch(scheduleActivityApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    updateScheduleActivityById: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${SCHEDULE_ACTIVITY_API_BASE_PATH}/${id}`,
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
            api.dispatch(scheduleActivityApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    deleteScheduleActivities: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: SCHEDULE_ACTIVITY_API_BASE_PATH,
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
            api.dispatch(scheduleActivityApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
  }),
  tagTypes: ['SCHEDULE_ACTIVITY'],
});

export const {
  useLazyGetScheduleActivityByIdQuery,
  useScheduleActivityMutation,
  useUpdateScheduleActivityByIdMutation,
  useDeleteScheduleActivitiesMutation,
} = scheduleActivityApi;
