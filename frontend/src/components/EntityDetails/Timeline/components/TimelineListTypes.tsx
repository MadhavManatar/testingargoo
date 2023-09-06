import { Fragment, useState } from 'react';
import { TimelineMessageType, TimelineMessageValueType } from '../types';
import { fontColorBasedOnBgColor } from 'utils/util';

export const PrimaryFieldType = ({
  messageData,
  isDisablePrimary = false,
}: {
  messageData: TimelineMessageType;
  isDisablePrimary?: boolean;
}) => {
  const { newValue, oldValue } = messageData;
  const messageLength =
    oldValue.length > newValue.length ? oldValue.length : newValue.length;
  return (
    <div className="timeline__contant__wrapper w-[calc(100%_-_41px)] pl-[18px] pt-[9px] sm:w-[calc(100%_-_29px)] sm:pt-[7px] sm:pl-[10px]">
      <div className="flex flex-wrap">
        {!(oldValue.length === 1 && oldValue[0]?.value === 'Blank') && (
          <div className="max-w-[50%] pr-[32px] relative">
            <div className="inner-wrapper h-full">
              {[...Array(messageLength)].map((_value, key) => (
                <Fragment key={`${Number(key)}_Email`}>
                  {oldValue[key] && oldValue[key]?.value !== 'Blank' ? (
                    <div
                      className="text-[16px] font-biotif__Regular text-black tracking-[0.5px]"
                      key={`${Number(key)}_Email`}
                    >
                      {oldValue[key] && oldValue[key]?.value !== 'Blank'
                        ? oldValue[key]?.value
                        : ''}
                    </div>
                  ) : null}
                </Fragment>
              ))}
            </div>
            <span className="timeline__arrow inline-block absolute top-[50%] right-[-10px] translate-y-[-50%] h-[2px] w-[20px] bg-black/50 before:content-[''] before:w-[8px] before:h-[8px] before:absolute before:top-[50%] before:right-0 before:translate-y-[-50%] before:border-r-[2px] before:border-r-black/50 before:border-b-[2px] before:border-b-black/50 before:-rotate-45" />
          </div>
        )}
        <div
          className={`max-w-[50%] ${
            !(oldValue.length === 1 && oldValue[0]?.value === 'Blank') &&
            'pl-[32px]'
          }`}
        >
          <div className="inner-wrapper h-full">
            {[...Array(newValue.length)].map((_value, key) => (
              <div
                className="text-[16px] font-biotif__Regular text-black tracking-[0.5px]"
                key={`${Number(key)}_Phone`}
              >
                {newValue[key] && newValue[key]?.value !== 'Blank'
                  ? newValue[key]?.value
                  : 'Blank Value'}
                {!isDisablePrimary && newValue[key]?.is_primary && (
                  <span className="badge bg-primaryColor text-white text-[13px] py-[3px] px-[10px] ml-[12px]">
                    Primary
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const TagTimeline = ({ data }: { data: TimelineMessageValueType }) => {
  const { oldValue, newValue } = data;
  const [isOldBlank, setIsOldBlank] = useState(true);

  return (
    <div className="timeline__contant__wrapper w-[calc(100%_-_41px)] pl-[18px] pt-[9px] sm:w-[calc(100%_-_29px)] sm:pt-[7px] sm:pl-[10px]">
      <div className="flex flex-wrap items-center">
        {isOldBlank && (
          <>
            <div className="badge__group__wrapper inline-flex flex-wrap max-w-[calc(50%_-_25px)]">
              {oldValue?.map(
                (item: TimelineMessageValueType, indexTag: number) => {
                  if (!(oldValue.length > 1) && item.value === 'Blank')
                    return setIsOldBlank(false);
                  const fontColor = fontColorBasedOnBgColor(
                    item?.tagColor,
                    'white',
                    'black'
                  );
                  return (
                    <span
                      key={`${Number(indexTag)}_newValue`}
                      className="badge square__round text-white mr-[8px] mb-[6px] py-[3px] px-[8px] lg:text-[12px] lg:px-[10px]"
                      style={{
                        backgroundColor: item?.tagColor,
                        color: fontColor,
                      }}
                    >
                      {item?.value}
                    </span>
                  );
                }
              )}
            </div>
            <span className="timeline__arrow inline-block mx-[15px] h-[2px] w-[20px] bg-black/50 relative before:content-[''] before:w-[8px] before:h-[8px] before:absolute before:top-[50%] before:right-0 before:translate-y-[-50%] before:border-r-[2px] before:border-r-black/50 before:border-b-[2px] before:border-b-black/50 before:-rotate-45" />
          </>
        )}
        <div className="badge__group__wrapper inline-flex flex-wrap max-w-[calc(50%_-_25px)]">
          {newValue?.map((item: TimelineMessageValueType, indexTag: number) => (
            <span
              key={`${Number(indexTag)}_oldValue`}
              className="badge square__round text-white mr-[8px] mb-[6px] py-[3px] px-[8px] lg:text-[12px] lg:px-[10px]"
              style={{
                backgroundColor: item?.tagColor,
                color: fontColorBasedOnBgColor(
                  item?.tagColor,
                  'white',
                  'black'
                ),
              }}
            >
              {item?.value}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
