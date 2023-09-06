// ** Components **
import EmailTableContent from './EmailTableContent';

// ** Type **
import { EmailDetailPageProps } from '../types/email-details.types';

// ** Helper **

const EmailScheduled = (props: EmailDetailPageProps) => {
  const {
    SetSelectedMails,
    emailTabs,
    selectedMailData_Filter,
    setSelectedMailData_Filter,
    openModalWithEditMode,
    emails,
    isLoading,
  } = props;

  return (
    <EmailTableContent
      openModalWithEditMode={openModalWithEditMode}
      emails={emails}
      selectedMailData_Filter={selectedMailData_Filter}
      setSelectedMailData_Filter={setSelectedMailData_Filter}
      tabClassName="schedule"
      SetSelectedMails={SetSelectedMails}
      emailTabs={emailTabs}
      isLoading={isLoading}
    />
  );
};

export default EmailScheduled;
