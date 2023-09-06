// ** import packages ** //
import { useState, useEffect } from 'react';

// ** redux ** //
import store from 'redux/store';

// ** types ** //
import { zoomIsExistResponseType } from '../types/activity.types';
import {
  useLazyGetZoomUserIsExistQuery,
  useUpdateZoomMeetingMutation,
} from 'redux/api/zoomApi';

export const useGetUserZoomAuthenticationStatus = () => {
  const { auth } = store.getState();
  const { user } = auth;
  const [userZoomAuthStatus, setUserZoomAuthStatus] =
    useState<zoomIsExistResponseType>({
      exist: false,
      tokenData: [
        {
          token_provider_mail: '',
          user_id: 0,
        },
      ],
    });

  // ** APIS **
  const [getZoomUserIsExist, { isLoading: isZoomUserStatusLoading }] =
    useLazyGetZoomUserIsExistQuery();

  const getUserZoomAuthenticationStatus = async () => {
    const { data } = await getZoomUserIsExist({ id: user?.id || 0 }, true);
    setUserZoomAuthStatus(data);
  };
  useEffect(() => {
    getUserZoomAuthenticationStatus();
  }, []);
  return {
    userZoomAuthStatus,
    isZoomUserStatusLoading,
    getUserZoomAuthenticationStatus,
  };
};

type updateZoomMeetingFunctionType = {
  topic: string;
  activity_type?: string;
  email: string;
  host_id?: number;
  start_date: string;
  duration: number;
  provider_meeting_id: string;
};

export const useUpdateZoomMeetingHook = () => {
  // ** APIS **
  const [updateZoomMeetingAPI, { isLoading: isUpdateZoomLoading }] =
    useUpdateZoomMeetingMutation();

  const updateZoomMeetingFunction = (args: updateZoomMeetingFunctionType) => {
    const {
      duration,
      email,
      start_date,
      topic,
      activity_type,
      host_id,
      provider_meeting_id,
    } = args;

    return updateZoomMeetingAPI({
      id: provider_meeting_id,
      data: {
        topic,
        activity_type,
        email,
        host_id,
        start_date,
        duration,
      },
    });
  };
  return {
    updateZoomMeetingFunction,
    isUpdateZoomLoading,
  };
};
