import React, { useEffect, useState } from 'react';
import Icon from 'components/Icon';
import {
  FiltersDataInterface,
  selectOptionsInterface,
  selectedFilterNameInterface,
} from '../types/column.types';
import { useForm } from 'react-hook-form';
import {
  FILTER_DATE_OPTIONS,
  FILTER_NUMBER_OPTIONS,
  FILTER_TEXT_OPTIONS,
} from 'constant';
import DropDownBox from './DropDownBox';
import Button from 'components/Button';
import _ from 'lodash';
import ReactDatePicker from 'react-datepicker';
import { reactDatePickerSelectedDate } from 'components/FormField/helper';
import { startOfDay } from 'date-fns';
import FilterColumnSection from './FilterColumnSection';

interface PropsInterface {
  columOptions: selectOptionsInterface[];
  filtersData: FiltersDataInterface;
  setFiltersData: (value: FiltersDataInterface) => void;
  setIsDirty?: (value: boolean) => void;
}

const FilterSection = (props: PropsInterface) => {
  const { columOptions = [], filtersData, setFiltersData, setIsDirty } = props;
  const [columnSectionData, setColumnSectionData] =
    useState<selectedFilterNameInterface>({
      index: 0,
      subIndex: 0,
      isShow: false,
    });
  const [groupColumnOptions, setGroupColumnOptions] = useState<
    Record<string, selectOptionsInterface[]>
  >({});
  // ** Hooks **
  const { control } = useForm();

  useEffect(() => {
    if (!filtersData?.filterType && columOptions?.length > 0) {
      setFiltersData({
        filterType: 'or',
        filter: [
          {
            filterType: 'or',
            filter: [
              {
                columnName: columOptions[0]?.value,
                columnType: columOptions[0]?.type,
                value: '',
                type: 'eq',
              },
              {
                columnName: columOptions[0]?.value,
                columnType: columOptions[0]?.type,
                value: '',
                type: 'eq',
              },
            ],
          },
          {
            filterType: 'or',
            filter: [
              {
                columnName: columOptions[0]?.value,
                columnType: columOptions[0]?.type,
                value: '',
                type: 'eq',
              },
            ],
          },
        ],
      });
    }
  }, [columOptions, filtersData]);

  const onHandleAddFilter = () => {
    if (setIsDirty) setIsDirty(true);
    if (filtersData?.filter && filtersData?.filter?.length > 0) {
      setFiltersData({
        ...filtersData,
        filter: [
          ...filtersData.filter,
          {
            filterType: 'or',
            filter: [
              {
                columnName: columOptions[0]?.value || '',
                columnType: columOptions[0]?.type,
                value: '',
                type: 'eq',
              },
            ],
          },
        ],
      });
    } else {
      setFiltersData({
        filterType: 'or',
        filter: [
          {
            filterType: 'or',
            filter: [
              {
                columnName: columOptions[0]?.value || '',
                columnType: columOptions[0]?.type,
                value: '',
                type: 'eq',
              },
            ],
          },
        ],
      });
    }
  };

  const onHandleChangeSelect = (
    value: string,
    filedName: 'type' | 'columnName' | 'value',
    index: number,
    subIndex: number,
    options?: {
      searchKeys?: string[];
      includeObj?: Record<string, any>;
      foreignKey?: string;
    },
    columnType?: string
  ) => {
    if (setIsDirty) setIsDirty(true);
    setFiltersData({
      ...filtersData,
      filter: filtersData?.filter?.map((filter, fIndex) => {
        if (index === fIndex) {
          const filterData = filter?.filter?.map((item, iIndex) => {
            if (subIndex === iIndex) {
              if (filedName === 'columnName') {
                return {
                  ...item,
                  [filedName]: value,
                  type: 'eq',
                  searchKeys: options?.searchKeys,
                  includeObj: options?.includeObj,
                  foreignKey: options?.foreignKey,
                  columnType: columnType || '',
                };
              }
              return {
                ...item,
                searchKeys: options?.searchKeys,
                includeObj: options?.includeObj,
                foreignKey: options?.foreignKey,
                [filedName]: value,
              };
            }
            return item;
          });
          return {
            ...filter,
            filter: filterData,
          };
        }
        return filter;
      }),
    });
  };

  const onHandleAddItem = (index: number) => {
    if (
      filtersData?.filter &&
      filtersData?.filter?.[index] &&
      filtersData?.filter?.[index]?.filter?.length > 0
    ) {
      const newData = _.cloneDeep(filtersData?.filter[index]);
      newData?.filter.push({
        columnName: columOptions[0]?.value || '',
        columnType: columOptions[0]?.type,
        value: '',
        type: 'eq',
      });
      if (setIsDirty) setIsDirty(true);
      setFiltersData({
        ...filtersData,
        filter: filtersData?.filter?.map((filter, i) => {
          if (index === i) {
            return newData;
          }
          return filter;
        }),
      });
    }
  };

  const onHandleDeleteItem = (index: number, innerIndex: number) => {
    if (
      filtersData?.filter &&
      filtersData?.filter?.[index] &&
      filtersData?.filter?.[index]?.filter?.length > 0
    ) {
      const newData = _.cloneDeep(filtersData?.filter[index]);
      newData?.filter.splice(innerIndex, 1);
      if (setIsDirty) setIsDirty(true);
      setFiltersData({
        ...filtersData,
        filter: filtersData?.filter?.map((filter, i) => {
          if (index === i) {
            return newData;
          }
          return filter;
        }),
      });
    }
  };

  const onHandleChangeOption = (option: 'and' | 'or', index: number) => {
    if (setIsDirty) setIsDirty(true);
    if (index > -1) {
      setFiltersData({
        ...filtersData,
        filter: filtersData.filter?.map((filter, i) => {
          if (index === i) {
            return {
              ...filter,
              filterType: option,
            };
          }
          return filter;
        }),
      });
    } else {
      setFiltersData({
        ...filtersData,
        filterType: option,
      });
    }
  };

  const onClearFilters = () => {
    if (setIsDirty) setIsDirty(true);
    setFiltersData({
      filterType: 'or',
      filter: [
        {
          filterType: 'or',
          filter: [
            {
              columnName: columOptions[0]?.value,
              columnType: columOptions[0]?.type,
              value: '',
              type: 'eq',
            },
            {
              columnName: columOptions[0]?.value,
              columnType: columOptions[0]?.type,
              value: '',
              type: 'eq',
            },
          ],
        },
        {
          filterType: 'or',
          filter: [
            {
              columnName: columOptions[0]?.value,
              columnType: columOptions[0]?.type,
              value: '',
              type: 'eq',
            },
          ],
        },
      ],
    });
  };

  useEffect(() => {
    setGroupColumnOptions(_.groupBy(columOptions, 'model'));
  }, [columOptions]);

  return (
    <>
      <h3 className="relative text-darkTextColorSD font-biotif__Medium text-[16px] mb-[8px]">
        Filter
        {columnSectionData.isShow && (
          <span
            className='absolute top-[50%] translate-y-[-50%] right-0 w-[26px] h-[26px] before:content-[""] before:w-[10px] before:h-[2px] before:bg-sdBlack__bg before:z-[2] before:absolute before:top-[50%] before:left-[50%] before:translate-x-[-50%] before:translate-y-[-50%] hover:bg-btnGrayColor'
            onClick={() => {
              setColumnSectionData({
                ...columnSectionData,
                isShow: false,
              });
            }}
          />
        )}
      </h3>
      {!columnSectionData?.isShow ? (
        <>
          {filtersData?.filter?.map((filter, index) => {
            return (
              <React.Fragment key={index}>
                <div className="border-[1px] border-dashed border-[#CCC]/90 rounded-[10px] p-[13px] mt-[10px] first:mt-0">
                  {filter?.filter?.map((item, i) => (
                    <React.Fragment key={i}>
                      <div
                        key={i}
                        className="filters__row flex flex-wrap items-center mt-[10px] first:mt-0"
                      >
                        <div className="flex flex-wrap mx-[-5px] w-[calc(100%_-_24px)] pr-[10px]">
                          <div className="px-[5px] w-1/3">
                            {/* <DropDownBox
                                wrapperClass="mb-0"
                                placeholder="Select Column"
                                type="select"
                                name={`select_column_${index}-${Math.random()}`}
                                id={`select_column_${index}-${Math.random()}`}
                                labelClass="if__label__blue"
                                control={control}
                                options={columOptions}
                                onChange={(selectedOption) =>
                                  onHandleChangeSelect(
                                    selectedOption.toString(),
                                    'columnName',
                                    index,
                                    i,
                                    columOptions?.find(option => option?.value === selectedOption.toString())?.type
                                  )
                                }
                                value={item?.columnName}
                                menuPosition="fixed"
                                menuPlacement="auto"
                              /> */}
                            <input
                              placeholder="column"
                              className="ip__input"
                              type="text"
                              onClick={() => {
                                setColumnSectionData({
                                  ...columnSectionData,
                                  isShow: true,
                                  index,
                                  subIndex: i,
                                  value: columOptions?.find(
                                    (option) =>
                                      option?.value === item?.columnName
                                  ),
                                });
                                if (setIsDirty) setIsDirty(true);
                              }}
                              defaultValue={
                                columOptions?.find(
                                  (option) => option?.value === item?.columnName
                                )?.label
                              }
                            />
                          </div>
                          <div className="px-[5px] w-1/3">
                            <DropDownBox
                              wrapperClass="mb-0"
                              placeholder="Select Type"
                              type="select"
                              name={`select_type_${index}-${Math.random()}`}
                              id={`select_type_${index}-${Math.random()}`}
                              labelClass="if__label__blue"
                              control={control}
                              options={
                                item?.columnType === 'INTEGER' ||
                                item?.columnType === 'FLOAT'
                                  ? FILTER_NUMBER_OPTIONS
                                  : item?.columnType === 'DATE'
                                  ? FILTER_DATE_OPTIONS
                                  : FILTER_TEXT_OPTIONS
                              }
                              onChange={(selectedOption) => {
                                onHandleChangeSelect(
                                  selectedOption.toString(),
                                  'type',
                                  index,
                                  i,
                                  item
                                );
                              }}
                              value={item?.type}
                              menuPosition="fixed"
                              menuPlacement="auto"
                            />
                          </div>
                          <div className="px-[5px] w-1/3">
                            <div className="form__Group mb-0">
                              <div className="">
                                {item?.columnType === 'DATE' ? (
                                  <ReactDatePicker
                                    isClearable
                                    dateFormat="MM-dd-yyyy"
                                    onChange={(e) => {
                                      onHandleChangeSelect(
                                        startOfDay(
                                          e || new Date()
                                        ).toISOString(),
                                        'value',
                                        index,
                                        i,
                                        item
                                      );
                                    }}
                                    selected={reactDatePickerSelectedDate(
                                      item.value
                                    )}
                                    placeholderText="MM-dd-yyyy"
                                    scrollableYearDropdown
                                    scrollableMonthYearDropdown
                                    dropdownMode="select"
                                  />
                                ) : (
                                  <input
                                    placeholder="Filter..."
                                    className="ip__input"
                                    type="text"
                                    value={item.value}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                      onHandleChangeSelect(
                                        e?.target?.value.toString(),
                                        'value',
                                        index,
                                        i,
                                        item
                                      );
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        {filter?.filter?.length === i + 1 ? (
                          <div
                            onClick={() => {
                              onHandleAddItem(index);
                            }}
                            className="relative cursor-pointer w-[32px] h-[32px] shrink-0 duration-300 rounded-[5px] before:content-[''] before:w-[11px] before:h-[1px] before:bg-black before:absolute before:top-[50%] before:left-[50%] before:translate-y-[-50%] before:translate-x-[-50%] after:content-[''] after:w-[1px] after:h-[11px] after:bg-black after:absolute after:top-[50%] after:left-[50%] after:translate-y-[-50%] after:translate-x-[-50%] hover:bg-[#f0f0f0]"
                          />
                        ) : (
                          <Icon
                            onClick={() => onHandleDeleteItem(index, i)}
                            className="delete__btn w-[32px] h-[32px] p-[8px] cursor-pointer rounded-[6px] duration-300 hover:bg-[#F1F1F1]"
                            iconType="deleteFilled"
                          />
                        )}
                      </div>
                      {filter?.filter?.length !== i + 1 && (
                        <div className="custom__radio__wrapper flex items-center justify-center mt-[10px] first:mt-0">
                          <div className="ip__Radio mr-[15px]">
                            <input
                              type="radio"
                              name={`inner-filter-option-${index}-${Math.random()}`}
                              value="and"
                              checked={filter?.filterType === 'and'}
                              onChange={() =>
                                onHandleChangeOption('and', index)
                              }
                            />
                            <label className="rc__Label">AND</label>
                          </div>
                          <div className="ip__Radio">
                            <input
                              type="radio"
                              name={`inner-filter-option-${index}-${Math.random()}`}
                              value="or"
                              checked={filter?.filterType === 'or'}
                              onChange={() => onHandleChangeOption('or', index)}
                            />
                            <label className="rc__Label">OR</label>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                {filtersData?.filter?.length !== index + 1 && (
                  <div className="custom__radio__wrapper flex items-center justify-center mt-[10px] first:mt-0">
                    <div className="ip__Radio mr-[15px]">
                      <input
                        type="radio"
                        name={`filter-option-${index}-${Math.random()}`}
                        id={`filter-option-${index}-${Math.random()}`}
                        value="and"
                        checked={filtersData?.filterType === 'and'}
                        onChange={() => onHandleChangeOption('and', -1)}
                      />
                      <label className="rc__Label">AND</label>
                    </div>
                    <div className="ip__Radio">
                      <input
                        type="radio"
                        name={`filter-option-${index}-${Math.random()}`}
                        id={`filter-option-${index}-${Math.random()}`}
                        value="or"
                        checked={filtersData?.filterType === 'or'}
                        onChange={() => onHandleChangeOption('or', -1)}
                      />
                      <label className="rc__Label">OR</label>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
          <span className="flex justify-between mt-5">
            <button
              onClick={onHandleAddFilter}
              className="text-[#7467B7] text-[14px] font-biotif__Medium duration-300 mt-[10px] hover:text-[#6054A0]"
            >
              + Add Filter
            </button>
            <Button
              type="button"
              onClick={() => onClearFilters()}
              className="i__Button primary__Btn__SD smaller"
            >
              Clear
            </Button>
          </span>
        </>
      ) : (
        <>
          <FilterColumnSection
            groupByColumnsData={groupColumnOptions}
            selectedColumnData={columnSectionData.value}
            onChangeColumnData={(data: selectOptionsInterface) => {
              onHandleChangeSelect(
                data.value,
                'columnName',
                columnSectionData.index,
                columnSectionData.subIndex,
                data,
                data.type
              );
              setColumnSectionData({
                isShow: false,
                index: 0,
                subIndex: 0,
              });
            }}
          />
        </>
      )}
    </>
  );
};

export default FilterSection;
