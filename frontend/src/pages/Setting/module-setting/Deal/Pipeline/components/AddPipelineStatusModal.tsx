// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

// ** Components **
import Modal from 'components/Modal';
import DiscardConfirmationModal from 'components/Modal/DiscardConfirmationModal';
import PipelineFormSkeleton from '../skeletons/PipelineFormSkeleton';
import DealPipelineForm from './DealPipelineForm';

// ** Types **
import {
  addFormValType,
  AddPipelineStatusModalPropsType,
  DealPipelineFieldType,
  dealPipelineStagesResponseType,
  newStageType,
  oldStageType,
  updateFormValType,
} from '../types/deal-pipeline.types';

// ** Schema **
import { dealPipelineSchema } from '../validation-schema/dealPipeline.schema';
import {
  useAddPipelineMutation,
  useLazyGetPipelineByIdQuery,
  useUpdatePipelineMutation,
} from 'redux/api/pipelineApi';

const AddPipelineStatusModal = (props: AddPipelineStatusModalPropsType) => {
  const { closeModal, isOpen, id, onAdd, setDealPipelineInfo } = props;

  // ** Hooks **
  const {
    register,
    formState: { errors, dirtyFields, isDirty },
    handleSubmit,
    reset,
    control,
    watch,
  } = useForm<DealPipelineFieldType>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(dealPipelineSchema),
    defaultValues: {
      is_default: false,
      stages: [
        { name: 'New', stage_type: 'Neutral', probability: 100 || '' },
        { name: 'Win', stage_type: 'Win', probability: 100 || '' },
        { name: 'Lost', stage_type: 'Lost', probability: 100 || '' },
      ],
    },
  });
  const { fields, insert, remove } = useFieldArray({ name: 'stages', control });

  // ** APIS **
  const [addPipeline, { isLoading: addPipelineLoading }] =
    useAddPipelineMutation();
  const [updateDealPipelineById, { isLoading: updatePipelineLoading }] =
    useUpdatePipelineMutation();
  const [getDealPipelineById, { isLoading }] = useLazyGetPipelineByIdQuery();

  // ** States **
  const [openDiscardModal, setOpenDiscardModal] = useState<boolean>(false);
  const [isDefaultPipeline, setIsDefaultPipeline] = useState<boolean>(false);
  const [isSystemPipeline, setIsSystemPipeline] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      getDealPipeline(id);
    }
  }, [id]);

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen]);

  const getDealPipeline = async (statusId: number) => {
    const { data, error } = await getDealPipelineById({ id: statusId }, true);
    if (data && !error) {
      const updatedStages = data.stages.map(
        (stage: dealPipelineStagesResponseType) => {
          return {
            ...stage,
            probability: stage.probability.toString(),
            stageId: stage.id,
          };
        }
      );
      // Set System Pipeline Data -> data?.is_system
      setIsSystemPipeline(false);
      setIsDefaultPipeline(data?.is_default);
      reset({
        name: data?.name || '',
        rot_days: data.rot_days ? data.rot_days.toString() : '',
        stages: updatedStages || '',
        is_default: data?.is_default,
      });
    }
  };

  const onSubmit = handleSubmit(async (value) => {
    if (id) {
      const newStages: newStageType[] | null = [];
      const oldStages: oldStageType[] | null = [];

      value.stages?.forEach((val, index) => {
        if (!val.id) {
          newStages.push({ ...val, order: index });
        } else {
          oldStages.push({
            order: index,
            id: val.id,
            stage_type: val.stage_type,
            name: val.name,
            probability: val.probability,
          });
        }
      });
      const stages = {
        old: oldStages,
        new: newStages.length === 0 ? null : newStages,
      };
      delete value.stages;
      const formVal = { stages, ...value };

      updateDealPipeline(id, formVal);
    } else {
      const updatedStages = value.stages?.map((val, index) => {
        return { ...val, order: index };
      });
      const stages = {
        new: updatedStages,
      };
      delete value.stages;
      const formVal = { stages, ...value };

      addDealLostReason(formVal);
    }
  });

  const addDealLostReason = async (formVal: addFormValType) => {
    const data = await addPipeline({ data: formVal });
    if (data) {
      setDealPipelineInfo([]);
      onAdd();
      close();
    }
  };

  const updateDealPipeline = async (
    pipelineId: number,
    formVal: updateFormValType
  ) => {
    const data = await updateDealPipelineById({
      id: pipelineId,
      data: formVal,
    });
    if (data) {
      setDealPipelineInfo([]);
      close();
      onAdd();
    }
  };

  const onCancelForm = () => {
    const isDirtyFields = Object.values(dirtyFields);
    if (id && isDirtyFields.length) {
      setOpenDiscardModal(true);
    } else {
      close();
    }
  };

  const close = () => {
    reset();
    closeModal();
  };

  return isOpen ? (
    <Modal
      title={`${
        id
          ? isSystemPipeline
            ? 'Pipeline Details'
            : 'Update Pipeline'
          : 'Add New Pipeline'
      }`}
      visible={isOpen}
      onClose={() => onCancelForm()}
      onCancel={() => onCancelForm()}
      onSubmit={onSubmit}
      {...(id
        ? {
            submitBtnDisabled:
              (isSystemPipeline && isDefaultPipeline) ||
              (isSystemPipeline && !isDirty),
          }
        : {})}
      submitButtonText={id ? 'Update' : 'Add'}
      submitLoading={addPipelineLoading || updatePipelineLoading}
      width="800px"
      contentClass="add__pipeline__modal"
    >
      {isLoading ? (
        <PipelineFormSkeleton />
      ) : (
        <form onSubmit={onSubmit}>
          <DealPipelineForm
            id={id}
            reset={reset}
            watch={watch}
            remove={remove}
            insert={insert}
            fields={fields}
            errors={errors}
            control={control}
            register={register}
            isSystemPipeline={isSystemPipeline}
            isDefaultPipeline={isDefaultPipeline}
          />
        </form>
      )}
      {openDiscardModal && (
        <DiscardConfirmationModal
          discardActivity={close}
          isOpen={openDiscardModal}
          closeModal={() => setOpenDiscardModal(false)}
        />
      )}
    </Modal>
  ) : (
    <></>
  );
};

export default AddPipelineStatusModal;
