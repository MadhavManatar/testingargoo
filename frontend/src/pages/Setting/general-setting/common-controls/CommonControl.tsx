// ** Components **
import CommonTabSettingComp from 'pages/Setting/CommonTabSettingComp';
import SettingLayout from 'pages/Setting/components/SettingLayout';
import Tags from './Tag';

// ** Hook **
import useSettingSidebarLinks from 'hooks/useSettingSidebarLinks';
import useWindowDimensions from 'hooks/useWindowDimensions';

// ** Constant **
import { BREAD_CRUMB } from 'constant';

const CommonControl = () => {
  const { isMobileView } = useWindowDimensions();
  const { filterCommonControlsSideBarLink } = useSettingSidebarLinks();
  const SIDEBAR_LINKS = filterCommonControlsSideBarLink();

  return isMobileView ? (
    <SettingLayout
      title="Common Controls"
      breadCrumbPath={
        BREAD_CRUMB.settings.generalSettings.commonControls.tagControl
      }
      sideBarLinks={SIDEBAR_LINKS}
    >
      <CommonTabSettingComp
        redirectLinks={SIDEBAR_LINKS}
        heading="Common Control"
      />
    </SettingLayout>
  ) : (
    <Tags />
  );
};

export default CommonControl;
