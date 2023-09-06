export const phoneRegex =
  /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

export const zipCodeRegex = /^\d{5,10}$/;

export const emailRegex =
  /(?=^(?:[A-Za-z0-9_\xC0-\xFF!#$%&'*+/=?^`{|}~\\-]\.?){0,63}[A-Za-z0-9_\xC0-\xFF!#$%&'*+/=?^`{|}~\\-]@[A-Za-z0-9\xC0-\xFF](?:[A-Za-z0-9\xC0-\xFF-]{0,61}[A-Za-z0-9\xC0-\xFF])?(?:\.[A-Za-z\xC0-\xFF](?:[A-Za-z0-9\xC0-\xFF-]{0,61}[A-Za-z0-9\xC0-\xFF])?)*$)(?=^.{3,254}$)/;

export const urlRegex =
  /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;

export const facebookProfileURLRegex =
  /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9]+\/?$/;

export const twitterProfileURLRegex =
  /^(https?:\/\/)?(www\.)?twitter\.com\/([a-zA-Z0-9_]{1,15})\/?$/;

export const linkedInProfileURLRegex =
  /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-z0-9_-]+\/?$/;

export const onlyNumberRegex = /^[0-9]+$/;
export const faxRegex =
  /^(\+?\d{1,}(\s?|-?)\d*(\s?|-?)\(?\d{2,}\)?(\s?|-?)\d{3,}\s?\d{3,})$/;

export const probabilityFloatRegex = /^((100)|(\d{1,2}(\.\d{1,2})?))$/g;

export const maskInputRegex = [
  '(',
  /[1-9]/,
  /\d/,
  /\d/,
  ')',
  ' ',
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

export const maskInputRegexForTime = [/[0-9]/, /\d/, ':', /\d/, /\d/];

export const currencyFormatRegex = /^\$\d{1,3}(,\d{3})*(\.\d+)?$/;

export const maskInputRegexForMailScheduleDate = [
  /[0-9]/,
  /\d/,
  '/',
  /[0-9]/,
  /\d/,
  '/',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];
