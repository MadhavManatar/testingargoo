// ** Types **
import { RelatedContact } from 'pages/Contact/types/contacts.types';
import {
  DealDetailsType,
  KeepTimelineEmails,
} from '../../Deal/types/deals.types';
import { AddLeadFormFieldsType, LeadDetailsType } from '../types/lead.type';

// ** Util **
import { convertStringToIntegerForAccountContacts } from 'utils/util';

export const generateLeadFormData = (
  formVal: AddLeadFormFieldsType,
  action?: string,
  lead_contacts?: RelatedContact[],
  keepTimelineEmails?: KeepTimelineEmails[]
) => {
  const LeadFormData = new FormData();
  Object.keys(formVal).forEach((val) => {
    const key = val as keyof typeof formVal;
    LeadFormData.append(key, formVal[key]?.toString()?.trim() || '');
  });

  if (formVal.related_account) {
    LeadFormData.set(
      'related_account',
      JSON.stringify(
        filterAccountData({
          entity_record_id: formVal.related_account,
          isLeadOrLead: false,
        })
      )
    );
  } else if (
    formVal.related_account === null ||
    formVal.related_account === ''
  ) {
    LeadFormData.set(
      'related_account',
      JSON.stringify(
        filterAccountData({
          entity_record_id: formVal.related_account,
          isLeadOrLead: false,
        })
      )
    );
  }

  if (formVal.contacts) {
    if (action === 'edit' && lead_contacts) {
      LeadFormData.set(
        'contacts',
        JSON.stringify(
          filterContactDataForEdit(formVal.contacts, lead_contacts)
        )
      );
    } else {
      LeadFormData.set(
        'contacts',
        JSON.stringify(filterContactData(formVal.contacts))
      );
    }
  }
  if (formVal.lead_source) {
    LeadFormData.set(
      'lead_source',
      JSON.stringify(filterLeadSource(formVal.lead_source))
    );
  }
  if (keepTimelineEmails && keepTimelineEmails.length) {
    LeadFormData.set('keepTimelineEmails', JSON.stringify(keepTimelineEmails));
  }
  return LeadFormData;
};

// ========================= account data generation=======================

