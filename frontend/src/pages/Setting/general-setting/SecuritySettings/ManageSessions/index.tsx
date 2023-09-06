import Button from 'components/Button';
import Icon from 'components/Icon';
import { BREAD_CRUMB } from 'constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';
import SettingLayout from 'pages/Setting/components/SettingLayout';
import { useRemoveUserSessionAPI } from './services/session.service';
import { useEffect, useState } from 'react';
import { UserSession } from './types/userSession.types';
import AlertModal from 'components/Modal/AlertModal';
import { isOrganizationOwner } from 'utils/is';
import InfiniteScroll from 'components/InfiniteScroll';
import { useLazyGetUserSessionQuery } from 'redux/api/userSessionApi';

const ManageSessions = () => {
  const [
    getUserSessionsAPI,
    { isFetching: isFetchSessionLoading, isLoading: isSessionsLoad },
  ] = useLazyGetUserSessionQuery();
  const { removeUserSessionAPI } = useRemoveUserSessionAPI();
  const [sessionsData, setSessionsData] = useState<UserSession[]>();
  const [userSessions, setUserSessions] = useState<UserSession[]>();
  const [searchText, setSearchText] = useState<{
    searchText: string;
    searchFields: string;
  }>({
    searchText: '',
    searchFields: 'first_name,last_name',
  });
  const [sessionPageInfo, setSessionPageInfo] = useState<{
    page: number;
    hasMore: boolean;
  }>({
    page: 1,
    hasMore: true,
  });
  const [isOpen, setIsOpen] = useState({
    sessionId: '',
    isOpen: false,
  });

  useEffect(() => {
    getSessions();
  }, []);

  useEffect(() => {
    if (!isSessionsLoad && sessionPageInfo.hasMore && isOrganizationOwner()) {
      getSessions();
    }
  }, [sessionPageInfo]);

  const getSessions = async (search?: string) => {
    const data = await getUserSessionsAPI({
      params: {
        ...(search ? { ...searchText, searchText: search } : {}),
      },
    });
    if ('data' in data) {
      if (data.data?.user?.documents?.length) {
        setSessionsData(data?.data?.user?.documents || []);
      }
      if (data.data?.usersSession?.length) {
        setUserSessions(data.data?.usersSession);
        if (data.data?.usersSession?.length < 10 && sessionPageInfo.hasMore) {
          setSessionPageInfo((prev) => {
            return { ...prev, hasMore: false };
          });
        }
      }
    }
  };

  const removeSession = async () => {
    if (isOpen.isOpen && isOpen.sessionId) {
      const { data, error } = await removeUserSessionAPI(isOpen.sessionId);
      if (data || !error) {
        getSessions();
        setIsOpen({ sessionId: '', isOpen: false });
      }
    }
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target?.value;
    setSearchText({
      ...searchText,
      searchText: search,
    });
    setSessionPageInfo({ page: 1, hasMore: true });
    getSessions(search);
  };

  return (
    <SettingLayout
      title="Security Settings"
      breadCrumbPath={
        BREAD_CRUMB.settings.generalSettings.securitySettings.manageSessions
      }
      sideBarLinks={SETTING_SIDEBAR.securitySettings}
    >
      <div className="mb-[20px]">
        <h3 className="text-[16px] font-biotif__Medium text-black mb-[5px]">
          Manage Sessions
        </h3>

        {/* <p className="text-[16px] font-biotif__Regular text-black/50">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore{' '}
        </p> */}
      </div>

      <div className="flex flex-wrap mx-[-10px]">
        {sessionsData?.map((session, index) => {
          return (
            <SessionInfoCard
              key={`${index}_session_info`}
              session={session}
              setIsOpen={setIsOpen}
            />
          );
        })}
      </div>
      {isOrganizationOwner() && (
        <>
          <div className="inner__wrapper flex flex-wrap w-full justify-between">
            <h3 className="text-[18px] leading-[24px] font-biotif__Medium text-black mb-[10px] max-w-[50%] whitespace-pre overflow-hidden text-ellipsis sm:inline-block sm:pr-[10px] sm:mt-[9px]">
              User Sessions
            </h3>
            <div className="header__searchBox w-[255px] lg:w-[calc(100%_-_258px)] sm:w-full sm:flex">
              <div className="form__Group mb-[10px] sm:w-full sm:mr-0">
                <div className="ip__form__hasIcon">
                  <input
                    type="text"
                    onChange={onSearchChange}
                    className="ip__input"
                    placeholder="Search here..."
                    value={searchText.searchText}
                    maxLength={50}
                  />
                  <Icon
                    className="i__Icon grayscale"
                    iconType="searchStrokeIcon"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            className="flex flex-wrap mx-[-10px]"
            id="user_session_infiniteScroll"
          >
            <InfiniteScroll
              hasMore={sessionPageInfo.hasMore}
              next={() =>
                sessionPageInfo.hasMore &&
                setSessionPageInfo((prev) => ({
                  ...prev,
                  page: prev.page + 1,
                }))
              }
              isLoading={isFetchSessionLoading}
              scrollableTarget="user_session_infiniteScroll"
            >
              {userSessions &&
                userSessions?.length > 0 &&
                userSessions?.map((session, index) => {
                  return (
                    <SessionInfoCard
                      key={`${index}_user_session_info`}
                      session={session}
                      setIsOpen={setIsOpen}
                    />
                  );
                })}
            </InfiniteScroll>
          </div>
        </>
      )}
      <AlertModal
        visible={isOpen.isOpen}
        onClose={() => setIsOpen({ ...isOpen, isOpen: false })}
        onCancel={() => setIsOpen({ ...isOpen, isOpen: false })}
        onSubmit={() => removeSession()}
        width="800px"
        submitButtonText="Yes"
        cancelButtonText="No"
        submitButtonClass="bg-ip__SuccessGreen"
        customIcon={<Icon className="w-full h-full" iconType="alertIcon" />}
      >
        <h5 className="confirmation__title">
          Are you sure you want to disconnect this device
        </h5>
      </AlertModal>
    </SettingLayout>
  );
};

