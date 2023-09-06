import AlertModal from 'components/Modal/AlertModal';

interface Props {
    isOpen: boolean;
    downloadDocument: () => void;
    closeModal: () => void;
}

const DownloadConfirmationModal = ({
    isOpen,
    closeModal,
    downloadDocument,
}: Props) => {
    return isOpen ? (
        <AlertModal
            title="Download"
            visible={isOpen}
            onClose={closeModal}
            onCancel={closeModal}
            onSubmit={downloadDocument}
            width="800px"
            submitButtonText="Yes"
            submitButtonClass="delete__Btn"
        >
            <p className="confirmation__title">
                Are you sure all document download ?
            </p>
        </AlertModal>
    ) : null;
};

export default DownloadConfirmationModal;
