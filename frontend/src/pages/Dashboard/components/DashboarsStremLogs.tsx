// ** import packages **
import { MouseEventHandler, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { startOfDay } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';

// ** components **
import Image from 'components/Image';
import RecentLogsSkeleton from 'pages/Dashboard/skeleton/RecentLogsSkeleton';
import { TimelineDate } from 'components/EntityDetails/Timeline/components/TimelineDate';

// ** types **
import { TimelineType } from 'components/EntityDetails/Timeline/types';
import {
  EditStreamType,
  StreamDataType,
  UserDetailType,
} from 'pages/Streams/types/stream.type';

// ** custom hook **
import RecentLogsData from './RecentLogs/RecentLogsData';
import { sinceOfDateTime } from 'helper/timeline.helper';
import DefaultTimeline from 'components/EntityDetails/Timeline/DefaultTimeline';

import DisplayRichTextContent from 'components/RichTextEditor/DisplayRichTextContent';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import {
  getStreamListViewState,
  setStreamList,
} from 'redux/slices/stream.Slice';
import { useGetStreamData } from 'pages/Streams/hooks/stream.service';
import Dropdown from 'components/Dropdown';
import { useLazyGetGetTimelineForStreamQuery } from 'redux/api/timelineApi';
import { POLLING_INTERVAL } from 'constant/dataLimit.constant';
import { isIsoDate } from 'utils/util';

const DashboardStreamLogs = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  // ** states **
  const [recentLogs, setRecentLogs] = useState<TimelineType[]>([]);
  const [userIds, setUserIds] = useState<string[]>([]);
  const [streamData, setStreamData] = useState<StreamDataType>([]);

  // ** custom hooks **
  const getStreamView = useSelector(getStreamListViewState);
  const { getStreamAPI } = useGetStreamData();
  const [
    getGetTimelineForStreamAPI,
    { isLoading: isStreamLoadingHistory, currentData: streamLogs },
  ] = useLazyGetGetTimelineForStreamQuery({
    pollingInterval: pathname === '/' ? POLLING_INTERVAL : 0,
  });

  useEffect(() => {
    if (getStreamView?.sortStream?.streamData?.length === 0) {
      getStreamsData();
    } else {
      setUserIds(getStreamView?.userIds);
      setStreamData(getStreamView?.sortStream?.streamData);
    }
  }, []);

  useEffect(() => {
    if (userIds.length) getRecentLogs();
  }, [userIds]);

  useEffect(() => {
    if (streamLogs) {
      const data = _.cloneDeep(streamLogs);
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
          });
          data1.push(...element.comments);
        }
      });

      data?.sort(
        (a: any, b: any) =>
          new Date(b.timeline_date).valueOf() -
          new Date(a.timeline_date).valueOf()
      );

      if (data) setRecentLogs([...data]);
    }
  }, [streamLogs]);

  const getStreamsData = async () => {
    const { data, error } = await getStreamAPI({
      params: {
        'include[streamUser][select]': 'stream_id,user_id,created_by',
        'include[streamUser][required]': false,
        'include[streamUser][include][users][select]':
          'id,first_name,full_name,last_name',
      },
    });

    let tableData: any = {
      data: [
        {
          id: 0,
          name: '',
          streamUser: [
            {
              users: {
                full_name: '',

                id: '',
              },
              user_id: 0,
            },
          ],
        },
      ],
    };

    if (data && !error) {
      tableData = { rowData: data };
      setStreamData(tableData?.rowData);
      const users: UserDetailType[] = [];
      const userId: string[] = [];
      tableData?.rowData?.rows?.[0]?.streamUser?.forEach((element: any) => {
        userId.push(element?.user_id?.toString());
        users.push(element.users);
      });
      setUserIds(userId);
      const dataRes = tableData.rowData?.rows;

      if (dataRes.length) {
        const streamId = dataRes?.[0]?.id;
        dispatch(
          setStreamList({
            sortStream: {
              streamData: dataRes,
              selectedUserIs: { [streamId]: userId },
            },
            tab: {
              label: dataRes?.[0]?.name,
              id: dataRes?.[0]?.id,
            },
            userIds: userId,
            userData: {
              rows: users,
              count: 1,
            },
          })
        );
      }
    }
  };

  const getRecentLogs = async () => {
    await getGetTimelineForStreamAPI({
      params: {
        page: 1,
        limit: 10,
        sort: '-id',
        userIds: JSON.stringify(userIds),
        'include[related_activities][paranoid]': false,
        'include[related_activities][select]': 'id,topic',
        'include[accounts][paranoid]': false,
        'include[accounts][select]': 'id,name',
        'include[comments]': 'all',
        'include[contacts][paranoid]': false,
        'include[contacts]': 'id,name',
        'include[leads][paranoid]': false,
        'include[leads][select]': 'id,name',
        'include[activities][paranoid]': false,
        'include[activities][select]': 'id,topic',
        'q[timeline_date][lte]': new Date().toString(),
        'include[email][paranoid]': false,
        'include[email][select]': 'all',
        'include[email][required]': false,
        'include[creator][select]':
          'id,full_name,first_name,last_name,profile_image',
      },
    });
  };
  // ==== here history store date wise object ex:{"01/12/2022":[...historyData]} ===
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
  const changeStream = (stream: EditStreamType) => {
    const users: UserDetailType[] = [];
    const userId: string[] = [];
    stream.streamUser?.forEach((element) => {
      userId.push(element?.user_id?.toString());
      users.push(element.users);
    });
    setUserIds(userId);
    if (streamData)
      dispatch(
        setStreamList({
          sortStream: {
            streamData,
            selectedUserIs: { [stream.id]: userIds },
          },
          tab: {
            label: stream.name,
            id: stream.id,
          },
          userIds: userId,
          userData: {
            rows: users,
            count: 1,
          },
        })
      );
  };
  const dropDownList = (
    close: MouseEventHandler<HTMLDivElement> | undefined
  ) => {
    return (
      <ul className="tippy__dropdown__ul">
        {streamData?.length &&
          streamData?.map((stream, tIndex) => {
            return (
              <div
                className="item"
                key={tIndex}
                onClick={() => {
                  changeStream(stream);
                }}
              >
                <div onClick={close} className="item__link">
                  <div className="item__text"> {stream.name}</div>
                </div>
              </div>
            );
          })}
      </ul>
    );
  };

  return (
    <>
      <div className="stream__page stream__page__dashboard">
        <div className="rc__ActivityLogs mt-[20px] xl:w-full w-1/2">
          <div className="inner__wrapper rounded-[12px] border border-[#000000]/10 overflow-hidden">
            <div className="header flex justify-between bg-[#F3F3F3] border-b border-b-[#CCCCCC]/40 py-[16px] px-[20px]">
              <h3 className="text-[20px] text-black font-biotif__Medium whitespace-pre overflow-hidden text-ellipsis">
                Stream logs
              </h3>
              <div className="flex items-center">
                {getStreamView.tab?.label && (
                  <div className="pr-[10px] right__action flex flex-wrap sm:w-full sm:justify-between">
                    <Dropdown
                      className="tippy__dashboard__ActivityType"
                      placement="bottom-end"
                      content={({ close }) => dropDownList(close)}
                    >
                      <button className="acType__btn w-auto max-w-[160px] text-left text-[14px] bg-parentBgGray__grayBtnBG px-[16px] py-[2px] pr-[30px] h-[32px] font-biotif__Medium text-ipBlack__textColor rounded-[6px] relative mb-[10px] whitespace-pre overflow-hidden text-ellipsis before:content-[''] before:absolute before:top-[10px] before:right-[15px] before:w-[7px] before:h-[7px] before:border-l-[1px] before:border-l-ipBlack__textColor before:border-b-[1px] before:border-b-ipBlack__textColor before:rotate-[-45deg] hover:before:border-l-ipWhite__textColor hover:before:border-b-ipWhite__textColor">
                        {getStreamView.tab?.label}
                      </button>
                    </Dropdown>
                  </div>
                )}
                <Link
                  className="text-[14px] font-biotif__Regular underline text-ipBlack__textColor duration-500 hover:text-primaryColor relative ml-[12px]"
                  to={PRIVATE_NAVIGATION.streams.view}
                >
                  View all
                </Link>
              </div>
            </div>
            {isStreamLoadingHistory ? (
              <RecentLogsSkeleton />
            ) : (
              <div
                className={`contant__wrapper bg-[#F3F3F3]  px-[24px] py-[20px] overflow-y-auto ip__FancyScroll xl:h-auto xl:max-h-[312px] ${'h-[312px]'}`}
              >
                {recentLogs.length && userIds.length ? (
                  <>
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
                              {dateWiseHistoryObj[date].map((item: any) => (
                                <div
                                  key={window.self.crypto.randomUUID()}
                                  className="rc__ac__item flex flex-wrap items-start py-[13px] px-[15px] xl:px-[15px] bg-white rounded-[10px] mb-[10px] last:mb-0"
                                >
                                  <div className="img__wrapper w-[28px] h-[28px]">
                                    <Image
                                      imgPath={
                                        item.creator?.profile_image || ''
                                      }
                                      first_name={
                                        item.creator?.first_name || ''
                                      }
                                      last_name={item.creator?.last_name || ''}
                                      serverPath
                                      color={item.creator?.initial_color || ''}
                                    />
                                  </div>
                                  <div className="rc__ac__contant w-[calc(100%_-_30px)] pl-[10px]">
                                    <RecentLogsData timeLineData={item} />
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
                                        {sinceOfDateTime(item.timeline_date)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        }
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
                          No Stream Logs Available
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default DashboardStreamLogs;
