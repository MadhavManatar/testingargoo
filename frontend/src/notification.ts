import { REACT_APP_FRONT_URL, REACT_APP_PUBLIC_VAPID_KEY } from 'config';
import { useDispatch } from 'react-redux';
import { setUserNotificationSubscription } from 'redux/slices/commonSlice';
import { useAddUserSubscriptionAPI } from 'services/notification.service';

export const useUserNotificationSubscribeHook = () => {
  const { addUserSubscriptionAPI } = useAddUserSubscriptionAPI();
  const dispatch = useDispatch()

  async function regSw() {
    if ('serviceWorker' in navigator) {
      const url = `${REACT_APP_FRONT_URL}/sw.js`;
      const reg: ServiceWorkerRegistration =
        await navigator.serviceWorker.register(url, { scope: '/' });
      return reg;
    }
    throw Error('serviceWorker not supported');
  }

  async function subscribe(serviceWorkerReg: ServiceWorkerRegistration) {
    let subscription = await serviceWorkerReg.pushManager.getSubscription();
    if (subscription === null) {
      subscription = await serviceWorkerReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: REACT_APP_PUBLIC_VAPID_KEY || '',
      });
    }
    const { data } = await addUserSubscriptionAPI({ subscription });
    if (data && data.id && data.subscription) {
      dispatch(setUserNotificationSubscription({
        subscription: {
          id: data.id,
          subscription: data.subscription
        }
      }))
    }
  }

  async function registerAndSubscribe() {
    try {
      const serviceWorkerReg: ServiceWorkerRegistration = await regSw();
      await subscribe(serviceWorkerReg);
    } catch (error) {
      return error;
    }
  }

  return { regSw, subscribe, registerAndSubscribe };
};
