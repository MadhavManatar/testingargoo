import { Path, PathValue } from 'react-hook-form';
import { MultiValue, SingleValue } from 'react-select';

export function isMultiValue<T>(
  arg: MultiValue<T> | SingleValue<T>
): arg is MultiValue<T> {
  return Array.isArray(arg);
}

export function isSingleValue<T>(
  arg: MultiValue<T> | SingleValue<T>
): arg is SingleValue<T> {
  return !Array.isArray(arg);
}

export const reactDatePickerSelectedDate = (
  date: PathValue<
    Record<string, unknown>,
    Path<Record<string, unknown>> & (string | undefined)
  >
) => {
  if (
    typeof date === 'number' ||
    typeof date === 'string' ||
    date instanceof Date
  )
    return !Number.isNaN(new Date(date).getDate()) ? new Date(date) : undefined;
};