import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const SEARCH_ENGINES_DEFINITIONS_FILE = 'SearchEngines.yml';
export type SearchEnginesDefinitions = Map<string, SearchEngineConfiguration>;
export type SearchEngineConfiguration = {
  name: string;
  params: string[];
  backlink: string;
  hiddenkeyword: string[];
  charsets: string[];
};
type SearchEngineConfigurationRaw = {
  urls: string[];
  params: string[];
  backlink: string;
  hiddenkeyword: string[];
  charsets: string[];
};

export default (): SearchEnginesDefinitions => {
  const searchEngines = yaml.load(
    readFileSync(join(__dirname, '../../vendor/matomo' ,SEARCH_ENGINES_DEFINITIONS_FILE), 'utf8'),
  ) as Record<string, SearchEngineConfigurationRaw[]>;

  const data = new Map<string, SearchEngineConfiguration>();

  for (const [searchEngineName, searchEngineConfigurations] of Object.entries(searchEngines)) {
    searchEngineConfigurations.forEach(searchEngineConfiguration => {
      const { urls } = searchEngineConfiguration;
      urls.forEach(url => {
        // We want to remove urls so we don't use extractedUrls
        const {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          urls: extractedUrls,
          ...searchEngineConfigurationWithoutUrl
        } = searchEngineConfiguration;
        data.set(url, {
          name: searchEngineName,

          // Default values
          params: [],
          hiddenkeyword: [],
          charsets: [],

          // Override all values
          ...searchEngineConfigurationWithoutUrl,
        });
      });
    });
  }

  return data;
};
