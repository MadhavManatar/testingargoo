import { useState } from 'react';

// ** Types **
import { Option } from 'components/FormField/types/formField.types';
import { useLazyGetActivityTypesQuery } from 'redux/api/activityTypeApi';

type Props = {
  limit?: number;
};

export const useGetActivityTypesOptions = (props: Props) => {
  const { limit } = props;

  const [options, setOptions] = useState<Option[]>([]);

  // ** APIS **
  const [getActivityTypes, { isLoading: isActivityTypeLoading }] =
    useLazyGetActivityTypesQuery();

  const getActivityTypesOptions = async () => {
    const { data } = await getActivityTypes(
      {
        data: {
          query: {
            page: 1,
            limit: limit || 100,
            select: 'id,name',
          },
        },
      },
      true
    );

    if (data?.rows?.length) {
      const tempOption = data?.rows?.map(
        (val: { name?: string; id: number }) => ({
          label: `${val.name}`,
          value: val.id,
        })
      );
      setOptions(tempOption);
      return { option: tempOption, count: data.count };
    }
  };

  return { getActivityTypesOptions, options, isActivityTypeLoading };
};
