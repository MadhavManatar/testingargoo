// ** Redux ** //
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';

// ** Components **

// ** types ** //
import {
  AllItemFilter,
  StreamFilleterTypeReduxSlice,
} from 'pages/Streams/types/stream.type';
import { PURGE } from 'redux-persist';

const initialState: StreamFilleterTypeReduxSlice = {
  sortStream: { streamData: [], selectedUserIs: [] },
  tab: { label: '', id: 0 },
  userIds: [],
  userData: { count: 0, rows: [] },
  isPolling: true,
  all_item: {
    0: {
      activityTypeIds: [],
      notes: false,
      documents: false,
      info: false,
      emails_received: false,
      emails_sent: false,
      hideRelatedRecord: false,
      selectAllForActivityType: {},
    },
  },
};

const slice = createSlice({
  name: 'stream',
  initialState,
  reducers: {
    setStreamList(
      state: StreamFilleterTypeReduxSlice,
      action: PayloadAction<StreamFilleterTypeReduxSlice>
    ) {
      state.sortStream = action.payload.sortStream;
      state.tab = action?.payload?.tab;
      state.userIds = action?.payload?.userIds;
      state.userData = action?.payload?.userData;
      state.isPolling = action?.payload?.isPolling;
    },
    setStreamLogObjFilter(
      state: StreamFilleterTypeReduxSlice,
      action: PayloadAction<{ all_item: AllItemFilter }>
    ) {
      const { all_item } = action.payload;

      if (state?.all_item) state.all_item = all_item;
    },
  },
  extraReducers(builder) {
    builder.addCase(PURGE, () => {
      return initialState;
    })
  },
});

export const { reducer } = slice;
export const { setStreamList, setStreamLogObjFilter } = slice.actions;

export const getStreamListViewState = (state: RootState) => state.stream;
export const getStreamLogFilterState = (state: RootState) =>
  state.stream.all_item;
