// ** Import Packages **
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// ** components **
import OrganizationForm from 'pages/auth/Login/components/OrganizationForm';
import BasicDetails from 'pages/auth/Register/components/BasicDetails';
import CompanyDetails from 'pages/auth/Register/components/CompanyDetails';
import PasswordDetails from 'pages/auth/Register/components/PasswordDetails';
import QuestionsList from 'pages/auth/Register/components/QuestionsList';
import RegisterSuccess from 'pages/auth/Register/components/RegisterSuccess';
import VerifyEmail from 'pages/auth/Register/components/VerifyEmail';

//  ** Redux **
import {
  getCurrentUser,
  setAuthenticated,
  setLogoutData,
  setOrganizationUUID,
  setPermissions,
  setUserData,
} from 'redux/slices/authSlice';

// ** Types **
import {
  LoginWithAppleSchema,
  OrganizationOptions,
} from 'pages/auth/Login/types/login.types';
import type { RegisterFormFields as FormData } from 'pages/auth/Register/types/register.types';

// ** Services **
import {
  useAddCompanyInfoAPI,
  useAppleLoginAPI,
  useGoogleLoginAPI,
  useRegisterAPI,
} from 'pages/auth/services/auth.service';


// ** Constants **
import { NAME_BADGE_COLOR_COMBINATIONS, REGISTER_STEP } from 'constant';
import { PUBLIC_NAVIGATION } from 'constant/navigation.constant';
import { useLazyGetLoggedUserQuery } from 'redux/api/userApi';

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  businessEmail: '',
  mobile: '',
  organizationName: '',
  organizationCategory: '',
  password: '',
  confirmPassword: '',
};

