import { IconTypes } from 'components/Icon';

export enum Tab {
  CONTACT = 'CONTACT',
  ACCOUNT = 'ACCOUNT',
  LEAD = 'LEAD',
  DEAL = 'DEAL',
}

export const TABS: readonly { id: Tab; icon: IconTypes }[] = Object.freeze([
  {
    id: Tab.ACCOUNT,
    icon: 'accountFilledBlueIcon',
  },
  {
    id: Tab.CONTACT,
    icon: 'phoneFilled',
  },
  {
    id: Tab.LEAD,
    icon: 'leadsFilledBlueIcon',
  },
  {
    id: Tab.DEAL,
    icon: 'dealsFilledBlueIcon',
  },
]);

export type TaBObj = {
  id: string;
  placeholder: string;
  label: string;
  moduleName: Tab;
};

export const TAB_CONTENT_OBJ: { [key in Tab]: TaBObj[] } = Object.freeze({
  [Tab.ACCOUNT]: [
    {
      id: 'account_owner',
      placeholder: 'Account Owner',
      label: 'Account Owner',
      moduleName: Tab.ACCOUNT,
    },
    {
      id: 'account_name',
      placeholder: 'Account Name',
      label: 'Account Name',
      moduleName: Tab.ACCOUNT,
    },
    {
      id: 'account_email',
      placeholder: 'Account Email',
      label: 'Account Email',
      moduleName: Tab.ACCOUNT,
    },
    {
      id: 'account_address',
      placeholder: 'Account Address',
      label: 'Account Address',
      moduleName: Tab.ACCOUNT,
    },
    {
      id: 'account_contact_name',
      placeholder: 'Contact Name',
      label: 'Contact Name',
      moduleName: Tab.ACCOUNT,
    },
  ],
  [Tab.CONTACT]: [
    {
      id: 'contact_owner',
      placeholder: 'Contact owner',
      label: 'Contact Owner',
      moduleName: Tab.CONTACT,
    },
    {
      id: 'contact_name',
      placeholder: 'Contact Name',
      label: 'Contact Name',
      moduleName: Tab.CONTACT,
    },
    {
      id: 'contact_account_name',
      placeholder: 'Account Name',
      label: 'Account Name',
      moduleName: Tab.CONTACT,
    },
    {
      id: 'contact_email',
      placeholder: 'Contact Email',
      label: 'Contact Email',
      moduleName: Tab.CONTACT,
    },
    {
      id: 'contact_phone',
      placeholder: 'Contact Phone',
      label: 'Contact Phone',
      moduleName: Tab.CONTACT,
    },
    {
      id: 'job_role',
      placeholder: 'Job Role',
      label: 'Job Role',
      moduleName: Tab.CONTACT,
    },
  ],
  [Tab.LEAD]: [
    {
      id: 'lead_owner',
      placeholder: 'Lead Owner',
      label: 'Lead Owner',
      moduleName: Tab.LEAD,
    },
    {
      id: 'lead_name',
      placeholder: 'Lead Name',
      label: 'Lead Name',
      moduleName: Tab.LEAD,
    },
    {
      id: 'lead_related_account',
      placeholder: 'Related Account',
      label: 'Related Account',
      moduleName: Tab.LEAD,
    },
    {
      id: 'lead_related_contact',
      placeholder: 'Related Contact',
      label: 'Related Contact',
      moduleName: Tab.LEAD,
    },
    {
      id: 'lead_value',
      placeholder: 'Lead Value',
      label: 'Lead Value',
      moduleName: Tab.LEAD,
    },
  ],
  [Tab.DEAL]: [
    {
      id: 'deal_owner',
      placeholder: 'Deal Owner',
      label: 'Deal Owner',
      moduleName: Tab.DEAL,
    },
    {
      id: 'deal_name',
      placeholder: 'Deal Name',
      label: 'Deal Name',
      moduleName: Tab.DEAL,
    },
    {
      id: 'deal_related_account',
      placeholder: 'Related Account',
      label: 'Related Account',
      moduleName: Tab.DEAL,
    },
    {
      id: 'deal_related_contact',
      placeholder: 'Related Contact',
      label: 'Related Contact',
      moduleName: Tab.DEAL,
    },
    {
      id: 'deal_value',
      placeholder: 'Deal Value',
      label: 'Deal Value',
      moduleName: Tab.DEAL,
    },
    {
      id: 'closing_date',
      placeholder: 'Closing Date',
      label: 'Closing Date',
      moduleName: Tab.DEAL,
    },
    {
      id: 'pipeline',
      placeholder: 'Pipeline',
      label: 'Pipeline',
      moduleName: Tab.DEAL,
    },
    {
      id: 'pipeline_stage',
      placeholder: 'Pipeline Stage',
      label: 'Pipeline Stage',
      moduleName: Tab.DEAL,
    },
  ],
});
