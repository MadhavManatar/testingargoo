export const module_followers = {
  select: 'id,first_name,last_name,full_name',
  'include[lead_followers][select]': 'id',
  'include[lead_followers][include][lead][select]': 'id,name,is_deal',
  'include[lead_followers][include][lead][required]': true,
  'include[lead_followers][include][lead][q][is_deal]': false,
  'include[lead_followers][separate]': true,
  'include[lead_followers][limit]': 15,
  'include[lead_followers][page]': 1,
  'include[deal_followers][select]': 'id',
  'include[deal_followers][include][lead][select]': 'id,name,is_deal',
  'include[deal_followers][include][lead][q][is_deal]': true,
  'include[deal_followers][include][lead][required]': true,
  'include[deal_followers][separate]': true,
  'include[deal_followers][limit]': 15,
  'include[deal_followers][page]': 1,
  'include[contact_followers][select]': 'id',
  'include[contact_followers][include][contact][select]': 'id,name',
  'include[contact_followers][include][contact][required]': true,
  'include[contact_followers][separate]': true,
  'include[contact_followers][limit]': 15,
  'include[contact_followers][page]': 1,
  'include[account_followers][select]': 'id',
  'include[account_followers][include][account][select]': 'id,name',
  'include[account_followers][include][account][required]': true,
  'include[account_followers][separate]': true,
  'include[account_followers][limit]': 15,
  'include[account_followers][page]': 1,
  'include[activity_followers][select]': 'id',
  'include[activity_followers][include][activity][select]': 'id,topic',
  'include[activity_followers][include][activity][required]': true,
  'include[activity_followers][limit]': 15,
  'include[activity_followers][page]': 1,
  'include[activity_followers][separate]': true,
};

export const getModelQuery = (moduleName: string, search?: string) => {
  const moduleQueryMapper: Record<string, any> = {
    leads: {
      ...(search && { 'q[lead.name][iLike]': search }),
    },
    deals: {
      ...(search && { 'q[lead.name][iLike]': search }),
    },
    activities: {
      'include[activity][select]': 'id,topic',
      'include[activity][required]': true,
      ...(search && { 'q[activity.topic][iLike]': search }),
    },
    contacts: {
      'include[contact][select]': 'id,name',
      'include[contact][required]': true,
      ...(search && { 'q[contact.name][iLike]': search }),
    },
    accounts: {
      'include[account][select]': 'id,name',
      'include[account][required]': true,
      ...(search && { 'q[account.name][iLike]': search }),
    },
  };

  return moduleQueryMapper[moduleName];
};

export const moduleTypeKeys = {
  leads: 'lead',
  deals: 'lead',
  contacts: 'contact',
  accounts: 'account',
  activities: 'activity',
};

export const followingEntitiesIcons = {
  lead: 'leadsFilledBlueIcon',
  deal: 'dealsFilledBlueIcon',
  contact: 'phoneFilledBlueIcon',
  account: 'accountFilledBlueIcon',
  activity: 'activitiesFilledBlueIcon',
};
