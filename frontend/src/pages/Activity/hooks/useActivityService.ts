/* eslint-disable @typescript-eslint/no-unused-vars */
// ** import packages ** //
import { addMinutes, endOfDay, startOfDay } from 'date-fns';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ** redux ** //
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'redux/slices/authSlice';

// ** hooks & services ** //
import { useGetActivityTypes } from 'pages/Setting/module-setting/Activity/ActivityType/hooks/useActivityType';
import { useGetAllDefaultReminder } from 'pages/Setting/module-setting/Activity/DefaultReminders/Hooks/useDefaultReminderServices';
import { useGetUserZoomAuthenticationStatus } from './useZoomServices';

// ** types ** //
import {
  AsyncSelectGetOptions,
  Option,
} from 'components/FormField/types/formField.types';
import { LeadDetailsType } from 'pages/Lead/types/lead.type';
import {
  ActivityGuestContactsDataType,
  ActivityResponseType,
  activityTypeResponse,
  emptyActivityResponse,
  miniCalenderDataType,
} from '../types/activity.types';

// ** Constant ** //
import { ModuleNames, POLYMORPHIC_MODELS } from 'constant/permissions.constant';
import { useLazyGetGeneralSettingQuery } from 'redux/api/generalSettingApi';
import {
  useLazyGetActivitiesEmailSettingQuery,
  useLazyGetActivitiesQuery,
  useLazyGetActivityByIdQuery,
} from 'redux/api/activityApi';
import { useLazyGetContactsQuery } from 'redux/api/contactApi';
import { useLazyGetLeadsQuery } from 'redux/api/leadApi';
import { useLazyGetAllUserQuery } from 'redux/api/userApi';

// ** Helper **
import { getDefaultActivityResult } from 'pages/Setting/module-setting/Activity/ActivityType/helper/activityType.helper';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { IS_CACHING_ACTIVE } from 'constant';
import { ActivityTypeResponseType } from 'pages/Setting/module-setting/Activity/ActivityType/types/activity-type.types';

export const useGetActivityDetail = () => {
  // ** Hooks **
  const navigate = useNavigate();

  // ** APIS **
  const [getActivityByIdAPI, { currentData, error, isFetching, isLoading }] =
    useLazyGetActivityByIdQuery();

  const [activityDetail, setActivityDetail] = useState<ActivityResponseType>(
    emptyActivityResponse
  );

  useEffect(() => {
    if (currentData) {
      const activityResult = getDefaultActivityResult(
        currentData.activity_type
      );
      setActivityDetail({ ...currentData, activity_result: activityResult });
    } else if (error && error.message === 'Activity not found') {
      navigate(PRIVATE_NAVIGATION.activities.view);
    }
  }, [currentData, error]);

  const getActivity = async (id: number) => {
    await getActivityByIdAPI({
      id,
      data: {
        query: {
          'include[host][select]': 'id,username,first_name,last_name,email',
          'include[activity_contact][select]':
            'id,name,job_role,emails,phones,address1,address2,zip,city,country_id,state_id',
          'include[activity_contact][include][state][select]':
            'id,name,state_code',
          'include[activity_contact][include][country][select]': 'id,name',
          'include[activity_type][select]':
            'icon,icon_type,name,id,is_default,color',
          'include[activity_type][paranoid]': false,
          'include[creator][select]': 'first_name,last_name',
          'include[modifier][select]': 'first_name,last_name',
          'include[activity_time_logs]': 'all',
          'include[activity_account][select]':
            'id,name,phones,emails,address1,address2,zip,city,country_id,state_id',
          'include[activity_account][include][state][select]':
            'id,name,state_code',
          'include[activity_account][include][country][select]': 'id,name',
          'include[assigned_to][select]': 'id,first_name,last_name',
          'include[assigned_to][paranoid]': false,
          'include[ac][paranoid]': false,
          'include[activity_lead][select]':
            'id,name,is_deal,deal_value,closing_date',
          'include[activity_lead][include][lead_source][select]': 'id,name',
          'include[activity_lead][include][related_account]':
            'id,name,emails,phones',
          'include[activity_lead][include][related_contacts][select]':
            'id,contact_id',
          'include[activity_lead][include][related_contacts][include][contact]':
            'id,name,emails,phones',
          'include[activity_collaborators][select]': 'id,activity_id,user_id',
          'include[activity_collaborators][include][user][select]':
            'id,first_name,last_name,username,profile_image,email,phone',
          'include[activity_collaborators][include][user][required]': true,
          'include[activity_participants][select]':
            'id,participant_type,participant_id,is_confirm,meeting_status,activity_email_setting',
          'include[activity_participants][include][contact]':
            'id,name,emails,phones,job_role,address1,address2,city,state_id,country_id,zip',
          'include[activity_participants][include][state][select]':
            'id,name,state_code',
          'include[activity_participants][include][country][select]': 'id,name',
          'include[activity_participants][q][participant_type]': 'contact',
          'include[activity_followers][select]': 'follower_id,activity_id',
          'include[activity_followers][include][follower][select]':
            'id,first_name,last_name,full_name,email,phone,profile_image',
          'include[activity_followers][include][follower][include][user_roles][select]':
            'role_id',
          'include[activity_followers][include][follower][include][user_roles][include][role][select]':
            'name',
          'include[following_activities][select]': 'id,topic,start_date',
        },
      },
    });
  };

  return {
    getActivity,
    activityDetail,
    isFetching,
    isLoading,
  };
};

