// =================== import packages ==================
import { useFormContext } from 'react-hook-form';
// ======================================================
import FormField from 'components/FormField';
import { PersonalSettingsFormFields } from 'pages/Setting/general-setting/PersonalSettings/types/personal-settings.types';

const SocialDetails = () => {
  
 // ================= Custom hooks =============
  const methods = useFormContext<PersonalSettingsFormFields>();

  const {
    register,
    formState: { errors },
  } = methods;

  return (
    <div>
      <div className="mb-[30px] md:mb-[20px]">
        <h3 className="setting__FieldTitle">Social Media Profiles</h3>
        <div className="mx-[-30px] flex flex-wrap xl:mx-[-15px] lg:mx-[-10px]">
          <div className="w-1/2 px-[30px] xl:px-[15px] lg:px-[10px] sm:w-full">
            <FormField<PersonalSettingsFormFields>
              type="text"
              name="facebook"
              label="FaceBook"
              labelClass='if__label__blue'
              register={register}
              error={errors.facebook}
            />
          </div>
          <div className="w-1/2 px-[30px] xl:px-[15px] lg:px-[10px] sm:w-full">
            <FormField<PersonalSettingsFormFields>
              type="text"
              name="linkedin"
              label="LinkedIn"
              labelClass='if__label__blue'
              register={register}
              error={errors.linkedin}
            />
          </div>
          <div className="w-1/2 px-[30px] xl:px-[15px] lg:px-[10px] sm:w-full">
            <FormField<PersonalSettingsFormFields>
              type="text"
              name="twitter"
              label="Twitter"
              labelClass='if__label__blue'
              register={register}
              error={errors.twitter}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialDetails;
