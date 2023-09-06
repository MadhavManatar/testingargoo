// ** Components **
import EmailTableContent from './EmailTableContent';

// ** Types **
import { EmailDetailPageProps } from '../types/email-details.types';

const EmailInbox = (props: EmailDetailPageProps) => {
  // ** props **
  const {
    SetSelectedMails,
    emailTabs,
    selectedMailData_Filter,
    setSelectedMailData_Filter,
    emails,
    isLoading,
  } = props;

  return (
    <EmailTableContent
      emails={emails}
      selectedMailData_Filter={selectedMailData_Filter}
      setSelectedMailData_Filter={setSelectedMailData_Filter}
      tabClassName="sent"
      SetSelectedMails={SetSelectedMails}
      emailTabs={emailTabs}
      showMailIcon
      isLoading={isLoading}
    />
  );
};

export default EmailInbox;
