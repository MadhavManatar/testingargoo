// ** external packages **
import { Controller } from 'react-hook-form';
import MaskedInput from 'react-text-mask';

// ** components **
import Icon from 'components/Icon';

//  ** types **
import { FormFieldProps } from '../types/formField.types';

// ** others **
import { changeMaskInputValueFunction, formatMaskValue } from 'utils/util';

const MaskInputFormField = <TFormValues extends Record<string, unknown>>(
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
    fieldLimit,
    control,
    maskInputType = '',
    mask = false,
    iconClass,
    labelClass = '',
    inputMode,
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
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value, name: maskInputName } }) => {
            const { placeholder } = rest;
            return (
              <MaskedInput
                mask={mask}
                className={`ip__input ${className}`}
                maxLength={fieldLimit || 100}
                guide={false}
                name={maskInputName}
                {...(inputMode ? { inputMode } : {})}
                value={
                  formatMaskValue(value as string, maskInputType) as
                    | string
                    | undefined
                }
                autoComplete="new-password"
                onChange={(e) =>
                  changeMaskInputValueFunction(
                    e.target.value,
                    maskInputType,
                    onChange
                  )
                }
                onBlur={(e) =>
                  changeMaskInputValueFunction(
                    e.target.value,
                    maskInputType,
                    onChange
                  )
                }
                placeholder={placeholder}
              />
            );
          }}
        />
        {icon && <Icon className={iconClass} iconType={icon} />}
      </div>
      {error && <p className="ip__Error">{error.message}</p>}
    </>
  );
};

export default MaskInputFormField;
