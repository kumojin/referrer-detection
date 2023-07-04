import RegionDataProvider from './region-data-provider';

describe('RegionDataProvider', () => {
  it('should return a list all countries', () => {
    expect(RegionDataProvider().size).toEqual(273);
  });
});
