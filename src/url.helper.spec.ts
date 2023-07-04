import { getArrayFromQueryString, getLossyUrl, getParameterFromQueryString, parseUrl } from './url.helper';

describe('URL Helper', () => {
  describe('getLossyUrl', () => {
    it.each([
      ['example.com', 'example.com'],
      ['m.example.com', 'example.com'],
      ['www.example.com', 'example.com'],
      ['search.example.com', 'example.com'],
      ['example.ca', 'example.{}'],
      ['us.example.com', '{}.example.com'],
      ['www.m.example.ca', 'example.{}'],
      ['www.google.com.af', 'google.{}'],
      ['www.google.co.uk', 'google.{}'],
      ['images.de.ask.com', 'images.{}.ask.com'],
    ])('should reduce url %s', (url, expected) => {
      // Act
      const result = getLossyUrl(url);

      // Assert
      expect(result).toEqual(expected);
    });
  });

  describe('parseUrl', () => {
    it('should return URL when valid URL', () => {
      // Arrange
      const url = 'https://example.com';

      // Act
      const result = parseUrl(url);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return null when invalid URL', () => {
      // Arrange
      const url = 'it doesnt look like url';

      // Act
      const result = parseUrl(url);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('getParameterFromQueryString', () => {
    it.each([
      ['x=1', 'x', '1'],
      ['?x=1', 'x', '1'],
      ['?x=y==1', 'x', 'y==1'],
      ['x[]=', 'x', ['']],
      ['x[]=1', 'x', ['1']],
      ['x[]=y==1', 'x', ['y==1']],
      ['?x[]=1&x[]=2', 'x', ['1', '2']],
      ['?x%5b%5d=3&x[]=4', 'x', ['3', '4']],
      ['?x%5B]=5&x[%5D=6', 'x', ['5', '6']],
      ['toto=mama&mama=&tuytyt=teaoi&toto=mama second value', 'tuytyt', 'teaoi'],

      // don't unescape the value, otherwise it becomes
      //   ?x[]=A&y=1
      ['?x%5B%5D=A%26y%3D1', 'x', ['A%26y%3D1']],
      //   ?z=y&x[]=1
      ['?z=y%26x%5b%5d%3d1', 'x', null],

      // strange characters
      [
        'toto=mama&mama=&tuytyt=Поиск в Интернете  Поиск страниц на русском _*()!$!£$^!£$%&toto=mama second value',
        'tuytyt',
        'Поиск в Интернете  Поиск страниц на русском _*()!$!£$^!£$%',
      ],

      // twice the parameter => returns the last value in the url
      ['toto=mama&mama=&tuytyt=teaoi&toto=mama second value', 'toto', 'mama second value'],

      // empty param
      ['toto=mama&mama=&tuytyt=teaoi', 'mama', ''],

      // missing parameter value => returns false
      ['x', 'x', false],
      ['toto=mama&mama&tuytyt=teaoi', 'mama', false],

      // param not found => null
      ['toto=mama&mama=titi', 'tot', null],
      // empty query string => null
      ['', 'test', null],
    ])('should find parameter in query %s ', (queryString, parameter, expected) => {
      // Act
      const result = getParameterFromQueryString(queryString, parameter);

      // Assert
      expect(result).toEqual(expected);
    });
  });

  describe('getArrayFromQueryString', () => {
    it('should return url query as an array', () => {
      // Arrange
      const query = 'a&b=&c=1&d[]&e[]=&f[]=a&g[]=b&g[]=c';

      // Act
      const result = getArrayFromQueryString(query);

      // Assert
      expect(result).toEqual({
        a: false,
        b: '',
        c: '1',
        d: [false],
        e: [''],
        f: ['a'],
        g: ['b', 'c'],
      });
    });
  });
});
