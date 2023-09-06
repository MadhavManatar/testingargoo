// ** Components **
import EmailTableContent from './EmailTableContent';

// ** Type **
import { EmailDetailPageProps } from '../types/email-details.types';

const EmailSentBox = (Props: EmailDetailPageProps) => {
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
      setSelectedMailData_Filter={setSelectedMailData_Filter}
      selectedMailData_Filter={selectedMailData_Filter}
      tabClassName="inbox"
      SetSelectedMails={SetSelectedMails}
      emailTabs={emailTabs}
      isLoading={isLoading}
    />
  );
};

export default EmailSentBox;