export const useGetParticipantsListOptions = ({
  participantsType,
}: {
  participantsType: string;
}) => {
  // ** APIS **
  const [getContactsAPI, { isLoading: isContactLoading }] =
    useLazyGetContactsQuery();
  const [getUsersAPI, { isLoading: isUserLoading }] = useLazyGetAllUserQuery();

  const getParticipantsListOptions: AsyncSelectGetOptions = async (option) => {
    let tempData;

    if (participantsType === 'user') {
      const data = await getUsersAPI(
        {
          params: {
            limit: 100,
            searchText: option?.search,
            page: option?.page,
            searchFields: 'first_name,last_name,email,username',
          },
        },
        true
      );
      if ('data' in data && data.data.rows) {
        const tempOption = data.data.rows.map(
          (val: {
            username?: string;
            id: number;
            first_name?: string;
            last_name?: string;
          }) => ({
            label: val.username
              ? `${val.username}`
              : `${val.first_name} ${val.last_name}`,
            value: val.id,
          })
        );
        tempData = {
          option: tempOption,
          count: data.data.count,
        };
      }
    } else if (participantsType === 'contact') {
      const { data, error } = await getContactsAPI(
        {
          data: {
            query: {
              limit: 100,
              page: option?.page,
              ...(option?.search
                ? { 'q[name][iLike]': `%${option.search}%` }
                : {}),
              select: 'id,name,job_role',
            },
          },
        },
        true
      );

      if (!error && data.rows) {
        const tempOption = data.rows.map(
          (val: { name?: string; id: number }) => ({
            label: `${val.name}`,
            value: val.id,
          })
        );
        tempData = {
          option: tempOption,
          count: data.count,
        };
      }
    }
    if (tempData) {
      return {
        option: tempData?.option,
        count: tempData?.count,
      };
    }
  };

  return {
    getParticipantsListOptions,
    isLoading: isUserLoading || isContactLoading,
  };
};

