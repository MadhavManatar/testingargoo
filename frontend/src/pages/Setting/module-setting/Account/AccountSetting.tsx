// ** Components **
import CommonTabSettingComp from 'pages/Setting/CommonTabSettingComp';
import SettingLayout from 'pages/Setting/components/SettingLayout';
import ParentAccountSetting from './ParentAccountSetting';

// ** Hook **
import useWindowDimensions from 'hooks/useWindowDimensions';

// ** Constant **
import { BREAD_CRUMB } from 'constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';

const AccountSetting = () => {
  const { isMobileView } = useWindowDimensions();

  return isMobileView ? (
    <SettingLayout
      title="Account Settings"
      breadCrumbPath={BREAD_CRUMB.settings.moduleSetting.account.type}
      sideBarLinks={SETTING_SIDEBAR.accountSetting}
    >
      <CommonTabSettingComp
        redirectLinks={SETTING_SIDEBAR.accountSetting}
        heading="Account Settings"
      />
    </SettingLayout>
  ) : (
    <ParentAccountSetting />
  );
};

export default AccountSetting;