export default ManageSessions;

interface Props {
  session: UserSession;
  setIsOpen: (
    value: React.SetStateAction<{
      sessionId: string;
      isOpen: boolean;
    }>
  ) => void;
}

const SessionInfoCard = (props: Props) => {
  const { deviceData, first_name, last_name, email } =
    props?.session?.value || {};

  return (
    <div className="px-[10px] w-1/3 mb-[20px]">
      <div className="border border-[#CCCCCC]/50 rounded-[12px] flex flex-wrap items-center py-[15px] px-[15px] mb-[14px] h-full">
        <div className="border-b border-b-[#CCCCCC]/50 pb-[14px] mb-[14px] w-full flex justify-between items-center">
          <div className="inline-flex items-center">
            <Icon
              className="!w-[46px] !h-[46px] shrink-0 !p-0"
              iconType={
                deviceData?.device?.type !== 'desktop'
                  ? 'mobileStrokeIcon'
                  : 'laptopStrokeIcon'
              }
            />
            <div className="flex flex-wrap items-center ml-[14px]">
              <p className="text-[16px] w-full font-biotif__SemiBold text-ipBlack__textColor leading-[20px]">
                Device
              </p>
              <p className="text-[16px] w-full font-biotif__Regular text-ipBlack__textColor leading-[20px] capitalize">
                {deviceData?.device?.type}
              </p>
            </div>
          </div>
          <Button
            className="shrink-0 bg-[#1776BA]/10 py-[10px] px-[10px] text-[14px] font-biotif__Medium text-primaryColor hover:!bg-primaryColor hover:!text-white"
            onClick={() =>
              props?.setIsOpen({
                isOpen: true,
                sessionId: props?.session?.value?.sessionId,
              })
            }
          >
            Disconnect
          </Button>
        </div>
        <div className="w-full mb-[10px] last:mb-0">
          <div className="value__row font-biotif__Medium text-[14px] text-ipBlack__textColor">
            <span className="capitalize label">Name :-</span>{' '}
            <span className="capitalize inline-block text-light__TextColor">
              {`${first_name} ${last_name}`}
            </span>
          </div>
          <div className="value__row font-biotif__Medium text-[14px] text-ipBlack__textColor">
            <span className="capitalize label">Email :-</span>{' '}
            <span className="inline-block text-light__TextColor">
              {email || ''}
            </span>
          </div>
        </div>
        {deviceData &&
          Object.entries(deviceData)
            .reverse()
            .map((item) => {
              if (item[0] === 'os') item[0] = 'Operating System';
              return (
                <div
                  key={`${item[0]}_session`}
                  className="w-full mb-[10px] flex flex-wrap last:mb-0"
                >
                  <span className="device__name w-full mb-[6px] text-[16px] font-biotif__SemiBold text-black whitespace-pre overflow-hidden text-ellipsis capitalize">
                    {item[0]}
                  </span>
                  <div className="mx-[-8px] w-full flex flex-wrap">
                    {Object.entries(item[1]).map((val) => {
                      if (val[1] !== '')
                        return (
                          <div
                            key={`sessiondata_${val}`}
                            className="px-[8px] w-1/2 mb-[5px]"
                          >
                            <div className="value__row font-biotif__Medium text-[14px] text-ipBlack__textColor">
                              <span className="capitalize label">
                                {val[0].replaceAll('_', ' ')}:-
                              </span>{' '}
                              <span className="capitalize inline-block text-light__TextColor">
                                {val[1]}
                              </span>
                            </div>
                          </div>
                        );
                      return undefined;
                    })}
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};
