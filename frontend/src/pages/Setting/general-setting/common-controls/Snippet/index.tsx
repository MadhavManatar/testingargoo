// ** Import Packages **
import { useState } from 'react';

// ** Components **
import SettingLayout from 'pages/Setting/components/SettingLayout';
import SnippetCategory from './SnippetCategory';
import SnippetSetting from './SnippetSetting';
import SnippetTabs from './components/SnippetTabComponent';

// ** Constants **
import { BREAD_CRUMB } from 'constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';

// ** Types **
import { snippetTabType } from './types/snippet.types';

const Snippet = () => {
  const SIDEBAR_LINKS = SETTING_SIDEBAR.commonControls;

  // ** hooks **
  const [activeModuleTab, setActiveModuleTab] =
    useState<snippetTabType>('snippet');

  const changeTab = (tab: snippetTabType) => {
    if (tab !== activeModuleTab) {
      setActiveModuleTab(tab);
    }
  };

  return (
    <SettingLayout
      title="Common Controls"
      breadCrumbPath={
        BREAD_CRUMB.settings.generalSettings.commonControls.snippet
      }
      sideBarLinks={SIDEBAR_LINKS}
    >
      <SnippetTabs changeTab={changeTab} setTab={activeModuleTab} />
      {activeModuleTab === 'snippet' && <SnippetSetting />}
      {activeModuleTab === 'category' && <SnippetCategory />}
    </SettingLayout>
  );
};

export default Snippet;
