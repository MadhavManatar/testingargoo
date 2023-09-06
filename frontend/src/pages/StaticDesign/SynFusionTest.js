import { createRoot } from 'react-dom/client';
import './index.css';
import * as React from 'react';
import { useEffect } from 'react';
import { updateSampleSection } from './sample-base';
import {
  DateRangePickerComponent,
  PresetsDirective,
  PresetDirective,
} from '@syncfusion/ej2-react-calendars';

const Presets = () => {
  useEffect(() => {
    updateSampleSection();
  }, []);
  let timpickerInstance;
  const weekStart = new Date(
    new Date(
      new Date().setDate(new Date().getDate() - ((new Date().getDay() + 7) % 7))
    ).toDateString()
  );
  const weekEnd = new Date(
    new Date(
      new Date().setDate(
        new Date(
          new Date().setDate(
            new Date().getDate() - ((new Date().getDay() + 7) % 7)
          )
        ).getDate() + 6
      )
    ).toDateString()
  );
  const monthStart = new Date(new Date(new Date().setDate(1)).toDateString());
  const monthEnd = new Date(
    new Date(
      new Date(new Date().setMonth(new Date().getMonth() + 1)).setDate(0)
    ).toDateString()
  );
  const lastStart = new Date(
    new Date(
      new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)
    ).toDateString()
  );
  const lastEnd = new Date(new Date(new Date().setDate(0)).toDateString());
  const yearStart = new Date(
    new Date(new Date().getFullYear() - 1, 0, 1).toDateString()
  );
  const yearEnd = new Date(
    new Date(new Date().getFullYear() - 1, 11, 31).toDateString()
  );
  const todayStart = new Date(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    )
  );
  const todayEnd = new Date(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    )
  );
  const onOpen = (args) => {
    const buttonElement = args.popup.element.querySelector('#Today_1');
    buttonElement.addEventListener('click', handleClick);
  };

  const handleClick = () => {
    timpickerInstance.startDate = new Date();
    timpickerInstance.endDate = new Date();
  };

  return (
    <div className="control-pane">
      <div className="control-section">
        <div className="datepicker-control-section">
          <DateRangePickerComponent
            placeholder="Select a range"
            ref={(timepicker) => (timpickerInstance = timepicker)}
            open={onOpen}
          >
            <PresetsDirective>
              <PresetDirective
                label="Today"
                start={todayStart}
                end={todayEnd}
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
        </div>
      </div>
    </div>
  );
};
export default Presets;

const root = createRoot(document.getElementById('sample'));
root.render(<Presets />);
