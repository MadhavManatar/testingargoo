import { AxiosRequestConfig } from 'axios';
import { axiosBaseQuery } from 'axios/axios';
import { createApi } from '@reduxjs/toolkit/query/react';

const USER_API_BASE_PATH = '/users';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getAllUser: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${USER_API_BASE_PATH}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2) => {
        return [
          {
            type: 'USER',
            id: 'LIST',
          },
        ];
      },
    }),
    getUsers: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${USER_API_BASE_PATH}/get-data`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [
          {
            type: 'USER',
            id: 'LIST',
          },
        ];
      },
    }),
    getUserById: builder.query<any, AxiosRequestConfig<any> & { id: number }>({
      query: ({ id, data, ...rest }) => {
        return {
          url: `${USER_API_BASE_PATH}/${id}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2, { id }) => {
        return [
          {
            type: 'USER',
            id,
          },
        ];
      },
    }),
    addUser: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${USER_API_BASE_PATH}`,
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
            api.dispatch(userApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    updateUser: builder.mutation<any, AxiosRequestConfig<any> & { id: number }>(
      {
        query: ({
          id,
          data,
          ...rest
        }: AxiosRequestConfig<any> & { id: number }) => {
          return {
            url: `${USER_API_BASE_PATH}/${id}`,
            method: 'PUT',
            data,
            extraOptions: { ...rest },
          };
        },
        async onQueryStarted(arg, api) {
          try {
            const { queryFulfilled } = api;
            const updatedInfo = await queryFulfilled;
            if (updatedInfo?.data?.user?.id) {
              api.dispatch(userApi.util.resetApiState());
            }
          } catch (error) {
            // 
          }
        },
      }
    ),
    deleteUser: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: USER_API_BASE_PATH,
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
            api.dispatch(userApi.util.resetApiState());
          }
        } catch (error) {
          // 
        }
      },
    }),
    getLoggedUser: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${USER_API_BASE_PATH}/logged-in-user`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2) => {
        return [
          {
            type: 'USER',
            id: 'LIST',
          },
        ];
      },
    }),
    getDescendantsUser: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${USER_API_BASE_PATH}/get-descendants-users`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2) => {
        return [
          {
            type: 'USER',
            id: 'LIST',
          },
        ];
      },
    }),
    getHierarchyUser: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${USER_API_BASE_PATH}/get-hierarchy-users`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2) => {
        return [
          {
            type: 'USER',
            id: 'LIST',
          },
        ];
      },
    }),
  }),
  tagTypes: ['USER'],
});

export const {
  useLazyGetAllUserQuery,
  useLazyGetUsersQuery,
  useLazyGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useLazyGetLoggedUserQuery,
  useLazyGetDescendantsUserQuery,
  useLazyGetHierarchyUserQuery,
} = userApi;
