import { useEffect, useState } from 'react';
import _ from "lodash"
import { scheduleActivityResponse } from '../types/stay-in-touch.type';
import { useLazyGetScheduleActivityByIdQuery } from 'redux/api/stayInTouchApi';

export const useGetScheduleActivity = () => {
  const [scheduleActivityData, setScheduleActivityData] =
    useState<scheduleActivityResponse>({
      frequency: '',
      start_date: '',
      interval: 1,
    });

  // ** APIS **
  const [
    scheduleActivityByIdAPI,
    { isLoading: isScheduleActivityLoading, currentData },
  ] = useLazyGetScheduleActivityByIdQuery();

  useEffect(() => {
    if (!isScheduleActivityLoading) {
      const tempCurrentData = _.cloneDeep(currentData)
      if (tempCurrentData) {
        const updatedActivity = (tempCurrentData?.Activity || []).sort(
          (
            a: {
              start_date: string;
            },
            b: {
              start_date: string;
            }
          ) => {
            return (
              new Date(b.start_date).getTime() -
              new Date(a.start_date).getTime()
            );
          }
        );
        setScheduleActivityData({
          ...tempCurrentData,
          Activity: updatedActivity,
        });
      } else {
        setScheduleActivityData({
          frequency: '',
          start_date: '',
          interval: 1,
        });
      }
    }
  }, [currentData, isScheduleActivityLoading]);

  const getScheduleActivity = async (id: number) => {
    await scheduleActivityByIdAPI({ id }, true);
  };

  return {
    scheduleActivityData,
    getScheduleActivity,
    isScheduleActivityLoading,
  };
};
