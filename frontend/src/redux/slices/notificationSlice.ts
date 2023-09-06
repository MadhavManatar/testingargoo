// ** Import Packages **
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ** Redux **
import { RootState } from 'redux/store';

//  ** Constants **
import {
  notificationStatus,
  UserNotification,
} from 'pages/Dashboard/components/Notification/types/notification.types';
import { getNotificationsApi } from 'redux/api/notification/notificationApi';
import NotificationHelper from 'redux/api/helper/notification.helper';
import { PURGE } from 'redux-persist';

export interface NotificationReduxState {
  notifications: UserNotification[] | null;
  notificationCounts: number;
  currentPage: number;
  hasMore: boolean;
  clear: boolean;
  setting: {
    summary_notification_time: string | number | Date | null;
    daily_notification_time: string | number | Date | null;
  };
  params: { [key: string]: number | string | object | boolean };
  pollingInterval: number;
}

const initialState: NotificationReduxState = {
  notifications: null,
  notificationCounts: 0,
  currentPage: 1,
  hasMore: true,
  setting: {
    summary_notification_time: null,
    daily_notification_time: null,
  },
  clear: false,
  params: {
    'q[status]': notificationStatus.UNREAD,
    'include[notification][select]': 'id,message,title,model_record_id',
    // 'include[notification][include][creator]': 'all',
    limit: 10,
    sort: '-created_at',
  },
  pollingInterval: 0,
};

const slice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications(
      state: NotificationReduxState,
      action: PayloadAction<{ count: number; data: UserNotification[] | null }>
    ) {
      const { count, data } = action.payload;
      state.notifications = data;
      state.notificationCounts = count;
    },

    setNotificationsCount(
      state: NotificationReduxState,
      action: PayloadAction<number>
    ) {
      state.notificationCounts = action.payload;
    },

    setRemoveNotification(
      state: NotificationReduxState,
      action: PayloadAction<{
        index: number[];
        status: notificationStatus;
      }>
    ) {
      const helperNotification = new NotificationHelper(state, action, false);
      helperNotification.removeNotification(state, action);
    },

    setNotificationPage(
      state: NotificationReduxState,
      action: PayloadAction<{ currentPage: number }>
    ) {
      state.currentPage = action.payload.currentPage;
    },

    setNotificationSetting(
      state: NotificationReduxState,
      action: PayloadAction<
        | { summary_notification_time: string | Date | null }
        | { daily_notification_time: string | Date | null }
      >
    ) {
      state.setting = { ...state.setting, ...action.payload };
    },

    setNotificationParams(
      state: NotificationReduxState,
      action: PayloadAction<{ [key: string]: string | number | object }>
    ) {
      state.params = action.payload;
      state.hasMore = true;
      state.currentPage = 1;
    },

    setNotificationClear(
      state: NotificationReduxState,
      action: PayloadAction<boolean>
    ) {
      state.clear = action.payload;
    },

    setNotificationInterval(
      state: NotificationReduxState,
      action: PayloadAction<number>
    ) {
      state.pollingInterval = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState;
    })
    builder.addMatcher(
      getNotificationsApi.endpoints.getNotificationsAPI.matchFulfilled,
      (state, action) => {
        if (state.clear) {
          state.notifications = [];
          state.clear = false;
        }
        // eslint-disable-next-line no-new
        new NotificationHelper(state, action);
        return state;
      }
    );
  },
});

export const { reducer } = slice;

export const {
  setNotifications,
  setNotificationsCount,
  setRemoveNotification,
  setNotificationSetting,
  setNotificationParams,
  setNotificationPage,
  setNotificationClear,
  setNotificationInterval,
} = slice.actions;

export const getNotifications = (state: RootState) => {
  const { notifications, notificationCounts } = state.notification;
  return { notifications, notificationCounts };
};

export const getNotificationCount = (state: RootState) =>
  state.notification.notificationCounts;

export const getNotificationsData = (state: RootState) =>
  state.notification.notifications;

export const getNotificationPage = (state: RootState) =>
  state.notification.currentPage;

export const getNotificationsSetting = (state: RootState) =>
  state.notification.setting;

export const getNotificationParams = (state: RootState) =>
  state.notification.params;

export const getNotificationClear = (state: RootState) =>
  state.notification.clear;

export const getHasMoreNotification = (state: RootState) =>
  state.notification.hasMore;

export const getNotificationTimeInterval = (state: RootState) =>
  state.notification.pollingInterval;

export default slice;
