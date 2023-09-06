// ** import packages **
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

// ** Components **
import Icon from 'components/Icon';

interface Props {
    title?: string;
    visible: boolean;
    children: React.ReactNode;
    contentClass?: string;
    showHeader?: boolean;
    onClose?: () => void;
    onCancel?: () => void;
    width?: string;
    modalWrapperClass?: string;
    modalRef?: React.RefObject<HTMLDivElement>;
}

const ActivityModal = (props: Props) => {
    const {
        title = '',
        visible = false,
        children,
        contentClass = '',
        showHeader = true,
        width = '500px',
        modalWrapperClass = '',
        modalRef = null,
    } = props;
    const { onClose, onCancel } = props;

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
                    {children}
                </div>
            </div>,
            document.body
        )
        : null;
};

export default ActivityModal;
