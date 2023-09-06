// ** import packages **
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { startOfDay } from 'date-fns';
import InfiniteScroll from 'react-infinite-scroll-component';

// ** Services **
import Image from 'components/Image';
import RecentLogsSkeleton from 'pages/Dashboard/skeleton/RecentLogsSkeleton';
import { TimelineDate } from 'components/EntityDetails/Timeline/components/TimelineDate';

import DateFormat from 'components/DateFormat';
// ** types **
import {
  AllItemFilter,
  TIMELINE_ACTION,
  TimelineType,
} from 'components/EntityDetails/Timeline/types';

// ** custom hook **
import RecentLogsData from './RecentLogsData';
import { sinceOfDateTime } from 'helper/timeline.helper';
import DefaultTimeline from 'components/EntityDetails/Timeline/DefaultTimeline';
import {
  useLazyGetGetTimelineForStreamQuery,
  useLazyGetTimelineForDashBoardQuery,
} from 'redux/api/timelineApi';

import DisplayRichTextContent from 'components/RichTextEditor/DisplayRichTextContent';
import { SingleTimeLineSkeleton } from 'components/EntityDetails/Timeline/skeletons/TimeLineSkeleton';
import ScrollUpButton from 'components/Button/ScrollUpButton';
import { useLazyGetStreamsQuery } from 'redux/api/streamLine/streamApi';
import _ from 'lodash';
import { POLLING_INTERVAL } from 'constant/dataLimit.constant';
import { isIsoDate } from 'utils/util';

interface PropsInterface {
  recentLogsFlag: boolean;
  userIds?: string[];
  setIsDocument?: React.Dispatch<React.SetStateAction<boolean>>;
  isDocument?: boolean;
  setPollingInterval?: React.Dispatch<React.SetStateAction<number | undefined>>;
  isPolling?: boolean;
  isFilleter?: boolean;
  pollingInterval?: number | undefined;
  searchValue?: string;
  dateRangeFilter?:
    | {
        startDate: string;
        endDate: string;
      }
    | undefined;
  filterState?: AllItemFilter;
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
  refresh?: boolean;
}

