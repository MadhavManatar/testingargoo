import { Fragment } from 'react';
import { FormFieldProps } from '../types/formField.types';

const CheckBoxFormField = <TFormValues extends Record<string, unknown>>(
  fieldProps: FormFieldProps<TFormValues>
) => {
  const {
    id,
    label,
    className,
    name,
    error,
    wrapperClass,
    options = [],
    register,
    disabled = false,
    labelClass = '',
    ...rest
  } = fieldProps;

  return (
    <>
      {options && options.length === 0 ? (
        <div className={`ip__Checkbox ${wrapperClass}`}>
          <>
            <input
              disabled={disabled}
              key="checkbox"
              type="checkbox"
              autoComplete="new-password"
              className={className}
              {...(register && register(name))}
              {...rest}
            />

            <label htmlFor={id} className={`rc__Label ${labelClass}`}>
              <span className="custom__checkRadio__tick hidden" />
              {label}
            </label>
          </>
        </div>
      ) : (
        options.map((option) => (
          <div
            className={`ip__Checkbox ${wrapperClass}`}
            key={option.label?.toString()}
          >
            <Fragment key={option.label?.toString()}>
              <input
                disabled={disabled}
                key={option.value?.toString()}
                type="checkbox"
                value={option.value}
                defaultChecked={option.selected}
                {...(register && register(name))}
                {...rest}
              />
              <label htmlFor={id} className={`rc__Label ${labelClass}`}>
                <span className="custom__checkRadio__tick hidden" />
                {option.label}
              </label>
            </Fragment>
          </div>
        ))
      )}
      {error && <p className="ip__Error">{error.message}</p>}
    </>
  );
};

export default CheckBoxFormField;
