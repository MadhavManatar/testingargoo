import Button from 'components/Button';
import { TrashTabType } from 'components/EntityDetails/FollowFollowing/types/follower.types';
import Icon from 'components/Icon';
import { BREAD_CRUMB } from 'constant';
import { ModuleNames } from 'constant/permissions.constant';
import { TrashTabs } from 'constant/table.constant';
import useSettingSidebarLinks from 'hooks/useSettingSidebarLinks';
import SettingLayout from 'pages/Setting/components/SettingLayout';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import AccountTrash from './components/Account';
import ActivityTrash from './components/Activity';
import ContactTrash from './components/Contact';
import LeadDealTrash from './components/Lead';
import { debounce } from 'utils/util';
import useWindowDimensions from 'hooks/useWindowDimensions';
import All from './all';
import { setEntityFilter } from 'redux/slices/tableFilterSlice';
import { useDispatch } from 'react-redux';

export type leadDealRefType = {
  openDeleteLeadsModal(): void;
  restoreData: (id?: number) => Promise<void>;
};

export type entityModuleRefType = {
  openDeleteModal: () => void;
  restoreData: (id?: number | undefined) => void;
};

const Trash = () => {
  const { filterCommonControlsSideBarLink } = useSettingSidebarLinks();
  const dispatch = useDispatch();
  // ** hooks **
  const { state } = useLocation();
  const leadDealRef = useRef<entityModuleRefType>(null);

  const accountRef = useRef<entityModuleRefType>(null);

  const contactRef = useRef<entityModuleRefType>(null);

  const activityRef = useRef<entityModuleRefType>(null);
  const allRef = useRef<entityModuleRefType>(null);

  const { activeTab } = (state as { activeTab: TrashTabType }) || {
    activeTab: undefined,
  };

  const [activeModuleTab, setActiveModuleTab] = useState<TrashTabType>(
    activeTab || { label: 'all', value: ModuleNames.ALL }
  );

  const [selectedIds, setSelectedIds] = useState<{
    ids: number[];
    data?: any[];
  }>({
    ids: [],
    data: [],
  });

  const [searchText, setSearchText] = useState<string>('');
  const [actionBtnState,setActionBtnState]  = useState(false)
  const [searchData, setSearchData] = useState<{
    searchText: string;
    searchFields: string;
  }>({
    searchText: '',
    searchFields: '',
  });
  const { width } = useWindowDimensions();

  useEffect(() => {
    setSearchText('');
    setSearchData({
      searchText: '',
      searchFields: '',
    });
    dispatch(
      setEntityFilter({
        entity: activeModuleTab.label,
        data: null,
      } as any)
    );
  }, [activeModuleTab]);

  useEffect(() => {
    return () => {
      setSearchText('');
      setSearchData({
        searchText: '',
        searchFields: '',
      });
    };
  }, []);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (width < 576) {
      setSearchData({
        ...searchData,
        searchText: e.target?.value.trim(),
        searchFields: 'name',
      });
    }
  };

  const clearSearchTextOnTabChnge = (value: string) => {
    dispatch(
      setEntityFilter({
        entity: value,
        data: null,
      } as any)
    );
    return null;
  };

  const deleteForAll = (value: string) => {
        if (value === ModuleNames.ALL) {
      allRef?.current?.openDeleteModal();
    } else if (value === ModuleNames.LEAD || value === ModuleNames.DEAL) {
      leadDealRef?.current?.openDeleteModal();
    } else if (value === ModuleNames.ACCOUNT) {
      accountRef.current?.openDeleteModal();
    } else if (value === ModuleNames.CONTACT) {
      contactRef.current?.openDeleteModal();
    } else if (value === ModuleNames.ACTIVITY) {
      activityRef.current?.openDeleteModal();
    }
  };

  const restoreForAll = (value: string) => {
    if (value === ModuleNames.ALL) {
      allRef?.current?.restoreData();
    } else if (value === ModuleNames.LEAD || value === ModuleNames.DEAL) {
      leadDealRef.current?.restoreData();
    } else if (value === ModuleNames.ACCOUNT) {
      accountRef.current?.restoreData();
    } else if (value === ModuleNames.CONTACT) {
      contactRef.current?.restoreData();
    } else if (value === ModuleNames.ACTIVITY) {
      activityRef.current?.restoreData();
    }
  };

  const commonProps = {
    setSelectedIds,
    setSearchText,
    searchData,
    searchText,
  };

  return (
    <SettingLayout
      title="Trash"
      breadCrumbPath={BREAD_CRUMB.settings.generalSettings.commonControls.trash}
      sideBarLinks={filterCommonControlsSideBarLink()}
    >
      <div className="flex items-center justify-between">
        <div className="form__Group w-[300px] max-w-full mb-[10px]">
          <div className="ip__form__hasIcon">
            <input
              key={activeModuleTab?.value}
              type="text"
              value={searchText}
              onChange={(e) => {
                setSearchText(e?.target?.value);
                debounce(onSearchChange)(e);
              }}
              className="ip__input"
              placeholder="Search"
              maxLength={100}
            />
            <Icon className="grayscale" iconType="searchStrokeIcon" />
          </div>
        </div>

        {(selectedIds?.ids.length > 0 && !actionBtnState) && (
          <>
            <div className="flex flex-wrap items-center">
              <Button
                className="delete__Btn smaller"
                onClick={() => deleteForAll(activeModuleTab.value)}
              >
                Delete Permanently
              </Button>
              <Button
                className="primary__Btn smaller ml-[12px]"
                onClick={() => restoreForAll(activeModuleTab.value)}
              >
                Restore Data
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="following__tab w-full flex overflow-x-auto">
        {TrashTabs.map((tab, index) => {
          return (
            <button
              key={index}
              onClick={() => {
                setActiveModuleTab(tab);
                clearSearchTextOnTabChnge(activeModuleTab.label);
                setSearchText('');
              }}
              className={`following__tab__btn relative py-[6px] px-[8px] text-[16px] font-biotif__Medium text-primaryColor capitalize ${
                tab.label === activeModuleTab.label ? '' : 'opacity-50'
              } before:content-[''] before:w-${
                tab.label === activeModuleTab.label ? 'full' : '[0px]'
              } before:h-[2px] before:bg-primaryColor before:bottom-0 before:left-0 before:absolute before:duration-300 hover:opacity-100`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {activeModuleTab.value === ModuleNames.ALL && (
        <All setActionBtnState={setActionBtnState} ref={allRef} {...commonProps} />
      )}
      {activeModuleTab.value === ModuleNames.LEAD && (
        <LeadDealTrash setActionBtnState={setActionBtnState} is_deal={false} ref={leadDealRef} {...commonProps} />
      )}
      {activeModuleTab.value === ModuleNames.DEAL && (
        <LeadDealTrash setActionBtnState={setActionBtnState} is_deal ref={leadDealRef} {...commonProps} />
      )}
      {activeModuleTab.value === ModuleNames.CONTACT && (
        <ContactTrash setActionBtnState={setActionBtnState} ref={contactRef} {...commonProps} />
      )}
      {activeModuleTab.value === ModuleNames.ACCOUNT && (
        <AccountTrash setActionBtnState={setActionBtnState} ref={accountRef} {...commonProps} />
      )}
      {activeModuleTab.value === ModuleNames.ACTIVITY && (
        <ActivityTrash setActionBtnState={setActionBtnState} ref={activityRef} {...commonProps} />
      )}
    </SettingLayout>
  );
};

export default Trash;
