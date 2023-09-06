import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { selectOptionsInterface } from '../types/column.types';
import {
  ModuleNames,
  initialColumnDropdownState,
} from 'constant/permissions.constant';

interface PropsInterface {
  groupByColumnsData: Record<string, selectOptionsInterface[]>;
  onChangeColumnData: (data: selectOptionsInterface) => void;
  selectedColumnData?: selectOptionsInterface;
}

const FilterColumnSection = (props: PropsInterface) => {
  const { groupByColumnsData, onChangeColumnData, selectedColumnData } = props;
  const [columnDropdownState, setColumnDropdownState] = useState<{
    [value in ModuleNames]?: boolean;
  }>(initialColumnDropdownState);

  useEffect(() => {
    if (selectedColumnData) {
      setColumnDropdownState({
        ...columnDropdownState,
        [selectedColumnData.model]: true,
      });
    }
  }, [selectedColumnData]);

  return (
    <>
      <div className="flex flex-wrap px-[20px] h-[calc(100dvh_-_345px)] overflow-y-auto ip__FancyScroll pb-[10px]">
        <div
          className="columns__options w-1/3 pr-[30px]"
          style={{ width: '100%' }}
        >
          <div className="checkbox__wrapper">
            {Object.keys(groupByColumnsData)
              ?.sort()
              ?.map((key, index) => {
                return (
                  <ModuleWiseColumnOptionDropdown
                    key={`ModuleWiseColumnOptionDropdown_${index}`}
                    columnsData={groupByColumnsData?.[key as string]}
                    modelName={key as ModuleNames}
                    {...{
                      columnDropdownState,
                      setColumnDropdownState,
                      onChangeColumnData,
                      selectedColumnData,
                    }}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

const ModuleWiseColumnOptionDropdown = (props: {
  columnsData: selectOptionsInterface[];
  modelName: ModuleNames;
  columnDropdownState: { [value in ModuleNames]?: boolean };
  setColumnDropdownState: Dispatch<
    SetStateAction<{
      [value in ModuleNames]?: boolean;
    }>
  >;
  onChangeColumnData: (data: selectOptionsInterface) => void;
  selectedColumnData?: selectOptionsInterface;
}) => {
  const {
    columnsData,
    modelName,
    columnDropdownState,
    setColumnDropdownState,
    onChangeColumnData,
    selectedColumnData,
  } = props;

  const alias = (val: string) => {
    switch (val) {
      case ModuleNames.LEAD:
        return 'Lead';
      case ModuleNames.DEAL:
        return 'Deal';
      case ModuleNames.ACCOUNT:
        return 'Account';
      case ModuleNames.CONTACT:
        return 'Contacts';
      case ModuleNames.ACTIVITY:
        return 'Activity';
      case ModuleNames.EMAIL:
        return 'Email';
      default:
        return 'Other';
    }
  };
  const sortedData = () => {
    return columnsData?.sort((a, b) => {
      return a.value.localeCompare(b.value);
    });
  };
  return (
    <div key={`${modelName}_div`}>
      <div
        className={`w-full cursor-pointer duration-300 rounded-[7px] text-[16px] font-biotif__Medium text-primaryColorSD py-[9px] px-[13px] whitespace-pre overflow-hidden text-ellipsis relative before:absolute before:top-[calc(50%_-_1px)] before:translate-y-[-50%] before:right-[13px] before:rotate-[-45deg] inline-block before:w-[8px] before:h-[8px] before:border-l-[2px]  before:border-l-primaryColorSD before:border-b-[2px] before:border-b-primaryColorSD hover:bg-btnGrayColor ${
          columnDropdownState?.[modelName]
            ? 'bg-primaryColorSD before:!rotate-[-225deg] before:!top-[50%_+_1px] before:!border-l-[#ffffff] before:!border-b-[#ffffff] !text-[#ffffff] hover:bg-primaryColorSD hover:before:!border-l-[#ffffff] hover:before:!border-b-[#ffffff] hover:!text-[#ffffff]'
            : ''
        }`}
        onClick={() => {
          setColumnDropdownState((prev) => ({
            ...initialColumnDropdownState,
            [modelName]: !prev?.[modelName],
          }));
        }}
      >
        {alias(modelName)}
      </div>
      {columnDropdownState?.[modelName] ? (
        <div className="checkbox__wrapper">
          {sortedData()?.map((item, index) => {
            return (
              <div className="ip__Checkbox" key={item?.label}>
                <input
                  className="ip__input rounded-[8px] py-[8]"
                  name={`${item?.label}-${index}`}
                  type="checkbox"
                  checked={selectedColumnData?.value === item.value}
                  onChange={() => {
                    onChangeColumnData(item);
                  }}
                />
                <label className="rc__Label inline-block !w-auto !max-w-full">
                  {item?.label}
                </label>
              </div>
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
export default FilterColumnSection;
