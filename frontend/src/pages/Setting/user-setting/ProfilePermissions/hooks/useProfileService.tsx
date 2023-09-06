import { AsyncSelectGetOptions } from 'components/FormField/types/formField.types';
import { useLazyUseGetProfilesQuery } from 'redux/api/profileApi';

export const useGetProfileOptions = () => {
  const [getProfilesAPI, { isLoading: isProfilesLoading }] = useLazyUseGetProfilesQuery();
  const getProfileOptions: AsyncSelectGetOptions = async (option) => {
    const data = await getProfilesAPI(
      {
        params: {
          limit: 100,
          searchText: option?.search,
          page: option?.page,
        }
      },
      true
    );

    if (!("error" in data)) {
      const { rows } = data.data;
      const tempOption = rows.map((val: { name: string; id: number }) => ({
        label: `${val.name}`,
        value: `${val.id}`,
      }));

      return {
        option: tempOption,
        count: rows.count,
      };
    }
  };
  return {
    getProfileOptions,
    isProfilesLoading,
  };
};
