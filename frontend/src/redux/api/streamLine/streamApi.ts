import baseQueryApi from '../baseQueryApi';

export const getStreamApi: any = baseQueryApi.injectEndpoints({
  endpoints: (builder) => ({
    getStreams: builder.query<any, unknown>({
      query: (params: object) => {
        const newParams = {
          ...params,
          'q[timeline_date][lte]': new Date().toString(),
        };

        return {
          url: `/timeline/stream-timeline`,
          method: 'GET',
          params: newParams,
        };
      },
      providesTags: ['STREAM'],
      transformResponse: (data) => {
        return data;
      },
    }),
  }),
});

export const { useLazyGetStreamsQuery } = getStreamApi;
