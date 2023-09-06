import { AxiosRequestConfig } from 'axios';
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from 'axios/axios';

const PIPELINE_API_BASE_PATH = '/pipelines';

export const pipelineApi = createApi({
  reducerPath: 'pipelineApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getPipelines: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${PIPELINE_API_BASE_PATH}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: () => {
        return [
          {
            type: 'PIPELINE',
          },
        ];
      },
    }),
    getPipelineById: builder.query<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({ id, data, ...rest }) => {
        return {
          url: `${PIPELINE_API_BASE_PATH}/${id}?include[stages][q][is_deleted]=false&include[_count]=true`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (_arg1, _arg2, { id }) => {
        return [
          {
            type: 'PIPELINE',
            id,
          },
        ];
      },
    }),
    addPipeline: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${PIPELINE_API_BASE_PATH}`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      async onQueryStarted(arg, api) {
        try {
          const { queryFulfilled } = api;
          const updatedInfo = await queryFulfilled;
          if (updatedInfo?.data?.id) {
            api.dispatch(pipelineApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    updatePipeline: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${PIPELINE_API_BASE_PATH}/${id}`,
          method: 'PUT',
          data,
          extraOptions: { ...rest },
        };
      },
      async onQueryStarted(arg, api) {
        try {
          const { queryFulfilled } = api;
          const updatedInfo = await queryFulfilled;
          if (updatedInfo?.data[1][0].id) {
            api.dispatch(pipelineApi.util.resetApiState());
          }
        } catch (error) {
          // 
        }
      },
    }),
    deletePipeline: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: PIPELINE_API_BASE_PATH,
          method: 'DELETE',
          data,
          extraOptions: { ...rest },
        };
      },
      async onQueryStarted(arg, api) {
        try {
          const { queryFulfilled } = api;
          const updatedInfo = await queryFulfilled;
          if (updatedInfo?.data?.allId) {
            api.dispatch(pipelineApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
    deletePipelineStageById: builder.mutation<
      any,
      AxiosRequestConfig<any> & { id: number }
    >({
      query: ({
        id,
        data,
        ...rest
      }: AxiosRequestConfig<any> & { id: number }) => {
        return {
          url: `${PIPELINE_API_BASE_PATH}/deleteStage/${id}`,
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
            api.dispatch(pipelineApi.util.resetApiState());
          }
        } catch (error) {
          //
        }
      },
    }),
  }),
  tagTypes: ['PIPELINE'],
});

export const {
  useLazyGetPipelinesQuery,
  useLazyGetPipelineByIdQuery,
  useAddPipelineMutation,
  useUpdatePipelineMutation,
  useDeletePipelineMutation,
  useDeletePipelineStageByIdMutation,
} = pipelineApi;
