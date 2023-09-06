import { AxiosRequestConfig } from 'axios';
import baseQueryApi from './baseQueryApi';

const HIERARCHY_API_BASE_PATH = '/hierarchy';

export const hierarchyApi = baseQueryApi.injectEndpoints({
  endpoints: (builder) => ({
    getHierarchy: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${HIERARCHY_API_BASE_PATH}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [{ type: 'HIERARCHY', id: 'LIST' }];
      },
    }),
    addHierarchy: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${HIERARCHY_API_BASE_PATH}`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      invalidatesTags: (_result, error) => {
        return error ? [] : [{ type: 'HIERARCHY', id: 'LIST' }];
      },
    }),
  }),
});

export const { useLazyGetHierarchyQuery, useAddHierarchyMutation } =
  hierarchyApi;
