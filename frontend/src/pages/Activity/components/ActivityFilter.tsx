// ** import packages ** //
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  MouseEventHandler,
  useRef,
} from 'react';
import {
  DateRangePickerComponent,
  PresetsDirective,
  PresetDirective,
  RangeEventArgs,
} from '@syncfusion/ej2-react-calendars';
import { endOfDay } from 'date-fns';

// * components * //
import Icon from 'components/Icon';
import FormField from 'components/FormField';

// * types * //
import { activityTypeResponse } from '../types/activity.types';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { dateConst } from 'pages/Dashboard/helper/date.helper';
import { useSelector, useDispatch } from 'react-redux';
import {
  getEntityFilterState,
  setEntityFilter,
} from 'redux/slices/tableFilterSlice';
import Dropdown from 'components/Dropdown';
import IconAnimation from 'components/IconAnimation';
import { IconTypeJson } from 'indexDB/indexdb.type';

type ActivityFilterProps = {
  setDropdownState: (key: 'isOpen' | 'isTypeOpen' | 'isStateOpen') => void;
  filterToggleState: {
    isOpen: boolean;
    isTypeOpen: boolean;
    isStateOpen: boolean;
  };
  activityTypeData: activityTypeResponse[];
  setFilterData: Dispatch<
    SetStateAction<{
      activityTypeFilterData: string[];
      activityDateFilterData: {
        start_date: Date | undefined;
        end_date: Date | undefined;
      };
      completed: boolean;
      all: boolean;
    }>
  >;

  refreshTable: () => void;
};

