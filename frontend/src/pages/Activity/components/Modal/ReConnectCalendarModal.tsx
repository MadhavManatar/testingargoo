// ** external packages **
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

// ** Redux **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** modal **
import Modal from 'components/Modal';

// ** types **
import {
  AuthProviderConnectURLS,
  TokenProvider,
} from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';
import { REACT_APP_API_URL_WITHOUT_VERSION, REACT_APP_FRONT_URL } from 'config';

interface PropsInterface {
  isOpen: boolean;
  closeModal: () => void;
  provider: {
    value: TokenProvider | '';
    urlValue: AuthProviderConnectURLS | '';
  };
}
const ReConnectCalendarModal = (props: PropsInterface) => {
  const { closeModal, isOpen, provider } = props;

  const organizationUUID = localStorage.getItem('organization_uuid');

  const currentUser = useSelector(getCurrentUser);

  // ** Custom hooks **
  const { handleSubmit, reset } = useForm();

  const onSubmit = handleSubmit(async () => {
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
  });

  const close = () => {
    reset();
    closeModal();
  };

  return (
    <Modal
      title="Re-connect calendar"
      visible={isOpen}
      onClose={() => close()}
      onCancel={() => close()}
      submitLoading={false}
      width="540px"
      modalWrapperClass="reConnect__modal"
      cancelButtonText="Cancel"
      submitBtnDisabled
      submitButtonText="Re-Connect"
    >
      <div className="reconnect__item flex items-center justify-between mb-[15px] last:mb-0">
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

export default ReConnectCalendarModal;
