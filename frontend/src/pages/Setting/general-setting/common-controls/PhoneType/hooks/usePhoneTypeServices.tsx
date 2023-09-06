import { AsyncSelectGetOptions } from 'components/FormField/types/formField.types';
import { MODULE_PERMISSION } from 'constant/permissions.constant';
import {
  EntityAttributesEnum,
} from 'redux/api/entityAttributesApi';
import { useLazyGetPhoneTypesQuery } from 'redux/api/phoneTypeApi';

export const useGetPhoneTypeOption = () => {
  const [getPhoneTypes, { isLoading: isGetPhoneTypeLoading }] =
    useLazyGetPhoneTypesQuery();

  const getPhoneTypeOption: AsyncSelectGetOptions = async (option) => {
    const { data, error } = await getPhoneTypes(
      {
        data: {
          query: {
            ...(option?.search && { searchText: option?.search }),
            ...MODULE_PERMISSION.CONTACT.read,
            'include[creator]': 'id,first_name,last_name,full_name',
            page: option?.page,
            sort: '-id',
            select: 'id,name,is_system,type',
            'q[type]': EntityAttributesEnum.PHONE_TYPE,
          },
        },
      },
      true
    );

    if (!error && data?.rows) {
      const options = data.rows.map((val: { name: string }) => ({
        label: val.name || '',
        value: val.name || '',
      }));
      return {
        option: options,
        count: data.count,
      };
    }
  };

  return {
    isGetPhoneTypeLoading,
    getPhoneTypeOption,
  };
};
