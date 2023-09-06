import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getIsPinTimeLineLoad,
  setLoadPinTimeLines,
  getIsTimeLineLoad,
  setLoadTimeLines,
  setDetailSectionView,
} from 'redux/slices/commonSlice';
import { TimelineOpenActivityModalType, TimelineType } from '../types';
import { TimelineModelName } from 'constant/timeline.constant';
import { startOfDay } from 'date-fns';
import ModuleSectionWiseTimeline from '../ModuleSectionWiseTImeline';
import { convertNumberOrNull, isIsoDate } from 'utils/util';
import { useParams } from 'react-router-dom';
import { getDetailSection } from 'redux/slices/authSlice';
import { useLazyGetTimeLineByModelRecordIdQuery } from 'redux/api/timelineApi';

type Props = {
  modelName: TimelineModelName;
  modelRecordIds: number[];
  setTimelineHistoryData: React.Dispatch<React.SetStateAction<TimelineType[]>>;
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

const TimelineUpperComponent = (props: Props) => {
  const {
    modelName,
    modelRecordIds,
    setTimelineHistoryData,
    setOpenActivityModal,
    openActivityModal,
    closeModal,
    permissionArray,
    setPermissionArray,
  } = props;

  const IsPinTimeLineLoad = useSelector(getIsPinTimeLineLoad);
  const IsTimeLineLoad = useSelector(getIsTimeLineLoad);

  /* URL ID */
  const { id } = useParams();
  const actStoreId = convertNumberOrNull(id);

  /* Hooks */
  const dispatch = useDispatch();
  const section = useSelector(getDetailSection);

  // Open Close Accordion
  const [accordion, setAccordion] = useState<{ [key: string]: boolean }>({
    ...(section?.[`${actStoreId}_pinned`] || {
      pinned: false,
    }),
  });

  const openCloseAccordion = (accType: string) => {
    setAccordion({
      ...accordion,
      [accType]: !accordion[accType],
    });
  };
  useEffect(() => {
    dispatch(
      setDetailSectionView({ [`${actStoreId}_pinned`]: { ...accordion } })
    );
  }, [accordion]);

  // ** states **

  const [historyData, setHistoryData] = useState<TimelineType[]>([]);
  const [historyPageInfo, setHistoryPageInfo] = useState<{
    page: number;
    hasMore: boolean;
  }>({ hasMore: true, page: 1 });
  const [historyDataCount, setHistoryDataCount] = useState<number>(0);

  // ** apis ** //
  const [getTimeLineByModelRecordIdAPI, { currentData, error }] =
    useLazyGetTimeLineByModelRecordIdQuery();

  useEffect(() => {
    if (historyPageInfo.hasMore) {
      getDataHistory();
    }
  }, [historyPageInfo]);

  useEffect(() => {
    if (IsTimeLineLoad) {
      setHistoryPageInfo({
        hasMore: true,
        page: 1,
      });
    }
  }, [IsTimeLineLoad]);

  useEffect(() => {
    if (IsPinTimeLineLoad) {
      setHistoryPageInfo({
        hasMore: true,
        page: 1,
      });
    }
  }, [IsPinTimeLineLoad]);

  useEffect(() => {
    if (!error && currentData) {
      dispatch(setLoadTimeLines({ timeline: false }));
      dispatch(setLoadPinTimeLines({ pinTimeline: false }));
      setHistoryDataCount(currentData.count);
      if (historyPageInfo.page === 1) {
        if (currentData.rows) setHistoryData([...currentData.rows]);
      } else {
        setHistoryData((prev) => [...prev, ...currentData.rows]);
      }
    } else {
      if (historyPageInfo.page === 1) setHistoryData([]);
      setHistoryPageInfo((prev) => ({ ...prev, hasMore: false }));
    }
  }, [currentData]);

  const getDataHistory = async () => {
    if (
      modelName === TimelineModelName.DEAL ||
      modelName === TimelineModelName.LEAD ||
      modelName === TimelineModelName.CONTACT ||
      modelName === TimelineModelName.ACCOUNT ||
      modelName === TimelineModelName.ACTIVITY
    ) {
      await getTimeLineByModelRecordIdAPI(
        {
          params: {
            modelName,
            modelRecordIds: JSON.stringify(modelRecordIds),
            'include[creator][select]': 'first_name,last_name,id,profile_image',
            'q[is_pinned]': true,
            sort: '-id',
            page: historyPageInfo.page,
            limit: 1000,
          },
        },
        true
      );
    }
  };

  // ==== here history store date wise object ex:{"01/12/2022":[...historyData]} ===
  const dateWiseHistoryObj: { [key: string]: TimelineType[] } = {};

  if (historyData) {
    historyData?.forEach((obj) => {
      const { timeline_date } = obj;
      if (timeline_date && isIsoDate(timeline_date)) {
        const key = startOfDay(new Date(timeline_date as string)).toISOString();

        if (dateWiseHistoryObj[key]) {
          dateWiseHistoryObj[key] = [...dateWiseHistoryObj[key], obj];
        } else {
          dateWiseHistoryObj[key] = [obj];
        }
      }
    });
  }

  return (
    <>
      {historyData?.length > 0 ? (
        <>
          <div className="">
            <div className="flex flex-wrap items-center bg-[#ECF2F6] rounded-[10px] py-[8px] px-[15px] pr-[8px] mb-[15px] 3xl:pl-[15px] cursor-pointer">
              <div
                className="w-[calc(100%_-_32px)] flex items-center"
                onClick={() => openCloseAccordion('pinned')}
              >
                <span className="w-[11px] h-[11px] relative top-[-1px] rounded-full bg-[#F78310] mr-[9px]" />
                <span className="text pt-[2px] text-[16px] font-biotif__Medium text-ipBlack__textColor pr-[10px] w-[calc(100%_-_22px)]">
                  Pinned ({historyDataCount || 0})
                </span>
              </div>
              <button
                className={`section__toggle__btn w-[30px] h-[30px] rounded-[7px] text-[0px] relative duration-500 hover:bg-white before:content-[''] before:absolute before:left-[10px] before:w-[10px] before:h-[10px] before:border-l-[2px] before:border-l-black before:border-b-[2px] before:border-b-black ${
                  accordion.pinned
                    ? 'before:rotate-[-45deg] before:top-[8px]'
                    : 'before:rotate-[-228deg] before:top-[12px]'
                }`}
                onClick={() => openCloseAccordion('pinned')}
              >
                .
              </button>
            </div>
            {accordion.pinned && (
              <div className="timeline__body__wrapper">
                <div className="timeline__dashed__wrapper relative before:content-[''] before:absolute before:top-[75px] before:left-[-36px] before:w-[1px] before:h-[calc(100%_-_85px)] before:border-dashed before:border-l-[2px] before:border-l-primaryColor before:opacity-20 sm:mt-[-38px] sm:before:left-[-31px] sm:before:hidden xsm:before:left-[-22px] xsm:before:border-l-[1px] before:hidden">
                  {/* <InfiniteScroll
                    dataLength={historyData.length}
                    hasMore={historyPageInfo.hasMore}
                    next={() =>
                      historyPageInfo.hasMore &&
                      setHistoryPageInfo((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                    loader={<SingleTimeLineSkeleton />}
                    scrollableTarget="body"
                  >

                    {Object.keys(dateWiseHistoryObj).map(
                      (date: string, index) => {
                        return (
                          <div
                            className="timeline__day__repeater mb-[10px] relative before:content-[''] before:absolute before:top-[26px] before:left-[18px] before:h-[100%] before:w-[1px] before:border-dashed before:border-l-[2px] before:border-[#CCC]/50 last:before:hidden"
                            key={`${Number(index)}_timeline`}
                          >
                      
                            <ModuleSectionWiseTimeline
                              modelName={modelName}
                              histories={dateWiseHistoryObj[date]}
                              setHistoryData={setHistoryData}
                            />
                          </div>
                        );
                      }
                    )}
                  </InfiniteScroll> */}

                  {Object.keys(dateWiseHistoryObj).map(
                    (date: string, index) => {
                      return (
                        <div
                          className="timeline__day__repeater mb-[10px] relative before:content-[''] before:absolute before:top-[26px] before:left-[18px] before:h-[100%] before:w-[1px] before:border-dashed before:border-l-[2px] before:border-[#CCC]/50 last:before:hidden"
                          key={`${Number(index)}_timeline`}
                        >
                          {/* Here render the data module section wise component */}
                          <ModuleSectionWiseTimeline
                            modelName={modelName}
                            histories={dateWiseHistoryObj[date]}
                            setHistoryData={setTimelineHistoryData}
                            setOpenActivityModal={setOpenActivityModal}
                            openActivityModal={openActivityModal}
                            closeModal={closeModal}
                            permissionArray={permissionArray}
                            setPermissionArray={setPermissionArray}
                          />
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default TimelineUpperComponent;
