import { AxiosRequestConfig } from 'axios';
import baseQueryApi from './baseQueryApi';
import { GetMailPayload } from './types/mail.model';

const EMAIL_API_BASE_PATH = '/mail';

export const getMailApi = baseQueryApi.injectEndpoints({
  endpoints: (builder) => ({
    getMails: builder.query<any, unknown>({
      query: (params: GetMailPayload) => {
        return {
          url: EMAIL_API_BASE_PATH,
          method: 'GET',
          params,
        };
      },
      providesTags: [{ type: 'MAIL', id: 'LIST' }],
    }),
    useGetTreadEmailDetails: builder.query<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({ id, data, ...rest }) => {
        return {
          url: `${EMAIL_API_BASE_PATH}/thread/${id}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2, { id }) => {
        return [
          {
            type: 'MAIL',
            id,
          },
        ];
      },
    }),
    getMailLinks: builder.query<any, unknown>({
      query: (id: number) => {
        return {
          url: `${EMAIL_API_BASE_PATH}/link-entities/${id}`,
          method: 'GET',
        };
      },
      providesTags: [{ type: 'MAIL', id: 'LIST' }],
    }),
    emailLinkEntity: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({ id, data, ...rest }) => {
        return {
          url: `${EMAIL_API_BASE_PATH}/link-entity/${id}`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      invalidatesTags: (_arg1, _arg2, { id }) => {
        return [
          {
            type: 'EMAIL_LINK_ENTITY',
            id,
          },
        ];
      },
    }),
    deleteMail: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: EMAIL_API_BASE_PATH,
          method: 'DELETE',
          data,
          extraOptions: { ...rest },
        };
      },
      invalidatesTags: [{ type: 'MAIL', id: 'LIST' }],
    }),
    markAsReadUnread: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${EMAIL_API_BASE_PATH}/mark-as-read-unread`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      invalidatesTags: [{ type: 'MAIL', id: 'LIST' }],
    }),
    updateMailStatus: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${EMAIL_API_BASE_PATH}/status`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      invalidatesTags: [{ type: 'MAIL', id: 'LIST' }],
    }),
  }),
});

export const {
  useLazyUseGetTreadEmailDetailsQuery,
  useLazyGetMailsQuery,
  useLazyGetMailLinksQuery,
  useEmailLinkEntityMutation,
  useDeleteMailMutation,
  useMarkAsReadUnreadMutation,
  useUpdateMailStatusMutation,
} = getMailApi;
