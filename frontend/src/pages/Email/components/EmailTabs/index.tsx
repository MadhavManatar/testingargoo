// ** Import Packages **
import { useEffect, useState } from 'react';

// ** Components **
import EmailTabHeader from './Components/EmailTabHeader';

// ** types **
import {
  SelectedMailDataFilterType,
  CustomLabel,
} from 'pages/Email/types/email.type';
import { EmailTabPropsInterface, SelectedMailType } from './types/email.types';
import EmailSection from './Components/EmailSection';

const EmailTabs = (props: EmailTabPropsInterface) => {
  const {
    openModal,
    providerOption,
    setSelectedProvider,
    selectedProvider,
    openModalWithEditMode,
    providers
  } = props;
  // ** states **
  const [emailTabs, setEmailTabs] = useState<CustomLabel>(CustomLabel.INBOX);
  const [selectedMails, SetSelectedMails] = useState<SelectedMailType[]>([]);
  const [conservationsCount, setConservationsCount] = useState<number>(0);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [searchData, setSearchData] = useState<{
    searchText: string;
    searchFields: string;
  }>({ searchFields: '', searchText: '' });
  const [selectedMailData_Filter, setSelectedMailData_Filter] =
    useState<SelectedMailDataFilterType>();
  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    setPage(1);
  }, [selectedProvider, emailTabs]);
  
  return (
    <>
      <EmailTabHeader
        openModal={openModal}
        providerOption={providerOption}
        setSelectedProvider={setSelectedProvider}
        selectedMails={selectedMails}
        conservationsCount={conservationsCount}
        setEmailTabs={setEmailTabs}
        count={count}
        setPage={setPage}
        page={page}
        selectedProvider={selectedProvider}
        SetSelectedMails={SetSelectedMails}
        label={emailTabs}
        setRefresh={setRefresh}
        setSearchData={setSearchData}
        setSelectedMailData_Filter={setSelectedMailData_Filter}
        selectedMailData_Filter={selectedMailData_Filter}
        providers={providers}
      />
      <EmailSection
        providerOption={providerOption}
        selectedProvider={selectedProvider}
        SetSelectedMails={SetSelectedMails}
        emailTabs={emailTabs}
        headerPage={page}
        setCount={setCount}
        refresh={refresh}
        setRefresh={setRefresh}
        setConservationsCount={setConservationsCount}
        searchData={searchData}
        selectedMailData_Filter={selectedMailData_Filter}
        setSelectedMailData_Filter={setSelectedMailData_Filter}
        openModalWithEditMode={openModalWithEditMode}
      />
    </>
  );
};

export default EmailTabs;
