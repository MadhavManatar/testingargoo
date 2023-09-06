import { AxiosRequestConfig } from 'axios';
import baseQueryApi from './baseQueryApi';

const ORG_STG_API_BASE_PATH = '/organization-settings';

export const organizationSettingApi = baseQueryApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizationSetting: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${ORG_STG_API_BASE_PATH}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [
          {
            type: 'ORGANIZATION_SETTING',
            id: 'LIST',
          },
        ];
      },
    }),
    updateOrganizationSetting: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${ORG_STG_API_BASE_PATH}`,
          method: 'PATCH',
          data,
          extraOptions: { ...rest },
        };
      },
      invalidatesTags: (_result, error) => {
        return error ? [] : [{ type: 'ORGANIZATION_SETTING', id: 'LIST' }];
      },
    }),
  }),
});

export const {
  useLazyGetOrganizationSettingQuery,
  useUpdateOrganizationSettingMutation,
} = organizationSettingApi;
