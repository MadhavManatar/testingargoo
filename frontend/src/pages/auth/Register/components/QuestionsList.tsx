// ** Import Packages **
import { useForm } from 'react-hook-form';

// ** Components **
import Button from 'components/Button';
import FormField from 'components/FormField';
import AuthCard from 'pages/auth/components/AuthCard';

// ** Type **
import {
  CompanyQuestionsFields,
  QuestionsListProps,
} from 'pages/auth/Register/types/register.types';

const QuestionsList = (props: QuestionsListProps) => {
  const { questionSubmitted, goToLoginPage } = props;

  // ** Custom Hooks **
  const {
    formState: { errors },
    control,
  } = useForm<CompanyQuestionsFields>();

  return (
    <AuthCard
      title="Questions"
      subTitle="Please select from options below that match profile of your organization"
    >
      <FormField<CompanyQuestionsFields>
        id="industry"
        placeholder="Select Industry"
        type="select"
        name="industry"
        label="Industry"
        control={control}
        error={errors.industry}
        options={[
          { label: 'Select Options', value: '' },
          { label: 'Select Options 2', value: 'select-options2' },
          { label: 'Select Options 3', value: 'select-options3' },
        ]}
      />
      <FormField<CompanyQuestionsFields>
        id="organizationSize"
        placeholder="Select Organization Size"
        type="select"
        name="organizationSize"
        label="Organization Size"
        control={control}
        error={errors.organizationSize}
        options={[
          { label: 'Select Options', value: '' },
          { label: 'Select Options 2', value: 'select-options3' },
          { label: 'Select Options 3', value: 'select-options4' },
        ]}
      />
      <Button
        className="i__Button w-full mt-[20px] mb-[20px]"
        onClick={() => questionSubmitted()}
      >
        Continue
      </Button>
      {goToLoginPage ? (
        <p className="text-center text-ipDashboardMediumDarkText text-[18px] font-biotif__Regular mb-0 mt-[30px]">
          Go Back to&nbsp;
          <span
            onClick={goToLoginPage}
            className="text-ip__Orange hover:underline font-biotif__Medium cursor-pointer"
          >
            Login
          </span>
        </p>
      ) : null}
    </AuthCard>
  );
};

export default QuestionsList;
