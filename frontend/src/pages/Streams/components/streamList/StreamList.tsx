// ** Import Packages **
import { Children, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// ** Components **
import AddStreamModel from '../addStream/AddStreamModal';
import RecentLogs from 'pages/Dashboard/components/RecentLogs';
import AddStreamUserModel from '../addStream/AddStreamUserModal';
import {
  DateRangePickerComponent,
  PresetDirective,
  PresetsDirective,
  RangeEventArgs,
} from '@syncfusion/ej2-react-calendars';
import { DATE_PRESET } from 'components/EntityDetails/Timeline/constant/timelineField.constant';
import StreamManageModel from './StreamManageModal';
import StreamAllItemFilter from '../addStream/LogStreamModal';
import { StreamActionButton } from './StreamActionButton';
import DeleteModal from 'components/DeleteComponents/DeleteModal';
import NoDataFound from 'components/EntityDetails/Timeline/components/NoDataFound';

// ** Redux
import {
  getStreamListViewState,
  getStreamLogFilterState,
  setStreamList,
} from 'redux/slices/stream.Slice';

// ** Hooks **
import { useGetActivityTypes } from 'pages/Setting/module-setting/Activity/ActivityType/hooks/useActivityType';
import { useDeleteStreamByIdAPI } from 'pages/Streams/hooks/stream.service';
import FormField from 'components/FormField';
import { useForm } from 'react-hook-form';

// ** types ** //
import {
  AllItemFilterState,
  EditStreamType,
  StreamDataType,
  UserData,
  streamLogFilter,
} from 'pages/Streams/types/stream.type';
import { POLLING_INTERVAL } from 'constant/dataLimit.constant';
import useSetStreamData from 'pages/Streams/hooks/useSetStreamData';

const StreamList = () => {
  // ** Hooks **
  const { deleteStreamByIdAPI, isLoading: deleteStreamLoading } =
    useDeleteStreamByIdAPI();
  const formMethods = useForm<{ isAllowPollingEnabled: boolean }>();
  const { register } = formMethods;
  const { setStreamListData } = useSetStreamData();

  // ** Redux **
  const dispatch = useDispatch();
  const getStreamView = useSelector(getStreamListViewState);
  const filter = useSelector(getStreamLogFilterState);

  // ** States **
  const [filterState, setFilterState] = useState<AllItemFilterState>();
  const [streamData, setStreamData] = useState<StreamDataType>();
  const [editStream, setEditStream] = useState<EditStreamType>();
  const [userIds, setUserIds] = useState<string[]>([]);
  const [userData, setUserData] = useState<UserData>();
  const [tab, selectedTab] = useState<{
    label: string | undefined;
    id: number | 0;
  }>();
  const [userFilleter, setUserFilleter] = useState<boolean>(false);
  const [submit, setSubmit] = useState<boolean>(false);
  const [logFilleter, setLogFilleter] = useState<boolean>(false);
  const [searchVal, setSearchValue] = useState<string>('');
  const [dateRangeFilter, setDateRangeFilter] = useState<{
    startDate: string;
    endDate: string;
  }>();
  const [openStreamView, setOpenStreamView] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>();
  const [newList, isNewList] = useState<boolean>(false);
  const [isPolling, setPolling] = useState<boolean>();
  const [isDocument, setIsDocument] = useState<boolean>(false);
  const [logData, setLogData] = useState<streamLogFilter>();
  const { activityTypeData } = useGetActivityTypes({
    sort: 'name',
    fromTimelineFiler: true,
  });
  const [isFilleter, setIsFilleter] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [addStreamModal, setAddStreamModal] = useState<boolean>(false);
  const [pollingInterval, setPollingInterval] = useState<number | undefined>(
    POLLING_INTERVAL
  );

  // ** UseEffect **

  useEffect(() => {
    getStreamsData();
    setPolling(getStreamView?.isPolling);
  }, []);

  useEffect(() => {
    const dynamic_key = getStreamView?.sortStream?.streamData[0]?.id;

    if (getStreamView?.sortStream?.streamData?.length === 0) {
      getStreamsData();
    } else {
      setStreamData(getStreamView?.sortStream?.streamData);
      selectedTab(getStreamView?.tab);
      if (
        getStreamView?.sortStream?.selectedUserIs &&
        getStreamView?.sortStream?.selectedUserIs?.[dynamic_key]?.length
      ) {
        setUserIds(getStreamView?.sortStream?.selectedUserIs[dynamic_key]);
      } else {
        setUserIds(getStreamView?.userIds);
      }
      setUserData(getStreamView?.userData);
    }
  }, [submit]);

  useEffect(() => {
    if (streamData) {
      const users: any = [];
      const userId: string[] = [];
      streamData?.[0]?.streamUser?.forEach((element) => {
        userId.push(element?.user_id?.toString());
        users.push(element.users);
      });

      let selectedUserIds = getStreamView?.sortStream?.selectedUserIs;
      if (tab) {
        selectedUserIds = {
          ...getStreamView?.sortStream?.selectedUserIs,
          [tab.id]: userIds,
        };
      }

      dispatch(
        setStreamList({
          sortStream: {
            streamData,
            selectedUserIs: selectedUserIds,
          },
          tab: { label: streamData?.[0]?.name, id: streamData?.[0]?.id },
          userIds: [streamData?.[0]?.streamUser?.[0]?.user_id?.toString()],
          userData: {
            rows: users,
            count: users?.length,
          },
          isPolling,
        })
      );
    }
  }, [userIds]);

  useEffect(() => {
    if (newList) {
      if (streamData?.length) {
        const users: any = [];
        const userId: string[] = [];
        streamData?.[0]?.streamUser?.forEach((element) => {
          userId.push(element?.user_id?.toString());
          users.push(element.users);
        });
        dispatch(
          setStreamList({
            sortStream: {
              streamData,
              selectedUserIs: getStreamView?.sortStream?.selectedUserIs,
            },
            tab: { label: streamData?.[0]?.name, id: streamData?.[0]?.id },
            userIds: userId,
            userData: {
              rows: users,
              count: users?.length,
            },
            isPolling,
          })
        );
      }
      selectedTab({
        label: streamData?.[0]?.name,
        id: streamData?.[0]?.id || 0,
      });
      if (streamData?.[0]?.streamUser?.[0]?.user_id?.toString())
        setUserIds([streamData?.[0]?.streamUser[0]?.user_id?.toString()]);
    }
  }, [streamData, newList]);

  useEffect(() => {
    const data: any = [];
    const data1 = [
      {
        id: 'notes',
        name: 'Notes',
      },
      {
        id: 'documents',
        name: 'Documents',
      },
      {
        id: 'info',
        name: 'Info',
      },
      {
        id: 'emails_sent',
        name: 'Emails Sent',
      },
      {
        id: 'emails_received',
        name: 'Emails Received',
      },
    ];
    activityTypeData.forEach((element) => {
      data.push({ id: element.id.toString(), name: element.name });
    });
    data.push(...data1);
    setLogData(data);
  }, [activityTypeData]);

  useEffect(() => {
    const users: any = [];
    const userId: string[] = [];
    if (streamData) {
      streamData?.[0]?.streamUser?.forEach((element) => {
        userId.push(element?.user_id?.toString());
        users.push(element.users);
      });
      dispatch(
        setStreamList({
          sortStream: {
            streamData,
            selectedUserIs: getStreamView?.sortStream?.selectedUserIs,
          },
          tab: { label: streamData?.[0]?.name, id: streamData?.[0]?.id },
          userIds: userId,
          userData: {
            rows: users,
            count: users?.length,
          },
          isPolling,
        })
      );
    }
  }, [isPolling]);

  useEffect(() => {
    setStreamData(getStreamView?.sortStream?.streamData);
  }, [getStreamView]);

  // ** Functions , Event Handler  & API calls**

  const getStreamsData = async () => {
    // Get & Set Stream Data via hook

    setStreamListData({
      setStreamData,
      setUserIds,
      setUserData,
      selectedTab,
      streamData,
      isPolling,
      isEdit,
      setFilterState,
    });
  };

  const editStreamHandler = (stream: EditStreamType) => {
    setEditStream(stream);
    setAddStreamModal(true);
  };

  const removeStreamHandler = async () => {
    const id = tab?.id;
    if (id) await deleteStreamByIdAPI(id);
    const removedData = streamData?.filter((element) => element?.id !== id);
    const streamId = removedData?.[0]?.id?.toString() || '';
    setStreamData(removedData);

    const users: any = [];
    const userId: string[] = [];
    removedData?.[0]?.streamUser?.forEach((element) => {
      userId.push(element?.user_id?.toString());
      users.push(element.users);
    });
    selectedTab({
      label: streamData?.[0]?.name || '',
      id: streamData?.[0]?.id || 0,
    });
    dispatch(
      setStreamList({
        sortStream: {
          streamData: removedData || [],
          selectedUserIs: { [streamId]: userIds },
        },
        tab: {
          label: streamData?.[0]?.name || '',
          id: streamData?.[0]?.id || 0,
        },
        userIds: userId,
        userData: {
          rows: users,
          count: users?.length,
        },
        isPolling,
      })
    );
    setUserIds(userId);
    setDeleteModal(false);
  };

  const onStreamDetailClick = (streamDetails: EditStreamType) => {
    const userId: string[] = [];
    const users: any = [];
    const dynamic_key = streamDetails?.id;
    streamDetails.streamUser?.forEach((element) => {
      userId.push(element?.user_id?.toString());
      users.push(element.users);
    });
    setUserData({ rows: users, count: users?.length });

    if (
      getStreamView?.sortStream?.selectedUserIs?.[dynamic_key] &&
      getStreamView?.sortStream?.selectedUserIs?.[dynamic_key]?.length > 0
    ) {
      setUserIds(getStreamView?.sortStream?.selectedUserIs[dynamic_key]);
    } else {
      setUserIds(userId);
    }

    if (filter) {
      setFilterState(filter[streamDetails.id]);
    }
    const selectedUser = {
      ...getStreamView?.sortStream?.selectedUserIs,
      [streamDetails.id]: userId,
    };
    if (streamData)
      dispatch(
        setStreamList({
          sortStream: {
            streamData,
            selectedUserIs: selectedUser,
          },
          tab: { label: streamDetails.name, id: streamDetails.id },
          userIds: userId,
          userData: {
            rows: users,
            count: users?.length,
          },
          isPolling,
        })
      );
  };

  const handelUserFilleter = () => {
    setIsFilleter(true);
    setUserFilleter(true);
  };

  const handelLogFilleter = () => {
    setIsFilleter(true);
    setLogFilleter(true);
  };

  const handelStreamList = () => {
    setOpenStreamView(true);
  };

  const applyFilleter = () => {
    setUserFilleter(false);
    setIsFilleter(false);
    setLogFilleter(false);
  };

  const applyUserFilleter = () => {
    if (tab?.id) {
      const users: any = [];
      const userId: string[] = [];
      streamData?.[0]?.streamUser?.forEach((element) => {
        userId.push(element?.user_id?.toString());
        users.push(element.users);
      });
      if (userIds?.length === 0) {
        setPolling(true);
        setUserIds(userId);
      }
      setUserFilleter(false);
      setIsFilleter(false);
      setLogFilleter(false);
    }
  };

  const changePollingSetting = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPolling(event.target.checked);
  };
  const closeDeleteModal = () => {
    setDeleteModal(false);
  };
  const close = () => {
    isNewList(false);
    setOpenStreamView(false);
  };

  return (
    <div className="stream__page">
      <div className="page__topHeader page__topHeader__account bg-sdWhite__bg rounded-[10px] mb-[30px] shadow-[0px_0px_0px_0px_#00000005,_4px_5px_14px_0px_#00000005,_16px_20px_26px_0px_#00000005,_37px_45px_35px_0px_#00000003,_65px_80px_41px_0px_#0000,_102px_125px_45px_0px_#0000]">
        <div className="inner__wrapper">
          <div className="top__pinBar relative pt-[6px] border-b-[1px] border-b-whiteScreenBorderColor flex">
            <div className="scroll__wrapper overflow-x-auto ip__hideScrollbar w-auto max-w-full whitespace-pre">
              {Children.toArray(
                streamData?.map((element) => (
                  <>
                    <button
                      onClick={() => {
                        selectedTab({
                          label: element?.name,
                          id: element?.id,
                        });
                        setPollingInterval(POLLING_INTERVAL);
                        onStreamDetailClick(element);
                      }}
                      className={`${
                        element.name === tab?.label
                          ? "before:content-['']  before:absolute before:bottom-[-1px] before:left-0 before:w-full before:h-[2px] before:bg-primaryColorSD"
                          : ''
                      }  pin__item py-[16px] px-[14px] inline-flex items-center relative`}
                    >
                      <span className="textLabel text-[16px] text-sdNormal__textColor font-biotif__Regular max-w-[150px] whitespace-pre overflow-hidden text-ellipsis">
                        {element.name}
                      </span>
                      {element.name === tab?.label ? (
                        <>
                          <StreamActionButton
                            filedArray={[
                              {
                                label: 'Edit',
                                onClick: () => editStreamHandler(element),
                              },
                              {
                                label: 'Delete',
                                onClick: () => setDeleteModal(true),
                              },
                            ]}
                          />
                        </>
                      ) : null}
                    </button>
                  </>
                ))
              )}
            </div>

            <div className="sticky__btn__wrapper inline-flex items-center mr-[15px] ml-[15px] shrink-0 h-[44px]">
              <div
                className={`stream__list__wrapper relative ${
                  streamData?.length ? null : 'hidden'
                }  `}
              >
                <div
                  onClick={handelStreamList}
                  className="view__down__btn cursor-pointer w-[20px] h-[20px] bg-btnGrayColor rounded-full relative before:content-[''] before:absolute before:top-[5px] before:left-[6px] before:w-[7px] before:h-[7px] before:border-l-[1px] before:border-b-[1px] before:border-l-grayIconDarkColor before:border-b-grayIconDarkColor before:-rotate-45 before:duration-300 duration-300 hover:bg-primaryColorSD hover:before:border-l-white hover:before:border-b-white"
                />
                {openStreamView ? (
                  <>
                    <div className="add__dropdown__menu w-[260px] absolute top-[calc(100%_-_2px)] right-[0px] pt-[5px] z-[5]">
                      <div className="inner__wrapper bg-ipWhite__bgColor min-w-[150px] relative rounded-[10px] p-[16px] pt-[10px]">
                        <StreamManageModel
                          isNewList={isNewList}
                          close={close}
                          streamData={streamData}
                          setStreamData={setStreamData}
                        />
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
              <button
                className="text-[15px] text-sdNormal__textColor font-biotif__SemiBold ml-[10px] duration-300 hover:text-primaryColorSD hover:underline"
                onClick={() => {
                  setAddStreamModal(true);
                }}
              >
                + Stream
              </button>
            </div>
          </div>
          <div className="bottom__actionBar flex flex-wrap justify-between p-[10px]">
            <div className="search__bar w-[335px]">
              <div className="ip__form__hasIcon">
                <input
                  className="ip__input inner__shadow__field small__field"
                  placeholder="Search"
                  type="search"
                  value={searchVal}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                  }}
                />
                <div className="i__Icon !opacity-100 !top-[7px]">
                  <svg
                    width="18"
                    height="17"
                    viewBox="0 0 18 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.8085 15.385L13.8525 12.4287C14.9078 11.1662 15.5442 9.54212 15.5442 7.77207C15.5442 3.76213 12.2821 0.5 8.27212 0.5C4.26215 0.5 1 3.76213 1 7.77207C1 11.782 4.26215 15.0441 8.27212 15.0441C10.0425 15.0441 11.6666 14.4075 12.9287 13.3524L15.8851 16.3087C16.0126 16.4361 16.1799 16.4999 16.347 16.4999C16.5141 16.4999 16.6814 16.436 16.8087 16.3087C17.0639 16.0536 17.0637 15.6402 16.8085 15.385ZM2.30565 7.77207C2.30565 4.48225 4.9821 1.80584 8.27191 1.80584C11.5618 1.80584 14.2382 4.48228 14.2382 7.77207C14.2382 11.0619 11.5617 13.7383 8.27191 13.7383C4.98207 13.7383 2.30565 11.0619 2.30565 7.77207Z"
                      fill="#737373"
                      stroke="#737373"
                      strokeWidth="0.5"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="action__btn__wrapper flex">
              <div className="action__btn__item inline-flex pr-[14px] mr-[14px] relative before:content-[''] before:absolute before:right-0 before:w-[1px] before:h-[20px] before:bg-[#CCCCCC] last:before:hidden last:pr-0 last:mr-0">
                <button
                  onClick={handelLogFilleter}
                  className="action__btn flex items-center"
                >
                  <div className="icon__wrapper w-[20px] h-[20px] mr-[5px] relative top-[-1px]">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.46008 12.3681L11.101 12.3792C11.328 12.38 11.5118 12.5702 11.5118 12.8032V14.8515C11.5118 15.0854 11.379 15.2969 11.172 15.3948L7.86703 16.9467C7.78981 16.9825 7.70795 17 7.6261 17C7.51722 17 7.40834 16.9682 7.31336 16.9053C7.14734 16.7956 7.04695 16.6063 7.04695 16.4034V12.7921C7.04695 12.5574 7.23228 12.3673 7.46008 12.3681ZM15.4039 2C16.2857 2 17 2.73579 17 3.64419V4.79282C17 5.2335 16.8278 5.65667 16.522 5.96531L11.6432 10.9003C11.5591 10.9862 11.4448 11.0339 11.3266 11.0331L7.2417 11.0204C7.11737 11.0204 6.99923 10.9671 6.91429 10.874L2.43089 5.94304C2.15367 5.63838 2 5.23588 2 4.81827V3.64499C2 2.73658 2.71429 2 3.59614 2H15.4039Z"
                        fill="#737373"
                      />
                    </svg>
                  </div>
                  <span className="textLabel text-[16px] font-biotif__Medium text-[#737373]">
                    Filter
                  </span>
                </button>
              </div>
              <div className="action__btn__item inline-flex pr-[14px] mr-[14px] relative before:content-[''] before:absolute before:right-0 before:w-[1px] before:h-[20px] before:bg-[#CCCCCC] last:before:hidden last:pr-0 last:mr-0">
                <>
                  {' '}
                  <span className="textLabel text-[16px] font-biotif__Medium text-[#737373]">
                    <FormField
                      wrapperClass="toggleSwitch mb-0"
                      disabled={!!dateRangeFilter}
                      type="checkbox"
                      name="isAllowPollingEnabled"
                      checked={isPolling !== undefined && isPolling}
                      register={register}
                      onChange={($event) => {
                        changePollingSetting(
                          $event as React.ChangeEvent<HTMLInputElement>
                        );
                      }}
                    />
                  </span>
                  <span className="textLabel text-[16px] font-biotif__Medium text-[#737373] pl-[8px]">
                    Real time Data
                  </span>
                </>
              </div>

              <div className="action__btn__item inline-flex pr-[14px] mr-[14px] relative before:content-[''] before:absolute before:right-0 before:w-[1px] before:h-[20px] before:bg-[#CCCCCC] last:before:hidden last:pr-0 last:mr-0">
                <button
                  onClick={handelUserFilleter}
                  className="action__btn flex items-center"
                >
                  <div className="icon__wrapper w-[20px] h-[20px] mr-[5px] relative top-[-1px]">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.57035 10.3106H10.429C12.6943 10.3106 14.548 12.1348 14.548 14.3654V14.7362C14.548 15.3673 14.0248 15.8824 13.383 15.8824H6.61572C5.97394 15.8824 5.45074 15.3673 5.45074 14.7362V14.3654C5.45074 12.1354 7.30444 10.3106 9.57035 10.3106ZM3.90082 4.11768C2.66164 4.11768 1.65774 5.10592 1.65774 6.32578C1.65774 7.54564 2.66164 8.53389 3.90082 8.53389C5.13936 8.53389 6.1439 7.54564 6.1439 6.32578C6.1439 5.10655 5.13999 4.11768 3.90082 4.11768ZM16.0992 4.11768C17.3384 4.11768 18.3423 5.10592 18.3423 6.32578C18.3423 7.54564 17.3384 8.53389 16.0992 8.53389C14.8606 8.53389 13.8561 7.54564 13.8561 6.32578C13.8561 5.10655 14.86 4.11768 16.0992 4.11768ZM15.7307 9.36232H16.4676C18.4101 9.36232 20 10.9274 20 12.8396V13.1574C20 13.6992 19.5516 14.1406 19.0012 14.1406H15.5107C15.4384 12.5462 14.6013 11.1403 13.3538 10.2725C13.9823 9.70755 14.8175 9.36232 15.7307 9.36232ZM4.26927 9.36232H3.53236C1.58988 9.36232 0 10.9274 0 12.8396V13.1574C0 13.6992 0.448362 14.1406 0.998827 14.1406H4.48933C4.56163 12.5462 5.39874 11.1403 6.64616 10.2725C6.01769 9.70755 5.18248 9.36232 4.26927 9.36232ZM10.0003 4.26688C11.445 4.26688 12.6157 5.41932 12.6157 6.84144C12.6157 8.26357 11.445 9.41601 10.0003 9.41601C8.55567 9.41601 7.38498 8.26357 7.38498 6.84144C7.38498 5.41932 8.55567 4.26688 10.0003 4.26688Z"
                        fill="#737373"
                      />
                    </svg>
                  </div>
                  <span className="textLabel text-[16px] font-biotif__Medium text-[#737373]">
                    Users
                  </span>
                </button>
              </div>
              <div className="action__btn__item date__range inline-flex pr-[14px] mr-[14px] relative before:content-[''] before:absolute before:right-0 before:w-[1px] before:h-[20px] before:bg-[#CCCCCC] last:before:hidden last:pr-0 last:mr-0">
                <button className="action__btn flex items-center">
                  <DateRangePickerComponent
                    strictMode
                    change={(args: RangeEventArgs) => {
                      if (args.startDate && args.endDate) {
                        setDateRangeFilter({
                          ...(args.startDate && {
                            startDate: args.startDate.toISOString(),
                          }),

                          endDate: new Date(
                            new Date(args.endDate || new Date()).setHours(
                              23,
                              59,
                              0,
                              0
                            )
                          ).toISOString(),
                        });
                      } else {
                        setDateRangeFilter(undefined);
                      }
                    }}
                    endDate={undefined}
                    startDate={undefined}
                  >
                    <PresetsDirective>
                      {DATE_PRESET.map((date, key) => (
                        <PresetDirective
                          key={`${key}_preset`}
                          label={date.label}
                          start={date.start}
                          end={date.end}
                        />
                      ))}
                    </PresetsDirective>
                  </DateRangePickerComponent>
                  <div className="icon__wrapper flex items-center justify-center w-[20px] h-[20px] mr-[5px] relative top-[-1px]">
                    <svg
                      width="16"
                      height="18"
                      viewBox="0 0 16 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.8226 1.92951e-06C11.1859 -0.00085127 11.4731 0.281344 11.4739 0.657605L11.4747 1.29896C13.8315 1.48367 15.3884 3.08962 15.3909 5.55241L15.4002 12.7612C15.4036 15.4464 13.7166 17.0985 11.0127 17.1028L4.40778 17.1113C1.72071 17.1147 0.0126822 15.4233 0.00930333 12.7304L5.67018e-06 5.60629C-0.00336754 3.12724 1.49855 1.52557 3.85533 1.30922L3.85449 0.667866C3.85364 0.291606 4.1324 0.00855525 4.50408 0.00855525C4.87576 0.00770011 5.15452 0.289896 5.15536 0.666156L5.15621 1.26475L10.1739 1.25791L10.173 0.659315C10.1722 0.283054 10.4509 0.000859006 10.8226 1.92951e-06ZM11.1673 12.1421H11.1588C10.7702 12.1515 10.4585 12.4773 10.467 12.8707C10.4678 13.264 10.7812 13.5881 11.1698 13.5967C11.566 13.5958 11.887 13.27 11.8861 12.8681C11.8861 12.4662 11.5643 12.1421 11.1673 12.1421ZM4.20674 12.143C3.81817 12.1601 3.51406 12.4859 3.51491 12.8792C3.53265 13.2726 3.85364 13.5804 4.24222 13.5625C4.62319 13.5454 4.92644 13.2196 4.9087 12.8262C4.90026 12.4414 4.58686 12.1421 4.20674 12.143ZM7.687 12.1387C7.29843 12.1566 6.99517 12.4816 6.99517 12.875C7.01291 13.2683 7.33391 13.5753 7.72248 13.5582C8.10261 13.5403 8.40671 13.2153 8.38897 12.8211C8.38052 12.4371 8.06713 12.1378 7.687 12.1387ZM4.20252 9.06446C3.81394 9.08157 3.51069 9.40737 3.51153 9.80074C3.52842 10.1941 3.85027 10.502 4.23884 10.484C4.61896 10.4669 4.92222 10.1411 4.90448 9.74772C4.89603 9.36291 4.58349 9.06361 4.20252 9.06446ZM7.68362 9.03453C7.29505 9.05164 6.99095 9.37745 6.99179 9.77081C7.00869 10.1642 7.33053 10.4712 7.7191 10.4541C8.09923 10.4361 8.40248 10.1112 8.38559 9.71779C8.3763 9.33298 8.06375 9.03368 7.68362 9.03453ZM11.1639 9.03881C10.7753 9.04736 10.4712 9.36376 10.4721 9.75713V9.76653C10.4805 10.1599 10.8015 10.4583 11.1909 10.4498C11.571 10.4404 11.8743 10.1146 11.8659 9.72121C11.8481 9.34495 11.5432 9.03796 11.1639 9.03881ZM10.1756 2.57482L5.1579 2.58166L5.15874 3.27347C5.15874 3.64204 4.88083 3.93278 4.50915 3.93278C4.13747 3.93364 3.85787 3.64375 3.85787 3.27518L3.85702 2.61673C2.20981 2.78177 1.29835 3.74978 1.30088 5.60458L1.30173 5.87052L14.0909 5.85342V5.55412C14.0545 3.71558 13.1321 2.75098 11.4764 2.60732L11.4773 3.26578C11.4773 3.63348 11.1909 3.92509 10.8277 3.92509C10.456 3.92594 10.1764 3.63519 10.1764 3.26749L10.1756 2.57482Z"
                        fill="#737373"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {editStream && addStreamModal ? (
        <>
          <AddStreamModel
            streamData={editStream}
            setSubmit={setSubmit}
            setIsEdit={setIsEdit}
            setEditStream={setEditStream}
            getStreamsData={getStreamsData}
            addStreamModal={addStreamModal}
            setAddStreamModal={setAddStreamModal}
          />
        </>
      ) : null}
      {addStreamModal && !editStream ? (
        <>
          <AddStreamModel
            setAddStreamModal={setAddStreamModal}
            setSubmit={setSubmit}
            addStreamModal={addStreamModal}
          />
        </>
      ) : null}

      {userIds && userIds?.length > 0 ? (
        <>
          <RecentLogs
            recentLogsFlag
            userIds={userIds}
            setIsDocument={setIsDocument}
            isDocument={isDocument}
            setPollingInterval={setPollingInterval}
            pollingInterval={pollingInterval}
            isPolling={isPolling}
            isFilleter={isFilleter}
            searchValue={searchVal}
            dateRangeFilter={dateRangeFilter}
            filterState={filterState}
          />
        </>
      ) : (
        <NoDataFound />
      )}
      {userFilleter && userData ? (
        <>
          <AddStreamUserModel
            isSelectUserVisible={userFilleter}
            setIsSelectUserVisible={setUserFilleter}
            userData={userData}
            onSubmit={applyUserFilleter}
            pushIdIntoUserArray={setUserIds}
            userIdArray={userIds}
            isFilleter={isFilleter}
            setIsFilleter={setIsFilleter}
          />
        </>
      ) : null}
      {logFilleter ? (
        <StreamAllItemFilter
          isFilterVisible={logFilleter}
          setIsSelectFilterVisible={setLogFilleter}
          onSubmit={applyFilleter}
          setFilterState={setFilterState}
          tab={tab}
          isFilleter={isFilleter}
          filterState={filterState}
          activityTypeData={activityTypeData}
          logData={logData}
          setIsFilleter={setIsFilleter}
        />
      ) : null}
      {deleteModal ? (
        <>
          <DeleteModal
            closeModal={closeDeleteModal}
            isOpen={deleteModal}
            isLoading={deleteStreamLoading}
            deleteOnSubmit={removeStreamHandler}
            moduleName="this stream"
          />
        </>
      ) : null}
    </div>
  );
};

export default StreamList;
