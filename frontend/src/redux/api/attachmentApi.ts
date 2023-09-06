import { AxiosRequestConfig } from 'axios';
import baseQueryApi from './baseQueryApi';

const ATTACHMENT_API_BASE_PATH = '/attachments';

export const attachmentApi = baseQueryApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttachments: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${ATTACHMENT_API_BASE_PATH}`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [{ type: 'ATTACHMENT', id: 'LIST' }];
      },
    }),
    getAttachmentById: builder.query<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({ id, data, ...rest }) => {
        return {
          url: `${ATTACHMENT_API_BASE_PATH}/get-data/${id}`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2, { id }) => {
        return [{ type: 'ATTACHMENT', id }];
      },
    }),
    addAttachment: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${ATTACHMENT_API_BASE_PATH}`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      invalidatesTags: (_result, error) => {
        return error
          ? []
          : [
            { type: 'ATTACHMENT', id: 'LIST' },
            { type: 'TIMELINE', id: 'LIST' },
          ];
      },
    }),
    deleteAttachments: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: ATTACHMENT_API_BASE_PATH,
          method: 'DELETE',
          data,
          extraOptions: { ...rest },
        };
      },
      invalidatesTags: (_result, error) => {
        return error
          ? []
          : [
            { type: 'ATTACHMENT', id: 'LIST' },
            { type: 'TIMELINE', id: 'LIST' },
          ];
      },
    }),
    deleteAttachment: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${ATTACHMENT_API_BASE_PATH}/${id}`,
          method: 'DELETE',
          data,
          extraOptions: { ...rest },
        };
      },
      invalidatesTags: (_result, error) => {
        return error
          ? []
          : [
            { type: 'ATTACHMENT', id: 'LIST' },
            { type: 'TIMELINE', id: 'LIST' },
          ];
      },
    }),
  }),
});

export const {
  useLazyGetAttachmentsQuery,
  useLazyGetAttachmentByIdQuery,
  useAddAttachmentMutation,
  useDeleteAttachmentsMutation,
  useDeleteAttachmentMutation,
} = attachmentApi;
