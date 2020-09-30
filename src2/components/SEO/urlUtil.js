import { ROUTE } from '#/constants';

const getOrigin = () => window?.location?.origin;

const getCurrentUrl = () => {
  const { origin, pathname } = window?.location || {};

  return origin + pathname;
};

const { MOVIE } = ROUTE;
const getMoviePageUrl = () => new URL(MOVIE.replace(/\/:id/g, ''), getOrigin());

export { getOrigin, getCurrentUrl, getMoviePageUrl };
