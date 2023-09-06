import { FormFieldProps } from 'components/FormField/types/formField.types';
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';

export enum ACCESSIBILITY_TYPE {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export type AddSnippetFieldType = {
  title: string;
  type: string;
  accessibility: ACCESSIBILITY_TYPE;
  category: string | number;
  snippet_text: string;
};

export type SnippetResponseType = {
  id: number;
  title: string;
  type: string;
  accessibility: ACCESSIBILITY_TYPE;
  category: string | number;
  snippet: string;
  snippet_category: { id: number; name: string };
  created_by: number;
  snippet_text_count: number,
  creator: { username: string; first_name: string; last_name: string };
};

export type snippetType = 'activity_result' | 'note' | 'email' | 'anywhere'

export type AddSnippetModalPropsTypes = {
  isOpen?: boolean;
  closeModal: () => void;
  id?: number | null;
  onAdd?: () => void;
  defaultValue: {
    type?: snippetType;
  };
};

export type SnippetFormProps = {
  snippetInfo: SnippetResponseType | undefined;
  errors: FieldErrors<AddSnippetFieldType>;
  register: UseFormRegister<AddSnippetFieldType>;
  control: Control<AddSnippetFieldType>;
  setValue: UseFormSetValue<AddSnippetFieldType>;
  displayFieldProps?: {
    [key in keyof AddSnippetFieldType]?: {
      [formKey in keyof FormFieldProps<AddSnippetFieldType>]?: any;
    };
  };
};

export type UseSnippetTextColumnsPropsTypes = {
  openEditSnippetModal: (id: number) => void;
  selectionRef?: any;
  setSelectionList?: any;
  setIsCheckAll?: any;
  disabled?: any;
  isCheckAll?: boolean;
  isCheckAllRef?: any;
  isSelectionDisabled?: boolean;
  openDeleteSnippetModal: () => void;
};
