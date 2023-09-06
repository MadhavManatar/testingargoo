import Icon from 'components/Icon';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  selectOptionsInterface,
  sortDataInterface,
} from '../types/column.types';
import DropDownBox from './DropDownBox';
import Button from 'components/Button';
import { columnsDataInterface } from 'components/ColumnViewListDropDown';
import _ from 'lodash';

interface PropsInterface {
  columOptions: selectOptionsInterface[];
  sortsData: sortDataInterface[];
  setSortsData: (value: sortDataInterface[]) => void;
  apiColumnsData: columnsDataInterface[];
  setIsDirty?: (value: boolean) => void
}

const sortInitData = {
  column: undefined,
  type: 'asc',
};

const SortSection = (props: PropsInterface) => {
  const { columOptions = [], sortsData, setSortsData, apiColumnsData, setIsDirty } = props;

  // ** States **
  const [filteredColumOptions, setFilteredColumnOptions] =
    useState<selectOptionsInterface[]>();

  // ** Hooks **
  const { control } = useForm();

  useEffect(() => {
    setFilteredColumnOptions(columOptions);
  }, []);

  useEffect(() => {
    setFilteredColumnOptions(
      columOptions?.filter((column) => {
        return !sortsData?.find(
          (data) => data?.column?.fieldName === column.value
        );
      })
    );
  }, [sortsData]);

  const onHandleChangeSelect = (
    value: string,
    filedName: 'column' | 'type',
    index: number
  ) => {
    const columnValue =
      filedName === 'column'
        ? apiColumnsData?.find((item) => item.fieldName === value)
        : value;
        if(setIsDirty) setIsDirty(true)
    setSortsData(
      sortsData?.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            [filedName]: columnValue,
          };
        }
        return item;
      })
    );
  };

  const onHandleAddSort = () => {
    if(setIsDirty) setIsDirty(true)
    setSortsData([
      ...sortsData,
      {
        column: undefined,
        type: 'asc',
      },
    ]);
  };

  const onHandleDeleteSort = (index: number) => {
    if(setIsDirty) setIsDirty(true)
    setSortsData(sortsData?.filter((data, i) => index !== i));
  };

  const onClearSorts = () => {
    if(setIsDirty) setIsDirty(true)
    setSortsData([sortInitData]);
  };

  return (
    <div className="">
      <h3 className="text-darkTextColorSD font-biotif__Medium text-[16px] mb-[8px]">
        Sort By
      </h3>
      <div className="border-[1px] border-dashed border-[#CCC]/90 rounded-[10px] py-[13px] mt-[10px] w-full max-w-full first:mt-0">
        {sortsData.length &&
          sortsData.map((item, index) => (
            <div
              className="filters__row flex flex-wrap items-center mt-[10px] first:mt-0"
              key={index}
            >
              <div className="flex flex-wrap w-[calc(100%_-_45px)] pr-[10px]">
                <div className="px-[15px] w-[calc(100%_-_230px)]">
                  <DropDownBox
                    wrapperClass="mb-0"
                    placeholder="Select Column"
                    type="select"
                    name={`select_column_${index}-${Math.random()}`}
                    id={`select_column_${index}-${Math.random()}`}
                    labelClass="if__label__blue"
                    control={control}
                    options={
                      _.isObject(item?.column) && item?.column?.fieldName
                        ? columOptions
                        : filteredColumOptions
                    }
                    onChange={(selectedOption) =>
                      onHandleChangeSelect(
                        selectedOption.toString(),
                        'column',
                        index
                      )
                    }
                    value={
                      (_.isObject(item?.column) && item?.column?.fieldName) ||
                      ''
                    }
                    menuPosition="fixed"
                    menuPlacement="auto"
                  />
                </div>
                <div className="px-[15px] w-[115px]">
                  <div className="ip__Radio mt-[5px]">
                    <input
                      type="radio"
                      name={`orderType-${index}-${Math.random()}`}
                      value="asc"
                      checked={item.type === 'asc'}
                      onChange={() =>
                        onHandleChangeSelect('asc', 'type', index)
                      }
                    />
                    <label className="rc__Label !text-ipBlack__textColor">
                      Ascending
                    </label>
                  </div>
                </div>
                <div className="px-[15px] w-[115px]">
                  <div className="ip__Radio mt-[5px]">
                    <input
                      type="radio"
                      name={`orderType-${index}-${Math.random()}`}
                      value="desc"
                      checked={item.type === 'desc'}
                      onChange={() =>
                        onHandleChangeSelect('desc', 'type', index)
                      }
                    />
                    <label className="rc__Label !text-ipBlack__textColor">
                      Descending
                    </label>
                  </div>
                </div>
              </div>
              {sortsData?.length === index + 1 ? (
                <div
                  onClick={() =>
                    _.isObject(item?.column) &&
                    item.column?.fieldName &&
                    onHandleAddSort()
                  }
                  className={`relative w-[32px] h-[32px] shrink-0 duration-300 rounded-[5px] before:content-[''] before:w-[11px] before:h-[1px] before:bg-black before:absolute before:top-[50%] before:left-[50%] before:translate-y-[-50%] before:translate-x-[-50%] after:content-[''] after:w-[1px] after:h-[11px] after:bg-black after:absolute after:top-[50%] after:left-[50%] after:translate-y-[-50%] after:translate-x-[-50%] hover:bg-[#f0f0f0]
                cursor-pointer `}
                />
              ) : (
                <Icon
                  className="delete__btn w-[32px] h-[32px] p-[8px] cursor-pointer rounded-[6px] duration-300 hover:bg-[#F1F1F1]"
                  iconType="deleteFilled"
                  onClick={() => onHandleDeleteSort(index)}
                />
              )}
            </div>
          ))}
      </div>
      <span className="flex justify-end mt-5">
        <Button
          type="button"
          onClick={() => onClearSorts()}
          className="i__Button primary__Btn__SD smaller"
        >
          Clear
        </Button>
      </span>
    </div>
  );
};

export default SortSection;
