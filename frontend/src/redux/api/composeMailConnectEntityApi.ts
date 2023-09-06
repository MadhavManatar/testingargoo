import { AxiosRequestConfig } from 'axios';
import baseQueryApi from './baseQueryApi';

const COMPOSE_MAIL_CONNECT_ENTITY = '/compose-mail-connect-entity';


export const noteApi = baseQueryApi.injectEndpoints({
    endpoints: (builder) => ({
        getComposeMailEntityDetailById: builder.query<any, AxiosRequestConfig<any> & { id: number }>({
            query: ({ id, data, ...rest }) => {
                return {
                    url: `${COMPOSE_MAIL_CONNECT_ENTITY}/${id}`,
                    method: 'GET',
                    data,
                    extraOptions: { ...rest },
                };
            },
            providesTags: () => {
                return [
                    {
                        type: 'COMPOSE_MAIL_CONNECT_ENTITY',
                        id: 'LIST',
                    },
                ];
            },
        }),
        connectEntityWithComposeMail: builder.mutation<any, AxiosRequestConfig<any>>({
            query: ({ data, ...rest }: AxiosRequestConfig<any>) => {
                return {
                    url: `${COMPOSE_MAIL_CONNECT_ENTITY}`,
                    method: 'POST',
                    data,
                    extraOptions: { ...rest },
                };
            },
            invalidatesTags: (_result, error) => {
                return error ? [] : [{ type: 'COMPOSE_MAIL_CONNECT_ENTITY', id: 'LIST' }];
            },
        }),
        removeEntityFromComposeMaiById: builder.mutation<any, AxiosRequestConfig<any>>(
            {
                query: ({
                    data,
                    ...rest
                }: AxiosRequestConfig<any> & { id: number }) => {
                    return {
                        url: `${COMPOSE_MAIL_CONNECT_ENTITY}`,
                        method: 'DELETE',
                        data,
                        extraOptions: { ...rest },
                    };
                },
                invalidatesTags: (_result, error) => {
                    return error ? [] : [{ type: 'COMPOSE_MAIL_CONNECT_ENTITY', id: 'LIST' }];
                },
            }
        ),
    }),
});

export const {
    useLazyGetComposeMailEntityDetailByIdQuery,
    useConnectEntityWithComposeMailMutation,
    useRemoveEntityFromComposeMaiByIdMutation,
} = noteApi;
