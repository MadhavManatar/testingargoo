import { NOTIFICATION_API_BASE_PATH } from 'pages/Dashboard/components/Notification/services/notification.services';
import baseQueryApi from '../baseQueryApi';

export const getNotificationsApi = baseQueryApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotificationsAPI: builder.query<any, unknown>({
      query: (params: object) => {
        return {
          url: `${NOTIFICATION_API_BASE_PATH}/get-data`,
          method: 'GET',
          params,
        };
      },
      providesTags: ['NOTIFICATION'],
      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        if ((queryArgs as { page: string })?.page) {
          return { queryArgs };
        }
        return endpointName;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
  }),
});

export const { useLazyGetNotificationsAPIQuery } = getNotificationsApi;
