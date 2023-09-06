// ** Import Packages **
import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { AxiosRequestConfig } from 'axios';

// ** Axios **
import { axiosBaseQuery } from 'axios/axios';

const NOTIFICATION_SETTING_API_BASE_PATH = '/notification-setting';

export const notificationSettingApi = createApi({
  reducerPath: 'notificationSettingApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getNotificationSetting: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${NOTIFICATION_SETTING_API_BASE_PATH}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2) => {
        return [{ type: 'NOTIFICATION_SETTING', id: 'LIST' }];
      },
    }),
    updateNotificationSettingById: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${NOTIFICATION_SETTING_API_BASE_PATH}/${id}`,
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
            api.dispatch(notificationSettingApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    setNotificationSetting: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${NOTIFICATION_SETTING_API_BASE_PATH}/set-time`,
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
            api.dispatch(notificationSettingApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
  }),
  tagTypes: ['NOTIFICATION_SETTING'],
});

export const {
  useLazyGetNotificationSettingQuery,
  useUpdateNotificationSettingByIdMutation,
  useSetNotificationSettingMutation,
} = notificationSettingApi;
