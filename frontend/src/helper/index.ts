import axios from 'axios';
import { MutableRefObject } from 'react';
import { FieldErrors } from 'react-hook-form';
import { formatPhoneNumber } from 'utils/util';

export const downloadAttachmentFile = async ({
  url,
  fileName,
}: {
  url: string;
  fileName: string;
}) => {
  const originalImage = `${url}`;
  const linkTag = document.createElement('a');
  linkTag.download = fileName;

  const response = await axios(originalImage, {
    headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache', Expires: '0' },
    responseType: 'blob',
  });

  linkTag.href = URL.createObjectURL(response.data);
  linkTag.click();
};

export const formattedPhoneTextForTippy = (props: {
  type?: string;
  number?: string;
}) => {
  const { type, number } = props;
  const phoneType = type ? `${type} :` : '';
  return `${phoneType} ${formatPhoneNumber(number?.toString())}`;
};

export const focusOnError = (
  ref: MutableRefObject<Record<string, HTMLDivElement | null>>,
  errors: FieldErrors<any> | undefined = {}
) => {
  const firstErrorKey = Object.keys(errors)?.[0];

  if (firstErrorKey && Object.hasOwn(ref?.current, firstErrorKey)) {
    ref?.current?.[firstErrorKey]?.scrollIntoView();
  }
};
