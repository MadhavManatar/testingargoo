// ** Import Packages **
import { useState } from 'react';

// ** Components **
import Breadcrumbs from 'components/Breadcrumbs';
import CompanyDetailsEdit from 'pages/Setting/general-setting/CompanyDetails/components/CompanyDetailsEdit';
import CompanyDetailsView from 'pages/Setting/general-setting/CompanyDetails/components/CompanyDetailsView';
import AuthGuard from 'pages/auth/components/AuthGuard';

// ** Hook **
import usePermission from 'hooks/usePermission';

// ** others **
import { BREAD_CRUMB } from 'constant';

const CompanyDetails = () => {
  // ** State **
  const [viewMode, setViewMode] = useState(true);
  const { readOrganizationPermission, updateOrganizationPermission } =
    usePermission();
  return (
    <div>
      <Breadcrumbs path={BREAD_CRUMB.companyDetails} />

      {viewMode ? (
        <AuthGuard isAccessible={readOrganizationPermission}>
          <CompanyDetailsView setViewMode={setViewMode} />
        </AuthGuard>
      ) : (
        <AuthGuard isAccessible={updateOrganizationPermission}>
          <CompanyDetailsEdit setViewMode={setViewMode} />
        </AuthGuard>
      )}
    </div>
  );
};

export default CompanyDetails;
