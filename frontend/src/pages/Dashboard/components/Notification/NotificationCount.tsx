import IconAnimation from 'components/IconAnimation';
import { IconTypeJson } from 'indexDB/indexdb.type';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useLazyGetNotificationsAPIQuery } from 'redux/api/notification/notificationApi';
import {
  getNotificationCount,
  getNotificationParams,
  getNotificationTimeInterval,
} from 'redux/slices/notificationSlice';

const NotificationCount = ({
  toggleDropdown,
}: {
  toggleDropdown: () => void;
}) => {
  // ** hooks **
  const notificationCount = useSelector(getNotificationCount);
  const notificationParams = useSelector(getNotificationParams);
  const pollingInterval = useSelector(getNotificationTimeInterval);

  // ** custom hook **
  const [getNotificationsAPI] = useLazyGetNotificationsAPIQuery();

  const apiRef = useRef(getNotificationsAPI);

  useEffect(() => {
    apiRef
      .current(notificationParams, true)
      .updateSubscriptionOptions({ pollingInterval, refetchOnReconnect: true });
  }, [pollingInterval, notificationParams]);

  return (
    <div onClick={toggleDropdown}>
      <IconAnimation
        iconType="notificationFilled"
        animationIconType={IconTypeJson.Notification}
        className={`notification__btn inline-flex items-center justify-center w-[30px] h-[30px] rounded-[8px] duration-500 !hover:bg-[#E8F1F8] !bg-transparent ${
          notificationCount > 0 ? 'notification__available' : ''
        }`}
      />
      {notificationCount > 0 && (
        <span className="count bg-primaryColor text-white pt-[2px] pb-[1px] px-[6px] rounded-[100px] text-[10px] font-biotif__SemiBold absolute top-[-3px] right-[-3px] border-[1px] border-white">
          {notificationCount}
        </span>
      )}
    </div>
  );
};

export default NotificationCount;
