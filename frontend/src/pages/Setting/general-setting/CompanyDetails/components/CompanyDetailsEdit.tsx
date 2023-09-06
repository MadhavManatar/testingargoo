// ** import packages **
import React from 'react';

// ** components **
import CompanyDetailsForm from 'pages/Setting/general-setting/CompanyDetails/components/CompanyDetailsForm';
import CompanyDetailsFormSkeleton from 'pages/Setting/general-setting/CompanyDetails/skeletons/CompanyDetailsFormSkeleton';

// ** types **
import { CompanySettingsFormFields } from 'pages/Setting/general-setting/CompanyDetails/types/company-settings.types';

// **  services **
import { useGetCompanyDetails } from '../hooks/useCompanyService';
// import { useUpdateCompanyAPI } from '../services/companyDetail.service';

// ** others **
import generateCompanyFormData from '../helper/companyDetail.helper';
import { useUpdateCompanyMutation } from 'redux/api/companyDetailApi';

interface Props {
  setViewMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const CompanyDetailsEdit = ({ setViewMode }: Props) => {
  // ** Custom hooks **
  const [updateCompanyAPI, { isLoading }] = useUpdateCompanyMutation();
  const { companyData, isLoading: isCompanyLoading } = useGetCompanyDetails();

  const onCancelForm = () => {
    setViewMode(true);
  };

  const companyDataSubmit = async (formVal: CompanySettingsFormFields) => {
    const CompanyFormData = generateCompanyFormData(formVal);
    const data = await updateCompanyAPI({ data: CompanyFormData });

    if (data) {
      setViewMode((prev) => !prev);
    }
  };

  return (
    <div className="ipTabsWrapper">
      <div className="ipTabs">
        <div className="ipTabsContantWrapper">
          {!isCompanyLoading ? (
            <CompanyDetailsForm
              submitForm={companyDataSubmit}
              initialValue={companyData}
              cancelForm={onCancelForm}
              isLoading={isLoading}
            />
          ) : (
            <CompanyDetailsFormSkeleton />
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsEdit;
