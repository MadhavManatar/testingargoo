// ** Import Packages **
import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosRequestConfig } from 'axios';

// ** Axios **
import { axiosBaseQuery } from 'axios/axios';

// ** API **
import { accountApi } from './accountApi';
import { timelineApi } from './timelineApi';
import { trashApi } from './trashApi';

// ** Constants **
import {
  BasicPermissionTypes,
  ModuleNames,
} from 'constant/permissions.constant';

// ** Helper **
import { hasAuthorized } from 'helper/auth.helper';

const CONTACT_API_BASE_PATH = '/contacts';

export const contactApi = createApi({
  reducerPath: 'contactApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getContacts: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${CONTACT_API_BASE_PATH}/get-data`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [{ type: 'CONTACT', id: 'LIST' }];
      },
    }),
    getContactsAdvance: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${CONTACT_API_BASE_PATH}/advance-filter`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [{ type: 'CONTACT', id: 'LIST' }];
      },
    }),
    getContactById: builder.query<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({ id, data, ...rest }) => {
        return {
          url: `${CONTACT_API_BASE_PATH}/get-data/${id}`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
    }),
    addContact: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${CONTACT_API_BASE_PATH}`,
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
            api.dispatch(
              timelineApi.util.invalidateTags([{ type: 'TIMELINE', id: 'LIST' }])
            );
            api.dispatch(
              accountApi.util.invalidateTags([{ type: 'ACCOUNT', id: 'LIST' }])
            );
            api.dispatch(contactApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    updateContact: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${CONTACT_API_BASE_PATH}/${id}`,
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
            api.dispatch(
              timelineApi.util.invalidateTags([{ type: 'TIMELINE', id: 'LIST' }])
            );
            api.dispatch(
              accountApi.util.invalidateTags([{ type: 'ACCOUNT', id: 'LIST' }])
            );
            api.dispatch(contactApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    deleteContact: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: CONTACT_API_BASE_PATH,
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
            api.dispatch(contactApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    getContactsCount: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        const readActivitiesPermission = hasAuthorized([
          { module: ModuleNames.CONTACT, type: BasicPermissionTypes.READ },
        ]);
        if (readActivitiesPermission) {
          return {
            url: `${CONTACT_API_BASE_PATH}/count`,
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
            type: 'CONTACT',
            id: 'LIST',
          },
        ];
      },
    }),
    restoreContact: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${CONTACT_API_BASE_PATH}/restore`,
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
            api.dispatch(
              timelineApi.util.invalidateTags([{ type: 'TIMELINE', id: 'LIST' }])
            );
            api.dispatch(
              trashApi.util.invalidateTags([{ type: 'TRASH', id: 'LIST' }])
            );
            api.dispatch(contactApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    destroyContact: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${CONTACT_API_BASE_PATH}/destroy`,
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
            api.dispatch(
              trashApi.util.invalidateTags([{ type: 'TRASH', id: 'LIST' }])
            );
            api.dispatch(contactApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
  }),
  tagTypes: ['CONTACT'],
});

export const {
  useLazyGetContactsAdvanceQuery,
  useLazyGetContactsQuery,
  useLazyGetContactByIdQuery,
  useAddContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useLazyGetContactsCountQuery,
  useRestoreContactMutation,
  useDestroyContactMutation,
} = contactApi;
