// ** components **
import PasswordInput from 'components/PasswordInput';

// ** types **
import { FormFieldProps } from '../types/formField.types';

const PassportFormField = <TFormValues extends Record<string, unknown>>(
  fieldProps: FormFieldProps<TFormValues>
) => {
  const {
    id,
    label,
    required,
    className,
    name,
    error,
    icon,
    iconPosition,
    disabled = false,
    iconClass,
    register,
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
        <PasswordInput<TFormValues>
          disabled={disabled}
          name={name}
          icon={icon}
          iconClass={iconClass}
          className={`ip__input ${className}`}
          register={register}
          {...rest}
        />
      </div>
      {error && <p className="ip__Error">{error.message}</p>}
    </>
  );
};

export default PassportFormField;
