import Icon from 'components/Icon';
import { Controller } from 'react-hook-form';
import { isMultiValue } from '../helper';
import { FormFieldProps } from '../types/formField.types';
import CreatableSelect from 'react-select/creatable';

const CustomCreatableSelect = <TFormValues extends Record<string, unknown>>(
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
    isValidNewOption,
    defaultOptions,
    autoFocus,
  } = fieldProps;
  return (
    <>
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
            render={({ field: { onChange, value, ref } }) => {
              return (
                <>
                  <CreatableSelect
                    ref={ref}
                    classNamePrefix="ip__select__dynamic"
                    menuPosition={menuPosition}
                    menuPlacement={menuPlacement}
                    menuShouldScrollIntoView={
                      !document.getElementById(`ip__Modal__Body`)
                    }
                    isValidNewOption={isValidNewOption}
                    placeholder={placeholder}
                    isMulti={isMulti}
                    isDisabled={disabled}
                    value={options.find((c) => c.value === value)}
                    options={options}
                    onChange={(selectedOption) => {
                      if (isMultiValue(selectedOption)) {
                        const tempSelectedOption = selectedOption.map(
                          (obj) => obj.value
                        );
                        onChange(tempSelectedOption as any);
                      } else if (selectedOption) {
                        onChange(selectedOption.value as any);
                      }
                    }}
                    {...(isMulti && {
                      defaultValue: defaultOptions,
                    })}
                    formatCreateLabel={(label_val) => label_val}
                    isClearable={isClearable}
                    noOptionsMessage={() => null}
                    components={{
                      ...(OptionComponent && {
                        Option: OptionComponent,
                      }),
                      ...(singleValueComponent && {
                        SingleValue: singleValueComponent,
                      }),
                    }}
                    autoFocus={autoFocus}
                  />
                </>
              );
            }}
          />
          {icon && <Icon className={iconClass} iconType={icon} />}
        </div>
        {error && <p className="ip__Error">{error.message}</p>}
      </div>
    </>
  );
};

export default CustomCreatableSelect;
