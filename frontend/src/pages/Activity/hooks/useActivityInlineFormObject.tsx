// ** import packages ** //
import {
  Control,
  FieldErrors,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { format } from 'date-fns-tz';
// ** components ** //
import FormField from 'components/FormField';
import {
  ActivityFormObject,
  ActivityResponseType,
  AddInlineActivityFormFields,
} from '../types/activity.types';
import { components } from 'react-select';
import { ACTIVITY_AVAILABILITY } from 'constant';
import {
  useGetUserOptions,
  useGetUserOrDescendantUserOptions,
} from 'pages/Setting/user-setting/User/hooks/useUserService';
import {
  BasicPermissionTypes,
  ModuleNames,
} from 'constant/permissions.constant';
import { getCurrentUser } from 'redux/slices/authSlice';
import { useSelector } from 'react-redux';
import { useGetAccountsRelatedToContactOptions } from 'pages/Account/hooks/useAccountService';
import { useGetAccountContactOptionsForSearchInLeadDeal } from 'pages/Contact/hooks/useContactService';
import { useCallback, useEffect, useRef, useState } from 'react';
// import { DuplicateFieldModalType } from 'components/Modal/DuplicateFieldWarningModal/types/index.types';
import {
  useGetActivityType,
  useGetAllLeadOrDealOptions,
} from './useActivityService';
import ContactWithJobRoleOption from 'pages/Contact/components/ContactWithJobRoleOption';
import SingleValueComponent from 'pages/Contact/components/SingleValueComponent';
import ReactGoogleAutocomplete from 'react-google-autocomplete';
import { REACT_APP_GOOGLE_MAP_API_KEY } from 'config';
import TimePicker from 'components/CustomTimePicker/components/TimePicker';
import { generateCustomizeDate } from '../helper/dateAndTime.helper';
import { OPTION_LISTING_DATA_LIMIT } from 'constant/dataLimit.constant';

interface ActivityFormProps {
  control: Control<AddInlineActivityFormFields>;
  errors: FieldErrors<AddInlineActivityFormFields>;
  register: UseFormRegister<AddInlineActivityFormFields>;
  watch: UseFormWatch<AddInlineActivityFormFields>;
  setValue: UseFormSetValue<AddInlineActivityFormFields>;
  setError: UseFormSetError<AddInlineActivityFormFields>;
  clearErrors: UseFormClearErrors<AddInlineActivityFormFields>;
  getValues: UseFormGetValues<AddInlineActivityFormFields>;
  setIsKeyDownCreatable: (value: React.SetStateAction<boolean>) => void;
  activityDetail: ActivityResponseType;
  isKeyDownCreatableRef: React.MutableRefObject<any>;
}
const useActivityInlineFormObject = (formProps: ActivityFormProps) => {
  const descRef = useRef<HTMLDivElement>(null);

  const {
    errors,
    register,
    control,
    watch,
    activityDetail,
    setValue,
    setError,
    clearErrors,
  } = formProps;

  // Watch Form Fields
  // const leadDealWatch = watch('activity_lead_id');
  const watchContact = watch('activity_contact');
  const watchAccount = watch('activity_account');

  // Assign To
  const {
    userOrDescendantUserOptions,
    isDescendantUsersLoading,
    isUsersLoading: isAssignedToUserLoading,
  } = useGetUserOrDescendantUserOptions({
    module: ModuleNames.ACTIVITY,
    type: activityDetail
      ? BasicPermissionTypes.UPDATE
      : BasicPermissionTypes.CREATE,
  });
  // Assign To Default Option
  const currentUser = useSelector(getCurrentUser);
  const assignToDefaultUserOption = activityDetail?.assigned_to?.id
    ? [
        {
          label: `${activityDetail?.assigned_to?.first_name} ${activityDetail?.assigned_to?.last_name}`,
          value: activityDetail?.assigned_to?.id,
        },
      ]
    : currentUser?.id
    ? [
        {
          label: `${currentUser?.first_name} ${currentUser?.last_name}`,
          value: currentUser?.id,
        },
      ]
    : [];

  // Lead Deal Options
  const { getAllLeadAndDealOptions, isAllLeadAndDealLoading } =
    useGetAllLeadOrDealOptions();
  // Lead Deal Default Option
  const LeadDealDefaultOption = activityDetail?.activity_lead
    ? [
        {
          label: `${activityDetail?.activity_lead?.name}`,
          value: activityDetail?.activity_lead.id,
        },
      ]
    : [];
  // Lead Deal Option Component
  const LeadDealListItem = useCallback(({ data, ...OptionProps }: any) => {
    return (
      <components.Option {...OptionProps}>
        <div className="flex flex-wrap">
          <p className="w-[calc(100%_-_80px)] pr-[10px]">{data?.label || ''}</p>
          <p className="w-[80px] text-right">
            {data?.is_deal ? 'Deal' : 'Lead'}
          </p>
        </div>
      </components.Option>
    );
  }, []);

  // Account options
  const {
    getGetAccountsRelatedToContactOptions,
    isAccountsRelatedToContactLoading,
  } = useGetAccountsRelatedToContactOptions({
    watchContact,
  });
  // Account Default Option
  const AccountDefaultOption = activityDetail?.activity_account?.id
    ? [
        {
          label: activityDetail.activity_account.name,
          value: activityDetail.activity_account.id,
        },
      ]
    : [];

  // Contact Options
  const { getAccountContactOptions, isAccountContactsLoading } =
    useGetAccountContactOptionsForSearchInLeadDeal({
      emailWithLabel: true,
      watchAccount,
    });
  // Contact Default Option
  const ContactDefaultOption = activityDetail?.activity_contact
    ? [
        {
          label: activityDetail?.activity_contact.name,
          value: activityDetail?.activity_contact.id,
        },
      ]
    : [];

  // Activity Type options
  const { getActivityTypeOptions, isActivityTypeLoading } =
    useGetActivityType();
  // Activity Type Default option
  const ActivityTypeDefaultOption = activityDetail.activity_type
    ? [
        {
          label: activityDetail.activity_type.name,
          value: activityDetail.activity_type.id,
        },
      ]
    : [];

  // Activity Collaborators Options
  const { getUserOptions, isUsersLoading } = useGetUserOptions({});
  // Activity Collaborators Default Options
  const ActivityCollaboratorsDefaultOption = activityDetail
    ?.activity_collaborators?.length
    ? activityDetail?.activity_collaborators?.map(
        (val: {
          user: {
            first_name: string;
            last_name: string;
            id: number;
          };
        }) => {
          return {
            label: `${val?.user?.first_name} ${val?.user?.last_name}`,
            value: val?.user?.id,
          };
        }
      )
    : [];

  //
  const [anyTimeEnable, setAnyTimeEnable] = useState<boolean>(false);
  const timePickerOnChange = (time: string) => {
    if (time) {
      if (time?.length < 8) {
        setError('start_time', { message: 'Invalid Date' });
        return false;
      }
      clearErrors('start_time');
      const separateTime = time?.split(':');
      const minutes = parseInt(separateTime[1]?.split(' ')[0], 10);
      const hourFormat = separateTime[1]?.split(' ')[1]?.toUpperCase();
      let hours = parseInt(separateTime[0], 10);
      if (hours === 12) {
        hours = 0;
      }
      if (hourFormat === 'PM') {
        hours += 12;
      }
      const startDate = generateCustomizeDate(
        new Date(activityDetail.start_date),
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          hours,
          minutes
        )
      );
      if (activityDetail.start_date === startDate.toISOString()) {
        return startDate.toISOString();
      }
      setValue('start_date', startDate);
      setValue('start_time', startDate.toISOString());
    }
    return '';
  };

  useEffect(() => {
    descRef?.current?.querySelector('textarea')?.focus();
  });

  const formObject: ActivityFormObject = {
    information: {
      start_time: (
        <TimePicker
          anyTimeEnable={anyTimeEnable}
          setAnyTimeEnable={setAnyTimeEnable}
          use12Hours
          onChange={timePickerOnChange}
          value={
            activityDetail.start_date
              ? format(new Date(activityDetail.start_date), 'hh:mm aa')
              : ''
          }
          separator={false}
        />
      ),
      location: (
        <ReactGoogleAutocomplete
          apiKey={REACT_APP_GOOGLE_MAP_API_KEY}
          defaultValue={[activityDetail?.location_details?.label || '']}
          className="ip__input undefined"
          options={{
            types: [],
            fields: [
              'address_components',
              'formatted_address',
              'geometry',
              'name',
            ],
          }}
          onPlaceSelected={async (place) => {
            const lat = place?.geometry?.location?.lat();
            const lng = place?.geometry?.location?.lng();

            if (lat && lng) {
              setValue('location', {
                position: {
                  lat,
                  lng,
                },
                title: `${place?.formatted_address}`,
              });
            }
          }}
        />
      ),
      activity_collaborators: (
        <FormField<AddInlineActivityFormFields>
          id="activity_collaborators"
          placeholder="Select Collaborators"
          type="asyncSelect"
          name="activity_collaborators"
          label=""
          isMulti
          control={control}
          error={errors?.activity_collaborators}
          getOptions={getUserOptions}
          isLoading={isUsersLoading}
          defaultOptions={ActivityCollaboratorsDefaultOption}
          menuPlacement="top"
          menuPosition="absolute"
        />
      ),
      topic: (
        <FormField<AddInlineActivityFormFields>
          type="text"
          label=""
          placeholder="Type Something"
          name="topic"
          fieldLimit={5000}
          register={register}
          error={errors?.topic}
        />
      ),
      agenda: (
        <div ref={descRef}>
          <FormField<AddInlineActivityFormFields>
            type="textarea"
            label=""
            placeholder="Type Something"
            name="agenda"
            fieldLimit={5000}
            register={register}
            error={errors?.agenda}
          />
        </div>
      ),
      start_date: (
        <FormField<AddInlineActivityFormFields>
          type="date"
          wrapperClass="withoutIcon__datepicker"
          label=""
          placeholder="Call"
          name="start_date"
          control={control}
          register={register}
          error={errors.start_date}
        />
      ),
      activity_type_id: (
        <FormField<AddInlineActivityFormFields>
          id="activity_lead_id"
          placeholder="Select Type"
          type="asyncSelect"
          name="activity_type_id"
          label=""
          serveSideSearch
          menuPosition="absolute"
          menuPlacement="auto"
          isClearable
          control={control}
          error={errors?.activity_type_id}
          getOptions={getActivityTypeOptions}
          isLoading={isActivityTypeLoading}
          defaultOptions={ActivityTypeDefaultOption}
          // OptionComponent={LeadDealListItem}
        />
      ),
      activity_account: (
        <FormField<AddInlineActivityFormFields>
          id="activity_account"
          placeholder="Search Or Enter Account"
          type="CreatableAsyncSelectFormFieldForSearch"
          serveSideSearch
          name="activity_account"
          label=""
          menuPosition="absolute"
          menuPlacement="auto"
          control={control}
          isClearable
          error={errors.activity_account}
          getOptions={getGetAccountsRelatedToContactOptions}
          isLoading={isAccountsRelatedToContactLoading}
          defaultOptions={AccountDefaultOption}
          inputMaxLength={50}
          limit={OPTION_LISTING_DATA_LIMIT}
        />
      ),
      activity_lead_id: (
        <FormField<AddInlineActivityFormFields>
          id="activity_lead_id"
          placeholder="Select Deal Or Lead"
          type="asyncSelect"
          name="activity_lead_id"
          label=""
          serveSideSearch
          menuPosition="absolute"
          menuPlacement="auto"
          isClearable
          control={control}
          error={errors?.activity_lead_id}
          getOptions={getAllLeadAndDealOptions}
          isLoading={isAllLeadAndDealLoading}
          defaultOptions={LeadDealDefaultOption}
          OptionComponent={LeadDealListItem}
        />
      ),
      activity_contact: (
        <>
          <FormField<AddInlineActivityFormFields>
            id="activity_contact"
            placeholder="Search Or Enter Contact"
            type="CreatableAsyncSelectFormFieldForSearch"
            name="activity_contact"
            label=""
            isClearable
            control={control}
            error={errors.activity_contact}
            serveSideSearch
            getOptions={getAccountContactOptions}
            isLoading={isAccountContactsLoading}
            menuPosition="absolute"
            menuPlacement="auto"
            defaultOptions={ContactDefaultOption}
            singleValueComponent={SingleValueComponent}
            OptionComponent={ContactWithJobRoleOption}
            limit={OPTION_LISTING_DATA_LIMIT}
          />
        </>
      ),
      assigned_to_id: (
        <FormField<AddInlineActivityFormFields>
          id="assigned_to_id"
          placeholder="Select Assigned To"
          type="asyncSelect"
          name="assigned_to_id"
          label="Assigned To"
          icon="userProfileFilledIcon"
          iconPosition="left"
          labelClass="if__label__blue"
          menuPosition="absolute"
          menuPlacement="auto"
          control={control}
          error={errors?.assigned_to_id}
          isLoading={isDescendantUsersLoading || isAssignedToUserLoading}
          getOptions={userOrDescendantUserOptions}
          defaultOptions={assignToDefaultUserOption}
        />
      ),
      availability: (
        <FormField<AddInlineActivityFormFields>
          id="availability"
          placeholder="Availability"
          type="select"
          name="availability"
          control={control}
          error={errors?.availability}
          options={ACTIVITY_AVAILABILITY}
          menuPlacement="bottom"
          menuPosition="absolute"
        />
      ),
      duration: (
        <FormField<AddInlineActivityFormFields>
          type="text"
          label=""
          placeholder="Type Something"
          name="duration"
          fieldLimit={5000}
          control={control}
          register={register}
          error={errors?.duration}
        />
      ),
    },
  };
  return { formObject };
};

export default useActivityInlineFormObject;
