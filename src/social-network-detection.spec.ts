import SocialNetworkDetection from './social-network-detection';

describe('Social Network Detection', () => {
  it.each([
    ['http://www.facebook.com', 'Facebook'],
    ['http://www.facebook.com/piwik', 'Facebook'],
    ['http://m.facebook.com', 'Facebook'],
    ['https://m.facebook.com', 'Facebook'],
    ['m.facebook.com', 'Facebook'],
    ['http://lastfm.com.tr', 'Last.fm'],
    ['http://t.co/test', 'Twitter'],
    ['http://xxt.co/test', false],
    ['asdfasdfadsf.com', false],
    ['http://xwayn.com', false],
    ['http://live.com/test', false],
  ])('should find social network', (url, expected) => {
    // Act
    const result = SocialNetworkDetection(url);

    // Assert
    expect(result).toEqual(expected);
  });
});
