// ** import packages ** //
import { format } from 'date-fns-tz';

// ** components ** //
import Icon, { IconTypes } from 'components/Icon';
import Image from 'components/Image';

type DayViewEventTemplateProps = {
  Subject: string;
  StartTime: Date | string;
  EndTime: Date | string;
  ActivityIcon: string;
  IsAllDay?: boolean;
  icon_type: string;
};

export const DayViewEventTemplate = (props: DayViewEventTemplateProps) => {
  const {
    EndTime,
    StartTime,
    Subject,
    ActivityIcon,
    IsAllDay = false,
    icon_type,
  } = props;

  const CustomIconType =
    icon_type === 'Custom' ? (
      <Image
        disableLoader
        imgPath={ActivityIcon}
        serverPath
        imgClassName=" w-[32px] h-[32px] i__Icon rounded-[12px] p-0 w-[14px] h-[14px] relative top-[2px] "
      />
    ) : (
      <></>
    );

  return (
    <>
      <div className="header__title flex flex-wrap items-center ">
        {icon_type === 'Default' ? (
          <div className="inline-block rounded-[4px] bg-primaryColor">
            <Icon
              className="p-[3px] pt-[0px] w-[22px] h-[22px] relative top-[2px] grayscale brightness-[1000]"
              fill="white"
              iconType={ActivityIcon as IconTypes}
            />
          </div>
        ) : (
          CustomIconType
        )}
        <p className="w-[calc(100%_-_25px)] pl-[5px] text-[14px] text-[#000000] font-biotif__Medium whitespace-pre overflow-hidden text-ellipsis">
          {Subject || ''}
        </p>
      </div>

      {!IsAllDay &&
      format(new Date(EndTime), 'hh:mm aa') &&
      format(new Date(StartTime), 'hh:mm aa') ? (
        <div className="activity__calendar__time text-[12px] font-biotif__Regular text-primaryColor">
          <span>{format(new Date(StartTime), 'hh:mm aa')}</span>
          <span className='inline-block ml-[5px] mr-[5px] w-[10px] h-[1px] bg-primaryColor relative top-[-4px] before:content-[""] before:w-[6px] before:h-[6px] before:rotate-[45deg] before:absolute before:top-[-2px] before:left-[3px] before:border-t before:border-t-primaryColor before:border-r before:border-r-primaryColor' />
          <span>{format(new Date(EndTime), 'hh:mm aa')}</span>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
