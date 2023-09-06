// ** Import Packages **
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

// ** components **
import FileUpload from 'components/FileUpload';
import FormField from 'components/FormField';

// ** types **
import { Option } from 'components/FormField/types/formField.types';
import { PersonalSettingsFormFields } from 'pages/Setting/general-setting/PersonalSettings/types/personal-settings.types';

// ** services **
import { useGetTimeZoneList } from 'components/Address/hooks/useAddressService';

// ** Constants **
import { DATE_FORMAT_ARRAY } from 'constant';
import { maskInputRegex } from 'constant/regex.constant';

// ** Util **
import { checkInputIsNumber } from 'utils/util';
import { useLazyUseGetProfilesQuery } from 'redux/api/profileApi';
import { useLazyGetAllUserQuery } from 'redux/api/userApi';

interface Props {
  currentUser: boolean;
  defaultTimezone: Option;
  profileImg: string | File;
  setProfileImg: React.Dispatch<React.SetStateAction<string | File>>;
  onFileSelect: React.ChangeEventHandler<HTMLInputElement>;
}

const PersonalDetails = ({
  currentUser,
  defaultTimezone,
  profileImg,
  setProfileImg,
  onFileSelect,
}: Props) => {
  let abortFlag = false;

  // ================= State ====================
  const [profileOptions, setProfileOptions] = useState([]);
  const [reportOptions, setReportOptions] = useState([]);

  // ================= APIS ====================
  const [getUsersAPI] = useLazyGetAllUserQuery();
  const [getProfilesAPI] = useLazyUseGetProfilesQuery();
  const { getTimezoneList, isTimeZoneListLoading } = useGetTimeZoneList();

  const getProfileDetail = async () => {
    const data = await getProfilesAPI({});
    const { rows } = data.data;
    if (!('error' in data) && rows && !abortFlag) {
      const tempOption = rows.map((el: { name: string; id: number }) => ({
        label: el.name,
        value: el.id,
      }));
      setProfileOptions(tempOption);
    }
  };

  const getReportsToDetail = async () => {
    const data = await getUsersAPI(
      {
        params: { limit: 100 },
      },
      true
    );

    if ('data' in data && !abortFlag) {
      const tempOption = data.data.rows.map(
        (el: { first_name?: string; last_name?: string; id: number }) => ({
          label: `${el.first_name || ''} ${el.last_name || ''}`,
          value: el.id,
        })
      );
      setReportOptions(tempOption);
    }
  };

  useEffect(() => {
    Promise.all([getProfileDetail(), getReportsToDetail()]).catch();
    return () => {
      abortFlag = true;
    };
  }, []);

  const methods = useFormContext<PersonalSettingsFormFields>();
  const {
    register,
    control,
    formState: { errors },
  } = methods;

  return (
    <div className="mb-[30px] mt-[30px] md:mb-[20px] md:mt-[15px]">
      <h3 className="setting__FieldTitle">Personal Information</h3>
      <div className="upload__File mb-[20px]">
        <FileUpload
          error={errors.profile_image}
          setFileObjectCb={setProfileImg}
          image={profileImg}
          onFileChange={onFileSelect}
          fileUploadText="Upload Image"
        />
      </div>
      <div className="mx-[-30px] flex flex-wrap xl:mx-[-15px] lg:mx-[-10px]">
        <div className="w-1/2 px-[30px] xl:px-[15px] lg:px-[10px] sm:w-full">
          <FormField<PersonalSettingsFormFields>
            type="text"
            required
            name="first_name"
            label="First Name"
            labelClass="if__label__blue"
            placeholder="First Name"
            register={register}
            error={errors.first_name}
            fieldLimit={50}
          />
        </div>
        <div className="w-1/2 px-[30px] xl:px-[15px] lg:px-[10px] sm:w-full">
          <FormField<PersonalSettingsFormFields>
            type="text"
            name="last_name"
            required
            label="Last Name"
            labelClass="if__label__blue"
            autoComplete="new-password"
            placeholder="Last Name"
            register={register}
            error={errors.last_name}
            fieldLimit={50}
          />
        </div>
      </div>
      <div className="mx-[-30px] flex flex-wrap xl:mx-[-15px] lg:mx-[-10px]">
        <div className="w-1/2 px-[30px] xl:px-[15px] lg:px-[10px] sm:w-full">
          <FormField<PersonalSettingsFormFields>
            type="mask_input"
            maskInputType="mask_input_phone"
            name="mobile"
            label="Mobile Number"
            labelClass="if__label__blue"
            placeholder="EX. (XXX) XXX-XXXX"
            register={register}
            error={errors.mobile}
            control={control}
            mask={maskInputRegex}
            inputMode="numeric"
          />
        </div>
        <div className="w-1/2 px-[30px] xl:px-[15px] lg:px-[10px] sm:w-full">
          <FormField<PersonalSettingsFormFields>
            type="mask_input"
            maskInputType="mask_input_phone"
            name="phone"
            label="Phone Number"
            labelClass="if__label__blue"
            placeholder="EX. (XXX) XXX-XXXX"
            register={register}
            error={errors.phone}
            control={control}
            mask={maskInputRegex}
            inputMode="numeric"
          />
        </div>
      </div>
      <div className="mx-[-30px] flex flex-wrap xl:mx-[-15px] lg:mx-[-10px]">
        <div className="w-1/2 px-[30px] xl:px-[15px] lg:px-[10px] sm:w-full">
          <FormField<PersonalSettingsFormFields>
            type="text"
            name="email"
            label="Email"
            labelClass="if__label__blue"
            placeholder="Email"
            register={register}
            error={errors.email}
            fieldLimit={50}
            disabled
          />
        </div>
        <div className="w-1/2 px-[30px] xl:px-[15px] lg:px-[10px] sm:w-full">
          <FormField<PersonalSettingsFormFields>
            id="date_format"
            placeholder="Select Date Format"
            type="select"
            name="date_format"
            label="Date Format"
            labelClass="if__label__blue"
            control={control}
            error={errors.date_format}
            options={DATE_FORMAT_ARRAY}
          />
        </div>
        <div className="w-1/2 px-[30px] xl:px-[15px] lg:px-[10px] sm:w-full">
          <FormField<PersonalSettingsFormFields>
            id="timezone"
            placeholder="Select TimeZone"
            key={defaultTimezone?.value}
            type="asyncSelect"
            menuPlacement="bottom"
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
      <div className="mx-[-30px] flex flex-wrap xl:mx-[-15px] lg:mx-[-10px]">
        <div className="w-1/2 px-[30px] xl:px-[15px] lg:px-[10px] sm:w-full">
          {/* <div className={`${currentUser ? 'ip__disabled' : ''}`}> */}
          <FormField<PersonalSettingsFormFields>
            wrapperClass={`${currentUser ? 'ip__disabled' : ''}`}
            disabled
            id="profile"
            options={profileOptions}
            type="select"
            name="role"
            label="Profile"
            labelClass="if__label__blue"
            control={control}
            error={errors.role}
          />
          {/* </div> */}
        </div>
        <div className="w-1/2 px-[30px] xl:px-[15px] lg:px-[10px] sm:w-full">
          <FormField<PersonalSettingsFormFields>
            type="text"
            name="fax"
            label="Fax"
            labelClass="if__label__blue"
            placeholder="Fax"
            register={register}
            onKeyDown={checkInputIsNumber}
            error={errors.fax}
            fieldLimit={20}
            inputMode="numeric"
          />
        </div>
      </div>
      <div className="mx-[-30px] flex flex-wrap xl:mx-[-15px] lg:mx-[-10px]">
        <div className="w-1/2 px-[30px] xl:px-[15px] lg:px-[10px] sm:w-full">
          <FormField<PersonalSettingsFormFields>
            type="text"
            name="website"
            label="Website"
            labelClass="if__label__blue"
            placeholder="Website"
            register={register}
            error={errors.website}
            fieldLimit={50}
          />
        </div>
        <div className="w-1/2 px-[30px] xl:px-[15px] lg:px-[10px] sm:w-full">
          <FormField<PersonalSettingsFormFields>
            wrapperClass="mb-0"
            type="date"
            name="birth_date"
            showYearDropdown
            showMonthDropdown
            label="Date Of Birth"
            labelClass="if__label__blue"
            placeholder="MM-DD-YYYY"
            isClearable
            control={control}
            error={errors.birth_date}
            maxDate={new Date()}
          />
        </div>
      </div>
      {currentUser ? null : (
        <div className="mx-[-30px] flex flex-wrap xl:mx-[-15px] lg:mx-[-10px]">
          <div className="w-1/2 px-[30px] xl:px-[15px] lg:px-[10px] sm:w-full">
            <FormField<PersonalSettingsFormFields>
              id="report_to"
              placeholder="Select Report To"
              type="select"
              name="report_to"
              label="Report To"
              labelClass="if__label__blue"
              control={control}
              error={errors.report_to}
              options={reportOptions}
              disabled={currentUser}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalDetails;
