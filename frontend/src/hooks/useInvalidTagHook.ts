// ** Import Packages **
import { useDispatch } from 'react-redux';
import { accountApi } from 'redux/api/accountApi';
import { activityApi } from 'redux/api/activityApi';
import { activityResultApi } from 'redux/api/activityResultApi';
import { activityTypeApi } from 'redux/api/activityTypeApi';

// ** API **
import baseQueryApi from 'redux/api/baseQueryApi';
import { columnApi } from 'redux/api/columnApi';
import { commentApi } from 'redux/api/commentApi';
import { companyDetailApi } from 'redux/api/companyDetailApi';
import { contactApi } from 'redux/api/contactApi';
import { dealLostReasonApi } from 'redux/api/dealLostReasonApi';
import { dealStageHistoryApi } from 'redux/api/dealStageHistoryApi';
import { departmentApi } from 'redux/api/departmentApi';
import { gmailApi } from 'redux/api/gmailApi';
import { jobRoleApi } from 'redux/api/jobRoleApi';
import { leadApi } from 'redux/api/leadApi';
import { leadDealSourceApi } from 'redux/api/leadDealSourceApi';
import { leadStatusApi } from 'redux/api/leadStatusApi';
import { leadTempStatusApi } from 'redux/api/leadTempStatusApi';
import { noteApi } from 'redux/api/noteApi';
import { notificationSettingApi } from 'redux/api/notificationSettingApi';
import { phoneTypeApi } from 'redux/api/phoneTypeApi';
import { pipelineApi } from 'redux/api/pipelineApi';
import { profilesApi } from 'redux/api/profileApi';
import { snippetCategoryApi } from 'redux/api/snippetCategoryApi';
import { snippetSettingApi } from 'redux/api/snippetSettingApi';
import { scheduleActivityApi } from 'redux/api/stayInTouchApi';
import { tagApi } from 'redux/api/tagApi';
import { timelineApi } from 'redux/api/timelineApi';
import { userApi } from 'redux/api/userApi';
import { zoomApi } from 'redux/api/zoomApi';

// ** Type **
import {
  INVALID_ENTITY_TAG_TYPE,
  INVALID_TAG_TYPE,
} from 'types/reloadData.type';

const useInvalidTagHook = () => {
  const dispatch = useDispatch();

  const setInValidCommonTag = (props: {
    type: INVALID_TAG_TYPE;
    id: number | string;
  }) => {
    const { type, id } = props;
    switch (type) {
      case 'GENERAL_SETTING':
        dispatch(baseQueryApi.util.invalidateTags([{ type, id }]));
        break;
      case 'CONTACT':
        dispatch(contactApi.util.invalidateTags([{ type, id }]));
        break;
      case 'TIMELINE':
        dispatch(timelineApi.util.invalidateTags([{ type, id }]));
        break;
      case 'COLUMN':
      case 'COLUMN_VIEWS':
        dispatch(columnApi.util.invalidateTags([{ type, id }]));
        break;
      case 'COMPANY_DETAIL':
        dispatch(companyDetailApi.util.invalidateTags([{ type, id }]));
        break;
      case 'DEPARTMENT':
        dispatch(departmentApi.util.invalidateTags([{ type, id }]));
        break;
      case 'ACTIVITY_RESULT':
        dispatch(activityResultApi.util.invalidateTags([{ type, id }]));
        break;
      case 'ACTIVITY_TYPE':
        dispatch(activityTypeApi.util.invalidateTags([{ type, id }]));
        break;
      case 'NOTE':
        dispatch(noteApi.util.invalidateTags([{ type, id }]));
        break;
      case 'NOTIFICATION_SETTING':
        dispatch(notificationSettingApi.util.invalidateTags([{ type, id }]));
        break;
      case 'ROLE':
        dispatch(profilesApi.util.invalidateTags([{ type, id }]));
        break;
      case 'SCHEDULE_ACTIVITY':
        dispatch(scheduleActivityApi.util.invalidateTags([{ type, id }]));
        break;
      case 'ZOOM':
        dispatch(zoomApi.util.invalidateTags([{ type, id }]));
        break;
      case 'SNIPPET_CATEGORY':
        dispatch(snippetCategoryApi.util.invalidateTags([{ type, id }]));
        break;
      case 'SNIPPET_SETTING':
        dispatch(snippetSettingApi.util.invalidateTags([{ type, id }]));
        break;
      case 'TAG':
        dispatch(tagApi.util.invalidateTags([{ type, id }]));
        break;
      case 'ACCOUNT':
        dispatch(accountApi.util.invalidateTags([{ type, id }]));
        break;
      case 'LEAD':
        dispatch(leadApi.util.invalidateTags([{ type, id }]));
        break;
      case 'ACTIVITY':
        dispatch(activityApi.util.invalidateTags([{ type, id }]));
        break;
      case 'GMAIL':
        dispatch(gmailApi.util.invalidateTags([{ type, id }]));
        break;
      case 'PIPELINE':
        dispatch(pipelineApi.util.invalidateTags([{ type, id }]));
        break;
      case 'USER':
        dispatch(userApi.util.invalidateTags([{ type, id }]));
        break;
      case 'COMMENT':
        dispatch(commentApi.util.invalidateTags([{ type, id }]));
        break;
      case 'DEAL_STAGE_HISTORY':
        dispatch(dealStageHistoryApi.util.invalidateTags([{ type, id }]));
        break;
      default:
        break;
    }
  };

  const setInValidEntityTag = (id: INVALID_ENTITY_TAG_TYPE | number) => {
    switch (id) {
      case 'DEAL_LOST_REASON':
        dispatch(
          dealLostReasonApi.util.invalidateTags([
            { type: 'ENTITY_ATTRIBUTE', id },
          ])
        );
        break;
      case 'JOB_ROLE':
        dispatch(
          jobRoleApi.util.invalidateTags([{ type: 'ENTITY_ATTRIBUTE', id }])
        );
        break;
      case 'LEAD_DEAL_SOURCE':
        dispatch(
          leadDealSourceApi.util.invalidateTags([
            { type: 'ENTITY_ATTRIBUTE', id },
          ])
        );
        break;
      case 'LEAD_STATUS':
        dispatch(
          leadStatusApi.util.invalidateTags([{ type: 'ENTITY_ATTRIBUTE', id }])
        );
        break;
      case 'LEAD_TEMP_STATUS':
        dispatch(
          leadTempStatusApi.util.invalidateTags([
            { type: 'ENTITY_ATTRIBUTE', id },
          ])
        );
        break;
      case 'PHONE_TYPE':
        dispatch(
          phoneTypeApi.util.invalidateTags([{ type: 'ENTITY_ATTRIBUTE', id }])
        );
        break;
      default:
        break;
    }
  };

  return { setInValidCommonTag, setInValidEntityTag };
};

export default useInvalidTagHook;
