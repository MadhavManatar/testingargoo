// ** Import Packages **
import { useSelector } from 'react-redux';

// ** Redux **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** modal **
import Modal from 'components/Modal';

// ** types **
import {
  AuthProviderConnectURLS,
  TokenProvider,
} from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';

// ** Constant **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

// ** Other **
import { authWithProviderHelper } from 'pages/Setting/email-setting/helper';

interface PropsInterface {
  isOpen: boolean;
  setModal: React.Dispatch<React.SetStateAction<'cal_provider' | undefined>>;
  userTokenProviders: string[];
}
const CalendarProviderModal = (props: PropsInterface) => {
  const { isOpen, setModal, userTokenProviders } = props;

  const currentUser = useSelector(getCurrentUser);

  const close = () => {
    setModal(undefined);
  };

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

  return isOpen ? (
    <Modal
      title="Select your provider"
      visible={isOpen}
      onClose={() => close()}
      onCancel={() => close()}
      width="540px"
      showFooter={false}
    >
      <div className="email__provider__wrapper flex flex-wrap mx-[-12px]">
        <div
          style={{
            pointerEvents: userTokenProviders?.includes(
              TokenProvider.GOOGLE_CALENDAR
            )
              ? 'none'
              : 'auto',
            opacity: userTokenProviders?.includes(TokenProvider.GOOGLE_CALENDAR)
              ? 0.7
              : '',
          }}
          className={`email__provider__box w-1/3 px-[12px] ${
            userTokenProviders?.includes(TokenProvider.GOOGLE_CALENDAR)
              ? 'disable'
              : ''
          }`}
          onClick={() =>
            authWithProvider({
              connectAPIPath: AuthProviderConnectURLS.google,
              tokenProvider: TokenProvider.GOOGLE_CALENDAR,
            })
          }
        >
          <div className="inner__box relative group">
            <div className="img__box w-full pt-[100%] relative border border-whiteScreen__BorderColor rounded-[12px] group-hover:bg-parentBgWhite__grayBtnBG">
              <img
                className="absolute top-0 left-0 w-full h-full object-contain object-center p-[30%]"
                src="/images/google__calender.svg"
                alt=""
              />
            </div>
            <h4 className="title text-[14px] leading-[20px] text-center font-biotif__Medium mt-[10px] text-ipBlack__textColor mb-[8px]">
              Google Calendar
            </h4>
          </div>
        </div>
        <div
          style={{
            pointerEvents: userTokenProviders?.includes(
              TokenProvider.OFFICE_365_CALENDAR
            )
              ? 'none'
              : 'auto',
            opacity: userTokenProviders?.includes(
              TokenProvider.OFFICE_365_CALENDAR
            )
              ? 0.7
              : '',
          }}
          className={`email__provider__box w-1/3 px-[12px] ${
            userTokenProviders?.includes(TokenProvider.OFFICE_365_CALENDAR)
              ? 'disable'
              : ''
          }`}
          onClick={() =>
            authWithProvider({
              connectAPIPath: AuthProviderConnectURLS.microsoft,
              tokenProvider: TokenProvider.OFFICE_365_CALENDAR,
            })
          }
        >
          <div className="inner__box relative group">
            <div className="img__box w-full pt-[100%] relative border border-whiteScreen__BorderColor rounded-[12px] group-hover:bg-parentBgWhite__grayBtnBG">
              <img
                className="absolute top-0 left-0 w-full h-full object-contain object-center p-[30%]"
                src="/images/office365.svg"
                alt=""
              />
            </div>
            <h4 className="title text-[14px] leading-[20px] text-center font-biotif__Medium mt-[10px] text-ipBlack__textColor mb-[8px]">
              Office365
            </h4>
          </div>
        </div>
        <div
          style={{
            pointerEvents: userTokenProviders?.includes(TokenProvider.ZOOM)
              ? 'none'
              : 'auto',
            opacity: userTokenProviders?.includes(TokenProvider.ZOOM)
              ? 0.7
              : '',
          }}
          className="email__provider__box w-1/3 px-[12px]"
          onClick={() =>
            authWithProvider({
              connectAPIPath: AuthProviderConnectURLS.zoom,
              tokenProvider: TokenProvider.ZOOM,
            })
          }
        >
          <div className="inner__box relative group">
            <div className="img__box w-full pt-[100%] relative border border-whiteScreen__BorderColor rounded-[12px] group-hover:bg-parentBgWhite__grayBtnBG">
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
    </Modal>
  ) : (
    <></>
  );
};

export default CalendarProviderModal;
