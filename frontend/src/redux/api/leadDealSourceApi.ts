import { AxiosRequestConfig } from 'axios';
import { axiosBaseQuery } from 'axios/axios';
import { createApi } from '@reduxjs/toolkit/query/react';

const ENTITY_ATTRIBUTES_API_BASE_PATH = '/entity-attributes';

export const leadDealSourceApi = createApi({
  reducerPath: 'leadDealSourceApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getLeadDealSource: builder.query<any, AxiosRequestConfig<any>>({
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
    getEntityAttributeById: builder.query<
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
    addLeadDealSource: builder.mutation<any, AxiosRequestConfig<any>>({
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
            api.dispatch(leadDealSourceApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    updateLeadDealSource: builder.mutation<
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
            api.dispatch(leadDealSourceApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    deleteLeadDealSource: builder.mutation<any, AxiosRequestConfig<any>>({
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
            api.dispatch(leadDealSourceApi.util.resetApiState());
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
  useLazyGetLeadDealSourceQuery,
  useLazyGetEntityAttributeByIdQuery,
  useAddLeadDealSourceMutation,
  useUpdateLeadDealSourceMutation,
  useDeleteLeadDealSourceMutation,
} = leadDealSourceApi;
