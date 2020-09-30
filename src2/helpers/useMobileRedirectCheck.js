import { isMobile } from '#/utils/getPlatform';
import { ROUTE } from '#/constants';

const { LOGIN, PACK_DETAILS } = ROUTE;

const pagesAvailableOnMobile = [LOGIN, PACK_DETAILS];

const pagesAvailableOMobileModified = pagesAvailableOnMobile.map(
  (page = '') => {
    const pathArray = page.split('/');

    return pathArray?.[1];
  }
);

export const useMobileRedirectCheck = location => {
  const { pathname } = location || {};
  const pathArray = pathname.split('/');
  const page = pathArray?.[1];

  return isMobile() && !pagesAvailableOMobileModified.includes(page);
};
