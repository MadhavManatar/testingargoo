import { AxiosRequestConfig } from 'axios';
import baseQueryApi from './baseQueryApi';

export enum EntityAttributesEnum {
  LEAD_TEMP_STATUS = 'LEAD_TEMP_STATUS',
  LEAD_STATUS = 'LEAD_STATUS',
  PHONE_TYPE = 'PHONE_TYPE',
  JOB_ROLE = 'JOB_ROLE',
  LEAD_DEAL_SOURCE = 'LEAD_DEAL_SOURCE',
  DEAL_LOST_REASON = 'DEAL_LOST_REASON',
}

const ENTITY_ATTRIBUTES_API_BASE_PATH = '/entity-attributes';

export const entityAttributesApi = baseQueryApi.injectEndpoints({
  endpoints: (builder) => ({
    getEntityAttributes: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${ENTITY_ATTRIBUTES_API_BASE_PATH}/get-data`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2, { data }) => {
        return [
          {
            type: 'ENTITY_ATTRIBUTE',
            id: data.query['q[type]'],
          },
        ];
      },
    }),
    getEntityAttributeById: builder.query<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({ id, data, ...rest }) => {
        return {
          url: `${ENTITY_ATTRIBUTES_API_BASE_PATH}/${id}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2, { id }) => {
        return [
          {
            type: 'ENTITY_ATTRIBUTE',
            id,
          },
        ];
      },
    }),
    addEntityAttribute: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${ENTITY_ATTRIBUTES_API_BASE_PATH}`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      invalidatesTags: (_result, error, { data }) => {
        return error ? [] : [{ type: 'ENTITY_ATTRIBUTE', id: data.type }];
      },
    }),
    updateEntityAttribute: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${ENTITY_ATTRIBUTES_API_BASE_PATH}/${id}`,
          method: 'PUT',
          data,
          extraOptions: { ...rest },
        };
      },
      invalidatesTags: (_result, error, { id, data }) => {
        return error
          ? []
          : [
              { type: 'ENTITY_ATTRIBUTE', id: data.type },
              { type: 'ENTITY_ATTRIBUTE', id },
            ];
      },
    }),
    deleteEntityAttribute: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: ENTITY_ATTRIBUTES_API_BASE_PATH,
          method: 'DELETE',
          data,
          extraOptions: { ...rest },
        };
      },
      invalidatesTags: (_result, error, { data }) => {
        return error ? [] : [{ type: 'ENTITY_ATTRIBUTE', id: data.type }];
      },
    }),
  }),
});

export const {
  useLazyGetEntityAttributesQuery,
  useLazyGetEntityAttributeByIdQuery,
  useAddEntityAttributeMutation,
  useUpdateEntityAttributeMutation,
  useDeleteEntityAttributeMutation,
} = entityAttributesApi;
