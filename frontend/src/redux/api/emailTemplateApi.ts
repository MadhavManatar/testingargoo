import { AxiosRequestConfig } from 'axios';
import baseQueryApi from './baseQueryApi';

const EMAIL_TEMPLATE_API_BASE_PATH = '/mail-template';

export const emailTemplateApi = baseQueryApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmailTemplateById: builder.query<any, AxiosRequestConfig<any> & { id: number }>({
      query: ({ id, data, ...rest }) => {
        return {
          url: `${EMAIL_TEMPLATE_API_BASE_PATH}/${id}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2) => {
        return [
          {
            type: 'EMAIL_TEMPLATE',
            id: 'LIST',
          },
        ];
      },
    }),
    getEmailTemplates: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${EMAIL_TEMPLATE_API_BASE_PATH}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2) => {
        return [
          {
            type: 'EMAIL_TEMPLATE',
            id: 'LIST',
          },
        ];
      },
    }),
    addEmailTemplate: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${EMAIL_TEMPLATE_API_BASE_PATH}`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      invalidatesTags: (_result, error) => {
        return error ? [] : [{ type: 'EMAIL_TEMPLATE', id: 'LIST' }];
      },
    }),
    updateEmailTemplateById: builder.mutation<any, AxiosRequestConfig<any> & { id: number }>(
      {
        query: ({ id, data, ...rest }: AxiosRequestConfig<any> & { id: number }) => {
          return {
            url: `${EMAIL_TEMPLATE_API_BASE_PATH}/${id}`,
            method: 'PUT',
            data,
            extraOptions: { ...rest },
          };
        },
        invalidatesTags: (_result, error, { id }) => {
          return error
            ? []
            : [
              { type: 'EMAIL_TEMPLATE', id: 'LIST' },
              { type: 'EMAIL_TEMPLATE', id },
            ];
        },
      }
    ),
    updateEmailVisibility: builder.mutation<any, AxiosRequestConfig<any>>(
      {
        query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
          return {
            url: `${EMAIL_TEMPLATE_API_BASE_PATH}/visibility`,
            method: 'PUT',
            data,
            extraOptions: { ...rest },
          };
        },
        invalidatesTags: (_result, error) => {
          return error
            ? []
            : [
              { type: 'EMAIL_TEMPLATE', id: 'LIST' },
            ];
        },
      }
    ),
    deleteEmailTemplates: builder.mutation<any, AxiosRequestConfig<any>>(
      {
        query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
          return {
            url: `${EMAIL_TEMPLATE_API_BASE_PATH}`,
            method: 'DELETE',
            data,
            extraOptions: { ...rest },
          };
        },
        invalidatesTags: (_result, error) => {
          return error
            ? []
            : [
              { type: 'EMAIL_TEMPLATE', id: 'LIST' },
            ];
        },
      }
    ),

  }),
});

export const {
  useLazyGetEmailTemplateByIdQuery,
  useLazyGetEmailTemplatesQuery,
  useAddEmailTemplateMutation,
  useUpdateEmailTemplateByIdMutation,
  useUpdateEmailVisibilityMutation,
  useDeleteEmailTemplatesMutation
} = emailTemplateApi;
