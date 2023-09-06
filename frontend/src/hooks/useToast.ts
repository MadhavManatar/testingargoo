import { useDispatch } from 'react-redux';
import { removeToast, setToast, ToastInterface } from 'redux/slices/toastSlice';

const useToast = () => {
  const dispatch = useDispatch();
  const setToastMessage = (data: Omit<ToastInterface, 'id'>) => {
    const id = new Date().getTime();
    dispatch(setToast({ ...data, id }));
    setTimeout(() => {
      dispatch(removeToast({ id }));
    }, 2000);
  };
  return { setToastMessage };
};

export default useToast;
