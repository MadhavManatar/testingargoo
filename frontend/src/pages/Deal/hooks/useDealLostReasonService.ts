// ** external packages **
import { AsyncSelectGetOptions } from 'components/FormField/types/formField.types';
import { MODULE_PERMISSION } from 'constant/permissions.constant';
import { useLazyGetDealLostReasonsQuery } from 'redux/api/dealLostReasonApi';

// ** axios hooks **
import { EntityAttributesEnum } from 'redux/api/entityAttributesApi';

export const useGetReasonsOptions = () => {
  // ** API **
  const [getDealLostReasonsApi, { isLoading: isReasonsLoading }] =
    useLazyGetDealLostReasonsQuery();

  const getReasonsOptions: AsyncSelectGetOptions = async () => {
    const { data, error } = await getDealLostReasonsApi(
      {
        data: {
          query: {
            ...MODULE_PERMISSION.DEAL.read,
            'q[type]': EntityAttributesEnum.DEAL_LOST_REASON,
          },
        },
      },
      true
    );

    if (!error && data.rows) {
      const tempOption: [{ label: string; value: string }] = data.rows.map(
        (val: { name?: string }) => ({
          label: `${val.name}`,
          value: `${val.name}`,
        })
      );
      tempOption.push({
        label: 'other',
        value: 'other',
      });
      return {
        option: tempOption,
        count: data.count,
      };
    }
  };

  return { getReasonsOptions, isReasonsLoading };
};
