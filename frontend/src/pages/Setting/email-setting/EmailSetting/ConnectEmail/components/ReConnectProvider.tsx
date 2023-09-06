// ** external packages **
import { useSelector } from 'react-redux';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';

// ** Redux **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** modal **
import Modal from 'components/Modal';

// ** types **
import { EmailModalType } from 'pages/Email/types/email.type';
import {
  AuthProviderConnectURLS,
  TokenProvider,
} from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';
import { REACT_APP_API_URL_WITHOUT_VERSION, REACT_APP_FRONT_URL } from 'config';

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
  provider: {
    value: TokenProvider | '';
    urlValue: AuthProviderConnectURLS | '';
    email: string;
  };
}
const ReConnectProvider = (props: PropsInterface) => {
  const { closeModal, isOpen, setModal, provider } = props;

  const organizationUUID = localStorage.getItem('organization_uuid');

  const currentUser = useSelector(getCurrentUser);

  // ** Custom hooks **
  const { handleSubmit, reset } = useForm();

  const onSubmit = handleSubmit(async () => {
    if (provider.value === TokenProvider.OTHER && setModal) {
      setModal('smtp');
    }

    if (
      provider?.urlValue &&
      provider?.value &&
      [TokenProvider.GOOGLE_MAIL, TokenProvider.OUTLOOK].includes(
        provider.value
      )
    ) {
      const token = window.btoa(
        JSON.stringify({
          userId: currentUser?.id,
          organizationUUID,
          token_provider: provider.value,
          successURL: window.location.href,
          failureURL: REACT_APP_FRONT_URL,
        })
      );
      window.open(
        `${REACT_APP_API_URL_WITHOUT_VERSION}/auth/${provider.urlValue}/connect?token=${token}`,
        '_self'
      );
    }
  });

  const close = () => {
    reset();
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
      submitBtnDisabled={!provider.value}
      submitButtonText="Re-Connect"
    >
      <div className="reconnect__item flex items-center justify-between mb-[15px] last:mb-0">
        <div className="account__id flex items-center">
          <span className="img__wrapper w-[25px] h-[25px] flex items-center justify-center shrink-0">
            {provider.value && setSelectedMailIcon(provider.value)}
          </span>
          <span className="inline-flex font-biotif__Medium text-[16px] text-light__TextColor pl-[8px]">
            {provider.email}
          </span>
        </div>
        <button
          onClick={onSubmit}
          type="button"
          className="i__Button primary__Btn smaller shrink-0"
        >
          Re-connect
        </button>
      </div>
    </Modal>
  );
};

export default ReConnectProvider;
