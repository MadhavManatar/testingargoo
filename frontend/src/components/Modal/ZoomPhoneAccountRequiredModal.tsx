import Icon from 'components/Icon';
import AlertModal from './AlertModal';
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'redux/slices/authSlice';
import {
  REACT_APP_API_URL_WITHOUT_VERSION,
  REACT_APP_ZOOM_REDIRECT_URI,
} from 'config';

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  phoneNumber: string;
}

const ZoomPhoneAccountRequiredModal = ({
  isOpen,
  closeModal,
  phoneNumber,
}: Props) => {
  const onSumbit = () => {
    closeModal();
    connectZoom();
  };

  // ** Redux Store **
  const currentUser = useSelector(getCurrentUser);

  // ** Zoom Functions ** //
  const connectZoom = () => {
    const token = window.btoa(
      JSON.stringify({
        userId: currentUser?.id,
        organizationUUID: localStorage.getItem('organization_uuid'),
        successURL: REACT_APP_ZOOM_REDIRECT_URI,
        failureURL: REACT_APP_ZOOM_REDIRECT_URI,
      })
    );
    window.open(
      `${REACT_APP_API_URL_WITHOUT_VERSION}/auth/zoom/connect?token=${token}`,
      '_self'
    );
  };
  const onCancel = () => {
    closeModal();
    window.open(`tel:${phoneNumber}`);
    localStorage.setItem('isDefaultCall', JSON.stringify(true));
  };

  return isOpen ? (
    <AlertModal
      title="Zoom Account"
      visible={isOpen}
      onClose={closeModal}
      onCancel={onCancel}
      width="800px"
      cancelButtonText="Okay"
      customIcon={<Icon className="w-[70px] h-[70px]" iconType="phoneFilled" />}
      submitButtonText="Connect Zoom"
      onSubmit={onSumbit}
    >
      <p className="confirmation__title">
        Connect to your Zoom account to begin viewing the call status and data
        in real time.
      </p>
    </AlertModal>
  ) : null;
};

export default ZoomPhoneAccountRequiredModal;
