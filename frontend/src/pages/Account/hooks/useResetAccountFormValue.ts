// ** Import Packages **
import { AddressFormFields } from 'components/Address/types/address.types';
import { useEffect } from 'react';
import { UseFormReset } from 'react-hook-form';
import { usCurrencyFormat } from 'utils/util';

// ** Types **
import {
  AccountDetails,
  AccountFormFieldsType,
  AddAccountFormFieldsType,
} from '../types/account.types';

type Props = {
  reset: UseFormReset<AddAccountFormFieldsType>;
  account: AccountDetails;
  isEditing:
    | 'related_contacts'
    | keyof AccountFormFieldsType
    | keyof AddressFormFields
    | undefined;
};

// ** this hook is only use in account info, related contacts not showed in detail info **
const useResetAccountFormValue = (props: Props) => {
  const { account, reset, isEditing } = props;
  const {
    account_owner,
    rating,
    name,
    fax,
    parent_account_id,
    sub_account_id,
    website,
    account_type,
    ownership,
    industry,
    employees,
    annual_revenue,
    description,
    zip,
    city,
    state,
    country,
    address1,
    address2,
    timezone,
    AccountContacts,
    emails,
    phones,
  } = account;

  useEffect(() => {
    reset({
      account_owner_id: account_owner?.id || undefined,
      rating: rating ? `${rating}` : '',
      name: name || '',
      emails:
        emails && emails.length > 0
          ? emails.map((item) => {
              return {
                isPrimary: item.isPrimary,
                value: item.value,
              };
            })
          : [{ isPrimary: true, value: '' }] || '',
      phones: phones?.length
        ? phones.map((item) => {
            return {
              isPrimary: item.isPrimary,
              phoneType: item.phoneType,
              value: item.value,
            };
          })
        : [{ isPrimary: true, phoneType: null, value: '' }] || '',
      fax,
      parent_account_id: parent_account_id ? `${parent_account_id}` : '',
      sub_account_id: sub_account_id ? `${sub_account_id}` : '',
      website: website || '',
      account_type: account_type || '',
      ownership: ownership || '',
      industry: industry || '',
      employees: employees || '',
      annual_revenue: annual_revenue
        ? usCurrencyFormat(Number(annual_revenue).toString())
        : '0.00',
      description: description || '',
      zip: zip || '',
      city: city || '',
      state_id: state?.id || 0,
      country_id: country?.id || 0,
      address1: address1 || '',
      address2: address2 || '',
      timezone: timezone || '',
      related_contacts: AccountContacts?.length
        ? AccountContacts.map((item) => {
            return {
              job_role: item.job_role || item?.contact?.job_role,
              value: item.contact_id,
              isPrimary: item.is_primary,
            };
          })
        : [{ is_primary: true, job_role: '', value: '' }],
    });
  }, [account, isEditing]);
};

export default useResetAccountFormValue;
