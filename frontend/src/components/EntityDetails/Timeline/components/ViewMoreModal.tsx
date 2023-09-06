import Modal from 'components/Modal';

type Props = {
  isOpen: boolean;
  close: () => void;
  content: string;
};

const ViewMoreModal = (props: Props) => {
  const { isOpen, close, content } = props;

  return (
    <Modal
      title="View Detail"
      visible={isOpen}
      onClose={() => close()}
      onCancel={() => close()}
      width="800px"
      submitButtonText="Create"
    >
      {content}
    </Modal>
  );
};

export default ViewMoreModal;
