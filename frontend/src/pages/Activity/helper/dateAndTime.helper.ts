// ** Import Packages ** //
import { differenceInSeconds } from 'date-fns';

export const generateCustomizeDate = (
  dateParam: Date,
  timeParam: Date,
  minuteGap?: number | string
) => {
  return new Date(
    new Date(dateParam).getFullYear(),
    new Date(dateParam).getMonth(),
    new Date(dateParam).getDate(),
    new Date(timeParam).getHours(),
    new Date(timeParam).getMinutes() + (parseInt(minuteGap as string, 10) || 0)
  );
};

export const calculateLogOnTime = (
  data: { end_date: string | Date; start_date: string | Date }[]
) => {
  const result = data?.reduce((currentResult, val) => {
    return (
      currentResult +
      differenceInSeconds(new Date(val?.end_date), new Date(val?.start_date))
    );
  }, 0);

  if (result > 0) {
    const seconds = result % 60;
    const minutes = Math.floor((result % 3600) / 60);
    const hours = Math.floor((result % (24 * 3600)) / 3600);
    const days = Math.floor(result / (24 * 3600));

    let timeLog = '';
    if (days > 0) {
      timeLog += `${days} day`;
      if (days > 1) {
        timeLog += 's';
      }
      timeLog += ', ';
    }
    if (hours > 0) {
      timeLog += `${hours} hour`;
      if (hours > 1) {
        timeLog += 's';
      }
      timeLog += ', ';
    }
    if (minutes > 0) {
      timeLog += `${minutes} minute`;
      if (minutes > 1) {
        timeLog += 's';
      }
      timeLog += ', ';
    }
    timeLog += `${seconds} second`;
    if (seconds > 1) {
      timeLog += 's';
    }

    return timeLog?.length
      ? timeLog?.split(',', 2).toString().replace(',', ' ')
      : '-';
  }
  return '-';
};
