import { AxiosRequestConfig } from 'axios';
import baseQueryApi from './baseQueryApi';

const FILE_API_BASE_PATH = '/files';

export const fileApi = baseQueryApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFille: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${FILE_API_BASE_PATH}/upload`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      invalidatesTags: (_result, error) => {
        return error ? [] : [{ type: 'FILE', id: 'UPLOAD' }];
      },
    }),
    getFilePath: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ ...rest }) => {
        return {
          url: `${FILE_API_BASE_PATH}`,
          method: 'GET',
          extraOptions: { ...rest },
        };
      },
      providesTags: () => [{ type: 'FILE' }],
    }),
  }),
});

export const { useUploadFilleMutation, useLazyGetFilePathQuery } = fileApi;
