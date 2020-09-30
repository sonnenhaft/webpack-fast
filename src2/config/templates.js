import {
  validateAreKeysDefined,
  validateAreValuesDefined,
  validateContainsAllKeys
} from '#/utils/validations';

import VikimapViewsIds from '#/views/VikimapPage/VikimapViewsIds';
import ShelfContainersIds from '#/components/Shelf/ShelfContainersIds';

const { AccedoOneContainer } = VikimapViewsIds;

const AccedoOnePageTemplateMap = {
  home: AccedoOneContainer
};

const { HeroBanner, Carousel, Grid } = ShelfContainersIds;

const AccedoOneContainerTemplateMap = {
  branding: null,
  carousel: Carousel,
  'carousel-banner': Carousel,
  'carousel-link': Carousel,
  'carousel-portrait': Carousel,
  'carousel-wide': Carousel,
  grid: Grid,
  'grid-banner': null,
  'grid-portrait': Grid,
  'grid-portrait-asym': Grid,
  'grid-portrait-lazyload': Grid,
  'grid-portrait-loadmore': Grid,
  'grid-wide': Grid,
  'grid-wide-asym': Grid,
  'grid-wide-loadmore': Grid,
  hero: HeroBanner,
  'hero-banner': HeroBanner,
  'hero-portrait': null,
  'hero-vertical': HeroBanner,
  'hero-vertical-signup': HeroBanner,
  'marvel-carousel': null,
  'marvel-hero': null,
  promo: null
};

const AccedoOneContainerTemplateTypes = {
  Grid: 'grid',
  Carousel: 'carousel'
};

const OVPItemType = {
  Category: 'category',
  Marvel: 'marvel',
  Movie: 'movie',
  Portrait: 'portrait',
  Square: 'square',
  TvShow: 'tvshow',
  Wide: 'wide',
  CastCrew: 'castcrew'
};

const AccedoOneContainerCardType = {
  Landscape: '16x9',
  Portrait: '2x3',
  Banner: 'featured'
};

const AccedoOneItemAction = {
  CastCrew: 'cast_crew',
  HeroBanner: 'hero_banner',
  Linear: 'linear',
  Recommend_Linear: 'recommend-linear',
  Pack: 'pack',
  Vod: 'vod',
  Listing: 'listing'
};

const AccedoOneHeroBannerCta = {
  deeplink: 'deeplink',
  linear: 'linear',
  netflix: 'netflix',
  pack: 'pack',
  vod: 'vod',
  listing: 'listing'
};

const AccedoOneItemActionToRoute = {
  [AccedoOneItemAction.CastCrew]: '/search',
  [AccedoOneItemAction.HeroBanner]: '/:hero-banner/:action-data:',
  [AccedoOneItemAction.Linear]: '/linear-details/:action-data:',
  [AccedoOneItemAction.Recommend_Linear]: '/linear-details/:action-data:',
  [AccedoOneItemAction.Pack]: '/pack-details/:action-data:',
  [AccedoOneItemAction.Vod]: '/movie-details/:action-data:',
  [AccedoOneItemAction.Listing]: '/listing/:action-data:'
};

const OVPItemTypeRoutes = {
  [OVPItemType.Category]: '/category-details/:item-id:',
  [OVPItemType.Marvel]: null,
  [OVPItemType.Movie]: '/movie-details/:item-id:',
  [OVPItemType.Portrait]: null,
  [OVPItemType.Square]: '/category/:item-id:',
  [OVPItemType.TvShow]: '/series-details/:item-id:',
  [OVPItemType.Wide]: null,
  [OVPItemType.CastCrew]: null
};

const AccedoOneFeedQuery = {
  ChannelCategories: /channelCategories/i,
  Channels: /channels/i,
  ChannelsByCategory: /channelsByCategory\{.*\}/i,
  ChannelsByIds: /channelsByIds\{.*\}/i,
  MovieCategories: /movieCategories/i,
  Movies: /movies/i,
  MoviesByCategory: /moviesByCategory\{(.*)\}/i,
  MoviesByIds: /moviesByIds\{.*\}/i,
  TvShowCategories: /tvshowCategories/i,
  TvShows: /tvshows/i,
  TvShowsByCategory: /tvshowsByCategory\{(.*)\}/i,
  TvShowsByIds: /tvshowsByIds\{.*\}i/
};

const AccedoOneTheme = {
  dark: 'dark',
  light: 'light'
};

const ThemeDefaults = {
  name: AccedoOneTheme.dark
};

const OVPKey = {
  Accedo: 'Accedo',
  Default: 'Default',
  TMDB: 'TMDB'
};

validateAreValuesDefined(AccedoOnePageTemplateMap);
validateAreValuesDefined(AccedoOneContainerTemplateMap);
validateAreValuesDefined(ThemeDefaults);

validateContainsAllKeys(OVPItemTypeRoutes, OVPItemType);
validateContainsAllKeys(AccedoOneItemActionToRoute, AccedoOneItemAction);

validateAreKeysDefined(OVPItemTypeRoutes);
validateAreKeysDefined(AccedoOneItemActionToRoute);

export {
  AccedoOneContainerCardType,
  AccedoOneContainerTemplateMap,
  AccedoOneContainerTemplateTypes,
  AccedoOneFeedQuery,
  AccedoOneHeroBannerCta,
  AccedoOneItemAction,
  AccedoOneItemActionToRoute,
  AccedoOnePageTemplateMap,
  AccedoOneTheme,
  OVPItemType,
  OVPItemTypeRoutes,
  OVPKey,
  ThemeDefaults
};
