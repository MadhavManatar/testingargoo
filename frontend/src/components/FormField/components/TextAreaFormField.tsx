import { FormFieldProps } from '../types/formField.types';

const TextAreaFormField = <TFormValues extends Record<string, unknown>>(
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
      <div>
        <textarea
          maxLength={fieldLimit}
          id={id}
          className={`ip__textarea ip__FancyScroll ${className}`}
          {...(register && register(name))}
          {...rest}
        />
      </div>
      {error && <p className="ip__Error">{error.message}</p>}
    </>
  );
};

export default TextAreaFormField;
