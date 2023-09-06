import { AxiosRequestConfig } from 'axios';
import { hasAuthorized } from 'helper/auth.helper';
import {
  BasicPermissionTypes,
  ModuleNames,
} from 'constant/permissions.constant';
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from 'axios/axios';
import { timelineApi } from './timelineApi';
import { accountApi } from './accountApi';
import { contactApi } from './contactApi';
import { dealStageHistoryApi } from './dealStageHistoryApi';
import { trashApi } from './trashApi';

const LEAD_API_BASE_PATH = '/leads';

export const leadApi = createApi({
  reducerPath: 'leadApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getLeads: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${LEAD_API_BASE_PATH}/get-data`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [
          {
            type: 'LEAD',
            id: 'LIST',
          },
        ];
      },
    }),
    getLeadsAdvance: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${LEAD_API_BASE_PATH}/advance-filter`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [
          {
            type: 'LEAD',
            id: 'LIST',
          },
        ];
      },
    }),
    getLeadById: builder.query<any, AxiosRequestConfig<any> & { id: number }>({
      query: ({ id, data, ...rest }) => {
        return {
          url: `${LEAD_API_BASE_PATH}/get-data/${id}`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
    }),
    addLead: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${LEAD_API_BASE_PATH}`,
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
              accountApi.util.invalidateTags([{ type: 'ACCOUNT', id: 'LIST' }])
            );
            api.dispatch(
              contactApi.util.invalidateTags([{ type: 'CONTACT', id: 'LIST' }])
            );
            api.dispatch(leadApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    updateLead: builder.mutation<any, AxiosRequestConfig<any> & { id: number }>(
      {
        query: ({
          id,
          data,
          ...rest
        }: AxiosRequestConfig<any> & { id: number }) => {
          return {
            url: `${LEAD_API_BASE_PATH}/${id}`,
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
                dealStageHistoryApi.util.invalidateTags([
                  { type: 'DEAL_STAGE_HISTORY', id: 'LIST' },
                ])
              );
              api.dispatch(
                contactApi.util.invalidateTags([{ type: 'CONTACT', id: 'LIST' }])
              );

              api.dispatch(leadApi.util.resetApiState());
            }
          } catch (error) {
            //
          }
        },
      }
    ),
    deleteLead: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: LEAD_API_BASE_PATH,
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
            api.dispatch(
              timelineApi.util.invalidateTags([{ type: 'TIMELINE', id: 'LIST' }])
            );
            api.dispatch(
              trashApi.util.invalidateTags([{ type: 'TRASH', id: 'LIST' }])
            );
            api.dispatch(leadApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),

    getLeadCount: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        const readActivitiesPermission = hasAuthorized([
          { module: ModuleNames.LEAD, type: BasicPermissionTypes.READ },
        ]);
        if (readActivitiesPermission) {
          return {
            url: `${LEAD_API_BASE_PATH}/count`,
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
            type: 'LEAD',
            id: 'LIST',
          },
        ];
      },
    }),

    getLeadPipelineStagesByLeadId: builder.query<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({ id, data, ...rest }) => {
        return {
          url: `${LEAD_API_BASE_PATH}/getWonLostStages/${id}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2, { id }) => {
        return [
          {
            type: 'LEAD',
            id,
          },
        ];
      },
    }),

    getLeadRestoreLeadApi: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${LEAD_API_BASE_PATH}/restore`,
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
            api.dispatch(leadApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    destroyLeads: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${LEAD_API_BASE_PATH}/destroy`,
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
            api.dispatch(
              timelineApi.util.invalidateTags([{ type: 'TIMELINE', id: 'LIST' }])
            );
            api.dispatch(
              trashApi.util.invalidateTags([{ type: 'TRASH', id: 'LIST' }])
            );
            api.dispatch(leadApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
  }),
  tagTypes: ['LEAD'],
});

export const {
  useLazyGetLeadsQuery,
  useLazyGetLeadsAdvanceQuery,
  useLazyGetLeadByIdQuery,
  useAddLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useLazyGetLeadCountQuery,
  useLazyGetLeadPipelineStagesByLeadIdQuery,
  useGetLeadRestoreLeadApiMutation,
  useDestroyLeadsMutation,
} = leadApi;
