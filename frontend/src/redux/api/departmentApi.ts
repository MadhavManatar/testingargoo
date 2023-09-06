// ** Import Packages **
import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { AxiosRequestConfig } from 'axios';

// ** Axios **
import { axiosBaseQuery } from 'axios/axios';

const DEPARTMENT_API_BASE_PATH = '/departments';

export const departmentApi = createApi({
  reducerPath: 'departmentApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getDepartments: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${DEPARTMENT_API_BASE_PATH}/get-data`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [{ type: 'DEPARTMENT', id: 'LIST', },];
      },
    }),
    getDepartmentById: builder.query<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({ id, data, ...rest }) => {
        return {
          url: `${DEPARTMENT_API_BASE_PATH}/${id}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2, { id }) => {
        return [{ type: 'DEPARTMENT', id, },];
      },
    }),
    addDepartment: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${DEPARTMENT_API_BASE_PATH}`,
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
            api.dispatch(departmentApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    updateDepartment: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${DEPARTMENT_API_BASE_PATH}/${id}`,
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
            api.dispatch(departmentApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    deleteDepartment: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: DEPARTMENT_API_BASE_PATH,
          method: 'DELETE',
          data,
          extraOptions: { ...rest },
        };
      },
    }),
  }),
  tagTypes: ['DEPARTMENT']
});

export const {
  useLazyGetDepartmentsQuery,
  useLazyGetDepartmentByIdQuery,
  useAddDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentApi;
