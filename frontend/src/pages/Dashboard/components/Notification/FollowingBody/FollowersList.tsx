import { useEffect, useRef, useState } from 'react';
import Icon, { IconTypes } from 'components/Icon';
import FollowingTabs from './FollowingTabs';
import { followingEntitiesIcons } from '../../constant/followers.constant';
import {
  FollowingEntitiesType,
  FollowingTabType,
} from 'components/EntityDetails/FollowFollowing/types/follower.types';
import { useSelector } from 'react-redux';
import { ModuleNames } from 'constant/permissions.constant';
import Button from 'components/Button';
import { useNavigate } from 'react-router-dom';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import useFollowFollowing from 'components/EntityDetails/FollowFollowing/useFollowFollowing';
import { getCurrentUser } from 'redux/slices/authSlice';
import NoDataFound from 'components/EntityDetails/Timeline/components/NoDataFound';

type entityType = { id: number; name?: string; topic: string };

const FollowersList = () => {
  // ** hook **
  const navigate = useNavigate();
  const currentUser = useSelector(getCurrentUser);

  // ** states **
  const [activeModuleTab, setActiveModuleTab] = useState<FollowingTabType>({
    label: 'lead',
    value: ModuleNames.LEAD,
  });

  const entityId = useRef<number>();

  // ** custom hook **
  const {
    fetchFollowingEntities,
    followUnFollowEntity,
    followingEntities,
    accounts,
    activities,
    contacts,
    deals,
    leads,
  } = useFollowFollowing({
    moduleName: activeModuleTab.value,
    entityId: entityId.current,
  });

  const [followers, setFollowers] = useState<FollowingEntitiesType>({
    leads,
    deals,
    accounts,
    contacts,
    activities,
  });

  useEffect(() => {
    if (
      followingEntities[
        activeModuleTab.value as keyof typeof followingEntities
      ] === null
    ) {
      fetchFollowingEntities();
    } else {
      setFollowers(followingEntities);
    }
  }, [followingEntities]);

  const onTabChange = (tab: FollowingTabType) => {
    setActiveModuleTab(
      tab.label === 'deal' ? { label: 'deal', value: ModuleNames.DEAL } : tab
    );
  };

  return (
    <>
      <FollowingTabs isModelTabs changeTab={onTabChange} />
      <div
        className="tab__contant max-h-[445px] overflow-y-auto ip__FancyScroll"
        id="follower_list"
      >
        <div className="item__wrapper">
          {followers[activeModuleTab.value as keyof typeof followers]
            ?.length !== 0 ? (
            followers[activeModuleTab.value as keyof typeof followers]?.map(
              (item, index) => {
                const entityName: entityType = item?.[
                  (activeModuleTab.label === 'deal'
                    ? 'lead'
                    : activeModuleTab.label) as keyof typeof item
                ] as entityType;
                return index < 10 ? (
                  <div
                    key={`follower_list_${index}`}
                    className="item px-[14px] py-[10px] flex justify-between items-center bg-[#F8F8F8] border-b border-b-[#CCCCCC]/20"
                  >
                    <div className="left flex items-center max-w-[calc(100%_-_90px)] pr-[10px]">
                      <Icon
                        className="fol__icon w-[32px] h-[32px] rounded-[4px] bg-[#E2EBF2] p-[7px]"
                        iconType={
                          followingEntitiesIcons[
                            activeModuleTab.label as keyof typeof followingEntitiesIcons
                          ] as IconTypes
                        }
                      />
                      <h3 className="name max-w-[calc(100%_-_32px)] text-[16px] font-biotif__Medium text-black pl-[12px] ellipsis__2">
                        {entityName?.name || entityName?.topic}
                      </h3>
                    </div>
                    <button
                      onClick={() =>
                        currentUser &&
                        followUnFollowEntity(currentUser, true, entityName?.id)
                      }
                      className="text-[14px] font-biotif__Medium text-black bg-[#E6E6E6] rounded-[6px] px-[16px] py-[5px] duration-300 hover:bg-black hover:text-white"
                    >
                      Unfollow
                    </button>
                  </div>
                ) : (
                  ''
                );
              }
            )
          ) : (
            <div className="">
              <NoDataFound />
            </div>
          )}
        </div>
      </div>
      <div className="see__all__btn__wrapper p-[14px]">
        {(
          followers[activeModuleTab.value as keyof typeof followers] as object[]
        )?.length > 9 && (
          <Button
            onClick={() =>
              navigate(
                PRIVATE_NAVIGATION.settings.generalSettings.notifications
                  .following.view,
                { state: { activeTab: activeModuleTab } }
              )
            }
            className="primary__Btn font-biotif__Regular text-[14px] px-[22px] py-[8px]"
          >
            See All
          </Button>
        )}
      </div>
    </>
  );
};

export default FollowersList;
