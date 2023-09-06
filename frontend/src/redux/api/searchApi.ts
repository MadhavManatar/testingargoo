import { AxiosRequestConfig } from 'axios';
import baseQueryApi from './baseQueryApi';

const SEARCH_API_BASE_PATH = '/search';

export const searchApi = baseQueryApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeadDealAccContSearch: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${SEARCH_API_BASE_PATH}/lead-deal-acc-cont`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [
          {
            type: 'SEARCH',
            id: 'LEAD_DEAL_ACC_CONTACT',
          },
        ];
      },
    }),
    getComposeEmailDropdown: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${SEARCH_API_BASE_PATH}/compose-email-dropdown`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [
          {
            type: 'SEARCH',
            id: 'COMPOSE_EMAIL_DROPDOWN',
          },
        ];
      },
    }),
  }),
});

export const {
  useLazyGetLeadDealAccContSearchQuery,
  useLazyGetComposeEmailDropdownQuery,
} = searchApi;
