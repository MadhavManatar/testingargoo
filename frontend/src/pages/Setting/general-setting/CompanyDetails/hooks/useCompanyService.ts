import { IS_CACHING_ACTIVE } from 'constant';
import { useEffect, useState } from 'react';
import { useLazyGetCompanyDetailQuery } from 'redux/api/companyDetailApi';

export const useGetCompanyDetails = () => {
  // ================= State ====================
  const [companyData, setCompanyData] = useState({
    zip: '',
    city: '',
    email: '',
    name: '',
    phone: '',
    mobile: '',
    county: '',
    address1: '',
    address2: '',
    website: '',
    organization_logo: '',
    organization_category: '',
    state: { id: 0, name: '', state_code: '', },
    country: { id: 0, name: '', iso3: '', iso2: '', },
  });

  // ================= Custom hooks ====================
  const [getCompanyAPI, { isLoading, isError, isSuccess, currentData }] =
    useLazyGetCompanyDetailQuery();

  useEffect(() => {
    getCompanyAPI({}, IS_CACHING_ACTIVE);
  }, []);

  useEffect(() => {
    if (currentData) {
      setCompanyData(currentData);
    }
  }, [currentData]);

  return { companyData, isLoading, isError, isSuccess };
};
