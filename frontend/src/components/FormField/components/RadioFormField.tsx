import { Fragment } from 'react';
import { FormFieldProps } from '../types/formField.types';

const RadioFormField = <TFormValues extends Record<string, unknown>>(
  fieldProps: FormFieldProps<TFormValues>
) => {
  const {
    id,
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
      {
        options?.length ? <>

          {options.map((option) => (
            <div
              className={`ip__Radio ${wrapperClass}`}
              key={option.label?.toString()}
            >
              <Fragment key={option.label?.toString()}>
                <input
                  defaultChecked={!!option.checked}
                  disabled={disabled}
                  type="radio"
                  value={option.value}
                  {...(register && register(name))}
                  {...rest}
                />

                <label htmlFor={id} className={`rc__Label ${labelClass}`}>
                  <span className="custom__checkRadio__tick hidden" />
                  {option.label}
                </label>
              </Fragment>
            </div>
          ))}
        </> :
          <div
            className={`ip__Radio ${wrapperClass}`}
            key={rest.label?.toString()}
          >
            <Fragment key={rest.label?.toString()}>
              <input
                disabled={disabled}
                type="radio"
                value={rest.value}
                {...(register && register(name))}
                {...rest}
              />

              <label htmlFor={id} className={`rc__Label ${labelClass}`}>
                <span className="custom__checkRadio__tick hidden" />
                {rest.label}
              </label>
            </Fragment>
          </div>
      }
      {error && <p className="ip__Error">{error.message}</p>}
    </>
  );
};

export default RadioFormField;
