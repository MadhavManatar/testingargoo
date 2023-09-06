// ** Import Packages **
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { startOfDay, addMinutes } from 'date-fns';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroll-component';

// ** Redux **
import {
  getIsTimeLineLoad,
  setLoadModuleActivityTimelines,
  setLoadTimeLines,
} from 'redux/slices/commonSlice';
import {
  TimelineFilterInterface,
  getTimelineFilter,
  setTimelineFilterNew,
} from 'redux/slices/timelineFilterSlice';

// ** Components **
import { TimelineModelName } from 'constant/timeline.constant';
import ScrollUpButton from 'components/Button/ScrollUpButton';
import EditActivityModal from 'pages/Activity/components/Modal/EditActivityModal';
import MarkAsDoneModal from 'pages/Activity/components/Modal/MarkAsDoneModal';
import DashboardActivityDetailView from 'pages/Dashboard/components/DashboardActivityDetailView';
import ModuleSectionWiseTimeline from './ModuleSectionWiseTImeline';
import NoDataFound from './components/NoDataFound';
import TimelineActivityComponent from './components/TimelineActivityComponent';
import { TimelineDate } from './components/TimelineDate';
import TimelineFilter from './components/TimelineFilter/TimelineFilter';
import TimelineUpperComponent from './components/TimelineUpperComponent';
import {
  SingleTimeLineSkeleton,
  TimeLineSkeleton,
} from './skeletons/TimeLineSkeleton';

// ** Types **
import { BasicContactFields } from 'pages/Contact/types/contacts.types';
import { TimelineOpenActivityModalType, TimelineType } from './types';

// ** Util **
import { isIsoDate, uniqueArray } from 'utils/util';
import { useLazyGetTimeLineByModelRecordIdQuery } from 'redux/api/timelineApi';

type Props = {
  modelName: TimelineModelName;
  modelRecordIds: number[];
  related_contacts?: (BasicContactFields | undefined)[];
};

