import { useEffect, useState } from 'react';
import {
  useLazyGetActiveDealStageQuery,
  useLazyGetDealAgeByDealIdQuery,
} from 'redux/api/dealStageHistoryApi';

interface UseDealStagesInterface {
  dealId: number | null;
}

export const useDealStages = (props: UseDealStagesInterface) => {
  const { dealId } = props;

  const [lostStageId, setLostStageId] = useState<number[]>([]);

  const [dealStageArray, setDealStageArray] = useState<
    { label: string; value: string; id: number; age: string }[]
  >([]);
  const [currentActiveStage, setCurrentActiveStage] = useState<{
    value: string;
    id: number;
    age: string;
  }>();

  const [
    getDealAgeByDealIdAPI,
    { isLoading: dealAgeByDealIdLoading, currentData: dealAgeData },
  ] = useLazyGetDealAgeByDealIdQuery();

  const [
    getActiveDealStageAPI,
    { isLoading: activeDealStageLoading, data: activeStage },
  ] = useLazyGetActiveDealStageQuery();

  useEffect(() => {
    if (dealAgeData) {
      const arr: { label: string; value: string; id: number; age: string }[] =
        [];
      dealAgeData?.map(
        (item: { name: string; id: number; stage_age: string }) => {
          arr.push({
            label: item.name,
            value: item.name,
            id: item.id,
            age: item.stage_age,
          });
          return arr;
        }
      );
      const lastStageIdArr: number[] = [];
      dealAgeData?.map((item: { stage_type: string; id: number }) => {
        if (item?.stage_type && item?.stage_type === 'Lost') {
          lastStageIdArr.push(item.id);
        }
        setLostStageId(lastStageIdArr);
        return lastStageIdArr;
      });
      getCurrentActiveStage();
      setDealStageArray(arr);
    }
  }, [dealAgeData]);

  useEffect(() => {
    if (dealStageArray.length && activeStage) {
      const stage = {
        value: activeStage?.stage?.name,
        id: activeStage?.stage?.id,
        age:
          dealStageArray.find((val) => val.id === activeStage?.stage?.id)
            ?.age || '',
      };
      setCurrentActiveStage(stage);
    }
  }, [activeStage]);

  const getDealStagesWithAge = async () => {
    if (dealId) {
      const { data, error } = await getDealAgeByDealIdAPI({ id: dealId || 0 });
      if (!error && data) {
        const arr: { label: string; value: string; id: number; age: string }[] =
          [];
        data?.map((item: { name: string; id: number; stage_age: string }) => {
          arr.push({
            label: item.name,
            value: item.name,
            id: item.id,
            age: item.stage_age,
          });
          return arr;
        });
        const lastStageIdArr: number[] = [];
        data?.map((item: { stage_type: string; id: number }) => {
          if (item?.stage_type && item?.stage_type === 'Lost') {
            lastStageIdArr.push(item.id);
          }
          setLostStageId(lastStageIdArr);
          return lastStageIdArr;
        });
        getCurrentActiveStage();
        setDealStageArray(arr);
      }
    }
  };

  const getCurrentActiveStage = () => {
    if (dealId) {
      getActiveDealStageAPI({ id: dealId || 0 });
    }
  };

  return {
    getDealStagesWithAge,
    setCurrentActiveStage,
    currentActiveStage,
    dealStageArray,
    lostStageId,
    dealStageLoading: activeDealStageLoading || dealAgeByDealIdLoading,
  };
};
