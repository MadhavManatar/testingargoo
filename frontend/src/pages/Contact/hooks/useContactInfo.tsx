import DateFormat from 'components/DateFormat';
import { ContactDetails } from '../types/contacts.types';
import { formatPhoneNumber } from 'utils/util';

type Props = {
  contact: ContactDetails;
};
const setAccountName = (props: ContactDetails) => {
  const { related_accounts } = props;
  if (related_accounts?.length) {
    return `${related_accounts?.[0]?.account?.name} ${
      related_accounts.length > 1
        ? ` + ${related_accounts.length - 1} more`
        : ''
    }`;
  }
};

const setEmail = (props: ContactDetails) => {
  if (props.emails) {
    const { emails } = props;
    return emails.length ? emails.find((email) => email.is_primary)?.value : '';
  }
};

const setPhone = (props: ContactDetails) => {
  if (props.phones) {
    const { phones } = props;
    return phones.length
      ? (phones || []).find((phoneVal) => phoneVal.is_primary)?.value
      : '';
  }
};

const useContactInfo = (props: Props) => {
  const { contact } = props;

  const {
    id,
    zip,
    city,
    name,
    state,
    phones,
    country,
    address1,
    address2,
    timezone,
    job_role,
    department,
    birth_date,
    description,
    contact_owner,
    address_details,
    reporting_to_contact,
  } = contact;

  const contactInfo = {
    id,
    contactOwner: contact_owner?.full_name,
    name,
    email: setEmail(contact),
    phone: formatPhoneNumber(setPhone(contact)),
    phoneType:
      (phones || []).find((phoneVal) => phoneVal.is_primary)?.phoneType || '',
    address_details,
    account: setAccountName(contact),
    department,
    reportingTo: reporting_to_contact?.name,
    birth_date: birth_date ? <DateFormat date={birth_date} /> : '',
    jobRole: job_role,
    timezone,
    description,
    address1,
    address2,
    city,
    country,
    state,
    zip,
  };

  return { contactInfo };
};

export default useContactInfo;
