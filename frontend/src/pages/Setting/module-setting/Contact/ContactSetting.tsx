// ** Components **
import CommonTabSettingComp from 'pages/Setting/CommonTabSettingComp';
import SettingLayout from 'pages/Setting/components/SettingLayout';
import ContactType from './JobRole';

// ** Hook **
import useWindowDimensions from 'hooks/useWindowDimensions';

// ** Constant **
import { BREAD_CRUMB } from 'constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';

const ContactSetting = () => {
  const { isMobileView } = useWindowDimensions();

  return isMobileView ? (
    <SettingLayout
      title="Contact Settings"
      breadCrumbPath={BREAD_CRUMB.settings.moduleSetting.contact.role}
      sideBarLinks={SETTING_SIDEBAR.contactSetting}
    >
      <CommonTabSettingComp
        redirectLinks={SETTING_SIDEBAR.contactSetting}
        heading="Contact Settings"
      />
    </SettingLayout>
  ) : (
    <ContactType />
  );
};

export default ContactSetting;
