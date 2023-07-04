import SearchEnginesDefinitions, { SearchEngineConfiguration } from './search-engines-definitions';

describe('Search Engines Definitions', () => {
  it('should load search engines definitions', () => {
    // Act
    const result = SearchEnginesDefinitions();

    // Assert
    expect(result.size).toEqual(619);
    expect(result.get('duckduckgo.com')).toEqual<SearchEngineConfiguration>({
      name: 'DuckDuckGo',
      params: ['q'],
      hiddenkeyword: ['/.*/'],
      backlink: '?q={k}',
      charsets: [],
    });
    expect(result.get('r.duckduckgo.com')).toEqual<SearchEngineConfiguration>({
      name: 'DuckDuckGo',
      params: ['q'],
      hiddenkeyword: ['/.*/'],
      backlink: '?q={k}',
      charsets: [],
    });
  });
});
