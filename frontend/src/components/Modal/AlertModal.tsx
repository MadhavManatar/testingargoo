// =================== import packages ==================
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
// ======================================================
import Button from 'components/Button';
import Icon from 'components/Icon';

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
  submitLoading?: boolean;
  width?: string;
  cancelButtonText?: string;
  submitButtonText?: string;
  submitButtonClass?: string;
  customIcon?: JSX.Element;
}

const AlertModal = (props: Props) => {
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
    customIcon,
  } = props;

  const { onClose, onCancel, onSubmit } = props;

  // ================= hooks ====================
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

  return visible ? (
    createPortal(
      <div
        className={`ip__Modal__Wrapper small__without__HT__modal ${
          !visible ? 'hidden' : ''
        }`}
      >
        <div className="ip__Modal__Overlay" onClick={onClose} />
        <div
          className={`ip__Modal__ContentWrap ${contentClass}`}
          style={{ width }}
        >
          {showHeader && (
            <div className="ip__Modal__Header">
              <h3 className="title">{title}</h3>
              <Icon iconType="closeBtnFilled" onClick={onClose} />
            </div>
          )}
          <div className="ip__Modal__Body ip__FancyScroll relative">
            <div className="confirmation__image__wrapper">
              {customIcon || (
                <img src="/images/deleteAnimatedIcon.gif" alt="" />
              )}
            </div>
            {children}
          </div>
          {showFooter && (
            <div className="ip__Modal__Footer">
              <Button
                className="secondary__Btn smaller min-w-[100px]"
                onClick={onCancel}
              >
                {cancelButtonText}
              </Button>
              {onSubmit && (
                <Button
                  // className="primary__Btn smaller min-w-[100px]"
                  className={`${submitButtonClass} smaller min-w-[100px]`}
                  onClick={onSubmit}
                  isLoading={submitLoading}
                >
                  {submitButtonText}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>,
      document.body
    )
  ) : (
    <></>
  );
};

export default AlertModal;
