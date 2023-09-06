import { AddressFormFields } from 'components/Address/types/address.types';
import { SocialMediaFields } from 'pages/Setting/general-setting/PersonalSettings/types/personal-settings.types';
import { useEffect } from 'react';
import { UseFormReset } from 'react-hook-form';
import {
  ContactDetails,
  ContactFormFieldsType,
  RelatedContact,
} from '../types/contacts.types';
import {
  setRelatedAccount,
  setRelatedContact,
} from '../helper/contacts.helper';

type Props = {
  reset: UseFormReset<
    ContactFormFieldsType & {
      related_contacts?: RelatedContact[];
      lead_source?: string | number | undefined;
    } & AddressFormFields &
      SocialMediaFields
  >;
  contact: ContactDetails;
  isEditing: string | undefined;
};

const useResetFormValue = (props: Props) => {
  const { contact, reset, isEditing } = props;
  const {
    contact_owner_id,
    name,
    department,
    birth_date,
    skype,
    address1,
    address2,
    city,
    country,
    state,
    zip,
    description,
    timezone,
    job_role,
    twitter,
    reporting_to_contact,
    phones,
    emails,
  } = contact;

  useEffect(() => {
    reset({
      contact_owner_id,
      name,
      emails: emails.length
        ? emails.map((item) => ({
            is_primary: item.is_primary,
            value: item.value,
          }))
        : [{ is_primary: true, value: '' }],
      phones: phones.length
        ? phones.map((item) => ({
            is_primary: item.is_primary,
            phoneType: item.phoneType,
            value: item.value,
          }))
        : [{ is_primary: true, phoneType: null, value: '' }],
      related_accounts: setRelatedAccount(contact),
      department,
      reporting_to: reporting_to_contact ? `${reporting_to_contact.id}` : '',
      birth_date,
      skype,
      address1: address1 || '',
      address2,
      city,
      country_id: country?.id,
      state_id: state?.id,
      zip,
      timezone,
      description,
      job_role,
      twitter,
      related_contacts: setRelatedContact(contact),
    });
  }, [contact, isEditing]);
};

export default useResetFormValue;
