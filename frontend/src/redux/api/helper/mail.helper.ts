import { PaginationParams } from 'components/TableInfiniteScroll';
import { GetMailPayload } from '../types/mail.model';

export const getMailsApiParams = (payload: GetMailPayload) => {
  const { providerOption, searchData } = payload;
  const paginationParams: PaginationParams = {
    page: payload.page,
    limit: payload.limit,
  };
  const user_mail = (payload.provider.value as string).split(',')[0];
  const token_provider = (payload.provider.value as string).split(',')[1];
  const params = {
    ...paginationParams,
    ...(providerOption?.length && {
      'q[email][in]': [...providerOption].map(
        (obj) => typeof obj.value === 'string' && obj.value.split(',')[0]
      ),
      'q[provider][in]': [...providerOption].map(
        (obj) => typeof obj.value === 'string' && obj.value.split(',')[1]
      ),
    }),
    ...(providerOption && {
      'q[email][in]':
        user_mail === 'all'
          ? [...providerOption]
              .splice(1)
              .map((obj) => obj.value.toString().split(',')?.[0])
          : user_mail,
      'q[provider][in]':
        token_provider === 'all'
          ? [...providerOption]
              .splice(1)
              .map((obj) => obj.value.toString().split(',')?.[1])
          : token_provider,
    }),
    label: JSON.stringify(payload.label),
    searchFields: searchData?.searchFields ?? '',
    searchText: searchData?.searchText ?? '',
    sort: '-updated_at',
  };
  return params;
};
