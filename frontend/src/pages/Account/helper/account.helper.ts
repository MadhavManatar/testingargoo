// ** types **
import { BasicContactFields } from 'pages/Contact/types/contacts.types';
import { convertStringToIntegerForAccountContacts } from 'utils/util';
import {
  AccountDetails,
  AddAccountFormFieldsType,
} from '../types/account.types';
import { KeepTimelineEmails } from 'pages/Deal/types/deals.types';

const generateAccountFormData = (
  formVal: AddAccountFormFieldsType,
  action?: string,
  accountDetails?: AccountDetails,
  keepTimelineEmails?: KeepTimelineEmails[]
) => {
  const account_contacts = accountDetails?.AccountContacts;
  const AccountFormData = new FormData();

  Object.keys(formVal).forEach((val) => {
    const key = val as keyof typeof formVal;
    if (key === 'account_image' && formVal[key] !== undefined) {
      AccountFormData.append(val, formVal[key] as File);
    } else {
      AccountFormData.append(val, formVal[key]?.toString()?.trim() || '');
    }
  });

  AccountFormData.set('phones', JSON.stringify(formVal?.phones || []));

  AccountFormData.set('emails', JSON.stringify(formVal?.emails || []));

  if (action === 'edit' && account_contacts) {
    AccountFormData.set(
      'related_contacts',
      JSON.stringify(
        filterContactDataForEdit(formVal.related_contacts, account_contacts)
      )
    );
  } else {
    AccountFormData.set(
      'related_contacts',
      JSON.stringify(
        filterAndGenerateContactPayload(formVal?.related_contacts || [])
      )
    );
  }
  if (keepTimelineEmails && keepTimelineEmails.length) {
    AccountFormData.set(
      'keepTimelineEmails',
      JSON.stringify(keepTimelineEmails)
    );
  }
  return AccountFormData;
};

export default generateAccountFormData;

export const filterAndGenerateContactPayload = (
  related_contact: {
    job_role: string;
    value: string | number;
    is_primary: boolean;
    isCreatable: boolean;
  }[]
) => {
  const contacts_obj: {
    old?: { id: number; job_role: string; is_primary: boolean }[];
    new?: {
      name: string;
      job_role: string;
      is_primary: boolean;
      timezone: string;
    }[];
  } = {
    new: [],
    old: [],
  };
  related_contact
    .filter((val) => val.value && val.job_role)
    .forEach((contact) => {
      const contact_val = convertStringToIntegerForAccountContacts(
        contact.value as string,
        contact?.isCreatable
      );

      if (Number.isSafeInteger(contact_val)) {
        contacts_obj.old?.push({
          id: contact_val as number,
          is_primary: contact.is_primary,
          job_role: contact.job_role,
        });
      } else if (typeof contact_val === 'string' && contact_val.length > 0) {
        contacts_obj.new?.push({
          name: contact_val,
          is_primary: contact.is_primary,
          job_role: contact.job_role,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      }
    });

  // delete any of array is empty from contact object
  if (!contacts_obj.new?.length) {
    delete contacts_obj.new;
  }
  if (!contacts_obj.old?.length) {
    delete contacts_obj.old;
  }
  return contacts_obj;
};

export const filterContactDataForEdit = (
  contacts?: {
    job_role: string;
    value: string | number;
    is_primary: boolean;
    isCreatable: boolean;
  }[],
  account_contacts?: {
    job_role: string;
    id: number;
    is_primary: boolean;
    contact_id: number;
    contact: BasicContactFields;
  }[]
) => {
  // ** start edit lead_contacts field **

  const contacts_obj: {
    old?: { id: number; job_role: string; is_primary: boolean }[];
    new?: {
      name: string;
      job_role: string;
      is_primary: boolean;
      timezone: string;
    }[];
    updated?: {
      account_contact_id: number;
      job_role: string;
      is_primary: boolean;
      contact_id: number;
    }[];
    deleted?: number[];
  } = {
    new: [],
    old: [],
    updated: [],
    deleted: [],
  };

  if (account_contacts && contacts) {
    contacts.forEach((val) => {
      const contact_val = convertStringToIntegerForAccountContacts(
        val?.value as string,
        val.isCreatable
      );

      const findOneMatchJobRole = account_contacts.find(
        (contactVal) =>
          contactVal?.job_role === val?.job_role &&
          contactVal.is_primary === val?.is_primary
      );

      const findOneMatchContactId = account_contacts.find(
        (contactVal) => contactVal?.contact?.id === contact_val
      );

      if (
        val?.job_role !== findOneMatchJobRole?.job_role &&
        val?.is_primary !== findOneMatchJobRole?.is_primary &&
        findOneMatchContactId?.contact.id === contact_val &&
        Number.isSafeInteger(contact_val)
      ) {
        contacts_obj.updated?.push({
          account_contact_id: account_contacts?.find(
            (contactVal) => contactVal?.contact_id === contact_val
          )?.id as number,
          contact_id: account_contacts?.find(
            (contactVal) => contactVal?.contact_id === contact_val
          )?.contact_id as number,
          job_role: val?.job_role,
          is_primary: val?.is_primary,
        });
      }

      if (
        contact_val &&
        Number.isSafeInteger(contact_val) &&
        findOneMatchContactId?.contact.id !== contact_val
      ) {
        contacts_obj.old?.push({
          id: contact_val as number,
          job_role: val?.job_role,
          is_primary: val?.is_primary,
        });
      }

      if (typeof contact_val === 'string' && contact_val.length > 0) {
        contacts_obj.new?.push({
          job_role: val?.job_role,
          name: contact_val,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          is_primary: val?.is_primary,
        });
      }
    });

    account_contacts.forEach((deleteData) => {
      const findDifferent = contacts.find((compareVal) => {
        const contact_val = convertStringToIntegerForAccountContacts(
          compareVal?.value as string,
          compareVal.isCreatable
        );
        return contact_val === deleteData?.contact?.id;
      });

      if (
        convertStringToIntegerForAccountContacts(
          findDifferent?.value as string,
          findDifferent?.isCreatable
        ) !== deleteData?.contact?.id
      ) {
        contacts_obj.deleted?.push(deleteData?.id);
      }
    });
  }

  // ** end edit lead_contacts field **
  return contacts_obj;
};

export const setContactsRelatedToAccount = (
  related_contacts: {
    job_role: string;
    id: number;
    is_primary: boolean;
    contact_id: number;
    contact: BasicContactFields;
  }[]
) => {
  const sortedContacts = (related_contacts || []).sort((a, b) => {
    return (a.contact?.name || '').localeCompare(b.contact?.name || '');
  });

  const fromIndex = sortedContacts.findIndex((item) => item.is_primary);
  const element = sortedContacts.splice(fromIndex, 1)[0];
  sortedContacts.splice(0, 0, element);

  return sortedContacts?.map((val) => ({
    value: val.contact_id,
    job_role: val?.job_role || val?.contact?.job_role,
    is_primary: val.is_primary,
  }));
};
