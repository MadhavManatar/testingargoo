// ** Components **
import CommonTabSettingComp from 'pages/Setting/CommonTabSettingComp';
import SettingLayout from 'pages/Setting/components/SettingLayout';
import DealGeneralSetting from './GeneralSettings';

// ** Hook **
import useWindowDimensions from 'hooks/useWindowDimensions';

// ** Constant **
import { BREAD_CRUMB } from 'constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';

const DealSetting = () => {
  const { isMobileView } = useWindowDimensions();

  return isMobileView ? (
    <SettingLayout
      title="Deal Settings"
      breadCrumbPath={BREAD_CRUMB.settings.moduleSetting.deal.generalSettings}
      sideBarLinks={SETTING_SIDEBAR.dealSetting}
    >
      <CommonTabSettingComp
        redirectLinks={SETTING_SIDEBAR.dealSetting}
        heading="Deal Settings"
      />
    </SettingLayout>
  ) : (
    <DealGeneralSetting />
  );
};

export default DealSetting;
