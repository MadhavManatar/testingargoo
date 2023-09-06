// =================== import packages ==================
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Option } from 'components/FormField/types/formField.types';
import { UserToken } from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';
// ======================================================
import { columnViewInterface } from 'components/ColumnViewListDropDown';

import { RootState } from 'redux/store';
import { ModuleNames } from 'constant/permissions.constant';
import { IconJsonType } from 'indexDB/indexdb.type';
import { PURGE } from 'redux-persist';

export type moduleType = {
  leadId: string;
  dealId: string;
  accountId: string;
  contactId: string;
  activityId: string;
};

export interface CommonInterface {
  renderModule?: {
    lead: boolean;
    contact: boolean;
    account: boolean;
    deal: boolean;
    attachment: boolean;
    note: boolean;
    timeline: boolean;
    pinTimeline: boolean;
    moduleActivityTimeline: boolean;
    is_visibility: boolean;
    email_details: boolean;
    loadDetails: {
      // don't change the name here coz it's based on permission constant
      leads: boolean;
      contacts: boolean;
      deals: boolean;
      accounts: boolean;
      activity: boolean;
    };
    activity: boolean;
  };
  module: {
    [key: string]: {
      information: boolean;
      description: boolean;
      relatedContacts: boolean;
      followers: boolean;
    };
  };
  userNotificationSubscription: {
    id: number;
    subscription: string;
  };
  currentMailProvider?: Option;
  sidebarIsCollapse: boolean;
  mailProviderOption: Option[];
  zoomAccountDetails?: UserToken;
  is_zoom_phone_account_required: boolean;
  entityTableView: {
    [key: string]: columnViewInterface;
  };
  entityLastOpenRecord: {
    [value in ModuleNames]?: {
      index: number;
      dataId: number;
    };
  };
  animationIconJson: IconJsonType;
  iconAnimationSetting: boolean;
}

// CODE ADD -----------------------
const initialState: CommonInterface = {
  renderModule: {
    lead: false,
    contact: false,
    account: false,
    deal: false,
    attachment: false,
    note: false,
    timeline: false,
    pinTimeline: false,
    email_details: false,
    moduleActivityTimeline: false,
    is_visibility: false,
    loadDetails: {
      accounts: false,
      contacts: false,
      deals: false,
      leads: false,
      activity: false,
    },
    activity: false,
  },
  module: {},
  userNotificationSubscription: {
    id: 0,
    subscription: '',
  },
  sidebarIsCollapse: true,
  currentMailProvider: undefined,
  mailProviderOption: [],
  zoomAccountDetails: undefined,
  is_zoom_phone_account_required: false,
  entityTableView: {},
  entityLastOpenRecord: {},
  animationIconJson: {},
  iconAnimationSetting: false,
};

