// ** components **
import EmailTableContent from './EmailTableContent';

// ** types **
import { EmailDetailPageProps } from '../types/email-details.types';

const EmailDrafts = (Props: EmailDetailPageProps) => {
  // ** props **
  const {
    SetSelectedMails,
    emailTabs,
    selectedMailData_Filter,
    setSelectedMailData_Filter,
    emails,
    isLoading,
  } = Props;

  return (
    <EmailTableContent
      emails={emails}
      selectedMailData_Filter={selectedMailData_Filter}
      setSelectedMailData_Filter={setSelectedMailData_Filter}
      tabClassName="draft"
      SetSelectedMails={SetSelectedMails}
      emailTabs={emailTabs}
      isLoading={isLoading}
    />
  );
};

export default EmailDrafts;