export const filterAccountData = (val: {
  entity_record_id: string | number;
  isLeadOrLead: boolean;
}) => {
  const { entity_record_id, isLeadOrLead } = val;
  // create related account api formdata

  let related_account_obj: {
    old?: number;
    new?: { name: string; timezone: string };
    is_deleted?: boolean;
  } | null = {
    old: undefined,
    new: undefined,
  };
  if (entity_record_id === null && isLeadOrLead === true) {
    delete related_account_obj.is_deleted;
    if (
      related_account_obj.old === undefined &&
      related_account_obj.new === undefined
    ) {
      related_account_obj = null;
    }
  } else if (
    (entity_record_id === '' && isLeadOrLead === false) ||
    (entity_record_id === null && isLeadOrLead === false)
  ) {
    related_account_obj.is_deleted = true;
  }

  if (
    (entity_record_id && isLeadOrLead === false) ||
    (entity_record_id && isLeadOrLead === true)
  ) {
    if (Number.isSafeInteger(entity_record_id)) {
      if (related_account_obj)
        related_account_obj.old = entity_record_id as number;
    } else if (typeof entity_record_id === 'string') {
      if (related_account_obj)
        related_account_obj.new = {
          name: entity_record_id,

          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
    }

    return related_account_obj;
  }

  return related_account_obj;
};

// ============================contact data generation==========================
export const filterContactData = (contacts: RelatedContact[]) => {
  const contacts_obj: {
    old?: { id: number; job_role: string; is_primary: boolean }[];
    new?: {
      name: string;
      job_role: string;
      timezone: string;
      is_primary: boolean;
    }[];
  } = {
    new: [],
    old: [],
  };

  if (contacts?.length) {
    // push respectively in old and new array in contacts object
    contacts.forEach((val) => {
      const contact_val = convertStringToIntegerForAccountContacts(
        String(val.contact_id) as string,
        val?.isCreatable
      );
      if (Number.isSafeInteger(contact_val) && contact_val) {
        contacts_obj.old?.push({
          id: contact_val as number,
          job_role: val?.job_role?.trim() || '',
          is_primary: !!val.is_primary,
        });
      }
      if (typeof contact_val === 'string' && contact_val.length > 0) {
        contacts_obj.new?.push({
          job_role: val?.job_role?.trim() || '',
          name: contact_val,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          is_primary: !!val.is_primary,
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

export const filterContactDataForEdit = (
  contacts: RelatedContact[],
  lead_contacts: RelatedContact[]
) => {
  const contacts_obj: {
    old?: { id: number; job_role: string; is_primary: boolean }[];
    new?: {
      name: string;
      job_role: string;
      timezone: string;
      is_primary: boolean;
    }[];
    update?: {
      lead_contact_id: number;
      job_role: string;
      is_primary: boolean;
    }[];
    delete?: string[];
  } = {
    new: [],
    old: [],
    update: [],
    delete: [],
  };

  contacts.forEach((val) => {
    const contact_val = convertStringToIntegerForAccountContacts(
      String(val.contact_id) as string,
      val?.isCreatable
    );

    const findOneMatchJobRole = lead_contacts.find(
      (contactVal) =>
        contactVal.job_role === val.job_role &&
        contactVal.is_primary === val.is_primary
    );
    const findOneMatchContactId = lead_contacts.find(
      (contactVal) => contactVal.contact_id === contact_val && contact_val
    );

    if (
      val.job_role !== findOneMatchJobRole?.job_role &&
      findOneMatchContactId?.contact_id === contact_val &&
      Number.isSafeInteger(contact_val) &&
      contact_val
    ) {
      contacts_obj.update?.push({
        lead_contact_id: lead_contacts.find(
          (contactVal) => contactVal.contact_id === contact_val && contact_val
        )?.contact_id as number,
        job_role: val?.job_role?.trim() || '',
        is_primary: !!val.is_primary,
      });
    }

    if (
      contact_val &&
      Number.isSafeInteger(contact_val) &&
      findOneMatchContactId?.contact_id !== contact_val
    ) {
      contacts_obj.old?.push({
        id: contact_val as number,
        job_role: val?.job_role?.trim() || '',
        is_primary: !!val.is_primary,
      });
    }

    if (typeof contact_val === 'string' && contact_val.length > 0) {
      contacts_obj.new?.push({
        job_role: val?.job_role?.trim() || '',
        name: contact_val,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        is_primary: !!val.is_primary,
      });
    }
  });

  // here set deleted contact obj
  lead_contacts.forEach((deleteData) => {
    const findDifferent = contacts.find((compareVal) => {
      const contact_val = convertStringToIntegerForAccountContacts(
        String(compareVal.contact_id) as string,
        compareVal.isCreatable
      );
      return contact_val === deleteData.contact_id;
    });

    if (
      convertStringToIntegerForAccountContacts(
        String(findDifferent?.contact_id) as string,
        findDifferent?.isCreatable
      ) !== deleteData.contact_id &&
      deleteData.contact_id
    ) {
      contacts_obj.delete?.push(String(deleteData.contact_id));
    }
  });

  return contacts_obj;
};

// ** Set mail and contact **
export const setContactAndMailFunc = (props: {
  leadData: LeadDetailsType | DealDetailsType;
  isActivityContactMail?: boolean;
}) => {
  const { leadData, isActivityContactMail = false } = props;
  let primaryContact: string | undefined;
  let primaryEmail: string | undefined = '';
  let phoneType: string | undefined = '';

  const contactInfo = isActivityContactMail
    ? leadData?.related_contacts?.[0]?.contact
    : leadData?.related_contacts?.find((contactObj) => contactObj?.is_primary)
        ?.contact;

  if (contactInfo?.emails && contactInfo?.emails) {
    const contactObj = contactInfo?.phones?.find((obj) => obj.is_primary);
    primaryContact = contactObj?.value;
    phoneType = contactObj?.phoneType || '';
    primaryEmail =
      contactInfo?.emails?.find((mail) => mail.is_primary)?.value || '';
  } else {
    const contactObj = leadData?.related_account?.phones?.find(
      (item: { isPrimary: boolean }) => item?.isPrimary
    );
    primaryContact = contactObj?.value;
    phoneType = contactObj?.phoneType || '';
    primaryEmail =
      leadData?.related_account?.emails?.find(
        (item: { isPrimary: boolean }) => item?.isPrimary
      )?.value || '';
  }
  return {
    phone: primaryContact || '',
    mail: primaryEmail || '',
    phoneType,
  };
};

// ** filter lead source **//

export const filterLeadSource = (leadSourceVal: number | string) => {
  const lead_source_obj: {
    old?: number;
    new?: { name: string };
  } = {
    old: undefined,
    new: undefined,
  };

  if (leadSourceVal) {
    if (Number.isSafeInteger(leadSourceVal)) {
      lead_source_obj.old = leadSourceVal as number;
    } else if (typeof leadSourceVal === 'string') {
      lead_source_obj.new = {
        name: leadSourceVal,
      };
    }
    return lead_source_obj;
  }
  return null;
};

export const setContacts = (related_contacts: RelatedContact[]) => {
  const sortedContacts = (related_contacts || [])
    .filter((val) => !val?.is_primary)
    .sort((a, b) => {
      return (a?.contact?.name || '').localeCompare(b?.contact?.name || '');
    });

  const primaryContact = related_contacts.find((item) => item?.is_primary);

  if (primaryContact) {
    sortedContacts.unshift(primaryContact);
  }

  const fillerData = sortedContacts.filter((val) => val?.contact !== null);

  if (fillerData.length === 0) {
    return sortedContacts?.map((val) => ({
      job_role: val?.job_role,
      is_primary: val?.is_primary,
    }));
  }
  return fillerData?.map((val) => ({
    contact_id: val?.contact_id,
    job_role: val?.job_role,
    is_primary: val?.is_primary,
  }));
};
