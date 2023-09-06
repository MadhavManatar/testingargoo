// =================== import packages ==================
import { useFormContext } from 'react-hook-form';
// ======================================================
import FormField from 'components/FormField';
import { CompanySettingsFormFields } from 'pages/Setting/general-setting/CompanyDetails/types/company-settings.types';
import { ORGANIZATION_CATEGORY_OPTIONS } from 'constant';
import { maskInputRegex } from 'constant/regex.constant';

const CompanyBasicDetails = () => {
  // ===================== Hooks =======================
  const methods = useFormContext<CompanySettingsFormFields>();
  const {
    register,
    formState: { errors },
    control,
  } = methods;

  return (
    <div className="mb-[30px] mt-[30px] md:mb-[20px] md:mt-[20px]">
      <h3 className="setting__FieldTitle">Business Information</h3>
      <div className="mx-[-30px] flex flex-wrap xl:mx-[-15px] lg:mx-[-10px]">
        <div className="w-1/2 px-[30px] xl:px-[15px] lg:px-[10px] sm:w-full">
          <FormField<CompanySettingsFormFields>
            type="text"
            name="name"
            required
            label="Business Name"
            labelClass="if__label__blue"
            placeholder="Business Name"
            register={register}
            error={errors.name}
            fieldLimit={50}
          />
        </div>
        <div className="w-1/2 px-[30px] xl:px-[15px] lg:px-[10px] sm:w-full">
          <FormField<CompanySettingsFormFields>
            id="organizationCategory"
            placeholder="Select Category"
            type="select"
            name="organization_category"
            label="Company Category"
            labelClass="if__label__blue"
            control={control}
            error={errors.organization_category}
            options={ORGANIZATION_CATEGORY_OPTIONS}
          />
        </div>
      </div>
      <div className="mx-[-30px] flex flex-wrap xl:mx-[-15px] lg:mx-[-10px]">
        <div className="w-1/2 px-[30px] xl:px-[15px] lg:px-[10px] sm:w-full">
          <FormField<CompanySettingsFormFields>
            type="text"
            name="email"
            required
            label="Business Email"
            labelClass="if__label__blue"
            placeholder="Business Email"
            register={register}
            error={errors.email}
            fieldLimit={50}
          />
        </div>
        <div className="w-1/2 px-[30px] xl:px-[15px] lg:px-[10px] sm:w-full">
          <FormField<CompanySettingsFormFields>
            type="mask_input"
            maskInputType="mask_input_phone"
            name="phone"
            label="Business Phone"
            required
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
          <FormField<CompanySettingsFormFields>
            type="text"
            name="website"
            label="Business Website"
            labelClass="if__label__blue"
            placeholder="Business Website"
            register={register}
            error={errors.website}
            fieldLimit={50}
          />
        </div>
        <div className="w-1/2 px-[30px] xl:px-[15px] lg:px-[10px] sm:w-full">
          <FormField<CompanySettingsFormFields>
            type="mask_input"
            maskInputType="mask_input_phone"
            name="mobile"
            label="Business Mobile"
            labelClass="if__label__blue"
            placeholder="EX. (XXX) XXX-XXXX"
            register={register}
            error={errors.mobile}
            control={control}
            mask={maskInputRegex}
            inputMode="numeric"
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyBasicDetails;
