import { AxiosRequestConfig } from 'axios';
import baseQueryApi from './baseQueryApi';

const HIERARCHY_DEPARTMENT_API_BASE_PATH = '/hierarchy-departments';

export const orgDepartmentApi = baseQueryApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrgDepartments: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${HIERARCHY_DEPARTMENT_API_BASE_PATH}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [
          {
            type: 'ORG_DEPARTMENT',
            id: 'LIST',
          },
        ];
      },
    }),
    getOrgDepartmentById: builder.query<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({ id, data, ...rest }) => {
        return {
          url: `${HIERARCHY_DEPARTMENT_API_BASE_PATH}/${id}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },

      providesTags: (_arg1, _arg2, { id }) => {
        return [
          {
            type: 'ORG_DEPARTMENT',
            id,
          },
        ];
      },
    }),
    addOrgDepartment: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${HIERARCHY_DEPARTMENT_API_BASE_PATH}`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      invalidatesTags: (_result, error) => {
        return error
          ? []
          : [
              {
                type: 'ORG_DEPARTMENT',
                id: 'LIST',
              },
            ];
      },
    }),
    updateOrgDepartment: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${HIERARCHY_DEPARTMENT_API_BASE_PATH}/${id}`,
          method: 'PUT',
          data,
          extraOptions: { ...rest },
        };
      },
      invalidatesTags: (_result, error, { id }) => {
        return error
          ? []
          : [
              {
                type: 'ORG_DEPARTMENT',
                id: 'LIST',
              },
              { type: 'ORG_DEPARTMENT', id },
            ];
      },
    }),
    deleteOrgDepartment: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: HIERARCHY_DEPARTMENT_API_BASE_PATH,
          method: 'DELETE',
          data,
          extraOptions: { ...rest },
        };
      },
      invalidatesTags: (_result, error) => {
        return error ? [] : [{ type: 'ORG_DEPARTMENT', id: 'LIST' }];
      },
    }),
  }),
});

export const {
  useLazyGetOrgDepartmentsQuery,
  useLazyGetOrgDepartmentByIdQuery,
  useAddOrgDepartmentMutation,
  useUpdateOrgDepartmentMutation,
  useDeleteOrgDepartmentMutation,
} = orgDepartmentApi;
