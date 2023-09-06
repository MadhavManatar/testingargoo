// ** Components **
import CommonTabSettingComp from 'pages/Setting/CommonTabSettingComp';
import SettingLayout from 'pages/Setting/components/SettingLayout';
import ConnectEmail from './ConnectEmail';

// ** Hook **
import useWindowDimensions from 'hooks/useWindowDimensions';

// ** Constant **
import { BREAD_CRUMB } from 'constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';

const EmailSetting = () => {
  const { isMobileView } = useWindowDimensions();

  return isMobileView ? (
    <SettingLayout
      title="Email Setting"
      breadCrumbPath={BREAD_CRUMB.connectEmail}
      sideBarLinks={SETTING_SIDEBAR.emailSetting}
    >
      <CommonTabSettingComp
        redirectLinks={SETTING_SIDEBAR.emailSetting}
        heading="Email Setting"
      />
    </SettingLayout>
  ) : (
    <ConnectEmail />
  );
};

export default EmailSetting;
