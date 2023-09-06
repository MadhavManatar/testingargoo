import { PayloadAction } from '@reduxjs/toolkit';
import { followingCount } from 'components/EntityDetails/FollowFollowing/types/follower.types';
import { WritableDraft } from 'immer/dist/internal';
import _ from 'lodash';
import {
  notificationStatus,
  UserNotification,
} from 'pages/Dashboard/components/Notification/types/notification.types';
import { NotificationReduxState } from 'redux/slices/notificationSlice';

// type ActionType = PayloadAction<
//   any,
//   string,
//   {
//     arg: QueryThunkArg & {
//       originalArgs: any;
//     };
//     requestId: string;
//     requestStatus: 'fulfilled';
//   }
// >;

type ActionArgType = {
  data: { count: number; rows: UserNotification[] };
  following: followingCount;
};

type StateType = WritableDraft<NotificationReduxState>;

class NotificationHelper {
  private pendingGroupNotification: UserNotification[] = [];

  constructor(state: StateType, action: any, isApi = true) {
    if (isApi) {
      const params = action?.meta?.arg?.originalArgs;
      if (state.notificationCounts !== action.payload?.data?.count) {
        state.notificationCounts = action.payload?.data?.count;
      }
      if (action?.payload?.data?.rows?.length <= 9) {
        state.hasMore = false;
      }
      this.createGroupNotification(
        state,
        action.payload,
        params?.page !== undefined
      );
    }
  }

  public notificationIsExist(state: StateType, notification: UserNotification) {
    let isExist = false;
    const modelIndexId = state.notifications?.findIndex((oldItem) => {
      if (
        oldItem?.notification?.model_record_id ===
          notification?.notification?.model_record_id &&
        oldItem?.notification?.model_name ===
          notification?.notification?.model_name
      ) {
        if (oldItem?.notification_id === notification?.notification_id)
          isExist = true;
        const inExistChildItem = oldItem?.groupNotifications?.find(
          (oldItemGroup) =>
            oldItemGroup.notification_id === notification.notification_id
        );
        if (inExistChildItem !== undefined) isExist = true;
        return true;
      }
      return false;
    });
    return { modelIndexId, isExist };
  }

  public createGroupOfNotifications(data: UserNotification[]) {
    const groupData = data.reduce((prev: any, next) => {
      const key =
        `${next?.notification?.model_record_id}-${next?.notification?.timelines?.[0]?.model_name}` as keyof typeof prev;
      if (!prev[key]) {
        prev[key] = [];
      }
      prev[key].push(next);
      return prev;
    }, {});

    const frontNotifications = _.map(groupData, (items: UserNotification[]) => {
      return {
        ...items[0],
        ...(items?.length > 1
          ? { groupNotifications: items?.slice(1, items?.length) }
          : {}),
      };
    });
    return frontNotifications;
    
  }

  public isPaginationDataAdd(state: StateType, data: UserNotification[]) {
    data.forEach((item) => {
      const { model_record_id, model_name } = item.notification;
      const isExistOldNotifications = state.notifications?.findIndex(
        (oldItem) => {
          return (
            oldItem?.notification?.model_record_id === model_record_id &&
            oldItem?.notification?.model_name === model_name
          );
        }
      );
      if (
        isExistOldNotifications !== undefined &&
        isExistOldNotifications >= 0 &&
        state.notifications
      ) {
        if (state.notifications[isExistOldNotifications]?.groupNotifications) {
          state.notifications[isExistOldNotifications].groupNotifications?.push(
            item
          );
        } else {
          state.notifications[isExistOldNotifications] = {
            ...JSON.parse(
              JSON.stringify(state.notifications[isExistOldNotifications])
            ),
            groupNotifications: [item],
          };
        }
      } else {
        this.pendingGroupNotification?.push(item);
      }
    });
    if (this.pendingGroupNotification.length > 0) {
      const appendNotifications = this.createGroupOfNotifications(
        this.pendingGroupNotification
      );
      state.notifications?.push(...appendNotifications);
    }
  }

  public freshDataAddOnTop(state: StateType, data: UserNotification[]) {
    data?.forEach((item) => {
      const { modelIndexId, isExist } = this.notificationIsExist(state, item);
      if (!isExist) {
        if (
          modelIndexId !== undefined &&
          modelIndexId >= 0 &&
          state.notifications
        ) {
          if (
            item.notification_id >
            state.notifications[modelIndexId].notification_id
          ) {
            state.notifications[modelIndexId].groupNotifications?.push({
              created_at: state.notifications[modelIndexId].created_at,
              deleted_at: state.notifications[modelIndexId].deleted_at,
              id: state.notifications[modelIndexId].id,
              notification: state.notifications[modelIndexId].notification,
              notification_id:
                state.notifications[modelIndexId].notification_id,
              organization_id:
                state.notifications[modelIndexId].organization_id,
              status: state.notifications[modelIndexId].status,
              updated_at: state.notifications[modelIndexId].updated_at,
              user_id: state.notifications[modelIndexId].user_id,
            });
            state.notifications.unshift({
              ...item,
              groupNotifications:
                state.notifications[modelIndexId].groupNotifications || [],
            });
            state.notifications.splice(modelIndexId + 1, modelIndexId + 1);
          } else if (state.notifications[modelIndexId]?.groupNotifications) {
            state.notifications[modelIndexId].groupNotifications?.unshift(item);
          } else {
            const stateNotification =
              state.notifications[modelIndexId] !== undefined
                ? JSON.parse(JSON.stringify(state.notifications[modelIndexId]))
                : {};
            state.notifications[modelIndexId] = {
              ...stateNotification,
              groupNotifications: [item],
            };
          }
        } else {
          this.pendingGroupNotification?.push(item);
        }
      }
    });
    if (this.pendingGroupNotification.length > 0) {
      const appendNotifications = this.createGroupOfNotifications(
        this.pendingGroupNotification
      );
      state.notifications?.unshift(...appendNotifications);
    }
  }

  public createGroupNotification(
    state: StateType,
    action: ActionArgType,
    isPage = false
  ) {
    const newNotifications = action?.data?.rows;

    if (state.notifications === null) {
      const firstRefreshData =
        this.createGroupOfNotifications(newNotifications);
      state.notifications = firstRefreshData;
      return state.notifications;
    }
    if (isPage) {
      return this.isPaginationDataAdd(state, newNotifications);
    }
    this.freshDataAddOnTop(state, newNotifications);
    return state.notifications;
  }

  public async removeNotification(
    state: StateType,
    action: PayloadAction<{
      index: number[];
      status: notificationStatus;
    }>
  ) {
    const { index } = action.payload;
    if (state.notifications) {
      if (index.length === 1) {
        if (state.notifications) {
          const groupNotifications =
            state.notifications[index[0]]?.groupNotifications;
          if (groupNotifications && groupNotifications.length > 0) {
            state.notifications[index[0]] =
              groupNotifications[groupNotifications.length - 1];
            groupNotifications.splice(groupNotifications.length - 1, 1);
            state.notifications[index[0]].groupNotifications =
              groupNotifications;
          }
          if (groupNotifications === undefined) {
            state.notifications.splice(index[0], 1);
          }
        }
      } else if (index.length === 2) {
        if (state.notifications) {
          state.notifications[index[0]].groupNotifications?.splice(index[1], 1);
        }
      }
      return state;
    }
  }
}

export default NotificationHelper;
