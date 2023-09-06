// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// ** Components **
import Button from 'components/Button';
import FormField from 'components/FormField';
import AuthCard from 'pages/auth/components/AuthCard';

// ** Redux **
import { setLogoutData } from 'redux/slices/authSlice';

// ** Types **
import {
  CompanyDetailsProps,
  OrganizationFields,
} from 'pages/auth/Register/types/register.types';

// ** Schema **
import { companyDetailsSchema } from 'pages/auth/Register/validation-schema/register.schema';

// ** Constants **
import { ORGANIZATION_CATEGORY_OPTIONS } from 'constant';
import { PUBLIC_NAVIGATION } from 'constant/navigation.constant';

const CompanyDetails = (props: CompanyDetailsProps) => {
  const {
    formData,
    setFormData,
    goToLoginPage,
    loading,
    showPrevBtn = false,
    prev: goToPrev,
  } = props;
  const { organizationName = '', organizationCategory = '' } = formData;

  // ** Hooks **
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ** Custom Hooks **
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<OrganizationFields>({
    defaultValues: { organizationName, organizationCategory },
    resolver: yupResolver(companyDetailsSchema),
  });

  const onSubmit = handleSubmit((data: OrganizationFields) => {
    setFormData(data);
  });

  return (
    <AuthCard
      showBackBtn={showPrevBtn}
      onBackBtnClicked={goToPrev}
      title="Create Account"
      subTitle="Please provide necessary Details to Complete the Sign Up Process"
    >
      <form onSubmit={onSubmit}>
        <FormField<OrganizationFields>
          type="text"
          name="organizationName"
          label="Company Name"
          placeholder="Enter Company Name"
          register={register}
          error={errors?.organizationName}
          fieldLimit={100}
          required
        />
        <FormField<OrganizationFields>
          id="organizationCategory"
          placeholder="Select Category"
          type="select"
          name="organizationCategory"
          label="Company Category"
          control={control}
          error={errors.organizationCategory}
          options={ORGANIZATION_CATEGORY_OPTIONS}
        />
        <Button
          className="w-full mt-[30px]"
          type="submit"
          icon="plusFilled"
          isLoading={loading}
        >
          Continue
        </Button>
      </form>
      <p className="text-center text-ipDashboardMediumDarkText text-[18px] font-biotif__Regular mb-0 mt-[30px]">
        Go Back to &nbsp;
        <span
          onClick={() =>
            goToLoginPage
              ? goToLoginPage()
              : (dispatch(setLogoutData()), navigate(PUBLIC_NAVIGATION.login))
          }
          className="text-ip__Orange hover:underline font-biotif__Medium cursor-pointer"
        >
          Login
        </span>
      </p>
    </AuthCard>
  );
};

export default CompanyDetails;
