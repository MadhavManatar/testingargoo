// ** Components **
import CommonTabSettingComp from 'pages/Setting/CommonTabSettingComp';
import SettingLayout from 'pages/Setting/components/SettingLayout';
import LeadTemperatureStatus from './LeadTemperatureStatus';

// ** Hook **
import useWindowDimensions from 'hooks/useWindowDimensions';

// ** Constants **
import { BREAD_CRUMB } from 'constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';

const LeadSetting = () => {
  const { isMobileView } = useWindowDimensions();

  return isMobileView ? (
    <SettingLayout
      title="Lead Settings"
      breadCrumbPath={BREAD_CRUMB.settings.moduleSetting.lead.temperatureStatus}
      sideBarLinks={SETTING_SIDEBAR.leadSettings}
    >
      <CommonTabSettingComp
        redirectLinks={SETTING_SIDEBAR.leadSettings}
        heading="Lead Settings"
      />
    </SettingLayout>
  ) : (
    <LeadTemperatureStatus />
  );
};

export default LeadSetting;
