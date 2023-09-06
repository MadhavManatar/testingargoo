// ** import packages ** //
import React, { useEffect, useState } from 'react';
import HourFormat from './HourFormat';
import HourWheel from './HourWheel';
import MinuteWheel from './MinuteWheel';

type TimePickerSelectionProps = {
  pickerDefaultValue: string;
  initialValue: string;
  onChange?: (value: string) => void;
  height: number;
  onSave?: (value: string) => void;
  onCancel?: () => void;
  cancelButtonText: string;
  saveButtonText: string;
  controllers: boolean;
  setInputValue: (value: string) => void;
  use12Hours: boolean;
  onAmPmChange?: (value: any) => void;
  close: () => void;
  separator: boolean;
  setAnyTimeEnable?: React.Dispatch<React.SetStateAction<boolean>>;
  anyTimeEnable?: boolean;
};

function TimePickerSelection(props: TimePickerSelectionProps) {
  const {
    pickerDefaultValue,
    initialValue,
    onChange,
    height,
    onSave,
    onCancel,
    cancelButtonText,
    saveButtonText,
    controllers,
    setInputValue,
    separator,
    use12Hours,
    onAmPmChange,
    close,
    setAnyTimeEnable,
    anyTimeEnable,
  } = props;

  const initialTimeValue = use12Hours ? initialValue.slice(0, 5) : initialValue;
  const [value, setValue] = useState(
    initialValue === null ? pickerDefaultValue : initialTimeValue
  );
  const [hourFormat, setHourFormat] = useState({
    mount: false,
    hourFormat: initialValue.slice(6, 8),
  });

  useEffect(() => {
    if (controllers === false) {
      const finalSelectedValue = use12Hours
        ? `${value} ${hourFormat.hourFormat}`
        : value;
      setInputValue(finalSelectedValue);
      onChange?.(finalSelectedValue);
    }
  }, [value]);

  useEffect(() => {
    if (hourFormat.mount) {
      onAmPmChange?.(hourFormat.hourFormat);
    }
  }, [hourFormat]);
  const params = {
    height,
    value,
    setValue,
    controllers,
    use12Hours,
    onAmPmChange,
    setHourFormat,
    hourFormat,
  };

  const handleSave = ({
    time,
    meridiem,
  }: {
    time?: string;
    meridiem?: string;
  }) => {
    const finalSelectedValue = use12Hours
      ? `${time || value} ${meridiem || hourFormat.hourFormat}`
      : value;
    //   ? `${value} ${hourFormat.hourFormat}`
    setInputValue(finalSelectedValue);
    onChange?.(finalSelectedValue);
    onSave?.(finalSelectedValue);
    close?.();
  };
  const handleCancel = () => {
    close?.();
    onCancel?.();
  };

  return (
    <div className="react-ios-time-picker react-ios-time-picker-transition">
      <div
        className={`${
          anyTimeEnable === undefined ? '!hidden' : ''
        }  anytime__box w-full py-[8px] px-[10px] flex flex-wrap items-center border border-greyScreen__BorderColor rounded-[10px]`}
      >
        <span className="text-ipBlack__textColor text-[14px] font-biotif__Medium block w-[calc(100%_-_43px)] pr-[10px]">
          Any time
        </span>
        <span className="custom__checkbox">
          <input
            type="checkbox"
            name="any time"
            id="anytime"
            checked={anyTimeEnable}
            onChange={(e) => {
              if (e.target.checked && anyTimeEnable) {
                onChange?.('');
              }
              if (setAnyTimeEnable) {
                setAnyTimeEnable(e.target.checked);
              }
            }}
          />
          <div className="rc__Label" />
        </span>
      </div>
      <div
        className={`react-ios-time-picker-container pt-[14px] ${
          anyTimeEnable ? 'pointer-events-none opacity-40' : 'active'
        } `}
      >
        <div
          className="react-ios-time-picker-selected-overlay"
          style={{
            top: `${height * 2 + 13}px`,
            height: `${height}px`,
          }}
        />

        <HourWheel {...params} />
        {separator && <div className="react-ios-time-picker-colon">:</div>}
        <MinuteWheel {...params} />
        {use12Hours && <HourFormat {...params} />}
      </div>
      {controllers && !anyTimeEnable && (
        <div className="w-full flex flex-wrap items-center justify-center pb-[10px] pt-[15px]">
          <button
            type="button"
            className="i__Button secondary__Btn smaller !py-[8px] px-[15px] min-w-[90px]"
            onClick={handleCancel}
          >
            {cancelButtonText}
          </button>
          <button
            type="button"
            className="i__Button primary__Btn smaller !py-[8px] px-[15px] min-w-[90px] ml-[8px]"
            onClick={() => handleSave({})}
          >
            {saveButtonText}
          </button>
        </div>
      )}
      <div
        className={`${
          anyTimeEnable ? 'pointer-events-none opacity-50' : ''
        } flex justify-center w-full pt-[10px]`}
      >
        <div className="mx-[-5px] w-full flex flex-wrap">
          <div className="px-[5px] w-1/3">
            <div
              className="cursor-pointer bg-ipBlue__transparentBG rounded-[10px] py-[7px] px-[14px] sm:px-[5px]"
              onMouseDown={() => {
                setValue('09:00');
                setHourFormat({ mount: true, hourFormat: 'AM' });
                handleSave({ time: '09:00', meridiem: 'AM' });
              }}
            >
              <p className="text-[14px] leading-[16px] text-center font-biotif__SemiBold text-ip__Blue mb-[2px]">
                Morning
              </p>
              <p className="text-[12px] leading-[14px] text-center font-biotif__Regular text-ip__Blue">
                9:00 AM
              </p>
            </div>
          </div>
          <div className="px-[5px] w-1/3">
            <div
              className="cursor-pointer bg-ipBlue__transparentBG rounded-[10px] py-[7px] px-[14px] sm:px-[5px]"
              onMouseDown={() => {
                setValue('01:00');
                setHourFormat({ mount: true, hourFormat: 'PM' });
                handleSave({ time: '01:00', meridiem: 'PM' });
              }}
            >
              <p className="text-[14px] leading-[16px] text-center font-biotif__SemiBold text-ip__Blue mb-[2px]">
                AfterNoon
              </p>
              <p className="text-[12px] leading-[14px] text-center font-biotif__Regular text-ip__Blue">
                1:00 PM
              </p>
            </div>
          </div>
          <div className="px-[5px] w-1/3">
            <div
              className="cursor-pointer bg-ipBlue__transparentBG rounded-[10px] py-[7px] px-[14px] sm:px-[5px]"
              onMouseDown={() => {
                setValue('08:00');
                setHourFormat({ mount: true, hourFormat: 'PM' });
                handleSave({ time: '08:00', meridiem: 'PM' });
              }}
            >
              <p className="text-[14px] leading-[16px] text-center font-biotif__SemiBold text-ip__Blue mb-[2px]">
                Evening
              </p>
              <p className="text-[12px] leading-[14px] text-center font-biotif__Regular text-ip__Blue">
                8:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimePickerSelection;
