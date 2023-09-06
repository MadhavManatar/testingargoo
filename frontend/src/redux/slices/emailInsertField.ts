import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Tab } from 'constant/emailTemplate.constant';
import { PURGE } from 'redux-persist';
import { RootState } from 'redux/store';

export type DataEmailInsert = {
  id?: number;
  deal_owner?: string;
  deal_name?: string;
  deal_related_account?: string;
  deal_related_contact?: string;
  deal_value?: string;
  closing_date?: string;
  pipeline?: string;
  pipeline_stage?: string;

  lead_owner?: string;
  lead_name?: string;
  lead_related_account?: string;
  lead_related_contact?: string;
  lead_value?: string;

  account_name?: string;
  account_owner?: string;
  account_email?: string;
  account_contact_name?: string;
  account_address?: string;

  contact_owner?: string;
  contact_name?: string;
  contact_account_name?: string;
  contact_email?: string;
  contact_phone?: string;
  job_role?: string;
};

export type EmailInitialStateType = {
  [key in Tab]?: DataEmailInsert;
};
export type SetEmailInsertAction = {
  entity: Tab;
  data: DataEmailInsert | null;
};

const initialState: EmailInitialStateType = {};

const slice = createSlice({
  name: 'emailInsertField',
  initialState,
  reducers: {
    setEmailInsertField(state, action: PayloadAction<SetEmailInsertAction>) {
      if (action.payload?.data) {
        state[action.payload.entity] = action.payload.data;
      }

      if (action.payload?.data === null) {
        state[action.payload.entity] = undefined;
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
export const { setEmailInsertField } = slice.actions;

export const getEmailInsertField = (state: RootState) => state.emailInsertField;
