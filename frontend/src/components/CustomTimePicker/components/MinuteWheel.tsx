// ** import packages ** //
import React, {
  useEffect,
  useState,
  useRef,
  Dispatch,
  MouseEventHandler,
  TouchEventHandler,
  WheelEventHandler,
  Children,
} from 'react';

// ** helper ** //
import {
  initialNumbersValue,
  returnSelectedValue,
} from '../helpers/custom-timepicker.helper';

type MinuteWheelProps = {
  height: number;
  value: string;
  setValue: Dispatch<React.SetStateAction<string>>;
};

function MinuteWheel({ height, value, setValue }: MinuteWheelProps) {
  const [hours, setHours] = useState(
    initialNumbersValue(height, 60, parseInt(value.slice(3, 6), 10))
  );

  const mainListRef = useRef<HTMLDivElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [firstCursorPosition, setFirstCursorPosition] = useState<number>(0);
  const [currentTranslatedValue, setCurrentTranslatedValue] = useState<number>(
    parseInt(
      initialNumbersValue(height, 60, parseInt(value.slice(3, 6), 10)).filter(
        (item) => item.number === value.slice(3, 6) && item.selected === true
      )[0]?.translatedValue || `${height}`,
      10
    )
  );

  const [startCapture, setStartCapture] = useState(false);
  const [showFinalTranslate, setShowFinalTranslate] = useState(false);
  // start and end times
  const [dragStartTime, setDragStartTime] = useState<number>(0);
  const [dragEndTime, setDragEndTime] = useState<number>(0);
  // drag type fast or slow
  const [dragType, setDragType] = useState<string>();
  // drag direction
  const [dragDirection, setDragDirection] = useState<string>();

  const handleMouseDown: MouseEventHandler = (e) => {
    setShowFinalTranslate(false);
    setFirstCursorPosition(e.clientY);
    setStartCapture(true);
    setDragStartTime(performance.now());
  };

  const handleTouchStart: TouchEventHandler = (e) => {
    setShowFinalTranslate(false);
    setFirstCursorPosition(e.targetTouches[0].clientY);
    setStartCapture(true);
    setDragStartTime(performance.now());
  };

  const handleMouseUpAndLeave = () => {
    setStartCapture(false);
    setCurrentTranslatedValue((prev) => prev + cursorPosition);
    setShowFinalTranslate(true);
    setDragEndTime(performance.now());
    if (performance.now() - dragStartTime <= 100) {
      setDragType('fast');
    } else {
      setDragType('slow');
    }

    if (cursorPosition < 0) {
      setDragDirection('down');
    } else {
      setDragDirection('up');
    }
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
      if (dragEndTime - dragStartTime <= 100 && cursorPosition !== 0) {
        let currentValue;
        if (dragDirection === 'down') {
          currentValue =
            currentTranslatedValue -
            (120 / (dragEndTime - dragStartTime)) * 100;
        } else if (dragDirection === 'up') {
          currentValue =
            currentTranslatedValue +
            (120 / (dragEndTime - dragStartTime)) * 100;
        }
        if (currentValue) {
          let finalValue = Math.round(currentValue / height) * height;
          if (finalValue < height * -10) finalValue = height * -10;
          if (finalValue > height) finalValue = height;

          if (mainListRef.current) {
            mainListRef.current.style.transform = `translateY(${finalValue}px)`;
          }
          setCurrentTranslatedValue(finalValue);
        }
      }
      if (dragEndTime - dragStartTime > 100 && cursorPosition !== 0) {
        let finalValue = Math.round(currentTranslatedValue / height) * height;
        if (finalValue < height * -10) finalValue = height * -10;
        if (finalValue > height) finalValue = height;
        if (mainListRef.current) {
          mainListRef.current.style.transform = `translateY(${finalValue}px)`;
        }
        setCurrentTranslatedValue(finalValue);
      }
      setCursorPosition(0);
    }
  }, [showFinalTranslate, value]);

  // return to default position after drag end (handleTransitionEnd)
  const handleTransitionEnd = () => {
    returnSelectedValue(height, 60).forEach((item) => {
      if (parseInt(item?.translatedValue, 10) === currentTranslatedValue) {
        setValue((prev) => `${prev.slice(0, 2)}:${item.number}`);
        setHours(() => {
          const newValue = initialNumbersValue(height, 60).map((hour) => {
            if (
              hour.number === item.number &&
              parseInt(hour?.translatedValue, 10) === currentTranslatedValue
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
  };

  // handle click to select number
  const handleClickToSelect: MouseEventHandler<HTMLDivElement> = (e) => {
    const { dataset } = e.target as HTMLDivElement;
    if (cursorPosition === 0 && dataset?.translatedValue) {
      setCurrentTranslatedValue(parseInt(dataset.translatedValue, 10));
    }
  };

  const isFastCondition = showFinalTranslate && dragType === 'fast';
  const isSlowCondition = showFinalTranslate && dragType === 'slow';

  /* ***************************   handle wheel scroll ************************* */

  const to = useRef<any>(null);
  const handleWheelScroll: WheelEventHandler = (e: { deltaY: number }) => {
    if (to.current) {
      clearTimeout(to.current);
    }
    let newValue = 0;
    if (e.deltaY > 0) {
      if (currentTranslatedValue < height) {
        newValue = currentTranslatedValue + 3;
        setCurrentTranslatedValue((prev) => prev + 3);
      }
    } else if (currentTranslatedValue > height * -10) {
      newValue = currentTranslatedValue - 3;
      setCurrentTranslatedValue((prev) => prev - 3);
    }
    to.current = setTimeout(() => {
      if (newValue % 28 !== 0) {
        if (e.deltaY > 0 && currentTranslatedValue <= height) {
          if (newValue < 0) {
            newValue -= newValue % 28;
          } else {
            newValue += 28 - (newValue % 28);
          }
        } else if (currentTranslatedValue >= height * -10)
          if (newValue < 0) {
            newValue -= 28 + (newValue % 28);
          } else {
            newValue -= newValue % 28;
          }
        setCurrentTranslatedValue(newValue);
      }
      clearTimeout(to.current);
    }, 50);
  };

  return (
    <div
      className="react-ios-time-picker-minute"
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
          isFastCondition === true && 'react-ios-time-picker-fast'
        } ${isSlowCondition === true && 'react-ios-time-picker-slow'}`}
        onTransitionEnd={handleTransitionEnd}
        style={{ transform: `translateY(${currentTranslatedValue}px)` }}
      >
        {Children.toArray(
          hours.map((hourObj, index) => (
            <div
              key={index}
              className="react-ios-time-picker-cell-minute"
              style={{ height: `${height}px` }}
            >
              <div
                className={`react-ios-time-picker-cell-inner-minute${
                  hourObj.selected
                    ? ' react-ios-time-picker-cell-inner-selected'
                    : ''
                }${
                  hourObj?.hidden
                    ? ' react-ios-time-picker-cell-inner-hidden'
                    : ''
                }`}
                onClick={handleClickToSelect}
                data-translated-value={hourObj?.translatedValue}
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

export default MinuteWheel;
