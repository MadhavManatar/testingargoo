import { AxiosRequestConfig } from 'axios';
import { axiosBaseQuery } from 'axios/axios';
import { createApi } from '@reduxjs/toolkit/query/react';
import { accountApi } from './accountApi';
import { contactApi } from './contactApi';
import { leadApi } from './leadApi';
import { timelineApi } from './timelineApi';

const EMAIL_API_BASE_PATH = '/gmail';

export const gmailApi = createApi({
  reducerPath: 'gmailApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    sendMail: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${EMAIL_API_BASE_PATH}/send`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      async onQueryStarted(arg, api) {
        try {
          const { queryFulfilled } = api;
          const updatedInfo = await queryFulfilled;
          if (updatedInfo?.data?.conversion.id) {
            api.dispatch(
              accountApi.util.invalidateTags([{ type: 'ACCOUNT', id: 'LIST' }])
            );
            api.dispatch(
              contactApi.util.invalidateTags([{ type: 'CONTACT', id: 'LIST' }])
            );
            api.dispatch(
              leadApi.util.invalidateTags([{ type: 'LEAD', id: 'LIST' }])
            );
            api.dispatch(
              timelineApi.util.invalidateTags([{ type: 'TIMELINE', id: 'LIST' }])
            );
            api.dispatch(gmailApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
  }),
  tagTypes: ['GMAIL'],
});

export const { useSendMailMutation } = gmailApi;
