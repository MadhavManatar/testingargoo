const today: Date = new Date(new Date().toDateString());
const endToday: Date = new Date(new Date(today).setHours(23, 59, 0, 0));
const tomorrow: Date = new Date(
  new Date(new Date().setDate(new Date().getDate() + 1)).toDateString()
);
const endTomorrow: Date = new Date(
  new Date(new Date().setDate(new Date().getDate() + 1)).setHours(0, 0, 0, 0)
);
const weekStart: Date = new Date(
  new Date(
    new Date().setDate(new Date().getDate() - ((new Date().getDay() + 7) % 7))
  ).toDateString()
);

function getNextWeekEnd() {
  const weekEndDate = new Date(new Date());
  // Calculate End Of the week
  weekEndDate.setDate(new Date().getDate() + (6 - new Date().getDay()));
  return weekEndDate;
}
const weekEnd: Date = getNextWeekEnd();

const monthStart: Date = new Date(
  new Date(new Date().setDate(1)).toDateString()
);
const monthEnd: Date = new Date(
  new Date(
    new Date(new Date().setMonth(new Date().getMonth() + 1)).setDate(0)
  ).toDateString()
);
const lastStart: Date = new Date(
  new Date(
    new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)
  ).toDateString()
);
const lastEnd: Date = new Date(new Date(new Date().setDate(0)).toDateString());
const yearStart: Date = new Date(
  new Date(new Date().getFullYear() - 1, 0, 1).toDateString()
);
const yearEnd: Date = new Date(
  new Date(new Date().getFullYear() - 1, 11, 31).toDateString()
);
export const dateConst = {
  today,
  endToday,
  yearEnd,
  yearStart,
  lastEnd,
  lastStart,
  monthEnd,
  monthStart,
  weekEnd,
  weekStart,
  tomorrow,
  endTomorrow,
};
