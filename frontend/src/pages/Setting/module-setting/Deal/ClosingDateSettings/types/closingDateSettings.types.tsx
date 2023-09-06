import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

export type ClosingDateSettingsFormFieldsType = {
  time_frame: number;
  neutral_color: string;
  warning_color: string;
  passed_due_color: string;
};

export type ClosingDateTypes =
  | 'time_frame'
  | 'neutral_color'
  | 'warning_color'
  | 'passed_due_color';

export type ClosingDateSettingsFormPropsType = {
  errors: FieldErrors<ClosingDateSettingsFormFieldsType>;
  register: UseFormRegister<ClosingDateSettingsFormFieldsType>;
  watch: UseFormWatch<ClosingDateSettingsFormFieldsType>;
  setValue: UseFormSetValue<ClosingDateSettingsFormFieldsType>;
};
