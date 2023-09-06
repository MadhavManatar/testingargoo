import { AxiosRequestConfig } from 'axios';
import { hasAuthorized } from 'helper/auth.helper';
import {
  BasicPermissionTypes,
  ModuleNames,
} from 'constant/permissions.constant';

import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from 'axios/axios';
import { timelineApi } from './timelineApi';
import { contactApi } from './contactApi';
import { accountApi } from './accountApi';
import { trashApi } from './trashApi';

const ACTIVITY_API_BASE_PATH = '/activities';

export const activityApi = createApi({
  reducerPath: 'activityApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getActivities: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${ACTIVITY_API_BASE_PATH}/get-data`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [
          {
            type: 'ACTIVITY',
            id: 'LIST',
          },
        ];
      },
    }),
    getActivitiesAdvance: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${ACTIVITY_API_BASE_PATH}/advance-filter`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [{ type: 'ACTIVITY', id: 'LIST' }];
      },
    }),
    getActivitiesCount: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        const readActivitiesPermission = hasAuthorized([
          { module: ModuleNames.ACTIVITY, type: BasicPermissionTypes.READ },
        ]);
        if (readActivitiesPermission) {
          return {
            url: `${ACTIVITY_API_BASE_PATH}/count`,
            method: 'GET',
            data,
            extraOptions: { ...rest },
          };
        }
        return {
          url: '',
          method: '',
          data: null,
        };
      },
      providesTags: () => {
        return [
          {
            type: 'ACTIVITY',
            id: 'LIST',
          },
        ];
      },
    }),
    getActivitiesEmailSetting: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        const readActivitiesPermission = hasAuthorized([
          { module: ModuleNames.ACTIVITY, type: BasicPermissionTypes.READ },
        ]);
        if (readActivitiesPermission) {
          return {
            url: `activity-type/activityTypeEmailSetting`,
            method: 'GET',
            data,
            extraOptions: { ...rest },
          };
        }
        return {
          url: '',
          method: '',
          data: null,
        };
      },
      providesTags: () => {
        return [
          {
            type: 'ACTIVITY',
            id: 'LIST',
          },
        ];
      },
    }),
    getActivityById: builder.query<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({ id, data, ...rest }) => {
        return {
          url: `${ACTIVITY_API_BASE_PATH}/get-data/${id}`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
    }),
    addActivity: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${ACTIVITY_API_BASE_PATH}`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      async onQueryStarted(arg, api) {
        try {
          const { queryFulfilled } = api;
          const updatedInfo = await queryFulfilled;
          if (updatedInfo?.data?.id) {
            api.dispatch(
              timelineApi.util.invalidateTags([
                { type: 'TIMELINE', id: 'LIST' },
              ])
            );
            api.dispatch(
              contactApi.util.invalidateTags([{ type: 'CONTACT', id: 'LIST' }])
            );
            api.dispatch(
              accountApi.util.invalidateTags([{ type: 'ACCOUNT', id: 'LIST' }])
            );
            api.dispatch(activityApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    restoreActivity: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${ACTIVITY_API_BASE_PATH}/restore`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      async onQueryStarted(arg, api) {
        try {
          const { queryFulfilled } = api;
          const updatedInfo = await queryFulfilled;
          if (updatedInfo?.data[0]?.id) {
            api.dispatch(
              trashApi.util.invalidateTags([{ type: 'TRASH', id: 'LIST' }])
            );
            api.dispatch(
              timelineApi.util.invalidateTags([
                { type: 'TIMELINE', id: 'LIST' },
              ])
            );
            api.dispatch(activityApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    updateActivity: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${ACTIVITY_API_BASE_PATH}/${id}`,
          method: 'PUT',
          data,
          extraOptions: { ...rest },
        };
      },
      async onQueryStarted(arg, api) {
        try {
          const { queryFulfilled } = api;
          const updatedInfo = await queryFulfilled;
          if (updatedInfo?.data?.id) {
            api.dispatch(
              timelineApi.util.invalidateTags([
                { type: 'TIMELINE', id: 'LIST' },
              ])
            );
            api.dispatch(
              accountApi.util.invalidateTags([{ type: 'ACCOUNT', id: 'LIST' }])
            );
            api.dispatch(
              contactApi.util.invalidateTags([{ type: 'CONTACT', id: 'LIST' }])
            );
            api.dispatch(activityApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    deleteActivity: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: ACTIVITY_API_BASE_PATH,
          method: 'DELETE',
          data,
          extraOptions: { ...rest },
        };
      },
      async onQueryStarted(arg, api) {
        try {
          const { queryFulfilled } = api;
          const updatedInfo = await queryFulfilled;
          if (updatedInfo?.data?.deletedIds) {
            api.dispatch(
              trashApi.util.invalidateTags([{ type: 'TRASH', id: 'LIST' }])
            );
            api.dispatch(
              timelineApi.util.invalidateTags([
                { type: 'TIMELINE', id: 'LIST' },
              ])
            );
            api.dispatch(activityApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    destroyActivity: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${ACTIVITY_API_BASE_PATH}/destroy`,
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
            api.dispatch(
              trashApi.util.invalidateTags([{ type: 'TRASH', id: 'LIST' }])
            );
            api.dispatch(
              timelineApi.util.invalidateTags([
                { type: 'TIMELINE', id: 'LIST' },
              ])
            );
            api.dispatch(activityApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    followUpScheduleUpActivity: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${ACTIVITY_API_BASE_PATH}/follow-up/${id}`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      async onQueryStarted(arg, api) {
        try {
          const { queryFulfilled } = api;
          const updatedInfo = await queryFulfilled;
          if (updatedInfo?.data?.id) {
            api.dispatch(
              timelineApi.util.invalidateTags([
                { type: 'TIMELINE', id: 'LIST' },
              ])
            );
            api.dispatch(
              activityApi.util.invalidateTags([
                { type: 'ACTIVITY', id: updatedInfo?.data?.id },
              ])
            );
            api.dispatch(activityApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    changeActivityStatusById: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${ACTIVITY_API_BASE_PATH}/change-active-status/${id}`,
          method: 'PATCH',
          data,
          extraOptions: { ...rest },
        };
      },
      async onQueryStarted(arg, api) {
        try {
          const { queryFulfilled } = api;
          const updatedInfo = await queryFulfilled;
          if (updatedInfo?.data?.id) {
            api.dispatch(
              timelineApi.util.invalidateTags([
                { type: 'TIMELINE', id: 'LIST' },
              ])
            );
            api.dispatch(
              activityApi.util.invalidateTags([
                { type: 'ACTIVITY', id: updatedInfo?.data?.id },
              ])
            );
            api.dispatch(activityApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    conformActivityInvitation: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${ACTIVITY_API_BASE_PATH}/confirm-availability`,
          method: 'PATCH',
          data,
          extraOptions: { ...rest },
        };
      },
      async onQueryStarted(arg, api) {
        try {
          const { queryFulfilled } = api;
          const updatedInfo = await queryFulfilled;
          if (updatedInfo?.data?.id) {
            api.dispatch(
              timelineApi.util.invalidateTags([
                { type: 'TIMELINE', id: 'LIST' },
              ])
            );
            api.dispatch(activityApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    sendInvitationMail: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${ACTIVITY_API_BASE_PATH}/invitationMail`,
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
            api.dispatch(
              timelineApi.util.invalidateTags([
                { type: 'TIMELINE', id: 'LIST' },
              ])
            );
            api.dispatch(
              contactApi.util.invalidateTags([{ type: 'CONTACT', id: 'LIST' }])
            );
            api.dispatch(
              accountApi.util.invalidateTags([{ type: 'ACCOUNT', id: 'LIST' }])
            );
            api.dispatch(activityApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
  }),

  tagTypes: ['ACTIVITY'],
});

export const {
  useLazyGetActivitiesQuery,
  useLazyGetActivitiesAdvanceQuery,
  useLazyGetActivitiesEmailSettingQuery,
  useLazyGetActivityByIdQuery,
  useAddActivityMutation,
  useSendInvitationMailMutation,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
  useFollowUpScheduleUpActivityMutation,
  useChangeActivityStatusByIdMutation,
  useLazyGetActivitiesCountQuery,
  useConformActivityInvitationMutation,
  useRestoreActivityMutation,
  useDestroyActivityMutation,
} = activityApi;
