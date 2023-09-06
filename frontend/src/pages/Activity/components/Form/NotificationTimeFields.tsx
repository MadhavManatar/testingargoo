// ** import packages ** //
import { useFieldArray, useFormContext } from 'react-hook-form';

// ** components ** //
import FormField from 'components/FormField';
import Icon from 'components/Icon';
import Button from 'components/Button';

// ** Hooks ** //
import useWindowDimensions from 'hooks/useWindowDimensions';

// ** types ** //
import { AddActivityFormFields } from 'pages/Activity/types/activity.types';

// ** others ** //
import { NOTIFICATION_TYPE } from 'constant';
import { checkInputIsNumber } from 'utils/util';

type NotificationTimeFieldsPropsType = {
  hideLabel?: boolean;
};
const NotificationTimeFields = (props: NotificationTimeFieldsPropsType) => {
  const { hideLabel = false } = props;
  const {
    control,
    formState: { errors },
    register,
  } = useFormContext<AddActivityFormFields>();
  const { fields, remove, append } = useFieldArray({
    name: 'notifications',
    control,
  });

  const { isMobileView } = useWindowDimensions();

  return (
    <>
      {!hideLabel && (
        <label className="if__label if__label__blue">Reminder</label>
      )}
      <div className="repeater__reminder__box relative">
        {fields.map((field, index) => {
          return (
            <div
              className="repeater__reminde__inside flex flex-wrap items-start pr-[40px] lg:mb-[20px]"
              key={field.id}
            >
              <FormField<AddActivityFormFields>
                wrapperClass="mb-0 w-[calc(100%_-_260px)] mr-[10px] lg:w-[calc(100%_-_100px)] md:w-full md:mr-0 md:mb-[7px]"
                placeholder="Select Notification Type"
                type="select"
                name={`notifications.${index}.notificationType`}
                control={control}
                error={
                  errors?.notifications &&
                  errors?.notifications[index] &&
                  errors?.notifications[index]?.notificationType &&
                  errors.notifications[index]?.notificationType
                }
                options={[
                  {
                    label: 'Notification',
                    value: 'notification',
                  },
                ]}
                menuPlacement="bottom"
                menuPosition="absolute"
                isSearchable={!isMobileView}
              />

              <FormField<AddActivityFormFields>
                type="text"
                name={`notifications.${index}.duration`}
                wrapperClass="w-[90px] mr-[10px] lg:mr-0 lg:mb-[7px] md:w-full sm:w-[90px]"
                placeholder="000"
                fieldLimit={3}
                register={register}
                error={
                  errors?.notifications &&
                  errors?.notifications[index] &&
                  errors?.notifications[index]?.duration &&
                  errors.notifications[index]?.duration
                }
                onKeyDown={checkInputIsNumber}
                inputMode="decimal"
              />
              <FormField<AddActivityFormFields>
                wrapperClass="mb-0 w-[150px] lg:w-full sm:w-[calc(100%_-_100px)] sm:ml-[10px]"
                placeholder="Select Duration Type"
                type="select"
                name={`notifications.${index}.durationType`}
                control={control}
                error={
                  errors?.notifications &&
                  errors?.notifications[index] &&
                  errors?.notifications[index]?.durationType &&
                  errors.notifications[index]?.durationType
                }
                options={NOTIFICATION_TYPE}
                menuPlacement="bottom"
                menuPosition="absolute"
                isSearchable={!isMobileView}
              />
              <button
                type="button"
                className="delete__btn absolute right-0 text-[14px] font-biotif__Regular text-primaryColor underline duration-500 mt-[8px] hover:text-primaryColor__hoverDark"
                onClick={() => {
                  remove(index);
                }}
              >
                <Icon
                  className="w-[30px] h-[30px] p-[7px] rounded-full duration-500"
                  iconType="deleteFilled"
                />
              </button>
            </div>
          );
        })}
        <Button
          type="button"
          className="primary__Btn py-[10px] px-[20px]"
          onClick={(e) => {
            e.stopPropagation();
            append(
              {
                duration: 0,
                durationType: 1,
                notificationType: 'notification',
              },
              {
                shouldFocus: !isMobileView,
              }
            );
          }}
        >
          Add Reminder
        </Button>
      </div>
    </>
  );
};

export default NotificationTimeFields;
