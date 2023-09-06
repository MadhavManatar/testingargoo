// ** Components **
import EmailTableContent from './EmailTableContent';

// ** Type **
import { EmailDetailPageProps } from '../types/email-details.types';


const EmailArchive = (props: EmailDetailPageProps) => {
  // ** props **
  const {
    SetSelectedMails,
    emailTabs,
    // refresh,
    selectedMailData_Filter,
    setSelectedMailData_Filter,
    emails,
    isLoading
  } = props;

  return (
    <EmailTableContent
      emails={emails}
      setSelectedMailData_Filter={setSelectedMailData_Filter}
      selectedMailData_Filter={selectedMailData_Filter}
      tabClassName="sent"
      SetSelectedMails={SetSelectedMails}
      emailTabs={emailTabs}
      showMailIcon
      isLoading={isLoading}
    />
  );
};

export default EmailArchive;
