// ** Import packages ** //
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

// ** Components ** //
import Icon, { IconTypes } from 'components/Icon';
import Image from 'components/Image';

// ** Types ** //
import {
  ActivityResponseType,
  activityTypeResponse,
  AddActivityFormFields,
} from 'pages/Activity/types/activity.types';
import { DefaultTimeReminderResponse } from 'pages/Setting/module-setting/Activity/DefaultReminders/types/default-reminder.types';

type ActivityTypeFieldProps = {
  setCurrentActivityType: Dispatch<
    SetStateAction<activityTypeResponse | undefined>
  >;
  activityTypeData: activityTypeResponse[];
  activityDetail?: ActivityResponseType;
  defaultRemindersData: DefaultTimeReminderResponse[];
  formFlag: 'add' | 'edit' | 'followUp';
  setSelectedActivityType: React.Dispatch<
    React.SetStateAction<activityTypeResponse | undefined>
  >;
  selectedActivityType: activityTypeResponse | undefined;
};

function ActivityTypeFieldComponent(props: ActivityTypeFieldProps) {
  const {
    setCurrentActivityType,
    activityTypeData,
    activityDetail,
    defaultRemindersData,
    formFlag,
    selectedActivityType,
    setSelectedActivityType,
  } = props;

  // ** hooks ** //
  const activityTypeRef = useRef<HTMLDivElement>(null);
  const {
    formState: { errors },
    setValue,
    clearErrors,
    watch,
  } = useFormContext<AddActivityFormFields>();

  // ** states ** //
  // DataStructure:- Map<activityType Id, activityTypeNotificationData>
  const [notificationData, setNotificationData] =
    useState<
      Map<
        number,
        { duration: number; durationType: number; notificationType: string }[]
      >
    >();
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);

  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      if (
        openDropdown &&
        activityTypeRef.current &&
        !activityTypeRef.current.contains(e.target)
      ) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [openDropdown]);

  // is default ActivityType
  const defaultActivityType = (activityTypeData || []).find(
    (item) => item.is_default
  )?.is_default;

  // ** Custom hooks ** //
  useEffect(() => {
    if (selectedActivityType) {
      setCurrentActivityType(selectedActivityType);
      setValue('activity_type', selectedActivityType.name);
      setValue('activity_type_id', selectedActivityType.id);
      if (!defaultActivityType && selectedActivityType?.id) {
        setValue('activity_type_is_default', !!selectedActivityType.is_default);
      }
      clearErrors('activity_type_id');
    }

    // we set the default activity type notification time value if notification time is not selected or entered on add activity
    if (formFlag === 'add' && selectedActivityType?.id) {
      const defaultActivityTypeNotificationData = notificationData?.get(
        selectedActivityType?.parent_type_id || selectedActivityType.id
      );
      if (defaultActivityTypeNotificationData?.length) {
        setValue('notifications', defaultActivityTypeNotificationData);
      }
    }
  }, [selectedActivityType, notificationData]);

  useEffect(() => {
    if (activityDetail?.activity_type) {
      const { activity_type } = activityDetail;
      setSelectedActivityType({
        icon: activity_type?.icon as IconTypes,
        icon_type: activity_type?.icon_type,
        id: activity_type?.id,
        name: activity_type?.name,
      });
    }
  }, [activityDetail]);

  useEffect(() => {
    const firstErrorKey = Object.keys(errors).find((key) => {
      const fieldKey = key as keyof typeof errors;
      return errors[fieldKey];
    });

    if (firstErrorKey === 'activity_type_id' && activityTypeRef.current) {
      activityTypeRef.current?.focus();
      activityTypeRef.current?.scrollIntoView();
    }
  }, [Object.keys(errors)]);

  useEffect(() => {
    setNotificationData(
      defaultRemindersData.reduce((prev, val) => {
        return prev.set(val.activity_type_id, JSON.parse(val.notifications));
      }, new Map())
    );
  }, [defaultRemindersData]);

  const customImage =
    selectedActivityType?.icon_type === 'Custom' ? (
      <Image
        imgPath={selectedActivityType.icon}
        serverPath
        imgClassName=" w-[32px] h-[32px] i__Icon rounded-[12px]"
      />
    ) : (
      <></>
    );

  return (
    <>
      <div className="inline-flex items-center flex-wrap sm:max-w-[calc(100%_-_45px)] sm:pr-[13px]">
        <div
          className="relative inline-block mr-[15px] mb-[10px]"
          ref={activityTypeRef}
          id="appendTo"
        >
          <button
            type="button"
            className="activityType__dropdown__btn mb-[5px] text-[14px] font-biotif__Medium text-primaryColor rounded-[10px] py-[4px] px-[12px] pr-[31px] h-[43px] relative before:content-[''] before:absolute before:top-[14px] before:right-[13px] before:w-[9px] before:h-[9px] before:border-l-[2px] before:border-l-primaryColor before:border-b-[2px] before:border-b-primaryColor before:rotate-[-45deg] after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-primaryColor after:opacity-10 after:rounded-[10px]"
            onClick={() => {
              setOpenDropdown(!openDropdown);
            }}
          >
            <div className="selected__wrapper flex items-center relative z-[2]">
              {selectedActivityType?.name ? (
                <>
                  {selectedActivityType.icon_type === 'Default' ? (
                    <Icon
                      className="highlighted !bg-transparent !w-[25px] !h-[25px] !p-[3px] !rounded-[7px] duration-500 relative top-[-1px]"
                      iconType={selectedActivityType.icon}
                    />
                  ) : (
                    customImage
                  )}
                  <span className="inline-block text-left w-[130px] sm:w-[130px] pl-[2px] whitespace-pre overflow-hidden text-ellipsis">
                    {selectedActivityType?.name}
                  </span>
                </>
              ) : (
                <span className="inline-block text-left w-[130px] sm:w-[130px] pl-[2px] whitespace-pre overflow-hidden text-ellipsis">
                  Select
                </span>
              )}
            </div>
          </button>
          {openDropdown && (
            <div className="tippy-box tippy__dropdown activityType__tippy !absolute top-[calc(100%_+_2px)] left-0 z-[2]">
              <div className="items">
                <div className="items" onClick={() => setOpenDropdown(false)}>
                  {activityTypeData.map((option, index) => (
                    <ListItem
                      key={index}
                      option={option}
                      setSelectedActivityType={setSelectedActivityType}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          {errors?.activity_type_id && errors?.activity_type_id?.message && (
            <p className="ip__Error mt-0">
              {errors?.activity_type_id?.message}
            </p>
          )}
        </div>
        {!defaultActivityType && selectedActivityType?.id ? (
          <>
            <div className="ip__Checkbox mark__as__default__activity mb-[10px]">
              <input
                type="checkbox"
                checked={!!watch('activity_type_is_default')}
                onChange={() => {
                  setValue(
                    'activity_type_is_default',
                    !watch('activity_type_is_default')
                  );
                }}
              />
              <label className="rc__Label">Mark as default activity</label>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default ActivityTypeFieldComponent;

const ListItem = ({
  setSelectedActivityType,
  option,
}: {
  option: activityTypeResponse;
  setSelectedActivityType: Dispatch<
    SetStateAction<activityTypeResponse | undefined>
  >;
}) => {
  const CustomIconType =
    option.icon_type === 'Custom' ? (
      <Image
        imgPath={option.icon}
        serverPath
        imgClassName=" w-[32px] h-[32px] i__Icon rounded-[12px]"
      />
    ) : (
      <></>
    );

  return (
    <div className="item" onClick={() => setSelectedActivityType(option)}>
      <div className="img__wrapper inline-flex items-center justify-center !w-[25px] h-[25px] bg-[#ffffff] p-[6px] rounded-full">
        {option.icon_type === 'Default' ? (
          <Icon
            className="highlighted !w-[32px] !h-[32px] p-[6px] !rounded-[7px] duration-500"
            iconType={option.icon}
          />
        ) : (
          CustomIconType
        )}
      </div>
      <div className="name w-[calc(100%_-_26px)] pl-[4px] whitespace-pre overflow-hidden text-ellipsis text-[14px] !text-primaryColor font-biotif__Medium">
        {option.name}
      </div>
    </div>
  );
};
