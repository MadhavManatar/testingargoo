import { AxiosRequestConfig } from 'axios';
import baseQueryApi from './baseQueryApi';


const CHECK_FIELD_IS_UNIQUE = '/check-field-is-unique';

export const generalServiceApi = baseQueryApi.injectEndpoints({
    endpoints: (builder) => ({
        fieldIsExists: builder.query<any, AxiosRequestConfig<any>>({
            query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
                return {
                    url: `${CHECK_FIELD_IS_UNIQUE}`,
                    method: 'POST',
                    data,
                    extraOptions: { ...rest },
                };
            },
            providesTags: (_result, error) => {
                return error ? [] : [{ type: 'FIELD_IS_EXIST' }];
            },
        }),
    }),
});

export const { useLazyFieldIsExistsQuery } = generalServiceApi;
