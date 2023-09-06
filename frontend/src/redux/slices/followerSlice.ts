// ** Import Packages **
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FollowersReduxState,
  followingCount,
  FollowingEntitiesType,
} from 'components/EntityDetails/FollowFollowing/types/follower.types';
import { getNotificationsApi } from 'redux/api/notification/notificationApi';

// ** Redux **
import { RootState } from 'redux/store';

//  ** Constants **
import { UserInterface } from './authSlice';
import { PURGE } from 'redux-persist';

const initialState: FollowersReduxState = {
  follower: null,
  following: {
    leads: null,
    deals: null,
    accounts: null,
    contacts: null,
    activities: null,
  },
  followingCount: {
    contact_followers_count: null,
    account_followers_count: null,
    lead_followers_count: null,
    deal_followers_count: null,
    activity_followers_count: null,
    count: null,
    totalFollowing: null,
  },
};

const slice = createSlice({
  name: 'followers',
  initialState,
  reducers: {
    setAppendFollower(
      state: FollowersReduxState,
      action: PayloadAction<{
        action: 'add' | 'remove';
        follower: UserInterface;
        follower_id: number;
      } | null>
    ) {
      state.follower = action.payload;
    },

    setFollowingEntities(
      state: FollowersReduxState,
      action: PayloadAction<FollowingEntitiesType>
    ) {
      state.following = action.payload;
    },

    setFollowingEntityCount(
      state: FollowersReduxState,
      action: PayloadAction<followingCount>
    ) {
      state.followingCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState;
    })
    builder.addMatcher(
      getNotificationsApi.endpoints.getNotificationsAPI.matchFulfilled,
      (state, action) => {
        if (
          state.followingCount?.totalFollowing !==
          action?.payload?.following?.totalFollowing
        ) {
          state.followingCount = action?.payload?.following;
        }
        return state;
      }
    );
  },
});

export const { reducer } = slice;

export const {
  setAppendFollower,
  setFollowingEntities,
  setFollowingEntityCount,
} = slice.actions;

export const getAppendFollower = (state: RootState) => state.followers.follower;

export const getFollowingEntities = (state: RootState) =>
  state.followers.following;

export const getFollowingEntityCount = (state: RootState) =>
  state.followers.followingCount;

export default slice;
