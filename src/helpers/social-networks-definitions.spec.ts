import SocialsDefinitions from './social-networks-definitions';

describe('Social Networks Definitions', () => {
  it('should load social networks definitions', () => {
    // Act
    const result = SocialsDefinitions();

    // Assert
    expect(result.size).toEqual(133);
    expect(result.get('fb.me')).toEqual('Facebook');
  });
});
