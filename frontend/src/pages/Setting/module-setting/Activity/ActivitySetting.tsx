// ** Components **
import CommonTabSettingComp from 'pages/Setting/CommonTabSettingComp';
import SettingLayout from 'pages/Setting/components/SettingLayout';
import TimeSet from './TimSet';

// ** Hook **
import useWindowDimensions from 'hooks/useWindowDimensions';

// ** Constants **
import { BREAD_CRUMB } from 'constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';

const ActivitySetting = () => {
  const { isMobileView } = useWindowDimensions();

  return isMobileView ? (
    <SettingLayout
      title="Security Settings"
      breadCrumbPath={
        BREAD_CRUMB.settings.moduleSetting.activity.defaultTimeSet
      }
      sideBarLinks={SETTING_SIDEBAR.securitySettings}
    >
      <CommonTabSettingComp
        redirectLinks={SETTING_SIDEBAR.securitySettings}
        heading="Security Settings"
      />
    </SettingLayout>
  ) : (
    <TimeSet />
  );
};

export default ActivitySetting;
