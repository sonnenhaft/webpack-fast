import { validateOVPInterface } from '../../interface';

import SessionData from './SessionData';
import movies from './data/movie.json';
import categories from './data/category.json';
import tvShows from './data/tvshow.json';
import channels from './data/channels.json';

const DEFAULT_API_OPTS = {
  pageNumber: 1,
  pageSize: 15
};

const getPage = (data = [], opts = DEFAULT_API_OPTS) => {
  const { pageNumber, pageSize } = opts;

  return data.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
};

const getMovieData = opts => {
  return Promise.resolve(getPage(movies.entries, opts)).then(data => {
    return data;
  });
};

const getMoviesByCategory = getMovieData;

const getTvShowData = opts => {
  return Promise.resolve(getPage(tvShows.entries, opts));
};

const getTvShowsByCategory = getTvShowData;

const getMovieCategories = opts => {
  /**
   * Adding a forced error to test reloading of container data.
   *
   * if (Math.random() < 0.2) {
   *   return Promise.reject({ error: 'Forced error.' });
   * }
   */

  const res = getPage(categories.entries[0].categories, opts);

  return Promise.resolve(res);
};

const signIn = credentials => {
  if (credentials.password !== '123') {
    return Promise.reject({
      message: 'Unauthorized'
    });
  }

  return Promise.resolve(
    new SessionData({
      userId: credentials.email,
      token: Math.random()
        .toString(36)
        .substring(7),
      expiration: new Date().getTime() + 4 * 60 * 60 * 1000 // 4 hours
    })
  );
};

const signOut = () => {
  return Promise.resolve();
};

const validateToken = (token, userId) => {
  return Promise.resolve({ valid: true, token, userId });
};

const getChannelData = () => {
  Promise.resolve(channels);
};

const getMovieById = id => {
  if (!id) {
    return Promise.resolve(null);
  }

  return Promise.resolve(
    movies.entries.find(entry => {
      return entry.id === id;
    }) || null
  );
};

export default validateOVPInterface({
  getChannelData,
  getMovieById,
  getMovieCategories,
  getMovieData,
  getMoviesByCategory,
  getTvShowData,
  getTvShowsByCategory,
  signIn,
  signOut,
  validateToken
});
