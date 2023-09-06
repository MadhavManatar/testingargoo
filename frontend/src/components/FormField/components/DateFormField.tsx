// ** external packages **
import { startOfDay } from 'date-fns';
import { useRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import { Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import MaskedInput from 'react-text-mask';

// ** redux **
import { getCurrentUserDateFormat } from 'redux/slices/authSlice';

// ** components **
import Icon from 'components/Icon';

// ** types **
import { FormFieldProps } from '../types/formField.types';

// ** others **
import { reactDatePickerSelectedDate } from '../helper';

export const DateFormField = <TFormValues extends Record<string, unknown>>(
  props: FormFieldProps<TFormValues>
) => {
  const {
    id,
    name,
    label,
    icon,
    error,
    selected,
    isClearable,
    popperPosition,
    disabled,
    popperPlacement,
    required,
    minDate,
    maxDate,
    showMonthDropdown,
    showYearDropdown,
    iconClass,
    labelClass = '',
    dateFormat,
    getOnChangeDateValue,
    ...otherFieldProps
  } = props;

  const dateRef = useRef<HTMLDivElement>(null);
  const userDateFormat = useSelector(getCurrentUserDateFormat);

  const setMaskInput = () => {
    if (userDateFormat === 'yyyy/MM/dd') {
      return [/\d/, /\d/, /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/];
    }
    return [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  };

  return (
    <div className="form__Group">
      <label htmlFor={id} className={`if__label ${labelClass}`}>
        {label}
        {required ? <span className="required__sign">*</span> : ''}
      </label>
      <div
        ref={dateRef}
        className={`ip__react__datepicker ${icon ? 'ipel__wrapper' : ''}`}
      >
        <Controller
          name={name}
          control={otherFieldProps.control}
          render={({ field: { onChange, value } }) => (
            <ReactDatePicker
              isClearable={isClearable}
              dateFormat={
                dateFormat ||
                useSelector(getCurrentUserDateFormat) ||
                'MM-dd-yyyy'
              }
              onChange={(e) => {
                getOnChangeDateValue?.(dateRef.current?.querySelector('input'));
                onChange(e ? startOfDay(e).toISOString() : e);
              }}
              autoComplete="new-password"
              selected={reactDatePickerSelectedDate(
                value || selected || undefined
              )}
              placeholderText={
                dateFormat ||
                useSelector(getCurrentUserDateFormat)?.toUpperCase() ||
                'MM-dd-yyyy'
              }
              popperProps={{
                ...(popperPosition && { strategy: popperPosition }),
              }}
              customInput={
                <MaskedInput type="text" mask={() => setMaskInput()} />
              }
              {...(popperPlacement && { popperPlacement })}
              minDate={minDate}
              maxDate={maxDate}
              disabled={disabled}
              {...(showYearDropdown && { showYearDropdown })}
              {...(showMonthDropdown && { showMonthDropdown })}
              scrollableYearDropdown
              scrollableMonthYearDropdown
              dropdownMode="select"
            />
          )}
        />
        {icon && <Icon className={iconClass} iconType={icon} />}
      </div>
      {error && <p className="ip__Error">{error.message}</p>}
    </div>
  );
};

export default DateFormField;
