import { getLossyUrl, getParameterFromQueryString } from './url.helper';
import SearchEngines, { SearchEnginesDefinitions } from './helpers/search-engines-definitions';

let definitions: SearchEnginesDefinitions;
const loadDefinitions = () => {
  if (!definitions) {
    definitions = SearchEngines();
  }
  return definitions;
};

const getEngineHostFromUrl = (host: string, path: string, query: string): string => {
  const searchEngines = loadDefinitions();
  const hostPattern = getLossyUrl(host);

  /*
   * Try to get the best matching 'host' in definitions
   * 1. check if host + path matches an definition
   * 2. check if host only matches
   * 3. check if host pattern + path matches
   * 4. check if host pattern matches
   * 5. special handling
   */
  if (searchEngines.has(host + path)) {
    host = host + path;
  } else if (searchEngines.has(host)) {
    // no need to change host
  } else if (searchEngines.has(hostPattern + path)) {
    host = hostPattern + path;
  } else if (searchEngines.has(hostPattern)) {
    host = hostPattern;
  } else if (!searchEngines.has(host)) {
    if (query.substr(0, 15).indexOf('cx=partner-pub-') !== -1) {
      // Google custom search engine
      host = 'google.com/cse';
    } else if (path.substr(0, 28).indexOf('/pemonitorhosted/ws/results/') !== -1) {
      // private-label search powered by InfoSpace Metasearch
      host = 'wsdsold.infospace.com';
    } else if (host.indexOf('.images.search.yahoo.com') !== -1) {
      // Yahoo! Images
      host = 'images.search.yahoo.com';
    } else if (host.indexOf('.search.yahoo.com') !== -1) {
      // Yahoo!
      host = 'search.yahoo.com';
    } else {
      return null;
    }
  }

  return host;
};

export const getSearchEngineFromDomain = (referrer: URL): false | string => {
  let referrerHost = '';

  if (referrer?.host) {
    referrerHost = referrer?.host;
  }

  if (!referrerHost) {
    return false;
  }

  // some search engines (eg. Bing Images) use the same domain
  // as an existing search engine (eg. Bing), we must also use the url path
  let referrerPath = '';
  if (referrer.pathname !== undefined) {
    referrerPath = referrer.pathname;
  }

  let query = '';
  if (referrer.searchParams !== undefined) {
    query = referrer.searchParams.toString();
  }

  // Google Referrers URLs sometimes have the fragment which contains the keyword
  if (referrer.hash) {
    query += '&' + referrer.hash;
  }

  referrerHost = getEngineHostFromUrl(referrerHost, referrerPath, query);

  if (!referrerHost) {
    return false;
  }

  const definitions = loadDefinitions().get(referrerHost);
  let searchEngineName = definitions?.name;

  if (searchEngineName === 'Google') {
    // top bar menu
    const tbm = getParameterFromQueryString(query, 'tbm');
    switch (tbm) {
      case 'isch':
        searchEngineName = 'Google Images';
        break;
      case 'vid':
        searchEngineName = 'Google Video';
        break;
      case 'shop':
        searchEngineName = 'Google Shopping';
        break;
    }
  }

  return searchEngineName;
};

export default getSearchEngineFromDomain;
