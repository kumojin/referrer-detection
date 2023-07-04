import SocialNetworks, { SocialNetworkDefinitions } from './helpers/social-networks-definitions';

let definitions: SocialNetworkDefinitions;
const loadDefinitions = () => {
  if (!definitions) {
    definitions = SocialNetworks();
  }
  return definitions;
};

export const getSocialNetworkFromDomain = (referrer: string): false | string => {
  for (const [domain, name] of loadDefinitions().entries()) {
    const regex = new RegExp(`(^|[.\\/])${domain}([.\\/]|$)`);
    if (referrer.match(regex)) {
      return name;
    }
  }

  return false;
};

export default getSocialNetworkFromDomain;
