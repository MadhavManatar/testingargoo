import {
  DateRangePickerComponent,
  PresetDirective,
  PresetsDirective,
  RangeEventArgs,
} from '@syncfusion/ej2-react-calendars';
import Icon from 'components/Icon';
import { useRef } from 'react';
import { dateConst } from '../helper/date.helper';

const DatePickerDashboard = ({
  setFilterData,
  onDateChange,
}: {
  setFilterData: React.Dispatch<
    React.SetStateAction<{
      start_date: string;
      end_date: string;
      activity_type?: number[] | undefined;
    }>
  >;
  onDateChange: () => void;
}) => {
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
    endToday,
    endTomorrow,
  } = dateConst;

  const datePickerInstance = useRef<DateRangePickerComponent>(null);

  return (
    <>
      <div className="dashboard__upcoming__act__date__filter inline-block relative mb-[10px] ml-[10px]">
        <DateRangePickerComponent
          ref={datePickerInstance}
          change={(args: RangeEventArgs) => {
            if (args?.startDate && args?.endDate) {
              setFilterData({
                start_date: args?.startDate.toISOString(),
                end_date: new Date(
                  new Date(args?.endDate).setHours(23, 59, 0, 0)
                ).toISOString(),
              });
              onDateChange();
            }
          }}
          startDate={weekStart}
          endDate={weekEnd}
        >
          <PresetsDirective>
            <PresetDirective label="Today" start={today} end={endToday} />
            <PresetDirective
              label="Tomorrow"
              start={tomorrow}
              end={endTomorrow}
            />
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
        <Icon
          className="w-full h-full absolute top-0 left-0 rounded-[6px] bg-[#E6E6E6] p-[7px] cursor-pointer"
          iconType="calendarFilled"
        />
      </div>
    </>
  );
};

export default DatePickerDashboard;
