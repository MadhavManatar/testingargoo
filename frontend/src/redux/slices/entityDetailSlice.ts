// ** Import Packages **
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ** Redux **
import { RootState } from 'redux/store';

//  ** Constants **
import { TAB } from 'components/EntityDetails/constant';
import { PURGE } from 'redux-persist';

export interface EntityDetailReduxState {
  tab: TAB;
  activityTab: TAB;
}

const initialState: EntityDetailReduxState = {
  tab: TAB.INFO,
  activityTab: TAB.INFO,
};

const slice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setTab(state: EntityDetailReduxState, action: PayloadAction<TAB>) {
      state.tab = action.payload;
    },

    setActivityTab(state: EntityDetailReduxState, action: PayloadAction<TAB>) {
      state.activityTab = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(PURGE, () => {
      return initialState;
    })
  },
});

export const { reducer } = slice;

export const { setTab, setActivityTab } = slice.actions;

export const getTab = (state: RootState) => state.entityDetail.tab;
export const getActivityTab = (state: RootState) =>
  state.entityDetail.activityTab;

export default slice;
