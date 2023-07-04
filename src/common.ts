import { htmlEntityDecode, htmlSpecialChars, utf8Encode } from './php';

const sanitizeLineBreaks = (value: string): string => {
  return value.replace(/[\n\r]/g, '');
};

const sanitizeNullBytes = (value: string): string => {
  return value.replace(/[\0]/g, '');
};

const sanitizeString = (value: string) => {
  value = htmlEntityDecode(value, 'ENT_QUOTES');
  value = sanitizeNullBytes(value);
  let tmp = htmlSpecialChars(value, 'ENT_QUOTES', 'UTF-8');

  if (value !== '' && tmp === '') {
    value = utf8Encode(value);
    tmp = htmlSpecialChars(value, 'ENT_QUOTES', 'UTF-8');
    return tmp;
  }

  return tmp;
};

/**
 * Sanitize a single input value and removes line breaks, tabs and null characters.
 *
 * @param value
 * @return string  sanitized input
 */
export const sanitizeInputValue = (value: string): string => {
  value = sanitizeLineBreaks(value);
  value = sanitizeString(value);
  return value;
};
