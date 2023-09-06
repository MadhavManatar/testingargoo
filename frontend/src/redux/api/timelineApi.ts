// ** Import Packages **
import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { AxiosRequestConfig } from 'axios';

// ** Axios **
import { axiosBaseQuery } from 'axios/axios';

const TIME_LINE_API_BASE_PATH = '/timeline';

export const timelineApi = createApi({
  reducerPath: 'timelineApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getTimeLineByModelRecordId: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${TIME_LINE_API_BASE_PATH}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [{ type: 'TIMELINE', id: 'LIST' }];
      },
    }),
    getTimelineForDashBoard: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${TIME_LINE_API_BASE_PATH}/dashboard-timeline`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [{ type: 'TIMELINE', id: 'LIST' }];
      },
    }),
    getGetTimelineForStream: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${TIME_LINE_API_BASE_PATH}/stream-timeline`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [{ type: 'TIMELINE', id: 'LIST' }];
      },
    }),
    pinOrUnPinTimelineRecord: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${TIME_LINE_API_BASE_PATH}/pin/${id}`,
          method: 'PATCH',
          data,
          extraOptions: { ...rest },
        };
      },
      async onQueryStarted(arg, api) {
        try {
          const { queryFulfilled } = api;
          const updatedInfo = await queryFulfilled;
          if (updatedInfo?.data) {
            api.dispatch(timelineApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
  }),
  tagTypes: ['TIMELINE'],
});

export const {
  useLazyGetTimeLineByModelRecordIdQuery,
  useLazyGetTimelineForDashBoardQuery,
  useLazyGetGetTimelineForStreamQuery,
  usePinOrUnPinTimelineRecordMutation,
} = timelineApi;
