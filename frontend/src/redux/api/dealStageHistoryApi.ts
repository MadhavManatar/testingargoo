import { AxiosRequestConfig } from 'axios';
import { axiosBaseQuery } from 'axios/axios';
import { createApi } from '@reduxjs/toolkit/query/react';
import { timelineApi } from './timelineApi';

const DEAL_STAGE_HISTORY_API_BASE_PATH = '/deal-stage-history';

export const dealStageHistoryApi = createApi({
  reducerPath: 'dealStageHistoryApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getDealsStage: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${DEAL_STAGE_HISTORY_API_BASE_PATH}/`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [{ type: 'DEAL_STAGE_HISTORY', id: 'LIST' }];
      },
    }),
    getAllDealState: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${DEAL_STAGE_HISTORY_API_BASE_PATH}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [{ type: 'DEAL_STAGE_HISTORY', id: 'LIST' }];
      },
    }),
    getActiveDealStage: builder.query<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({ id, data, ...rest }) => {
        return {
          url: `${DEAL_STAGE_HISTORY_API_BASE_PATH}/${id}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      // providesTags: (_arg1, _arg2, { id }) => {
      //   return [{ type: 'DEAL_STAGE_HISTORY', id }];
      // },
    }),
    updateDealStage: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${DEAL_STAGE_HISTORY_API_BASE_PATH}`,
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
              timelineApi.util.invalidateTags([
                { type: 'TIMELINE', id: 'LIST' },
              ])
            );
            api.dispatch(dealStageHistoryApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    updateStageByDealId: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${DEAL_STAGE_HISTORY_API_BASE_PATH}/${id}`,
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
            api.dispatch(dealStageHistoryApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    getDealAgeByDealId: builder.query<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({ id, data, ...rest }) => {
        return {
          url: `${DEAL_STAGE_HISTORY_API_BASE_PATH}/dealAge/${id}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2, { id }) => {
        return [{ type: 'DEAL_STAGE_HISTORY', id }];
      },
    }),
  }),
  tagTypes: ['DEAL_STAGE_HISTORY'],
});

export const {
  useLazyGetDealsStageQuery,
  useLazyGetActiveDealStageQuery,
  useLazyGetAllDealStateQuery,
  useUpdateDealStageMutation,
  useUpdateStageByDealIdMutation,
  useLazyGetDealAgeByDealIdQuery,
} = dealStageHistoryApi;
