import { OVPKey, OVPItemTypeRoutes } from '#/config/templates';

import defaultOVP, { tmdb, accedo } from './index';

const OVPKeyToOVP = {
  [OVPKey.Accedo]: accedo,
  [OVPKey.Default]: defaultOVP,
  [OVPKey.TMDB]: tmdb
};

const extractOVPInfoFromPath = id => {
  if (new RegExp(`^${OVPKey.TMDB}-`).test(id)) {
    return { ovpKey: OVPKey.TMDB, itemId: id.replace(/^TMDB-/, '') };
  }

  if (new RegExp(`^${OVPKey.Accedo}-`).test(id)) {
    return { ovpKey: OVPKey.Accedo, itemId: id.replace(/^accedo-/, '') };
  }

  return { ovpKey: OVPKey.Default, itemId: id };
};

const buildOVPLink = ({ ovpKey, type, id }) => {
  const prefix = ovpKey === OVPKey.Default ? '' : `${ovpKey}-`;

  return OVPItemTypeRoutes[type].replace(':item-id:', `${prefix}${id}`);
};

const getOVPKeyFromQuery = query => {
  if (/^tmdb:/i.test(query)) {
    return OVPKey.TMDB;
  }

  if (/^accedo:/i.test(query)) {
    return OVPKey.Accedo;
  }

  return OVPKey.Default;
};

export {
  OVPKeyToOVP,
  buildOVPLink,
  extractOVPInfoFromPath,
  getOVPKeyFromQuery
};
