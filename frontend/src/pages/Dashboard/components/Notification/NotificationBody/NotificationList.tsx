import { useSelector } from 'react-redux';
import { getNotificationsData } from 'redux/slices/notificationSlice';
import RenderItemsHandler from './RenderItemsHandler';
import NoDataFound from 'components/EntityDetails/Timeline/components/NoDataFound';

const NotificationList = () => {
  const notification = useSelector(getNotificationsData);
  return (
    <>
      {notification?.length !== undefined &&
      Number(notification?.length) > 0 ? (
        notification?.map((item, index) => {
          return (
            <div
              key={`${index}_notifications_${item?.notification?.message?.changes}`}
              className="notification__item__wrapper pb-[10px] border-b border-b-[#CCCCCC]/20"
            >
              <RenderItemsHandler notification={item} indexNo={index} />
            </div>
          );
        })
      ) : (
        <NoDataFound />
      )}
    </>
  );
};

export default NotificationList;
