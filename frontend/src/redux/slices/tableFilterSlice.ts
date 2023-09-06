import { createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';
import { RootState } from 'redux/store';

const initialState: any = {
  sortData: {
    activity: null,
    contact: null,
    lead: null,
    deal: null,
    account: null,
  },
  filterData: {
    activity: null,
    contact: null,
    lead: null,
    deal: null,
    account: null,
    activityCustomDateFilter: null,
    activityCustomTypeFilter: null,
    activityCustomCompletedTypeFilter: null,
  },
};

const slice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setEntityFilter(state: any, action: any) {
      state.filterData[action.payload.entity] = action.payload.data;
    },
    setEntitySort(state: any, action: any) {
      state.sortData[action.payload.entity] = action.payload.data;
    },
  },
  extraReducers(builder) {
    builder.addCase(PURGE, () => {
      return initialState;
    })
  },
});

export const { reducer } = slice;
export const { setEntityFilter, setEntitySort } = slice.actions;

export const getEntityFilterState = (state: RootState) => state.filters;
