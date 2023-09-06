// ** import packages ** //
import { useState } from 'react';

// ** components ** //
import { PaginationParams } from 'components/TableInfiniteScroll';

// ** types ** //
import { ActivityResponseType } from '../types/activity.types';
import { useLazyGetActivitiesQuery } from 'redux/api/activityApi';

const useGetActivity = () => {
  // ** state ** //
  const [activityInfo, setActivityInfo] = useState<ActivityResponseType[]>([]);

  // ** APIS **
  const [getActivitiesAPI, { isLoading: isActivityLoading, currentData }] =
    useLazyGetActivitiesQuery();

  const fetchActivityData = async (params: PaginationParams) => {
    const defaultParams = {
      ...params,
      page: 1,
      select:
        'id,topic,start_date,created_at,duration,agenda,is_confirmed,result,is_active,created_by,meeting_uuid,memo,zoom_call_details,zoom_meeting_details,location_details',
      'include[activity_type][select]': 'name,icon,icon_type,id,color',
      'include[activity_type][paranoid]': false,
      'include[activity_account][select]':
        'id,name,emails,phones,address1,address2,address_details,city,country_id,state_id,zip',
      'include[activity_account][include][state][select]': 'id,name,state_code',
      'include[activity_account][include][country][select]': 'id,name',
      'include[activity_contact][select]':
        'id,name,job_role,emails,phones,address1,address2,city,country_id,state_id,zip',
      'include[activity_contact][include][state][select]': 'id,name,state_code',
      'include[activity_contact][include][country][select]': 'id,name',
      'include[activity_lead][select]':
        'id,name,is_deal,deal_value,closing_date',
      'include[activity_lead][include][lead_source][select]': 'id,name',
      'include[activity_lead][include][lead_owner][select]':
        'id,first_name,last_name',
      'include[activity_lead][include][pipeline][include][stages][select]':
        'id,name',
      'include[activity_lead][include][related_account]':
        'id,name,emails,phones',
      'include[activity_lead][include][related_contacts][select]':
        'id,contact_id',
      'include[activity_lead][include][related_contacts][include][contact]':
        'id,name,emails,phones',
      'include[activity_lead][include][deal_stage_history][select]':
        'id,stage_id,deal_id,isCurrentActive',
      'include[activity_lead][include][deal_stage_history][q][isCurrentActive]':
        true,
      'include[activity_lead][include][deal_stage_history][include][stage]':
        'id,name',
      'include[activity_time_logs]': 'all',
      'include[activity_participants]': 'all',
      'include[activity_participants][q][is_deleted]': false,
      'include[activity_collaborators][include][user][select]':
        'id,first_name,last_name',
      'include[creator][select]': 'first_name,last_name,id,profile_image',
      // 'include[activity_lead][include][DealStageHistory][q][isCurrentActive]':
      //   true,
      // 'include[activity_lead][include][DealStageHistory][select]': 'stage',
    };
    const { data, error } = await getActivitiesAPI(
      {
        data: {
          query: { ...defaultParams },
        },
      },
      true
    );
    if (!error && data?.rows) {
      setActivityInfo([...(data?.rows || [])]);
      return data?.rows;
    }
  };

  return {
    fetchActivityData,
    activityInfo,
    isActivityLoading,
    currentData,
  };
};

export default useGetActivity;
