import { agGridSelectedProps } from 'components/TableInfiniteScroll';
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayInsert,
  UseFieldArrayRemove,
  UseFormRegister,
  UseFormReset,
  UseFormWatch,
} from 'react-hook-form';

export type DealPipelineFieldType = {
  name: string;
  rot_days: number;
  stages?:
  | {
    id?: number;
    order?: number;
    name: string;
    probability: number;
    stage_type?: string;
    stageId?: number;
  }[];
  is_default: boolean;
};

export type newStageType = {
  name: string;
  order: number;
  probability: number;
};

export type oldStageType = {
  id: number;
  order: number | undefined;
  stage_type: string | undefined;
  name: string;
  probability: number | undefined;
};

export type updateFormValType = {
  name: string;
  rot_days: number;
  stages:
  | {
    name: string;
    probability: number;
  }[]
  | {
    old: oldStageType[];
    new: newStageType[] | null;
  };
};

export type addFormValType = {
  name: string;
  rot_days: number;
  stages:
  | {
    name: string;
    probability: number;
  }[]
  | {
    new:
    | {
      order: number;
      name: string;
      probability: number;
    }[]
    | undefined;
  };
};

export type dealPipelineStagesResponseType = {
  created_at: string;
  created_by: number;
  deleted_at: null | string;
  id: number;
  stageId?: number;
  is_deleted: boolean;
  name: string;
  order: number;
  organization_id: number;
  pipeline_id: number;
  probability: number;
  rot_days: string | undefined;
  updated_at: string;
  updated_by: number;
  stage_type: string;
};

export type pipelineStagesDelete = {
  stage_id: number;
  pipeline_id?: number
  deal_stage_id?: number
};

export type DeleteDealPipelinePropsType = {
  isOpen: boolean;
  deleteOnSubmit: () => void;
  closeModal: () => void;
  isLoading: boolean;
  moduleName: string;
  pipelineId: number;
};

export type DealPipelineFormPropsType = {
  errors: FieldErrors<DealPipelineFieldType>;
  register: UseFormRegister<DealPipelineFieldType>;
  control: Control<DealPipelineFieldType>;
  fields: FieldArrayWithId<DealPipelineFieldType, 'stages', 'id'>[];
  remove: UseFieldArrayRemove;
  insert: UseFieldArrayInsert<DealPipelineFieldType, 'stages'>;
  reset: UseFormReset<DealPipelineFieldType>;
  watch: UseFormWatch<DealPipelineFieldType>;
  id: number | null | undefined;
  isSystemPipeline?: boolean;
  isDefaultPipeline?: boolean;
};

export type DeleteDealPipelineStagesModalPropsType = {
  isOpen: boolean;
  deletePipelineStage: (bodyObj: {
    currentStageId: number;
    newStageId?: number;
  }) => void;
  closeModal: () => void;
  isLoading: boolean;
  id?: number | null;
  selectedStage: {
    index: number;
    stageId: number;
    stage_name?: string;
  };
};

export type AddPipelineStatusModalPropsType = {
  isOpen?: boolean;
  closeModal: () => void;
  id: number | null | undefined;
  onAdd: () => void;
  setDealPipelineInfo: React.Dispatch<
    React.SetStateAction<agGridSelectedProps>
  >;
};
