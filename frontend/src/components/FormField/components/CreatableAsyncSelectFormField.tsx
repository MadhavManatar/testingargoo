// ** external packages **
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { StylesConfig } from 'react-select';

import _ from 'lodash';

// ** components **
import Icon from 'components/Icon';
import CreatableSelect from 'react-select/creatable';

// ** types **
import { FormFieldProps, Option } from '../types/formField.types';

// ** others **
import { TAGS_COLOR } from 'constant';
import { isMultiValue } from '../helper';
import { fontColorBasedOnBgColor } from 'utils/util';

// for based on label color style
const colorStyles: StylesConfig<Option, true> = {
  multiValue: (styles, { data }) => {
    const fontColor = fontColorBasedOnBgColor(data.color, 'white', 'black');
    return {
      ...styles,
      backgroundColor: `${data.color} !important`,
      color: `${fontColor} !important`,
    };
  },
  multiValueLabel: (styles, { data }) => {
    const fontColor = fontColorBasedOnBgColor(data.color, 'white', 'black');
    return {
      ...styles,
      color: `${fontColor} !important`,
    };
  },
  multiValueRemove: (styles, { data }) => {
    const fontColor = fontColorBasedOnBgColor(data.color, 'white', 'black');
    return {
      ...styles,
      color: `${fontColor} !important`,
      ':before': {
        backgroundColor: `${fontColor} !important`,
        color: `${fontColor} !important`,
        height: '1px !important',
      },
      ':after': {
        backgroundColor: `${fontColor} !important`,
        color: `${fontColor} !important`,
        height: '1px !important',
      },
    };
  },
};

export const CreatableAsyncSelect = <
  TFormValues extends Record<string, unknown>
>(
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
    menuPlacement = 'auto',
    required,
    isMultiColor,
    labelClass = '',
    inputMaxLength,
    isValidNewOption,
    OptionComponent,
    singleValueComponent,
    MultiValueComponent,
    getOnChange,
    autoFocus,
    ...otherFieldProps
  } = props;

  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [options, setOptions] = useState<Option[]>(defaultOptions || []);

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

  const fetchOption = async ({
    pageNo = page,
    value = search,
    first = false,
    pagination = false,
  } = {}) => {
    if (getOptions) {
      if ((page !== 1 && value !== search) || first || pagination) {
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
    }
  };

  const onMenuScrollToBottom = (e: any) => {
    if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight) {
      if (total > options.length) {
        fetchOption({ pagination: true });
      }
    }
  };

  const onInputChange = debounce((e: string) => {
    setSearch(e);
    fetchOption({ value: e, pageNo: 1 });
  }, 200);

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
      >
        <Controller
          name={name}
          control={otherFieldProps.control}
          render={({ field: { onChange, value, ref } }) => {
            return (
              <>
                <CreatableSelect
                  ref={ref}
                  {...(isMultiColor && { styles: colorStyles })}
                  classNamePrefix="ip__select__dynamic"
                  key={otherFieldProps.key}
                  value={options.find((c) => c.value === value)}
                  options={options}
                  {...(isMulti && { isMulti })}
                  isDisabled={disabled}
                  menuPosition={menuPosition}
                  isValidNewOption={(InputValue: string) => {
                    if (isValidNewOption) {
                      return isValidNewOption(InputValue);
                    }
                    if (!InputValue.trim().length) {
                      return false;
                    }
                    if (inputMaxLength) {
                      if (InputValue?.length > inputMaxLength) {
                        return false;
                      }
                      return !!InputValue;
                    }
                    return !!InputValue;
                  }}
                  menuPlacement={menuPlacement}
                  menuShouldScrollIntoView={
                    !document.getElementById(`ip__Modal__Body`)
                  }
                  openMenuOnClick
                  onInputChange={serveSideSearch ? onInputChange : undefined}
                  onMenuOpen={() => fetchOption({ first: true, pageNo: 1 })}
                  placeholder={placeholder}
                  onMenuScrollToBottom={onMenuScrollToBottom}
                  isClearable={isClearable}
                  onChange={(selectedOption) => {
                    // ** here we assign the random color for newly created tags **
                    if (isMultiColor) {
                      if (isMultiValue(selectedOption)) {
                        const prevTagColor =
                          selectedOption[selectedOption.length - 2]?.color;
                        selectedOption.forEach((obj: Option) => {
                          if (!obj.color) {
                            obj.color = _.sample(
                              TAGS_COLOR.filter(
                                (color) => color !== prevTagColor
                              )
                            );
                          }
                        });
                        onChange(selectedOption as any);
                      }
                    } else if (isMultiValue(selectedOption)) {
                      const tempSelectedOption = selectedOption.map(
                        (obj) => obj.value
                      );
                      onChange(tempSelectedOption as any);
                    } else if (selectedOption) {
                      onChange((selectedOption as any).value);
                    } else {
                      onChange(selectedOption as any);
                    }
                    if (getOnChange) {
                      getOnChange(selectedOption);
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
                    ...(MultiValueComponent && {
                      MultiValueLabel: MultiValueComponent,
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
