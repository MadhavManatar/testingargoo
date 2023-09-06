// ** Import Packages **
import { useState } from 'react';

// ** Components **
import Modal from 'components/Modal';
import ActivityDetails from 'pages/Activity/components/ActivityDetails';

// ** Type **
import { ActivityResponseType } from 'pages/Activity/types/activity.types';

interface Props {
  isOpen: boolean;
  closeViewModal: (activityDetail?: ActivityResponseType) => void;
  activityId: number;
  activityTopic: string;
  closeModalForDashboard: () => void;
  modalRef: React.RefObject<HTMLDivElement>;
  onEdit?: (data: any) => void;
  refreshTimeline?: () => void;
}

const DashboardActivityDetailView = (props: Props) => {
  const {
    activityId,
    closeViewModal,
    isOpen,
    activityTopic,
    closeModalForDashboard,
    modalRef,
    onEdit,
    refreshTimeline,
  } = props;
  const [modalTitle, setModalTitle] = useState<string>(activityTopic);

  return isOpen ? (
    <Modal
      modalWrapperClass="quickView__activity__modal"
      title={modalTitle}
      visible={isOpen}
      onClose={() => {
        closeViewModal();
        refreshTimeline?.();
      }}
      width="1400px"
      modalRef={modalRef}
      showFooter={false}
    >
      <ActivityDetails
        setModalTitle={setModalTitle}
        activityId={activityId}
        closeViewModal={closeViewModal}
        closeModalForDashboard={closeModalForDashboard}
        onEdit={onEdit}
        parentNode="other"
      />
    </Modal>
  ) : (
    <></>
  );
};

export default DashboardActivityDetailView;
