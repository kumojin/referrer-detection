import RegionDataProvider from './region-data-provider';
import { sanitizeInputValue } from './common';

/**
 * Reduce URL to more minimal form.  2 letter country codes are
 * replaced by '{}', while other parts are simply removed.
 *
 * Examples:
 *   www.example.com -> example.com
 *   search.example.com -> example.com
 *   m.example.com -> example.com
 *   de.example.com -> {}.example.com
 *   example.de -> example.{}
 *   example.co.uk -> example.{}
 *
 * @param url
 * @return string
 */
export const getLossyUrl = (url: string): string => {
  const countries = Array.from(RegionDataProvider().keys()).join('|');

  return url
    .replace(/^(w+[0-9]*|search)\./g, '')
    .replace(/(^|\.)m\./g, (_, $1) => $1)
    .replace(new RegExp(`(\\.(com|org|net|co|it|edu))?\\.(${countries})(\\/|$)`, 'g'), (_, $1, $2, $3, $4) => `.{}${$4}`)
    .replace(new RegExp(`(^|\\.)(${countries})\\.`, 'g'), (_, $1) => `${$1}{}.`);
};

export const parseUrl = (url: string): URL => {
  try {
    return new URL(url);
  } catch {
    return null;
  }
};

/**
 * Returns a URL query string as an array.
 *
 * @param urlQuery The query string, eg, `'?param1=value1&param2=value2'`.
 * @return object eg, `{param1: 'value1', param2: 'value2'}`
 */
export const getArrayFromQueryString = (urlQuery: string) => {
  if (!urlQuery) {
    return {};
  }

  if (urlQuery[0] === '?') {
    urlQuery = urlQuery.substr(1);
  }
  const separator = '&';
  urlQuery = separator + urlQuery;
  const referrerQuery = urlQuery.trim();

  const values = referrerQuery.split(separator);

  const nameToValue = {};

  values.forEach(it => {
    let name: string;
    let value: string | [] | false;

    const pos = it.indexOf('=');
    if (pos !== -1) {
      name = it.substr(0, pos);
      value = it.substr(pos + 1);
    } else {
      name = it;
      value = false;
    }

    if (name) {
      name = sanitizeInputValue(name);
    }

    if (value) {
      value = sanitizeInputValue(value);
    }

    const tmp = name.replace(/(\[|%5b)(]|%5d)$/i, '');
    if (tmp && tmp !== name) {
      name = tmp;
      if (!nameToValue[name] || !Array.isArray(nameToValue[name])) {
        nameToValue[name] = [];
      }
      nameToValue[name].push(value);
    } else if (name) {
      nameToValue[name] = value;
    }
  });

  return nameToValue;
};

/**
 * Returns the value of a single query parameter from the supplied query string.
 *
 * @param urlQuery The query string.
 * @param parameter The query parameter name to return.
 * @return string|null Parameter value if found (can be the empty string!), null if not found.
 */
export const getParameterFromQueryString = (urlQuery: string, parameter: string): string | null => {
  const nameToValue = getArrayFromQueryString(urlQuery);

  if (nameToValue[parameter] !== undefined) {
    return nameToValue[parameter];
  }

  return null;
};
