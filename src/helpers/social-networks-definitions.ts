import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

export type SocialNetworkDefinitions = Map<string, string>;
const SOCIAL_NETWORKS_DEFINITIONS_FILE = 'Socials.yml';

export default (): SocialNetworkDefinitions => {
  const socials = yaml.load(
    readFileSync(join(__dirname, '../../vendor/matomo', SOCIAL_NETWORKS_DEFINITIONS_FILE), 'utf8'),
  ) as Record<string, string[]>;

  const data = new Map<string, string>();

  for (const [socialName, socialUrls] of Object.entries(socials)) {
    socialUrls.forEach(url => {
      data.set(url, socialName);
    });
  }

  return data;
};
