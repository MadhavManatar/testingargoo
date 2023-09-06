import Icon from 'components/Icon';
import TimelineAllItemFilter from './TimelineAllItemFilter';
import TimelineUserFilter from './TimelineUserFilter';
import TimelineFilterContact from './TimelineFilterContact';
import {
  DateRangePickerComponent,
  PresetDirective,
  PresetsDirective,
  RangeEventArgs,
} from '@syncfusion/ej2-react-calendars';
import { DATE_PRESET } from '../../constant/timelineField.constant';
import { ChangeEvent, useEffect, useState } from 'react';
import { debounce } from 'utils/util';
import { BasicContactFields } from 'pages/Contact/types/contacts.types';
import { TimelineModelName } from 'constant/timeline.constant';
import {
  TimelineFilterInterface,
  getTimelineFilterState,
} from 'redux/slices/timelineFilterSlice';
import { useSelector } from 'react-redux';

export type TimelineFilterPropsType = {
  related_contacts: (BasicContactFields | undefined)[] | undefined;
  modelName: TimelineModelName;
  setFilterState: React.Dispatch<React.SetStateAction<TimelineFilterInterface>>;
  filterState: TimelineFilterInterface;
};

const TimelineFilter = (props: TimelineFilterPropsType) => {
  const { related_contacts, modelName, setFilterState, filterState } = props;
  const filter = useSelector(getTimelineFilterState);
  const [searchVal, setSearchValue] = useState<string>('');
  const excludeRelatedContactModals = [
    TimelineModelName.ACTIVITY,
    TimelineModelName.CONTACT,
  ];

  useEffect(() => {
    setSearchValue(filter.search);
  }, []);

  const applySearch = (e: ChangeEvent<HTMLInputElement>) => {
    const timelineMessagesExcludeKey = [
      'model_name',
      'model_record_id',
      'tagColor',
      'emailFrom',
      'emailTo',
      'emailSubject',
      'emailDescription',
      'fieldName',
      'oldValue',
      'newValue',
    ];

    if (!timelineMessagesExcludeKey.includes(e.target.value)) {
      setFilterState((prev) => ({
        ...prev,
        timelineFilter: { ...prev.timelineFilter, search: e.target.value },
      }));
    }
  };

  return (
    <div className="timeline__action__header flex flex-wrap justify-end mb-[10px] w-[calc(100%_+_80px)] relative left-[-80px] z-[3] sm:mb-0 sm:relative sm:z-[2]">
      <TimelineAllItemFilter
        setFilterState={setFilterState}
        filterState={filterState}
        modelName={modelName}
      />
      <TimelineUserFilter
        modelName={modelName}
        setFilterState={setFilterState}
        filterState={filterState}
      />
      {!excludeRelatedContactModals.includes(modelName) &&
      (related_contacts || [])?.length ? (
        <TimelineFilterContact
          related_contacts={related_contacts}
          modelName={modelName}
          setFilterState={setFilterState}
          filterState={filterState}
        />
      ) : null}

      <div className="ip__form__hasIcon search__box mb-[12px] ml-[10px]">
        <input
          className="ip__input"
          placeholder="Search"
          type="search"
          value={searchVal}
          onChange={(e) => {
            setSearchValue(e.target.value);
            debounce(applySearch)(e);
          }}
        />
        <Icon className="grayscale" iconType="searchStrokeIcon" />
      </div>
      <div className="activity__date__filter timeline__date__filter relative ml-[10px] mb-[10px] sm:ml-0">
        <DateRangePickerComponent
          strictMode
          change={(args: RangeEventArgs) => {
            if (args.startDate && args.endDate) {
              setFilterState((prev) => ({
                ...prev,
                timelineFilter: {
                  ...prev.timelineFilter,
                  ...(args.startDate && {
                    startDate: args.startDate.toISOString(),
                  }),
                  endDate: new Date(
                    new Date(args.endDate || new Date()).setHours(23, 59, 0, 0)
                  ).toISOString(),
                },
              }));
            } else if (filter.startDate && filter.endDate) {
              setFilterState((prev) => ({
                ...prev,
                timelineFilter: {
                  ...prev.timelineFilter,
                  startDate: '',
                  endDate: '',
                },
              }));
            } else {
              setFilterState((prev) => ({
                ...prev,
                timelineFilter: {
                  ...prev.timelineFilter,
                },
              }));
            }
          }}
          endDate={filter.endDate ? new Date(filter.endDate) : undefined}
          startDate={filter.endDate ? new Date(filter.endDate) : undefined}
        >
          <PresetsDirective>
            {DATE_PRESET.map((date, key) => (
              <PresetDirective
                key={`${key}_preset`}
                label={date.label}
                start={date.start}
                end={date.end}
              />
            ))}
          </PresetsDirective>
        </DateRangePickerComponent>
        <button
          type="button"
          className="activity__date__btn absolute top-0 right-0"
        >
          <Icon
            className="highlighted !w-[44px] !h-[44px] p-[12px] !rounded-[6px]"
            iconType="calendarFilled"
          />
        </button>
      </div>
    </div>
  );
};

export default TimelineFilter;
