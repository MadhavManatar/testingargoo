import { AxiosRequestConfig } from 'axios';
import baseQueryApi from './baseQueryApi';

const TRASH_API_BASE_PATH = '/trash';

export const trashApi = baseQueryApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTrashData: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: TRASH_API_BASE_PATH,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [{ type: 'TRASH', id: 'LIST' }];
      },
    }),
  }),
});

export const { useLazyGetAllTrashDataQuery } = trashApi;
