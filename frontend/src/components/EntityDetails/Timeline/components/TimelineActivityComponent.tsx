import { TimelineModelName } from 'constant/timeline.constant';
import { Fragment, useEffect, useRef, useState } from 'react';
import { ActivityResponseType } from 'pages/Activity/types/activity.types';
import useGetActivity from 'pages/Activity/hooks/useGetActivity';
import _ from 'lodash';
import { useNavigate, useParams } from 'react-router-dom';
import { renderIconBasedOnModuleAndAction } from '../helper';
import Icon from 'components/Icon';
import Image from 'components/Image';
import DateTimeSince from 'components/DateFormat/DateTimeSince';
import { useSelector, useDispatch } from 'react-redux';
import {
  getIsModuleActivityTimelineLoad,
  setDetailSectionView,
  setLoadModuleActivityTimelines,
  setLoadTimeLines,
} from 'redux/slices/commonSlice';

import { convertNumberOrNull, setUrlParams } from 'utils/util';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import useWindowDimensions from 'hooks/useWindowDimensions';

import EditActivityModal from 'pages/Activity/components/Modal/EditActivityModal';
import {
  BasicPermissionTypes,
  ModuleNames,
} from 'constant/permissions.constant';
import AuthGuard from 'pages/auth/components/AuthGuard';
// Redux
import { getDetailSection } from 'redux/slices/authSlice';
import ActivityModuleWiseTimelineDisplay from '../ActivityModuleWiseTimelineDisplay';
import MarkAsDoneModal from 'pages/Activity/components/Modal/MarkAsDoneModal';
import DashboardActivityDetailView from 'pages/Dashboard/components/DashboardActivityDetailView';
import { TimelineOpenActivityModalType } from '../types';
import {
  useChangeActivityStatusByIdMutation,
  useUpdateActivityMutation,
} from 'redux/api/activityApi';

