// ** Import Packages **
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// ** Redux **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** Components **
import Button from 'components/Button';
import Icon from 'components/Icon';

// ** Modal **
import DeleteModal from 'components/DeleteComponents/DeleteModal';

// ** Types **
import {
  AuthProviderConnectURLS,
  TokenProvider,
  UserToken,
} from '../../types/userToken.type';

// ** Services **
import { useDisConnectCalendarAuth } from 'services/userToken.service';

// ** Constant **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

// ** others **
import { authWithProviderHelper } from 'pages/Setting/email-setting/helper';

interface PropsInterface {
  usersTokens: UserToken | null;
  getLoggedIUserTokens: () => Promise<void>;
}

const ConnectedCalendarProviderList = (props: PropsInterface) => {
  const { usersTokens, getLoggedIUserTokens } = props;

  // ** States **
  const [openDeleteModal, setOpenDeleteModal] = useState<{
    delete: boolean;
    id: number | null;
  }>({ delete: false, id: null });

  // ** Custom Hooks **
  const navigate = useNavigate();

  const { disConnectCalendar, isLoading: deleteLoading } =
    useDisConnectCalendarAuth();

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

  const closeDeleteModal = () => {
    setOpenDeleteModal({ delete: false, id: null });
  };

  const deleteUserToken = async () => {
    if (openDeleteModal.id) {
      if (usersTokens) {
        const email = usersTokens.token_provider_mail;
        const { token_provider } = usersTokens;

        const { error } = await disConnectCalendar({ email, token_provider });

        if (!error) {
          getLoggedIUserTokens();
          closeDeleteModal();
        }
      }
    }
  };

  return (
    <>
      {usersTokens && (
        <div className="">
          <div className="connectedEmail__box mb-[25px]">
            <div className="inner__box">
              <div className="header flex flex-wrap items-center pb-[20px] border-b border-b-whiteScreen__BorderColor">
                <div className="left w-[calc(100%_-_232px)] flex flex-wrap items-center">
                  {usersTokens.token_provider ===
                  TokenProvider.GOOGLE_CALENDAR ? (
                    <img
                      className="inline-block w-[32px] mr-[15px]"
                      src="/images/google__calender.svg"
                      alt=""
                    />
                  ) : usersTokens.token_provider ===
                    TokenProvider.OFFICE_365_CALENDAR ? (
                    <img
                      className="inline-block w-[32px] mr-[15px]"
                      src="/images/office365.svg"
                      alt=""
                    />
                  ) : (
                    <img
                      className="inline-block w-[32px] mr-[15px]"
                      src="/images/calender_icon.png"
                      alt=""
                    />
                  )}
                  <p>You have synced your account</p>
                  <p className="w-[calc(100%_-_48px)] text-[18px] font-biotif__Medium text-mediumDark__TextColor break-words">
                    {usersTokens.token_provider_mail}
                    <br />
                  </p>
                  {usersTokens.token_provider ===
                  TokenProvider.GOOGLE_CALENDAR ? (
                    <a
                      className="text-[14px] font-biotif__SemiBold text-ip__Orange underline duration-500 hover:text-ip__Orange__hoverDark"
                      onClick={() =>
                        authWithProvider({
                          connectAPIPath: AuthProviderConnectURLS.google,
                          tokenProvider: TokenProvider.GOOGLE_CALENDAR,
                        })
                      }
                    >
                      Change Account
                    </a>
                  ) : usersTokens.token_provider ===
                    TokenProvider.OFFICE_365_CALENDAR ? (
                    <a
                      className="text-[14px] font-biotif__SemiBold text-ip__Orange underline duration-500 hover:text-ip__Orange__hoverDark"
                      onClick={() =>
                        authWithProvider({
                          connectAPIPath: AuthProviderConnectURLS.microsoft,
                          tokenProvider: TokenProvider.OFFICE_365_CALENDAR,
                        })
                      }
                    >
                      Change Account
                    </a>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="right inline-flex items-center">
                  <button
                    className="delete__btn"
                    onClick={() =>
                      setOpenDeleteModal({ delete: true, id: usersTokens.id })
                    }
                  >
                    <Icon iconType="deleteFilled" />
                  </button>
                  <Button
                    className="primary__Btn ml-[10px]"
                    onClick={() => {
                      navigate(PRIVATE_NAVIGATION.calendar.view);
                    }}
                  >
                    Go to calendar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <DeleteModal
        closeModal={closeDeleteModal}
        isOpen={openDeleteModal.delete}
        isLoading={deleteLoading}
        deleteOnSubmit={() => deleteUserToken()}
        moduleName="this provider"
      />
    </>
  );
};

export default ConnectedCalendarProviderList;
