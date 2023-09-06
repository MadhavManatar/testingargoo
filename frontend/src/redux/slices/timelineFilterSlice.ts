import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  AllItemFilter,
  TimelineFilerIdsObj,
  TimelineFilterType,
} from 'components/EntityDetails/Timeline/types';
import { PURGE } from 'redux-persist';
import { RootState } from 'redux/store';

export interface TimelineFilterInterface {
  timelineFilter: TimelineFilterType;
  users: TimelineFilerIdsObj;
  all_items: AllItemFilter;
  contacts: TimelineFilerIdsObj;
}

const initialState: TimelineFilterInterface = {
  timelineFilter: {
    userIds: [],
    relatedContactIds: [],
    startDate: '',
    endDate: '',
    search: '',
  },
  users: {},
  contacts: {},
  all_items: {
    activityTypeIds: [],
    notes: false,
    documents: false,
    info: false,
    emails_received: false,
    emails_sent: false,
    hideRelatedRecord: false,
    selectAllForActivityType: {},
  },
};

const slice = createSlice({
  name: 'timeline_filters',
  initialState,
  reducers: {
    setTimelineFilter(
      state: TimelineFilterInterface,
      action: PayloadAction<{ filterDetails: TimelineFilterType }>
    ) {
      const { filterDetails } = action.payload;

      if (state?.timelineFilter) state.timelineFilter = filterDetails;
    },
    setTimelineFilterNew(
      state: TimelineFilterInterface,
      action: PayloadAction<TimelineFilterInterface>
    ) {
      state.timelineFilter = action.payload.timelineFilter;
      state.all_items = action.payload.all_items;
      state.contacts = action.payload.contacts;
      state.users = action.payload.users;
    },
    setTimelineSelectedUsersFilter(
      state: TimelineFilterInterface,
      action: PayloadAction<{ users: TimelineFilerIdsObj }>
    ) {
      const { users } = action.payload;
      if (state?.users) state.users = users;
    },
    setTimelineStateObjFilter(
      state: TimelineFilterInterface,
      action: PayloadAction<{ all_items: AllItemFilter }>
    ) {
      const { all_items } = action.payload;

      if (state?.all_items) state.all_items = all_items;
    },
    setTimelineSelectedContactsFilter(
      state: TimelineFilterInterface,
      action: PayloadAction<{ contacts: TimelineFilerIdsObj }>
    ) {
      const { contacts } = action.payload;

      if (state?.contacts) state.contacts = contacts;
    },
  },
  extraReducers(builder) {
    builder.addCase(PURGE, () => {
      return initialState;
    })
  },
});

export const { reducer } = slice;
export const {
  setTimelineFilter,
  setTimelineSelectedUsersFilter,
  setTimelineStateObjFilter,
  setTimelineSelectedContactsFilter,
  setTimelineFilterNew,
} = slice.actions;

export const getTimelineFilterState = (state: RootState) =>
  state.timeline_filters.timelineFilter;
export const getTimelineFilter = (state: RootState) => state.timeline_filters;
export const getTimelineSelectedUsersFilterState = (state: RootState) =>
  state.timeline_filters.users;
export const getTimelineStateObjFilterState = (state: RootState) =>
  state.timeline_filters.all_items;
export const getTimelineSelectedContactsFilterState = (state: RootState) =>
  state.timeline_filters.contacts;
// export const { clearTimelineSearch } = slice.actions;
