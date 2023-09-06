// ** Import Packages **
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// ** Components **
import AdvanceSelectSmtpConnectModal from 'pages/Email/components/SmtpEmail/AdvanceSelectSmtpConnectModal';
import SelectSmtpConnectModal from 'pages/Email/components/SmtpEmail/SelectSmtpConnectModal';
import SettingLayout from 'pages/Setting/components/SettingLayout';
import ConnectedEmailProviderList from './components/ConnectedEmailProviderList';
import ConnectEmailProvider from './components/ConnectEmailProvider';
import EmailConnectSkeleton from './skeletons/EmailConnectSkeleton';

// ** Redux **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** Use-Service **
import { useGetLoggedIUserTokens } from '../../hooks/useUserTokenService';

// ** Types **
import {
  EmailModalType,
  SearchSmtpResponse,
} from 'pages/Email/types/email.type';
import {
  AuthProviderConnectURLS,
  TokenProvider,
} from '../types/userToken.type';

// ** Constant **
import { BREAD_CRUMB, INITIAL_MAIL_PROVIDER_ARRAY } from 'constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';

// ** Other **
import { REACT_APP_API_URL_WITHOUT_VERSION, REACT_APP_FRONT_URL } from 'config';

const ConnectEmail = () => {
  const organizationUUID = localStorage.getItem('organization_uuid');

  const tokenSuccessURL = `${REACT_APP_FRONT_URL}${PRIVATE_NAVIGATION.settings.emailSetting.connect.view}`;

  // ** hooks var **
  const currentUser = useSelector(getCurrentUser);

  // ** states **
  const [currentScreen, setCurrentScreen] = useState('default');
  const [modal, setModal] = useState<EmailModalType>();
  const [provider, setProvider] = useState<{
    value: TokenProvider | '';
    urlValue: AuthProviderConnectURLS | '';
  }>({ value: '', urlValue: '' });

  const [smtpFormData, setSmtpFormData] = useState<SearchSmtpResponse>();

  // ** Custom Hooks **
  const { getLoggedIUserTokens, isLoading, usersTokens } =
    useGetLoggedIUserTokens({
      setCurrentScreen,
      INITIAL_PROVIDER_ARRAY: INITIAL_MAIL_PROVIDER_ARRAY,
    });

  const token = window.btoa(
    JSON.stringify({
      userId: currentUser?.id,
      organizationUUID,
      token_provider: provider.value,
      successURL: tokenSuccessURL,
      failureURL: REACT_APP_FRONT_URL,
    })
  );

  useEffect(() => {
    getLoggedIUserTokens();
  }, []);

  useEffect(() => {
    if (
      provider?.urlValue &&
      provider?.value &&
      [TokenProvider.GOOGLE_MAIL, TokenProvider.OUTLOOK].includes(
        provider.value
      )
    ) {
      window.open(
        `${REACT_APP_API_URL_WITHOUT_VERSION}/auth/${provider.urlValue}/connect?token=${token}`,
        '_self'
      );
    }
  }, [provider]);

  const openModal = (value: EmailModalType) => setModal(value);

  const closeModal = () => {
    setProvider({ urlValue: '', value: '' });
    setModal(undefined);
  };

  const renderSection = () => {
    return currentScreen === 'default' ? (
      <ConnectEmailProvider
        setModal={setModal}
        provider={provider}
        setProvider={setProvider}
      />
    ) : (
      <ConnectedEmailProviderList
        usersTokens={usersTokens}
        openModal={openModal}
        tokenSuccessURL={tokenSuccessURL}
        modal={modal}
        closeModal={closeModal}
        setModal={setModal}
        getLoggedIUserTokens={getLoggedIUserTokens}
      />
    );
  };

  return (
    <>
      <SettingLayout
        title="Email Setting"
        breadCrumbPath={BREAD_CRUMB.connectEmail}
        sideBarLinks={SETTING_SIDEBAR.emailSetting}
      >
        {isLoading ? <EmailConnectSkeleton /> : renderSection()}
      </SettingLayout>
      {modal === 'smtp' && (
        <SelectSmtpConnectModal
          isOpen={modal === 'smtp'}
          closeModal={closeModal}
          setModal={setModal}
          setSmtpFormData={setSmtpFormData}
        />
      )}
      {modal === 'advance_smtp' && (
        <AdvanceSelectSmtpConnectModal
          isOpen={modal === 'advance_smtp'}
          closeModal={closeModal}
          smtpFormData={smtpFormData}
          isConnected={getLoggedIUserTokens}
        />
      )}
    </>
  );
};

export default ConnectEmail;
