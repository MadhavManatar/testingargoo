import { Dispatch, SetStateAction } from 'react';
import { useLazyGetActiveDealStageQuery } from 'redux/api/dealStageHistoryApi';

export const useGetActiveDealStage = ({
  setActiveDealStage,
}: {
  setActiveDealStage: Dispatch<SetStateAction<string>>;
}) => {
  // ** custom hooks **
  const [getActiveDealStageAPI, { isLoading: activeStageLoading }] =
    useLazyGetActiveDealStageQuery();

  const getActiveDealStageData = async (dealId: number) => {
    const dealStageRes = await getActiveDealStageAPI({
      id: dealId || 0,
      params: { 'include[stage][select]': 'id,name' },
    });

    setActiveDealStage(dealStageRes?.data?.stage?.name);
  };

  return {
    activeStageLoading,
    getActiveDealStageData,
  };
};