export const useGetRelatedToOptions = ({
  relatedTo,
}: {
  relatedTo: string;
}) => {
  // ** APIS **
  const [getContactsAPI, { isLoading: isContactLoading }] =
    useLazyGetContactsQuery();

  const [getLeads, { isLoading: isLeadLoading }] = useLazyGetLeadsQuery();

  const getRelatedToOptions: AsyncSelectGetOptions = async (option) => {
    let final_data;
    let final_error;
    if (relatedTo === 'lead') {
      const { data, error } = await getLeads(
        {
          data: {
            query: {
              limit: 100,
              searchText: option?.search,
              page: option?.page,
              searchFields: 'name',
              'q[is_deal]': false,
            },
          },
        },
        true
      );
      final_data = data;
      final_error = error;
    } else if (relatedTo === 'contact') {
      const { data, error } = await getContactsAPI(
        {
          data: {
            query: {
              limit: 100,
              page: option?.page,
              ...(option?.search
                ? { 'q[name][iLike]': `%${option.search}%` }
                : {}),
              select: 'id,name,job_role',
            },
          },
        },
        true
      );
      final_data = data;
      final_error = error;
    }

    if (
      !final_error &&
      final_data.rows &&
      (relatedTo === 'contact' || relatedTo === 'lead')
    ) {
      const tempOption = final_data.rows.map(
        (val: { name?: string; id: number }) => ({
          label: val.name ? `${val.name}` : ``,
          value: val.id,
        })
      );
      return {
        option: tempOption,
        count: final_data.count,
      };
    }
  };

  return { getRelatedToOptions, isLoading: isLeadLoading || isContactLoading };
};

// ** contact list for guest activity participants **
export const useGetContactGuestsOptions = () => {
  const [activityGuestContactsData, setActivityGuestContactsData] =
    useState<ActivityGuestContactsDataType>([]);

  // ** APIS **
  const [getContactsAPI, { isLoading: isGuestContactsLoading }] =
    useLazyGetContactsQuery();

  const getContactGuestsOptions = async () => {
    const { data, error } = await getContactsAPI(
      {
        data: {
          query: {
            limit: 100,
            page: 1,
            select: 'id,name,job_role,emails',
          },
        },
      },
      true
    );
    if (!error && data.rows) {
      setActivityGuestContactsData(data?.rows || []);
    }
  };
  useEffect(() => {
    getContactGuestsOptions();
  }, []);

  return {
    activityGuestContactsData,
    isGuestContactsLoading,
    getContactGuestsOptions,
  };
};

// ** contact list for guest activity participants **
export const useGetActivityContactGuestsOptions = () => {
  // ** APIS **
  const [getContactsAPI, { isLoading: isGuestContactsLoading }] =
    useLazyGetContactsQuery();

  const getContactGuestsOptions = async () => {
    const { data, error } = await getContactsAPI({
      data: {
        query: {
          limit: 100,
          page: 1,
          select: 'id,name,job_role,emails',
        },
      },
    });

    if (!error && data.rows) {
      const Options = data.rows
        .filter(
          (val: {
            id: number;
            name: string;
            emails: { is_primary: boolean; value: string }[];
          }) => {
            return !!val?.emails?.find((email) => email.is_primary);
          }
        )
        .map(
          (val: {
            id: number;
            name: string;
            emails: { is_primary: boolean; value: string }[];
          }) => {
            const primaryEmail = val?.emails?.find((email) => email.is_primary);
            return {
              label: `${val.name}(${primaryEmail?.value})`,
              value: primaryEmail?.value || '',
              id: val.id,
              text: `${val.name}(${primaryEmail?.value})`,
              name: val.name,
              email: primaryEmail?.value || '',
            };
          }
        );

      return {
        option: Options,
        count: data.count,
      };
    }
  };
  useEffect(() => {
    getContactGuestsOptions();
  }, []);

  return {
    isGuestContactsLoading,
    getContactGuestsOptions,
  };
};

// ** user list for collaborators **

export const useGetCollaboratorsOptions = () => {
  // ** APIS **
  const [getUsersAPI, { isLoading: isCollaboratorsLoading }] =
    useLazyGetAllUserQuery();
  const [collaboratorsOptions, setCollaboratorsOptions] = useState([]);

  const getCollaboratorsOptions = async () => {
    const data = await getUsersAPI(
      {
        params: {
          limit: 100,
          page: 1,
        },
      },
      true
    );

    if ('data' in data && data.data.rows) {
      const tempOption = data.data.rows.map(
        (val: { first_name?: string; last_name?: string; id: number }) => ({
          text: `${val.first_name} ${val.last_name}`,
          value: val.id,
          id: val.id,
        })
      );

      setCollaboratorsOptions(tempOption);
    }
  };
  useEffect(() => {
    getCollaboratorsOptions();
  }, []);

  return {
    collaboratorsOptions,
    getCollaboratorsOptions,
    isCollaboratorsLoading,
  };
};

