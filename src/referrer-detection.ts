import { getParameterFromQueryString, parseUrl } from './url.helper';
import SearchEngineDetection from './search-engine-detection';
import SocialNetworkDetection from './social-network-detection';
import { Referrer, ReferrerType } from './type';

export const detectDirect = (referrerUrlString: string, currentUrlString: string): [boolean, Referrer?] => {
  const currentUrl = parseUrl(currentUrlString);
  const referrerUrl = parseUrl(referrerUrlString);

  if (!currentUrl || !referrerUrl) {
    return [false];
  }

  if (currentUrl.host === referrerUrl.host) {
    return [true, { type: ReferrerType.DIRECT }];
  }

  return [false];
};

const UTM_SOURCE = 'utm_source';
const UTM_MEDIUM = 'utm_medium';
const UTM_CAMPAIGN = 'utm_campaign';
const UTM_CONTENT = 'utm_content';
const UTM_TERM = 'utm_term';

export const detectCampaign = (currentUrlString: string): [boolean, Referrer?] => {
  const currentUrl = parseUrl(currentUrlString);
  if (!currentUrl) {
    return [false];
  }

  const query = currentUrl.searchParams.toString();
  if (!query) {
    return [false];
  }

  const campaign = getParameterFromQueryString(query, UTM_CAMPAIGN);
  const source = getParameterFromQueryString(query, UTM_SOURCE);
  if (campaign || source) {
    const medium = getParameterFromQueryString(query, UTM_MEDIUM);
    const content = getParameterFromQueryString(query, UTM_CONTENT);
    const term = getParameterFromQueryString(query, UTM_TERM);

    let type: ReferrerType = null;
    if (source === 'direct' && !medium) {
      type = ReferrerType.DIRECT;
    } else if (source && ['postscript', 'smsbump', 'klaviyo_sms'].includes(source.toLowerCase())) {
      type = ReferrerType.SMS;
    } else if (medium) {
      if (medium.match(/^(social|social-network|social-media|sm|social(\+|%20)network|social(\+|%20)media)$/)) {
        type = ReferrerType.SOCIAL;
      } else if (medium === 'email') {
        type = ReferrerType.EMAIL;
      } else if (medium === 'affiliate') {
        type = ReferrerType.AFFILIATES;
      } else if (medium === 'referral') {
        type = ReferrerType.REFERRAL;
      } else if (medium.match(/^(cpc|ppc|paidsearch)$/)) {
        type = ReferrerType.PAID_SEARCH;
      }  else if (medium.match(/^(cpv|cpa|cpp|content-text)$/)) {
        type = ReferrerType.OTHER_ADVERTISING;
      }  else if (medium.match(/^(display|cpm|banner)$/)) {
        type = ReferrerType.DISPLAY;
      } else if (medium.match(/^(sms|text)$/)) {
        type = ReferrerType.SMS;
      }
    }

    return [
      true,
      {
        type,
        name: campaign,
        utm: {
          campaign,
          source,
          medium,
          content,
          term,
        },
      },
    ];
  }

  return [false];
};

export const detectSearchEngine = (referrerUrlString: string): [boolean, Referrer?] => {
  const referrerUrl = parseUrl(referrerUrlString);
  if (!referrerUrl) {
    return [false];
  }

  const searchEngine = SearchEngineDetection(referrerUrl);
  return searchEngine === false
    ? [false]
    : [
      true,
      {
        type: ReferrerType.SEARCH,
        name: searchEngine,
      },
    ];
};

export const detectSocialNetwork = (referrerUrl: string): [boolean, Referrer?] => {
  if (!referrerUrl) {
    return [false];
  }

  const socialNetwork = SocialNetworkDetection(referrerUrl);

  return socialNetwork === false
    ? [false]
    : [
      true,
      {
        type: ReferrerType.SOCIAL,
        name: socialNetwork,
      },
    ];
};

export const detectWebsite = (referrerUrlString: string): [boolean, Referrer?] => {
  const referrerUrl = parseUrl(referrerUrlString);

  if (!referrerUrl) {
    return [false];
  }

  return [true, { type: ReferrerType.REFERRAL, name: referrerUrl.host, path: referrerUrl.pathname }];
};

export const getReferrerInformation = (referrerUrl: string, currentUrl: string): Referrer => {
  const [isCampaign, campaignReferrer] = detectCampaign(currentUrl);
  if (isCampaign) {
    return campaignReferrer;
  }

  const [isDirect, directReferrer] = detectDirect(referrerUrl, currentUrl);
  if (isDirect) {
    return directReferrer;
  }

  const [isSearchEngine, searchEngineReferrer] = detectSearchEngine(referrerUrl);
  if (isSearchEngine) {
    return searchEngineReferrer;
  }

  const [isSocialNetwork, socialNetworkReferrer] = detectSocialNetwork(referrerUrl);
  if (isSocialNetwork) {
    return socialNetworkReferrer;
  }

  const [isWebsite, websiteReferrer] = detectWebsite(referrerUrl);
  if (isWebsite) {
    return websiteReferrer;
  }

  return { type: ReferrerType.DIRECT };
};

export default getReferrerInformation;
