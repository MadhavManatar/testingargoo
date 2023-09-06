// ** Import Packages **
import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { AxiosRequestConfig } from 'axios';

// ** Axios **
import { axiosBaseQuery } from 'axios/axios';

const COMPANY_API_BASE_PATH = '/organizations';

export const companyDetailApi = createApi({
  reducerPath: 'companyDetailApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getCompanyDetail: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${COMPANY_API_BASE_PATH}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [
          {
            type: 'COMPANY_DETAIL',
            id: 'LIST',
          },
        ];
      },
    }),
    updateCompany: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${COMPANY_API_BASE_PATH}`,
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
            api.dispatch(companyDetailApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
  }),
  tagTypes: ['COMPANY_DETAIL']
});

export const { useLazyGetCompanyDetailQuery, useUpdateCompanyMutation } =
  companyDetailApi;
