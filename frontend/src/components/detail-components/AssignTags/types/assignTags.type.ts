import { AssignTagsProps } from 'components/EntityDetails/types';
import { ModuleNames } from 'constant/permissions.constant';
import { SetStateAction } from 'react';
import {
  Control,
  FieldErrors,
  UseFormReset,
  UseFormSetError,
} from 'react-hook-form';

export type AssignTagFormValueType = {
  tags: {
    color: string;
    label: string;
    value: string | number;
    __isNew__: boolean;
  }[];
};

export type tag = { id: number; name: string; color: string };
export interface AssignTagCommonProps {
  assignedTags: AssignTagsProps;
  setAssignedTags: (value: React.SetStateAction<AssignTagsProps>) => void;
  editTagsPermission?: boolean;
  isList?: boolean;
  deleteAssignedTag: (deleteId: number, tagDetail?: tag) => Promise<void>;
}

export interface AssignTagsListProps extends AssignTagCommonProps {
  isFullList?: boolean;
  modelName?: string;
  modelRecordId?: number;
  setAssignedTags: (value: React.SetStateAction<AssignTagsProps>) => void;
  setModal?: () => void;
  setDisableSaveBtn?: React.Dispatch<React.SetStateAction<boolean>>;
  setAlreadyAssignID?: React.Dispatch<React.SetStateAction<number[]>>;
}

export interface AssignTagModalProps extends AssignTagCommonProps {
  isOpen: boolean;
  refreshTable?: () => void;
  setAssignedTags: (value: React.SetStateAction<AssignTagsProps>) => void;
  getAssignedTags?: () => void;
  closeModal: () => void;
  modelName: string;
  modelRecordId?: number;
}

export interface TagFormProps {
  errors: FieldErrors<AssignTagFormValueType>;
  control: Control<AssignTagFormValueType>;
  assignedTagIds?: number[];
  reset: UseFormReset<AssignTagFormValueType>;
  modelRecordId?: number;
  modelName: string;
  setError: UseFormSetError<AssignTagFormValueType>;
  assignedTags: AssignTagsProps;
  setAssignedTags?: (value: React.SetStateAction<AssignTagsProps>) => void;
  setDisableSaveBtn?: React.Dispatch<React.SetStateAction<boolean>>;
  setAlreadyAssignID: React.Dispatch<React.SetStateAction<number[]>>;
  alreadyAssignID: number[];
}

export type TagModalForQuickCardPropsType = {
  isOpen: boolean;
  modelName: ModuleNames;
  modelRecordId: number;
  closeModal: () => void;
  onAdd?: () => void;
  editTagsPermission?: boolean;
  deleteAssignedTag?: (deleteId: number, tagDetail?: tag) => Promise<void>;
};
