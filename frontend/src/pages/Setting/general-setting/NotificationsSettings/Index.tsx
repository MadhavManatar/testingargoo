// ** Import Packages **
import { useEffect, useState } from 'react';

// ** Components **
import SettingLayout from 'pages/Setting/components/SettingLayout';

// ** API **
import { useLazyGetNotificationSettingQuery } from 'redux/api/notificationSettingApi';

// ** Type **
import NotificationSettingType from './Components/NotificationSettingType';
import { NotificationSetting } from './types/notification-settings';

// ** Constant **
import { BREAD_CRUMB } from 'constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';

const NotificationSettings = () => {
  const SIDEBAR_LINKS = SETTING_SIDEBAR.notification;
  // ** states **
  const [settings, setSettings] = useState<NotificationSetting[]>();

  // ** APIS **
  const [getNotificationSettingApi] = useLazyGetNotificationSettingQuery();

  useEffect(() => {
    getNotificationSetting();
  }, []);

  const getNotificationSetting = async () => {
    const data = await getNotificationSettingApi({}, true);
    if ('data' in data) {
      setSettings(data?.data);
    }
  };

  return (
    <SettingLayout
      title="Notification"
      breadCrumbPath={BREAD_CRUMB.settings.generalSettings.notification}
      sideBarLinks={SIDEBAR_LINKS}
    >
      <div className="notification-wrapper flex flex-wrap">
        <div className="left w-[300px] pr-[20px]">
          <h2 className="text-[20px] font-biotif__Medium text-ipBlack__textColor">
            Default Notification
          </h2>
        </div>
        <div className="right w-[calc(100%_-_300px)]">
          {settings &&
            settings.map((setting: NotificationSetting, index: number) => (
              <div
                key={`notification_setting_${index}`}
                className="notification__box flex items-center justify-between mb-[20px] pb-[20px] border-b-[1px] border-b-whiteScreen__BorderColor last:mb-0 last:pb-0 last:border-b-0"
              >
                <div className="left w-[calc(100%_-_403px)]">
                  <h4 className="text-[18px] font-biotif__Medium text-black__TextColor600">
                    {setting.name}
                  </h4>
                </div>
                <div className="right justify-end w-[402px]">
                  <div className="inline-flex flex-wrap border-[1px] border-greyScreen__BorderColor rounded-[6px] overflow-hidden">
                    {(setting.types || []).map((type, index1) => (
                      <NotificationSettingType
                        key={`notification_setting_type_${index1}`}
                        type={type}
                        id={setting.id}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </SettingLayout>
  );
};

export default NotificationSettings;
