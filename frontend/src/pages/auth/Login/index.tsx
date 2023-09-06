// ** Import Packages **
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// ** Components **
import AuthLayout from 'pages/auth/components/AuthLayout';
import LoginForm from 'pages/auth/Login/components/LoginForm';
import OrganizationForm from 'pages/auth/Login/components/OrganizationForm';
import CompanyDetails from 'pages/auth/Register/components/CompanyDetails';
import VerifyEmail from 'pages/auth/Register/components/VerifyEmail';

// ** Redux **
import { getCurrentUser, setLogoutData } from 'redux/slices/authSlice';

// ** Types **
import type { OrganizationFields } from 'pages/auth/Register/types/register.types';
import { OrganizationOptions, TwoFactorTypes } from './types/login.types';

// ** Services **
import { useAddCompanyInfoAPI } from '../services/auth.service';

// ** Constant **
import { LOGIN_STEP } from 'constant';

import TowFactorVerify from '../TowFactorVerify';
import useLoginService from './useLoginService';

const initialFormData: OrganizationFields = {
  organizationName: '',
  organizationCategory: '',
};

const Login = () => {
  // ** Hooks **
  const currentUser = useSelector(getCurrentUser);
  const dispatch = useDispatch();

  let activeStep: string = LOGIN_STEP.LOGIN_FORM;
  if (currentUser?.user_organizations?.length === 0) {
    activeStep = LOGIN_STEP.COMPANY_DETAILS;
  } else if (currentUser && !currentUser.verified) {
    activeStep = LOGIN_STEP.VERIFY_EMAIL;
  }

  // ** States **
  const [currentStep, setCurrentStep] = useState(activeStep);
  const [organizationList, setOrganizationList] = useState<
    OrganizationOptions[]
  >([]);
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorTypes>()

  const [isSocialLogin, setSocialLogin] = useState(false);
  const [companyFormData, setCompanyFormData] =
    useState<OrganizationFields>(initialFormData);

  // ** Custom Hooks **
  const { addCompanyInfoAPI, isLoading: companyLoading } =
    useAddCompanyInfoAPI();

  const {
    loginUser,
    loginWithApple,
    loginWithGoogle,
    isVerified,
    formLoading,
    loggedInUserLoading,
    addOrganization,
  } = useLoginService({ setCurrentStep, setOrganizationList, setSocialLogin, setTwoFactorData });

  const isOwnersCompanyDetailsPending =
    currentUser &&
    currentUser.is_owner &&
    currentUser.user_organizations?.length === 0;

  const handleCompanySkip = async () => {
    /* On Social Login Create company on skip */
    if (isSocialLogin || isOwnersCompanyDetailsPending) {
      const { error, data } = await addCompanyInfoAPI({});
      if (!error && data) {
        const organizationId = data.organizations[0].uuid;
        addOrganization(organizationId);
      }
    } else {
      isVerified();
    }
  };

  const handleCompanyData = async (companyData: OrganizationFields) => {
    setCompanyFormData((prev) => ({ ...prev, ...companyData }));
    if (isSocialLogin || isOwnersCompanyDetailsPending) {
      const payload = {
        organizationName: companyData.organizationName,
        organizationCategory: companyData.organizationCategory,
      };

      const { data, error } = await addCompanyInfoAPI(payload);
      if (!error && data) {
        const organizationId = data.organizations[0].uuid;
        addOrganization(organizationId);
      }
    } else {
      isVerified();
    }
  };

  const goToLoginPage = () => {
    if (currentStep !== LOGIN_STEP.LOGIN_FORM) {
      dispatch(setLogoutData());
      setCurrentStep(LOGIN_STEP.LOGIN_FORM);
    }
  };

  return (
    <AuthLayout>
      {currentStep === LOGIN_STEP.LOGIN_FORM && (
        <LoginForm
          loading={formLoading}
          login={loginUser}
          loginWithGoogle={loginWithGoogle}
          loginWithApple={loginWithApple}
        />
      )}
      {currentStep === LOGIN_STEP.VERIFY_2FA && (
        <TowFactorVerify
          twoFactorData={twoFactorData}
          organizationList={organizationList}
          isVerified={isVerified}
          setCurrentStep={setCurrentStep}
        />
      )}
      {currentStep === LOGIN_STEP.COMPANY_DETAILS && (
        <CompanyDetails
          formData={companyFormData}
          setFormData={handleCompanyData}
          showPrevBtn={false}
          prev={() => setCurrentStep(LOGIN_STEP.LOGIN_FORM)}
          next={() => handleCompanySkip()}
          goToLoginPage={goToLoginPage}
          loading={companyLoading || loggedInUserLoading}
        />
      )}
      {currentStep === LOGIN_STEP.ORGANIZATION_FORM && (
        <OrganizationForm
          organizationSuccess={addOrganization}
          organizationOptions={organizationList}
          showPrevBtn
          prev={() => setCurrentStep(LOGIN_STEP.LOGIN_FORM)}
        />
      )}
      {currentStep === LOGIN_STEP.VERIFY_EMAIL && (
        <VerifyEmail goToLoginPage={goToLoginPage} />
      )}
    </AuthLayout>
  );
};

export default Login;
