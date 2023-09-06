// ** import packages ** //
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { format } from 'date-fns';
import MaskedInput from 'react-text-mask';

// ** components ** //
import TimePickerSelection from './TimePickerSelection';
import Dropdown from 'components/Dropdown';
import useWindowDimensions from 'hooks/useWindowDimensions';

type TimePickerProps = {
  value?: string;
  pickerDefaultValue?: string;
  cancelButtonText?: string;
  saveButtonText?: string;
  onChange?: (value: string) => false | undefined | string;
  onSave?: () => void;
  onCancel?: () => void;
  onAmPmChange?: () => void;
  controllers?: boolean;
  separator?: boolean;
  use12Hours?: boolean;
  setAnyTimeEnable?: Dispatch<SetStateAction<boolean>>;
  anyTimeEnable?: boolean;
};

const TimePicker = (props: TimePickerProps) => {
  const {
    value: initialValue = '',
    pickerDefaultValue = '10:00',
    onChange,
    onSave,
    onCancel,
    cancelButtonText = 'Cancel',
    saveButtonText = 'Save',
    controllers = true,
    separator = true,
    use12Hours = false,
    onAmPmChange,
    setAnyTimeEnable,
    anyTimeEnable,
  } = props;

  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  let finalValue = inputValue;

  if (initialValue === null && use12Hours) {
    finalValue = `${pickerDefaultValue} AM`;
  } else if (initialValue === null && !use12Hours) {
    finalValue = pickerDefaultValue;
  }

  const params = {
    onChange,
    height: 28,
    onSave,
    onCancel,
    cancelButtonText,
    saveButtonText,
    controllers,
    setInputValue,
    separator,
    use12Hours,
    onAmPmChange,
    initialValue: finalValue || format(new Date(), 'hh:mm aa'),
    pickerDefaultValue,
  };

  const { isMobileView } = useWindowDimensions();
  const timeFieldMask = [
    /[0-1]/,
    inputValue[0] === '1' ? /[0-2]/ : /[1-9]/,
    ':',
    /[0-5]/,
    /[0-9]/,
    ' ',
    /['apAP']/,
    /['mM']/,
  ];

  const DropdownItem = useCallback(
    ({ close, isOpen: newIsOpen }: { close: () => void; isOpen?: boolean }) => {
      useEffect(() => {
        const TimePickerOpenTarget = document.getElementsByTagName('html');
        if (newIsOpen) {
          const element = document.querySelectorAll('.tippy__timePicker');
          element.forEach((elem) => {
            elem.parentElement?.classList.add('tippy__timePicker__root');
          });
          // document.body.classList.add('timePicker__open');
          // TimePickerOpenTarget[0]?.classList.add('timePicker__open');
        } else {
          // if (!isMobileView) {
          // const oldElement = document.querySelectorAll('.tippy__timePicker');
          // oldElement.forEach((elem) => {
          //   elem.parentElement?.classList.remove('tippy__timePicker__root');
          // });
          // }

          // document.body.classList.remove('timePicker__open');
          TimePickerOpenTarget[0]?.classList.remove('timePicker__open');
        }
      }, [newIsOpen]);

      return (
        <div
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <TimePickerSelection
            anyTimeEnable={anyTimeEnable}
            setAnyTimeEnable={setAnyTimeEnable}
            key={`${initialValue}_${newIsOpen}`}
            close={close}
            {...params}
            separator={false}
          />
        </div>
      );
    },
    [anyTimeEnable]
  );

  return (
    <>
      <Dropdown
        className="tippy__timePicker"
        placement="bottom-start"
        content={DropdownItem}
        zIndex={9}
        dynamicTippyProps={
          isMobileView
            ? {
                delay: 1000,
                duration: 1000,
                animation: true,
              }
            : undefined
        }
      >
        <button type="button">
          <MaskedInput
            readOnly={isMobileView}
            name="schedule_date"
            placeholder="EX. 10:10 AM"
            className="ip__input"
            guide={false}
            maxLength={8}
            value={inputValue?.toUpperCase()}
            mask={timeFieldMask}
            showMask
            onChange={(e) => {
              if (inputValue !== e.target.value) {
                onChange?.(e.target.value);
                setInputValue(e.target.value);
              }
              e.stopPropagation();
            }}
            autoComplete="off"
          />
        </button>
      </Dropdown>
    </>
  );
};

export default TimePicker;
