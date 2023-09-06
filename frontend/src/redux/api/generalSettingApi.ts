// ** Import Packages **
import { AxiosRequestConfig } from 'axios';

// ** Types **
import { GENERAL_SETTING_KEY } from './types/generalSettingApit.types';

// ** API **
import baseQueryApi from './baseQueryApi';

const GENERAL_SETTING_API_BASE_PATH = '/general-settings';

export const generalSettingApi = baseQueryApi.injectEndpoints({
  endpoints: (builder) => ({
    getGeneralSetting: builder.query<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }) => {
        return {
          url: `${GENERAL_SETTING_API_BASE_PATH}`,
          method: 'GET',
          data,
          extraOptions: { ...rest },
        };
      },
      providesTags: (data: { key: GENERAL_SETTING_KEY }[], _arg2, QueryArg) => {
        return data?.length
          ? data.map((obj) => ({ type: 'GENERAL_SETTING', id: obj.key }))
          : [{ type: 'GENERAL_SETTING', id: QueryArg.params['q[key]'] }];
      },
    }),
    addUpdateGeneralSetting: builder.mutation<any, AxiosRequestConfig<any>>({
      query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
        return {
          url: `${GENERAL_SETTING_API_BASE_PATH}`,
          method: 'POST',
          data,
          extraOptions: { ...rest },
        };
      },
      invalidatesTags: (_arg1, _arg2, QueryArg) => {
        const args = QueryArg as { data: { dataList: { key: string }[] } };
        return args.data.dataList.map((obj) => ({
          type: 'GENERAL_SETTING',
          id: obj.key,
        }));
      },
    }),
  }),
});

export const {
  useLazyGetGeneralSettingQuery,
  useAddUpdateGeneralSettingMutation,
} = generalSettingApi;
