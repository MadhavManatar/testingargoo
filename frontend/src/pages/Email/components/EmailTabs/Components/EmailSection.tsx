// ** Components **
import EmailArchive from './EmailArchive';
import EmailInbox from './EmailInbox';
import EmailScheduled from './EmailSchedule';
import EmailSentBox from './EmailSentBox';
import EmailSpamBox from './EmailSpamBox';
import EmailTrash from './EmailTrash';

// ** types **
import { CustomLabel, EmailListingRow } from 'pages/Email/types/email.type';
import { EmailSectionPageProps } from '../types/email-details.types';
import EmailDrafts from './EmailDrafts';
import { useEffect, useState } from 'react';

import { GetMailPayload } from 'redux/api/types/mail.model';
import EmailRowsSkeleton from 'components/skeletons/EmailRowsSkeleton';
import { getMailsApiParams } from 'redux/api/helper/mail.helper';
import { useLazyGetMailsQuery } from 'redux/api/mailApi';
import { POLLING_INTERVAL } from 'constant/dataLimit.constant';

const EmailSection = (props: EmailSectionPageProps) => {
  const {
    SetSelectedMails,
    emailTabs,
    selectedProvider,
    setConservationsCount,
    refresh,
    setCount,
    headerPage,
    searchData,
    selectedMailData_Filter,
    setSelectedMailData_Filter,
    providerOption,
    openModalWithEditMode,
  } = props;
  // ** Store **

  // ** States **
  const [pollingInterval, setPollingInterval] = useState<number | undefined>(
    POLLING_INTERVAL
  );
  const [emails, setEmails] = useState<{
    rows: EmailListingRow[];
    count: number;
  }>({ rows: [], count: 0 });

  // ** APIS **
  const [getMails, { isLoading: emailsLoading, data: mailData, isFetching }] =
    useLazyGetMailsQuery({ pollingInterval });

  useEffect(() => {
    setEmails({
      rows: [],
      count: 0,
    });
  }, [emailTabs]);

  useEffect(() => {
    if (selectedProvider.value) {
      const time = headerPage && headerPage > 1 ? 0 : POLLING_INTERVAL;
      setPollingInterval(time);
      const args: GetMailPayload = {
        label: [emailTabs],
        provider: selectedProvider,
        page: headerPage,
        searchData,
        limit: 50,
        providerOption,
      };
      getMailsData(args);
    }
  }, [selectedProvider, searchData, headerPage, emailTabs]);

  useEffect(() => {
    if (mailData && !emailsLoading) {
      setEmails({ rows: mailData.rows, count: mailData.count });
      if (setCount) setCount(mailData.count);
      setConservationsCount(mailData.count);
    }
  }, [mailData, emailsLoading]);

  const getMailsData = (args: GetMailPayload) => {
    const params = getMailsApiParams(args);
    getMails(params, true);
  };

  const renderSection = (activeTab: CustomLabel) => {
    switch (activeTab) {
      case CustomLabel.ARCHIVED:
        return (
          <EmailArchive
            SetSelectedMails={SetSelectedMails}
            emailTabs={CustomLabel.ARCHIVED}
            refresh={refresh}
            selectedMailData_Filter={selectedMailData_Filter}
            setSelectedMailData_Filter={setSelectedMailData_Filter}
            emails={emails}
            isLoading={isFetching}
          />
        );
      case CustomLabel.DRAFT:
        return (
          <EmailDrafts
            SetSelectedMails={SetSelectedMails}
            emailTabs={CustomLabel.DRAFT}
            selectedMailData_Filter={selectedMailData_Filter}
            setSelectedMailData_Filter={setSelectedMailData_Filter}
            emails={emails}
            isLoading={isFetching}
          />
        );
      case CustomLabel.SCHEDULED:
        return (
          <EmailScheduled
            openModalWithEditMode={openModalWithEditMode}
            refresh={refresh}
            SetSelectedMails={SetSelectedMails}
            emailTabs={CustomLabel.SCHEDULED}
            selectedMailData_Filter={selectedMailData_Filter}
            setSelectedMailData_Filter={setSelectedMailData_Filter}
            emails={emails}
            isLoading={isFetching}
          />
        );
      case CustomLabel.SENT:
        return (
          <EmailSentBox
            SetSelectedMails={SetSelectedMails}
            emailTabs={CustomLabel.SENT}
            selectedMailData_Filter={selectedMailData_Filter}
            setSelectedMailData_Filter={setSelectedMailData_Filter}
            emails={emails}
            isLoading={isFetching}
          />
        );
      case CustomLabel.SPAM:
        return (
          <EmailSpamBox
            SetSelectedMails={SetSelectedMails}
            emailTabs={CustomLabel.SPAM}
            selectedMailData_Filter={selectedMailData_Filter}
            setSelectedMailData_Filter={setSelectedMailData_Filter}
            emails={emails}
            isLoading={isFetching}
          />
        );
      case CustomLabel.TRASH:
        return (
          <EmailTrash
            SetSelectedMails={SetSelectedMails}
            emailTabs={CustomLabel.TRASH}
            refresh={refresh}
            selectedMailData_Filter={selectedMailData_Filter}
            setSelectedMailData_Filter={setSelectedMailData_Filter}
            emails={emails}
            isLoading={isFetching}
          />
        );
      case CustomLabel.INBOX:
      default:
        return (
          <EmailInbox
            SetSelectedMails={SetSelectedMails}
            emailTabs={CustomLabel.INBOX}
            selectedMailData_Filter={selectedMailData_Filter}
            setSelectedMailData_Filter={setSelectedMailData_Filter}
            emails={emails}
            isLoading={isFetching}
          />
        );
    }
  };

  return (
    <>{emailsLoading ? <EmailRowsSkeleton /> : renderSection(emailTabs)}</>
  );
};

export default EmailSection;
