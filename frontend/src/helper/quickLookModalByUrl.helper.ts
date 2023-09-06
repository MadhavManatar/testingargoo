
export const createModalNameByUrl = (pathname: string): string => {
  let name = '';
  if (pathname.includes('activities/')) {
    name = 'activities';
  } else if (pathname.includes('leads/')) {
    name = 'leads';
  } else if (pathname.includes('contacts/')) {
    name = 'contacts';
  } else if (pathname.includes('accounts/')) {
    name = 'accounts';
  } else if (pathname.includes('deals/')) {
    name = 'deals';
  } else {
    name = '';
  }
  return name;
};
