// ** Import Packages **
import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { AxiosRequestConfig } from 'axios';

// ** Axios **
import { axiosBaseQuery } from 'axios/axios';

// ** API **
import { timelineApi } from './timelineApi';

const NOTE_API_BASE_PATH = '/notes';

export const noteApi = createApi({
  reducerPath: 'noteApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getNotes: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${NOTE_API_BASE_PATH}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [{ type: 'NOTE', id: 'LIST', },];
      },
    }),
    getNoteById: builder.query<any, AxiosRequestConfig<any> & { id: number }>({
      query: ({ id, data, ...rest }) => {
        return {
          url: `${NOTE_API_BASE_PATH}/${id}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2, { id }) => {
        return [{ type: 'NOTE', id, },];
      },
    }),
    addNote: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${NOTE_API_BASE_PATH}`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      async onQueryStarted(arg, api) {
        try {
          const { queryFulfilled } = api;
          const updatedInfo = await queryFulfilled;
          if (updatedInfo?.data) {
            api.dispatch(
              timelineApi.util.invalidateTags([{ type: 'TIMELINE', id: 'LIST' }])
            );
          }
        } catch (error) {
          //
        }
      },
    }),
    updateNote: builder.mutation<any, AxiosRequestConfig<any> & { id: number }>(
      {
        query: ({
          id,
          data,
          ...rest
        }: AxiosRequestConfig<any> & { id: number }) => {
          return {
            url: `${NOTE_API_BASE_PATH}/${id}`,
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
              api.dispatch(
                timelineApi.util.invalidateTags([{ type: 'TIMELINE', id: 'LIST' }])
              );
              api.dispatch(noteApi.util.resetApiState());
            }
          } catch (error) {
            //
          }
        },
      }
    ),
    deleteNote: builder.mutation<any, AxiosRequestConfig<any> & { id: number }>(
      {
        query: ({
          id,
          data,
          ...rest
        }: AxiosRequestConfig<any> & { id: number }) => {
          return {
            url: `${NOTE_API_BASE_PATH}/${id}`,
            method: 'DELETE',
            data,
            extraOptions: { ...rest },
          };
        },
        async onQueryStarted(arg, api) {
          try {
            const { queryFulfilled } = api;
            const updatedInfo = await queryFulfilled;
            if (updatedInfo?.data) {
              api.dispatch(
                timelineApi.util.invalidateTags([{ type: 'TIMELINE', id: 'LIST' }])
              );
              api.dispatch(noteApi.util.resetApiState());
            }
          } catch (error) {
            //
          }
        },

      }
    ),
  }),
  tagTypes: ['NOTE']
});

export const {
  useLazyGetNotesQuery,
  useLazyGetNoteByIdQuery,
  useAddNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = noteApi;
