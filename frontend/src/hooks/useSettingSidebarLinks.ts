// ** Hook **
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';
import usePermission from './usePermission';

// ** Constant **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

const useSettingSidebarLinks = () => {
  const {
    readDealPermission,
    readLeadPermission,
    readContactPermission,
    readAccountPermission,
  } = usePermission();

  const leadDealLink =
    PRIVATE_NAVIGATION.settings.generalSettings.commonControls.leadDealSource
      .view;
  const contactAccountLink =
    PRIVATE_NAVIGATION.settings.generalSettings.commonControls.phoneTypeSetting
      .view;

  const hasCommonControlsPermission = (link: string) => {
    return (
      (link === leadDealLink && (readDealPermission || readLeadPermission)) ||
      (link === contactAccountLink &&
        (readContactPermission || readAccountPermission)) ||
      (link !== leadDealLink && link !== contactAccountLink)
    );
  };

  const filterCommonControlsSideBarLink = () => {
    return SETTING_SIDEBAR.commonControls.filter((navigate: { link: string }) =>
      hasCommonControlsPermission(navigate.link)
    );
  };

  return { filterCommonControlsSideBarLink };
};

export default useSettingSidebarLinks;