type Props = {
  modelName: TimelineModelName;
  type: string;
};
const TimelineActivityComponent = (props: Props) => {
  /* Props */
  const { modelName, type } = props;
  const modalRef = useRef<HTMLDivElement>(null);
  const typeLower = type.toLowerCase();
  let activityFetchCondition = 'q[start_date][lte]';
  let tabColor = 'bg-[#D30E17]';
  if (type === 'Upcoming') {
    activityFetchCondition = 'q[start_date][gte]';
    tabColor = 'bg-[#24BD64]';
  }

  /* Hooks */
  const navigate = useNavigate();

  // ** Store **
  const dispatch = useDispatch();
  const section = useSelector(getDetailSection);
  const isActivityRefresh = useSelector(getIsModuleActivityTimelineLoad);

  // ** APIS **
  const [updateActivityByIdAPI] = useUpdateActivityMutation();
  const [changeActivityStatusByIdAPI] = useChangeActivityStatusByIdMutation();

  // ** custom hooks **
  const { fetchActivityData, currentData: activityCurrentData } =
    useGetActivity();
  const { isMobileView } = useWindowDimensions();

  /* URL ID */
  const { id } = useParams();
  const actStoreId = convertNumberOrNull(id);

  /* State */
  const [activities, setActivities] = useState<ActivityResponseType[]>([]);
  const [permissionArray, setPermissionArray] = useState<
    { label: string; onClick: () => void; id: number }[]
  >([]);
  const [openActivityModal, setOpenActivityModal] =
    useState<TimelineOpenActivityModalType>({
      view: false,
      id: null,
      activityTopic: '',
      edit: false,
      complete: false,
      historyId: null,
    });
  const [accordion, setAccordion] = useState<{ [key: string]: boolean }>({
    ...(section?.[`${actStoreId}_activity`] || {
      upcoming: false,
      overdue: false,
    }),
  });

  useEffect(() => {
    dispatch(
      setDetailSectionView({ [`${actStoreId}_activity`]: { ...accordion } })
    );
  }, [accordion]);

  /* Use Effect */
  useEffect(() => {
    getUpcomingActivityData();
  }, []);

  useEffect(() => {
    if (isActivityRefresh) {
      dispatch(
        setLoadModuleActivityTimelines({
          moduleActivityTimeline: false,
        })
      );
      getUpcomingActivityData();
    }
  }, [isActivityRefresh]);

  useEffect(() => {
    // HELLO
    if (_.isArray(activityCurrentData?.rows)) {
      setActivities(activityCurrentData.rows);
    }
  }, [JSON.stringify(activityCurrentData?.rows)]);

  const getUpcomingActivityData = async () => {
    await fetchActivityData({
      limit: 5,
      sort: 'start_date',
      'q[completed_by]': null,
      [activityFetchCondition]: new Date(
        new Date().toDateString()
      ).toISOString(),
      ...(id &&
        modelName === 'contacts' && {
          'q[activity_contact_id]': `n|${id}`,
        }),
      ...(id &&
        (modelName === 'leads' || modelName === 'deals') && {
          'q[activity_lead_id]': `n|${id}`,
        }),
      ...(id &&
        modelName === 'accounts' && {
          'q[activity_account_id]': `n|${id}`,
        }),
    });
  };

  const openCloseAccordion = (accType: string) => {
    setAccordion({
      ...accordion,
      [accType]: !accordion[accType],
    });
  };

  const refreshTimeline = () => {
    getUpcomingActivityData();
    setPermissionArray([]);
    dispatch(
      setLoadTimeLines({
        timeline: true,
      })
    );
  };

  async function changeActivityStatus(ac_id: number, is_active: boolean) {
    const data = await changeActivityStatusByIdAPI({
      id: ac_id,
      data: {
        is_active,
      },
    });

    if ('data' in data && data.data) {
      refreshTimeline();
    }
  }

  async function reOpenActivity(ac_id: number) {
    const data = await updateActivityByIdAPI({
      id: ac_id,
      data: {
        completed: false,
      },
    });
    if ('data' in data) {
      refreshTimeline();
    }
  }

  const handleActivityClick = (aVal: ActivityResponseType) => {
    if (permissionArray.length) {
      return setPermissionArray([]);
    }

    const tempPermissionArray = [];

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
          setOpenActivityModal({
            edit: true,
            complete: false,
            view: false,
            id: aVal?.id,
            activityTypeId: aVal?.activity_type?.id,
            activityTopic: aVal?.topic,
          });
        }
      },
      id: aVal?.id,
    });

    tempPermissionArray.push(
      {
        label: `${aVal?.is_active ? 'Stop' : 'Start'} ${
          aVal?.activity_type?.name || ''
        }`,
        onClick: () => {
          changeActivityStatus(aVal?.id, !aVal?.is_active);
        },
        id: aVal?.id,
      },
      {
        label: `${aVal?.completed_by ? 'Re-Open' : 'Mark As Done'}`,
        onClick: () => {
          if (aVal?.completed_by) {
            reOpenActivity(aVal?.id);
          } else {
            setOpenActivityModal({
              edit: false,
              complete: true,
              id: aVal?.id,
              activityTypeId: aVal?.activity_type?.id,
              view: false,
              activityTopic: aVal.topic,
            });
          }
        },
        id: aVal?.id,
      }
    );
    setPermissionArray(tempPermissionArray);
  };

  const closeModal = (data?: any) => {
    modalRef.current?.style.removeProperty('display');
    if (data) {
      setOpenActivityModal({
        activityTopic: data?.topic,
        id: data?.id,
        view: !openActivityModal?.edit,
        edit: false,
        complete: false,
      });
    } else {
      setOpenActivityModal({
        activityTopic: '',
        id: null,
        view: false,
        edit: false,
        complete: false,
      });
    }
  };

  /* Close Function */

  return (
    <div className="">
      {activities?.length > 0 ? (
        <>
          <div className="flex flex-wrap items-center bg-[#ECF2F6] rounded-[10px] py-[8px] px-[15px] pr-[8px] mb-[15px] 3xl:pl-[15px] cursor-pointer">
            <div
              className="w-[calc(100%_-_32px)] flex items-center"
              onClick={() => openCloseAccordion(typeLower)}
            >
              <span
                className={`w-[11px] h-[11px] relative top-[-1px] rounded-full ${tabColor} mr-[9px]`}
              />
              <span className="text pt-[2px] text-[16px] font-biotif__Medium text-ipBlack__textColor pr-[10px] w-[calc(100%_-_22px)]">
                {type} ({activities.length})
              </span>
            </div>
            <button
              className={`section__toggle__btn w-[30px] h-[30px] rounded-[7px] text-[0px] relative duration-500 hover:bg-white before:content-[''] before:absolute before:left-[10px] before:w-[10px] before:h-[10px] before:border-l-[2px] before:border-l-black before:border-b-[2px] before:border-b-black ${
                accordion[typeLower]
                  ? 'before:-rotate-45 before:top-[7px]'
                  : 'before:rotate-[-225deg] before:top-[8px]'
              }`}
              onClick={() => openCloseAccordion(typeLower)}
            >
              .
            </button>
          </div>
          {accordion[typeLower] && (
            <div className="timeline__body__wrapper">
              <div className="timeline__dashed__wrapper relative before:content-[''] before:absolute before:top-[75px] before:left-[-36px] before:w-[1px] before:h-[calc(100%_-_85px)] before:border-dashed before:border-l-[2px] before:border-l-primaryColor before:opacity-20 sm:mt-[-38px] sm:before:left-[-31px] sm:before:hidden xsm:before:left-[-22px] xsm:before:border-l-[1px] before:hidden">
                <div className="timeline__day__repeater mb-[10px] relative before:content-[''] before:absolute before:top-[26px] before:left-[18px] before:h-[100%] before:w-[1px] before:border-dashed before:border-l-[2px] before:border-[#CCC]/50 last:before:hidden">
                  <div className="timelineDay__box w-[calc(100%_-_57px)] ml-auto relative mb-[25px] sm:p-[15px] sm:pb-[7px] sm:mb-[15px]">
                    <Icon
                      className="timelineBox__icon w-[44px] h-[44px] bg-[#F2F6F9] rounded-[6px] !p-[7px] absolute top-0 left-[-59px] sm:left-[-53px] sm:top-[10px] sm:hidden xsm:w-[29px] xsm:h-[29px] xsm:!p-[6px] xsm:left-[-37px] xsm:top-[9px]"
                      iconType={renderIconBasedOnModuleAndAction({
                        module: 'Activities',
                      })}
                    />
                    <div className="flex flex-wrap items-center bg-[#ECF2F6] rounded-[12px] py-[10px] px-[15px] mb-[14px] sm:mb-[15px] xsm:py-[4px] xsm:px-[8px] xsm:rounded-[6px]">
                      <span className="text text-[16px] font-biotif__Medium text-ipBlack__textColor w-[calc(100%_-_24px)] capitalize xsm:text-[14px]">
                        Activities
                      </span>
                    </div>
                    {Object.keys(activities).map((key) => {
                      const startDate = activities[Number(key)]?.created_at;
                      const activity_type =
                        activities[Number(key)]?.activity_type?.name;
                      return (
                        <div
                          className="timeline__box__new__inner relative mb-[13px] pt-[3px] pb-[12px] border-b border-b-[#CCCCCC]/50 last:pb-0 last:mb-0 last:border-b-0"
                          key={key}
                        >
                          <div className="timeline__box__new flex flex-wrap items-start">
                            <div className="timeline__header__action flex items-center w-full justify-between">
                              <h3 className="timeline__title w-[calc(100%_-_60px)] text-[18px] font-biotif__Medium text-primaryColor mb-[8px] pr-[14px]">
                                {activity_type}
                              </h3>
                              <div className="action__btn__wrapper inline-flex items-center mb-[8px]  upcomingBtn relative">
                                <Icon
                                  className="cursor-pointer bg-[#F2F6F9] rounded-[6px] w-[32px] h-[32px] p-[6px] mr-[10px] last:mr-0 duration-300 hover:bg-primaryColor"
                                  iconType="eyeFilled"
                                  onClick={() =>
                                    setOpenActivityModal({
                                      activityTopic:
                                        activities[Number(key)]?.topic,
                                      id: activities[Number(key)]?.id,
                                      view: true,
                                      edit: false,
                                      complete: false,
                                    })
                                  }
                                />

                                <Icon
                                  onClick={() =>
                                    handleActivityClick(activities[Number(key)])
                                  }
                                  className="toggle__btn cursor-pointer bg-[#F2F6F9] rounded-[6px] w-[32px] h-[32px] p-[9px] last:mr-0 duration-300 hover:bg-primaryColor"
                                  iconType="toggle3dotsIcon"
                                />

                                {permissionArray.length ? (
                                  <div className="add__dropdown__menu absolute z-[3] top-[calc(100%_-_2px)] right-[0px] pt-[9px]">
                                    <div className="inner__wrapper bg-ipWhite__bgColor min-w-[108px] relative rounded-[10px]">
                                      {permissionArray.map((val, index) => {
                                        return (
                                          <Fragment key={index}>
                                            {val?.id ===
                                            activities[Number(key)]?.id ? (
                                              <div
                                                className="item"
                                                onClick={val.onClick}
                                              >
                                                <div className="flex items-center relative z-[2] cursor-pointer">
                                                  <span className="text whitespace-pre text-[14px] font-biotif__Medium inline-block ml-[2px] text-ipBlack__textColor">
                                                    {val.label}
                                                  </span>
                                                </div>
                                              </div>
                                            ) : null}
                                          </Fragment>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                            <div className="w-full">
                              <div className="flex flex-wrap mb-[10px] last:mb-[0px]">
                                <div className="img__wrapper w-[40px] h-[40px] sm:w-[28px] sm:h-[28px]">
                                  <Image
                                    first_name={
                                      activities[Number(key)]?.creator
                                        ?.first_name
                                    }
                                    last_name={
                                      activities[Number(key)]?.creator
                                        ?.last_name
                                    }
                                    serverPath
                                  />
                                </div>

                                <ActivityModuleWiseTimelineDisplay
                                  setOpenActivityModal={setOpenActivityModal}
                                  activities={activities[Number(key)]}
                                  timeline_model_name={modelName}
                                />
                              </div>
                            </div>
                            <div className="author__time__wrapper mt-[12px]">
                              <span className="author__tag inline-block text-[14px] font-biotif__Medium text-black mr-[11px] mb-[4px]">
                                {`${
                                  activities[Number(key)]?.creator
                                    ?.first_name || ''
                                } ${
                                  activities[Number(key)]?.creator?.last_name ||
                                  ''
                                }`}
                              </span>
                              <span className="inline-block text-[#808080]/80 text-[14px] font-biotif__Regular mb-[4px]">
                                <DateTimeSince date={startDate as string} />
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
          {openActivityModal.edit && openActivityModal.id && (
            <AuthGuard
              permissions={[
                {
                  module: ModuleNames.ACTIVITY,
                  type: BasicPermissionTypes.CREATE,
                },
              ]}
            >
              <EditActivityModal
                id={openActivityModal.id}
                isOpen={openActivityModal.edit}
                closeModal={closeModal}
                onEdit={() => refreshTimeline()}
              />
            </AuthGuard>
          )}

          {openActivityModal.view && openActivityModal.id && (
            <DashboardActivityDetailView
              isOpen={openActivityModal.view}
              closeViewModal={(activityDetail?: ActivityResponseType) => {
                closeModal(activityDetail);
              }}
              activityId={openActivityModal.id}
              activityTopic={openActivityModal.activityTopic || ''}
              closeModalForDashboard={() => {
                if (modalRef.current) {
                  modalRef.current.style.display = 'none';
                }
              }}
              modalRef={modalRef}
              refreshTimeline={refreshTimeline}
            />
          )}

          {openActivityModal.complete && (
            <MarkAsDoneModal
              isOpen={openActivityModal.complete}
              closeModal={closeModal}
              activityId={openActivityModal.id || 0}
              activityTypeId={openActivityModal.activityTypeId}
              onAdd={() => refreshTimeline()}
            />
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default TimelineActivityComponent;
