import { AsyncSelectGetOptions } from 'components/FormField/types/formField.types';
import { useLazyGetLeadDealAccContSearchQuery } from 'redux/api/searchApi';

export const useGetLeadDealAccContactOptions = () => {
  // ** APIS **
  const [getLeadDealAccContSearchAPI, { isLoading: loadingSearchOption }] =
    useLazyGetLeadDealAccContSearchQuery();

  const getLeadDealAccContactOptions: AsyncSelectGetOptions = async (
    option
  ) => {
    const { data, error } = await getLeadDealAccContSearchAPI({
      params: {
        limit: 10,
        searchText: option?.search,
        page: option?.page,
        'q[is_deleted]': false,
      },
    });

    if (!error && data.rows) {
      const Options = data.rows.map(
        (val: {
          name?: string;
          id: number;
          model_name: string;
          is_deal: boolean;
        }) => ({
          label: `${val.name}`,
          value: val.is_deal
            ? `deals-${val.id}`
            : `${val.model_name}-${val.id}`,
          extraLabel: val?.is_deal ? 'deals' : val.model_name,
        })
      );

      return {
        option: Options,
        count: data.total,
      };
    }
  };

  return {
    loadingSearchOption,
    getLeadDealAccContactOptions,
  };
};
