import { useState } from 'react';
import {
  AsyncSelectGetOptions,
  Option,
} from 'components/FormField/types/formField.types';
import { PaginationParams } from 'components/TableInfiniteScroll';

import { useLazyGetActivityTypesQuery } from 'redux/api/activityTypeApi';
import { useLazyGetActivityResultsQuery } from 'redux/api/activityResultApi';
import { OPTION_LISTING_DATA_LIMIT } from 'constant/dataLimit.constant';

export const useGetActivityTypesOptions = () => {
  // ** APIS **
  const [getActivityTypes, { isLoading: isActivityTypeLoading }] =
    useLazyGetActivityTypesQuery();

  const getActivityTypeOptions: AsyncSelectGetOptions = async (
    params: PaginationParams = { page: 1 }
  ) => {
    const { data, error } = await getActivityTypes(
      {
        data: {
          query: { ...params },
        },
      },
      true
    );

    if (!error && data.rows) {
      const pipelineOption = data.rows.map(
        (val: { name?: string; id: number }, index: number) => ({
          label: `${val.name}`,
          value: val.id,
          ...(index === 0 && { selected: true }),
        })
      );
      return {
        option: pipelineOption,
        count: data.count,
      };
    }
  };

  return { getActivityTypeOptions, isActivityTypeLoading };
};

export const useGetActivityResultOptions = ({
  activityTypeId,
  isOtherOptionDisabled = false,
}: {
  activityTypeId?: number;
  isOtherOptionDisabled?: boolean;
}) => {
  const [getActivityResult, { isLoading: isActivityResultsLoading }] =
    useLazyGetActivityResultsQuery();

  const [activityResult, setActivityResult] = useState<
    {
      result?: string;
      isMemo: boolean;
      id: number;
    }[]
  >();

  const getActivityResultOptions: AsyncSelectGetOptions = async (option) => {
    const { data, error } = await getActivityResult(
      {
        data: {
          query: {
            'include[creator][select]': 'username,first_name,last_name',
            ...(activityTypeId && {
              'q[or][0][types_results.activity_type_id]': `n|${activityTypeId}`,
            }),
            'q[or][1][is_universal][eq]': 'true',
            'include[types_results][select]': 'id',
            select:
              'id,organization_id,result,isMemo,created_by,updated_by,created_at,updated_at,deleted_at',
            limit: OPTION_LISTING_DATA_LIMIT,
            subQuery: false,
            searchText: option?.search,
            page: option?.page,
          },
        },
      },
      true
    );
    if (!error && data.rows) {
      const Options: Option[] = [];
      const activityResultData = data.rows.map(
        (val: { result?: string; isMemo: boolean; id: number }) => {
          Options.push({
            label: `${val.result}`,
            value: `${val.id}`,
          });
          return {
            result: `${val.result}`,
            isMemo: val.isMemo,
            id: val.id,
          };
        }
      );

      setActivityResult(activityResultData);
      if (!isOtherOptionDisabled) {
        Options.push({ label: 'other', value: 'other' });
      }
      return {
        option: Options,
        count: data.count,
      };
    }
  };
  return {
    getActivityResultOptions,
    isActivityResultsLoading,
    activityResult,
  };
};
