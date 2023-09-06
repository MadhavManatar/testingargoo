// ** external packages **
import { Placement } from '@popperjs/core';
import { RichTextEditorComponent } from '@syncfusion/ej2-react-richtexteditor';
import type {
  DetailedHTMLProps,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import React, { ComponentType, ReactNode } from 'react';
import {
  Control,
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  Path,
  PathValue,
  UseFormRegister,
} from 'react-hook-form';
import {
  ActionMeta,
  GroupBase,
  MenuPosition,
  MultiValue,
  MultiValueGenericProps,
  OptionProps,
  OptionsOrGroups,
  SingleValue,
  SingleValueProps,
} from 'react-select';
import { Mask } from 'react-text-mask';

// ** others **
import type { IconTypes } from 'components/Icon';

export type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export type TextAreaProps = DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

export type Option = {
  __isNew__?: any;
  label: string;
  value: string | number;
  selected?: boolean;
  checked?: any;
  onChange?: any;
  color?: string;
  extraLabel?: string;
  [key: string]: any;
};

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'number'
  | 'mask_input'
  | 'input'
  | 'textarea'
  | 'select'
  | 'dateAndTime'
  | 'asyncSelect'
  | 'creatableAsyncSelect'
  | 'creatableSelect'
  | 'color'
  | 'time'
  | 'richTextEditor'
  | 'currency_format'
  | 'CreatableAsyncSelectFormFieldForSearch'
  | 'creatableAsyncSelectForEmail'
  | 'activity_topic';

export type SimpleFormFieldProps<TFormValues extends FieldValues> = {
  label?: string | React.ReactNode;
  icon?: IconTypes;
  iconClass?: string;
  iconPosition?: 'top' | 'right' | 'left' | 'bottom';
  name: Path<TFormValues>;
  options?: Option[] | readonly Option[];
  defaultChecked?: boolean;
  className?: string;
  wrapperClass?: string;
  type?: FieldType;
  minDate?: Date;
  maxDate?: Date;
  register?: UseFormRegister<TFormValues>;
  control?: Control<TFormValues>;
  error?:
  | Merge<FieldError, (FieldError | undefined)[]>
  | Merge<FieldError, (Merge<FieldError, FieldErrorsImpl> | undefined)[]>;
  errors?: FieldErrorsImpl<TFormValues>;
  isMulti?: boolean;
  disabled?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  getOptions?: AsyncSelectGetOptions; // async select
  defaultOptions?: Option[]; // async select
  isLoading?: boolean; // async select
  serveSideSearch?: boolean; // async select
  OptionComponent?: ComponentType<
    OptionProps<Option, boolean, GroupBase<Option>>
  >;
  // async select
  singleValueComponent?: ComponentType<
    SingleValueProps<Option, boolean, GroupBase<Option>>
  >;
  MultiValueComponent?: (props: MultiValueGenericProps) => JSX.Element;
  // async select
  noOptionsMessage?: () => ReactNode;
  setValue?: (value: string | undefined) => void;
  fieldLimit?: number;
  menuPosition?: MenuPosition;
  menuPlacement?: 'auto' | 'top' | 'bottom';
  popperPlacement?: Placement;
  popperPosition?: 'fixed';
  selected?: Date | null;
  showYearDropdown?: boolean;
  showMonthDropdown?: boolean;
  mask?: Mask;
  onFocusApiCall?: boolean;
  maskInputType?: string;
  labelClass?: string;
  beforeAddValidateRegex?: RegExp;
  isValidNewOption?: (optionValue: string) => boolean | any;
  inputMaxLength?: number;
  dateFormat?: string;
  defaultSelectValue?: null;
  formatName?: string;
  getOnChange?: (
    newValue: MultiValue<Option> | SingleValue<Option>,
    actionMeta?: ActionMeta<Option>
  ) => void;
  isInputValuePrevent?: boolean;
  setInputValue?: React.Dispatch<React.SetStateAction<boolean>>;
  dropdown_key?: string | number | undefined;
  getOnChangeDateValue?: (value: HTMLInputElement | null | undefined) => void;
  editorRef?: React.RefObject<RichTextEditorComponent>
  limit?: number;
} & InputProps &
  TextAreaProps &
  RandomColorSelectProps;

export type AsyncFormFieldProps<TFormValues extends FieldValues> = {
  label?: string | React.ReactNode;
  icon?: IconTypes;
  iconClass?: string;
  name: Path<TFormValues>;
  options?: Option[];
  defaultChecked?: boolean;
  className?: string;
  wrapperClass?: string;
  register?: UseFormRegister<TFormValues>;
  control?: Control<TFormValues>;
  error?: Merge<FieldError, (FieldError | undefined)[]>;
  errors?: FieldErrorsImpl<TFormValues>;
  isMulti?: boolean;
  disabled?: boolean;
} & InputProps &
  TextAreaProps &
  AsyncSelectProps;

export type FormFieldProps<TFormValues extends FieldValues> =
  SimpleFormFieldProps<TFormValues>;

export type GetAllApiProps = {
  search?: string;
  page?: number;
  [key: string]: any;
};

// async react select paginate
export type AsyncSelectPaginateOptionProps<TFormValues> = OptionsOrGroups<
  PathValue<TFormValues, Path<TFormValues> & (string | undefined)>,
  GroupBase<PathValue<TFormValues, Path<TFormValues> & (string | undefined)>>
>;

export type AsyncSelectPaginateGetOptions<TFormValues> = (
  option?: GetAllApiProps
) => Promise<
  | { option: AsyncSelectPaginateOptionProps<TFormValues>; count: number }
  | undefined
>;

export type AsyncSelectPaginateProps<TFormValues> = {
  getOptions: AsyncSelectPaginateGetOptions<TFormValues>;
};

// async react select
export type AsyncSelectGetOptions = (
  option?: GetAllApiProps
) => Promise<
  { option: Option[]; count: number; extraInfo?: any[] } | undefined
>;

export type AsyncSelectProps = {
  getOptions: AsyncSelectGetOptions;
  isLoading: boolean;
};

export type RandomColorSelectProps = {
  isMultiColor?: boolean;
};
