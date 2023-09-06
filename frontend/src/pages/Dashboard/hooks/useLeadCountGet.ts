import { IS_CACHING_ACTIVE } from 'constant';
import { useLazyGetLeadCountQuery } from 'redux/api/leadApi';

export const useLeadCountGet = () => {
  const [getLeadsCountAPI, { isLoading: leadLoading }] =
    useLazyGetLeadCountQuery();

  interface PropsInterface {
    count: {
      activities: number;
      contacts: number;
      leads: number;
      deals: number;
      accounts: number;
    };
    initialDays: string;
  }

  const getLeadsCountData = async (props: PropsInterface) => {
    const { initialDays, count } = props;
    const { data, error } = await getLeadsCountAPI(
      {
        params: { 'q[created_at][gte]': initialDays, 'q[is_deal]': false },
      },
      IS_CACHING_ACTIVE
    );

    if (data && !error) {
      return data.count;
    }
    return count.leads;
  };
  return {
    getLeadsCountData,
    leadLoading,
  };
};
