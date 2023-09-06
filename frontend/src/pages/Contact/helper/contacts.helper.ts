import { convertStringToIntegerForRelatedContacts } from 'utils/util';
import {
  AddContactFormFieldsType,
  ContactDetails,
  RelatedAccount,
  RelatedContact,
} from '../types/contacts.types';

export const generateContactFormData = (
  formVal: AddContactFormFieldsType,
  action?: string,
  contact?: ContactDetails
) => {
  const ContactFormData = new FormData();

  Object.keys(formVal).forEach((val) => {
    const key = val as keyof typeof formVal;
    if (formVal[key] !== undefined) {
      if (key === 'contact_image' && formVal[key] !== undefined) {
        ContactFormData.append(val, formVal[key] as File);
      } else {
        ContactFormData.append(val, formVal[key]?.toString()?.trim() || '');
      }
    }
  });

  // ContactFormData.set(
  //   'related_accounts',
  //   JSON.stringify(
  //     filterAndGenerateAccountPayload(
  //       formVal?.related_accounts || [],
  //       contact?.related_accounts || []
  //     )
  //   )
  // );

  ContactFormData.set(
    'related_contacts',
    JSON.stringify(filterContactData(formVal.related_contacts || []))
  );

  if (formVal.related_contacts && action === 'edit' && contact?.id) {
    ContactFormData.set(
      'related_contacts',
      JSON.stringify(
        filterContactDataForEdit(formVal.related_contacts, contact)
      )
    );
  }

  ContactFormData.set(
    'related_accounts',
    JSON.stringify(filterAccountData(formVal.related_accounts || []))
  );

  if (formVal.related_contacts && action === 'edit' && contact?.id) {
    ContactFormData.set(
      'related_accounts',
      JSON.stringify(
        filterAccountDataForEdit(formVal.related_accounts || [], contact)
      )
    );
  }

  ContactFormData.set(
    'phones',
    JSON.stringify(formVal?.phones?.filter((obj) => obj.value) || [])
  );
  ContactFormData.set(
    'emails',
    JSON.stringify(
      formVal?.emails
        ?.filter((obj) => obj.value)
        .map((item) => {
          return {
            value: item.value,
            is_primary: item.is_primary,
          };
        }) || []
    )
  );

  return ContactFormData;
};