// ** lead or deal option
export const useGetAllLeadOrDealOptions = () => {
  const [getLeads, { isLoading: isAllLeadAndDealLoading }] =
    useLazyGetLeadsQuery();

  const [AllLeadDealData, setAllLeadDealData] = useState<LeadDetailsType[]>([]);
  const getAllLeadAndDealOptions: AsyncSelectGetOptions = async (option) => {
    const { data, error } = await getLeads(
      {
        data: {
          query: {
            'include[related_account]': 'all',
            'include[related_contacts][include][contact]':
              'id,emails,phones,name,job_role',
            limit: 100,
            searchFields: 'name',
            searchText: option?.search,
            page: option?.page,
          },
        },
      },
      IS_CACHING_ACTIVE
    );
    if (data?.rows && !error) {
      const Options = data.rows.map(
        (val: { is_deal: boolean; name: string; id: number }) => {
          return {
            label: `${val.name}`,
            value: val.id,
            is_deal: val.is_deal,
          };
        }
      );
      setAllLeadDealData(data.rows);
      return {
        option: Options,
        count: data.count,
      };
    }
  };
  return {
    getAllLeadAndDealOptions,
    isAllLeadAndDealLoading,
    AllLeadDealData,
  };
};

// ** availability ** //
export const useGetAvailabilityOptions = () => {
  // ** APIS **
  const [getGeneralSetting, { isLoading: getGeneralSettingLoading }] =
    useLazyGetGeneralSettingQuery();

  const currentUser = useSelector(getCurrentUser);

  const [availabilityData, setAvailabilityData] = useState<
    {
      id: number;
      availability: string;
    }[]
  >([]);

  const getAvailabilityOptions = async () => {
    const { data, error } = await getGeneralSetting(
      {
        params: {
          'q[key]': 'default_activity_availability',
          'q[model_name]': POLYMORPHIC_MODELS.USER,
          'q[model_record_id]': currentUser?.id,
          module: ModuleNames.ACTIVITY,
        },
      },
      true
    );

    if (!error && data) {
      const updatedAvailabilityData: { id: number; availability: string }[] =
        data.map((x: { related_model_id: number; value: string }) => ({
          id: x.related_model_id,
          availability: x.value,
        })) || [];
      setAvailabilityData(updatedAvailabilityData);
    }
  };
  return {
    getAvailabilityOptions,
    getGeneralSettingLoading,
    availabilityData,
  };
};

// ** hook for Read only activity ** //
export const useGetReadOnlyActivities = () => {
  const [readOnlyActivityData, setReadOnlyActivityData] = useState<
    miniCalenderDataType[]
  >([]);

  // ** APIS **
  const [getActivitiesAPI, { isLoading: isReadOnlyActivityLoading }] =
    useLazyGetActivitiesQuery();

  const getReadOnlyActivities = async (date: Date, activityId?: number) => {
    const { data, error } = await getActivitiesAPI(
      {
        data: {
          query: {
            'include[activity_type][select]': 'icon,icon_type,name,id,color',
            'q[start_date][gte]': startOfDay(date).toISOString(),
            'q[start_date][lte]': endOfDay(date).toISOString(),
            ...(activityId && {
              'q[id][notIn]': `n|${activityId}`,
            }),
          },
        },
      },
      true
    );

    if (!error && data?.rows) {
      const activityList = data?.rows?.map((activity: ActivityResponseType) => {
        return {
          Id: `read_only_${activity.id}`,
          EndTime: addMinutes(new Date(activity.start_date), activity.duration),
          StartTime: activity.start_date,
          Subject: activity.topic,
          isReadonly: true,
          ActivityIcon: activity?.activity_type?.icon,
          icon_type: activity?.activity_type?.icon_type,
          IsAllDay: activity.all_day,
        };
      });
      setReadOnlyActivityData([...activityList]);
    }
  };

  return {
    getReadOnlyActivities,
    readOnlyActivityData,
    isReadOnlyActivityLoading,
  };
};

