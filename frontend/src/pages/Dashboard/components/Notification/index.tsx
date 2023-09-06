import Icon from 'components/Icon';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getFollowingEntityCount } from 'redux/slices/followerSlice';
import {
  getNotificationParams,
  setNotificationClear,
  setNotificationParams,
} from 'redux/slices/notificationSlice';
import NotificationBody from './NotificationBody';
import { notificationStatus } from './types/notification.types';
import { useNotificationService } from './useNotificationService';

const Notification = () => {
  // ** hooks **
  const dispatch = useDispatch();
  const notificationParams = useSelector(getNotificationParams);
  const followingCount = useSelector(getFollowingEntityCount);
  // ** custom hook **
  const { markAsRead } = useNotificationService();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  // ** states **
  const [showFollowers, setShowFollowers] = useState<boolean>(false);

  const getReadUnReadData = () => {
    dispatch(setNotificationClear(true));
    if (inputRef.current) {
      inputRef.current?.click();
    }
    return dispatch(
      setNotificationParams({
        ...notificationParams,
        'q[status]':
          notificationParams['q[status]'] === notificationStatus.UNREAD
            ? notificationStatus.READ
            : notificationStatus.UNREAD,
      })
    );
  };
  const handleInputClick = () => {
    buttonRef.current?.click();
  };

  return (
    <div className="notification__modal absolute top-[calc(100%_+_10px)] right-[-95px]">
      <div className="inner__wrapper bg-[#FFFFFF] shadow-[0px_3px_17px_#0000001a] rounded-[10px] overflow-hidden w-[570px] sm:w-[294px]">
        <div className="notification__header flex items-center justify-between py-[14px] px-[20px] pl-[10px] sm:px-[15px]">
          <div
            className={`inline-flex items-center ${
              showFollowers ? 'cursor-pointer' : ''
            }`}
            onClick={() => showFollowers && setShowFollowers(false)}
          >
            {showFollowers && (
              <Icon
                className="back__btn p-[3px] mr-[4px] relative top-[-1px] cursor-pointer"
                iconType="inboxViewBackFilledIcon"
              />
            )}
            <h2 className="text-black text-[16px] font-biotif__Medium pr-[10px]">
              Notification
            </h2>
          </div>
          <div className="right__action inline-flex items-center justify-between">
            <div className="link__wrapper inline-flex items-center">
              {notificationParams['q[status]'] === notificationStatus.UNREAD &&
                !showFollowers && (
                  <button
                    onClick={() => markAsRead('all', true)}
                    className="link text-[14px] whitespace-pre font-biotif__Regular text-black/50 relative mr-[10px] pr-[10px] duration-300 hover:text-black before:content-[''] before:absolute before:right-0 before:top-[50%] before:translate-y-[-50%] before:w-[1px] before:h-full before:bg-[#CCCCCC]"
                  >
                    Mark all as read
                  </button>
                )}
              {!showFollowers && (
                <button
                  ref={buttonRef}
                  onClick={() => getReadUnReadData()}
                  className="link inline-flex items-center text-[14px] whitespace-pre font-biotif__Regular text-black/50 relative mr-[10px] pr-[10px] duration-300 hover:text-black before:content-[''] before:absolute before:right-0 before:top-[50%] before:translate-y-[-50%] before:w-[1px] before:h-full before:bg-[#CCCCCC]"
                >  
                  Show read
                  <div className="form__Group toggleSwitch mb-0 ml-[8px]">
                    <div className="ip__Checkbox toggleSwitch mb-0">
                      <input
                        type="checkbox"
                        ref={inputRef}
                        onClick={handleInputClick}
                        name="isAutoSuggestAddressEnabled"
                        defaultChecked={
                          notificationParams['q[status]'] ===
                          notificationStatus.READ
                        }
                      />
                      <label className="rc__Label ">
                        <span className="custom__checkRadio__tick hidden" />
                      </label>
                    </div>
                  </div>
                </button>
              )}
              <button
                onClick={() => setShowFollowers(true)}
                className="link text-[14px] whitespace-pre font-biotif__Regular text-black/50 relative mr-[10px] pr-[10px] duration-300 hover:text-black before:content-[''] before:absolute before:right-0 before:top-[50%] before:translate-y-[-50%] before:w-[1px] before:h-full before:bg-[#CCCCCC] last:mr-[5px]"
              >
                Following ({followingCount?.totalFollowing})
              </button>
            </div>
            <Link
              to={
                PRIVATE_NAVIGATION.settings.generalSettings.notifications
                  .notification.view
              }
            >
              <Icon
                className="setting__btn cursor-pointer w-[24px] h-[24px] p-[3px]"
                iconType="settingFilled"
              />
            </Link>
          </div>
        </div>
        <NotificationBody showFollowers={showFollowers} />
      </div>
    </div>
  );
};

export default Notification;
