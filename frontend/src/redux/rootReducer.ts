// ** Import Packages **
import { combineReducers } from '@reduxjs/toolkit';

// ** Redux Slices **
import { reducer as authReducer } from './slices/authSlice';
import { reducer as commonReducer } from './slices/commonSlice';
import { reducer as emailInsertFieldReducer } from './slices/emailInsertField';
import { reducer as entityDetailReducer } from './slices/entityDetailSlice';
import { reducer as followersReducer } from './slices/followerSlice';
import { reducer as notificationReducer } from './slices/notificationSlice';
import { reducer as quickPopupReducer } from './slices/quickPopupDefaultSlice';
import { reducer as streamReducer } from './slices/stream.Slice';
import { reducer as filtersReducer } from './slices/tableFilterSlice';
import { reducer as timelineFiltersReducer } from './slices/timelineFilterSlice';
import { reducer as toastReducer } from './slices/toastSlice';

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
import { tagApi } from './api/tagApi';
import { timelineApi } from './api/timelineApi';
import { userApi } from './api/userApi';
import { userSessionApi } from './api/userSessionApi';
import { zoomApi } from './api/zoomApi';
import { scheduleActivityApi } from './api/stayInTouchApi';
import { commentApi } from './api/commentApi';

const rootReducer = combineReducers({
  auth: authReducer,
  toast: toastReducer,
  common: commonReducer,
  entityDetail: entityDetailReducer,
  followers: followersReducer,
  notification: notificationReducer,
  filters: filtersReducer,
  stream: streamReducer,
  quickPopup: quickPopupReducer,
  emailInsertField: emailInsertFieldReducer,
  timeline_filters: timelineFiltersReducer,
  [tagApi.reducerPath]: tagApi.reducer,
  [leadApi.reducerPath]: leadApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [userSessionApi.reducerPath]: userSessionApi.reducer,
  [zoomApi.reducerPath]: zoomApi.reducer,
  [noteApi.reducerPath]: noteApi.reducer,
  [gmailApi.reducerPath]: gmailApi.reducer,
  [columnApi.reducerPath]: columnApi.reducer,
  [accountApi.reducerPath]: accountApi.reducer,
  [contactApi.reducerPath]: contactApi.reducer,
  [jobRoleApi.reducerPath]: jobRoleApi.reducer,
  [pipelineApi.reducerPath]: pipelineApi.reducer,
  [activityApi.reducerPath]: activityApi.reducer,
  [timelineApi.reducerPath]: timelineApi.reducer,
  [profilesApi.reducerPath]: profilesApi.reducer,
  [baseQueryApi.reducerPath]: baseQueryApi.reducer,
  [phoneTypeApi.reducerPath]: phoneTypeApi.reducer,
  [departmentApi.reducerPath]: departmentApi.reducer,
  [commentApi.reducerPath]: commentApi.reducer,
  [leadStatusApi.reducerPath]: leadStatusApi.reducer,
  [activityTypeApi.reducerPath]: activityTypeApi.reducer,
  [companyDetailApi.reducerPath]: companyDetailApi.reducer,
  [snippetSettingApi.reducerPath]: snippetSettingApi.reducer,
  [dealLostReasonApi.reducerPath]: dealLostReasonApi.reducer,
  [leadDealSourceApi.reducerPath]: leadDealSourceApi.reducer,
  [leadTempStatusApi.reducerPath]: leadTempStatusApi.reducer,
  [activityResultApi.reducerPath]: activityResultApi.reducer,
  [snippetCategoryApi.reducerPath]: snippetCategoryApi.reducer,
  [dealStageHistoryApi.reducerPath]: dealStageHistoryApi.reducer,
  [notificationSettingApi.reducerPath]: notificationSettingApi.reducer,
  [scheduleActivityApi.reducerPath]: scheduleActivityApi.reducer,
});

export default rootReducer;
