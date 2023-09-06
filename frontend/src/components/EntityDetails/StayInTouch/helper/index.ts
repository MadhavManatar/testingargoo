import { RRule } from 'rrule';
import { formatISO, isToday } from 'date-fns';

const getByWeekDayForMonths = (week_occur: number, week_day: number) => {
  switch (week_day) {
    case 0:
      return [RRule.SU.nth(week_occur)];
    case 1:
      return [RRule.MO.nth(week_occur)];
    case 2:
      return [RRule.TU.nth(week_occur)];
    case 3:
      return [RRule.WE.nth(week_occur)];
    case 4:
      return [RRule.TH.nth(week_occur)];
    case 5:
      return [RRule.FR.nth(week_occur)];

    default:
      return [RRule.SA.nth(week_occur)];
  }
};

const getByWeekDay = (week_day_for_week: number | null) => {
  switch (week_day_for_week) {
    case 0:
      return [RRule.SU];
    case 1:
      return [RRule.MO];
    case 2:
      return [RRule.TU];
    case 3:
      return [RRule.WE];
    case 4:
      return [RRule.TH];
    case 5:
      return [RRule.FR];

    default:
      return [RRule.SA];
  }
};

const nextActivityDate = (dateTime: Date[], isSkip?: boolean) => {
  if (isSkip) {
    return formatISO(!isToday(dateTime[1]) ? dateTime[1] : dateTime[2]);
  }

  return formatISO(!isToday(dateTime[0]) ? dateTime[0] : dateTime[1]);
};

export const getNextActivityDate = (
  props: {
    freq: string;
    interval: number;
    monthDateType: 'each' | 'on_the' | null;
    week_occur: number;
    week_day: number;
    monthSelectYear: number;
    selectMonthDate: number;
    week_day_for_week: number | null;
    date: Date;
  },
  isSkip?: boolean
) => {
  const {
    freq,
    interval,
    monthDateType,
    monthSelectYear,
    selectMonthDate,
    week_day,
    week_day_for_week,
    week_occur,
    date,
  } = props;

  if (freq === 'daily') {
    const weekRule = new RRule({
      dtstart: date,
      freq: RRule.DAILY,
      interval,
      count: 3,
    });
    const oneWeekFromNow = weekRule.all();

    return nextActivityDate(oneWeekFromNow, isSkip);
  }

  if (freq === 'yearly') {
    const yearRule = new RRule({
      dtstart: date,
      freq: RRule.YEARLY,
      bymonth: monthSelectYear + 1,
      byweekday: getByWeekDayForMonths(week_occur, week_day),
      count: 3,
      interval,
    });
    const oneYearFromNow = yearRule.all();

    return nextActivityDate(oneYearFromNow, isSkip);
  }

  if (freq === 'monthly' && monthDateType === 'each') {
    const monthRule = new RRule({
      dtstart: date,
      freq: RRule.MONTHLY,
      count: 3,
      bymonthday: [selectMonthDate],
      interval,
    });

    const oneMonthFromNow = monthRule.all();
    return nextActivityDate(oneMonthFromNow, isSkip);
  }

  if (freq === 'monthly' && monthDateType === 'on_the') {
    const nthMonthRule = new RRule({
      freq: RRule.MONTHLY,
      byweekday: getByWeekDayForMonths(week_occur, week_day),
      count: 3,
      interval,
    });

    const nthMonthFromNow = nthMonthRule.all();
    return nextActivityDate(nthMonthFromNow, isSkip);
  }

  if (freq === 'weekly') {
    const weekRule = new RRule({
      dtstart: date,
      freq: RRule.WEEKLY,
      byweekday: getByWeekDay(week_day_for_week),
      count: 3,
      interval,
    });
    const oneWeekFromNow = weekRule.all();

    return nextActivityDate(oneWeekFromNow, isSkip);
  }
};
