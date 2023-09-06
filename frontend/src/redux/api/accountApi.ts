import { AxiosRequestConfig } from 'axios';
import {
  BasicPermissionTypes,
  ModuleNames,
} from 'constant/permissions.constant';
import { hasAuthorized } from 'helper/auth.helper';

import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from 'axios/axios';
import { timelineApi } from './timelineApi';
import { contactApi } from './contactApi';
import { leadApi } from './leadApi';
import { trashApi } from './trashApi';

const ACCOUNT_API_BASE_PATH = '/accounts';

export const accountApi = createApi({
  reducerPath: 'accountApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getAccountsPost: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${ACCOUNT_API_BASE_PATH}/advance-filter`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [
          {
            type: 'ACCOUNT',
            id: 'LIST',
          },
        ];
      },
    }),
    getAccounts: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${ACCOUNT_API_BASE_PATH}/get-data`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [
          {
            type: 'ACCOUNT',
            id: 'LIST',
          },
        ];
      },
    }),
    getAccountsWithoutChild: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${ACCOUNT_API_BASE_PATH}/getAccountsWithoutItsChild`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [
          {
            type: 'ACCOUNT',
            id: 'LIST',
          },
        ];
      },
    }),
    getParentAccounts: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${ACCOUNT_API_BASE_PATH}/get-parent-accounts`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [
          {
            type: 'ACCOUNT',
            id: 'LIST',
          },
        ];
      },
    }),
    getParentChildAccount: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${ACCOUNT_API_BASE_PATH}/get-parent-child-account`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [
          {
            type: 'ACCOUNT',
            id: 'LIST',
          },
        ];
      },
    }),
    getAccountsCounts: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        const readActivitiesPermission = hasAuthorized([
          { module: ModuleNames.ACCOUNT, type: BasicPermissionTypes.READ },
        ]);
        if (readActivitiesPermission) {
          return {
            url: `${ACCOUNT_API_BASE_PATH}/count`,
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
            type: 'ACCOUNT',
            id: 'LIST',
          },
        ];
      },
    }),
    checkParentAccount: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${ACCOUNT_API_BASE_PATH}/get-parent-accounts`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [
          {
            type: 'ACCOUNT',
            id: 'LIST',
          },
        ];
      },
    }),
    getAccountById: builder.query<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({ id, data, ...rest }) => {
        return {
          url: `${ACCOUNT_API_BASE_PATH}/${id}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
    }),
    addAccount: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${ACCOUNT_API_BASE_PATH}`,
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
              timelineApi.util.invalidateTags([{ type: 'TIMELINE', id: 'LIST' }])
            );
            api.dispatch(
              contactApi.util.invalidateTags([{ type: 'CONTACT', id: 'LIST' }])
            );
            api.dispatch(accountApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    updateAccount: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${ACCOUNT_API_BASE_PATH}/${id}`,
          method: 'PUT',
          data,
          extraOptions: { ...rest },
        };
      },
      async onQueryStarted(arg, api) {
        try {
          const { queryFulfilled } = api;
          const updatedInfo = await queryFulfilled;
          if (updatedInfo?.data[1][0].id) {
            api.dispatch(
              timelineApi.util.invalidateTags([{ type: 'TIMELINE', id: 'LIST' }])
            );
            api.dispatch(
              contactApi.util.invalidateTags([{ type: 'CONTACT', id: 'LIST' }])
            );
            api.dispatch(
              leadApi.util.invalidateTags([{ type: 'LEAD', id: 'LIST' }])
            );
            api.dispatch(accountApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    deleteAccount: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: ACCOUNT_API_BASE_PATH,
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
              timelineApi.util.invalidateTags([{ type: 'TIMELINE', id: 'LIST' }])
            );
            api.dispatch(accountApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),

    restoreAccount: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${ACCOUNT_API_BASE_PATH}/restore`,
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
              timelineApi.util.invalidateTags([{ type: 'TIMELINE', id: 'LIST' }])
            );
            api.dispatch(
              trashApi.util.invalidateTags([{ type: 'TRASH', id: 'LIST' }])
            );
            api.dispatch(accountApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    destroyAccount: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${ACCOUNT_API_BASE_PATH}/destroy`,
          method: 'DELETE',
          data,
          extraOptions: { ...rest },
        };
      },
      async onQueryStarted(arg, api) {
        const { queryFulfilled } = api;
        const updatedInfo = await queryFulfilled;
        if (updatedInfo) {
          api.dispatch(
            timelineApi.util.invalidateTags([{ type: 'TIMELINE', id: 'LIST' }])
          );
          api.dispatch(
            trashApi.util.invalidateTags([{ type: 'TRASH', id: 'LIST' }])
          );
          api.dispatch(
            leadApi.util.invalidateTags([{ type: 'LEAD', id: 'LIST' }])
          );
          api.dispatch(accountApi.util.resetApiState());
        }
      },
    }),
  }),
  tagTypes: ['ACCOUNT'],
});

export const {
  useLazyGetAccountsPostQuery,
  useLazyGetAccountsQuery,
  useLazyGetAccountsWithoutChildQuery,
  useLazyGetParentAccountsQuery,
  useLazyGetAccountsCountsQuery,
  useLazyGetAccountByIdQuery,
  useLazyGetParentChildAccountQuery,
  useLazyCheckParentAccountQuery,
  useAddAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
  useRestoreAccountMutation,
  useDestroyAccountMutation,
} = accountApi;