// ** activity types email status
export const useGetActivityTypeEmailStatus = () => {
  const [
    getActivityTypeEmailStatus,
    { isLoading: isGetActivityTypeEmailStatusLoading },
  ] = useLazyGetActivitiesEmailSettingQuery();

  const initialState: Map<number, string> = new Map();

  const [activityTypeEmailStatus, setActivityTypeEmailStatus] =
    useState<Map<number, string>>();

  const getAllActivityTypeEmailStatus = async () => {
    const { data, error } = await getActivityTypeEmailStatus({});
    if (data) {
      setActivityTypeEmailStatus(
        data.reduce(
          (
            result: Map<number, string>,
            val: {
              id: number;
              activity_type_email_setting: { email_status: string };
            }
          ) => {
            return result.set(
              val.id,
              val.activity_type_email_setting?.email_status
            );
          },
          initialState
        )
      );
    }
  };
  return {
    getAllActivityTypeEmailStatus,
    activityTypeEmailStatus,
    isGetActivityTypeEmailStatusLoading,
  };
};

// ** hook for other Activity Related Data ** //
export const useLoadOtherActivityRelatedDataHooks = () => {
  const {
    getActivity,
    activityDetail,
    isLoading: isGetActivityDetailLoading,
  } = useGetActivityDetail();

  // ** APIS **
  const [getGeneralSetting, { isLoading: getGeneralSettingLoading }] =
    useLazyGetGeneralSettingQuery();
  const { activityTypeData, isActivityTypeLoading } = useGetActivityTypes({});

  const { userZoomAuthStatus, isZoomUserStatusLoading } =
    useGetUserZoomAuthenticationStatus();
  const { defaultRemindersData, isGetDefaultRemindersLoading } =
    useGetAllDefaultReminder();
  const {
    getAvailabilityOptions,
    getGeneralSettingLoading: isAvailabilityLoading,
    availabilityData,
  } = useGetAvailabilityOptions();

  const {
    activityTypeEmailStatus,
    getAllActivityTypeEmailStatus,
    isGetActivityTypeEmailStatusLoading,
  } = useGetActivityTypeEmailStatus();

  const loadingCondition =
    isGetActivityDetailLoading ||
    isActivityTypeLoading ||
    isZoomUserStatusLoading ||
    isGetDefaultRemindersLoading ||
    isAvailabilityLoading ||
    isGetActivityTypeEmailStatusLoading ||
    isActivityTypeLoading;

  useEffect(() => {
    getAllActivityTypeEmailStatus();
    getAvailabilityOptions();
  }, []);

  return {
    availabilityData,
    activityDetail,
    activityTypeData,
    activityTypeEmailStatus,
    userZoomAuthStatus,
    defaultRemindersData,
    loadingCondition,
    getActivity,
    getGeneralSetting,
    getGeneralSettingLoading,
  };
};

// Activity Type Dropdown Hook
export const useGetActivityType = () => {
  const { activityTypeData, isActivityTypeLoading } = useGetActivityTypes({});
  const getActivityTypeOptions: AsyncSelectGetOptions = async () => {
    if (activityTypeData) {
      const TypeDropdown: Option[] = (activityTypeData || []).map(
        (obj: activityTypeResponse) => {
          return {
            label: obj.name,
            value: obj.id,
            extraLabel: obj.name,
          };
        }
      );
      return {
        option: TypeDropdown || [],
        count: TypeDropdown.length,
      };
    }
  };
  return { getActivityTypeOptions, isActivityTypeLoading };
};
