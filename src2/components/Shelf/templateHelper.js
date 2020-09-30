import {
  validateAreValuesDefined,
  validateContainsAllKeys
} from '#/utils/validations';
import { AccedoOneContainerCardType } from '#/config/templates';

import ShelfContainersIds from './ShelfContainersIds';
import CarouselShelf from './CarouselShelf';
import GridShelf from './GridShelf';
import HeroShelf from './HeroShelf';

export const determineItemTypeByTemplate = ({ cardType, OVPItemType }) => {
  if (cardType === AccedoOneContainerCardType.Portrait) {
    return OVPItemType.Portrait;
  }
  if (cardType === AccedoOneContainerCardType.Landscape) {
    return OVPItemType.Wide;
  }

  return OVPItemType.Square;
};

export const ContainerIdToComponent = {
  [ShelfContainersIds.Carousel]: CarouselShelf,
  [ShelfContainersIds.Default]: GridShelf,
  [ShelfContainersIds.Grid]: GridShelf,
  [ShelfContainersIds.HeroBanner]: HeroShelf
};

validateAreValuesDefined(ContainerIdToComponent);
validateContainsAllKeys(ContainerIdToComponent, ShelfContainersIds);
