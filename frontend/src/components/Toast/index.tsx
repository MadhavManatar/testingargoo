// =================== import packages ==================
import { useDispatch, useSelector } from 'react-redux';
// ======================================================
import { getToast, removeToast } from 'redux/slices/toastSlice';
import Icon, { IconTypes } from 'components/Icon';

interface Props {
  icon?: IconTypes;
}

const Toast = (props: Props) => {
  const { icon = 'notificationFilled' } = props;
  const toastMessage = useSelector(getToast);
  const dispatch = useDispatch();

  return (
    <>
      {toastMessage.length ? (
        <div className="ip__ToastWrapper ip__hideScrollbar">
          <div className="ip__Toast__CNabsolute">
            {toastMessage.map((toast) => (
              <div
                key={toast.id}
                className={`ip__Toast__CNwrapper show ${toast.type}`}
              >
                <Icon className="symbol__Icon" iconType={icon} />
                <p className="ip__Toast__Text">{toast.message}</p>
                <button
                  className="close__Btn"
                  onClick={() => dispatch(removeToast({ id: toast.id }))}
                >
                  <Icon iconType="closeBtnFilled" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Toast;
