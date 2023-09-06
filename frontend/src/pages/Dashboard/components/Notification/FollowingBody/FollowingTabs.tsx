import { FollowingTabType } from 'components/EntityDetails/FollowFollowing/types/follower.types';
import { ModuleTabs } from 'constant/table.constant';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getFollowingEntityCount } from 'redux/slices/followerSlice';

const followCountKeys = {
  lead: 'lead_followers_count',
  deal: 'deal_followers_count',
  account: 'account_followers_count',
  contact: 'contact_followers_count',
  activity: 'activity_followers_count',
};

const FollowingTabs = ({
  isModelTabs = false,
  changeTab,
  setTab,
}: {
  isModelTabs?: boolean;
  changeTab?: (module: FollowingTabType) => void;
  setTab?: FollowingTabType;
}) => {
  const stack = useSelector(getFollowingEntityCount);
  // ** states **
  const [activeModuleTab, setActiveModuleTab] = useState<string>(
    setTab?.label || 'lead'
  );

  useEffect(() => {
    if (setTab) {
      setActiveModuleTab(setTab.label);
    }
  }, [setTab]);

  return (
    <div
      className={`following__tab w-full flex overflow-x-auto ${
        isModelTabs ? `` : `border-b-[1px] border-b-[#CCCCCC]/50 mb-[10px]`
      }`}
    >
      {ModuleTabs?.map((tab, index) => {
        const vlue =
          stack[
            followCountKeys[
              tab.label as keyof typeof followCountKeys
            ] as keyof typeof stack
          ];

        return (
          <button
            key={`${index}_follower_tab_button_${tab}`}
            onClick={() => {
              setActiveModuleTab(tab.label);
              return changeTab && changeTab(tab);
            }}
            className={`following__tab__btn relative py-[6px] px-[8px] text-[16px] font-biotif__Medium text-primaryColor capitalize ${
              tab.label === activeModuleTab ? '' : 'opacity-50'
            } before:content-[''] before:w-${
              tab.label === activeModuleTab ? 'full' : '[0px]'
            } before:h-[2px] before:bg-primaryColor before:bottom-0 before:left-0 before:absolute before:duration-300 hover:opacity-100`}
          >
            {tab.label}
            <span className="inline-block ml-[5px] text-[15px]">
              {vlue !== 0 ? `(${vlue})` : ''}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default FollowingTabs;
