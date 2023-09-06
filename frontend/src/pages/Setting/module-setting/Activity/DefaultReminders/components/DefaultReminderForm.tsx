// ** external packages ** //
import { Control, FieldErrors, UseFormRegister } from 'react-hook-form';

// ** components ** //
import Button from 'components/Button';
import FormField from 'components/FormField';

// ** types ** //
import { DefaultReminderFieldType } from '../types/default-reminder.types';

// ** others ** //
import { NOTIFICATION_TYPE } from 'constant';
import useAuth from 'hooks/useAuth';
import {
  BasicPermissionTypes,
  ModuleNames,
} from 'constant/permissions.constant';
import AuthGuard from 'pages/auth/components/AuthGuard';

type NotificationTimeFormProps = {
  control: Control<DefaultReminderFieldType>;
  errors: FieldErrors<DefaultReminderFieldType>;
  register: UseFormRegister<DefaultReminderFieldType>;
  submitLoading: boolean;
};

const DefaultReminderForm = (props: NotificationTimeFormProps) => {
  const { control, errors, register, submitLoading } = props;

  // ** hooks ** //
  const { hasAuthorized } = useAuth();

  // constant ** //
  const editPermission = hasAuthorized([
    { module: ModuleNames.ACTIVITY, type: BasicPermissionTypes.UPDATE },
  ]);

  return (
    <>
      <div className="w-[554px] max-w-full mb-[22px]">
        <h3 className="text-[20px] text-black font-biotif__Medium mb-[14px]">
          User Alert Notification
        </h3>
        <p className="text-[16px] font-biotif__Regular text-black/50">
          The auto suggest address will make it simple for users to enter a
          location. If the auto suggest address feature is enabled,
        </p>
      </div>

      <div className="">
        <div className="flex flex-wrap items-start sm:mb-[26px]">
          <FormField<DefaultReminderFieldType>
            wrapperClass="mb-0 w-[178px] mr-[10px] sm:w-[calc(100%_-_110px)]"
            id="notificationType"
            placeholder="Select Notification Type"
            type="select"
            name="notificationType"
            control={control}
            error={errors?.notificationType}
            options={[
              {
                label: 'Notification',
                value: 'notification',
              },
            ]}
            menuPlacement="bottom"
            disabled={!editPermission}
          />

          <FormField<DefaultReminderFieldType>
            type="text"
            name="duration"
            wrapperClass="w-[100px] mr-[10px] sm:mr-0 sm:mb-[10px]"
            placeholder="000"
            fieldLimit={3}
            register={register}
            error={errors?.duration}
            control={control}
            disabled={!editPermission}
            inputMode="numeric"
          />
          <FormField<DefaultReminderFieldType>
            wrapperClass="mb-0 w-[152px] mr-[10px] sm:w-[calc(100%_-_110px)]"
            id="durationType"
            placeholder="Select Duration Type"
            type="select"
            name="durationType"
            control={control}
            error={errors.durationType}
            options={NOTIFICATION_TYPE}
            menuPlacement="bottom"
            disabled={!editPermission}
          />
        </div>
        <AuthGuard
          permissions={[
            {
              module: ModuleNames.ACTIVITY,
              type: BasicPermissionTypes.UPDATE,
            },
          ]}
        >
          <Button
            className="primary__Btn"
            type="submit"
            isLoading={submitLoading}
          >
            Save
          </Button>
        </AuthGuard>
      </div>
    </>
  );
};

export default DefaultReminderForm;
