import {
  validateAreKeysDefined,
  validateContainsAllKeys
} from '#/utils/validations';

import CategoryItem from '#/components/Item/CategoryItem';
import MovieItem from '#/components/Item/MovieItem';
import TVShowItem from '#/components/Item/TVShowItem';

export const getItemsMap = OVPItemType => {
  const itemsMap = {
    [OVPItemType.Category]: CategoryItem,
    [OVPItemType.Marvel]: MovieItem,
    [OVPItemType.Movie]: MovieItem,
    [OVPItemType.Portrait]: MovieItem,
    [OVPItemType.Square]: CategoryItem,
    [OVPItemType.TvShow]: TVShowItem,
    [OVPItemType.Wide]: TVShowItem,
    [OVPItemType.CastCrew]: CategoryItem
  };

  // istanbul ignore else
  if (__TEST__) {
    validateContainsAllKeys(itemsMap, OVPItemType);
    validateAreKeysDefined(itemsMap);
  }

  return itemsMap;
};
