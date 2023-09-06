import { AxiosRequestConfig } from 'axios';
import baseQueryApi from './baseQueryApi';

const PERMISSION_API_BASE_PATH = '/roles/permissions';

export const permissionsApi = baseQueryApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfilePermissionsById: builder.query<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({ id, data, ...rest }) => {
        return {
          url: `${PERMISSION_API_BASE_PATH}/${id}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2, { id }) => {
        return [
          {
            type: 'PERMISSIONS_TYPE',
            id,
          },
        ];
      },
    }),
    getAllProfilePermissions: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${PERMISSION_API_BASE_PATH}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2) => {
        return [
          {
            type: 'PERMISSIONS_TYPE',
          },
        ];
      },
    }),
    updateProfilePermission: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${PERMISSION_API_BASE_PATH}/${id}`,
          method: 'PUT',
          data,
          extraOptions: { ...rest },
        };
      },
      invalidatesTags: (_result, error, { id }) => {
        return error
          ? []
          : [
              { type: 'PERMISSIONS_TYPE', id: 'LIST' },
              { type: 'PERMISSIONS_TYPE', id },
            ];
      },
    }),
  }),
});

export const {
  useLazyGetProfilePermissionsByIdQuery,
  useLazyGetAllProfilePermissionsQuery,
  useUpdateProfilePermissionMutation,
} = permissionsApi;
