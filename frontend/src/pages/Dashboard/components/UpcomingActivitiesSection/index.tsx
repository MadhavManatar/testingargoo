// ** Import Packages **
import { startOfDay } from 'date-fns';
import {
  Fragment,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// ** Components **
import Dropdown from 'components/Dropdown';
import InfiniteScroll from 'components/InfiniteScroll';
import EditActivityModal from 'pages/Activity/components/Modal/EditActivityModal';
import MarkAsDoneModal from 'pages/Activity/components/Modal/MarkAsDoneModal';
import AuthGuard from 'pages/auth/components/AuthGuard';
import UpcomingActivitiesSkeleton from '../../skeleton/UpcomingActivitiesSkeleton';
import DashboardActivityDetailView from '../DashboardActivityDetailView';
import SingleActivitySection from './SingleActivitySection';

// ** Services **
import useAuth from 'hooks/useAuth';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { useGetActivityTypes } from 'pages/Setting/module-setting/Activity/ActivityType/hooks/useActivityType';

// ** Utils **
import { checkAndReturnDateAndLabel, setUrlParams } from 'utils/util';

// ** Types **
import { activitiesResponse } from '../../types/dashboard.types';
import {
  UpcomingActivitiesSectionProps,
  activityModalType,
} from './types/index.types';

// ** Redux
import store from 'redux/store';

// ** Constants **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import {
  BasicPermissionTypes,
  ModuleNames,
} from 'constant/permissions.constant';

// ** Other **
import { dateConst } from '../../helper/date.helper';
import DateFormat from 'components/DateFormat';
import { ActivityResponseType } from 'pages/Activity/types/activity.types';
import {
  useChangeActivityStatusByIdMutation,
  useLazyGetActivitiesQuery,
  useUpdateActivityMutation,
} from 'redux/api/activityApi';
import { POLLING_INTERVAL } from 'constant/dataLimit.constant';

