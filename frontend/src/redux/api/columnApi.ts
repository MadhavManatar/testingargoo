// ** Import Packages **
import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { AxiosRequestConfig } from 'axios';

// ** Axios **
import { axiosBaseQuery } from 'axios/axios';

const VIEW_API_BASE_PATH = '/views';

export const columnApi = createApi({
  reducerPath: 'columnApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getAllColumnViewAPI: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${VIEW_API_BASE_PATH}/get-data`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [{ type: 'COLUMN_VIEWS', id: 'LIST' }];
      },
    }),
    getAllColumn: builder.query<
      any,
      AxiosRequestConfig<any> & { collectionName: string; type?: boolean }
    >({
      query: ({ collectionName, type, data, ...rest }) => {
        return {
          url:
            collectionName.toLowerCase() === 'leads'
              ? `/${collectionName.toLowerCase()}/columns?q[is_deal]=${type}`
              : `/${collectionName.toLowerCase()}/columns`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [{ type: 'COLUMN', id: 'LIST' }];
      },
    }),

    addColumnView: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${VIEW_API_BASE_PATH}`,
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
              columnApi.util.invalidateTags([{ type: 'COLUMN', id: 'LIST' }])
            );
            api.dispatch(
              columnApi.util.invalidateTags([
                { type: 'COLUMN_VIEWS', id: 'LIST' },
              ])
            );
          }
        } catch (error) {
          //
        }
      },
    }),

    updateColumnView: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${VIEW_API_BASE_PATH}/${id}`,
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
              columnApi.util.invalidateTags([{ type: 'COLUMN', id: 'LIST' }])
            );
            api.dispatch(
              columnApi.util.invalidateTags([
                { type: 'COLUMN_VIEWS', id: 'LIST' },
              ])
            );
          }
        } catch (error) {
          //
        }
      },
    }),

    updateViewOrder: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${VIEW_API_BASE_PATH}/update-view-order`,
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
              columnApi.util.invalidateTags([
                { type: 'COLUMN_VIEWS', id: 'LIST' },
              ])
            );
          }
        } catch (error) {
          //
        }
      },
    }),

    deleteColumnView: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${VIEW_API_BASE_PATH}/${id}`,
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
              columnApi.util.invalidateTags([{ type: 'COLUMN', id: 'LIST' }])
            );
            api.dispatch(
              columnApi.util.invalidateTags([
                { type: 'COLUMN_VIEWS', id: 'LIST' },
              ])
            );
          }
        } catch (error) {
          //
        }
      },
    }),
  }),
  tagTypes: ['COLUMN', 'COLUMN_VIEWS'],
});

export const {
  useLazyGetAllColumnViewAPIQuery,
  useLazyGetAllColumnQuery,
  useAddColumnViewMutation,
  useUpdateColumnViewMutation,
  useDeleteColumnViewMutation,
  useUpdateViewOrderMutation,
} = columnApi;
