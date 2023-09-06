// ** Types **
import { AccountDetails } from '../types/account.types';

// ** Util **
import { formatPhoneNumber, usCurrencyFormat } from 'utils/util';

type Props = {
  accountInfo: AccountDetails;
};

const useAccountInfo = (props: Props) => {
  const { accountInfo: account } = props;

  const {
    id,
    fax,
    name,
    phones,
    emails,
    rating,
    website,
    industry,
    timezone,
    ownership,
    employees,
    description,
    account_type,
    account_owner,
    parent_account,
    annual_revenue,
    AccountContacts,
    parent_account_id,
  } = account;

  const accountInfo = {
    id,
    account_owner_id: account_owner?.id,
    account_owner: `${account_owner?.first_name || ''} ${
      account_owner?.last_name || ''
    }`,
    rating: (rating || '').toString(),
    name,
    emails: (emails || []).find((email) => email.isPrimary)?.value,
    phones:
      formatPhoneNumber(
        (phones || []).find((phoneVal) => phoneVal.isPrimary)?.value
      ) || '',
    phoneType:
      (phones || []).find((phoneVal) => phoneVal.isPrimary)?.phoneType || '',
    fax,
    parent_account_id: (parent_account_id || '').toString(),
    parent_account: parent_account?.name,
    website,
    account_type,
    ownership,
    industry,
    employees: employees || '',
    annual_revenue: annual_revenue
      ? usCurrencyFormat(Number(annual_revenue).toString())
      : '0.00',
    description: description || '',
    timezone: timezone || '',
    related_contacts: AccountContacts?.length
      ? AccountContacts.map((item) => {
          return {
            job_role: item.job_role || item.contact?.job_role,
            value: item.contact_id,
            isPrimary: item.is_primary,
          };
        })
      : [{ isPrimary: true, job_role: '', value: '' }],
  };

  return { accountInfo };
};

export default useAccountInfo;
