import { FormFieldProps } from '../types/formField.types';

const ColorPickerFormField = <TFormValues extends Record<string, unknown>>(
  fieldProps: FormFieldProps<TFormValues>
) => {
  const {
    id,
    label,
    required,
    register,
    className,
    name,
    error,
    icon,
    iconPosition,
    fieldLimit,
    labelClass = '',
    ...rest
  } = fieldProps;
  return (
    <>
      <label htmlFor={id} className={`if__label ${labelClass}`}>
        {label}
        {required ? <span className="required__sign">*</span> : ''}
      </label>
      <div
        className={`${icon ? 'ipel__wrapper ip__form__hasIcon' : ''}
           ${iconPosition === 'right' ? 'ip__form__hasIcon__right' : ''} `}
      >
        <input
          {...rest}
          defaultValue="#000000"
          autoComplete="new-password"
          type="color"
          className={`ip__input ${className}`}
          {...(register && register(name))}
          maxLength={fieldLimit || 100}
        />
      </div>
      {error && <p className="ip__Error">{error.message}</p>}
    </>
  );
};

export default ColorPickerFormField;
