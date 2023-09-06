// ======================================================
import { RelatedContact } from 'pages/Contact/types/contacts.types';
import {
  filterAccountData,
  filterContactData,
  filterContactDataForEdit,
  filterLeadSource,
} from 'pages/Lead/helper/leads.helper';
import {
  AddDealFormFieldsType,
  AddDealLostFormFieldsType,
  KeepTimelineEmails,
} from '../types/deals.types';

const generateDealFormData = (
  formVal: AddDealFormFieldsType,
  action?: string,
  lead_contacts?: RelatedContact[],
  keepTimelineEmails?: KeepTimelineEmails[]
) => {
  const DealFormData = new FormData();
  Object.keys(formVal).forEach((val) => {
    const key = val as keyof typeof formVal;
    DealFormData.append(key, formVal[key]?.toString()?.trim() || '');
  });
  DealFormData.append('is_deal', 'true');

  if (formVal.related_account) {
    DealFormData.set(
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
    DealFormData.set(
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
      DealFormData.set(
        'contacts',
        JSON.stringify(
          filterContactDataForEdit(formVal.contacts, lead_contacts)
        )
      );
    } else {
      DealFormData.set(
        'contacts',
        JSON.stringify(filterContactData(formVal.contacts))
      );
    }
  }
  if (formVal.lead_source) {
    DealFormData.set(
      'lead_source',
      JSON.stringify(filterLeadSource(formVal.lead_source))
    );
  }
  if (keepTimelineEmails && keepTimelineEmails.length) {
    DealFormData.set('keepTimelineEmails', JSON.stringify(keepTimelineEmails));
  }

  return DealFormData;
};

export const generateDealLostFormData = (
  formVal: AddDealLostFormFieldsType
) => {
  const DealFormData = new FormData();
  Object.keys(formVal).forEach((val) => {
    const key = val as keyof typeof formVal;

    DealFormData.append(key, formVal[key]?.toString()?.trim() || '');
  });
  DealFormData.append('is_deal', 'true');
  return DealFormData;
};

export default generateDealFormData;
