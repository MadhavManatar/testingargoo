/* eslint-disable @typescript-eslint/no-unused-vars */
// ** Import Packages **
import { createContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import openSocket, { Socket } from 'socket.io-client';

// ** CSS **
import 'tippy.js/dist/tippy.css';

// ** components **
import SiteLoader from 'components/loader/SiteLoader';
import RouteComponent from 'router/RouteComponent';

// ** hooks **
import useAuthGuard from 'hooks/useAuthGuard';
import useInvalidTagHook from 'hooks/useInvalidTagHook';
import { useGetLoggedIUserTokens } from 'pages/Setting/email-setting/hooks/useUserTokenService';

// ** Redux **
import { getAuth } from 'redux/slices/authSlice';
import {
  getCurrentMailProvider,
  getMailProviderOption,
  setZoomAccountDetails,
} from 'redux/slices/commonSlice';
import { RootState } from 'redux/store';

// ** API **
import { useLazyGetMailsQuery } from 'redux/api/mailApi';

// ** Service **
import { getClientIpAPI } from 'services/common.service';

// ** Types **
import { CustomLabel } from 'pages/Email/types/email.type';
import { GetMailPayload } from 'redux/api/types/mail.model';
import { RELOAD_DATA_KEY, RELOAD_DATA_SUB_KEY } from 'types/reloadData.type';

// ** Constant **
import { INITIAL_MAIL_PROVIDER_ARRAY } from 'constant';

// ** Helper **
import { REACT_APP_API_BASE_URL } from 'config';
import { getMailsApiParams } from 'redux/api/helper/mail.helper';
import { TokenProvider } from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';
import { useSyncCalendarService } from 'pages/Setting/email-setting/hooks/useSyncCalendarService';
import {
  useAutoLoadReduxForIcon,
  useSetAnimationIconSettingRedux,
} from 'indexDB/indexdb';

export const context = createContext<Socket | null | undefined>(null);

const App = () => {
  const { isLoading, isAuthInitialized } = useAuthGuard();
  const { user } = useSelector(getAuth);
  const dispatch = useDispatch();
  const { setInValidCommonTag, setInValidEntityTag } = useInvalidTagHook();
  // ** State Api **
  const [getMails] = useLazyGetMailsQuery();
  // const [reloadData] = useReloadDataMutation();

  // ** Store
  const { organizationUUID } = useSelector((state: RootState) => state.auth);
  const currentMailProvider = useSelector(getCurrentMailProvider);
  // HELLO
  const {
    getLoggedIUserTokens: getLoggedICalendarUserTokens,
    usersTokens: zoomUserTokens,
  } = useSyncCalendarService({
    INITIAL_PROVIDER_ARRAY: [TokenProvider.ZOOM],
  });
  const mailProviders = useSelector(getMailProviderOption);

  // const { getIconJson } = useAutoLoadIndexDbForIcon(); // IndexDb
  const { getIconJson } = useAutoLoadReduxForIcon(); // Redux
  const { getAnimationIconSetting } = useSetAnimationIconSettingRedux();
  useEffect(() => {
    if (organizationUUID && user?.verified) {
      getIconJson();
      getAnimationIconSetting();
    }
  }, [organizationUUID]);

  // Custom Hooks
  const { getLoggedIUserTokens, usersTokens } = useGetLoggedIUserTokens({
    INITIAL_PROVIDER_ARRAY: INITIAL_MAIL_PROVIDER_ARRAY,
  });
  const [socket, setSocket] = useState<Socket>();
  const [openBrowser, setOpenBrowser] = useState('');

  useEffect(() => {
    if (organizationUUID) {
      if (!window.location.pathname.includes('/reset')) {
        connectSocket();
      }
      // get all connected mail providers
      if (user?.verified) {
        getCalendarUserTokens();
        getLoggedIUserTokens();
      }
    }
  }, [organizationUUID, user?.verified]);

  useEffect(() => {
    if (zoomUserTokens?.length && organizationUUID && user?.verified) {
      getZoomPhoneSettings();
    }
  }, [zoomUserTokens, organizationUUID, user]);

  useEffect(() => {
    if (mailProviders?.length > 1) {
      if (
        mailProviders?.length &&
        organizationUUID &&
        user?.verified &&
        usersTokens?.length
      ) {
        getDefaultMails();
      }
    }
  }, [mailProviders, organizationUUID, user, currentMailProvider, usersTokens]);

  const getCalendarUserTokens = async () => {
    await getLoggedICalendarUserTokens();
  };

  const getZoomPhoneSettings = async () => {
    const zoomToken = zoomUserTokens.find(
      (t) => t.token_provider === TokenProvider.ZOOM
    );
    dispatch(setZoomAccountDetails(zoomToken));
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { userAgent } = navigator;
      let browserName;
      const device = navigator.userAgent.includes('iPhone')
        ? 'ios'
        : navigator.userAgent.includes('Android')
        ? 'android'
        : '';
      if (userAgent.match(/chrome|chromium/i)) {
        if ((window.navigator as any)?.brave !== undefined) {
          browserName = `brave-${device}`;
        } else {
          browserName = `chrome-${device}`;
        }
      } else if (userAgent.match(/firefox|fxios/i)) {
        browserName = `firefox-${device}`;
      } else if (userAgent.match(/safari/i)) {
        browserName = `safari-${device}`;
      } else if (userAgent.match(/opr\//i)) {
        browserName = `opera-${device}`;
      } else if (userAgent.match(/edg/i)) {
        browserName = `edge-${device}`;
      } else if ((window.navigator as any)?.brave !== undefined) {
        browserName = `brave-${device}`;
      } else {
        browserName = 'No browser detection';
      }
      if (!openBrowser) {
        document.body.classList.add(browserName);
        setOpenBrowser(browserName);
      }
    }
    getClientIpAPI();
    return () => {
      if (openBrowser) {
        document.body.classList.remove(openBrowser);
      }
    };
  }, []);

  const getDefaultMails = async () => {
    if (organizationUUID && usersTokens?.length && mailProviders?.length) {
      const payload: GetMailPayload = {
        label: [CustomLabel.INBOX],
        provider: currentMailProvider ?? { label: 'All', value: 'all,all' },
        page: 1,
        searchData: {
          searchText: '',
          searchFields: '',
        },
        limit: 50,
        providerOption: mailProviders,
      };
      const params = getMailsApiParams(payload);
      getMails(params, true);
    }
  };

  const connectSocket = async () => {
    const url: string = REACT_APP_API_BASE_URL || '';
    const socketTemp = openSocket(url, {
      forceNew: true,
      transports: ['websocket'],
      withCredentials: true,
    });
    setSocket(socketTemp);
    socketTemp.emit('join-room');
    socketTemp.emit('join-room-reload-data');
    socketTemp.on('disconnect', () => {
      socketTemp?.emit('leave-room');
      socketTemp.emit('leave-room-reload-data');
    });
    socketTemp.on('connected', () => {
      console.log('Connected.............');
    });

    socketTemp.on(
      'reload-data',
      (
        data: {
          type: keyof typeof RELOAD_DATA_KEY;
          id: keyof typeof RELOAD_DATA_SUB_KEY | number;
        }[]
      ) => {
        data.forEach(({ type, id }) => {
          if (type === 'ENTITY_ATTRIBUTE') {
            setInValidEntityTag(id);
          } else {
            setInValidCommonTag({ type, id });
          }
        });
      }
    );
  };

  return isLoading || !isAuthInitialized ? (
    <SiteLoader />
  ) : (
    <>
      <context.Provider value={socket}>
        <RouteComponent />
      </context.Provider>
    </>
  );
};

export default App;
