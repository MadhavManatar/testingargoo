// ** Import Packages **
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// ** Components **
import Icon from 'components/Icon';
import AlertModal from 'components/Modal/AlertModal';

// ** Redux **
import {
  getNotificationsSetting,
  setNotificationSetting,
} from 'redux/slices/notificationSlice';

// ** API **
import { useUpdateNotificationSettingByIdMutation } from 'redux/api/notificationSettingApi';

// ** Constant **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

// ** Types **
import { NotificationType } from '../types/notification-settings';

type Props = {
  id: number;
  type: NotificationType;
};

const NotificationSettingType = (props: Props) => {
  const { type, id } = props;

  // ** hooks **
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const timeSettings = useSelector(getNotificationsSetting);

  // ** state **
  const [status, setStatus] = useState(type.status);
  const [isOpen, setIsOpen] = useState(false);

  // ** APIS **
  const [updateNotificationSettingApi] =
    useUpdateNotificationSettingByIdMutation();

  useEffect(() => {
    if (type.name === 'Summary') {
      dispatch(
        setNotificationSetting({
          summary_notification_time: type.receive_notification_time || null,
        })
      );
    }
    if (type.name === 'Daily') {
      dispatch(
        setNotificationSetting({
          daily_notification_time: type.receive_notification_time || null,
        })
      );
    }
  }, []);

  // API BIND
  const settingUpdate = async () => {
    if (
      ((type.name === 'Summary' &&
        timeSettings.summary_notification_time === null) ||
        (type.name === 'Daily' &&
          timeSettings.daily_notification_time === null)) &&
      type.receive_notification_time === null
    )
      return setIsOpen(true);

    // const payload = {
    //   status: !status,
    //   notification_type_id: type.id,
    // };

    const data = await updateNotificationSettingApi({
      id,
      data: {
        status: !status,
        notification_type_id: type.id,
      },
    });

    if ('data' in data) {
      setStatus(!status);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="min-w-[100px] h-[38px] relative permission__box">
        <input
          className="absolute top-0 left-0 w-full h-full z-[2] opacity-0 cursor-pointer"
          type="checkbox"
          checked={status}
          onChange={() => settingUpdate()}
        />
        <span className="text flex items-center justify-center w-full h-full text-[16px] font-biotif__Medium text-black/50 border-r-[1px] border-r-black/50 duration-300">
          {type.name}
        </span>
      </div>
      <AlertModal
        visible={isOpen}
        onClose={closeModal}
        onCancel={closeModal}
        onSubmit={() =>
          navigate(
            PRIVATE_NAVIGATION.settings.generalSettings.notifications
              .schedule_email_timing.view
          )
        }
        width="800px"
        submitButtonText="Set"
        submitButtonClass="bg-ip__SuccessGreen"
        customIcon={<Icon className="w-full h-full" iconType="alertIcon" />}
      >
        <h5 className="confirmation__title">
          {type.name === 'Summary' &&
            'Kindly set summary Notification time interval'}
          {type.name === 'Daily' &&
            'Kindly set daily Notification time interval '}
        </h5>
      </AlertModal>
    </>
  );
};

export default NotificationSettingType;
