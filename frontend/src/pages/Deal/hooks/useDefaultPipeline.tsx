import { UseDefaultPipelinePropsType } from '../types/deals.types';

const useDefaultPipeline = (props: UseDefaultPipelinePropsType) => {
  const { getPipelineOptions, setDefaultInfo, getDealStageOptions } = props;

  const initialPipelineOption = async () => {
    const data = await getPipelineOptions();
    if (data?.option?.length) {
      const defaultPipeline = data?.option?.find((op) => op.selected);
      setDefaultInfo((prev) => ({ ...prev, pipeline_id: defaultPipeline }));
      const pipelineId = defaultPipeline?.value;
      if (pipelineId) {
        const stageData = await getDealStageOptions(+pipelineId);

        if (stageData) {
          setDefaultInfo((prev) => ({
            ...prev,
            deal_stage_id: stageData?.[0],
          }));
        }
      }
    }
  };
  return { initialPipelineOption };
};

export default useDefaultPipeline;