const slice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setLeadQuickAdd(
      state: CommonInterface,
      action: PayloadAction<{ lead: boolean }>
    ) {
      const { lead } = action.payload;

      if (state?.renderModule) state.renderModule.lead = lead;
    },
    setContactQuickAdd(
      state: CommonInterface,
      action: PayloadAction<{ contact: boolean }>
    ) {
      const { contact } = action.payload;
      if (state?.renderModule) state.renderModule.contact = contact;
    },
    setAccountQuickAdd(
      state: CommonInterface,
      action: PayloadAction<{ account: boolean }>
    ) {
      const { account } = action.payload;
      if (state?.renderModule) state.renderModule.account = account;
    },
    setActivityQuickAdd(
      state: CommonInterface,
      action: PayloadAction<{ activity: boolean }>
    ) {
      const { activity } = action.payload;
      if (state?.renderModule) state.renderModule.activity = activity;
    },
    setDealQuickAdd(
      state: CommonInterface,
      action: PayloadAction<{ deal: boolean }>
    ) {
      const { deal } = action.payload;

      if (state?.renderModule) state.renderModule.deal = deal;
    },
    setLoadAttachments(
      state: CommonInterface,
      action: PayloadAction<{ attachment: boolean }>
    ) {
      const { attachment } = action.payload;
      if (state?.renderModule) state.renderModule.attachment = attachment;
    },
    setLoadNotes(
      state: CommonInterface,
      action: PayloadAction<{ note: boolean }>
    ) {
      const { note } = action.payload;

      if (state?.renderModule) state.renderModule.note = note;
    },
    setLoadTimeLines(
      state: CommonInterface,
      action: PayloadAction<{ timeline: boolean }>
    ) {
      const { timeline } = action.payload;

      if (state?.renderModule) state.renderModule.timeline = timeline;
    },

    setLoadPinTimeLines(
      state: CommonInterface,
      action: PayloadAction<{ pinTimeline: boolean }>
    ) {
      const { pinTimeline } = action.payload;

      if (state?.renderModule) state.renderModule.pinTimeline = pinTimeline;
    },

    setLoadEmailThreads(
      state: CommonInterface,
      action: PayloadAction<{ email_details: boolean }>
    ) {
      const { email_details } = action.payload;
      if (state?.renderModule) state.renderModule.email_details = email_details;
    },

    setCalenderActivity(
      state: CommonInterface,
      action: PayloadAction<{ is_visibility: boolean }>
    ) {
      const { is_visibility } = action.payload;
      if (state?.renderModule) state.renderModule.is_visibility = is_visibility;
    },

    setLoadModuleActivityTimelines(
      state: CommonInterface,
      action: PayloadAction<{ moduleActivityTimeline: boolean }>
    ) {
      const { moduleActivityTimeline } = action.payload;

      if (state?.renderModule)
        state.renderModule.moduleActivityTimeline = moduleActivityTimeline;
    },

    setLoadDetails(
      state: CommonInterface,
      action: PayloadAction<{
        loadModuleDetails: {
          leads: boolean;
          contacts: boolean;
          deals: boolean;
          accounts: boolean;
          activity: boolean;
        };
      }>
    ) {
      const { loadModuleDetails } = action.payload;

      if (state?.renderModule)
        state.renderModule.loadDetails = loadModuleDetails;
    },
    setUserNotificationSubscription(
      state: CommonInterface,
      action: PayloadAction<{
        subscription: {
          id: number;
          subscription: string;
        };
      }>
    ) {
      const { subscription } = action.payload;
      if (state?.userNotificationSubscription)
        state.userNotificationSubscription = subscription;
    },

    setDetailSectionView(state: CommonInterface, action: PayloadAction<any>) {
      state.module = { ...state.module, ...action.payload };
      return state;
    },
    setCurrentMailProvider(
      state: CommonInterface,
      action: PayloadAction<{ provider: Option }>
    ) {
      state.currentMailProvider = action.payload.provider;
    },
    setSidebarIsCollapse(
      state: CommonInterface,
      action: PayloadAction<boolean>
    ) {
      state.sidebarIsCollapse = action.payload;
    },
    setMailProviderOption(
      state: CommonInterface,
      action: PayloadAction<Option[]>
    ) {
      state.mailProviderOption = action.payload;
    },
    setZoomAccountDetails(
      state: CommonInterface,
      action: PayloadAction<UserToken | undefined>
    ) {
      state.zoomAccountDetails = action.payload;
    },
    setZoomPhoneAccountRequired(
      state: CommonInterface,
      action: PayloadAction<{ is_zoom_phone_account_required: boolean }>
    ) {
      const { is_zoom_phone_account_required } = action.payload;
      state.is_zoom_phone_account_required = is_zoom_phone_account_required;
    },
    setEntityTableView(
      state: CommonInterface,
      action: PayloadAction<{
        viewState: { [key: string]: columnViewInterface };
        isReplace?: boolean;
      }>
    ) {
      const { viewState, isReplace } = action.payload;
      if (isReplace) {
        state.entityTableView = { ...viewState };
      } else {
        state.entityTableView = { ...state.entityTableView, ...viewState };
      }
    },
    setEntityLastOpenRecord(
      state: CommonInterface,
      action: PayloadAction<{
        data: {
          [value in ModuleNames]?: {
            index: number;
            dataId: number;
          };
        };
        isReplace?: boolean;
      }>
    ) {
      const { data, isReplace } = action.payload;
      if (isReplace) {
        state.entityLastOpenRecord = { ...data };
      } else {
        state.entityLastOpenRecord = {
          ...state.entityLastOpenRecord,
          ...data,
        };
      }
    },
    setAnimationIconjson(
      state: CommonInterface,
      action: PayloadAction<{
        data: IconJsonType;
      }>
    ) {
      state.animationIconJson = action.payload.data;
    },
    setIconAnimationSetting(
      state: CommonInterface,
      action: PayloadAction<{ iconAnimationSetting: boolean }>
    ) {
      const { iconAnimationSetting } = action.payload;
      state.iconAnimationSetting = iconAnimationSetting;
    },
  },
  extraReducers(builder) {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const { reducer } = slice;

export const {
  setLeadQuickAdd,
  setContactQuickAdd,
  setAccountQuickAdd,
  setActivityQuickAdd,
  setDealQuickAdd,
  setLoadAttachments,
  setLoadNotes,
  setLoadDetails,
  setLoadTimeLines,
  setUserNotificationSubscription,
  setSidebarIsCollapse,
  setDetailSectionView,
  setCurrentMailProvider,
  setMailProviderOption,
  setLoadPinTimeLines,
  setLoadModuleActivityTimelines,
  setLoadEmailThreads,
  setCalenderActivity,
  setZoomAccountDetails,
  setEntityTableView,
  setEntityLastOpenRecord,
  setAnimationIconjson,
  setIconAnimationSetting,
} = slice.actions;

export const getIsLeadQuickAdd = (state: RootState) =>
  state.common.renderModule?.lead;

export const getCalenderActivity = (state: RootState) =>
  state.common.renderModule?.is_visibility;

export const getIsContactQuickAdd = (state: RootState) =>
  state.common.renderModule?.contact;
export const getIsDealQuickAdd = (state: RootState) =>
  state.common.renderModule?.deal;
export const getIsAccountQuickAdd = (state: RootState) =>
  state.common.renderModule?.account;
export const getIsActivityQuickAdd = (state: RootState) =>
  state.common.renderModule?.activity;
export const getIsAttachmentsLoad = (state: RootState) =>
  state.common.renderModule?.attachment;
export const getIsNotesLoad = (state: RootState) =>
  state.common.renderModule?.note;
export const getIsTimeLineLoad = (state: RootState) =>
  state.common.renderModule?.timeline;
export const getIsPinTimeLineLoad = (state: RootState) =>
  state.common.renderModule?.pinTimeline;
export const getIsEmailThreadsLoad = (state: RootState) =>
  state.common.renderModule?.email_details;
export const getIsModuleActivityTimelineLoad = (state: RootState) =>
  state.common.renderModule?.moduleActivityTimeline;
export const getIsLoadDetailsLoad = (state: RootState) =>
  state.common.renderModule?.loadDetails;
export const getUserNotificationSubscription = (state: RootState) =>
  state.common?.userNotificationSubscription;
export const getSidebarIsCollapse = (state: RootState) =>
  state.common?.sidebarIsCollapse;
export const getCurrentMailProvider = (state: RootState) =>
  state.common?.currentMailProvider;
export const getMailProviderOption = (state: RootState) =>
  state.common?.mailProviderOption;
export const getZoomAccountDetails = (state: RootState) =>
  state.common?.zoomAccountDetails;
export const getEntityTableView = (state: RootState) =>
  state.common.entityTableView;
export const getEntityLastOpenRecord = (state: RootState) =>
  state.common.entityLastOpenRecord;
export const getAnimationIconjson = (state: RootState) =>
  state.common.animationIconJson;
export const getIconAnimationSetting = (state: RootState) =>
  state.common.iconAnimationSetting;

export default slice;
