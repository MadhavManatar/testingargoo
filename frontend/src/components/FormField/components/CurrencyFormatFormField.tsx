// ** import packages **
import Inputmask from 'inputmask';
import { useEffect, useRef } from 'react';

// ** external packages **
import { Controller } from 'react-hook-form';

// ** components **
import Icon from 'components/Icon';

//  ** types **
import { FormFieldProps } from '../types/formField.types';

const CurrencyFormatFormField = <TFormValues extends Record<string, unknown>>(
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
    iconClass,
    labelClass = '',
    formatName,
    ...rest
  } = fieldProps;

  // ** hooks **
  const currencyInputRef = useRef(null);

  useEffect(() => {
    const im = new Inputmask(formatName as string, {
      rightAlign: false,
      showMaskOnHover: false,
    });
    if (currencyInputRef.current) {
      im.mask(currencyInputRef.current);
    }
  }, []); 

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
          render={({
            field: { onChange, value, name: currencyFormatName },
          }) => {
            return (
              <>
                <input
                  type="text"
                  ref={currencyInputRef}
                  id="currency"
                  inputMode="numeric"
                  autoComplete="new-password"
                  className={`ip__input ${className}`}
                  name={currencyFormatName}
                  maxLength={fieldLimit || 100}
                  {...rest}
                  onChange={onChange}
                  onBlur={onChange}
                  value={(value as string) || ''}
                />
              </>
            );
          }}
        />
        {icon && <Icon className={iconClass} iconType={icon} />}
      </div>
      {error && <p className="ip__Error">{error.message}</p>}
    </>
  );
};

export default CurrencyFormatFormField;
