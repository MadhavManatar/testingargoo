import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';
import { RootState } from 'redux/store';

export enum QuickEntry {
  ACCOUNT = 'account',
  CONTACT = 'contact',
  LEAD = 'lead',
  DEAL = 'deal',
  PARENT = 'parent',
}

export type InitialStateType = {
  [key in QuickEntry]?: {
    id: number | null | string | undefined;
    name: string | undefined;
    jobRole?: string | undefined;
    parentCount?: number;
    childCount?: number;
    isParentChildLoading?: boolean;
  };
};

export type SetQuickPopupAction = {
  entity: QuickEntry | undefined;
  data: {
    id: number | null | string | undefined;
    name: string | undefined;
    jobRole?: string | undefined;
    parentCount?: number;
    childCount?: number;
    isParentChildLoading?: boolean;
  };
};

const initialState: InitialStateType = {};

const slice = createSlice({
  name: 'quickPopup',
  initialState,
  reducers: {
    setQuickPopup(state, action: PayloadAction<SetQuickPopupAction>) {
      if (action.payload.entity) {
        state[action.payload.entity] = action.payload.data;
      } else {
        state.account = {
          id: '',
          name: '',
          jobRole: '',
        };
        state.contact = {
          id: '',
          name: '',
          jobRole: '',
        };
        state.lead = {
          id: '',
          name: '',
          jobRole: '',
        };
        state.account = {
          id: '',
          name: '',
          jobRole: '',
        };
        state.parent = {
          id: '',
          name: '',
          parentCount: 0,
          childCount: 0,
          isParentChildLoading: true,
        };
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(PURGE, () => {
      return initialState;
    })
  },
});

export const { reducer } = slice;
export const { setQuickPopup } = slice.actions;

export const getQuickPopup = (state: RootState) => state.quickPopup;
