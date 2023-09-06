// ** import packages ** //

import React, {
  useEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
  MouseEventHandler,
  TouchEventHandler,
  TransitionEventHandler,
  WheelEventHandler,
  Children,
} from 'react';

type HourFormatProps = {
  height: number;
  setHourFormat: Dispatch<
    SetStateAction<{
      mount: boolean;
      hourFormat: string;
    }>
  >;
  hourFormat: {
    mount: boolean;
    hourFormat: string;
  };
};
function HourFormat(props: HourFormatProps) {
  const { height, setHourFormat, hourFormat } = props;
  const Hours = [
    {
      number: 'AM',
      translatedValue: (height * 2).toString(),
      selected: false,
    },
    {
      number: 'PM',
      translatedValue: height.toString(),
      selected: false,
    },
  ];

  const [hours, setHours] = useState([
    {
      number: 'AM',
      translatedValue: (height * 2).toString(),
      selected: hourFormat.hourFormat.toUpperCase() === 'AM',
    },
    {
      number: 'PM',
      translatedValue: height.toString(),
      selected: hourFormat.hourFormat.toUpperCase() === 'PM',
    },
  ]);

  const mainListRef = useRef<HTMLDivElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [firstCursorPosition, setFirstCursorPosition] = useState<number>(0);
  const [currentTranslatedValue, setCurrentTranslatedValue] = useState(
    parseInt(
      hours.filter((item) => item.selected === true)[0]?.translatedValue || '0',
      10
    )
  );
  const [startCapture, setStartCapture] = useState<boolean>(false);
  const [showFinalTranslate, setShowFinalTranslate] = useState<boolean>(false);

  useEffect(() => {
    const tempHoursData = [
      {
        number: 'AM',
        translatedValue: (height * 2).toString(),
        selected: hourFormat.hourFormat === 'AM',
      },
      {
        number: 'PM',
        translatedValue: height.toString(),
        selected: hourFormat.hourFormat === 'PM',
      },
    ];
    setHours(tempHoursData);

    setCurrentTranslatedValue(
      parseInt(
        tempHoursData.filter((item) => item.selected === true)[0]
          ?.translatedValue || '0',
        10
      )
    );
  }, []);

  const handleMouseDown: MouseEventHandler = (e) => {
    setShowFinalTranslate(false);
    setFirstCursorPosition(e.clientY);
    setStartCapture(true);
  };

  const handleTouchStart: TouchEventHandler = (e) => {
    setShowFinalTranslate(false);
    setFirstCursorPosition(e.targetTouches[0].clientY);
    setStartCapture(true);
  };

  const handleMouseUpAndLeave = () => {
    setStartCapture(false);
    setCurrentTranslatedValue((prev) => prev + cursorPosition);
    setShowFinalTranslate(true);
  };

  const handleMouseMove: MouseEventHandler = (e) => {
    if (startCapture) {
      setCursorPosition(e.clientY - firstCursorPosition);
    } else {
      setCursorPosition(0);
    }
  };

  const handleTouchMove: TouchEventHandler = (e) => {
    if (startCapture) {
      setCursorPosition(e.targetTouches[0].clientY - firstCursorPosition);
    } else {
      setCursorPosition(0);
    }
  };

  // preview translation
  useEffect(() => {
    if (startCapture && mainListRef.current) {
      mainListRef.current.style.transform = `translateY(${
        currentTranslatedValue + cursorPosition
      }px)`;
    }
  }, [cursorPosition]);

  // final translation here
  useEffect(() => {
    if (showFinalTranslate) {
      let finalValue = Math.round(currentTranslatedValue / height) * height;
      if (finalValue < height) finalValue = height;
      if (finalValue > height * 2) finalValue = height * 2;
      if (mainListRef.current) {
        mainListRef.current.style.transform = `translateY(${finalValue}px)`;
      }
      setCurrentTranslatedValue(finalValue);
      setCursorPosition(0);
    }
  }, [showFinalTranslate]);

  // return to default position after drag end (handleTransitionEnd)
  const handleTransitionEnd: TransitionEventHandler = (e) => {
    if (e.propertyName === 'transform') {
      const selectedValueArray = [
        {
          number: 'AM',
          translatedValue: (height * 2).toString(),
          arrayNumber: 0,
        },
        {
          number: 'PM',
          translatedValue: height.toString(),
          arrayNumber: 1,
        },
      ];
      selectedValueArray.forEach((item) => {
        if (parseInt(item.translatedValue, 10) === currentTranslatedValue) {
          setHourFormat({ mount: true, hourFormat: item.number });
          setHours(() => {
            const newValue = Hours.map((hour) => {
              if (
                hour.number === item.number &&
                parseInt(hour.translatedValue, 10) === currentTranslatedValue
              ) {
                return {
                  ...hour,
                  selected: true,
                };
              }
              return hour;
            });
            return newValue;
          });
        }
      });
    }
  };

  // handle click to select number
  const handleClickToSelect: MouseEventHandler<HTMLDivElement> = (e) => {
    const { dataset } = e.target as HTMLDivElement;
    if (cursorPosition === 0 && dataset?.translatedValue) {
      setCurrentTranslatedValue(parseInt(dataset.translatedValue, 10));
    }
  };

  /** ***************************   handle wheel scroll ************************* */

  const handleWheelScroll: WheelEventHandler = (e) => {
    if (e.deltaY > 0) {
      if (currentTranslatedValue <= height) {
        setCurrentTranslatedValue((prev) => prev + height);
      }
    } else if (currentTranslatedValue >= height * 2) {
      setCurrentTranslatedValue((prev) => prev - height);
    }
  };

  return (
    <div
      className="react-ios-time-picker-hour-format"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUpAndLeave}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUpAndLeave}
      style={{ height: height * 5 }}
      onWheel={handleWheelScroll}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUpAndLeave}
    >
      <div
        ref={mainListRef}
        className={`${
          showFinalTranslate && 'react-ios-time-picker-hour-format-transition'
        }`}
        onTransitionEnd={handleTransitionEnd}
        style={{ transform: `translateY(${currentTranslatedValue}px)` }}
      >
        {Children.toArray(
          hours.map((hourObj) => (
            <div
              className="react-ios-time-picker-cell-hour"
              style={{ height: `${height}px` }}
            >
              <div
                className={`react-ios-time-picker-cell-inner-hour-format 
                     ${
                       hourObj.selected
                         ? ' react-ios-time-picker-cell-inner-hour-format-selected'
                         : ''
                     }
                     `}
                key={hourObj.number}
                onClick={handleClickToSelect}
                data-translated-value={hourObj.translatedValue}
              >
                {hourObj.number}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HourFormat;
