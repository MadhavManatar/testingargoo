import Icon from 'components/Icon';
import AlertModal from 'components/Modal/AlertModal';

interface Props {
  isOpen?: boolean;
  onSubmit?: () => void;
  closeModal?: () => void;
  totalRecipient: number;
}

const BulkMailConfirmationModal = ({
  isOpen = true,
  closeModal,
  onSubmit,
  totalRecipient,
}: Props) => {
  return isOpen ? (
    <AlertModal
      visible={isOpen}
      onClose={closeModal}
      onCancel={closeModal}
      onSubmit={onSubmit}
      width="800px"
      submitButtonText="Send"
      customIcon={
        <Icon className="w-[70px] h-[70px]" iconType="InformationIcon" />
      }
    >
      <div className="text-[16px] font-biotif__Medium text-black text-center">
        <p>Not all users present in the list have emails.</p>
        <p>
          Are you sure you want to send emails to {totalRecipient}{' '}
          {totalRecipient > 1 ? 'users' : 'user'} ?
        </p>
      </div>
    </AlertModal>
  ) : null;
};

export default BulkMailConfirmationModal;
