import { FormFieldProps } from 'components/FormField/types/formField.types';
import Icon from 'components/Icon';
import ReactSelect from 'react-select';

const DropDownBox = <TFormValues extends Record<string, unknown>>(
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
    placeholder,
    isMulti,
    labelClass = '',
    OptionComponent,
    singleValueComponent,
    isSearchable = true,
    onChange: onCustomChange,
    autoFocus,
    value,
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
              <ReactSelect
                classNamePrefix="ip__select__dynamic"
                key={Number(value)}
                name={name}
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
                  if (selectedOption) {
                    if (onCustomChange) {
                      onCustomChange((selectedOption as any).value);
                    }
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
        {icon && <Icon className={iconClass} iconType={icon} />}
      </div>
      {error && <p className="ip__Error">{error.message}</p>}
    </div>
  );
};

export default DropDownBox;
