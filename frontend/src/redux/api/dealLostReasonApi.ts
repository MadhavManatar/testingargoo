import { AxiosRequestConfig } from 'axios';
import { axiosBaseQuery } from 'axios/axios';
import { createApi } from '@reduxjs/toolkit/query/react';

const ENTITY_ATTRIBUTES_API_BASE_PATH = '/entity-attributes';

export const dealLostReasonApi = createApi({
  reducerPath: 'dealLostReasonApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getDealLostReasons: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${ENTITY_ATTRIBUTES_API_BASE_PATH}/get-data`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2, { data }) => {
        return [
          {
            type: 'ENTITY_ATTRIBUTE',
            id: data.query['q[type]'],
          },
        ];
      },
    }),
    getDealLostReasonById: builder.query<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({ id, data, ...rest }) => {
        return {
          url: `${ENTITY_ATTRIBUTES_API_BASE_PATH}/${id}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2, { id }) => {
        return [
          {
            type: 'ENTITY_ATTRIBUTE',
            id,
          },
        ];
      },
    }),
    addDealLostReason: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${ENTITY_ATTRIBUTES_API_BASE_PATH}`,
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
            api.dispatch(dealLostReasonApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    updateDealLostReason: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${ENTITY_ATTRIBUTES_API_BASE_PATH}/${id}`,
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
            api.dispatch(dealLostReasonApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    deleteDealLostReason: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: ENTITY_ATTRIBUTES_API_BASE_PATH,
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
            api.dispatch(dealLostReasonApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
  }),
  tagTypes: ['ENTITY_ATTRIBUTE'],
});

export const {
  useLazyGetDealLostReasonsQuery,
  useLazyGetDealLostReasonByIdQuery,
  useAddDealLostReasonMutation,
  useUpdateDealLostReasonMutation,
  useDeleteDealLostReasonMutation,
} = dealLostReasonApi;
