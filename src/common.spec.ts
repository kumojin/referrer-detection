import { sanitizeInputValue } from './common';

describe('Common', () => {
  describe('sanitizeInputValue', () => {
    it.each([
      // sanitize a string unicode => no change
      ['a string unicode', ' Поиск в Интернете  Поgqegиск страниц на рgeqg8978усском', ' Поиск в Интернете  Поgqegиск страниц на рgeqg8978усском'],
      // sanitize a bad string
      ['a bad string', '& " < > 123abc\'', '&amp; &quot; &lt; &gt; 123abc&#039;'],
      // test filter - expect new line and null byte to be filtered out
      ['new line and null byte', 'Null\0Byte\n\r', 'NullByte'],
      // double encoded - no change (document as user error)
      ['double encoded', '%48%45%4C%00%4C%4F+%57%4F%52%4C%44', '%48%45%4C%00%4C%4F+%57%4F%52%4C%44'],
      // sanitize HTML
      [
        'HTML',
        '<test toto=\'mama\' piwik="cool">Piwik!!!!!</test>',
        '&lt;test toto=&#039;mama&#039; piwik=&quot;cool&quot;&gt;Piwik!!!!!&lt;/test&gt;',
      ],
      // sanitize a SQL query
      [
        'SQL query',
        "SELECT piwik FROM piwik_tests where test= 'super\"value' AND cool=toto #comment here",
        'SELECT piwik FROM piwik_tests where test= &#039;super&quot;value&#039; AND cool=toto #comment here',
      ],
    ])('should sanitize %s', (name, input, expected) => {
      // Act
      const result = sanitizeInputValue(input);

      // Assert
      expect(result).toEqual(expected);
    });
  });
});
