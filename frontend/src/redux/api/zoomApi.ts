// ** Import Packages **
import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { AxiosRequestConfig } from 'axios';

// ** Axios **
import { axiosBaseQuery } from 'axios/axios';

const ZOOM_API_BASE_PATH = '/zoom';

export const zoomApi = createApi({
  reducerPath: 'zoomApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getZoomUserIsExist: builder.query<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({ id, data, ...rest }) => {
        return {
          url: `${ZOOM_API_BASE_PATH}/${id}/is-exist`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2) => {
        return [{ type: 'ZOOM', id: 'LIST' }];
      },
    }),
    getZoomPhoneCallStatusAPI: builder.query<
      any,
      AxiosRequestConfig<any> & { user_id: number }
    >({
      query: ({ user_id, data, ...rest }) => {
        return {
          url: `${ZOOM_API_BASE_PATH}/${user_id}/phone-status`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2) => {
        return [{ type: 'ZOOM', id: 'PHONE_STATUS' }];
      },
    }),
    createZoomMeeting: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${ZOOM_API_BASE_PATH}`,
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
            api.dispatch(zoomApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    updateZoomMeeting: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: string | number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: string | number }) => {
        return {
          url: `${ZOOM_API_BASE_PATH}/${id}`,
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
            api.dispatch(zoomApi.util.resetApiState());
          }
        } catch (error) {
          // 
        }
      },
    }),
    deleteZoomMeeting: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: string | number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: string | number }) => {
        return {
          url: `${ZOOM_API_BASE_PATH}/delete/${id}/`,
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
            api.dispatch(zoomApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
  }),
  tagTypes: ['ZOOM'],
});

export const {
  useLazyGetZoomUserIsExistQuery,
  useCreateZoomMeetingMutation,
  useUpdateZoomMeetingMutation,
  useDeleteZoomMeetingMutation,
  useLazyGetZoomPhoneCallStatusAPIQuery,
} = zoomApi;