const RegisterForm = () => {
  // ** Hooks **
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(getCurrentUser);
  const steps = [...Object.values(REGISTER_STEP)] as string[];

  // ** Custom Hooks **
  const { registerAPI, isLoading: registerLoading } = useRegisterAPI();
  const { googleLoginAPI, isLoading: googleLoading } = useGoogleLoginAPI();
  const { appleLoginAPI, isLoading: appleLoading } = useAppleLoginAPI();
  const { addCompanyInfoAPI, isLoading: companyLoading } =
    useAddCompanyInfoAPI();

  let activeStep: string = REGISTER_STEP.BASIC_DETAILS;
  if (currentUser && currentUser.user_organizations?.length === 0) {
    activeStep = REGISTER_STEP.COMPANY_DETAILS;
  } else if (currentUser && !currentUser.verified) {
    activeStep = REGISTER_STEP.VERIFY_EMAIL;
  }
  const isOwnersCompanyDetailsPending =
    currentUser &&
    currentUser.is_owner &&
    currentUser.user_organizations?.length === 0;

  // ** States **
  const [isSocialLogin, setSocialLogin] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState<string>(activeStep);
  const [organizationList, setOrganizationList] = useState<
    OrganizationOptions[]
  >([]);

  // ** APIS **
  const [getLoggedInUserAPI] = useLazyGetLoggedUserQuery();

  const showBackButton = !isSocialLogin
    ? currentStep !== REGISTER_STEP.BASIC_DETAILS
    : false;

  const prevHandler = () => {
    if (steps.indexOf(currentStep) !== 0) {
      setCurrentStep(steps[steps.indexOf(currentStep) - 1]);
    }
  };

  const nextHandler = () => {
    if (steps.indexOf(currentStep) < steps.length) {
      setCurrentStep(steps[steps.indexOf(currentStep) + 1]);
    }
  };

  const handleCompanySkip = async () => {
    /* On Social Login Create company on skip */
    if (isSocialLogin || isOwnersCompanyDetailsPending) {
      const { error } = await addCompanyInfoAPI({});
      if (!error) setCurrentStep(REGISTER_STEP.QUESTION_LIST);
    } else nextHandler();
  };

  const handleCompanyData = async (companyData: FormData) => {
    if (isSocialLogin || isOwnersCompanyDetailsPending) {
      const payload = {
        organizationName: companyData.organizationName,
        organizationCategory: companyData.organizationCategory,
      };

      const { data, error } = await addCompanyInfoAPI(payload);
      if (!error && data) {
        const organizationId = data.organizations[0].uuid;
        addOrganization(organizationId);
        setCurrentStep(REGISTER_STEP.QUESTION_LIST);
      }
    } else {
      setFormData((prev) => ({ ...prev, ...companyData }));
      nextHandler();
    }
  };

  const handleQuestionSubmitted = async () => {
    const { data, error } = await getLoggedInUserAPI({});

    if (!error && data && data?.user?.verified) {
      const { user, permissions } = data;
      dispatch(setUserData({ user }));
      dispatch(setPermissions(permissions));
    } else setCurrentStep(REGISTER_STEP.VERIFY_EMAIL);
  };

  const addOrganization = (organizationId: string) => {
    dispatch(setOrganizationUUID(organizationId));
    setCurrentStep(REGISTER_STEP.QUESTION_LIST);
  };

  const createAccount = async (userData: FormData) => {
    const registerUser = {
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.businessEmail,
      mobile: userData.mobile,
      password: userData.password,
      organizationName: userData.organizationName,
      organizationCategory: userData.organizationCategory,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      initial_color: NAME_BADGE_COLOR_COMBINATIONS[
        Math.floor(Math.random() * NAME_BADGE_COLOR_COMBINATIONS.length)
      ]?.Color,
};
    const { data, error } = await registerAPI(registerUser);
    if (!error) {
      const { organizations = [] } = data;
      dispatch(setAuthenticated({ isAuthenticated: true }));
      if (organizations.length === 1) {
        const organizationId = organizations[0].uuid;
        addOrganization(organizationId);
      }
      setCurrentStep(REGISTER_STEP.REGISTER_SUCCESS);
      setTimeout(() => {
        setCurrentStep(REGISTER_STEP.QUESTION_LIST);
      }, 3000);
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    setSocialLogin(true);
    const { data, error } = await googleLoginAPI({
      idToken,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    if (data && !error) {
      const { organizations = [] } = data;
      dispatch(setAuthenticated({ isAuthenticated: true }));
      if (!organizations.length) {
        setCurrentStep(REGISTER_STEP.COMPANY_DETAILS);
      } else if (organizations.length === 1) {
        const organizationId = organizations[0].uuid;
        addOrganization(organizationId);
        setCurrentStep(REGISTER_STEP.QUESTION_LIST);
      } else {
        setOrganizationList(organizations);
        setCurrentStep(REGISTER_STEP.ORGANIZATION_FORM);
      }
    }
  };

  const loginWithApple = async (response: LoginWithAppleSchema) => {
    setSocialLogin(true);
    const { data } = await appleLoginAPI({
      ...response,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    if (data) {
      const { organizations = [] } = data;
      dispatch(setAuthenticated({ isAuthenticated: true }));
      if (!organizations.length) {
        setCurrentStep(REGISTER_STEP.COMPANY_DETAILS);
      } else if (organizations.length === 1) {
        const organizationId = organizations[0].uuid;
        addOrganization(organizationId);
        setCurrentStep(REGISTER_STEP.QUESTION_LIST);
      } else {
        setOrganizationList(organizations);
        setCurrentStep(REGISTER_STEP.ORGANIZATION_FORM);
      }
    }
  };

  const goToLoginPage = () => {
    dispatch(setLogoutData());
    navigate(PUBLIC_NAVIGATION.login);
  };

  const renderSection = (section: string) => {
    switch (section) {
      case REGISTER_STEP.REGISTER_SUCCESS:
        return <RegisterSuccess />;
      case REGISTER_STEP.VERIFY_EMAIL:
        return <VerifyEmail />;
      case REGISTER_STEP.COMPANY_DETAILS:
        return (
          <CompanyDetails
            formData={formData}
            setFormData={handleCompanyData}
            showPrevBtn={showBackButton}
            prev={() => !isSocialLogin && prevHandler()}
            next={() => handleCompanySkip()}
            loading={companyLoading}
          />
        );
      case REGISTER_STEP.PASSWORD_DETAILS:
        return (
          <PasswordDetails
            registerLoading={registerLoading}
            goToLoginPage={goToLoginPage}
            formData={formData}
            setFormData={(data) => setFormData({ ...formData, ...data })}
            createAccount={createAccount}
            prev={prevHandler}
            showPrevBtn={showBackButton}
          />
        );
      case REGISTER_STEP.ORGANIZATION_FORM:
        return (
          <OrganizationForm
            organizationSuccess={addOrganization}
            organizationOptions={organizationList}
            prev={prevHandler}
            showPrevBtn={showBackButton}
          />
        );
      case REGISTER_STEP.QUESTION_LIST:
        return (
          <QuestionsList
            questionSubmitted={handleQuestionSubmitted}
            goToLoginPage={goToLoginPage}
          />
        );
      case REGISTER_STEP.BASIC_DETAILS:
      default:
        return (
          <BasicDetails
            formData={formData}
            setFormData={(data) =>
              setFormData((prev) => ({ ...prev, ...data }))
            }
            next={nextHandler}
            loading={{
              googleLoginLoader: googleLoading,
              appleLoginLoader: appleLoading,
            }}
            loginWithGoogle={loginWithGoogle}
            loginWithApple={loginWithApple}
          />
        );
    }
  };

  return renderSection(currentStep);
};

export default RegisterForm;
