// ** external packages **
import { format } from 'date-fns-tz';
import ReactDatePicker from 'react-datepicker';
import { Controller } from 'react-hook-form';
// ** components **
import Icon from 'components/Icon';

// ** types **
import { FormFieldProps } from '../types/formField.types';

// ** others **
import { reactDatePickerSelectedDate } from '../helper';

export const DateAndTimeFormField = <
  TFormValues extends Record<string, unknown>
>(
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
    ...otherFieldProps
  } = props;

  return (
    <div className="form__Group">
      <label htmlFor={id} className={`if__label ${labelClass}`}>
        {label}
        {required ? <span className="required__sign">*</span> : ''}
      </label>
      <div
        className={`ip__react__datepicker ip__react__datepicker__hasTime ${
          icon ? 'ipel__wrapper' : ''
        }`}
      >
        <Controller
          name={name}
          control={otherFieldProps.control}
          render={({ field: { onChange, value, ref } }) => (
            <ReactDatePicker
              ref={ref}
              showTimeSelect
              isClearable={isClearable}
              dateFormat="MM-dd-yyyy hh:mm aa"
              onChange={(e) =>
                onChange(
                  e
                    ? new Date(
                        format(new Date(e), 'MM-dd-yyyy hh:mm aa')
                      ).toISOString()
                    : (e as any)
                )
              }
              autoComplete="new-password"
              selected={reactDatePickerSelectedDate(
                value || selected || undefined
              )}
              placeholderText="MM-DD-YYYY hh:mm aa"
              popperProps={{
                ...(popperPosition && { strategy: popperPosition }),
              }}
              {...(popperPlacement && { popperPlacement })}
              minDate={minDate}
              maxDate={maxDate}
              disabled={disabled}
              {...(showYearDropdown && { showYearDropdown })}
              {...(showMonthDropdown && { showMonthDropdown })}
              scrollableYearDropdown
              scrollableMonthYearDropdown
            />
          )}
        />
        {icon && <Icon className={iconClass} iconType={icon} />}
      </div>
      {error && <p className="ip__Error">{error.message}</p>}
    </div>
  );
};

export default DateAndTimeFormField;
