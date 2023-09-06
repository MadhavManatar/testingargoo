import Icon from 'components/Icon';
import { Controller } from 'react-hook-form';
import { isMultiValue } from '../helper';
import { FormFieldProps } from '../types/formField.types';
import ReactSelect from 'react-select';

const CustomSelect = <TFormValues extends Record<string, unknown>>(
  fieldProps: FormFieldProps<TFormValues>
) => {
  const {
    id,
    name,
    options = [],
    label,
    icon,
    error,
    isClearable,
    menuPlacement = 'auto',
    menuPosition = 'fixed',
    disabled = false,
    required,
    iconClass,
    control,
    placeholder,
    isMulti,
    labelClass = '',
    OptionComponent,
    singleValueComponent,
    isSearchable = true,
    onChange: onCustomChange,
    autoFocus,
    getOnChange,
    ...otherFieldProps
  } = fieldProps;

  return (
    <div id={`${id}`}>
      <label htmlFor={id} className={`if__label ${labelClass}`}>
        {label}
        {required ? <span className="required__sign">*</span> : ''}
      </label>
      <div
        className={`ip__Select ${
          icon ? 'ipel__wrapper ip__form__hasIcon' : ''
        }`}
      >
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value, ref } }) => (
            <>
              <ReactSelect
                ref={ref}
                classNamePrefix="ip__select__dynamic"
                key={Number(value)}
                value={options.find((c) => c.value === value)}
                options={options}
                isMulti={isMulti}
                isSearchable={isSearchable}
                isDisabled={disabled}
                menuPosition={menuPosition}
                menuPlacement={menuPlacement}
                menuShouldScrollIntoView={
                  !document.getElementById(`ip__Modal__Body`)
                }
                isLoading={otherFieldProps.isLoading}
                placeholder={placeholder}
                autoFocus={autoFocus}
                onChange={(selectedOption) => {
                  if (isMultiValue(selectedOption)) {
                    const tempSelectedOption = selectedOption.map(
                      (obj) => obj.value
                    );
                    onChange(tempSelectedOption as any);
                  } else if (selectedOption) {
                    if (onCustomChange) {
                      onCustomChange((selectedOption as any).value);
                    }
                    onChange(selectedOption.value as any);
                  } else {
                    onChange(null as any);
                  }
                  if (getOnChange) {
                    getOnChange(selectedOption);
                  }
                }}
                isClearable={isClearable}
                {...(otherFieldProps.noOptionsMessage && {
                  noOptionsMessage: otherFieldProps.noOptionsMessage,
                })}
                components={{
                  ...(OptionComponent && {
                    Option: OptionComponent,
                  }),
                  ...(singleValueComponent && {
                    SingleValue: singleValueComponent,
                  }),
                }}
              />
            </>
          )}
        />
        {icon && <Icon className={iconClass} iconType={icon} />}
      </div>
      {error && <p className="ip__Error">{error.message}</p>}
    </div>
  );
};

export default CustomSelect;
