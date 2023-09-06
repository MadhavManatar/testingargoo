import { AxiosRequestConfig } from 'axios';
import baseQueryApi from './baseQueryApi';

const ORG_ALT_API_BASE_PATH = '/org-alerts';

export const organizationAlertsApi = baseQueryApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizationAlerts: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${ORG_ALT_API_BASE_PATH}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [
          {
            type: 'ORGANIZATION_ALERTS',
            id: 'LIST',
          },
        ];
      },
    }),
    updateOrganizationAlerts: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${ORG_ALT_API_BASE_PATH}`,
          method: 'PATCH',
          data,
          extraOptions: { ...rest },
        };
      },
      invalidatesTags: (_result, error) => {
        return error ? [] : [{ type: 'ORGANIZATION_ALERTS', id: 'LIST' }];
      },
    }),
  }),
});

export const {
  useLazyGetOrganizationAlertsQuery,
  useUpdateOrganizationAlertsMutation,
} = organizationAlertsApi;
