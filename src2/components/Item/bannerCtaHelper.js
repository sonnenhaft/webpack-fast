import { AccedoOneHeroBannerCta } from '#/config/templates';

export const getCtaAction = ({ AccedoOneItemActionToRoute, item = {} }) => {
  const {
    deeplink,
    linear,
    netflix,
    pack,
    vod,
    listing
  } = AccedoOneHeroBannerCta;
  const { ctaAction, ctaActionParam } = item || {};

  switch (ctaAction) {
    case linear:
    case pack:
    case vod:
    case listing:
      return {
        ctaLink: AccedoOneItemActionToRoute[ctaAction].replace(
          ':action-data:',
          ctaActionParam
        ),
        isExternalLink: false
      };

    case netflix:
    case deeplink:
      return {
        ctaLink: ctaActionParam,
        isExternalLink: true
      };

    default:
      return {
        ctaLink: '/',
        isExternalLink: false
      };
  }
};
