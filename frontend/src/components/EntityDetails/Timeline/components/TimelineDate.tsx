import DateFormat from 'components/DateFormat';

export const TimelineDate = ({ date }: { date: Date | string }) => {
  date = new Date(date).toLocaleDateString(undefined, { dateStyle: 'long' });
  const now = new Date();

  if (date === now.toLocaleDateString(undefined, { dateStyle: 'long' })) {
    return <span>Today</span>;
  }

  now.setDate(now.getDate() - 1);
  if (date === now.toLocaleDateString(undefined, { dateStyle: 'long' })) {
    return <span>Yesterday</span>;
  }

  return <DateFormat format="MM/dd/yyyy" date={date} />;
};
