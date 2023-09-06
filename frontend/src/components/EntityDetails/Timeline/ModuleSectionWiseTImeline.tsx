import { ModuleWiseTimeLine } from './ModuleWiseTimeLine';
import {
  renderIconBasedOnModuleAndAction,
  renderIconBasedOnModuleAndActionAnimation,
  timelineSectionExtract,
} from './helper';
import { TimelineOpenActivityModalType, TimelineType } from './types';
import { TimelineModelName } from 'constant/timeline.constant';
import IconAnimation from 'components/IconAnimation';

type Props = {
  histories: TimelineType[];
  modelName: TimelineModelName;
  setHistoryData: React.Dispatch<React.SetStateAction<TimelineType[]>>;
  setOpenActivityModal: React.Dispatch<
    React.SetStateAction<TimelineOpenActivityModalType>
  >;
  openActivityModal: TimelineOpenActivityModalType;
  closeModal: (data?: any) => void;
  setPermissionArray: React.Dispatch<
    React.SetStateAction<{
      data: {
        label: string;
        onClick: () => void;
      }[];
      timelineId: number | null;
    }>
  >;
  permissionArray: {
    data: {
      label: string;
      onClick: () => void;
    }[];
    timelineId: number | null;
  };
};

const displayTitle = (name: string) => {
  name = ((name.split('-') || [])?.[0] || '').replace(/^_+/, '');
  const titles = {
    info: 'info',
    activities: 'activities',
    notes: 'note',
    documents: 'document',
    emails: 'email',
  };
  return titles[name as keyof typeof titles];
};

const ModuleSectionWiseTimeline = (props: Props) => {
  const {
    histories,
    modelName,
    setHistoryData,
    setOpenActivityModal,
    openActivityModal,
    closeModal,
    setPermissionArray,
    permissionArray,
  } = props;
  const timelineSection = timelineSectionExtract(histories);

  return (
    <>
      {Object.keys(timelineSection).map((name: string, index: number) => (
        <div
          className="timelineDay__box w-[calc(100%_-_57px)] ml-auto mb-[25px] sm:p-[15px] sm:pb-[7px] sm:mb-[15px] relative before:content-[''] before:absolute before:top-[20px] before:left-[-38px] before:h-[calc(100%_+_42px)] before:w-[1px] before:border-dashed before:border-l-[2px] before:border-[#CCC]/50"
          key={`${Number(index)}_section`}
        >
          <IconAnimation
            iconType={renderIconBasedOnModuleAndAction({ module: name })}
            animationIconType={renderIconBasedOnModuleAndActionAnimation({
              module: name,
            })}
            className="timelineBox__icon w-[44px] h-[44px] bg-[#F2F6F9] rounded-[6px] !p-[7px] absolute top-0 left-[-59px] sm:left-[-53px] sm:top-[10px] sm:hidden xsm:w-[29px] xsm:h-[29px] xsm:!p-[6px] xsm:left-[-37px] xsm:top-[9px]"
          />
          <div className="flex flex-wrap items-center bg-[#ECF2F6] rounded-[12px] py-[10px] px-[15px] mb-[14px] sm:mb-[15px] xsm:py-[4px] xsm:px-[8px] xsm:rounded-[6px]">
            <span className="text text-[16px] font-biotif__Medium text-ipBlack__textColor w-[calc(100%_-_24px)] capitalize xsm:text-[14px]">
              {displayTitle(name)}
            </span>
          </div>
          {timelineSection[name].map((history, index1) => {
            return (
              <ModuleWiseTimeLine
                closeModal={closeModal}
                modelName={modelName}
                key={`${Number(index1)}_history_${history.id}_${
                  history.timeline_date
                }`}
                history={history}
                setHistoryData={setHistoryData}
                setOpenActivityModal={setOpenActivityModal}
                openActivityModal={openActivityModal}
                setPermissionArray={setPermissionArray}
                permissionArray={permissionArray}
              />
            );
          })}
        </div>
      ))}
    </>
  );
};

export default ModuleSectionWiseTimeline;
