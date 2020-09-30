import * as templates from '../templates';

describe('exposed templates', () => {
  it('contains the expected templates', () => {
    expect(Object.keys(templates)).toEqual([
      'AccedoOneContainerCardType',
      'AccedoOneContainerTemplateMap',
      'AccedoOneContainerTemplateTypes',
      'AccedoOneFeedQuery',
      'AccedoOneHeroBannerCta',
      'AccedoOneItemAction',
      'AccedoOneItemActionToRoute',
      'AccedoOnePageTemplateMap',
      'AccedoOneTheme',
      'OVPItemType',
      'OVPItemTypeRoutes',
      'OVPKey',
      'ThemeDefaults'
    ]);
  });
});