const UpcomingActivitiesSection = (props: UpcomingActivitiesSectionProps) => {
  const { pageInfo, setPageInfo, setRecentLogsFlag, refresh } = props;

  // ** hooks **
  const modalRef = useRef<HTMLDivElement>(null);
  const { isMobileView } = useWindowDimensions();
  const navigate = useNavigate();
  const { weekEnd, weekStart } = dateConst;
  const { pathname } = useLocation();

  // ** State **
  const [recentActivityData, setRecentActivityData] = useState<
    activitiesResponse[]
  >([]);
  const [row, setRow] = useState<number>();
  const [filterData, setFilterData] = useState<{
    start_date: string;
    end_date: string;
    activity_type?: number[];
  }>({
    start_date: weekStart.toISOString(),
    end_date: weekEnd.toISOString(),
  });
  const [openModal, setOpenModal] = useState<activityModalType>({
    add: false,
    edit: false,
    complete: false,
    view: false,
    id: 0,
  });
  const [permissionArray, setPermissionArray] = useState<
    { label: string; onClick: () => void }[]
  >([]);
  const [infiniteLoader, setInfiniteLoader] = useState(true);

  // ** APIS **
  const [getActivitiesAPI, { isLoading: getActivitiesLoading, currentData }] =
    useLazyGetActivitiesQuery({
      pollingInterval: pathname === '/' ? POLLING_INTERVAL : 0,
    });
  const [updateActivityByIdAPI] = useUpdateActivityMutation();
  const [changeActivityStatusByIdAPI] = useChangeActivityStatusByIdMutation();

  // ** custom hooks **
  const { hasAuthorized } = useAuth();
  const { auth } = store.getState();
  const { user } = auth;
  const { activityTypeData } = useGetActivityTypes({});

  const readActivityPermission = hasAuthorized([
    { module: ModuleNames.ACTIVITY, type: BasicPermissionTypes.READ },
  ]);
  useEffect(() => {
    getActivities();
  }, [refresh]);
  useEffect(() => {
    if (pageInfo.hasMore) {
      getActivities();
    }
  }, [filterData, pageInfo]);
  useEffect(() => {
    setInfiniteLoader(false);

    if (currentData) {
      if (currentData?.count === recentActivityData.length) {
        setPageInfo((prev) => ({ ...prev, hasMore: false }));
        return;
      }

      const activityData: activitiesResponse[] = currentData?.rows;

      const updatedActivityData = activityData.map((item) => {
        return {
          ...item,
          is_activity_pass:
            new Date(item?.end_date).getTime() < new Date().getTime(),
        };
      });

      if (pageInfo.page === 1) {
        setRecentActivityData([...updatedActivityData]);
      } else {
        setRecentActivityData((prev) => [...prev, ...updatedActivityData]);
      }
    }
  }, [currentData]);

  const getActivities = async () => {
    setInfiniteLoader(true);

    await getActivitiesAPI(
      {
        data: {
          query: {
            select:
              'id,start_date,topic,is_active,end_date,completed_by,all_day,duration',
            'include[activity_type][select]': 'icon,icon_type,name,id,color',
            'include[activity_type][paranoid]': false,
            'include[activity_contact][select]': 'id,name',
            // 'q[start_date][gte]': filterData.start_date,
            'q[start_date][lte]': filterData.end_date,
            ...(filterData.activity_type?.length && {
              'q[activity_type_id][in]': `n|${filterData.activity_type?.toString()}`,
            }),
            'q[completed_by]': null,
            ...(user?.id && {
              'q[host_id]': user?.id,
            }),
            sort: 'start_date',
            page: pageInfo.page,
            limit: 300,
          },
        },
      },
      true
    );
  };

  const refreshActivitySection = (data: any) => {
    setRecentLogsFlag((prev) => !prev);
    setRecentActivityData((prev) => {
      const findIndex = prev.findIndex((item) => item.id === data?.id);
      prev[findIndex] = data;
      return [...prev];
    });
  };

  // refresh upcoming activity from dashboard if mark as done
  const refreshUpcomingActivity = (data: any) => {
    setRecentActivityData((prev) => {
      const findIndex = prev.findIndex((item) => item.id === data?.id);
      prev.splice(findIndex, 1);
      return [...prev];
    });
  };

  async function changeActivityStatus(id: number, is_active: boolean) {
    const data = await changeActivityStatusByIdAPI({
      id,
      data: {
        is_active,
      },
    });
    if ('data' in data && data.data) {
      setRecentLogsFlag((prev) => !prev);
      setRecentActivityData((prev) => {
        const finIndex = prev.findIndex((obj) => obj.id === data.data?.id);
        prev[finIndex].is_active = data.data.is_active;
        return [...prev];
      });
    }
  }

  async function reOpenActivity(id: number) {
    const data = await updateActivityByIdAPI({
      id,
      data: {
        completed: false,
      },
    });
    if ('data' in data && data.data) {
      setRecentLogsFlag((prev) => !prev);
      refreshActivitySection(data);
    }
  }

  const closeModal = (data?: any) => {
    modalRef.current?.style.removeProperty('display');

    if (data) {
      setOpenModal({
        add: false,
        edit: false,
        complete: false,
        id: data?.id,
        activityTypeId: data?.activity_type?.id,
        activityTopic: data?.topic,
        view: !openModal?.edit,
      });
    } else if (openModal.edit) {
      setOpenModal({
        add: false,
        edit: false,
        complete: false,
        id: data?.id || openModal.id,
        activityTypeId: data?.activity_type?.id || openModal?.activityTypeId,
        activityTopic: data?.topic || openModal?.activityTopic,
        view: !openModal?.edit,
      });
    } else {
      setOpenModal({
        add: false,
        edit: false,
        id: 0,
        complete: false,
        view: false,
      });
    }
  };

  const handleActivityClick = (aVal: activitiesResponse) => {
    const tempPermissionArray = [];
    if (aVal?.id) {
      setRow(aVal.id);
      tempPermissionArray.push({
        label: 'View',
        onClick: () =>
          setOpenModal({
            add: false,
            edit: false,
            complete: false,
            id: aVal?.id,
            activityTypeId: aVal?.activity_type?.id,
            activityTopic: aVal?.topic,
            view: true,
          }),
      });
    }

    tempPermissionArray.push({
      label: 'Edit',
      onClick: () => {
        if (isMobileView) {
          navigate(
            setUrlParams(
              PRIVATE_NAVIGATION.activities.EditActivityMobileView,
              aVal?.id
            )
          );
        } else {
          setOpenModal({
            add: false,
            edit: true,
            complete: false,
            view: false,
            id: aVal?.id,
            activityTypeId: aVal?.activity_type?.id,
            activityTopic: aVal?.topic,
          });
        }
      },
    });

    if (aVal?.join_link) {
      tempPermissionArray.push({
        label: 'Launch',
        onClick: () => window.open(`${aVal?.join_link}`, '_blank'),
      });
    }

    tempPermissionArray.push(
      {
        label: `${aVal?.is_active ? 'Stop' : 'Start'} ${
          aVal?.activity_type?.name || ''
        }`,
        onClick: () => {
          changeActivityStatus(aVal?.id, !aVal?.is_active);
        },
      },
      {
        label: `${aVal?.completed_by ? 'Re-Open' : 'Mark As Done'}`,
        onClick: () => {
          if (aVal?.completed_by) {
            reOpenActivity(aVal?.id);
          } else {
            setOpenModal({
              add: false,
              edit: false,
              complete: true,
              id: aVal?.id,
              activityTypeId: aVal?.activity_type?.id,
              view: false,
            });
          }
        },
      }
    );
    setPermissionArray(tempPermissionArray);
  };
  const dropDownList = (
    close: MouseEventHandler<HTMLDivElement> | undefined
  ) => {
    return (
      <ul className="tippy__dropdown__ul">
        <div
          className="item"
          onClick={() => {
            setFilterData((prev) => ({
              ...prev,
              activity_type: activityTypeData.map((item) => item.id),
            }));
            setPageInfo({ hasMore: true, page: 1 });
          }}
        >
          <div onClick={close} className="item__link">
            <div className="item__text"> All</div>
          </div>
        </div>
        {(activityTypeData || []).map((type, tIndex) => {
          return (
            <div
              className="item"
              key={tIndex}
              onClick={() => {
                setFilterData((prev) => ({
                  ...prev,
                  activity_type: [type.id],
                }));
                setPageInfo({ hasMore: true, page: 1 });
              }}
            >
              <div onClick={close} className="item__link">
                <div className="item__text"> {type.name}</div>
              </div>
            </div>
          );
        })}
      </ul>
    );
  };
  const dateWiseObj: { [key: string]: activitiesResponse[] | any } = {
    today: [],
    past: [],
    upcoming: [],
  };

  // assign for the filter data and infinite api call issue
  const recentActivityFilterData = recentActivityData;

  if (recentActivityFilterData) {
    recentActivityFilterData
      .filter((val) => !val?.completed_by)
      ?.forEach((obj) => {
        const { start_date } = obj;
        const key = startOfDay(new Date(start_date)).toISOString();
        const todayDate = startOfDay(new Date()).toISOString();
        if (key === todayDate) {
          dateWiseObj.today[key] = dateWiseObj.today[key]
            ? [...dateWiseObj.today[key], obj]
            : [obj];
        } else if (key < todayDate) {
          dateWiseObj.past[key] = dateWiseObj.past[key]
            ? [...dateWiseObj.past[key], obj]
            : [obj];
        } else if (key > todayDate) {
          dateWiseObj.upcoming[key] = dateWiseObj.past[key]
            ? [...dateWiseObj.past[key], obj]
            : [obj];
        }
      });
  }

  return (
    <>
      <div
        className={`upcomingActivities__wrapper w-1/2 px-[10px] mb-[20px] xl:w-full ${
          !readActivityPermission ? 'ip__disabled' : ''
        }`}
      >
        <div className="inner__wrapper rounded-[12px] overflow-hidden">
          <div className="header bg-gray__BGColor py-[16px] px-[20px] pb-[4px] flex flex-wrap justify-between border-b border-b-greyScreen__BorderColor">
            <h3 className="text-[20px] text-ipBlack__textColor font-biotif__Medium w-[calc(100%_-_212px)] pr-[12px] mb-[10px] whitespace-pre overflow-hidden text-ellipsis sm:w-full">
              Activities
            </h3>
            <div className="right__action flex flex-wrap sm:w-full sm:justify-between">
              <Dropdown
                className="tippy__dashboard__ActivityType"
                placement="bottom-end"
                content={({ close }) => dropDownList(close)}
              >
                <button className="acType__btn w-auto max-w-[160px] text-left text-[14px] bg-parentBgGray__grayBtnBG px-[16px] py-[2px] pr-[30px] h-[32px] font-biotif__Medium text-ipBlack__textColor rounded-[6px] relative mb-[10px] whitespace-pre overflow-hidden text-ellipsis before:content-[''] before:absolute before:top-[10px] before:right-[15px] before:w-[7px] before:h-[7px] before:border-l-[1px] before:border-l-ipBlack__textColor before:border-b-[1px] before:border-b-ipBlack__textColor before:rotate-[-45deg] hover:before:border-l-ipWhite__textColor hover:before:border-b-ipWhite__textColor">
                  {(filterData?.activity_type &&
                    filterData?.activity_type?.length === 1 &&
                    activityTypeData.find(
                      (item) =>
                        item.id ===
                        filterData?.activity_type?.find((val) => val)
                    )?.name) ||
                    'All activities types'}
                </button>
              </Dropdown>
            </div>
          </div>

          {getActivitiesLoading && pageInfo.page === 1 ? (
            <UpcomingActivitiesSkeleton />
          ) : (
            <div
              className="contant__wrapper bg-gray__BGColor h-[312px] overflow-y-auto ip__FancyScroll xl:h-auto xl:max-h-[312px]"
              id="dashboard_activity_infiniteScroll"
            >
              {(recentActivityFilterData || []).length ? (
                <InfiniteScroll
                  hasMore={pageInfo.hasMore}
                  next={() => {
                    if (pageInfo.hasMore) {
                      setPageInfo((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }));
                    }
                  }}
                  isLoading={false}
                  Loader={<>Loading</>}
                  scrollableTarget="dashboard_activity_infiniteScroll"
                >
                  <>
                    {(Object.keys(dateWiseObj) || []).map(
                      (item: string, i: number) => {
                        if (Object.keys(dateWiseObj[item]).length) {
                          return (
                            <div
                              key={i}
                              onClick={() => {
                                if (row) {
                                  setRow(undefined);
                                }
                              }}
                              className="up__ac__timeline__box border-b border-b-black/10 pt-[18px] px-[24px] pb-[12px] xl:pl-[15px] xl:pr-[15px]"
                            >
                              <h3 className="main__day__title text-[16px] font-biotif__Medium text-primaryColor mb-[8px]">
                                {item && checkAndReturnDateAndLabel(item)}
                              </h3>
                              {(Object.keys(dateWiseObj[item]) || []).map(
                                (aVal: string, aIndex: number) => {
                                  return (
                                    <Fragment key={aIndex}>
                                      {(item === 'past' ||
                                        item === 'upcoming') && (
                                        <h4 className="inner__day__sub__title text-[14px] font-biotif__Medium text-primaryColor mb-[10px] mt-[17px]">
                                          <DateFormat
                                            format="MMM d, yyyy"
                                            date={aVal}
                                          />
                                        </h4>
                                      )}
                                      {dateWiseObj[item][aVal].map(
                                        (
                                          singleActivity: activitiesResponse,
                                          keyIndex: number
                                        ) => {
                                          return (
                                            <SingleActivitySection
                                              key={keyIndex}
                                              aIndex={aIndex}
                                              row={row}
                                              activity={singleActivity}
                                              handleActivityClick={
                                                handleActivityClick
                                              }
                                              permissionArray={permissionArray}
                                              setOpenModal={setOpenModal}
                                            />
                                          );
                                        }
                                      )}
                                    </Fragment>
                                  );
                                }
                              )}
                            </div>
                          );
                        }
                        return false;
                      }
                    )}
                    {infiniteLoader ? <div>Loading... </div> : null}
                  </>
                </InfiniteScroll>
              ) : (
                <div className="no__recent__email rounded-[10px] py-[30px] px-[20px] flex flex-wrap justify-center h-full items-center">
                  <div className="inline-block text-center w-[300px] max-w-full">
                    <img
                      className="w-[70px] max-w-full"
                      src="/images/no__recent__emailIcon2.png"
                      alt=""
                    />
                    <p className="text-[20px] text-center text-ipBlack__textColor font-biotif__SemiBold mt-[15px]">
                      No Past, Upcoming OR Today's Activities Available
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* edit activity modal */}
      {openModal.edit && (
        <AuthGuard
          permissions={[
            { module: ModuleNames.ACTIVITY, type: BasicPermissionTypes.UPDATE },
          ]}
        >
          <EditActivityModal
            id={openModal.id}
            isOpen={openModal.edit}
            onEdit={(data: any) => {
              refreshActivitySection(data.data);
              closeModal(data);
            }}
            closeModal={closeModal}
          />
        </AuthGuard>
      )}

      {/* mark as done Modal */}
      {openModal.complete && (
        <AuthGuard
          permissions={[
            { module: ModuleNames.ACTIVITY, type: BasicPermissionTypes.UPDATE },
          ]}
        >
          <MarkAsDoneModal
            isOpen={openModal.complete}
            closeModal={closeModal}
            onAdd={(data: any) => {
              refreshUpcomingActivity(data);
            }}
            activityId={openModal.id}
            activityTypeId={openModal.activityTypeId}
          />
        </AuthGuard>
      )}
      {/* activity view detail modal */}
      {openModal.view && (
        <DashboardActivityDetailView
          isOpen={openModal.view}
          closeViewModal={(activityDetail?: ActivityResponseType) =>
            closeModal(activityDetail)
          }
          onEdit={(data: any) => {
            if (data?.for_change_status) {
              setRecentLogsFlag((prev) => !prev);
              return setRecentActivityData((prev) => {
                const finIndex = prev.findIndex((obj) => obj.id === data.id);
                prev[finIndex].is_active = data.is_active;
                return [...prev];
              });
            }
            refreshActivitySection(data);
          }}
          activityId={openModal.id}
          activityTopic={openModal.activityTopic || ''}
          closeModalForDashboard={() => {
            if (modalRef.current) {
              modalRef.current.style.display = 'none';
            }
          }}
          modalRef={modalRef}
        />
      )}
    </>
  );
};

export default UpcomingActivitiesSection;
