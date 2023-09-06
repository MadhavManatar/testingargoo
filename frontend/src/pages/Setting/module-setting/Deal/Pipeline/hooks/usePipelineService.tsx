import { AsyncSelectGetOptions } from 'components/FormField/types/formField.types';
import { PaginationParams } from 'components/TableInfiniteScroll';
import { useLazyGetPipelinesQuery } from 'redux/api/pipelineApi';

export const useGetPipelineOptions = () => {
  // ** APIS **
  const [getPipeline, { isLoading: isPipelineLoading }] =
    useLazyGetPipelinesQuery();

  const getPipelineOptions: AsyncSelectGetOptions = async (
    params: PaginationParams = { page: 1 }
  ) => {
    const { data, error } = await getPipeline(
      {
        params: { ...params },
      },
      true
    );

    if (!error && data.rows) {
      const pipelineOption = data.rows.map(
        (val: { name?: string; id: number; is_default: boolean }) => ({
          label: `${val.name}`,
          value: val.id,
          selected: val.is_default,
        })
      );
      return {
        option: pipelineOption,
        count: data.count,
      };
    }
  };

  return { getPipelineOptions, isPipelineLoading };
};
