import ovp from '@accedo/vdkweb-ovp-client-accedo';

import { validateOVPInterface } from '../../interface';

const errorHandler = error => console.error(error);

ovp.ApiClient.prototype.getBaseUrl = () => {
  // We consider the case for TV here.  For static build, proxy server will not
  // be available unless using a custom server.  And as most TV do not have
  // cross domain restrictions, we will get the exact OVP API url.
  return __USE_OVP_PROXY__ ? '/ovp' : 'https://vdk-ovp.ocs.demo.accedo.tv';
};

const movieDataParser = entry => ({
  ...entry,
  displayText: entry.title
});

const getMovieData = async ({ category = '' } = {}) => {
  const apiInstance = new ovp.MovieApi();

  const opts = {
    pageSize: 15,
    pageNumber: 1
  };

  try {
    const data = await (category
      ? apiInstance.getMoviesByCategory(category, opts)
      : apiInstance.getAllMovies(opts));

    return data.entries.map(entry => {
      return {
        ...entry,
        displayText: entry.title
      };
    });
  } catch (error) {
    console.error(error);
  }
};

const getMovieById = id => {
  if (!id) {
    return Promise.resolve(null);
  }
  const apiInstance = new ovp.MovieApi();

  return apiInstance.getMovieById(id).catch(errorHandler);
};

const getMoviesByCategory = async category => {
  return category ? getMovieData({ category }) : null;
};

const getMovieDataById = id => getMovieById(id).then(movieDataParser);

const getTvShowData = async ({ category = '' } = {}) => {
  const apiInstance = new ovp.TVShowApi();

  const opts = {
    pageSize: 15,
    pageNumber: 1
  };

  try {
    const data = await (category
      ? apiInstance.getTvShowsByCategory(category, opts)
      : apiInstance.getAllTvShows(opts));

    return data.entries.map(entry => {
      return {
        ...entry,
        displayText: entry.title,
        type: 'tvshow'
      };
    });
  } catch (error) {
    console.error(error);
  }
};

const getTvShowsByCategory = async category => {
  return category ? getTvShowData({ category }) : null;
};

const getMovieCategories = async () => {
  const apiInstance = new ovp.CategoryApi();

  const opts = {
    pageSize: 15,
    pageNumber: 1
  };

  try {
    const data = await apiInstance.getAllCategories(opts);

    return data.entries.map(entry => {
      return {
        ...entry,
        displayText: entry.title
      };
    });
  } catch (error) {
    console.error(error);
  }
};

const signIn = credentials => {
  return new ovp.AuthApi().authenticate(
    credentials.email,
    credentials.password
  );
};

const signOut = token => {
  return new ovp.AuthApi().invalidateToken(token);
};

const validateToken = (token, userId) => {
  return new ovp.AuthApi().validateToken(token, userId);
};

let channelDataCache;

const getChannelData = () => {
  if (channelDataCache) {
    return Promise.resolve(channelDataCache);
  }

  const apiInstance = new ovp.ChannelApi();

  return apiInstance
    .getAllChannels()
    .then(channelData => {
      channelDataCache = channelData;

      return channelData;
    })
    .catch(error => {
      console.error(error);
    });
};

const getTvListings = async ({ startTime, endTime, count = 4, offset = 0 }) => {
  const apiInstance = new ovp.TVListingApi();

  const params = {
    pageSize: count,
    pageNumber: 1 + Math.max(Math.round(offset / count), 0)
  };

  const channels = await getChannelData();

  const data = await apiInstance.getTvListing(startTime, endTime, params);

  return {
    ...data,
    entries: data.entries.map(entry => {
      const channelData = channels.entries.find(
        channel => channel.id === entry.channelId
      );

      return {
        ...(channelData || {}),
        ...entry,
        programs: entry.programs
          .filter(
            p =>
              p.endTime <= endTime &&
              p.startTime < endTime &&
              p.endTime > startTime
          )
          .map(p => ({
            ...p,
            title: p.id
          }))
      };
    })
  };
};

export default validateOVPInterface({
  getChannelData,
  getMovieById,
  getMovieCategories,
  getMovieData,
  getMovieDataById,
  getMoviesByCategory,
  getTvListings,
  getTvShowData,
  getTvShowsByCategory,
  signIn,
  signOut,
  validateToken
});