const Timeline = (props: Props) => {
  const { modelName, modelRecordIds, related_contacts } = props;
  const dispatch = useDispatch();
  const IsTimeLineLoad = useSelector(getIsTimeLineLoad);
  const filter = useSelector(getTimelineFilter);

  // ** States **
  const [historyData, setHistoryData] = useState<TimelineType[]>([]);
  const [historyPageInfo, setHistoryPageInfo] = useState<{
    page: number;
    hasMore: boolean;
    limit: number;
  }>({ hasMore: false, page: 1, limit: 10 });

  const [ranKey, setRanKey] = useState<number>(Math.random());

  const [filterState, setFilterState] =
    useState<TimelineFilterInterface>(filter);

  // For activity detail page modal
  const [openActivityModal, setOpenActivityModal] =
    useState<TimelineOpenActivityModalType>({
      view: false,
      id: null,
      activityTopic: '',
      edit: false,
      complete: false,
      historyId: null,
    });

  const [permissionArray, setPermissionArray] = useState<{
    data: { label: string; onClick: () => void }[];
    timelineId: number | null;
  }>({
    data: [],
    timelineId: null,
  });

  // ** Ref ** related_contacts
  const modalRef = useRef<HTMLDivElement>(null);

  // ** apis ** //
  const [
    getTimeLineByModelRecordIdAPI,
    { isFetching: isLoadingHistory, currentData, error },
  ] = useLazyGetTimeLineByModelRecordIdQuery();

  useEffect(() => {
    dispatch(setTimelineFilterNew(filterState));
  }, [filterState]);

  useEffect(() => {
    if (historyPageInfo.hasMore) {
      getDataHistory();
    }
  }, [historyPageInfo]);

  useEffect(() => {
    setHistoryPageInfo({
      hasMore: true,
      page: 1,
      limit: 10,
    });
    dispatch(setLoadTimeLines({ timeline: false }));
  }, [IsTimeLineLoad, filterState.timelineFilter]);

  useEffect(() => {
    if (!isLoadingHistory) {
      if (!error && currentData) {
        let rows = _.cloneDeep(currentData.rows);
        rows = [
          ...uniqueArray(
            [...rows],
            ['relation_model_name', 'relation_model_record_id']
          ),
        ];
        if (IsTimeLineLoad) {
          setHistoryData([...rows]);
        } else if (historyPageInfo.page === 1) {
          if (currentData?.rows) setHistoryData([...rows]);
        } else {
          setHistoryData((prev) => [...prev, ...rows]);
        }
        if (rows.length === 0 || rows.length < 0) {
          setHistoryPageInfo({ ...historyPageInfo, hasMore: false });
        }
      } else {
        setHistoryPageInfo((prev) => ({ ...prev, hasMore: false }));
      }
      setRanKey(Math.random());
    }
  }, [currentData]);

  const getDataHistory = async () => {
    // let apiResponse;
    if (
      [
        TimelineModelName.DEAL,
        TimelineModelName.LEAD,
        TimelineModelName.CONTACT,
        TimelineModelName.ACCOUNT,
        TimelineModelName.ACTIVITY,
      ].includes(modelName)
    ) {
      // ** BEGIN: for removing selectAllForActivityType key ** //

      const excludeAllFilterKeys = [
        'selectAllForActivityType',
        'emails_received',
        'emails_sent',
      ];
      const updated_allItemFilter = Object.fromEntries(
        Object.entries(filterState.timelineFilter.allItemFilter || {}).filter(
          ([key]) => !excludeAllFilterKeys.includes(key)
        )
      );
      // ** END: for removing selectAllForActivityType key ** //

      const emailLabels: string[] = [];

      const labelObj = {
        INBOX: !!filterState.timelineFilter.allItemFilter?.emails_received,
        SENT: !!filterState.timelineFilter.allItemFilter?.emails_sent,
      };

      Object.entries(labelObj).forEach(([key, value]) => {
        if (key && value) {
          emailLabels.push(key);
        }
      });

      await getTimeLineByModelRecordIdAPI(
        {
          params: {
            modelName,
            modelRecordIds: JSON.stringify(modelRecordIds),
            userIds: JSON.stringify(filterState.timelineFilter.userIds),
            ...(related_contacts?.length && {
              relatedContactIds: JSON.stringify(
                filterState.timelineFilter.relatedContactIds
              ),
            }),
            allItemFilter: JSON.stringify(updated_allItemFilter),
            emailLabels: JSON.stringify(emailLabels),
            'include[creator][select]': 'first_name,last_name,id,profile_image',
            'q[timeline_date][lte]': addMinutes(
              new Date(new Date().setSeconds(0, 0)),
              1
            ),
            ...(filterState.timelineFilter.startDate && {
              'q[timeline_date][gte]': filterState.timelineFilter.startDate,
            }),
            ...(filterState.timelineFilter.endDate && {
              'q[timeline_date][lte]': filterState.timelineFilter.endDate,
            }),
            sort: '-id',
            search: filterState.timelineFilter.search,
            page: historyPageInfo.page,
            limit: historyPageInfo.limit,
          },
        },
        true
      );
    }
  };

  const closeModal = (data?: any) => {
    modalRef.current?.style.removeProperty('display');
    if (data) {
      setOpenActivityModal((prev) => ({
        ...prev,
        activityTopic: data?.topic,
        id: data?.id,
        view: !openActivityModal?.edit,
        edit: false,
        complete: false,
      }));
    } else {
      setOpenActivityModal({
        activityTopic: '',
        id: null,
        view: false,
        edit: false,
        complete: false,
        historyId: null,
      });
    }
  };

  // ** ==== here history store date wise object ex:{"01/12/2022":[...historyData]} ===
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
      <div className="timeline__main__wrapper">
        <TimelineFilter
          {...{ related_contacts, modelName }}
          filterState={filterState}
          setFilterState={setFilterState}
        />
        <TimelineUpperComponent
          {...{ modelName, modelRecordIds }}
          setTimelineHistoryData={setHistoryData}
          setOpenActivityModal={setOpenActivityModal}
          openActivityModal={openActivityModal}
          closeModal={closeModal}
          setPermissionArray={setPermissionArray}
          permissionArray={permissionArray}
        />
        {modelName !== 'activities' && (
          <>
            <TimelineActivityComponent {...{ modelName, type: 'Overdue' }} />
            <TimelineActivityComponent {...{ modelName, type: 'Upcoming' }} />
          </>
        )}

        {!IsTimeLineLoad && isLoadingHistory && historyPageInfo.page === 1 ? (
          <TimeLineSkeleton />
        ) : Object.keys(dateWiseHistoryObj).length > 0 ? (
          <>
            <div className="flex flex-wrap items-center bg-[#ECF2F6] rounded-[10px] py-[8px] px-[15px] pr-[8px] mb-[15px] 3xl:pl-[15px] cursor-pointer">
              <div className="w-[calc(100%_-_32px)] flex items-center">
                <span className="w-[11px] h-[11px] relative top-[-1px] bg-[#1776ba] rounded-full  mr-[9px]" />
                <span className="text pt-[2px] text-[16px] font-biotif__Medium text-ipBlack__textColor pr-[10px] w-[calc(100%_-_22px)]">
                  History
                </span>
              </div>
            </div>

            <div className="timeline__body__wrapper">
              <div
                className="timeline__dashed__wrapper relative before:content-[''] before:absolute before:top-[75px] before:left-[-36px] before:w-[1px] before:h-[calc(100%_-_85px)] before:border-dashed before:border-l-[2px] before:border-l-primaryColor before:opacity-20 sm:mt-[-38px] sm:before:left-[-31px] sm:before:hidden xsm:before:left-[-22px] xsm:before:border-l-[1px] before:hidden"
                key={`${ranKey}_reload`}
              >
                <InfiniteScroll
                  dataLength={historyData.length}
                  hasMore={historyPageInfo.hasMore}
                  next={() => {
                    if (historyPageInfo.hasMore) {
                      setHistoryPageInfo((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }));
                    }
                  }}
                  loader={
                    !IsTimeLineLoad &&
                    isLoadingHistory && <SingleTimeLineSkeleton />
                  }
                  scrollableTarget="body"
                >
                  {/* here we first loop for day */}
                  {Object.keys(dateWiseHistoryObj).map(
                    (date: string, index) => {
                      return (
                        <div
                          className="timeline__day__repeater mb-[10px]"
                          key={`${Number(index)}_timeline-${date}`}
                        >
                          <h2 className="day__text text-[20px] font-biotif__Medium text-ipBlack__textColor mb-[15px] pl-[70px] sm:text-[18px] sm:px-[10px] sm:mt-[24px]">
                            <TimelineDate date={date} />
                          </h2>
                          {/* Here render the data module section wise component */}
                          <ModuleSectionWiseTimeline
                            closeModal={closeModal}
                            openActivityModal={openActivityModal}
                            setOpenActivityModal={setOpenActivityModal}
                            modelName={modelName}
                            histories={dateWiseHistoryObj[date]}
                            setHistoryData={setHistoryData}
                            setPermissionArray={setPermissionArray}
                            permissionArray={permissionArray}
                          />
                        </div>
                      );
                    }
                  )}
                </InfiniteScroll>
              </div>
              <ScrollUpButton />
            </div>
          </>
        ) : (
          <NoDataFound />
        )}
      </div>
      {openActivityModal.view && openActivityModal.id && (
        <DashboardActivityDetailView
          isOpen={openActivityModal.view}
          closeViewModal={(activityDetail?: any) => closeModal(activityDetail)}
          activityId={openActivityModal.id}
          activityTopic={openActivityModal.activityTopic || ''}
          closeModalForDashboard={() => {
            if (modalRef.current) {
              modalRef.current.style.display = 'none';
            }
          }}
          onEdit={(data: any) => {
            if (data?.for_change_status) {
              return setHistoryData((prev) => {
                const finIndex = prev.findIndex(
                  (obj) => obj.id === openActivityModal.historyId
                );
                prev[finIndex].activities.is_active = data.is_active;
                return [...prev];
              });
            }
            setHistoryData((prev) => {
              const finIndex = prev.findIndex(
                (obj) => obj.id === openActivityModal.historyId
              );
              prev[finIndex].activities = data;
              return [...prev];
            });
          }}
          modalRef={modalRef}
          refreshTimeline={() =>
            dispatch(
              setLoadModuleActivityTimelines({
                moduleActivityTimeline: true,
              })
            )
          }
        />
      )}

      {openActivityModal.complete && (
        <MarkAsDoneModal
          isOpen={openActivityModal.complete}
          closeModal={closeModal}
          onAdd={(data) => {
            setHistoryData((prev) => {
              const finIndex = prev.findIndex(
                (obj) => obj.id === openActivityModal.historyId
              );
              prev[finIndex].activities = data;
              return [...prev];
            });
            setPermissionArray({
              data: [],
              timelineId: null,
            });
            dispatch(
              setLoadModuleActivityTimelines({
                moduleActivityTimeline: true,
              })
            );
          }}
          activityId={openActivityModal.id || 0}
          activityTypeId={openActivityModal.activityTypeId}
        />
      )}

      {openActivityModal.edit && openActivityModal.id && (
        <EditActivityModal
          id={openActivityModal.id}
          isOpen={openActivityModal.edit}
          onEdit={(data) => {
            dispatch(
              setLoadModuleActivityTimelines({
                moduleActivityTimeline: true,
              })
            );

            setHistoryData((prev) => {
              const finIndex = prev.findIndex(
                (obj) =>
                  obj.model_record_id === openActivityModal.model_record_id &&
                  obj.model_name === openActivityModal.model_name &&
                  obj.relation_model_name === 'activities' &&
                  !(
                    obj.message &&
                    JSON.stringify(obj.message)?.includes(
                      '---ScHeDuLed---AcTiViTy---TiMeLiNe---'
                    )
                  )
              );
              prev[finIndex].activities = data;

              const scheduledActivityIndex = prev.findIndex(
                (obj) =>
                  obj.model_record_id === openActivityModal.model_record_id &&
                  obj.model_name === openActivityModal.model_name &&
                  obj.message &&
                  JSON.stringify(obj.message)?.includes(
                    '---ScHeDuLed---AcTiViTy---TiMeLiNe---'
                  )
              );

              if (
                (scheduledActivityIndex || scheduledActivityIndex === 0) &&
                scheduledActivityIndex >= 0
              ) {
                prev[scheduledActivityIndex].activities = data;
                prev[scheduledActivityIndex].timeline_date = data.start_date;
              }

              return [
                ...prev.sort((a, b) => {
                  return (
                    new Date(b.timeline_date as string).valueOf() -
                    new Date(a.timeline_date as string).valueOf()
                  );
                }),
              ];
            });

            setPermissionArray({
              data: [],
              timelineId: null,
            });
          }}
          closeModal={closeModal}
        />
      )}
    </>
  );
};

export default Timeline;
