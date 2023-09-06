// ** Import Packages **
import Tippy from '@tippyjs/react';
import { useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { FieldArrayWithId } from 'react-hook-form';

// ** Components **
import FormField from 'components/FormField';
import Icon from 'components/Icon';
import DeleteDealPipelineStagesModal from './DeleteDealPipelineStagesModal';

// ** Hook **
import usePermission from 'hooks/usePermission';

// ** Types **
import {
  DealPipelineFieldType,
  DealPipelineFormPropsType,
} from '../types/deal-pipeline.types';

// ** Constants **
import { STAGE_TYPES } from 'constant';

// ** Others **
import { checkInputIsNumber } from 'utils/util';
import { useDeletePipelineStageByIdMutation } from 'redux/api/pipelineApi';

const DealPipelineForm = (props: DealPipelineFormPropsType) => {
  const {
    errors,
    register,
    control,
    fields,
    remove,
    insert,
    reset,
    watch,
    id,
    isSystemPipeline,
    isDefaultPipeline,
  } = props;

  const fieldDisable = id ? { disabled: isSystemPipeline } : {};

  // ** States **
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedStage, setSelectedStage] = useState<{
    index: number;
    stageId: number;
    stage_name?: string;
  }>({ index: 0, stageId: 0 });

  // ** APIS **
  const [deletePipelineStageAPI, { isLoading: deletePipelineStageLoading }] =
    useDeletePipelineStageByIdMutation();

  const { updateDealPermission } = usePermission();

  const reorder = (
    list:
      | {
          id?: number;
          order?: number;
          name: string;
          probability: number;
          stage_type?: string;
          stageId?: number;
        }[]
      | undefined,
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(list || []);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onRemoveStage = (
    index: number,
    field: FieldArrayWithId<DealPipelineFieldType, 'stages', 'id'>
  ) => {
    const { stageId } = field;
    if (stageId) {
      setDeleteModal(true);
      setSelectedStage({ index, stageId, stage_name: field.name });
    } else {
      remove(index);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return null;
    }
    const stages = watch('stages');
    const items = reorder(
      stages,
      result.source.index,
      result.destination.index
    );
    reset({ stages: items });
  };

  const closeModal = () => setDeleteModal(false);

  const deletePipelineStage = async (bodyObj: {
    currentStageId: number;
    newPipelineId?: number;
    newStageId?: number;
  }) => {
    if (
      id ? updateDealPermission && selectedStage.stageId : selectedStage.stageId
    ) {
      await deletePipelineStageAPI({
        id: id as number,
        data: bodyObj,
      });
      remove(selectedStage.index);
      setSelectedStage({ stageId: 0, index: 0 });
      closeModal();
    }
  };

  return (
    <>
      <div className="sm:w-full sm:px-0">
        <div className="hidden__if__label">
          <div className="external__from__label text-[18px] font-biotif__Medium text-ip__Blue mb-[3px] flex flex-wrap">
            Name <span className="text-ip__Red">*</span>
          </div>
          <FormField<DealPipelineFieldType>
            placeholder="Name"
            name="name"
            error={errors?.name}
            type="text"
            fieldLimit={50}
            label="Name"
            register={register}
            {...fieldDisable}
          />
        </div>
        <FormField<DealPipelineFieldType>
          type="checkbox"
          name="is_default"
          disabled={isSystemPipeline && isDefaultPipeline}
          label="Mark as Default"
          register={register}
          error={errors.is_default}
        />
        <div className="relative w-[250px] max-w-full pr-[42px]">
          <div className="external__from__label text-[18px] font-biotif__Medium text-ip__Blue mb-[3px] flex flex-wrap items-center">
            Deals rot after <span className="text-ip__Red">*</span>
            <Tippy
              content="Deal rot info : Deals will be highlighted as rotten after this period "
              placement="right"
            >
              <div className="tooltip__iButton ml-[6px] cursor-pointer">
                <div className="inner__wrapper">
                  <span className="dot" />
                  <span className="line" />
                </div>
              </div>
            </Tippy>
          </div>
          <FormField<DealPipelineFieldType>
            placeholder="Ex: 10"
            name="rot_days"
            type="text"
            fieldLimit={4}
            register={register}
            error={errors.rot_days}
            inputMode="numeric"
            {...fieldDisable}
          />
          <p className="text-[14px] font-biotif__Medium text-light__TextColor inline-block absolute top-[43px] right-0">
            Days
          </p>
        </div>
        <div className="deal__stage__wrapper">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {fields.map(
                    (
                      field: FieldArrayWithId<
                        DealPipelineFieldType,
                        'stages',
                        'id'
                      >,
                      index: number
                    ) => {
                      return (
                        <Draggable
                          {...(id ? { isDragDisabled: isSystemPipeline } : {})}
                          draggableId={field.id}
                          key={field.id}
                          index={index}
                        >
                          {(provided2) => (
                            <section
                              ref={provided2.innerRef}
                              {...provided2.draggableProps}
                              {...provided2.dragHandleProps}
                              className="deal__stage__box"
                              key={field.id}
                            >
                              <FormField<DealPipelineFieldType>
                                placeholder="Stage Name"
                                name={`stages.${index}.name`}
                                {...fieldDisable}
                                type="text"
                                register={register}
                                error={
                                  errors?.stages &&
                                  errors?.stages[index] &&
                                  errors?.stages[index]?.name
                                }
                              />
                              <FormField<DealPipelineFieldType>
                                id="stage_type"
                                placeholder="Select Type"
                                {...fieldDisable}
                                type="select"
                                menuPosition="absolute"
                                menuPlacement="bottom"
                                name={`stages.${index}.stage_type`}
                                control={control}
                                error={
                                  errors?.stages &&
                                  errors?.stages[index] &&
                                  errors?.stages[index]?.stage_type
                                }
                                options={STAGE_TYPES}
                              />
                              <FormField<DealPipelineFieldType>
                                placeholder="100"
                                fieldLimit={3}
                                {...fieldDisable}
                                name={`stages.${index}.probability`}
                                type="text"
                                onKeyDown={checkInputIsNumber}
                                register={register}
                                inputMode="numeric"
                                error={
                                  errors?.stages &&
                                  errors?.stages[index] &&
                                  errors?.stages[index]?.probability
                                }
                              />
                              <button
                                type="button"
                                className={
                                  id ? (isSystemPipeline ? 'hidden' : '') : ''
                                }
                                onClick={() => onRemoveStage(index, field)}
                              >
                                <Icon iconType="deleteFilled" />
                              </button>
                            </section>
                          )}
                        </Draggable>
                      );
                    }
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <div
            className={`flex justify-start ${
              id ? (isSystemPipeline ? 'hidden' : '') : ''
            }`}
          >
            <button
              className="add__deal__btn font-biotif__Regular text-[14px] leading-[18px] text-ip__SuccessGreen flex items-center mb-[7px] hover:text-ip__SuccessGreen__hoverDark"
              type="button"
              onClick={() =>
                insert(fields.length, {
                  name: '',
                  probability: 100,
                  stage_type: STAGE_TYPES[2].value,
                })
              }
              disabled={fields.length >= 10}
            >
              <Icon className="mr-[3px]" iconType="plusFilledWhiteBGIcon" /> Add
              Deal Stage
            </button>
          </div>
        </div>
      </div>
      {deleteModal ? (
        <DeleteDealPipelineStagesModal
          isOpen={deleteModal}
          isLoading={deletePipelineStageLoading}
          closeModal={closeModal}
          deletePipelineStage={deletePipelineStage}
          id={id}
          selectedStage={selectedStage}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default DealPipelineForm;
