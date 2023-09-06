// ** Import Packages **
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// ** Components **
import EmailListSkeleton from 'components/skeletons/EmailListSkeleton';
import EmailTabs from './components/EmailTabs';
import EmailUndoMessage from './components/EmailTabs/Components/EmailUndoMessage';
import SelectEmailProviderModal from './components/Modals/SelectEmailProviderModal';
import AdvanceSelectSmtpConnectModal from './components/SmtpEmail/AdvanceSelectSmtpConnectModal';
import SelectSmtpConnectModal from './components/SmtpEmail/SelectSmtpConnectModal';
import WelcomeScreen from './components/WelcomeScreen';
import AddEmailComposerModal from './components/emailComposer/AddEmailComposerModal';

// ** Types **
import { Option } from 'components/FormField/types/formField.types';
import {
  MailTokenProvider,
  TokenProvider,
} from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';
import { EmailModalType, SearchSmtpResponse } from './types/email.type';

// ** Other **
import { REACT_APP_FRONT_URL } from 'config';
import { useGetEmailUndoDelayTime } from './hooks/useEmailHelper';
import {
  getCurrentMailProvider,
  getMailProviderOption,
  setCurrentMailProvider,
} from 'redux/slices/commonSlice';
import ReConnectProvider from 'pages/Setting/email-setting/EmailSetting/ConnectEmail/components/ReConnectProvider';
import { getProviderConnectionValue } from './helper/email.helper';
import { useGetLoggedIUserTokens } from 'pages/Setting/email-setting/hooks/useUserTokenService';
import { INITIAL_MAIL_PROVIDER_ARRAY } from 'constant';
import ReConnectProviderForAll from 'pages/Setting/email-setting/EmailSetting/ConnectEmail/components/ReConnectProviderForAll';

const Email = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  // ** Store **
  const currentMailProvider = useSelector(getCurrentMailProvider);
  const mailProviders = useSelector(getMailProviderOption);
  // ** States **
  const [modal, setModal] = useState<EmailModalType>();
  const modalRef = useRef<EmailModalType>();
  modalRef.current = modal;
  const [defaultRecipient, setDefaultRecipient] = useState<Option[]>([]);
  const [smtpFormData, setSmtpFormData] = useState<SearchSmtpResponse>();
  const [editEmail, setEditEmail] = useState<{
    emailId: number;
    conversionId: number;
    schedule_time: string;
  }>();
  const [selectedProvider, setSelectedProvider] = useState<Option>(
    currentMailProvider ?? {
      label: 'All',
      value: 'all,all',
    }
  );
  const [emailUndoHelperObj, setEmailUndoHelperObj] = useState<{
    id?: number;
    delay_time: number;
    provider?: MailTokenProvider;
  }>({ delay_time: 10 });

  // ** Custom Hooks **
  const { getLoggedIUserTokens, isLoading, usersTokens } =
    useGetLoggedIUserTokens({
      INITIAL_PROVIDER_ARRAY: INITIAL_MAIL_PROVIDER_ARRAY,
    });
  const { getEmailUndoDelayTime, getGeneralSettingLoading } =
    useGetEmailUndoDelayTime({
      setEmailUndoHelperObj,
    });

  const provider_name = (selectedProvider.value as string).split(',')[1];
  const provider_email = (selectedProvider.value as string).split(',')[0];

  const { urlValue, value: reconnectValue } = getProviderConnectionValue(
    provider_name as TokenProvider
  );

  useEffect(() => {
    const expiredUserTokens = usersTokens.filter((obj) => !obj.is_active);
    if (expiredUserTokens.length) {
      setModal('reconnect_provider_all');
    }
  }, [usersTokens]);

  useEffect(() => {
    getLoggedIUserTokens();
    getEmailUndoDelayTime();
  }, []);

  useEffect(() => {
    if (selectedProvider?.value) {
      dispatch(setCurrentMailProvider({ provider: selectedProvider }));
    }
  }, [selectedProvider.value]);

  useEffect(() => {
    window.onbeforeunload = () => {
      window.history.replaceState({}, document.title);
    };
  }, []);

  useEffect(() => {
    const data = location.state as { [key: string]: object };
    if (data?.to && typeof data.to === 'string') {
      setDefaultRecipient([{ label: data.to, value: data.to }]);
    }
    if (data?.openModal) {
      openModal('compose');
    }
  }, [location.state]);

  const openModal = (value: EmailModalType) => setModal(value);
  const closeModal = () => {
    setModal(undefined);
    setEditEmail(undefined);
  };

  const openModalWithEditMode = (
    emailId: number,
    conversionId: number,
    schedule_time: string
  ) => {
    setEditEmail({ conversionId, emailId, schedule_time });
    openModal('compose');
  };
  const renderSection = () => {
    switch (usersTokens.length) {
      case 0:
        return <WelcomeScreen openModal={openModal} />;
      default:
        return (
          <EmailTabs
            openModalWithEditMode={openModalWithEditMode}
            openModal={openModal}
            providerOption={mailProviders}
            selectedProvider={selectedProvider}
            setSelectedProvider={setSelectedProvider}
            providers={usersTokens}
          />
        );
    }
  };

  return isLoading || getGeneralSettingLoading ? (
    <EmailListSkeleton />
  ) : (
    <>
      {renderSection()}
      {modal === 'provider' && (
        <SelectEmailProviderModal
          userTokenProviders={usersTokens.map(
            (usersToken) => usersToken.token_provider
          )}
          tokenSuccessURL={`${REACT_APP_FRONT_URL}/email`}
          isOpen={modal === 'provider'}
          closeModal={closeModal}
          setModal={setModal}
        />
      )}
      {modal === 'compose' && (
        <AddEmailComposerModal
          modalRef={modalRef}
          editEmail={editEmail}
          defaultRecipient={defaultRecipient}
          providerOption={mailProviders.filter(
            (item) =>
              ((item.value as string).split(',')[1] as TokenProvider) !==
              TokenProvider.All
          )}
          isOpen={modal === 'compose'}
          closeModal={closeModal}
          setModal={setModal}
          emailUndoHelperObj={emailUndoHelperObj}
          setEmailUndoHelperObj={setEmailUndoHelperObj}
        />
      )}
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
      {modal === 'undo_modal' && (
        <EmailUndoMessage
          setModal={setModal}
          emailUndoHelperObj={emailUndoHelperObj}
        />
      )}

      {modal === 'reconnect_provider' &&
        urlValue &&
        reconnectValue &&
        provider_email && (
          <ReConnectProvider
            provider={{
              email: provider_email,
              urlValue,
              value: reconnectValue,
            }}
            isOpen={modal === 'reconnect_provider'}
            closeModal={() => setModal(undefined)}
          />
        )}
      {modal === 'reconnect_provider_all' && (
        <ReConnectProviderForAll
          providers={usersTokens.filter((obj) => !obj.is_active)}
          isOpen={modal === 'reconnect_provider_all'}
          closeModal={() => setModal(undefined)}
        />
      )}
    </>
  );
};

export default Email;
