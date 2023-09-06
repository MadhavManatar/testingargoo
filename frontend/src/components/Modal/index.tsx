// ** import packages **
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

// ** Components **
import Button from 'components/Button';
import Icon from 'components/Icon';
import { SaveAndCloseBtn } from 'pages/Activity/components/Modal/SaveAndCloseBtn';

interface Props {
  title?: string;
  visible: boolean;
  children: React.ReactNode;
  contentClass?: string;
  showHeader?: boolean;
  onClose?: () => void;
  showFooter?: boolean;
  onCancel?: () => void;
  onSubmit?: () => void;
  tagModelSubmit?: () => void;
  submitLoading?: boolean;
  submitBtnDisabled?: boolean;
  width?: string;
  cancelButtonText?: string;
  cancelButtonDisabled?: boolean;
  submitButtonText?: string;
  submitButtonClass?: string;
  modalWrapperClass?: string;
  modalRef?: React.RefObject<HTMLDivElement>;
  isNoteModal?: boolean;
  noteButtonAction?: () => void;
  saveButtonText?: string;
  saveButtonDisabled?: boolean;
  saveButtonClick?: () => void;
}

const Modal = (props: Props) => {
  const {
    title = '',
    visible = false,
    children,
    contentClass = '',
    showHeader = true,
    showFooter = true,
    submitLoading = false,
    width = '500px',
    cancelButtonText = 'Cancel',
    submitButtonText = 'Save',
    submitButtonClass = 'primary__Btn',
    modalWrapperClass = '',
    submitBtnDisabled = false,
    cancelButtonDisabled = false,
    modalRef = null,
    isNoteModal = false,
    noteButtonAction,
    saveButtonText = 'Save and ??',
    saveButtonDisabled,
    saveButtonClick,
  } = props;
  const { onClose, onCancel, onSubmit, tagModelSubmit } = props;

  useEffect(() => {
    const classExist = document.body.classList.contains('active');
    const modalOpenTarget = document.getElementsByTagName('html');
    if (visible && !classExist) {
      modalOpenTarget[0]?.classList.add('modal-open');
    }
    return () => {
      modalOpenTarget[0]?.classList.remove('modal-open');
    };
  });

  const handleClose = () => {
    onCancel?.();
    onClose?.();
  };

  return visible
    ? createPortal(
      <div
        className={`ip__Modal__Wrapper ${modalWrapperClass} ${!visible ? 'hidden' : ''
          }`}
        ref={modalRef}
      >
        <div
          className="ip__Modal__Overlay"
          onClick={() => (onClose ? onClose() : handleClose())}
        />
        <div
          className={`ip__Modal__ContentWrap ${contentClass}`}
          style={{ width }}
        >
          {showHeader && (
            <div className="ip__Modal__Header">
              <h3 className="title">{title}</h3>
              <Icon
                iconType="closeBtnFilled"
                onClick={() => (onClose ? onClose() : handleClose())}
              />
            </div>
          )}
          <div className="ip__Modal__Body ip__FancyScroll relative">
            {children}
          </div>
          {showFooter && (
            <div className="ip__Modal__Footer">
              <div className="action-btns-wrapper">
                {isNoteModal && (
                  <div className="action-btn mr-[4px]">
                    <Icon
                      iconType="attachmentIcon"
                      onClick={() => noteButtonAction && noteButtonAction()}
                    />
                  </div>
                )}
              </div>
              <div className="inline-flex sm:flex sm:w-full sm:justify-end">
                {onCancel && (
                  <Button
                    isDisabled={cancelButtonDisabled}
                    className="outline__Btn__SD smaller"
                    onClick={onCancel}
                  >
                    {cancelButtonText}
                  </Button>
                )}
                {onSubmit && (
                  <Button
                    isDisabled={submitBtnDisabled}
                    className={`${submitButtonClass} smaller`}
                    onClick={onSubmit}
                    isLoading={submitLoading}
                  >
                    {submitButtonText}
                  </Button>
                )}
                {tagModelSubmit && (
                  <Button
                    isDisabled={submitBtnDisabled}
                    className={`${submitButtonClass} smaller`}
                    onClick={tagModelSubmit}
                    isLoading={submitLoading}
                  >
                    {submitButtonText}
                  </Button>
                )}
                {saveButtonClick && saveButtonText && (
                  <SaveAndCloseBtn
                    saveButtonText={saveButtonText}
                    saveButtonDisabled={saveButtonDisabled}
                    saveButtonClick={saveButtonClick}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>,
      document.body
    )
    : null;
};

export default Modal;
