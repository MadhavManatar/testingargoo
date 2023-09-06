// ** Components **
import CommonTabSettingComp from 'pages/Setting/CommonTabSettingComp';
import SettingLayout from 'pages/Setting/components/SettingLayout';
import ManageSessions from './ManageSessions';

// ** Hook **
import useWindowDimensions from 'hooks/useWindowDimensions';

// ** Constant **
import { BREAD_CRUMB } from 'constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';

const SecuritySettings = () => {
  const { isMobileView } = useWindowDimensions();

  return isMobileView ? (
    <SettingLayout
      title="Security Settings"
      breadCrumbPath={
        BREAD_CRUMB.settings.generalSettings.securitySettings.manageSessions
      }
      sideBarLinks={SETTING_SIDEBAR.securitySettings}
    >
      <CommonTabSettingComp
        redirectLinks={SETTING_SIDEBAR.securitySettings}
        heading="Security Settings"
      />
    </SettingLayout>
  ) : (
    <ManageSessions />
  );
};

export default SecuritySettings;