function ActivityFilter(props: ActivityFilterProps) {
  const {
    activityTypeData,
    filterToggleState,
    setDropdownState,
    setFilterData,
    refreshTable,
  } = props;

  // * Date const * //
  const {
    lastEnd,
    lastStart,
    monthEnd,
    monthStart,
    today,
    tomorrow,
    weekEnd,
    weekStart,
    yearEnd,
    yearStart,
  } = dateConst;

  const { isMobileView } = useWindowDimensions();
  const dispatch = useDispatch();

  // ** ref **
  const timePickerRef = useRef<any>(null);

  // * states * //
  const [activityIdArray, pushIdIntoActivityArray] = useState<string[]>([]);
  const [completeActivityFilterState, setCompleteActivityFilterState] =
    useState<string[]>(['all']);

  // ** Hooks ** //
  const selector = useSelector(getEntityFilterState);

  useEffect(() => {
    if (selector.filterData.activityCustomTypeFilter) {
      pushIdIntoActivityArray(selector.filterData.activityCustomTypeFilter);
    }
    if (selector.filterData.activityCustomCompletedTypeFilter) {
      setCompleteActivityFilterState(
        selector.filterData.activityCustomCompletedTypeFilter
      );
    }
  }, [selector]);

  const applyFilter = () => {
    setFilterData((prev) => ({
      ...prev,
      activityTypeFilterData: activityIdArray,
      completed:
        completeActivityFilterState.length !== 2 &&
        completeActivityFilterState.includes('completed'),
      all:
        completeActivityFilterState.length !== 2 &&
        completeActivityFilterState.includes('all'),
    }));

    const state_data: any = {
      entity: 'activityCustomTypeFilter',
      data: activityIdArray,
    };
    dispatch(setEntityFilter(state_data));

    const state_data_state: any = {
      entity: 'activityCustomCompletedTypeFilter',
      data: completeActivityFilterState,
    };
    dispatch(setEntityFilter(state_data_state));

    setDropdownState('isOpen');
    if (isMobileView) {
      refreshTable();
    }
  };

  const clearFilter = () => {
    pushIdIntoActivityArray([]);
    setCompleteActivityFilterState(['all']);
  };

  const dropDownList = (
    close: MouseEventHandler<HTMLButtonElement> | undefined
  ) => {
    return (
      <>
        <div className="ip__form__hasIcon search__box mb-[10px]">
          <input className="ip__input" placeholder="Search" type="search" />
          <Icon className="grayscale" iconType="searchStrokeIcon" />
        </div>
        <div className="max-h-[300px] overflow-y-auto ip__hideScrollbar pt-[6px]">
          <div className="filter-accordian">
            <div className="filter-accordian-header">
              <div className="form__Group">
                <div className="ip__Checkbox">
                  <div className="relative inline-block">
                    <label className="rc__Label inline-block !pl-0 !w-auto !max-w-full before:hidden after:hidden">
                      Type
                    </label>
                  </div>
                </div>
              </div>
              <div
                onClick={() => setDropdownState('isTypeOpen')}
                className={`w-[20px] h-[20px] absolute top-[-2px] right-[-2px] before:content-[''] before:absolute before:top-[8px] before:right-[4px] before:w-[10px] before:h-[2px] before:bg-ipBlack__bgColor after:content-[''] after:absolute after:top-[4px] after:right-[8px] after:w-[2px] after:h-[10px] after:bg-ipBlack__bgColor cursor-pointer ${
                  filterToggleState.isTypeOpen ? 'after:hidden' : ''
                }`}
              />
            </div>

            {filterToggleState.isTypeOpen ? (
              <div className="filter-accordian-body">
                <FormField
                  key={JSON.stringify(activityIdArray)}
                  wrapperClass=""
                  type="checkbox"
                  name="languages"
                  label="Language"
                  options={activityTypeData.map((type) => ({
                    label: type.name,
                    value: type.id,
                    selected: activityIdArray.includes(type.id?.toString()),
                  }))}
                  onChange={(event) => {
                    if ((event.target as HTMLInputElement).checked) {
                      pushIdIntoActivityArray((prev) => [
                        ...prev,
                        event.target.value,
                      ]);
                    } else {
                      pushIdIntoActivityArray((prev) =>
                        prev.filter((val) => val !== event.target.value)
                      );
                    }
                  }}
                />
              </div>
            ) : null}
          </div>

          <div className="filter-accordian">
            <div className="filter-accordian-header">
              <div className="form__Group">
                <div className="ip__Checkbox">
                  <div
                    onClick={() => setDropdownState('isStateOpen')}
                    className="relative inline-block"
                  >
                    <label className="rc__Label inline-block !pl-0 !w-auto !max-w-full before:hidden after:hidden">
                      State
                    </label>
                  </div>
                </div>
              </div>
              <div
                onClick={() => setDropdownState('isStateOpen')}
                className={`w-[20px] h-[20px] absolute top-[-2px] right-[-2px] before:content-[''] before:absolute before:top-[8px] before:right-[4px] before:w-[10px] before:h-[2px] before:bg-black after:content-[''] after:absolute after:top-[4px] after:right-[8px] after:w-[2px] after:h-[10px] after:bg-black cursor-pointer ${
                  filterToggleState.isStateOpen ? 'after:hidden' : ''
                }`}
              />
            </div>

            {filterToggleState.isStateOpen ? (
              <div className="filter-accordian-body">
                <div className="ip__Checkbox ">
                  <input
                    type="checkbox"
                    name="all"
                    id="all"
                    disabled={
                      !completeActivityFilterState.includes('completed') &&
                      completeActivityFilterState.length === 1
                    }
                    checked={completeActivityFilterState.includes('all')}
                    onChange={() => {
                      if (completeActivityFilterState.includes('all')) {
                        setCompleteActivityFilterState((prev) =>
                          prev.filter((val) => val !== 'all')
                        );
                      } else {
                        setCompleteActivityFilterState((prev) => [
                          ...prev,
                          'all',
                        ]);
                      }
                    }}
                  />
                  <label className="rc__Label ">
                    <span className="custom__checkRadio__tick" />
                    Not Done
                  </label>
                </div>

                <div className="ip__Checkbox ">
                  <input
                    type="checkbox"
                    name="completed"
                    id="completed"
                    checked={completeActivityFilterState.includes('completed')}
                    onChange={() => {
                      if (completeActivityFilterState.includes('completed')) {
                        setCompleteActivityFilterState((prev) =>
                          prev.filter((val) => val !== 'completed')
                        );
                        if (completeActivityFilterState.length === 1) {
                          setCompleteActivityFilterState((prev) => [
                            ...prev,
                            'all',
                          ]);
                        }
                      } else {
                        setCompleteActivityFilterState((prev) => [
                          ...prev,
                          'completed',
                        ]);
                      }
                    }}
                  />
                  <label className="rc__Label ">
                    <span className="custom__checkRadio__tick" />
                    Done
                  </label>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex justify-end pt-[16px]">
          <button
            className="bg-secondary__Btn__BGColor text-ipBlack__textColor text-[12px] font-biotif__SemiBold mr-[8px] py-[4px] px-[10px] rounded-[6px] duration-500 hover:bg-ipWhite__bgColor"
            onClick={clearFilter}
          >
            Clear
          </button>
          <button
            className="bg-primaryColor text-[#ffffff] text-[12px] font-biotif__SemiBold py-[4px] px-[10px] rounded-[6px] duration-500 hover:bg-primaryColor__hoverDark"
            onClick={(e) => {
              applyFilter();
              close?.(e);
            }}
          >
            Apply
          </button>
        </div>
      </>
    );
  };

  function getNextWeekEnd() {
    const weekEndDate = new Date(new Date());
    // Calculate End Of the week
    weekEndDate.setDate(new Date().getDate() + (6 - new Date().getDay()));
    return weekEndDate;
  }

  const onOpen = () => {
    const todayDate = timePickerRef.current.presetsItem[0].start;
    const tomorrowDate = timePickerRef.current.presetsItem[1].start;
    const weekDate = timePickerRef.current.presetsItem[2].start;
    const thisMonth = timePickerRef.current.presetsItem[3].start;
    const lastMonth = timePickerRef.current.presetsItem[4].start;
    const lastYear = timePickerRef.current.presetsItem[5].start;

    const newTomorrowDate = new Date(
      new Date(new Date().setHours(0, 0, 0, 0)).setDate(
        new Date().getDate() + 1
      )
    );
    const newWeekDate = new Date(
      new Date(
        new Date().setDate(
          new Date().getDate() - ((new Date().getDay() + 7) % 7)
        )
      ).toDateString()
    );
    const newMonthDate = new Date(
      new Date(new Date().setDate(1)).toDateString()
    );
    const newLastMonthDate = new Date(
      new Date(
        new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)
      ).toDateString()
    );
    const newYearDate = new Date(
      new Date(new Date().getFullYear() - 1, 0, 1).toDateString()
    );

    if (todayDate !== new Date()) {
      timePickerRef.current.presetsItem[0].start = new Date(
        new Date().setHours(0, 0, 0, 0)
      );
      timePickerRef.current.presetsItem[0].end = endOfDay(new Date());
    }
    if (tomorrowDate !== newTomorrowDate) {
      timePickerRef.current.presetsItem[1].start = newTomorrowDate;
      timePickerRef.current.presetsItem[1].end = newTomorrowDate;
    }
    if (weekDate !== newWeekDate) {
      timePickerRef.current.presetsItem[2].start = newWeekDate;
      timePickerRef.current.presetsItem[2].end = getNextWeekEnd();
    }
    if (thisMonth !== newMonthDate) {
      timePickerRef.current.presetsItem[3].start = newMonthDate;
      timePickerRef.current.presetsItem[3].end = new Date(
        new Date(
          new Date(new Date().setMonth(new Date().getMonth() + 1)).setDate(0)
        ).toDateString()
      );
    }
    if (lastMonth !== newLastMonthDate) {
      timePickerRef.current.presetsItem[4].start = newLastMonthDate;
      timePickerRef.current.presetsItem[4].end = new Date(
        new Date(new Date().setDate(0)).toDateString()
      );
    }
    if (lastYear !== newYearDate) {
      timePickerRef.current.presetsItem[5].start = newYearDate;
      timePickerRef.current.presetsItem[5].end = new Date(
        new Date(new Date().getFullYear() - 1, 11, 31).toDateString()
      );
    }
  };

  return (
    <>
      <div className="activity__date__filter relative mr-[10px] ml-[10px] mb-[10px] sm:ml-0 sm:w-[calc(100%_-_54px)] ">
        <DateRangePickerComponent
          strictMode
          startDate={selector.filterData.activityCustomDateFilter?.startDate}
          endDate={selector.filterData.activityCustomDateFilter?.endDate}
          change={(args: RangeEventArgs) => {
            const endDate = new Date(
              new Date(args.endDate || new Date()).setHours(23, 59, 0, 0)
            );
            const state_data: any = {
              entity: 'activityCustomDateFilter',
              data: {
                startDate: args.startDate,
                endDate,
              },
            };

            dispatch(setEntityFilter(state_data));
            setFilterData((prev) => ({
              ...prev,
              activityDateFilterData: {
                start_date: args.startDate,
                end_date: endDate,
              },
            }));
          }}
          open={onOpen}
          ref={timePickerRef}
        >
          <PresetsDirective>
            <PresetDirective label="Today" start={today} end={today} />
            <PresetDirective label="Tomorrow" start={tomorrow} end={tomorrow} />
            <PresetDirective
              label="This Week"
              start={weekStart}
              end={weekEnd}
            />
            <PresetDirective
              label="This Month"
              start={monthStart}
              end={monthEnd}
            />
            <PresetDirective
              label="Last Month"
              start={lastStart}
              end={lastEnd}
            />
            <PresetDirective
              label="Last Year"
              start={yearStart}
              end={yearEnd}
            />
          </PresetsDirective>
        </DateRangePickerComponent>
        <button
          type="button"
          className="activity__date__btn absolute top-0 right-0"
          onClick={() => setDropdownState('isOpen')}
        >
          <Icon
            className="highlighted !w-[44px] !h-[44px] p-[12px] !rounded-[6px]"
            iconType="calendarFilled"
          />
        </button>
      </div>

      <div className="activity__filter__wrapper inline-flex mb-[10px] cursor-pointer">
        <Dropdown
          className="timeline__new__filter"
          placement="bottom-end"
          content={({ close }) => dropDownList(close)}
        >
          <span>
            <IconAnimation
              iconType="filterFilled"
              animationIconType={IconTypeJson.Filter}
              className="highlighted !w-[44px] !h-[44px] p-[12px] "
            />
          </span>
        </Dropdown>
      </div>
    </>
  );
}

export default ActivityFilter;
