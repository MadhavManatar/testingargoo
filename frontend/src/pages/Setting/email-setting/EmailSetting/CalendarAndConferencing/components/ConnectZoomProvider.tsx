// ** Import Packages **
import { useSelector } from 'react-redux';

// ** Redux **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** Type **
import {
  AuthProviderConnectURLS,
  TokenProvider,
} from '../../types/userToken.type';

// ** Constant **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

// ** Other **
import { authWithProviderHelper } from 'pages/Setting/email-setting/helper';

const ConnectZoomProvider = () => {
  const currentUser = useSelector(getCurrentUser);

  const authWithProvider = ({
    connectAPIPath,
    tokenProvider,
  }: {
    connectAPIPath: AuthProviderConnectURLS;
    tokenProvider: TokenProvider;
  }) => {
    if (currentUser?.id) {
      authWithProviderHelper({
        connectAPIPath,
        failureURLPath: PRIVATE_NAVIGATION.dashboard.view,
        tokenProvider,
        successURLPath:
          PRIVATE_NAVIGATION.settings.emailSetting.calendarConferencing.view,
        userId: currentUser?.id,
      });
    }
  };

  return (
    <div className="calendar__conferencing__box p-[25px] pb-0 mb-[25px] bg-lightScreenBg rounded-[12px] lg:p-[17px] lg:pb-[3px] sm:bg-transparent sm:border sm:border-gray__BGColor sm:rounded-[12px]">
      <div className="header flex flex-wrap items-start">
        <div className="left w-[700px] max-w-full">
          <h3 className="text-[20px] leading-[26px] font-biotif__Medium text-ipBlack__textColor mb-[12px] lg:text-[18px] lg:mb-[6px] sm:text-[18px] sm:font-biotif__Medium sm:text-[#2E3234]">
            Sync a calendar of your choice
          </h3>
          <p className="text-[16px] font-biotif__Regular text-black__TextColor600 lg:text-[14px] sm:font-biotif__Medium sm:text-black/50">
            To show Zoom links in your calendar meetings, first connect your
            Zoom account to the CRM and then sync your calendar
          </p>
        </div>
      </div>
      <div className="email__provider__wrapper flex flex-wrap mx-[-12px] mt-[30px] lg:mt-[20px] lg:mx-[-6px]">
        <div className="email__provider__box w-[140px] px-[12px] mb-[22px] lg:px-[6px] lg:mb-[14px] sm:w-1/3 xsm:w-1/2">
          <div className="inner__box relative group">
            <div
              className="img__box w-full pt-[100%] relative bg-ipWhite__bgColor border border-whiteScreen__BorderColor rounded-[12px]"
              onClick={() =>
                authWithProvider({
                  connectAPIPath: AuthProviderConnectURLS.zoom,
                  tokenProvider: TokenProvider.ZOOM,
                })
              }
            >
              <img
                className="absolute top-0 left-0 w-full h-full object-contain object-center p-[30%]"
                src="/images/zoom.svg"
                alt=""
              />
            </div>
            <h4 className="title text-[14px] leading-[20px] text-center font-biotif__Medium mt-[10px] text-ipBlack__textColor mb-[8px]">
              Zoom
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectZoomProvider;
