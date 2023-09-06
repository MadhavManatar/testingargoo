// ** Import Packages **
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

// ** Components **
import QuickAddDropDown from 'pages/Dashboard/components/QuickAddDropDown';
import NotificationToggle from './QuickHeaderToggle/NotificationToggle';
import ProfileToggle from './QuickHeaderToggle/ProfileToggle';
import SmackDab from 'assets/images/Smackdab.png';

// ** Redux **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** hook **
import useAuth from 'hooks/useAuth';
import { useUserNotificationSubscribeHook } from 'notification';

// ** Constant **
import { MODULE_PERMISSION } from 'constant/permissions.constant';

// ** Types **
import { permissionOperatorEnum } from 'pages/auth/types/authGuard.types';
import { ToggleStateType } from '../types/toggleTypes/index.types';
import ZoomPhoneCall from './ZoomPhoneCall';

interface Props {
  headerTitle: string;
}

const initialToggleValue: ToggleStateType = {
  dialer: { callScreen: false, dialPed: false },
};

export const Header = ({ headerTitle }: Props) => {
  // ** Ref **
  const containerRef = useRef(null);

  // ** State **
  const [headerToggle, setHeaderToggle] = useState(initialToggleValue);

  // ** Custom Hooks **
  const { hasAuthorized } = useAuth();

  const userQuickAddPermission = hasAuthorized(
    [
      { ...MODULE_PERMISSION.LEAD.create },
      { ...MODULE_PERMISSION.DEAL.create },
      { ...MODULE_PERMISSION.CONTACT.create },
      { ...MODULE_PERMISSION.ACCOUNT.create },
      { ...MODULE_PERMISSION.ACTIVITY.create },
    ],
    permissionOperatorEnum.OR
  );

  const loggedInUser = useSelector(getCurrentUser);
  const { registerAndSubscribe } = useUserNotificationSubscribeHook();

  useEffect(() => {
    Promise.all([registerAndSubscribe(), updateNotificationType()]);
  }, []);

  const updateNotificationType = async () => {
    const windowNotification = window.Notification;
    if (windowNotification?.permission !== 'granted') {
      // HELLO
    }
  };

  return (
    <>
      <div className="dashboard__Header duration-300 md:w-full">
        <div className="innerWrapper px-[30px] pl-[25px] py-[20px] flex justify-between xl:px-[15px] xl:pl-[20px] xl:py-[10px] xl:pt-[15px] md:justify-end">
          <h1 className="header__page__title text-black__TextColor800 text-[28px] font-biotif__Medium md:text-[22px] md:leading-[26px] md:hidden">
            {headerTitle === 'Dashboard'
              ? `Welcome ${loggedInUser?.first_name || ''}!`
              : headerTitle}
          </h1>
          <div className="rightWrapper inline-flex flex-wrap items-center">
            <ZoomPhoneCall
              containerRef={containerRef}
              initialToggleValue={initialToggleValue}
              headerToggle={headerToggle}
              setHeaderToggle={setHeaderToggle}
            />
            <NotificationToggle />
            {userQuickAddPermission && <QuickAddDropDown />}
            <ProfileToggle />
          </div>
        </div>
      </div>

      <div className="onlyDesktopSiteInfo w-screen h-screen overflow-y-auto ip__hideScrollbar fixed top-0 left-0 bg-white overflow-hidden z-[20] !hidden">
        <div className="inner__wrapper w-full h-full flex items-center justify-center">
          <div className="cn__inner relative z-[3] inline-flex flex-wrap justify-center w-[500px] max-w-full px-[15px]">
            <img
              className="block w-[300px] max-w-full mx-auto"
              src={SmackDab}
              alt=""
            />
            <h3 className="text-[18px] font-biotif__SemiBold text-[#353535] mt-[20px] text-center">
              Currently, this website is best viewed on{' '}
              <span className="text-[#7467b7] underline">desktop</span>{' '}
              computers and is not suitable for{' '}
              <del className="text-[#ff2c46]">mobile</del> &{' '}
              <del className="text-[#ff2c46]">tablet</del> devices.
            </h3>
          </div>
          <img
            className="fixed top-0 left-0 w-full h-auto scale-[-1] opacity-10"
            src="/images/noMoilePatternImg.png"
            alt=""
          />
        </div>
      </div>
    </>
  );
};

export default Header;
