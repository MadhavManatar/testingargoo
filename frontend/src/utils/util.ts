// ** import packages **
import {
  addDays,
  differenceInMilliseconds,
  format,
  differenceInDays,
} from 'date-fns';
import _ from 'lodash';

// ** constant **
import { FILE_EXTENSION } from 'constant';
import { emailRegex } from 'constant/regex.constant';

// ** helper **
import { clearIndexDBStorage } from 'services/indexDB.service';

export const parseData = (data: any) => {
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
};

export const convertNumberOrNull = (
  value: string | number | null | undefined
) => {
  return value && !Number.isNaN(Number(value)) ? Number(value) : null;
};

export const generateFirstLetter = (name: string | undefined) => {
  return name ? name.trim().slice(0, 1).toUpperCase() : '';
};

export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  delay = 500
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: any[]) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), delay);
  };
};

export const checkFileType = (file: File | string) => {
  if (typeof file !== 'string') {
    return file.type;
  }
  const extension = file.substring(file.lastIndexOf('.'));
  let mime;
  if (extension as keyof typeof FILE_EXTENSION) {
    mime = FILE_EXTENSION[extension as keyof typeof FILE_EXTENSION];
  }
  return mime;
};

export const srcFilePath = (file: string | File, serverPath = false) => {
  if (typeof file === 'string') {
    if (serverPath) {
      return `${file}`;
    }
  } else if (file) {
    return URL.createObjectURL(file);
  } else {
    return file;
  }
};

export const fileSizeGenerator = (fileSize: number) => {
  const sizeType = ['KB', 'MB', 'GB'];
  let i = -1;
  let size = fileSize;
  while (size > 1024) {
    size /= 1024;
    i++;
  }

  return { size: Math.max(size, 0.1).toFixed(1), sizeType: sizeType[i] };
};

export const removeElementFromArray = (array: any[], element: any) => {
  const index = array.indexOf(element);
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
};

export const formatMaskValue = (
  value: string | number,
  inputTypeName: string
) => {
  switch (inputTypeName) {
    case 'mask_input_phone':
      if (value) {
        const cleaned = value?.toString()?.replace(/\D/g, '') || '';
        const match = cleaned?.match(
          /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
        );
        if (match) {
          const intlCode = match[1] ? '+1 ' : '';
          return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join(
            ''
          );
        }
        return cleaned;
      }
      return null;
    case 'mask_input_time':
    default:
      return value;
  }
};

export const formatAsPercentage = (num?: string) => {
  if (!num) {
    return '';
  }

  return `${parseFloat(num)}%`;
};

export const logger = (value: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('error------', value?.message ? value?.message : value);
  }
};

export const changeMaskInputValueFunction = (
  value: string,
  fieldName: string,
  onChange: (...event: any[]) => void
) => {
  switch (fieldName) {
    case 'mask_input_phone':
      return onChange(value.length ? value?.replace(/[^A-Z0-9]/gi, '') : value);
    case 'mask_input_time':
    default:
      return onChange(value);
  }
};

export const formatPhoneNumber = (value = '') => {
  if (typeof value === 'string') {
    const cleaned = value?.replace(/\D/g, '');
    const match = cleaned?.match(
      /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
    );
    if (match) {
      const intlCode = match[1] ? '+1 ' : '';
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return null;
  }
  return null;
};

export const isIsoDate = (str: any) => {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  const d = new Date(str);
  return d instanceof Date && !Number.isNaN(d) && d.toISOString() === str; // valid date
};

export const isValidDate = (value: any) => {
  if (value) {
    if (!Number.isNaN(new Date(value).getTime())) {
      return true;
    }
    return false;
  }
  return false;
};

export const checkInputIsNumber = (e: any) => {
  const k = e.which;
  if ((k < 48 || k > 57) && (k < 96 || k > 105) && k !== 8) {
    e.preventDefault();
    return false;
  }
};

export const convertBtoA = (value: any) => {
  try {
    return window.btoa(encodeURIComponent(value));
  } catch (error) {
    return value;
  }
};

export const convertAtoB = (value: any) => {
  try {
    return decodeURIComponent(window.atob(value));
  } catch (error) {
    return value;
  }
};

export const getFileNameFromUrl = (url: string) => {
  return url.split('/').pop();
};

export const isValidEmail = (value: string) => {
  if (value) {
    if (emailRegex?.test(value)) {
      return true;
    }
    return false;
  }
  return !!value;
};

export const dateToTimeFormatter = (val: string) => {
  return format(new Date(val), 'h:mm aa');
};

export const checkAndReturnDateAndLabel = (val: string) => {
  if (val && val.length < 0) return null;
  if (val === 'today') return `Today's`;
  if (val === 'upcoming') return `Upcoming`;
  if (val === 'past') return `Past Due`;
  return 'Today';
};

export const checkAndReturnActualDateOrDay = (val: string) => {
  if (val && val.length < 0) return null;
  const actualDate = format(new Date(val), 'MMM-dd-yyyy');
  const actualDateTomorrow = format(new Date(val), 'MMM-dd-yyyy');
  const today = format(new Date(), 'MMM-dd-yyyy');
  const tomorrow = format(addDays(new Date(), 1), 'MMM-dd-yyyy');

  if (actualDate === today) return 'Today';
  if (actualDateTomorrow === tomorrow) return 'Tomorrow';
  return null;
};

export const checkAndReturnActualDateOrTime = (val: string) => {
  const actualDate = format(new Date(val), 'MMM-dd-yyyy');
  const today = format(new Date(), 'MMM-dd-yyyy');
  const currentDateYear = new Date().getFullYear();
  const actualDateYear = new Date(val).getFullYear();

  if (actualDate === today) return format(new Date(val), 'h:mm a');
  if (currentDateYear === actualDateYear) {
    return format(new Date(val), 'dd MMM');
  }
  return actualDate;
};

export const checkVowels = (val: string) => {
  const firstChar = val.charAt(0);
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  if (vowels.includes(firstChar.toLocaleLowerCase())) return `an ${val}`;
  return `a ${val}`;
};

export const usCurrencyFormat = (value: any) =>
  value
    ? `$${Number(value)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
    : '';

export const isValidMaxLength = (InputValue: string) => {
  const inputMaxLength = 10;
  if (inputMaxLength) {
    if (InputValue?.length > inputMaxLength) {
      return false;
    }
    return !!InputValue;
  }
  return !!InputValue;
};

export const htmlToString = (string: string) => {
  return string.replace(/<[^>]+>/g, '');
};

export function dateToMilliseconds(props: { startDate?: Date; endDate: Date }) {
  const { startDate = new Date(), endDate } = props;
  return differenceInMilliseconds(endDate, startDate);
}

export const searchItemFromArray = (data: any[], search: string) => {
  const searchData = data.filter((obj) => {
    return JSON.stringify(obj?.template_name || '')
      .toLocaleLowerCase()
      .includes(search.trim().toString());
  });
  if (_.isArray(searchData)) {
    return searchData;
  }
  return [];
};

export const setUrlParams = (url: string, Id: number | string) => {
  return url.replace(':id', Id?.toString());
};

export const isInt = (n: number) => {
  return n % 1 === 0;
};

export const convertStringToIntegerForAccountContacts = (
  str: string,
  isCreatable?: boolean
) => {
  if (isCreatable) {
    return str;
  }

  if (typeof str !== 'string') return false;

  const id = Number(str);
  if (isInt(id)) {
    return id;
  }

  return str;
};

export const convertStringToIntegerForRelatedContacts = (
  str: string,
  isCreatable?: boolean
) => {
  if (isCreatable) {
    return str;
  }

  const id = Number(str);
  if (isInt(id)) {
    return id;
  }

  return str;
};

export const Capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const convertISODate = (dateStr: string) => {
  const dateObj = new Date(dateStr);
  const pad = (num: number) => {
    let r = String(num);
    if (r.length === 1) {
      r = `0${r}`;
    }
    return r;
  };

  const toISO = () => {
    return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(
      dateObj.getDate()
    )}T${pad(0)}:${pad(0)}:${pad(0)}.${String((0).toFixed(3)).slice(2, 5)}Z`;
  };

  return toISO();
};

