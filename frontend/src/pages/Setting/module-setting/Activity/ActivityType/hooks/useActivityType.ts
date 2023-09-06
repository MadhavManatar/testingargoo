import { useEffect, useState } from 'react';
import { AsyncSelectGetOptions } from 'components/FormField/types/formField.types';
import { activityTypeResponse } from 'pages/Activity/types/activity.types';
import _ from 'lodash';
import { useLazyGetActivityTypesQuery } from 'redux/api/activityTypeApi';
import { POLLING_INTERVAL } from 'constant/dataLimit.constant';
import { useLocation } from 'react-router-dom';

export const useGetDefaultActivityType = () => {

  // ** APIS **
  const [getActivityTypes, { isLoading: isGetDefaultActivityTypLoading }] =
    useLazyGetActivityTypesQuery();

  const getDefaultActivityType: AsyncSelectGetOptions = async (option) => {
    const { data, error } = await getActivityTypes(
      {
        data: {
          query: {
            limit: 100,
            page: option?.page,
            searchText: option?.search,
            'q[is_system]': true,
          },
        },
      },
      true
    );

    if (data?.rows && !error) {
      const tempOption = data.rows.map((val: { name: string; id: number }) => ({
        label: val.name || '',
        value: val.id || '',
      }));

      return {
        option: tempOption,
        count: data.count,
      };
    }
  };
  return { getDefaultActivityType, isGetDefaultActivityTypLoading };
};

// ** hook for activity Types ** //
export const useGetActivityTypes = ({
  sort,
  fromTimelineFiler,
}: {
  sort?: string;
  fromTimelineFiler?: boolean;
}) => {
  const { pathname } = useLocation();
  const [activityTypeData, setActivityTypeData] = useState<
    activityTypeResponse[]
  >([]);
  const [actualActivityTypeIds, setActualActivityTypeIds] = useState<number[]>(
    []
  );

  // ** APIS **
  const [getActivityTypesAPI, { isLoading: isActivityTypeLoading, currentData }] =
    useLazyGetActivityTypesQuery({
      pollingInterval: pathname === "/" ? POLLING_INTERVAL : 0,
    });
  useEffect(() => {
    if (_.isArray(currentData?.rows)) {
      const activityParentType: activityTypeResponse[] = [];
      const searchedTypes: number[] = [];

      const tempData = currentData?.rows?.map(
        (val: {
          parent_type_id: number | null;
          icon_type: string;
          icon: string;
          id: number;
          name: string;
          is_default: boolean;
          parent_type: activityTypeResponse;
        }) => {
          searchedTypes.push(val.id);
          // ** begin: for get parent activity type from sub activity ** //
          if (fromTimelineFiler && val?.parent_type?.id) {
            activityParentType.push(val?.parent_type);
          }
          // ** end: for get parent activity type from sub activity ** //
          return {
            icon_type: val.icon_type,
            icon: val.icon,
            id: val.id,
            name: val.name,
            parent_type_id: val?.parent_type_id,
            is_default: val?.is_default,
          };
        }
      );

      const updatedTypes = _.uniqBy(
        [...tempData, ...activityParentType],
        (e) => {
          return e.id;
        }
      );
      setActualActivityTypeIds(searchedTypes);
      setActivityTypeData(updatedTypes);
    }  }, [currentData])
  
  const getActivityTypes = async (args?: { searchText?: string }) => {
    const { data } = await getActivityTypesAPI(
      {
        data: {
          query: {
            page: 1,
            limit: 100,
            ...(sort && { sort }),
            ...(args?.searchText && {
              searchText: args?.searchText,
              searchFields: 'name',
              'include[parent_type][select]:':
                'icon_type,icon,id,name,is_default,parent_type_id',
            }),
          },
        },
      },
      true
    );
    if (_.isArray(data?.rows)) {
      const activityParentType: activityTypeResponse[] = [];
      const searchedTypes: number[] = [];

      const tempData = data?.rows?.map(
        (val: {
          parent_type_id: number | null;
          icon_type: string;
          icon: string;
          id: number;
          name: string;
          is_default: boolean;
          parent_type: activityTypeResponse;
        }) => {
          searchedTypes.push(val.id);
          // ** begin: for get parent activity type from sub activity ** //
          if (fromTimelineFiler && args?.searchText && val?.parent_type?.id) {
            activityParentType.push(val?.parent_type);
          }
          // ** end: for get parent activity type from sub activity ** //
          return {
            icon_type: val.icon_type,
            icon: val.icon,
            id: val.id,
            name: val.name,
            parent_type_id: val?.parent_type_id,
            is_default: val?.is_default,
          };
        }
      );

      const updatedTypes = _.uniqBy(
        [...tempData, ...activityParentType],
        (e) => {
          return e.id;
        }
      );
      setActualActivityTypeIds(searchedTypes);
      setActivityTypeData(updatedTypes);
    }
  };
  useEffect(() => {
    getActivityTypes();
  }, []);

  return {
    activityTypeData,
    getActivityTypes,
    isActivityTypeLoading,
    actualActivityTypeIds,
  };
};
