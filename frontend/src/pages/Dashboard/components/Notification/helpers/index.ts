import { UserInterface } from 'redux/slices/authSlice';

type notificationData = {
  entityActionType: string;
  name: string;
  modelName: string;
  link: string;
  action?: string | undefined;
};

export const checkAlertNotificationType = (
  { alertType, alertData }: { alertType: string; alertData: any },
  userData: UserInterface,
  data: notificationData
) => {
  switch (alertType) {
    case 'failed_login_attempts':
      data.entityActionType = 'Too many failed login attempts.';
      break;
    case 'new_location_login':
      data.entityActionType = 'New login location detected.';
      break;
    case 'reset_pass_request':
      data.entityActionType = 'Reset password request created.';
      break;
    case 'delete_deals':
      data.entityActionType = `${
        alertData ? alertData?.deletedDealData?.deletedCount : ''
      } Deal deleted by`;
      break;
    case 'invite_user':
      data.entityActionType = `${alertData?.addedUserData?.full_name} is invited by`;
      break;
    case 'delete_contacts':
      data.entityActionType = `${
        alertData ? alertData?.deletedContactData?.deletedCount : ''
      } Contact deleted by`;
      break;
    case 'delete_accounts':
      data.entityActionType = `${
        alertData ? alertData?.deletedAccountData?.deletedCount : ''
      } Account deleted by`;
      break;
    case 'delete_stage_pipeline':
      data.entityActionType = `${
        alertData && alertData?.deletedPipelineData
          ? alertData?.deletedPipelineData?.deletedData[0]?.name
          : ''
      } pipeline deleted by`;
      break;
    default:
      break;
  }
  const { first_name, last_name, id } = userData || {};
  data.modelName = `${first_name} ${last_name}`;
  data.link = `/settings/user/${id}`;
  return data;
};
