// ** external packages **
import { useEffect, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import ReactSelect, { InputActionMeta } from 'react-select';

// ** components **
import Icon from 'components/Icon';

// ** types **
import { FormFieldProps, Option } from '../types/formField.types';

// ** others **
import { isMultiValue } from '../helper';

export const CustomAsyncSelect = <TFormValues extends Record<string, unknown>>(
  props: FormFieldProps<TFormValues>
) => {
  const {
    id,
    name,
    label,
    icon,
    error,
    getOptions,
    isLoading,
    isClearable,
    isMulti,
    placeholder,
    defaultOptions,
    disabled,
    serveSideSearch = false,
    menuPosition = 'fixed',
    menuPlacement = 'top',
    required,
    onFocusApiCall = true,
    labelClass = '',
    OptionComponent,
    singleValueComponent,
    defaultSelectValue,
    onChange: onCustomChange,
    getOnChange,
    autoFocus,
    ...otherFieldProps
  } = props;

  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [options, setOptions] = useState<Option[]>(defaultOptions || []);
  const selectRef = useRef<any>(null);

  const { iconClass } = otherFieldProps;

  function debounce<Params extends any[]>(
    func: (...args: Params) => any,
    timeout: number
  ): (...args: Params) => void {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: Params) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, timeout);
    };
  }

  useEffect(() => {
    if (selectRef?.current?.inputRef) {
      selectRef.current.inputRef.autocomplete = 'new-password';
    }
  }, [selectRef?.current?.inputRef]);

  const fetchOption = async ({ pageNo = page, value = search } = {}) => {
    if (getOptions) {
      const data = await getOptions({ search: value, page: pageNo });
      if (data) {
        setTotal(data.count || 0);
        if (pageNo !== 1) {
          const tempOptions = [...options];
          data.option.forEach((op) => {
            if (!tempOptions.find((el) => el.value === op.value)) {
              tempOptions.push(op);
            }
          });
          setOptions(tempOptions);
        } else {
          setOptions(data.option);
        }
        setPage(pageNo + 1);
      } else {
        setPage(1);
        setSearch('');
        setTotal(0);
      }
      return data;
    }
  };

  const onMenuScrollToBottom = (e: any) => {
    if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight) {
      if (total > options.length) {
        fetchOption();
      }
    }
  };

  const onInputChange = debounce(
    (e: string, inputMetaData: InputActionMeta) => {
      // this condition for when user blur or close that time no need to api call
      if (inputMetaData.action !== 'menu-close') {
        setSearch(e);
        fetchOption({ value: e, pageNo: 1 });
      }
    },
    200
  );

  return (
    <>
      <label htmlFor={id} className={`if__label ${labelClass}`}>
        {label}
        {required ? <span className="required__sign">*</span> : ''}
      </label>
      <div
        className={`ip__Select ${
          icon ? 'ipel__wrapper ip__form__hasIcon' : ''
        }`}
        key={otherFieldProps.key}
      >
        <Controller
          name={name}
          control={otherFieldProps.control}
          render={({ field: { onChange, value } }) => {
            return (
              <>
                <ReactSelect
                  ref={selectRef}
                  key={otherFieldProps.key}
                  classNamePrefix="ip__select__dynamic"
                  value={
                    defaultSelectValue === null
                      ? null
                      : options.find((c) => c.value === value)
                  }
                  options={options}
                  {...(isMulti && { isMulti })}
                  isDisabled={disabled}
                  menuPosition={menuPosition}
                  menuPlacement={menuPlacement}
                  menuShouldScrollIntoView={
                    !document.getElementById(`ip__Modal__Body`)
                  }
                  onInputChange={serveSideSearch ? onInputChange : undefined}
                  {...(onFocusApiCall && {
                    onFocus: () => fetchOption({ pageNo: 1 }),
                  })}
                  placeholder={placeholder}
                  onMenuScrollToBottom={onMenuScrollToBottom}
                  isClearable={isClearable}
                  onChange={(selectedOption) => {
                    if (getOnChange) {
                      getOnChange(selectedOption);
                    }
                    if (isMultiValue(selectedOption)) {
                      const tempSelectedOption = selectedOption.map(
                        (obj) => obj.value
                      );
                      onChange(tempSelectedOption as any);
                    } else if (selectedOption) {
                      if (onCustomChange) {
                        onCustomChange((selectedOption as any).value);
                      }
                      onChange((selectedOption as any).value);
                    } else {
                      if (!selectedOption) {
                        setSearch('');
                      }
                      onChange(selectedOption as any);
                    }
                  }}
                  isLoading={isLoading}
                  {...(otherFieldProps.noOptionsMessage && {
                    noOptionsMessage: otherFieldProps.noOptionsMessage,
                  })}
                  {...(isMulti && {
                    defaultValue: defaultOptions,
                  })}
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
    </>
  );
};
