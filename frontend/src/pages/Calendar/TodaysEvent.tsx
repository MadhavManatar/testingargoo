import DateFormat from 'components/DateFormat';
import { addMinutes } from 'date-fns';
import { QuickPropsInterface } from './calendar.types';
import { useNavigate } from 'react-router-dom';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

interface TodaysEventInterface {
  setShowEvents: React.Dispatch<React.SetStateAction<boolean>>;
  showEvents: boolean;
  todaysActivities: QuickPropsInterface[];
  setInitialRender: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenModal: React.Dispatch<
    React.SetStateAction<{
      add: boolean;
      edit: boolean;
      view: boolean;
      complete: boolean;
      id: number;
      activityTopic?: string | undefined;
      activityTypeId?: number | undefined;
    }>
  >;
}

const TodaysEvent = (props: TodaysEventInterface) => {
  const navigate = useNavigate();

  const {
    setOpenModal,
    setShowEvents,
    showEvents,
    todaysActivities,
    setInitialRender,
  } = props;
 
  return (
    <div className="todays__event w-[440px] pl-[30px] sticky top-[20px] 3xl:w-[350px] 3xl:pl-[20px] xl:static xl:w-full xl:pl-0 xl:mt-0 xl:mb-[20px] xl:order-[-1]">
      <div className="todays__event__box bg-[#FEEDDB] rounded-[10px] p-[20px] relative sm:p-[0px]">
        <div
          className="contant__header relative cursor-pointer xl:pr-[40px] sm:p-[14px] sm:pr-[40px]"
          onClick={() => setShowEvents(!showEvents)}
        >
          <h3 className="text-ipBlack__textColor text-[22px] font-biotif__SemiBold mb-[2px] sm:text-[18px]">
            Today's events
          </h3>
          <p className="text-mediumDark__TextColor text-[14px] font-biotif__Regular mb-[25px] sm:text-[14px] xl:mb-[5px]">
            Don't miss today's event
          </p>
          <button
            className={`${
              showEvents ? 'active' : null
            } toggleData__btn hidden text-[0px] w-[30px] h-[30px] rounded-full absolute top-[50%] translate-y-[-50%] right-[0px] duration-500 hover:bg-white before:content-[""] before:duration-500 before:absolute before:top-[50%] before:translate-y-[-50%] before:right-[11px] before:w-[10px] before:h-[10px] before:border-r-[2px] before:border-r-ipBlack__borderColor before:border-b-[2px] before:border-b-ipBlack__borderColor before:rotate-[-45deg] before:opacity-50 xl:block sm:right-[10px]`}
          >
            .
          </button>
        </div>
        <div
          className={`toggle__wrapper mt-[20px] sm:mt-0 sm:px-[14px] sm:pb-[14px] ${
            showEvents ? '' : 'xl:hidden'
          }`}
        >
          <div className="contant__body max-h-[calc(100dvh_-_284px)] overflow-y-auto ip__hideScrollbar sm:mt-0 xl:max-h-[calc(100dvh_-_246px)]">
            {todaysActivities.length ? (
              todaysActivities.map((item) => {
                return (
                  <div
                    onClick={() => {
                      setInitialRender(false);
                      setOpenModal({
                        add: false,
                        edit: false,
                        complete: false,
                        id: item?.activityId,
                        activityTypeId: item?.activity_type?.id,
                        activityTopic: item?.topic,
                        view: true,
                      });
                    }}
                    key={item?.activityId}
                    className="tEvent__box mb-[15px] cursor-pointer"
                  >
                    <div className="inner__wrapper bg-[#ffffff] rounded-[10px] px-[15px] py-[20px] pr-[45px] relative">
                      <p className='time text-[12px] text-dark__TextColor font-biotif__Regular mb-[5px] relative pl-[15px] before:content-[""] before:absolute before:top-[3px] before:left-0 before:w-[9px] before:h-[9px] before:rounded-full before:bg-[#24BD64]'>
                        <DateFormat date={item.start_date} format="hh:mm" /> -{' '}
                        <DateFormat
                          date={addMinutes(
                            new Date(item.start_date),
                            item?.duration
                          )}
                          format="hh:mm a"
                        />
                      </p>
                      <h2 className="text-[16px] font-biotif__SemiBold text-dark__TextColor">
                        {item?.topic}
                      </h2>
                      <p className="text text-light__TextColor text-[13px] font-biotif__Regular whitespace-pre overflow-hidden text-ellipsis">
                        {item?.agenda || ''}
                      </p>
                      <button className='readMore__btn text-[0px] w-[26px] h-[26px] rounded-full absolute top-[50%] translate-y-[-50%] right-[10px] duration-500 hover:bg-[#f2f2f2] before:content-[""] before:duration-500 before:absolute before:top-[50%] before:translate-y-[-50%] before:right-[10px] before:w-[10px] before:h-[10px] before:border-r-[2px] before:border-r-ipBlack__borderColor before:border-b-[2px] before:border-b-ipBlack__borderColor before:rotate-[-45deg] before:opacity-50'>
                        .
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="mb-[15px]">
                <div className="no__data__icon__component bg-white rounded-[12px] py-[25px] px-[20px]">
                  <div className="no__data__icon bg-primary__transparentBG w-[85px] h-[85px] rounded-full p-[22px] mx-auto">
                    <img
                      src="images/event-calendar.png"
                      alt="No event for today"
                    />
                  </div>
                  <h3 className="text-black font-biotif__SemiBold text-[20px] mt-[15px] text-center">
                    No event available for today
                  </h3>
                </div>
              </div>
            )}
          </div>
          <div
            className={`flex flex-wrap items-center justify-center pt-[6px] ${
              !todaysActivities?.length ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            <button
              onClick={() => navigate(PRIVATE_NAVIGATION.activities.view)}
              className="py-[6px] px-[20px] rounded-[6px] text-[14px] font-biotif__SemiBold text-mediumDark__TextColor duration-500 hover:text-ipBlack__textColor hover:bg-white"
            >
              View all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodaysEvent;
