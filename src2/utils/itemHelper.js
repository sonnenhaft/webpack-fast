import { OVPItemType } from '#/config/templates';
import { IMAGE_RESIZER_REGEX } from '#/constants';

export const itemSizeMap = {
  [OVPItemType.Category]: { width: 200, height: 200 },
  [OVPItemType.Marvel]: { width: 259, height: 609 },
  [OVPItemType.Movie]: { width: 214, height: 317 },
  [OVPItemType.Portrait]: { width: 190, height: 284 },
  [OVPItemType.Square]: { width: 200, height: 200 },
  [OVPItemType.TvShow]: { width: 438, height: 247 },
  [OVPItemType.Wide]: { width: 250, height: 140 },
  [OVPItemType.CastCrew]: { width: 176, height: 72 }
};

export const determineItemType = item => {
  if (item.type === OVPItemType.TvShow || item.tvSeasonCount) {
    return OVPItemType.TvShow;
  }

  if (item.type === OVPItemType.Movie || item._meta) {
    return OVPItemType.Movie;
  }

  return OVPItemType.Category;
};

export const getItemSizeForType = itemType => {
  return itemSizeMap[itemType];
};

export const getColorForItem = () => {
  const hue = 360 * Math.random();
  const saturation = 25 + 70 * Math.random();
  const lightness = 85 + 10 * Math.random();

  return `hsl(${hue},${saturation}%,${lightness}%)`;
};

export const imageResizer = ({ url, width }) => {
  if (url && !IMAGE_RESIZER_REGEX.test(url)) {
    return `${url}?w=${width}`;
  }

  return url;
};
