import { BREAD_CRUMB } from 'constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';
import SettingLayout from 'pages/Setting/components/SettingLayout';
import IconSettingForm from './components/IconSetting';

const IconSettings = () => {
  const SIDEBAR_LINKS = SETTING_SIDEBAR.commonControls;
  return (
    <SettingLayout
      title="Common Controls"
      breadCrumbPath={
        BREAD_CRUMB.settings.generalSettings.commonControls.iconSetting
      }
      sideBarLinks={SIDEBAR_LINKS}
    >
      <IconSettingForm />
      <></>
    </SettingLayout>
  );
};

export default IconSettings;
