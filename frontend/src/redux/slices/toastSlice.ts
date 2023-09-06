// =================== import packages ==================
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';
// ======================================================
import { RootState } from 'redux/store';

export interface ToastInterface {
  message: string | null;
  type: string | null;
  id: number;
}

const initialState: ToastInterface[] = [];

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    setToast(state: ToastInterface[], action: PayloadAction<ToastInterface>) {
      state.push({
        message: action.payload.message,
        type: action.payload.type,
        id: action.payload.id,
      });
    },
    removeToast(
      state: ToastInterface[],
      action: PayloadAction<{ id: number }>
    ) {
      return state.filter((toast) => toast.id !== action.payload.id);
    },
  },
  extraReducers(builder) {
    builder.addCase(PURGE, () => {
      return initialState;
    })
  },
});
export const { reducer } = toastSlice;
export const { setToast, removeToast } = toastSlice.actions;
export const getToast = (state: RootState) => state.toast;

export default toastSlice;
