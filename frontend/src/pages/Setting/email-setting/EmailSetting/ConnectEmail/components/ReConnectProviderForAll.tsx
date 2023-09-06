// ** external packages **
import { useSelector } from 'react-redux';
import { Dispatch, SetStateAction } from 'react';

// ** Redux **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** modal **
import Modal from 'components/Modal';

// ** types **
import { EmailModalType } from 'pages/Email/types/email.type';
import {
  TokenProvider,
  UserToken,
} from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';
import { REACT_APP_API_URL_WITHOUT_VERSION, REACT_APP_FRONT_URL } from 'config';
import { getProviderConnectionValue } from 'pages/Email/helper/email.helper';

const setSelectedMailIcon = (tokenProvider: TokenProvider) => {
  switch (tokenProvider) {
    case TokenProvider.GOOGLE_MAIL:
      return <img className="w-full" src="/images/gmail__icon.svg" alt="" />;
    case TokenProvider.OUTLOOK:
      return (
        <img
          className="w-full"
          src="/images/microsoft__Outlook__icon.svg"
          alt=""
        />
      );
    default:
      return <img className="w-full" src="/images/email_icon.png" alt="" />;
  }
};

interface PropsInterface {
  isOpen: boolean;
  closeModal: () => void;
  setModal?: Dispatch<SetStateAction<EmailModalType | undefined>>;
  providers: UserToken[];
}
const ReConnectProviderForAll = (props: PropsInterface) => {
  const { closeModal, isOpen, setModal, providers } = props;

  const organizationUUID = localStorage.getItem('organization_uuid');

  const currentUser = useSelector(getCurrentUser);

  const onSubmit = (email: string) => {
    const provider = providers.find((obj) => obj.token_provider_mail === email);

    if (provider?.token_provider === TokenProvider.OTHER && setModal) {
      setModal('smtp');
    }

    if (provider?.token_provider) {
      const { urlValue, value: reconnectValue } = getProviderConnectionValue(
        provider?.token_provider
      );

      if (
        urlValue &&
        reconnectValue &&
        [TokenProvider.GOOGLE_MAIL, TokenProvider.OUTLOOK].includes(
          provider.token_provider
        )
      ) {
        const token = window.btoa(
          JSON.stringify({
            userId: currentUser?.id,
            organizationUUID,
            token_provider: provider.token_provider,
            successURL: window.location.href,
            failureURL: REACT_APP_FRONT_URL,
          })
        );
        window.open(
          `${REACT_APP_API_URL_WITHOUT_VERSION}/auth/${urlValue}/connect?token=${token}`,
          '_self'
        );
      }
    }
  };

  const close = () => {
    closeModal();
  };

  return (
    <Modal
      title="Re-connect account"
      visible={isOpen}
      onClose={() => close()}
      onCancel={() => close()}
      submitLoading={false}
      width="540px"
      modalWrapperClass="reConnect__modal"
      cancelButtonText="Cancel"
      submitButtonText="Re-Connect"
    >
      {providers.map((provider, index) => (
        <div
          className="reconnect__item flex items-center justify-between mb-[15px] last:mb-0"
          key={index}
        >
          <div className="account__id flex items-center">
            <span className="img__wrapper w-[25px] h-[25px] flex items-center justify-center shrink-0">
              {provider.token_provider &&
                setSelectedMailIcon(provider.token_provider)}
            </span>
            <span className="inline-flex font-biotif__Medium text-[16px] text-light__TextColor pl-[8px]">
              {provider.token_provider_mail}
            </span>
          </div>
          <button
            onClick={() => onSubmit(provider.token_provider_mail)}
            type="button"
            className="i__Button primary__Btn smaller shrink-0"
          >
            Re-connect
          </button>
        </div>
      ))}
    </Modal>
  );
};

export default ReConnectProviderForAll;