const RecentLogs = (props: PropsInterface) => {
  const location = useLocation();

  const {
    recentLogsFlag,
    userIds,
    isPolling,
    setIsDocument,
    isDocument,
    setPollingInterval,
    pollingInterval,
    isFilleter,
    searchValue,
    dateRangeFilter,
    filterState,
    setRefresh,
    refresh,
  } = props;

  const [historyPageInfo, setHistoryPageInfo] = useState<{
    page: number;
    hasMore: boolean;
    limit: number;
  }>({ hasMore: false, page: 1, limit: 10 });

  // ** states **
  const [recentLogs, setRecentLogs] = useState<TimelineType[]>([]);

  // ** apis ** //
  const [
    getGetTimelineForDashBoardAPI,
    { isLoading: isLoadingHistory, currentData: dashboardRecentLogData },
  ] = useLazyGetTimelineForDashBoardQuery({
    pollingInterval: location.pathname === '/' ? POLLING_INTERVAL : 0,
  });

  const [getGetTimelineForStreamAPI, { isLoading: isStreamLoadingHistory }] =
    useLazyGetGetTimelineForStreamQuery();

  // ** Custom Hooke //

  // const { generateData, logs } = useGenerateRecentLogData();
  useEffect(() => {
    if (recentLogs?.[0]?.model_name === 'activities') {
      setRefresh?.(!refresh);
    }
  }, [recentLogs]);

  useEffect(() => {
    setHistoryPageInfo({
      hasMore: true,
      page: 1,
      limit: 10,
    });
  }, [userIds, searchValue, dateRangeFilter, filterState]);

  // ** State Api **

  const [getStreams, { data: logsData }] = useLazyGetStreamsQuery({
    pollingInterval,
  });
  useEffect(() => {
    if (dashboardRecentLogData)
      setRecentLogs(dashboardRecentLogData?.rows || []);
  }, [dashboardRecentLogData]);

  useEffect(() => {
    if (isDocument === true) {
      getRecentLogs();
    }
  }, [isDocument]);

  useEffect(() => {
    if (logsData) {
      const res = _.cloneDeep(logsData);
      const data1 = res;
      res?.forEach((element: any) => {
        if (element.comments.length) {
          element.comments.forEach((element1: any) => {
            element1.timeline_date = element1.created_at;
            element1.model_name = element.model_name;
            element1.message = element.message;
            element1.isComment = true;
            element1[element.model_name] = element[element.model_name];
            element1.action = 'comment';
            element1.model_record_id = element.model_record_id;
            element1.comment_id = element?.id;
          });
          data1.push(...element.comments);
        }
      });
      // res.rows = data1;
      res.sort(
        (a: any, b: any) =>
          new Date(b.timeline_date).valueOf() -
          new Date(a.timeline_date).valueOf()
      );
      setRecentLogs(() => [...res]);
    }
  }, [logsData]);
  const params = {
    page: historyPageInfo.page,
    limit: historyPageInfo.limit,
    sort: '-id',
    userIds: JSON.stringify(userIds),
    'include[related_activities][paranoid]': false,
    'include[related_activities][select]': 'id,topic',
    'include[accounts][paranoid]': false,
    'include[accounts][select]': 'id,name',
    'include[comments]': 'all',
    'include[contacts][paranoid]': false,
    'include[contacts][select]': 'id,name',
    'include[leads][paranoid]': false,
    'include[leads][select]': 'id,name',
    'include[activities][paranoid]': false,
    'include[activities][select]': 'id,topic',
    'include[email][paranoid]': false,
    'include[email][select]': 'all',
    'include[email][required]': false,
    'include[creator][select]':
      'id,full_name,first_name,last_name,profile_image',
    'q[or][2][activities.activity_type_id][in]': filterState?.activityTypeIds,
    subQuery: false,
    ...(filterState?.notes && {
      'q[or][0][relation_model_name]': 'notes',
    }),
    ...(filterState?.documents && {
      'q[or][1][relation_model_name]': 'documents',
    }),
    ...(filterState?.info && {
      'q[or][3][relation_model_name]': '',
    }),
    ...(filterState?.emails_sent && {
      'q[or][4][email.labels][in]': `{SENT}`,
    }),
    ...(filterState?.emails_received && {
      'q[or][5][email.labels][in]': `{INBOX}`,
    }),

    search: searchValue,
    ...(dateRangeFilter?.startDate && {
      'q[timeline_date][gte]': dateRangeFilter?.startDate,
    }),
    ...(dateRangeFilter?.endDate && {
      'q[timeline_date][lte]': dateRangeFilter?.endDate,
    }),
  };

  useEffect(() => {
    if (
      (isFilleter === false || isFilleter === undefined) &&
      historyPageInfo.hasMore
    ) {
      const time =
        historyPageInfo && historyPageInfo.page > 1 ? 0 : POLLING_INTERVAL;
      if (setPollingInterval) {
        setPollingInterval(time);
      }
      getRecentLogs();
      if (historyPageInfo?.page === 1 && isPolling) {
        getStreamData(params);
      }
    }
  }, [
    recentLogsFlag,
    userIds,
    isFilleter,
    searchValue,
    historyPageInfo,
    dateRangeFilter,
    filterState,
  ]);

  useEffect(() => {
    if (historyPageInfo?.page === 1 && isPolling) {
      if (setPollingInterval) setPollingInterval(POLLING_INTERVAL);
      getStreamData(params);
    } else if (setPollingInterval) setPollingInterval(0);
  }, [isPolling]);

  const locationPath = location.pathname;
  useEffect(() => {
    if (location.pathname === '/streams' && setPollingInterval) {
      setPollingInterval(0);
    }
  }, [locationPath]);
  useEffect(() => {
    if (historyPageInfo?.page > 1 && setPollingInterval) {
      setPollingInterval(0);
    }
  }, [historyPageInfo?.page]);
  const getStreamData = async (args: any) => {
    if (location.pathname !== '/') {
      const { data } = await getStreams(args, true);
      return data;
    }
  };

  const getRecentLogs = async () => {
    let dataW: any;
    if (location.pathname === '/') {
      dataW = await getGetTimelineForDashBoardAPI({
        params: {
          page: 1,
          limit: 50,
          sort: '-id',
          'include[related_activities][paranoid]': false,
          'include[related_activities][select]': 'id,topic',
          'include[accounts][paranoid]': false,
          'include[accounts][select]': 'id,name',
          'include[contacts][paranoid]': false,
          'include[contacts]': 'id,name',
          'include[leads][paranoid]': false,
          'include[leads][select]': 'id,name',
          'include[activities][paranoid]': false,
          'include[activities][select]': 'id,topic',
          'include[creator][select]':
            'id,full_name,first_name,last_name,profile_image,initial_color',
          'q[action][in]': `${[
            TIMELINE_ACTION.CREATE,
            TIMELINE_ACTION.UPDATE,
            TIMELINE_ACTION.ASSIGN,
            TIMELINE_ACTION.CONVERT,
          ]}`,
        },
      });
    } else {
      dataW = await getGetTimelineForStreamAPI({
        params: {
          page: historyPageInfo.page,
          limit: historyPageInfo.limit,
          sort: '-id',
          userIds: JSON.stringify(userIds),
          'include[related_activities][paranoid]': false,
          'include[related_activities][select]': 'id,topic',
          'include[accounts][paranoid]': false,
          'include[accounts][select]': 'id,name',
          'include[comments]': 'all',
          'include[contacts][paranoid]': false,
          'include[contacts][select]': 'id,name',
          'include[leads][paranoid]': false,
          'include[leads][select]': 'id,name',
          'include[activities][paranoid]': false,
          'include[activities][select]': 'id,topic',
          'include[email][paranoid]': false,
          'include[email][select]': 'all',
          'include[email][required]': false,
          'include[creator][select]':
            'id,full_name,first_name,last_name,profile_image,initial_color',
          'q[or][2][activities.activity_type_id][in]':
            filterState?.activityTypeIds,
          subQuery: false,
          ...(filterState?.notes && {
            'q[or][0][relation_model_name]': 'notes',
          }),
          ...(filterState?.documents && {
            'q[or][1][relation_model_name]': 'documents',
          }),
          ...(filterState?.info && {
            'q[or][3][relation_model_name]': '',
          }),
          ...(filterState?.emails_sent && {
            'q[or][4][email.labels][in]': `{SENT}`,
          }),
          ...(filterState?.emails_received && {
            'q[or][5][email.labels][in]': `{INBOX}`,
          }),

          search: searchValue,
          ...(dateRangeFilter?.startDate
            ? {
                'q[timeline_date][gte]': dateRangeFilter?.startDate,
              }
            : {
                'q[timeline_date][lte]': new Date().toString(),
              }),
          ...(dateRangeFilter?.endDate && {
            'q[timeline_date][lte]': dateRangeFilter?.endDate,
          }),
        },
      });
      if (setIsDocument) setIsDocument(false);
    }
    if (dataW) {
      const data = _.cloneDeep(dataW?.data);
      if (location.pathname !== '/') {
        const data1 = data;
        data?.forEach((element: any) => {
          if (element.comments.length) {
            element.comments.forEach((element1: any) => {
              element1.timeline_date = element1.created_at;
              element1.model_name = element.model_name;
              element1.message = element.message;
              element1.isComment = true;
              element1[element.model_name] = element[element.model_name];
              element1.action = 'comment';
              element1.model_record_id = element.model_record_id;
              element1.comment_id = element1?.id;
            });
            data1.push(...element.comments);
          }
        });

        // data = data1;
        data?.sort(
          (a: any, b: any) =>
            new Date(b.timeline_date).valueOf() -
            new Date(a.timeline_date).valueOf()
        );
        if (historyPageInfo.page === 1) {
          if (data?.length) setRecentLogs([...data]);
        } else {
          setRecentLogs((prev) => [...prev, ...data]);
        }
        if (data?.length === 0 || data?.length < 0) {
          setHistoryPageInfo({ ...historyPageInfo, hasMore: false });
        }
        if (historyPageInfo.page === 1 && data?.length === 0) {
          setRecentLogs([]);
        }
      }
    }
  };

  const dateWiseHistoryObj: { [key: string]: TimelineType[] } = {};
  if (recentLogs) {
    recentLogs?.forEach((obj) => {
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
      <div
        className={`rc__ActivityLogs px-[10px] mb-[20px] xl:w-full w-1/2 ${
          location.pathname === '/' ? 'w-1/2' : ''
        }`}
      >
        <div className="inner__wrapper rounded-[12px] border border-[#000000]/10 overflow-hidden">
          {location.pathname === '/' ? (
            <div className="header bg-[#F3F3F3] border-b border-b-[#CCCCCC]/40 py-[16px] px-[20px]">
              <h3 className="text-[20px] text-black font-biotif__Medium whitespace-pre overflow-hidden text-ellipsis">
                Recent Logs
              </h3>
            </div>
          ) : (
            ''
          )}
          {isLoadingHistory ||
          (isStreamLoadingHistory && historyPageInfo.page === 1) ? (
            <RecentLogsSkeleton />
          ) : (
            <div
              className={`contant__wrapper bg-[#F3F3F3]  px-[24px] py-[20px] overflow-y-auto ip__FancyScroll xl:h-auto xl:max-h-[312px] h-[312px] ${
                location.pathname === '/' ? 'h-[312px]' : ''
              }`}
            >
              {recentLogs.length ? (
                <>
                  {location.pathname === '/' ? (
                    recentLogs &&
                    recentLogs.map((item) => {
                      return (
                        <div
                          key={window.self.crypto.randomUUID()}
                          className="rc__ac__item flex flex-wrap items-start py-[13px] px-[15px] xl:px-[15px] bg-white rounded-[10px] mb-[10px] last:mb-0"
                        >
                          <div className="img__wrapper w-[28px] h-[28px]">
                            <Image
                              imgPath={item.creator?.profile_image || ''}
                              first_name={item.creator?.first_name || ''}
                              last_name={item.creator?.last_name || ''}
                              serverPath
                              color={item.creator?.initial_color || ''}
                            />
                          </div>
                          <div className="rc__ac__contant w-[calc(100%_-_30px)] pl-[10px]">
                            <RecentLogsData timeLineData={item} />
                            <div className="author__time text-[12px] text-sdNormal__textColor font-biotif__Regular">
                              <span>
                                <DateFormat
                                  date={item.timeline_date || ''}
                                  format="MMM d"
                                />{' '}
                                on{' '}
                                <DateFormat
                                  date={item.timeline_date || ''}
                                  format="h:mm aa"
                                />
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <>
                      {/* As Per  Client Requirement As Of Now This Code Is Commented  */}
                      {/* <TimelineActivityComponent
                        {...{
                          modelName: TimelineModelName.DEAL,
                          type: 'Overdue',
                        }}
                      />
                      <TimelineActivityComponent
                        {...{
                          modelName: TimelineModelName.DEAL,
                          type: 'Upcoming',
                        }}
                      /> */}

                      <div>
                        <InfiniteScroll
                          dataLength={recentLogs.length}
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
                            isStreamLoadingHistory && <SingleTimeLineSkeleton />
                          }
                          scrollableTarget="body"
                        >
                          <div className="flex flex-wrap items-center bg-[#ECF2F6] rounded-[10px] py-[8px] px-[15px] pr-[8px] mb-[15px] 3xl:pl-[15px] cursor-pointer">
                            <div className="w-[calc(100%_-_32px)] flex items-center">
                              <span className="w-[11px] h-[11px] relative top-[-1px] bg-[#1776ba] rounded-full  mr-[9px]" />
                              <span className="text pt-[2px] text-[16px] font-biotif__Medium text-ipBlack__textColor pr-[10px] w-[calc(100%_-_22px)]">
                                History
                              </span>
                            </div>
                          </div>
                          {dateWiseHistoryObj &&
                            Object.keys(dateWiseHistoryObj).map(
                              (date: string, index) => {
                                return (
                                  <div
                                    className="timeline__day__repeater mb-[10px] bg-white rounded-[12px] p-5"
                                    key={`${Number(index)}_timeline-${date}`}
                                  >
                                    <h2 className="day__text text-[20px] font-biotif__Medium text-black mb-[15px] sm:text-[18px] sm:px-[10px] sm:mt-[24px]">
                                      <TimelineDate date={date} />
                                    </h2>
                                    {dateWiseHistoryObj[date].map(
                                      (item: any) => (
                                        <div
                                          key={item.id}
                                          className="rc__ac__item flex flex-wrap items-start py-[13px] px-[15px] xl:px-[15px] bg-white rounded-[10px] mb-[10px] last:mb-0"
                                        >
                                          <div className="img__wrapper w-[28px] h-[28px]">
                                            <Image
                                              imgPath={
                                                item.creator?.profile_image ||
                                                ''
                                              }
                                              first_name={
                                                item.creator?.first_name || ''
                                              }
                                              last_name={
                                                item.creator?.last_name || ''
                                              }
                                              serverPath
                                              color={
                                                item.creator?.initial_color ||
                                                ''
                                              }
                                            />
                                          </div>
                                          <div className="rc__ac__contant w-[calc(100%_-_30px)] pl-[10px]">
                                            <RecentLogsData
                                              timeLineData={item}
                                              setIsDocument={setIsDocument}
                                            />
                                            {((item.action !== 'Created' &&
                                              !item.isComment) ||
                                              (item.action === 'Created' &&
                                                item.relation_model_name ===
                                                  'tags')) && (
                                              <DefaultTimeline
                                                timelineData={{
                                                  ...item,
                                                  message: item?.message,
                                                }}
                                                key={item.id}
                                                setHistoryData={setRecentLogs}
                                                setOpenActivityModal={undefined}
                                              />
                                            )}
                                            {item.isComment && (
                                              <div className="timeline__note mt-[20px] mb-[8px] w-full flex flex-wrap items-start bg-[#ECF2F6] rounded-[10px] p-[24px] py-[10px]">
                                                <DisplayRichTextContent
                                                  information={item?.comment}
                                                />
                                              </div>
                                            )}

                                            <div className="author__time text-[12px] text-black__TextColor500 font-biotif__Regular">
                                              <span>
                                                {sinceOfDateTime(
                                                  item.timeline_date
                                                )}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                );
                              }
                            )}
                        </InfiniteScroll>
                        <ScrollUpButton />
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="no__recent__email bg-ipWhite__bgColor rounded-[10px] py-[30px] px-[20px] flex flex-wrap justify-center h-full items-center">
                    <div className="inline-block text-center w-[300px] max-w-full">
                      <img
                        className="w-[70px] max-w-full"
                        src="/images/no__recent__emailIcon2.png"
                        alt=""
                      />
                      <p className="text-[20px] text-center text-ipBlack__textColor font-biotif__SemiBold mt-[15px]">
                        {location.pathname === '/'
                          ? 'No Recent Logs Available'
                          : 'No Stream Logs Available'}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RecentLogs;
