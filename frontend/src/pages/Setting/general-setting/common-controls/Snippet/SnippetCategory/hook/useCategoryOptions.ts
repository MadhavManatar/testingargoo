// ** Service **
import { useLazyGetSnippetCategoryQuery } from 'redux/api/snippetCategoryApi';

// ** Types **
import { AsyncSelectGetOptions } from 'components/FormField/types/formField.types';
import { OPTION_LISTING_DATA_LIMIT } from 'constant/dataLimit.constant';

export const useGetCategoryOptions = () => {
  const [getSnippetCategoriesAPI, { isLoading }] =
    useLazyGetSnippetCategoryQuery();

  const getSnippetCategoriesOptions: AsyncSelectGetOptions = async (option) => {
    const { data, error } = await getSnippetCategoriesAPI(
      {
        data: {
          data: {
            limit: OPTION_LISTING_DATA_LIMIT,
            searchText: option?.search,
            searchFields: 'name',
            sort: 'name',
            page: option?.page,
          },
        },
      },
      true
    );
    if (!error) {
      const tempOption = data?.rows?.map(
        (val: { name: string; id: number }) => ({
          label: val.name,
          value: val.id,
        })
      );

      return { option: tempOption, count: data.count, extraInfo: data.rows };
    }
  };

  return { getSnippetCategoriesOptions, isLoading };
};
