// ** external packages **
import { UseFormReset } from 'react-hook-form';

// ** types **
import { AsyncSelectGetOptions } from 'components/FormField/types/formField.types';
import { TagFormValueType } from '../types/tag.type';

// ** services **
import { useLazyGetTagByIdQuery, useLazyGetTagsQuery } from 'redux/api/tagApi';

export const useGetTagsOptions = (assignedTagIds: number[] | undefined) => {
  const [getTags, { isLoading }] = useLazyGetTagsQuery();

  const getTagsOptions: AsyncSelectGetOptions = async (option) => {
    const { data, error } = await getTags(
      {
        data: {
          query: {
            searchText: option?.search,
            searchFields: 'name',
            sort: 'name',
            page: option?.page,
            'q[id][notIn]': `n|${assignedTagIds || []}`,
          },
        },
      },
      true
    );
    if (!error) {
      const tempOption = data?.rows?.map(
        (val: { name: string; id: number; color: string }) => ({
          label: `${val.name}`,
          value: val.id,
          color: val.color,
        })
      );

      return {
        option: tempOption,
        count: data.count,
      };
    }
  };

  return { getTagsOptions, isLoading };
};

export const useGetTagDetailById = ({
  reset,
}: {
  reset: UseFormReset<TagFormValueType>;
}) => {
  const [getTagById, { isLoading }] = useLazyGetTagByIdQuery();

  const getTagDetailById = async (id: number) => {
    const { data, error } = await getTagById({ id }, true);
    if (!error && data) {
      reset({ color: data.color, name: data.name });
    }
  };

  return { getTagDetailById, isLoading };
};
