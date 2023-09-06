import AlertModal from 'components/Modal/AlertModal';
import { useCallbackPrompt } from 'hooks/useCallbackPrompt';

interface Props {
  isDirtyCondition: boolean;
}

const RouteChangeConformationModal = ({ isDirtyCondition }: Props) => {
  const { showPrompt, confirmNavigation, cancelNavigation } =
    useCallbackPrompt(isDirtyCondition);

  return (
    <AlertModal
      title="Discard"
      visible={showPrompt}
      onClose={cancelNavigation}
      onCancel={cancelNavigation}
      onSubmit={confirmNavigation}
      width="800px"
      submitButtonText="Proceed"
      submitButtonClass="delete__Btn"
    >
      <p className="confirmation__title">
        The changes you have made won't be saved, do you want to Proceed ?
      </p>
    </AlertModal>
  );
};

export default RouteChangeConformationModal;
