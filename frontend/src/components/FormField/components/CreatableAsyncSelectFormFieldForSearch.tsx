// ** external packages **
import { useEffect, useState } from 'react';
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

// for based on label color style
const colorStyles: StylesConfig<Option, true> = {
  multiValue: (styles, { data }) => {
    return {
      ...styles,
      backgroundColor: `${data.color} !important`,
    };
  },
};

export const CreatableAsyncSelectFormFieldForSearch = <
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
    getOnChange,
    limit,

    ...otherFieldProps
  } = props;
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [options, setOptions] = useState<Option[]>(defaultOptions || []);
  const [optionSlice, setOptionSlice] = useState<number>(
    (limit && limit / 2) || 10
  );
  const [initialOptions, setInitialOptions] = useState<Option[]>([]);

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
    fetchOption({ pagination: true });
  }, [optionSlice]);

  useEffect(() => {
    fetchInitialOptions();
  }, []);

  const fetchInitialOptions = async () => {
    if (getOptions) {
      const data = await getOptions({});
      if (
        data &&
        _.isArray(defaultOptions) &&
        _.isArray(data.option) &&
        // eslint-disable-next-line no-underscore-dangle
        !defaultOptions?.[0]?.__isNew__
      ) {
        data.option = [...defaultOptions, ...data.option].filter(
          (val) => !!val.label
        );
      }
      // eslint-disable-next-line no-unused-expressions
      data && setInitialOptions(data?.option);
    }
  };

  const fetchOption = async ({
    pageNo = page,
    value = search,
    first = false,
    pagination = false,
  } = {}) => {
    if (getOptions) {
      if ((page !== 1 && value !== search) || first || pagination) {
        const data = await getOptions({ search: value, page: pageNo });

        if (
          data &&
          _.isArray(defaultOptions) &&
          _.isArray(data.option) &&
          // eslint-disable-next-line no-underscore-dangle
          !defaultOptions?.[0]?.__isNew__
        ) {
          data.option = [...defaultOptions, ...data.option].filter(
            (val) => !!val.label
          );
        }

        if (data) {
          setTotal(data.count || 0);
          const tempOptions = [...data.option];

          if (pageNo !== 1) {
            // Hello
            const uniqueOptions = _.uniqBy(
              [...initialOptions, ...tempOptions],
              'value'
            );
            setInitialOptions(uniqueOptions);
            setOptions(uniqueOptions.slice(0, optionSlice));
          } else {
            setOptions(data.option.slice(0, optionSlice));
          }
        } else {
          setPage(1);
          setSearch('');
          setTotal(0);
          setOptions([]);
        }
        return data;
      }
    }
  };

  const onMenuScrollToBottom = (e: any) => {
    if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight) {
      if (total > options.length) {
        setOptionSlice((prev) => prev + 10);
      }
      if (total > initialOptions.length) {
        setPage(page + 1);
      }
    }
  };

  const onInputChange = debounce((e: string) => {
    setSearch(e);
    fetchOption({ value: e, pageNo: 1, first: true });
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
          render={({ field: { onChange: innerOnChange, value, ref } }) => {
            return (
              <>
                <CreatableSelect
                  ref={ref}
                  {...(isMultiColor && { styles: colorStyles })}
                  classNamePrefix="ip__select__dynamic"
                  key={otherFieldProps.key}
                  value={options.find((c) => c.value === value)}
                  options={_.uniqBy(options, 'label')}
                  {...(isMulti && { isMulti })}
                  isDisabled={disabled}
                  menuPosition={menuPosition}
                  isValidNewOption={(InputValue: string) => {
                    const foundOptionSimilarToInputValue = options?.findIndex(
                      (op) =>
                        op.label?.toString().trim().toLowerCase() ===
                        InputValue?.toString().trim().toLowerCase()
                    );
                    if (foundOptionSimilarToInputValue !== -1) {
                      return false;
                    }
                    if (inputMaxLength) {
                      if (InputValue?.length > inputMaxLength) {
                        return false;
                      }
                      return !!InputValue;
                    }
                    if (isValidNewOption) {
                      return isValidNewOption(InputValue);
                    }
                    return !!InputValue;
                  }}
                  menuPlacement={menuPlacement}
                  menuShouldScrollIntoView={
                    !document.getElementById(`ip__Modal__Body`)
                  }
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
                        innerOnChange(selectedOption as any);
                      }
                    } else if (isMultiValue(selectedOption)) {
                      const tempSelectedOption = selectedOption.map(
                        (obj) => obj.value
                      );
                      innerOnChange(tempSelectedOption as any);
                    } else if (selectedOption) {
                      innerOnChange((selectedOption as any).value);
                    } else {
                      innerOnChange(selectedOption as any);
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
                  }}
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
