import { validateHasDefaultKey } from '#/utils/validations';

const ShelfContainersIds = {
  Carousel: 'Carousel',
  Default: 'Default',
  Grid: 'Grid',
  HeroBanner: 'HeroBanner'
};

validateHasDefaultKey(ShelfContainersIds);

export default ShelfContainersIds;
