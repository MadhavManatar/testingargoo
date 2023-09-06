export enum TIMELINE_FIELD_ICONS {
  Documents = 'attachmentFilledIcon',
  Notes = 'mobileMenuFilled',
  Emails = 'emailFilledBlueIcon',
  Email = 'emailFilledBlueIcon',
  Tags = 'offerTagsFilledIcon',
  'Job role' = 'userProfileFilledIcon',
  Phone = 'phoneFilled',
  'New Contact Created' = 'phoneFilled',
  'New Lead Created' = 'leadsFilledBlueIcon',
  'Deal value' = 'dealValueFilledIcon',
  default = 'contactCreatedFilledIcon',
  'Related account' = 'accountFilledBlueIcon',
}

export enum TIMELINE_MODEL {
  LEAD = 'leads',
  CONTACT = 'contacts',
  DEAL = 'deals',
  ACCOUNT = 'accounts',
  ACTIVITY = 'activities',
  USER = 'users',
  EMAIL = 'emails',
}

export const TIMELINE_DATE = {
  today: new Date(new Date().toDateString()),
  tomorrow: new Date(
    new Date(new Date().setDate(new Date().getDate() + 1)).toDateString()
  ),
  weekStart: new Date(
    new Date(
      new Date().setDate(new Date().getDate() - ((new Date().getDay() + 7) % 7))
    ).toDateString()
  ),
  weekEnd: new Date(
    new Date(
      new Date().setDate(
        new Date(
          new Date().setDate(
            new Date().getDate() - ((new Date().getDay() + 7) % 7)
          )
        ).getDate() + 6
      )
    ).toDateString()
  ),
  monthStart: new Date(new Date(new Date().setDate(1)).toDateString()),
  monthEnd: new Date(
    new Date(
      new Date(new Date().setMonth(new Date().getMonth() + 1)).setDate(0)
    ).toDateString()
  ),
  lastStart: new Date(
    new Date(
      new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)
    ).toDateString()
  ),
  lastEnd: new Date(new Date(new Date().setDate(0)).toDateString()),
  yearStart: new Date(
    new Date(new Date().getFullYear() - 1, 0, 1).toDateString()
  ),
  yearEnd: new Date(
    new Date(new Date().getFullYear() - 1, 11, 31).toDateString()
  ),
};

export const DATE_PRESET = [
  {
    label: 'Today',
    start: TIMELINE_DATE.today,
    end: TIMELINE_DATE.today,
  },
  {
    label: 'Tomorrow',
    start: TIMELINE_DATE.tomorrow,
    end: TIMELINE_DATE.tomorrow,
  },
  {
    label: "This Week",
    start: TIMELINE_DATE.weekStart,
    end: TIMELINE_DATE.weekEnd,
  },
  {
    label: 'This Month',
    start: TIMELINE_DATE.monthStart,
    end: TIMELINE_DATE.monthEnd,
  },
  {
    label: 'Last Month',
    start: TIMELINE_DATE.lastStart,
    end: TIMELINE_DATE.lastEnd,
  },
  {
    label: 'Last Year',
    start: TIMELINE_DATE.yearStart,
    end: TIMELINE_DATE.yearEnd,
  },
];