export const filterContactDataForEdit = (
  contacts: RelatedContact[],
  related_contact: ContactDetails
) => {
  const contacts_obj: {
    old?: { id: number; job_role: string }[];
    new?: { name: string; timezone: string; job_role: string }[];
    updated?: { id: number; job_role: string }[];
    deleted?: number[];
  } = {
    new: [],
    old: [],
    updated: [],
    deleted: [],
  };
  const oldRelatedContact = related_contact?.related_contacts;

  contacts.forEach((val) => {
    const contact_val = convertStringToIntegerForRelatedContacts(
      val.contact_id as string,
      val?.isCreatable
    );

    const findOneMatchJobRole = oldRelatedContact.find(
      (contactVal) => contactVal.job_role === val.job_role
    )?.job_role;

    const findOneMatchContactId = oldRelatedContact.find(
      (contactVal) => contactVal.contact_id === contact_val && contact_val
    )?.contact_id;

    const relatedContactIdForUpdate = oldRelatedContact.find(
      (contactVal) => contactVal.contact_id === contact_val && contact_val
    )?.contact_id;

    if (
      val.job_role !== findOneMatchJobRole &&
      findOneMatchContactId === contact_val &&
      typeof contact_val === 'number' &&
      contact_val &&
      relatedContactIdForUpdate
    ) {
      contacts_obj.updated?.push({
        id: +relatedContactIdForUpdate,
        job_role: val?.job_role?.trim() || '',
      });
    }

    if (
      typeof contact_val === 'number' &&
      contact_val !== 0 &&
      findOneMatchContactId !== contact_val
    ) {
      contacts_obj.old?.push({
        id: contact_val,
        job_role: val?.job_role?.trim() || '',
      });
    }

    if (typeof contact_val === 'string' && contact_val.length > 0) {
      contacts_obj.new?.push({
        name: contact_val,
        job_role: val?.job_role?.trim() || '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    }
  });

  // here set deleted contact obj
  if (oldRelatedContact.length) {
    oldRelatedContact.forEach((obj) => {
      const findDifferent = contacts.find((compareVal) => {
        const contact_val = convertStringToIntegerForRelatedContacts(
          compareVal.contact_id as string,
          compareVal.isCreatable
        );
        return contact_val === obj.contact_id;
      });

      if (
        convertStringToIntegerForRelatedContacts(
          findDifferent?.contact_id as string,
          findDifferent?.isCreatable
        ) !== obj.contact_id
      ) {
        contacts_obj.deleted?.push(Number(obj.contact_id));
      }
    });
  }
  return contacts_obj;
};

export const filterContactData = (contacts: RelatedContact[]) => {
  const contacts_obj: {
    old?: { id: number; job_role: string }[];
    new?: { name: string; timezone: string; job_role: string }[];
  } = {
    old: [],
    new: [],
  };
  if (contacts?.length) {
    // push respectively in old and new array in contacts object
    contacts.forEach((val) => {
      const contact_val = convertStringToIntegerForRelatedContacts(
        val.contact_id as string,
        val?.isCreatable
      );
      if (typeof contact_val === 'number' && contact_val !== 0) {
        contacts_obj.old?.push({
          id: contact_val,
          job_role: val?.job_role?.trim() || '',
        });
      }
      if (typeof contact_val === 'string' && contact_val.length > 0) {
        contacts_obj.new?.push({
          job_role: val?.job_role?.trim() || '',
          name: contact_val,
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
  }
  return null;
};

export const filterAccountDataForEdit = (
  accounts: RelatedAccount[],
  related_accounts: ContactDetails
) => {
  const accounts_obj: {
    old?: { id: number; job_role: string; is_primary: boolean }[];
    new?: {
      name: string;
      timezone: string;
      job_role: string;
      is_primary: boolean;
    }[];
    updated?: { id: number; job_role: string; is_primary: boolean }[];
    deleted?: number[];
  } = {
    new: [],
    old: [],
    updated: [],
    deleted: [],
  };
  const oldRelatedAccount = related_accounts?.related_accounts;

  accounts.forEach((val) => {
    const contact_val = convertStringToIntegerForRelatedContacts(
      val.account_id as string,
      val?.isCreatable
    );

    const findOneMatchJobRole = oldRelatedAccount.find(
      (contactVal) =>
        contactVal.job_role === val.job_role &&
        contactVal.is_primary === val.is_primary
    )?.job_role;

    const findOneMatchContactId = oldRelatedAccount.find(
      (contactVal) => contactVal.account_id === contact_val && contact_val
    )?.account_id;

    const relatedContactIdForUpdate = oldRelatedAccount.find(
      (contactVal) => contactVal.account_id === contact_val && contact_val
    )?.account_id;

    if (
      val.job_role !== findOneMatchJobRole &&
      findOneMatchContactId === contact_val &&
      typeof contact_val === 'number' &&
      contact_val &&
      relatedContactIdForUpdate
    ) {
      accounts_obj.updated?.push({
        id: +relatedContactIdForUpdate,
        job_role: val?.job_role?.trim() || '',
        is_primary: !!val?.is_primary,
      });
    }

    if (
      typeof contact_val === 'number' &&
      contact_val !== 0 &&
      findOneMatchContactId !== contact_val
    ) {
      accounts_obj.old?.push({
        id: contact_val,
        job_role: val?.job_role?.trim() || '',
        is_primary: !!val?.is_primary,
      });
    }

    if (typeof contact_val === 'string' && contact_val.length > 0) {
      accounts_obj.new?.push({
        name: contact_val,
        job_role: val?.job_role?.trim() || '',
        is_primary: !!val?.is_primary,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    }
  });

  // here set deleted contact obj
  if (oldRelatedAccount.length) {
    oldRelatedAccount.forEach((obj) => {
      const findDifferent = accounts.find((compareVal) => {
        const contact_val = convertStringToIntegerForRelatedContacts(
          compareVal.account_id as string,
          compareVal.isCreatable
        );
        return contact_val === obj.account_id;
      });

      if (
        convertStringToIntegerForRelatedContacts(
          findDifferent?.account_id as string,
          findDifferent?.isCreatable
        ) !== obj.account_id
      ) {
        accounts_obj.deleted?.push(Number(obj.account_id));
      }
    });
  }
  return accounts_obj;
};

export const filterAccountData = (accounts: RelatedAccount[]) => {
  const accounts_obj: {
    old?: { id: number; job_role: string; is_primary: boolean }[];
    new?: {
      name: string;
      timezone: string;
      job_role: string;
      is_primary: boolean;
    }[];
  } = {
    old: [],
    new: [],
  };
  if (accounts?.length) {
    // push respectively in old and new array in contacts object
    accounts.forEach((val) => {
      const account_val = convertStringToIntegerForRelatedContacts(
        val.account_id as string,
        val?.isCreatable
      );
      if (typeof account_val === 'number' && account_val !== 0) {
        accounts_obj.old?.push({
          id: account_val,
          job_role: val?.job_role?.trim() || '',
          is_primary: !!val?.is_primary,
        });
      }
      if (typeof account_val === 'string' && account_val.length > 0) {
        accounts_obj.new?.push({
          job_role: val?.job_role?.trim() || '',
          name: account_val,
          is_primary: !!val?.is_primary,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      }
    });

    // delete any of array is empty from contact object
    if (!accounts_obj.new?.length) {
      delete accounts_obj.new;
    }
    if (!accounts_obj.old?.length) {
      delete accounts_obj.old;
    }
    return accounts_obj;
  }
  return null;
};

export const setRelatedAccount = (props: ContactDetails) => {
  const { related_accounts } = props;
  const sortedAccounts = (related_accounts || []).sort((a, b) => {
    return (a.account?.name || '').localeCompare(b.account?.name || '');
  });

  if (related_accounts.length > 0) {
    const fromIndex = sortedAccounts.findIndex((item) => item.is_primary);
    const element = sortedAccounts.splice(fromIndex, 1)[0];
    sortedAccounts.splice(0, 0, element);
  }

  return sortedAccounts?.length
    ? sortedAccounts.map((val) => ({
      account_id: val?.account_id,
      job_role: val?.job_role,
      is_primary: val?.is_primary,
    }))
    : [{ job_role: '', account_id: '', is_primary: true }];
};

export const setRelatedContact = (props: ContactDetails) => {
  const { related_contacts } = props;

  const sortedContacts = (related_contacts || []).sort((a, b) => {
    return (a.contact?.name || '').localeCompare(b.contact?.name || '');
  });

  return sortedContacts?.length
    ? sortedContacts.map((val) => ({
      contact_id: val.contact_id,
      job_role: val.job_role,
    }))
    : [{ job_role: '', contact_id: '' }];
};
