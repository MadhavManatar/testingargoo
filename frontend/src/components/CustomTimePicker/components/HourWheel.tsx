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
  RefObject,
  SetStateAction,
} from 'react';

// ** helper ** //
import {
  initialNumbersValue,
  returnSelectedValue,
} from '../helpers/custom-timepicker.helper';

type HourWheelProps = {
  height: number;
  value: string;
  setValue: Dispatch<React.SetStateAction<string>>;
  use12Hours: boolean;
};

const HourWheel = (props: HourWheelProps) => {
  const { height, value, setValue, use12Hours } = props;
  const hourLength = use12Hours ? 13 : 24;
  const [hours, setHours] = useState<any>(
    initialNumbersValue(height, hourLength, parseInt(value.slice(0, 2), 10))
  );
  const mainListRef = useRef<HTMLDivElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [firstCursorPosition, setFirstCursorPosition] = useState<number | null>(
    null
  );

  const [currentTranslatedValue, setCurrentTranslatedValue] = useState(
    parseInt(
      initialNumbersValue(
        height,
        hourLength,
        parseInt(value.slice(0, 2), 10)
      ).filter(
        (item) => item.number === value.slice(0, 2) && item.selected === true
      )[0]?.translatedValue || '0',
      10
    )
  );

  const [startCapture, setStartCapture] = useState(false);
  const [showFinalTranslate, setShowFinalTranslate] = useState(false);
  // start and end times
  const [dragStartTime, setDragStartTime] = useState<number | null>(null);
  const [dragEndTime, setDragEndTime] = useState<number | null>(null);

  // drag type fast or slow
  const [dragType, setDragType] = useState<string | null>(null);
  // drag direction
  const [dragDirection, setDragDirection] = useState<string | null>(null);

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
    setCurrentTranslatedValue((prev) => prev + (cursorPosition || 0));
    setShowFinalTranslate(true);
    setDragEndTime(performance.now());
    if (performance.now() - (dragStartTime || 0) <= 100) {
      setDragType('fast');
    } else {
      setDragType('slow');
    }
    if (cursorPosition && cursorPosition < 0) {
      setDragDirection('down');
    } else {
      setDragDirection('up');
    }
  };

  const handleMouseMove: MouseEventHandler = (e) => {
    if (startCapture) {
      setCursorPosition(e.clientY - (firstCursorPosition || 0));
    } else {
      setCursorPosition(0);
    }
  };

  const handleTouchMove: TouchEventHandler = (e) => {
    if (startCapture) {
      setCursorPosition(
        e.targetTouches[0].clientY - (firstCursorPosition || 0)
      );
    } else {
      setCursorPosition(0);
    }
  };

  useEffect(() => {
    if (startCapture && mainListRef.current) {
      mainListRef.current.style.transform = `translateY(${
        currentTranslatedValue + (cursorPosition || 0)
      }px)`;
    }
  }, [cursorPosition]);

  // final translation here
  useEffect(() => {
    if (showFinalTranslate) {
      finalTransitionPartOne({
        currentTranslatedValue,
        cursorPosition,
        dragDirection,
        dragEndTime,
        dragStartTime,
        height,
        mainListRef,
        setCurrentTranslatedValue,
        use12Hours,
      });
      finalTransitionPartTwo({
        currentTranslatedValue,
        cursorPosition,
        dragEndTime,
        dragStartTime,
        height,
        mainListRef,
        setCurrentTranslatedValue,
        use12Hours,
      });
      setCursorPosition(0);
    }
  }, [showFinalTranslate]);

  // return to default position after drag end (handleTransitionEnd)
  const handleTransitionEnd = () => {
    returnSelectedValue(height, hourLength).forEach((item) => {
      if (parseInt(item.translatedValue, 10) === currentTranslatedValue) {
        setValue((prev) => `${item.number}:${prev.slice(3, 6)}`);
        setHours(() => {
          const newValue = initialNumbersValue(height, hourLength).map(
            (hour) => {
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
            }
          );
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

  /** ***************************   handle wheel scroll ************************* */

  const to = useRef<any>(null);
  const handleWheelScroll: WheelEventHandler = (e: { deltaY: number }) => {
    if (to.current) {
      clearTimeout(to.current);
    }
    let newValue = 0;
    if (use12Hours) {
      newValue = handleWheelScrollCommonSetCurrentTranslatedValueFunc({
        currentTranslatedValue,
        deltaY: e.deltaY,
        height,
        setCurrentTranslatedValue,
        valueOne: 2,
        valueTwo: -10,
      });
    } else {
      newValue = handleWheelScrollCommonSetCurrentTranslatedValueFunc({
        currentTranslatedValue,
        deltaY: e.deltaY,
        height,
        setCurrentTranslatedValue,
        valueOne: 7,
        valueTwo: -22,
      });
    }
    to.current = setTimeout(() => {
      if (newValue % 28 !== 0) {
        if (e.deltaY > 0 && currentTranslatedValue <= height) {
          if (newValue < 0) {
            newValue -= newValue % 28;
          } else {
            newValue += 28 - (newValue % 28);
          }
        } else if (currentTranslatedValue >= height * -22)
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
      className={`react-ios-time-picker-hour ${
        use12Hours && 'react-ios-time-picker-hour-12hour-format'
      }`}
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
          hours.map((hourObj: any) => (
            <div
              className="react-ios-time-picker-cell-hour"
              style={{ height: `${height}px` }}
            >
              <div
                className={`react-ios-time-picker-cell-inner-hour${
                  hourObj.selected
                    ? ' react-ios-time-picker-cell-inner-selected'
                    : ''
                }${
                  hourObj?.hidden
                    ? ' react-ios-time-picker-cell-inner-hidden'
                    : ''
                }`}
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
};

export default HourWheel;

type FinalTransitionPartOnePropsType = {
  dragDirection: string | null;
} & FinalTransitionPartTwoPropsType;
const finalTransitionPartOne = (args: FinalTransitionPartOnePropsType) => {
  const {
    currentTranslatedValue,
    cursorPosition,
    dragEndTime,
    dragStartTime,
    height,
    mainListRef,
    setCurrentTranslatedValue,
    use12Hours,
    dragDirection,
  } = args;
  if (
    (dragEndTime || 0) - (dragStartTime || 0) <= 100 &&
    cursorPosition !== 0
  ) {
    let currentValue;
    if (dragDirection === 'down') {
      currentValue =
        currentTranslatedValue -
        (120 / ((dragEndTime || 0) - (dragStartTime || 0))) * 100;
    } else if (dragDirection === 'up') {
      currentValue =
        currentTranslatedValue +
        (120 / ((dragEndTime || 0) - (dragStartTime || 0))) * 100;
    }
    const finalValue = Math.round((currentValue || 0) / height) * height;
    commonTransitionFunctionChunk({
      finalValueFromParent: finalValue,
      height,
      mainListRef,
      setCurrentTranslatedValue,
      use12Hours,
    });
  }
};

type FinalTransitionPartTwoPropsType = {
  use12Hours: boolean;
  dragEndTime: number | null;
  dragStartTime: number | null;
  cursorPosition: number | null;
  height: number;
  currentTranslatedValue: number;
  setCurrentTranslatedValue: Dispatch<SetStateAction<number>>;
  mainListRef: RefObject<HTMLDivElement>;
};
const finalTransitionPartTwo = (args: FinalTransitionPartTwoPropsType) => {
  const {
    use12Hours,
    cursorPosition,
    dragEndTime,
    dragStartTime,
    currentTranslatedValue,
    height,
    setCurrentTranslatedValue,
    mainListRef,
  } = args;
  if ((dragEndTime || 0) - (dragStartTime || 0) > 100 && cursorPosition !== 0) {
    const finalValue = Math.round(currentTranslatedValue / height) * height;
    commonTransitionFunctionChunk({
      finalValueFromParent: finalValue,
      height,
      mainListRef,
      setCurrentTranslatedValue,
      use12Hours,
    });
  }
};

type CommonTransitionFunctionChunkPropsType = {
  finalValueFromParent: number;
  height: number;
  mainListRef: RefObject<HTMLDivElement>;
  setCurrentTranslatedValue: Dispatch<SetStateAction<number>>;
  use12Hours: boolean;
};

const commonTransitionFunctionChunk = (
  args: CommonTransitionFunctionChunkPropsType
) => {
  const {
    finalValueFromParent,
    height,
    mainListRef,
    setCurrentTranslatedValue,
    use12Hours,
  } = args;
  let finalValue = finalValueFromParent;
  if (use12Hours) {
    if (finalValue < height * -10) finalValue = height * -10;
    if (finalValue > height) finalValue = height;
  } else {
    if (finalValue < height * -22) finalValue = height * -22;
    if (finalValue > height) finalValue = height;
  }
  if (mainListRef.current) {
    mainListRef.current.style.transform = `translateY(${finalValue}px)`;
  }
  setCurrentTranslatedValue(finalValue);
};

type HandleWheelScrollCommonSetCurrentTranslatedValueFuncPropsType = {
  height: number;
  currentTranslatedValue: number;
  setCurrentTranslatedValue: Dispatch<SetStateAction<number>>;
  deltaY: number;
  valueOne: number;
  valueTwo: number;
};
const handleWheelScrollCommonSetCurrentTranslatedValueFunc = (
  args: HandleWheelScrollCommonSetCurrentTranslatedValueFuncPropsType
) => {
  const {
    currentTranslatedValue,
    height,
    setCurrentTranslatedValue,
    deltaY,
    valueOne,
    valueTwo,
  } = args;
  let newValue = 0;
  if (deltaY > 0) {
    if (currentTranslatedValue < height) {
      // value of height is 28
      newValue = currentTranslatedValue + valueOne;
      setCurrentTranslatedValue((prev) => prev + valueOne);
    }
  } else if (currentTranslatedValue > height * valueTwo) {
    newValue = currentTranslatedValue - valueOne;
    setCurrentTranslatedValue((prev) => prev - valueOne);
  }
  return newValue;
};
