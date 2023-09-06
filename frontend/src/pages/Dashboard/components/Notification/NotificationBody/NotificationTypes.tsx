import { Link } from 'react-router-dom';
import { checkAlertNotificationType } from '../helpers';
import { UserNotification } from '../types/notification.types';

interface Props {
  notification: UserNotification;
}

const ModelName = {
  leads: 'Lead',
  deals: 'Deal',
  activities: 'Activity',
  contacts: 'Contact',
  accounts: 'Account',
};

const ModuleRecordActionType = (props: Props) => {
  const { action, entityActionType, link, modelName, name } =
    useNotificationDataMining(props?.notification || {});

  return (
    <p className="text-[14px] text-black/50 font-biotif__Regular">
      {action}
      {entityActionType && ' '}
      <Link to={link}>
        {entityActionType}
        <span className="text-primaryColor inline-block ml-[5px] capitalize">
          {name} {modelName}
        </span>
      </Link>
    </p>
  );
};

export default ModuleRecordActionType;

const useNotificationDataMining = (notification: UserNotification) => {
  const { timeline, changes, alertType, alertData } = notification?.notification
    ?.message || { timeline: undefined, changes: undefined };
  const {
    action,
    model_name,
    leads,
    model_record_id,
    contacts,
    accounts,
    related_activities,
    message,
  } = timeline || { action: undefined, model_name: undefined };
  const data = {
    ...(action ? { action: `${action} a` } : {}),
    entityActionType: !message?.fieldName.includes('Created')
      ? message?.fieldName
      : '',
    name: (leads || contacts || accounts)?.name || related_activities?.topic,
    modelName: ModelName[model_name as keyof typeof ModelName],
    link: `/${model_name}/${model_record_id}`,
  };

  // ** activity notification message **
  if (model_name === 'activities' && data.action === 'Created a') {
    data.action = 'Schedule an';
    data.entityActionType = message?.newValue?.value?.toLowerCase();
    data.name = timeline?.related_activities?.activity_lead?.name || '';
  }

  // ** comment notification message **
  // if (notification?.notification?.message?.changes?.fieldName === 'comment_mention') {
  //     data.action = 'Comment a';
  // }

  // ** reaction notification message **
  if (notification?.notification?.message.reaction) {
    data.action = 'Reacted on';
  }

  // ** comment notification message **
  if (notification?.notification?.message.comment) {
    data.action = 'Commented on';
  }

  // ** document created notification message **
  if (
    timeline?.documents?.length > 0 &&
    !notification?.notification?.message.reaction &&
    !notification?.notification?.message.comment
  ) {
    data.action = 'Document attached';
  }

  // ** note mentioned notification message **
  if (
    changes?.fieldName === 'comment_mention' ||
    (timeline?.note && changes?.fieldName === 'note_user')
  ) {
    data.action = 'Mentioned on';
    data.modelName =
      (changes?.fieldName === 'comment_mention' && 'Comment') ||
      (changes?.fieldName === 'note_user' && 'Note') ||
      '';
  }

  if (data.action === 'Deleted a') {
    data.entityActionType = '';
    if (
      notification?.notification?.message?.changes[0] &&
      notification?.notification?.message?.changes[0]?.newValue?.value
    )
      data.name =
        notification?.notification?.message?.changes[0]?.newValue?.value;
  }

  if (data.action === 'Restored a') {
    data.entityActionType = '';
    if (
      notification?.notification?.message?.changes[0] &&
      notification?.notification?.message?.changes[0]?.newValue?.value
    )
      data.name =
        notification?.notification?.message?.changes[0]?.newValue?.value;
  }

  if (alertType) {
    checkAlertNotificationType(
      { alertType, alertData },
      notification?.notification?.creator,
      data
    );
  }

  return data;
};
