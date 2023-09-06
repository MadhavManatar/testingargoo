export const sinceOfDateTime = (dateTime: Date | string) => {
  dateTime = new Date(dateTime);
  const now = new Date();

  const seconds = (now.getTime() - dateTime.getTime()) / 1000;
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const oneDay = 24 * 60 * 60 * 1000;
  const days = Math.round(
    Math.abs((now.getTime() - dateTime.getTime()) / oneDay)
  );
  const months = (() => {
    let totalMonths;
    totalMonths = (now.getFullYear() - dateTime.getFullYear()) * 12;
    totalMonths -= dateTime.getMonth();
    totalMonths += now.getMonth();
    return totalMonths <= 0 ? 0 : totalMonths;
  })();
  const years = now.getFullYear() - dateTime.getFullYear();

  // date data formate for generate message
  const formatted = {
    time: dateTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }),
    day: dateTime.toLocaleDateString(undefined, { weekday: 'long' }),
    month: dateTime.toLocaleDateString(undefined, { month: 'long' }),
    date: `${dateTime.getDate()}${getOrdinalSuffix(dateTime.getDate())}`,
    year: dateTime.getFullYear(),
  };
  const { time, day, month, date, year } = formatted;
  // find message to show
  if (years !== 0) {
    return `${years === 1 ? 'Last year' : `${years} Year ago`
      } | ${day}, ${month} ${date}, ${year} at ${time}`;
  }
  if (months > 0 && years === 0) {
    return `${months === 1 ? 'Last month' : `${months} Month ago`
      } | ${day}, ${month} ${date} at ${time}`;
  }
  if (days > 1 && months === 0) {
    return `${days} Days ago | ${day}, ${month} ${date} at ${time}`;
  }
  if (days === 1 && dateTime.getHours() >= 17 && dateTime.getHours() < 24) {
    return `Yesterday evening at ${time}`;
  }
  if (days === 1 && dateTime.getHours() >= 12 && dateTime.getHours() <= 17) {
    return `Yesterday afternoon at ${time}`;
  }
  if (days === 1 && dateTime.getHours() < 12) {
    return `Yesterday morning at ${time}`;
  }
  if (hours > 2 && days === 0) {
    return `Earlier today at ${time}`;
  }
  if (hours > 1 && !(hours > 2)) {
    return `2 Hours ago at ${time}`;
  }
  if (hours > 0 && !(hours > 1)) {
    return `1 Hour ago at ${time}`;
  }
  if (minutes > 29 && !(hours > 0)) {
    return `30 Minutes ago at ${time}`;
  }
  if (minutes > 1 && !(minutes > 30)) {
    return `A few minutes ago at ${time}`;
  }
  if (minutes > 0 && !(minutes > 1)) {
    return `One minute ago at ${time}`;
  }
  if (seconds > 10 && !(minutes > 0)) {
    return 'A few seconds ago';
  }
  if (seconds < 10) {
    return 'Just now';
  }
};

function getOrdinalSuffix(day: number) {
  if (day >= 11 && day <= 13) {
    return 'th';
  }
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}