export const clearBrowserCookiesAndStorage = () => {
  const rememberMeData = localStorage.getItem('remember-me');
  const clientIp = localStorage.getItem('clientIp');

  localStorage.clear();
  if (clientIp) {
    localStorage.setItem('clientIp', clientIp);
  }
  if (rememberMeData) localStorage.setItem('remember-me', rememberMeData);
  document.cookie.split(';').forEach((cookie) => {
    document.cookie = cookie
      .replace(/^ +/, '')
      .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
  });
  clearIndexDBStorage();
};

export const copyToClipboard = (value: string) => {
  navigator.clipboard.writeText(value);
};

export const OrdinalSuffixOf = (i?: number) => {
  if (!i) {
    return '';
  }

  const j = i % 10;
  const k = i % 100;
  if (j === 1 && k !== 11) {
    return `${i}st`;
  }
  if (j === 2 && k !== 12) {
    return `${i}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${i}rd`;
  }
  return `${i}th`;
};

export const convertStringToBoolean = (value: string) => {
  return value === 'true';
};

// Get font color based on the background Color
export const fontColorBasedOnBgColor = (
  hex: string | undefined,
  lightColor: string,
  darkColor: string
): string => {
  if (hex) {
    const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!match) return darkColor;
    const [, red, green, blue] = match;
    const Luminance =
      0.2126 * parseInt(red, 16) +
      0.7152 * parseInt(green, 16) +
      0.0722 * parseInt(blue, 16);
    return Luminance > 186 ? darkColor : lightColor;
  }
  return darkColor;
};
export const fontColorBasedOnBgColorNew = (
  bgColor: string,
  lightColor: string,
  darkColor: string
): string => {
  const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16); // hexToR
  const g = parseInt(color.substring(2, 4), 16); // hexToG
  const b = parseInt(color.substring(4, 6), 16); // hexToB
  const uiColors = [r / 255, g / 255, b / 255];
  const c = uiColors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return ((col + 0.055) / 1.055) ** 2.4;
  });
  const L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return L > 0.179 ? darkColor : lightColor;
};

export const uniqueArray = (array: any[], keyProps: string[]) => {
  const kvArray = array.map((entry, index) => {
    const key =
      entry.relation_model_name === 'emails'
        ? keyProps.map((k) => entry[k]).join('|')
        : index;
    return [key, entry];
  });
  const map = new Map(kvArray as Iterable<readonly [unknown, unknown]>);
  return Array.from(map.values());
};

// Calculate Age
export const calculateLeadAge = (createdDate: Date) => {
  let totalDealAge = '';
  const currentTime = new Date();
  const day = differenceInDays(currentTime, new Date(createdDate));
  totalDealAge = `${day} Days`;
  return totalDealAge;
};

// Average Of Array
export const calculateAverageOfArray = (array: number[]) => {
  let total = 0;
  let count = 0;
  if (array.length > 0) {
    array.forEach((item: number) => {
      total += item;
      count++;
    });
    return Math.ceil(total / count);
  }
  return 0;
};

// ** slugify ** //

export const slugify = (str: string) => {
  return (
    str &&
    str
      .trim()
      .split(' ')
      .map((value) => value.toLowerCase())
      .join('_')
  );
};
