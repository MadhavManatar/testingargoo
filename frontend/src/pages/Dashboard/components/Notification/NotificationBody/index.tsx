import FollowersList from '../FollowingBody/FollowersList';
import NotificationList from './NotificationList';
import { useNotificationService } from '../useNotificationService';
import Button from 'components/Button';
import { useSelector } from 'react-redux';
import { getHasMoreNotification } from 'redux/slices/notificationSlice';

type Props = {
  showFollowers: boolean;
};

const NotificationBody = (props: Props) => {
  const {
    showFollowers,
  } = props;
  const hashMore = useSelector(getHasMoreNotification)
  const { refreshNotification } = useNotificationService();
  // ** states **

  const getMoreData = () => {
    refreshNotification(true);
  };

  return (
    <>
      <div
        className={`notification__body border-t border-t-[#CCCCCC]/20 max-h-[481px] overflow-y-auto ip__FancyScroll ${
          showFollowers ? 'hidden' : ''
        }`}
        id="notification_infiniteScroll"
      >
        <NotificationList />
        {hashMore && <div className="see__all__btn__wrapper p-[14px] flex items-center justify-center">
          <Button onClick={getMoreData} className="primary__Btn font-biotif__Regular text-[14px] px-[22px] py-[8px] transition-all duration-300">
            Load More
          </Button>
        </div>}
      </div>
      <div
        className={`notification__body following__body ${
          showFollowers ? '' : 'hidden'
        }`}
      >
        <FollowersList />
      </div>
    </>
  );
};

export default NotificationBody;
