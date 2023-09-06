// ** Import Packages **
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// ** Redux **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** Components **
import Button from 'components/Button';
import DeleteModal from 'components/DeleteComponents/DeleteModal';
import Icon from 'components/Icon';
import SelectEmailProviderModal from 'pages/Email/components/Modals/SelectEmailProviderModal';

// ** Service **
import { useCheckEmailAuthAPI } from 'pages/Email/services/email.service';

// ** Types **
import {
  AuthProviderConnectURLS,
  TokenProvider,
} from '../../types/userToken.type';
import {
  EmailProviderListProps,
  showReconnectProps,
} from '../types/index.type';

// ** Services **
import {
  useDeleteSmtpSyncUserAPI,
  useDeleteUserTokenAPI,
} from 'services/userToken.service';

// ** Constant **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import {
  getCurrentMailProvider,
  getMailProviderOption,
  setCurrentMailProvider,
  setMailProviderOption,
} from 'redux/slices/commonSlice';
import ReConnectProvider from './ReConnectProvider';
import { getProviderConnectionValue } from 'pages/Email/helper/email.helper';

const ConnectedEmailProviderList = (props: EmailProviderListProps) => {
  const {
    tokenSuccessURL,
    openModal,
    modal,
    setModal,
    closeModal,
    usersTokens,
    getLoggedIUserTokens,
  } = props;

  const dispatch = useDispatch();
  const mailProviders = useSelector(getMailProviderOption);
  const currentUser = useSelector(getCurrentUser);
  const currentMailProvider = useSelector(getCurrentMailProvider);
  const organization = currentUser?.organization;

  const navigate = useNavigate();

  // ** states **
  const [showReconnect, setShowReconnect] = useState<showReconnectProps>({});
  const [openDeleteModal, setOpenDeleteModal] = useState<{
    delete: boolean;
    id: number | null;
    provider: TokenProvider | null;
    usernames: string | null;
  }>({ delete: false, id: null, provider: null, usernames: null });
  const [provider, setProvider] = useState<{
    email: string;
    value: TokenProvider | '';
    urlValue: AuthProviderConnectURLS | '';
  }>({ value: '', urlValue: '', email: '' });

  const userTokenProviders = usersTokens.map((item) => {
    return item.token_provider;
  });

  // ** Custom Hooks **
  const { deleteUserTokenByIdAPI, isLoading: deleteLoading } =
    useDeleteUserTokenAPI();
  const { deleteSmtpSyncUserAPI, isLoading: smtpDeleteLoading } =
    useDeleteSmtpSyncUserAPI();
  const { checkEmailAuthAPI } = useCheckEmailAuthAPI();

  useEffect(() => {
    usersTokens.forEach(async (item) => {
      const bodyObj = {
        provider_name: item.token_provider,
        email: item.token_provider_mail,
      };
      const { data } = await checkEmailAuthAPI(bodyObj);
      setShowReconnect((prev) => ({
        ...prev,
        [item.token_provider_mail]: !data?.is_active,
      }));
    });
  }, [usersTokens]);

  const deleteUserToken = async () => {
    if (
      openDeleteModal.id &&
      openDeleteModal.provider === TokenProvider.SMTP &&
      openDeleteModal.usernames
    ) {
      const bodyObj = {
        all: false,
        usernames: [openDeleteModal.usernames],
      };
      const { error } = await deleteSmtpSyncUserAPI({ data: bodyObj });
      if (!error) {
        getLoggedIUserTokens();
        closeDeleteModal();
        let tempMailProviders = [...mailProviders];
        tempMailProviders = tempMailProviders.filter(
          (obj) =>
            obj.value !==
            `${openDeleteModal.usernames},${openDeleteModal.provider}`
        );
        dispatch(setMailProviderOption(tempMailProviders));
        if (openDeleteModal.usernames === currentMailProvider?.label) {
          dispatch(
            setCurrentMailProvider({
              provider: { label: 'All', value: 'all,all' },
            })
          );
        }
      }
    } else if (openDeleteModal.id) {
      const { error } = await deleteUserTokenByIdAPI(openDeleteModal.id, {
        params: {
          organization_id: organization?.organization_id,
          user_id: organization?.user_id,
          mail_provider: openDeleteModal.provider,
          email: openDeleteModal.usernames,
        },
      });
      if (!error) {
        getLoggedIUserTokens();
        closeDeleteModal();
        let tempMailProviders = [...mailProviders];
        tempMailProviders = tempMailProviders.filter(
          (obj) =>
            obj.value !==
            `${openDeleteModal.usernames},${openDeleteModal.provider}`
        );
        dispatch(setMailProviderOption(tempMailProviders));
        if (openDeleteModal.usernames === currentMailProvider?.label) {
          dispatch(
            setCurrentMailProvider({
              provider: { label: 'All', value: 'all,all' },
            })
          );
        }
      }
    }
  };

  const closeDeleteModal = () => {
    setOpenDeleteModal({
      delete: false,
      id: null,
      provider: null,
      usernames: null,
    });
  };

  const reConnect = async () => {
    setModal('reconnect_provider');
  };

  const setSelectedMailIcon = (tokenProvider: TokenProvider) => {
    switch (tokenProvider) {
      case TokenProvider.GOOGLE_MAIL:
        return (
          <img
            className="inline-block w-[32px] mr-[15px] lg:w-[22px] lg:mr-[8px]"
            src="/images/gmail__icon.svg"
            alt=""
          />
        );
      case TokenProvider.OUTLOOK:
        return (
          <img
            className="inline-block w-[32px] mr-[15px] lg:w-[22px] lg:mr-[8px]"
            src="/images/microsoft__Outlook__icon.svg"
            alt=""
          />
        );
      default:
        return (
          <img
            className="inline-block w-[32px] mr-[15px] lg:w-[22px] lg:mr-[8px]"
            src="/images/email_icon.png"
            alt=""
          />
        );
    }
  };

  return (
    <>
      <div className="mb-[25px] flex justify-end 3xl:mb-[15px] sm:mb-[20px] sm:items-center sm:justify-between">
        <h3 className="text-[18px] font-biotif__Medium text-black hidden sm:inline-block">
          Connect Email
        </h3>
        <Button
          type="button"
          onClick={() => openModal('provider')}
          className="primary__Btn h-[43px] px-[16px] text-[14px] font-biotif__Medium"
        >
          Connect New Email
        </Button>
      </div>
      <div className="ip__hideScrollbar sm:h-[calc(100dvh_-_176px)] sm:overflow-y-auto">
        {usersTokens.map((userToken, index) => (
          <div
            className="connectedEmail__box mb-[25px] 3xl:p-[14px] sm:p-0 sm:border sm:border-[#CCCCCC]/50 rounded-[12px] sm:mb-[15px]"
            key={index}
          >
            <div className="inner__box">
              <div className="header flex flex-wrap items-center pb-[20px] border-b border-b-whiteScreen__BorderColor sm:pb-[13px]">
                <div
                  className={`left w-[calc(100%_-_190px)] pr-[12px] flex flex-wrap items-center sm:w-[calc(100%_-_32px)] sm:mb-0 sm:pr-[10px] ${
                    showReconnect[userToken?.token_provider_mail]
                      ? 'w-[calc(100%_-_230px)]'
                      : null
                  }`}
                >
                  {userToken.token_provider
                    ? setSelectedMailIcon(userToken.token_provider)
                    : null}
                  <p className="w-[calc(100%_-_48px)] text-[18px] leading-[22px] font-biotif__Medium text-mediumDark__TextColor break-words whitespace-pre overflow-hidden text-ellipsis 3xl:text-[16px] lg:w-[calc(100%_-_30px)]">
                    {userToken.token_provider_mail}
                  </p>
                </div>
                <button className="toggleBtn w-[30px] h-[32px] rounded-[6px] items-center justify-center  duration-500 hover:bg-[#F2F2F2] hidden sm:flex">
                  <Icon iconType="toggle3dotsIcon" />
                </button>
                <div className="right inline-flex items-center sm:w-full sm:justify-end sm:hidden">
                  {showReconnect[userToken?.token_provider_mail] ? (
                    <Button
                      className="reset__btn p-0 bg-transparent hover:bg-ipGray__transparentBG"
                      onClick={() => {
                        reConnect();
                        const { urlValue, value } = getProviderConnectionValue(
                          userToken.token_provider
                        );
                        if (value && urlValue) {
                          setProvider({
                            value,
                            urlValue,
                            email: userToken.token_provider_mail,
                          });
                        }
                      }}
                    >
                      <Icon
                        className="!mr-0 !ml-0 p-[8px] w-[42px] h-[42px]"
                        iconType="resetFilledIcon"
                      />
                    </Button>
                  ) : (
                    ''
                  )}
                  <button
                    className="delete__btn"
                    onClick={() =>
                      setOpenDeleteModal({
                        delete: true,
                        id: userToken.id,
                        provider: userToken.token_provider,
                        usernames: userToken.token_provider_mail,
                      })
                    }
                  >
                    <Icon iconType="deleteFilled" />
                  </button>
                  <Button
                    className="primary__Btn ml-[10px]"
                    onClick={() => {
                      navigate(PRIVATE_NAVIGATION.email.view);
                    }}
                  >
                    Go to Inbox
                  </Button>
                </div>
              </div>
              <div className="connectedEmail__body pt-[20px]">
                <div className="inner__header flex items-center justify-between mb-[17px]">
                  <h5 className="text-[18px] text-ipBlack__textColor font-biotif__Medium xsm:text-[17px]">
                    Email status
                  </h5>
                </div>
                <div className="details__box__wrapper flex flex-wrap mx-[-10px]">
                  <div className="details__box w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 lg:w-1/2 xsm:w-full">
                    <div className="details__box__inner">
                      <h4 className="text-[16px] text-ipBlack__textColor font-biotif__Medium mb-[8px] xsm:text-[14px] xsm:mb-[2px]">
                        Outgoing emails
                      </h4>
                      <p className="text-[14px] font-biotif__Medium text-light__TextColor mb-[8px] xsm:mb-[3px]">
                        Emails sent via Gmail SMTP
                      </p>
                      <div className="status flex flex-wrap items-center">
                        <span className="t  ext-[14px] font-biotif__Medium text-light__TextColor inline-block mr-[10px]">
                          Status
                        </span>
                        {showReconnect[userToken?.token_provider_mail] ? (
                          <span className="w-[18px] h-[18px] rounded-full bg-ipRed__transparentBG relative before:content-[''] before:absolute before:top-[50%] before:left-[50%] before:translate-x-[-50%] before:translate-y-[-50%] before:w-[8px] before:h-[1px] before:rotate-45 before:bg-ip__Red before:rounded-[20px] before:duration-300 after:content-[''] after:absolute after:top-[50%] after:left-[50%] after:translate-x-[-50%] after:translate-y-[-50%] after:w-[8px] after:h-[1px] after:-rotate-45 after:bg-ip__Red after:rounded-[20px]" />
                        ) : (
                          <span className="inline-block w-[18px] h-[18px] rounded-full bg-ipSuccessGreen__transparentBG relative after:content-[''] after:absolute after:top-[6px] after:left-[6px] after:w-[6px] after:h-[4px] after:border-l after:border-b after:border-l-ip__SuccessGreen after:border-b-ip__SuccessGreen after:rotate-[-45deg] after:z-[2]" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="details__box w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 lg:w-1/2 xsm:w-full">
                    <div className="details__box__inner">
                      <h4 className="text-[16px] text-ipBlack__textColor font-biotif__Medium mb-[8px] xsm:text-[14px] xsm:mb-[2px]">
                        Incoming emails
                      </h4>
                      <p className="text-[14px] font-biotif__Medium text-light__TextColor mb-[8px] xsm:mb-[3px]">
                        Emails received via Gmail IMAP
                      </p>
                      <div className="status flex flex-wrap items-center">
                        <span className="text-[14px] font-biotif__Medium text-light__TextColor inline-block mr-[10px]">
                          Status
                        </span>
                        {showReconnect[userToken?.token_provider_mail] ? (
                          <span className="w-[18px] h-[18px] rounded-full bg-ipRed__transparentBG relative before:content-[''] before:absolute before:top-[50%] before:left-[50%] before:translate-x-[-50%] before:translate-y-[-50%] before:w-[8px] before:h-[1px] before:rotate-45 before:bg-ip__Red before:rounded-[20px] before:duration-300 after:content-[''] after:absolute after:top-[50%] after:left-[50%] after:translate-x-[-50%] after:translate-y-[-50%] after:w-[8px] after:h-[1px] after:-rotate-45 after:bg-ip__Red after:rounded-[20px]" />
                        ) : (
                          <span className="inline-block w-[18px] h-[18px] rounded-full bg-ipSuccessGreen__transparentBG relative after:content-[''] after:absolute after:top-[6px] after:left-[6px] after:w-[6px] after:h-[4px] after:border-l after:border-b after:border-l-ip__SuccessGreen after:border-b-ip__SuccessGreen after:rotate-[-45deg] after:z-[2]" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {modal === 'provider' && (
        <SelectEmailProviderModal
          tokenSuccessURL={tokenSuccessURL}
          isOpen={modal === 'provider'}
          closeModal={closeModal}
          setModal={setModal}
          userTokenProviders={userTokenProviders}
        />
      )}
      <DeleteModal
        closeModal={closeDeleteModal}
        isOpen={openDeleteModal.delete}
        isLoading={deleteLoading || smtpDeleteLoading}
        deleteOnSubmit={() => deleteUserToken()}
        moduleName="this provider"
      />
      {modal === 'reconnect_provider' && (
        <ReConnectProvider
          provider={provider}
          isOpen={modal === 'reconnect_provider'}
          closeModal={closeModal}
          setModal={setModal}
        />
      )}
    </>
  );
};

export default ConnectedEmailProviderList;
