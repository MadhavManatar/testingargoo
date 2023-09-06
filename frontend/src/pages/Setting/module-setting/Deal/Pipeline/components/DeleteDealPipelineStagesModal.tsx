// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

// ** Components **
import Button from 'components/Button';
import FormField from 'components/FormField';
import Modal from 'components/Modal';

// ** Hook **
import { useGetPipelineOptions } from '../hooks/usePipelineService';

// ** Services **

// ** Schema **
import { dealPipelineStagesForDeleteSchema } from '../validation-schema/dealPipeline.schema';

// ** Types **
import {
  DeleteDealPipelineStagesModalPropsType,
  pipelineStagesDelete,
} from '../types/deal-pipeline.types';
import { useLazyGetPipelineByIdQuery } from 'redux/api/pipelineApi';
import { useLazyGetAllDealStateQuery } from 'redux/api/dealStageHistoryApi';

const DeleteDealPipelineStagesModal = ({
  isOpen,
  isLoading,
  closeModal,
  deletePipelineStage,
  id,
  selectedStage,
}: DeleteDealPipelineStagesModalPropsType) => {
  // ** Hooks **
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue,
  } = useForm<pipelineStagesDelete>({
    resolver: yupResolver(dealPipelineStagesForDeleteSchema),
  });
  const watchPipeline = watch('pipeline_id');

  // ** States **
  const [allStagesCount, setAllStagesCount] = useState<number>(0);
  const [formInitialize, setFormInitialize] = useState(false);
  const [dealStageArray, setDealStageArray] = useState<
    { label: string; value: number; id: number }[]
  >([]);

  // ** APIS **
  const [getDealPipelineById] = useLazyGetPipelineByIdQuery();

  // ** Custom hook **
  const [ getAllDealStageAPI ] = useLazyGetAllDealStateQuery();
  const { getPipelineOptions, isPipelineLoading } = useGetPipelineOptions();

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedStage) {
      setValue('stage_id', selectedStage.stageId);
    }
    getAllStageHistory();
  }, []);

  useEffect(() => {
    if (watchPipeline) {
      setFormInitialize(true);
      if (formInitialize) {
        setValue('deal_stage_id', undefined);
      }
      getDealStageOptions();
    }
  }, [watchPipeline]);

  const getAllStageHistory = async () => {
    const { data, error } = await getAllDealStageAPI({
      params: {
        'q[isCurrentActive]': true,
        'q[stage_id]': selectedStage.stageId,
      },
    },true);

    if (data && !error) {
      setAllStagesCount(data.count);
    }
  };

  const getDealStageOptions = async () => {
    if (watchPipeline) {
      const { data, error } = await getDealPipelineById(
        { id: watchPipeline },
        true
      );
      if (!error && data) {
        const arr: { label: string; value: number; id: number }[] = [];
        data?.stages.map(
          (item: { name: string; id: number; stage_type: string }) => {
            arr.push({ label: item.name, value: item.id, id: item.id });
            return arr;
          }
        );
        setDealStageArray(arr);
      }
    }
  };

  const onSubmit = handleSubmit(async (value) => {
    const bodyObj = {
      currentStageId: selectedStage.stageId,
      newPipelineId: value.pipeline_id,
      newStageId: value.deal_stage_id,
    };

    deletePipelineStage(bodyObj);
  });

  return isOpen ? (
    <Modal
      visible
      width="800px"
      onClose={closeModal}
      submitButtonText="Delete"
      title="Delete Pipeline Stage"
      submitButtonClass="bg-ip__Red hover:bg-ip__Red__hoverDark"
      modalWrapperClass="small__without__HT__modal delete__user__modal"
    >
      <div className="confirmation__image__wrapper">
        <img src="/images/deleteAnimatedIcon.gif" alt="" />
      </div>
      <h5 className="confirmation__title !w-full">
        {allStagesCount ? (
          <>
            Please select a different pipeline and stage to transfer all the
            deals from the current stage before deleting this{' '}
            <span className="text-ip__Red">{selectedStage.stage_name}</span>{' '}
            stage.
          </>
        ) : (
          <>
            Are you sure you want to delete this{' '}
            <span className="text-ip__Red">{selectedStage.stage_name}</span>{' '}
            stage ?
          </>
        )}
      </h5>

      <form onSubmit={onSubmit}>
        <div className="user__items__wrapper flex flex-wrap items-end">
          {allStagesCount ? (
            <div className="w-full flex justify-center mt-[20px]">
              <div className="px-[10px] w-1/2 sm:w-full">
                <FormField<pipelineStagesDelete>
                  required
                  label="Pipeline"
                  id="pipeline_id"
                  serveSideSearch
                  control={control}
                  type="asyncSelect"
                  name="pipeline_id"
                  menuPlacement="bottom"
                  menuPosition="absolute"
                  error={errors?.pipeline_id}
                  labelClass="if__label__blue"
                  isLoading={isPipelineLoading}
                  placeholder="Select Pipeline"
                  getOptions={() =>
                    getPipelineOptions({
                      ...(id && { 'q[id][notIn]': `n|${[id]}` }),
                    })
                  }
                />
              </div>

              <div className="px-[10px] w-1/2 sm:w-full">
                <FormField<pipelineStagesDelete>
                  required
                  type="select"
                  label="Stage"
                  control={control}
                  id="deal_stage_id"
                  name="deal_stage_id"
                  menuPlacement="bottom"
                  menuPosition="absolute"
                  options={dealStageArray}
                  placeholder="Select Stage"
                  labelClass="if__label__blue"
                  error={errors.deal_stage_id}
                />
              </div>
            </div>
          ) : null}
        </div>
      </form>
      <div className="w-full flex justify-center mb-[15px] mt-[15px]">
        <Button
          className="secondary__Btn smaller min-w-[170px] mr-[12px]"
          onClick={closeModal}
        >
          Cancel
        </Button>
        <Button
          className="bg-ip__Red hover:bg-ip__Red__hoverDark smaller min-w-[100px]"
          onClick={(value) => {
            if (allStagesCount) {
              onSubmit(value);
            } else {
              const bodyObj = { currentStageId: selectedStage.stageId };
              deletePipelineStage(bodyObj);
            }
          }}
          isLoading={isLoading}
        >
          {allStagesCount ? 'Transfer & Delete' : 'Delete'}
        </Button>
      </div>
    </Modal>
  ) : (
    <></>
  );
};

export default DeleteDealPipelineStagesModal;
