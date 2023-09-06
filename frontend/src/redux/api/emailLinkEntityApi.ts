import { AxiosRequestConfig } from 'axios';
import baseQueryApi from './baseQueryApi';

const EMAIL_LINK_ENTITY_API_BASE_PATH = '/mail/link-entity';

export const entityAttributesApi = baseQueryApi.injectEndpoints({
    endpoints: (builder) => ({
        emailLinkEntity: builder.mutation<
            any,
            AxiosRequestConfig<any> & { id: number }
        >({
            query: ({ id, data, ...rest }) => {
                return {
                    url: `${EMAIL_LINK_ENTITY_API_BASE_PATH}/${id}`,
                    method: 'POST',
                    data,
                    extraOptions: { ...rest },
                };
            },
            invalidatesTags: (_arg1, _arg2, { id }) => {
                return [
                    {
                        type: 'EMAIL_LINK_ENTITY',
                        id,
                    },
                ];
            },
        }),
    }),
});

export const { useEmailLinkEntityMutation } = entityAttributesApi;
