// ** Components **
import Address from 'components/Address';
import FormField from 'components/FormField';

// ** Hooks **
import { useGetProfileOptions } from '../../ProfilePermissions/hooks/useProfileService';
import { useGetReportsToOptions } from '../hooks/useUserService';
import { useGetTimeZoneList } from 'components/Address/hooks/useAddressService';

// ** Types **
import { AddUserFormFields, UserFormPropsType } from '../types/user.types';

// ** Constants **
import { maskInputRegex } from 'constant/regex.constant';
import { isOrganizationOwner, isSelfId } from 'utils/is';

// ** Utils **
import { hasPermissionForChangeUser } from 'utils/has';
import { checkInputIsNumber } from 'utils/util';
import { useEffect, useRef } from 'react';
import { focusOnError } from 'helper';

const UserForm = (props: UserFormPropsType) => {
  const {
    control,
    errors,
    register,
    roles,
    id,
    reportTo,
    verifiedUser,
    userId = null,
    timezone,
    addressOptions,
    setAddressOptions,
  } = props;

  // ** states **

  const defaultTimezone = {
    label: timezone || 'America/New_York',
    value: timezone || 'America/New_York',
  };
  const errorDivRef = useRef<Record<string, HTMLDivElement | null>>({});
  useEffect(() => {
    focusOnError(errorDivRef, errors);
  }, [errors]);

  const hasPermissionForUserChange = hasPermissionForChangeUser(
    userId,
    roles?.[0]?.name
  );
  const isSelfUser = isSelfId(id);

  // ** DISABLE UPDATE PERMISSION FOR SELF PROFILE AND SUPER ADMIN PROFILE.
  const hasReportToAndProfilePermission =
    !hasPermissionForUserChange && !!id && isSelfUser;

  // ** Custom hooks **

  const { getReportsToOptions, isReportOptionsLoading } =
    useGetReportsToOptions(userId);
  const { getTimezoneList, isTimeZoneListLoading } = useGetTimeZoneList();

  const handelClick = async () => {
    return getReportsToOptions() || [];
  };

  const { getProfileOptions, isProfilesLoading } = useGetProfileOptions();

  return (
    <>
      <div className="mx-[-10px] flex flex-wrap">
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddUserFormFields>
            required
            type="text"
            name="first_name"
            label="First Name"
            labelClass="if__label__blue"
            placeholder="Enter Your First Name"
            autoComplete="new-password"
            register={register}
            fieldLimit={50}
          />
          <div ref={(element) => (errorDivRef.current.first_name = element)}>
            {errors?.first_name && (
              <p className="ip__Error">{errors?.first_name?.message}</p>
            )}
          </div>
        </div>
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddUserFormFields>
            required
            type="text"
            name="last_name"
            label="Last Name"
            labelClass="if__label__blue"
            placeholder="Enter Your Last Name"
            autoComplete="new-password"
            register={register}
            fieldLimit={50}
          />
          <div ref={(element) => (errorDivRef.current.last_name = element)}>
            {errors?.last_name && (
              <p className="ip__Error">{errors?.last_name?.message}</p>
            )}
          </div>
        </div>
      </div>
      <div className="mx-[-10px] flex flex-wrap">
        <div className="w-1/2 px-[10px] sm:w-full">
          <FormField<AddUserFormFields>
            required
            type="text"
            name="email"
            label="Email"
            autoComplete="new-password"
            labelClass="if__label__blue"
            placeholder="Enter Your Email Address"
            register={register}
            fieldLimit={60}
            disabled={Boolean(verifiedUser)}
          />
          <div ref={(element) => (errorDivRef.current.email = element)}>
            {errors?.email && (
              <p className="ip__Error">{errors?.email?.message}</p>
            )}
          </div>
        </div>
        <div className="w-1/2 px-[10px] sm:w-full">
          <FormField<AddUserFormFields>
            type="mask_input"
            maskInputType="mask_input_phone"
            name="phone"
            label="Phone"
            labelClass="if__label__blue"
            placeholder="EX. (XXX) XXX-XXXX"
            register={register}
            error={errors?.phone}
            control={control}
            mask={maskInputRegex}
            inputMode="numeric"
          />
        </div>
      </div>
      <div className="mx-[-10px] flex flex-wrap">
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddUserFormFields>
            type="mask_input"
            maskInputType="mask_input_phone"
            name="mobile"
            label="Mobile No."
            labelClass="if__label__blue"
            placeholder="EX. (XXX) XXX-XXXX"
            register={register}
            error={errors?.mobile}
            control={control}
            mask={maskInputRegex}
            inputMode="numeric"
          />
        </div>
        <div className="w-1/2 px-[10px] sm:w-full">
          <FormField<AddUserFormFields>
            type="date"
            name="birth_date"
            showYearDropdown
            showMonthDropdown
            maxDate={new Date()}
            label="Date Of Birth"
            labelClass="if__label__blue"
            placeholder="MM-DD-YYYY"
            register={register}
            control={control}
            error={errors?.birth_date}
          />
        </div>
      </div>
      {id && isOrganizationOwner(id) ? null : (
        <div className="mx-[-10px] flex flex-wrap">
          <div className="w-1/2 px-[10px] sm:w-full">
            <FormField<AddUserFormFields>
              disabled={hasReportToAndProfilePermission}
              id="report_to"
              wrapperClass={
                hasReportToAndProfilePermission ? 'ip__disabled' : ''
              }
              placeholder="Select Report To"
              type="asyncSelect"
              serveSideSearch
              name="report_to"
              label="Report To"
              labelClass="if__label__blue"
              control={control}
              error={errors?.report_to}
              menuPosition="absolute"
              getOptions={() => handelClick()}
              isLoading={isReportOptionsLoading}
              defaultOptions={
                reportTo?.user_reporter.id
                  ? [
                      {
                        label: reportTo?.user_reporter.full_name,
                        value: reportTo?.user_reporter.id,
                        selected: true,
                      },
                    ]
                  : []
              }
              menuPlacement="auto"
            />
          </div>

          <div className="w-1/2 px-[10px] sm:w-full">
            <FormField<AddUserFormFields>
              required
              disabled={hasReportToAndProfilePermission}
              wrapperClass={
                hasReportToAndProfilePermission ? 'ip__disabled' : ''
              }
              id="profile"
              type="asyncSelect"
              serveSideSearch
              name="role"
              label="Profile"
              labelClass="if__label__blue"
              control={control}
              menuPosition="absolute"
              getOptions={getProfileOptions}
              isLoading={isProfilesLoading}
              defaultOptions={
                roles?.[0]?.id
                  ? [
                      {
                        label: `${roles[0].name}`,
                        value: `${roles[0].id}`,
                        selected: true,
                      },
                    ]
                  : []
              }
              menuPlacement="auto"
            />
            <div ref={(element) => (errorDivRef.current.role = element)}>
              {errors?.role && (
                <p className="ip__Error">{errors?.role?.message}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mx-[-10px] flex flex-wrap">
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddUserFormFields>
            type="text"
            name="fax"
            label="Fax"
            labelClass="if__label__blue"
            placeholder="Fax"
            onKeyDown={checkInputIsNumber}
            register={register}
            inputMode="numeric"
            error={errors?.fax}
            fieldLimit={15}
          />
        </div>
        <div className="w-1/2 px-[10px] sm:w-full">
          <FormField<AddUserFormFields>
            type="text"
            name="website"
            label="Website"
            labelClass="if__label__blue"
            placeholder="Enter Website"
            register={register}
            control={control}
            error={errors?.website}
            fieldLimit={50}
          />
        </div>
        <div className="w-1/2 px-[10px] sm:w-full">
          <FormField<AddUserFormFields>
            id="timezone"
            placeholder="Select TimeZone"
            key={defaultTimezone?.value}
            type="asyncSelect"
            menuPosition="absolute"
            menuPlacement="auto"
            name="timezone"
            labelClass="if__label__blue"
            control={control}
            error={errors?.timezone}
            isLoading={isTimeZoneListLoading}
            defaultOptions={[defaultTimezone]}
            getOptions={getTimezoneList}
          />
        </div>
      </div>

      <div className="mt-[15px]">
        <h3 className="setting__FieldTitle">Address</h3>
        <Address
          setAddressOptions={setAddressOptions}
          addressOptions={addressOptions}
        />
      </div>
      <div className="mt-[15px]">
        <h3 className="setting__FieldTitle">Social Media Profiles</h3>
        <div className="mx-[-10px] flex flex-wrap">
          <div className="w-1/2 px-[10px] sm:w-full">
            <FormField<AddUserFormFields>
              type="text"
              name="facebook"
              label="Facebook"
              labelClass="if__label__blue"
              register={register}
              error={errors?.facebook}
            />
          </div>
          <div className="w-1/2 px-[10px] sm:w-full">
            <FormField<AddUserFormFields>
              type="text"
              name="twitter"
              label="Twitter"
              labelClass="if__label__blue"
              register={register}
              error={errors?.twitter}
            />
          </div>
          <div className="w-1/2 px-[10px] sm:w-full">
            <FormField<AddUserFormFields>
              type="text"
              name="linkedin"
              label="LinkedIn"
              labelClass="if__label__blue"
              register={register}
              error={errors?.linkedin}
            />
          </div>
        </div>
      </div>
      <div className="mt-[15px]">
        <h3 className="setting__FieldTitle">User Signature</h3>
        <FormField<AddUserFormFields>
          type="richTextEditor"
          name="user_signature"
          error={errors?.user_signature}
          register={register}
        />
      </div>
    </>
  );
};

export default UserForm;
