import ReferrerDetection, { detectCampaign } from './referrer-detection';
import { Referrer, ReferrerType } from './type';

describe('Referrer Detection', () => {
  describe('detectCampaign', () => {
    it.each([
      // Not an url
      null,
      'not an url',

      // No query parameters
      'https://example.com/',

      // No utm_campaign
      'https://example.com?utm_medium=medium&utm_content=content&utm_term=term',
    ])('should return false when url doesn\'t have a campaign and a source: %s', url => {
      // Act
      const [isCampaign] = detectCampaign(url);

      // Assert
      expect(isCampaign).toEqual(false);
    });

    it('should extract campaign data', () => {
      // Arrange
      const url = 'https://example.com/foo/bar?utm_source=source&utm_medium=medium&utm_campaign=campaign&utm_content=content&utm_term=term';

      // Act
      const [isCampaign, referer] = detectCampaign(url);

      // Assert
      expect(isCampaign).toEqual(true);
      expect(referer).toEqual(
        expect.objectContaining({
          name: 'campaign',
          utm: { campaign: 'campaign', content: 'content', medium: 'medium', source: 'source', term: 'term' },
        }),
      );
    });

    describe('Referer type', () => {
      it.each([
        'https://example.com/foo/bar?utm_source=direct&utm_campaign=campaign&utm_medium',
        'https://example.com/foo/bar?utm_source=direct&utm_campaign=campaign',
      ])('should return direct when utm_source = direct and utm_medium not set or none', (url) => {
        // Act
        const [isCampaign, referer] = detectCampaign(url);

        // Assert
        expect(referer.type).toEqual(ReferrerType.DIRECT);
      });

      it.each([
        'social',
        'social-network',
        'social-media',
        'sm',
        'social network',
        'social media',
        'social%20network',
        'social%20media'
      ])('should return social when utm_medium = %s', (medium) => {
        // Arrange
        const url = `https://example.com/foo/bar?utm_source=source&utm_campaign=campaign&utm_medium=${medium}`;

        // Act
        const [isCampaign, referer] = detectCampaign(url);

        // Assert
        expect(referer.type).toEqual(ReferrerType.SOCIAL);
      });

      it('should return email when utm_medium = email', () => {
        // Arrange
        const url = 'https://example.com/foo/bar?utm_source=source&utm_campaign=campaign&utm_medium=email';

        // Act
        const [isCampaign, referer] = detectCampaign(url);

        // Assert
        expect(referer.type).toEqual(ReferrerType.EMAIL);
      });

      it('should return affiliate when utm_medium = affiliate', () => {
        // Arrange
        const url = 'https://example.com/foo/bar?utm_source=source&utm_campaign=campaign&utm_medium=affiliate';

        // Act
        const [isCampaign, referer] = detectCampaign(url);

        // Assert
        expect(referer.type).toEqual(ReferrerType.AFFILIATES);
      });

      it('should return referral when utm_medium = referral', () => {
        // Arrange
        const url = 'https://example.com/foo/bar?utm_source=source&utm_campaign=campaign&utm_medium=referral';

        // Act
        const [isCampaign, referer] = detectCampaign(url);

        // Assert
        expect(referer.type).toEqual(ReferrerType.REFERRAL);
      });

      it.each([
        'cpc',
        'ppc',
        'paidsearch',
      ])('should return paid search when utm_medium = %s', (medium) => {
        // Arrange
        const url = `https://example.com/foo/bar?utm_source=source&utm_campaign=campaign&utm_medium=${medium}`;

        // Act
        const [isCampaign, referer] = detectCampaign(url);

        // Assert
        expect(referer.type).toEqual(ReferrerType.PAID_SEARCH);
      });

      it.each([
        'cpv',
        'cpa',
        'cpp',
        'content-text',
      ])('should return other advertising when utm_medium = %s', (medium) => {
        // Arrange
        const url = `https://example.com/foo/bar?utm_source=source&utm_campaign=campaign&utm_medium=${medium}`;

        // Act
        const [isCampaign, referer] = detectCampaign(url);

        // Assert
        expect(referer.type).toEqual(ReferrerType.OTHER_ADVERTISING);
      });

      it.each([
        'display',
        'cpm',
        'banner',
      ])('should return display when utm_medium = %s', (medium) => {
        // Arrange
        const url = `https://example.com/foo/bar?utm_source=source&utm_campaign=campaign&utm_medium=${medium}`;

        // Act
        const [isCampaign, referer] = detectCampaign(url);

        // Assert
        expect(referer.type).toEqual(ReferrerType.DISPLAY);
      });

      it('should return null when utm_medium does not match any other source', () => {
        // Arrange
        const url = 'https://example.com/foo/bar?&utm_campaign=campaign&utm_medium';

        // Act
        const [isCampaign, referer] = detectCampaign(url);

        // Assert
        expect(referer.type).toEqual(null);
      });

      it.each([
        'sms',
        'text',
      ])('should return sms when utm_medium = %s', (medium) => {
        // Arrange
        const url = `https://example.com/foo/bar?utm_source=source&utm_campaign=campaign&utm_medium=${medium}`;

        // Act
        const [isCampaign, referer] = detectCampaign(url);

        // Assert
        expect(referer.type).toEqual(ReferrerType.SMS);
      });
    });
  });

  describe('Generic detection', () => {
    it.each([
      // We do not check domain
      [
        'https://example.com/',
        'https://example.com/foo/bar?utm_source=source&utm_medium=medium&utm_campaign=campaign&utm_content=content&utm_term=term',
      ],

      // Referrer is not mandatory
      [null, 'https://example.com/foo/bar?utm_source=source&utm_medium=medium&utm_campaign=campaign&utm_content=content&utm_term=term'],
    ])('should detect campaign', (referrer, url) => {
      // Act
      const result = ReferrerDetection(referrer, url);

      // Assert
      expect(result).toEqual<Referrer>({
        type: null,
        name: 'campaign',
        utm: { campaign: 'campaign', content: 'content', medium: 'medium', source: 'source', term: 'term' },
      });
    });

    it.each([
      ['https://google.com/', 'https://example.com/foo/bar'],
      ['https://google.com/', null],
    ])('should detect search engine', (referrer, url) => {
      // Act
      const result = ReferrerDetection(referrer, url);

      // Assert
      expect(result).toEqual<Referrer>({
        type: ReferrerType.SEARCH,
        name: 'Google',
      });
    });

    it.each([
      ['https://twitter.com/', 'https://example.com/foo/bar'],
      ['https://twitter.com/', null],
    ])('should detect social network', (referrer, url) => {
      // Act
      const result = ReferrerDetection(referrer, url);

      // Assert
      expect(result).toEqual<Referrer>({
        type: ReferrerType.SOCIAL,
        name: 'Twitter',
      });
    });

    it.each([
      ['https://example.com', 'example.com', '/'],
      ['https://example.com/bar/foo', 'example.com', '/bar/foo'],
    ])('should detect website', (referrer, expectedName, exepectedPath) => {
      // Arrange
      const url = 'https://acquire.app/';

      // Act
      const result = ReferrerDetection(referrer, url);

      // Assert
      expect(result).toEqual<Referrer>({
        type: ReferrerType.REFERRAL,
        name: expectedName,
        path: exepectedPath,
      });
    });

    it.each([
      [null, null],
      [null, 'https://example.com/foo/bar'],
    ])('should detect direct access', (referrer, url) => {
      // Act
      const result = ReferrerDetection(referrer, url);

      // Assert
      expect(result).toEqual<Referrer>({
        type: ReferrerType.DIRECT,
      });
    });

    it('should detect direct access when same website', () => {
      // Arrange
      const referrer = 'https://example.com/bar/foo';
      const url = 'https://example.com/foo/bar';

      // Act
      const result = ReferrerDetection(referrer, url);

      // Assert
      expect(result).toEqual<Referrer>({
        type: ReferrerType.DIRECT,
      });
    });

    describe('with source', () => {
      it.each(['postscript', 'smsbump', 'klaviyo_sms'])('should set medium as SMS when source is %s', (source) => {
        // Arrange
        const url = `https://example.com/foo/bar?utm_source=${source}`;

        // Act
        const [isCampaign, referer] = detectCampaign(url);

        // Assert
        expect(referer.type).toEqual(ReferrerType.SMS);
      })
    })
  });
});
