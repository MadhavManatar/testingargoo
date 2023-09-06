// ** components **
import EmailTableContent from './EmailTableContent';

// ** Type **
import { EmailDetailPageProps } from '../types/email-details.types';

const EmailSpamBox = (Props: EmailDetailPageProps) => {

  const {
    SetSelectedMails,
    emailTabs,
    selectedMailData_Filter,
    setSelectedMailData_Filter,
    emails,
    isLoading
  } = Props;



  return (
    <EmailTableContent
      emails={emails}
      selectedMailData_Filter={selectedMailData_Filter}
      setSelectedMailData_Filter={setSelectedMailData_Filter}
      tabClassName="sent"
      SetSelectedMails={SetSelectedMails}
      emailTabs={emailTabs}
      isLoading={isLoading}
    />
  );
};

export default EmailSpamBox;
