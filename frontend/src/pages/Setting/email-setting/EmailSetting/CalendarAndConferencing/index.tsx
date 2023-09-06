// ** external packages **
import { useEffect } from 'react';

// ** Components **
import ConnectedCalendarProviderList from './components/ConnectedCalendarProviderList';
import ConnectCalendarProvider from './components/ConnectCalendarProvider';
import SettingLayout from 'pages/Setting/components/SettingLayout';
import ConnectZoomProvider from './components/ConnectZoomProvider';
import ConnectedZoom from './components/ConnectedZoom';
import CalendarConnectSkeleton from './skeletons/CalendarConnectSkeleton';

// ** services **
import { useSyncCalendarService } from '../../hooks/useSyncCalendarService';

// ** constant **
import {
  BREAD_CRUMB,
  CALENDAR_PROVIDER_ARRAY,
  INITIAL_CALENDAR_PROVIDER_ARRAY_AND_CONFIGURE,
} from 'constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';

// ** type **
import { TokenProvider } from '../types/userToken.type';

// ** others **

const CalendarAndConferencing = () => {
  // ** Custom Hooks **
  const { getLoggedIUserTokens, isLoading, usersTokens } =
    useSyncCalendarService({
      INITIAL_PROVIDER_ARRAY: INITIAL_CALENDAR_PROVIDER_ARRAY_AND_CONFIGURE,
    });

  useEffect(() => {
    getLoggedIUserTokens();
  }, []);

  return (
    <>
      <SettingLayout
        title="Email Setting"
        breadCrumbPath={BREAD_CRUMB.calendarAndConferencing}
        sideBarLinks={SETTING_SIDEBAR.emailSetting}
      >
        {isLoading ? (
          <CalendarConnectSkeleton />
        ) : (
          <>
            <div className='calendar__conferencing__wrapper'>
              {!usersTokens.some((item) =>
                CALENDAR_PROVIDER_ARRAY.includes(item.token_provider)
              ) ? (
                <ConnectCalendarProvider />
              ) : (
                <>
                  <ConnectedCalendarProviderList
                    getLoggedIUserTokens={getLoggedIUserTokens}
                    usersTokens={
                      usersTokens.find((item) =>
                        CALENDAR_PROVIDER_ARRAY.includes(item.token_provider)
                      ) || null
                    }
                  />
                </>
              )}

              {!usersTokens.some(
                (item) => item.token_provider === TokenProvider.ZOOM
              ) ? (
                <ConnectZoomProvider />
              ) : (
                <>
                  <ConnectedZoom
                    getLoggedIUserTokens={getLoggedIUserTokens}
                    usersTokens={
                      usersTokens.find(
                        (item) => item.token_provider === TokenProvider.ZOOM
                      ) || null
                    }
                  />
                </>
              )}
            </div>
          </>
        )}
      </SettingLayout>
    </>
  );
};

export default CalendarAndConferencing;
