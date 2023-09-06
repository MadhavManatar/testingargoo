import { formatDistance } from 'date-fns';

export const agoTimeShow = (date: string) => {
  const distance = formatDistance(new Date(date), Date.now(), {
    addSuffix: true,
  });
  const distanceValue = distance.replace('about', '').trim();
  return distanceValue;
};
