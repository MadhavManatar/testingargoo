import { AxiosRequestConfig } from 'axios';
import { axiosBaseQuery } from 'axios/axios';
import { createApi } from '@reduxjs/toolkit/query/react';

const USER_SESSION_API_BASE_PATH = '/user-sessions';

export const userSessionApi = createApi({
  reducerPath: 'userSessionApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getUserSession: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${USER_SESSION_API_BASE_PATH}/get-data`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2) => {
        return [
          {
            type: 'USER_SESSION',
            id: 'LIST',
          },
        ];
      },
    }),
  }),
  tagTypes: ['USER_SESSION'],
});

export const { useLazyGetUserSessionQuery } = userSessionApi;
