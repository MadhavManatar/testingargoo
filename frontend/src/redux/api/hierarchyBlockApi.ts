import { AxiosRequestConfig } from 'axios';
import baseQueryApi from './baseQueryApi';

const HIERARCHY_BLOCK_API_BASE_PATH = '/hierarchy-block-details';

export const hierarchyBlocksApi = baseQueryApi.injectEndpoints({
  endpoints: (builder) => ({
    getHierarchyBlocks: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${HIERARCHY_BLOCK_API_BASE_PATH}/get-data`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2, { data }) => {
        return [
          {
            type: 'HIERARCHY_BLOCK',
            id: data.query['q[type]'],
          },
        ];
      },
    }),
    getHierarchyBlockById: builder.query<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({ id, data, ...rest }) => {
        return {
          url: `${HIERARCHY_BLOCK_API_BASE_PATH}/${id}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2, { id }) => {
        return [
          {
            type: 'HIERARCHY_BLOCK',
            id,
          },
        ];
      },
    }),
    addHierarchyBlock: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${HIERARCHY_BLOCK_API_BASE_PATH}`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      invalidatesTags: (_result, error, { data }) => {
        return error ? [] : [{ type: 'HIERARCHY_BLOCK', id: data.type }];
      },
    }),
    updateHierarchyBlock: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${HIERARCHY_BLOCK_API_BASE_PATH}/${id}`,
          method: 'PUT',
          data,
          extraOptions: { ...rest },
        };
      },
      invalidatesTags: (_result, error, { id, data }) => {
        return error
          ? []
          : [
              { type: 'HIERARCHY_BLOCK', id: data.type },
              { type: 'HIERARCHY_BLOCK', id },
            ];
      },
    }),

    updateHierarchyBlockForUserPosition: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${HIERARCHY_BLOCK_API_BASE_PATH}/user-position/${id}`,
          method: 'PUT',
          data,
          extraOptions: { ...rest },
        };
      },
      invalidatesTags: (_result, error, { id, data }) => {
        return error
          ? []
          : [
              { type: 'HIERARCHY_BLOCK', id: data.type },
              { type: 'HIERARCHY_BLOCK', id },
            ];
      },
    }),

    deleteHierarchyBlock: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: HIERARCHY_BLOCK_API_BASE_PATH,
          method: 'DELETE',
          data,
          extraOptions: { ...rest },
        };
      },
      invalidatesTags: (_result, error, { data }) => {
        return error ? [] : [{ type: 'HIERARCHY_BLOCK', id: data.type }];
      },
    }),
  }),
});

export const {
  useLazyGetHierarchyBlocksQuery,
  useLazyGetHierarchyBlockByIdQuery,
  useAddHierarchyBlockMutation,
  useUpdateHierarchyBlockMutation,
  useUpdateHierarchyBlockForUserPositionMutation,
  useDeleteHierarchyBlockMutation,
} = hierarchyBlocksApi;
