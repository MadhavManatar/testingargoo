import { FollowingTabType } from 'components/EntityDetails/FollowFollowing/types/follower.types';
import useFollowFollowing from 'components/EntityDetails/FollowFollowing/useFollowFollowing';
import NoDataFound from 'components/EntityDetails/Timeline/components/NoDataFound';
import Icon from 'components/Icon';
import InfiniteScroll from 'components/InfiniteScroll';
import { BREAD_CRUMB } from 'constant';
import { ModuleNames } from 'constant/permissions.constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';
import {
  followingEntitiesIcons,
  getModelQuery,
} from 'pages/Dashboard/components/constant/followers.constant';
import FollowingTabs from 'pages/Dashboard/components/Notification/FollowingBody/FollowingTabs';
import { useGetFollowingEntitiesApi } from 'pages/Dashboard/components/Notification/services/following.services';
import SettingLayout from 'pages/Setting/components/SettingLayout';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getCurrentUser } from 'redux/slices/authSlice';
import { getFollowingEntityCount } from 'redux/slices/followerSlice';

const followCountKeys = {
  contacts: 'contact_followers_count',
  accounts: 'account_followers_count',
  leads: 'lead_followers_count',
  deals: 'deal_followers_count',
  activities: 'activity_followers_count',
};

const FollowingEntities = () => {
  const SIDEBAR_LINKS = SETTING_SIDEBAR.notification;

  // ** hooks **
  const currentUser = useSelector(getCurrentUser);
  const followingCounts = useSelector(getFollowingEntityCount);
  const { state } = useLocation();
  const { activeTab } = (state as { activeTab: FollowingTabType }) || {
    activeTab: undefined,
  };

  const [activeModuleTab, setActiveModuleTab] = useState<FollowingTabType>(
    activeTab || { label: 'lead', value: ModuleNames.LEAD }
  );

  // ** custom hooks **
  const { getFollowingEntitiesAPI } = useGetFollowingEntitiesApi();
  const {
    followUnFollowEntity,
    fetchFollowingEntities,
    followingEntities,
    accounts,
    activities,
    deals,
    contacts,
    leads,
  } = useFollowFollowing({ moduleName: activeModuleTab.value });

  // ** states **
  const [search, setSearch] = useState<string>();
  const [scrollPagination, setScrollPagination] = useState({
    hasMore: true,
    page: 1,
  });
  const [following, setFollowing] = useState({
    leads,
    deals,
    accounts,
    contacts,
    activities,
  });

  useMemo(() => {
    if (followingEntities) {
      const currentTabEntityStoreLength =
        followingEntities[
          activeModuleTab.value as keyof typeof followingEntities
        ];
      const currentTabFiltered = [
        ...(following[activeModuleTab.value as keyof typeof following] || []),
      ]?.filter((item, index: number) => {
        if (
          currentTabEntityStoreLength &&
          index <= currentTabEntityStoreLength?.length
        ) {
          return [...(currentTabEntityStoreLength || [])]?.find(
            (entity) => entity.id === item?.id
          );
        }
        return false;
      });
      setFollowing({
        ...following,
        [activeModuleTab.value]: currentTabFiltered,
      });
    }
  }, [followingEntities]);

  useEffect(() => {
    if (scrollPagination.hasMore) {
      const entityCount =
        followingCounts[
          followCountKeys[
            activeModuleTab.value as keyof typeof followCountKeys
          ] as keyof typeof followingCounts
        ];
      if (entityCount === null) fetchFollowingEntities();
      if (entityCount) {
        const haveMoreData = Math.ceil(entityCount / 10);
        if (haveMoreData >= 0 && haveMoreData >= scrollPagination?.page) {
          getFollowingEntities(activeModuleTab);
        }
      }
    }
  }, [scrollPagination]);

  useEffect(() => {
    if (
      activeTab &&
      followingEntities[
        activeModuleTab.value as keyof typeof followingEntities
      ] === null
    ) {
      fetchFollowingEntities();
      setActiveModuleTab(activeTab);
    }
  }, [activeTab]);
  
  useEffect(()=>{
    getFollowingEntities(activeModuleTab);
  }, [search])

  const searchHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const getFollowingEntities = async (module: FollowingTabType) => {
    setActiveModuleTab(module);

    const { data, error } = await getFollowingEntitiesAPI(module.value, {
      query: {
        ...getModelQuery(module.value, search),
        page: scrollPagination.page,
      },
    });

    if (!error && data) {
      if (scrollPagination.page > 1) {
        return setFollowing({
          ...following,
          [activeModuleTab.value]: [
            ...(following[activeModuleTab.value as keyof typeof following] ||
              []),
            ...data.rows,
          ],
        });
      }
      return setFollowing({
        ...following,
        [activeModuleTab.value]: data?.rows,
      });
    }
  };

  const changeTab = (tab: FollowingTabType) => {
    if (tab.value !== activeModuleTab?.value) {
      setActiveModuleTab(tab);
      setScrollPagination({ hasMore: true, page: 1 });
    }
  };

  const unFollowEntity = async (id: number) => {
    if (id && currentUser) {
      await followUnFollowEntity(currentUser, true, id);
      return setFollowing({
        ...following,
        [activeModuleTab.value]: [
          ...(following[activeModuleTab.value as keyof typeof following] || []),
        ]?.filter(
          (item: any) =>
            item[
              activeModuleTab.label === 'deal' ? 'lead' : activeModuleTab.label
            ]?.id !== id
        ),
      });
    }
  };

  return (
    <SettingLayout
      title="Notification"
      breadCrumbPath={BREAD_CRUMB.settings.generalSettings.notification}
      sideBarLinks={SIDEBAR_LINKS}
    >
      <div className="form__Group w-[300px] max-w-full mb-[10px]">
        <div className="ip__form__hasIcon">
          <input
            placeholder="Search"
            className="ip__input rounded-[10px]"
            type="search"
            onChange={(event) => searchHandler(event)}
          />
          <Icon className="grayscale" iconType="searchStrokeIcon" />
        </div>
      </div>
      <FollowingTabs changeTab={changeTab} setTab={activeModuleTab} />
      <div
        className="tab__contant max-h-[calc(100vh_-_395px)] overflow-y-auto ip__FancyScroll"
        id="follower_list"
      >
        <div className="item__wrapper">
          <InfiniteScroll
            hasMore={scrollPagination.hasMore}
            next={() => {
              if (scrollPagination.hasMore) {
                setScrollPagination((prev) => ({
                  ...prev,
                  page: prev.page + 1,
                }));
              }
            }}
            scrollableTarget="follower_list"
          >
            {following[activeModuleTab.value as keyof typeof following]
              ?.length !== undefined &&
            Number(
              following[activeModuleTab.value as keyof typeof following]?.length
            ) > 0 ? (
              following[activeModuleTab.value as keyof typeof following]?.map(
                (item, index) => {
                  const itemObj:
                    | { id: number; name?: string; topic?: string }
                    | undefined = item[
                    (activeModuleTab.label === 'deal'
                      ? 'lead'
                      : activeModuleTab.label) as keyof typeof item
                  ] as { id: number; name?: string; topic?: string };
                  return (
                    <div
                      key={`${index}_followers_list_${item}`}
                      className="item px-[15px] py-[15px] flex justify-between items-center border-b border-b-[#CCCCCC]/20"
                    >
                      <div className="left flex items-center max-w-[calc(100%_-_90px)] pr-[10px]">
                        <Icon
                          className="fol__icon w-[32px] h-[32px] rounded-[4px] bg-[#E2EBF2] p-[7px]"
                          iconType={
                            followingEntitiesIcons[
                              activeModuleTab?.label as keyof typeof followingEntitiesIcons
                            ] as any
                          }
                        />
                        <h3 className="name max-w-[calc(100%_-_32px)] text-[16px] font-biotif__Medium text-black pl-[12px] ellipsis__2">
                          {itemObj && (itemObj?.name || itemObj?.topic)}
                        </h3>
                      </div>
                      <button
                        onClick={() => itemObj && unFollowEntity(itemObj?.id)}
                        className="text-[14px] font-biotif__Medium text-black bg-[#E6E6E6] rounded-[6px] px-[16px] py-[5px] duration-300 hover:bg-black hover:text-white"
                      >
                        Unfollow
                      </button>
                    </div>
                  );
                }
              )
            ) : (
              <div className="">
                <NoDataFound />
              </div>
            )}
          </InfiniteScroll>
        </div>
      </div>
    </SettingLayout>
  );
};

export default FollowingEntities;
