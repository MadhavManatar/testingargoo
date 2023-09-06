// ** Type **
import { AsyncSelectGetOptions } from 'components/FormField/types/formField.types';

// ** Redux **
import { EntityAttributesEnum } from 'redux/api/entityAttributesApi';
import { useLazyGetLeadDealSourceQuery } from 'redux/api/leadDealSourceApi';

// ** Constant **
import { MODULE_PERMISSION } from 'constant/permissions.constant';

export const useGetLeadDealSourceOptions = () => {
  const [getLeadDealSource, { isLoading: isLeadDealSourceLoading }] =
    useLazyGetLeadDealSourceQuery();

  const getLeadDealSourceOptions: AsyncSelectGetOptions = async (option) => {
    const { data, error } = await getLeadDealSource(
      {
        data: {
          query: {
            ...(option?.search && { searchText: option?.search }),
            ...MODULE_PERMISSION.LEAD.read,
            'include[creator]': 'id,first_name,last_name,full_name',
            page: option?.page,
            sort: '-id',
            select: 'id,name,is_system,type',
            'q[type]': EntityAttributesEnum.LEAD_DEAL_SOURCE,
          },
        },
      },
      true
    );

    if (!error && data?.rows) {
      const Options = data.rows.map((val: { name: string; id: number }) => ({
        label: val.name,
        value: val.id,
      }));

      return { option: Options, count: data.count };
    }
  };

  return { getLeadDealSourceOptions, isLeadDealSourceLoading };
};
