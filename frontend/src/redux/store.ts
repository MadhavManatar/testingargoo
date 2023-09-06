// ** Import Packages **
import { configureStore, Middleware } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

// ** Redux **
import persistStore from 'redux-persist/es/persistStore';
import rootReducer from './rootReducer';

// ** API **
import { accountApi } from './api/accountApi';
import { activityApi } from './api/activityApi';
import { activityResultApi } from './api/activityResultApi';
import { activityTypeApi } from './api/activityTypeApi';
import baseQueryApi from './api/baseQueryApi';
import { columnApi } from './api/columnApi';
import { companyDetailApi } from './api/companyDetailApi';
import { contactApi } from './api/contactApi';
import { dealLostReasonApi } from './api/dealLostReasonApi';
import { dealStageHistoryApi } from './api/dealStageHistoryApi';
import { departmentApi } from './api/departmentApi';
import { gmailApi } from './api/gmailApi';
import { jobRoleApi } from './api/jobRoleApi';
import { leadApi } from './api/leadApi';
import { leadDealSourceApi } from './api/leadDealSourceApi';
import { leadStatusApi } from './api/leadStatusApi';
import { leadTempStatusApi } from './api/leadTempStatusApi';
import { noteApi } from './api/noteApi';
import { notificationSettingApi } from './api/notificationSettingApi';
import { phoneTypeApi } from './api/phoneTypeApi';
import { pipelineApi } from './api/pipelineApi';
import { profilesApi } from './api/profileApi';
import { snippetCategoryApi } from './api/snippetCategoryApi';
import { snippetSettingApi } from './api/snippetSettingApi';
import { scheduleActivityApi } from './api/stayInTouchApi';
import { tagApi } from './api/tagApi';
import { timelineApi } from './api/timelineApi';
import { userApi } from './api/userApi';
import { zoomApi } from './api/zoomApi';
import { commentApi } from './api/commentApi';
import { userSessionApi } from './api/userSessionApi';

const middleWares: Middleware[] = [
  tagApi.middleware,
  zoomApi.middleware,
  userApi.middleware,
  noteApi.middleware,
  leadApi.middleware,
  commentApi.middleware,
  gmailApi.middleware,
  columnApi.middleware,
  accountApi.middleware,
  contactApi.middleware,
  jobRoleApi.middleware,
  profilesApi.middleware,
  pipelineApi.middleware,
  activityApi.middleware,
  timelineApi.middleware,
  baseQueryApi.middleware,
  phoneTypeApi.middleware,
  departmentApi.middleware,
  leadStatusApi.middleware,
  userSessionApi.middleware,
  activityTypeApi.middleware,
  activityTypeApi.middleware,
  companyDetailApi.middleware,
  snippetSettingApi.middleware,
  leadDealSourceApi.middleware,
  leadTempStatusApi.middleware,
  dealLostReasonApi.middleware,
  activityResultApi.middleware,
  snippetCategoryApi.middleware,
  dealStageHistoryApi.middleware,
  scheduleActivityApi.middleware,
  notificationSettingApi.middleware,
];

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['common', 'timeline_filters', 'stream'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(middleWares),
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export type RootState = ReturnType<typeof store.getState>;
export default store;
export const persistor = persistStore(store);
