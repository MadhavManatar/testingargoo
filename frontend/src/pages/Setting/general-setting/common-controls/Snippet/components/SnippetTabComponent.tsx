import { useEffect, useState } from 'react';
import { SNIPPET_TABS, snippetTabsPropsType } from '../types/snippet.types';

const SnippetTabs = (props: snippetTabsPropsType) => {
  const { isModelTabs = false, changeTab, setTab } = props;

  // ** states **
  const [activeModuleTab, setActiveModuleTab] = useState<string>(
    setTab || 'snippet'
  );

  useEffect(() => {
    if (setTab) {
      setActiveModuleTab(setTab);
    }
  }, [setTab]);

  return (
    <div
      className={`following__tab w-full flex overflow-x-auto ${
        isModelTabs
          ? ``
          : `border-b-[1px] border-b-whiteScreen__BorderColor mb-[10px]`
      }`}
    >
      {SNIPPET_TABS.map((tab, index) => (
        <button
          key={`${index}_snippet`}
          onClick={() => {
            setActiveModuleTab(tab.value);
            return changeTab && changeTab(tab.value);
          }}
          className={`following__tab__btn relative py-[6px] px-[8px] text-[16px] font-biotif__Medium text-primaryColor capitalize ${
            tab.value === activeModuleTab ? '' : 'opacity-50'
          } before:content-[''] before:w-${
            tab.value === activeModuleTab ? 'full' : '[0px]'
          } before:h-[2px] before:bg-primaryColor before:bottom-0 before:left-0 before:absolute before:duration-300 hover:opacity-100`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default SnippetTabs;
