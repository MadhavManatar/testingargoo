// ** import packages ** //
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// ** Components ** //
import NotificationTimeFields from '../Form/NotificationTimeFields';
import Modal from 'components/Modal';

// ** Others ** //
import { AddActivityFormFields } from 'pages/Activity/types/activity.types';
import { activityReminderSchema } from 'pages/Activity/validation-schema/activity.schema';
import { sortActivityReminders } from 'pages/Activity/helper/activity.helper';
import { useUpdateActivityMutation } from 'redux/api/activityApi';

type NotificationReminderModalPropsType = {
  isOpen: boolean;
  closeModal: () => void;
  onUpdate?: () => void;
  notifications: {
    notificationType: string;
    duration: number;
    durationType: number;
  }[];
  activityId: number;
};

const NotificationReminderModal = (
  props: NotificationReminderModalPropsType
) => {
  const { isOpen, closeModal, notifications, onUpdate, activityId } = props;
  const formMethods = useForm<AddActivityFormFields>({
    resolver: yupResolver(
      yup
        .object({
          notifications: activityReminderSchema,
        })
        .required()
    ),
  });
  const { setValue, handleSubmit } = formMethods;

  // ** APIS **
  const [updateActivityByIdAPI, { isLoading: isUpdateActivityLoading }] =
    useUpdateActivityMutation();

  useEffect(() => {
    setValue('notifications', notifications);
  }, [notifications]);

  const onSubmit = handleSubmit(async (value: AddActivityFormFields) => {
    const ActivityFormData = new FormData();

    if (value?.notifications.length >= 0) {
      ActivityFormData.set(
        'notifications',
        JSON.stringify(sortActivityReminders(value?.notifications || []))
      );
    }

    const data = await updateActivityByIdAPI({
      id: activityId,
      data: ActivityFormData,
    });
    if ('data' in data || !('error' in data)) {
      onUpdate?.();
      closeModal();
    }
  });

  return isOpen ? (
    <>
      <Modal
        title="Reminder"
        visible={isOpen}
        onClose={() => closeModal()}
        width="500px"
        onCancel={() => closeModal()}
        onSubmit={() => onSubmit()}
        submitLoading={isUpdateActivityLoading}
      >
        <div>
          <FormProvider {...formMethods}>
            <NotificationTimeFields hideLabel />
          </FormProvider>
        </div>
      </Modal>
    </>
  ) : (
    <></>
  );
};

export default NotificationReminderModal;
