// ** Import Packages **

// ** Redux **
import { useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getNotificationCount,
  getNotificationPage,
  getNotificationParams,
  getNotificationsData,
  setRemoveNotification,
  setNotificationPage,
  setNotifications,
  setNotificationsCount,
} from 'redux/slices/notificationSlice';

// ** Types **
import {
  notificationStatus,
  UserNotification,
} from './types/notification.types';

// ** Services **
import { useReadNotificationAPI } from './services/notification.services';
import { useLazyGetNotificationsAPIQuery } from 'redux/api/notification/notificationApi';

// ** Constant **

export const useNotificationService = () => {
  // ** Hooks **
  const dispatch = useDispatch();

  // ** custom hooks **
  const notificationParams = useSelector(getNotificationParams);
  const notifications = useSelector(getNotificationsData);
  const notificationCounts = useSelector(getNotificationCount);
  const currentPage = useSelector(getNotificationPage);
  const { readNotificationAPI } = useReadNotificationAPI();

  const [getNotificationsAPI] = useLazyGetNotificationsAPIQuery();

  const notificationsRef = useRef<UserNotification[] | null>(notifications);
  const notificationCountRef = useRef<number>(notificationCounts);
  notificationCountRef.current = useMemo(() => {
    return notificationCounts;
  }, [notificationCounts]);
  notificationsRef.current = useMemo(() => {
    return notifications;
  }, [notifications]);

  // ** on reload fetch notification **
  const refreshNotification = async (loadMore?: boolean) => {
    await getNotificationsAPI({
      ...notificationParams,
      ...(loadMore ? { page: currentPage } : {}),
    });
    if (loadMore)
      dispatch(setNotificationPage({ currentPage: currentPage + 1 }));
  };

  // ** mark as read notification **
  const markAsRead = async (id: number[] | 'all', status: boolean, index?: number[]) => {
    const { data, error } = await readNotificationAPI({ notification_ids: id, status: status ? notificationStatus.READ : notificationStatus.UNREAD });
    if (!error && data) {
      if (id === 'all') {
        notificationsRef.current =
          notificationsRef.current?.map((item) => {
            return { ...item, status: notificationStatus.READ };
          }) || [];
        dispatch(setNotificationsCount(0))
        setTimeout(() => {
          return dispatch(
            setNotifications({ data: [], count: 0 })
          )
        }, 2000);
        return
      }
      dispatch(setNotificationsCount(status ? notificationCountRef.current - data[0] : notificationCountRef.current + data[0]))
      if (index) {
        return setTimeout(() => {
          dispatch(
            setRemoveNotification({ index: index instanceof Array ? index : [index], status: status ? notificationStatus.READ : notificationStatus.UNREAD })
          );
        }, 2000)
      }
    }
  };

  return {
    data: notificationsRef.current,
    notificationCounts,
    refreshNotification,
    markAsRead,
    notificationParams,
  };
};
