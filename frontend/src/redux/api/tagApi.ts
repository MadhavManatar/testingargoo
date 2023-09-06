import { AxiosRequestConfig } from 'axios';
import {
  BasicPermissionTypes,
  ModuleNames,
  TagPermissions,
} from 'constant/permissions.constant';

import { createApi } from '@reduxjs/toolkit/query/react';
import { hasAuthorized } from 'helper/auth.helper';
import { axiosBaseQuery } from 'axios/axios';
import { timelineApi } from './timelineApi';
import { accountApi } from './accountApi';
import { contactApi } from './contactApi';
import { leadApi } from './leadApi';
import { activityApi } from './activityApi';

const TAG_API_BASE_PATH = '/tags';

export const tagApi = createApi({
  reducerPath: 'tagApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getTags: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${TAG_API_BASE_PATH}/get-data`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [{ type: 'TAG', id: 'LIST' }];
      },
    }),
    getTagById: builder.query<
      any,
      AxiosRequestConfig<any> & {
        id: number;
      }
    >({
      query: ({ id, data, ...rest }) => {
        return {
          url: `${TAG_API_BASE_PATH}/${id}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2, { id }) => {
        return [{ type: 'TAG', id }];
      },
    }),
    getAssignedTagByModelRecordId: builder.query<
      any,
      AxiosRequestConfig<any> & {
        id: number;
        modelName: TagPermissions | ModuleNames;
      }
    >({
      query: ({ id, data, modelName, ...rest }) => {
        const readTagPermission = hasAuthorized([
          {
            module: ModuleNames.TAG,
            type: modelName || BasicPermissionTypes.READ,
          },
        ]);

        if (readTagPermission) {
          return {
            url: `${TAG_API_BASE_PATH}/assign/${id}`,
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
      providesTags: (_arg1, _arg2, QueryArg) => {
        return [
          {
            type: 'TAG',
            id: QueryArg.id,
          },
        ];
      },
    }),
    assignTag: builder.mutation<
      any,
      AxiosRequestConfig<any> & {
        id: number;
      }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & {
        id: number;
      }) => {
        return {
          url: `${TAG_API_BASE_PATH}/assign/${id}`,
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
            api.dispatch(tagApi.util.resetApiState());
            if (arg?.data?.modelName === TagPermissions.ACCOUNT) {
              api.dispatch(accountApi.util.resetApiState());
            } else if (arg?.data?.modelName === TagPermissions.CONTACT) {
              api.dispatch(contactApi.util.resetApiState());
            } else if (arg?.data?.modelName === TagPermissions.LEAD) {
              api.dispatch(leadApi.util.resetApiState());
            } else if (arg?.data?.modelName === TagPermissions.DEAL) {
              api.dispatch(leadApi.util.resetApiState());
            } else if (arg?.data?.modelName === TagPermissions.ACTIVITY) {
              api.dispatch(activityApi.util.resetApiState());
            }
          }
        } catch (error) {
          //
        }
      },
    }),
    rearrangeTag: builder.mutation<
      any,
      AxiosRequestConfig<any> & {
        id: number;
      }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & {
        id: number;
      }) => {
        return {
          url: `${TAG_API_BASE_PATH}/arrange/${id}`,
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
              timelineApi.util.invalidateTags([
                { type: 'TIMELINE', id: 'LIST' },
              ])
            );
            api.dispatch(tagApi.util.resetApiState());
            if (arg?.data?.modelName === TagPermissions.ACCOUNT) {
              api.dispatch(accountApi.util.resetApiState());
            } else if (arg?.data?.modelName === TagPermissions.CONTACT) {
              api.dispatch(contactApi.util.resetApiState());
            } else if (arg?.data?.modelName === TagPermissions.LEAD) {
              api.dispatch(leadApi.util.resetApiState());
            } else if (arg?.data?.modelName === TagPermissions.DEAL) {
              api.dispatch(leadApi.util.resetApiState());
            } else if (arg?.data?.modelName === TagPermissions.ACTIVITY) {
              api.dispatch(activityApi.util.resetApiState());
            }
          }
        } catch (error) {
          //
        }
      },
    }),
    addTag: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${TAG_API_BASE_PATH}`,
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
            api.dispatch(tagApi.util.resetApiState());
            if (arg?.data?.modelName === TagPermissions.ACCOUNT) {
              api.dispatch(accountApi.util.resetApiState());
            } else if (arg?.data?.modelName === TagPermissions.CONTACT) {
              api.dispatch(contactApi.util.resetApiState());
            } else if (arg?.data?.modelName === TagPermissions.LEAD) {
              api.dispatch(leadApi.util.resetApiState());
            } else if (arg?.data?.modelName === TagPermissions.DEAL) {
              api.dispatch(leadApi.util.resetApiState());
            } else if (arg?.data?.modelName === TagPermissions.ACTIVITY) {
              api.dispatch(activityApi.util.resetApiState());
            }
          }
        } catch (error) {
          //
        }
      },
    }),
    updateTag: builder.mutation<any, AxiosRequestConfig<any> & { id: number }>({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${TAG_API_BASE_PATH}/${id}`,
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
              timelineApi.util.invalidateTags([
                { type: 'TIMELINE', id: 'LIST' },
              ])
            );
            api.dispatch(tagApi.util.resetApiState());
            if (arg?.data?.modelName === TagPermissions.ACCOUNT) {
              api.dispatch(accountApi.util.resetApiState());
            } else if (arg?.data?.modelName === TagPermissions.CONTACT) {
              api.dispatch(contactApi.util.resetApiState());
            } else if (arg?.data?.modelName === TagPermissions.LEAD) {
              api.dispatch(leadApi.util.resetApiState());
            } else if (arg?.data?.modelName === TagPermissions.DEAL) {
              api.dispatch(leadApi.util.resetApiState());
            } else if (arg?.data?.modelName === TagPermissions.ACTIVITY) {
              api.dispatch(activityApi.util.resetApiState());
            }
          }
        } catch (error) {
          //
        }
      },
    }),
    deleteTags: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: TAG_API_BASE_PATH,
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
              timelineApi.util.invalidateTags([
                { type: 'TIMELINE', id: 'LIST' },
              ])
            );
            api.dispatch(tagApi.util.resetApiState());
            if (arg?.data?.modelName === TagPermissions.ACCOUNT) {
              api.dispatch(accountApi.util.resetApiState());
            } else if (arg?.data?.modelName === TagPermissions.CONTACT) {
              api.dispatch(contactApi.util.resetApiState());
            } else if (arg?.data?.modelName === TagPermissions.LEAD) {
              api.dispatch(leadApi.util.resetApiState());
            } else if (arg?.data?.modelName === TagPermissions.DEAL) {
              api.dispatch(leadApi.util.resetApiState());
            } else if (arg?.data?.modelName === TagPermissions.ACTIVITY) {
              api.dispatch(activityApi.util.resetApiState());
            }
          }
        } catch (error) {
          //
        }
      },
    }),
  }),
  tagTypes: ['TAG'],
});

export const {
  useLazyGetTagsQuery,
  useLazyGetTagByIdQuery,
  useLazyGetAssignedTagByModelRecordIdQuery,
  useAssignTagMutation,
  useRearrangeTagMutation,
  useAddTagMutation,
  useUpdateTagMutation,
  useDeleteTagsMutation,
} = tagApi;
