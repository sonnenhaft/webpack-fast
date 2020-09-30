import fetch from '@accedo/vdkweb-fetch';
import { validateOVPInterface } from '../../interface';

const API_KEY = '150c21baef6b9069181521ccc82123e2';
const URL = {
  tmdb: 'https://api.themoviedb.org/3',
  imagePath: 'image.tmdb.org/t/p',
  movie: '/movie',
  movieList: '/discover/movie',
  movieCategoryList: '/genre/movie/list',
  nowPlayingMovies: '/movie/now_playing',
  popularMovies: '/movie/popular',
  topRatedMovie: '/movie/top_rated',
  upcomingMovie: '/movie/upcoming',
  tvShow: '/tv',
  tvShowList: '/discover/tv',
  tvShowCategoryList: '/genre/tv/list',
  popularTvShows: '/tv/popular',
  topRatedTvShow: '/tv/top_rated'
};

const TYPE = {
  MOVIE: 'movie',
  TVSHOW: 'tvshow'
};

const categoryData = {};
categoryData[TYPE.MOVIE] = null;
categoryData[TYPE.TVSHOW] = null;

const constructUrl = (url, additionalParam) => {
  additionalParam = additionalParam ? `&${additionalParam}` : '';
  additionalParam += '&language=en-US&region=US';

  return `${URL.tmdb + url}?api_key=${API_KEY}${additionalParam}`;
};

const sendRequest = async endpoint => {
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const body = await response.json();

  return body;
};

const getCategoryDataByType = async (type = TYPE.MOVIE) => {
  if (categoryData[type]) {
    return categoryData[type];
  }

  let url;

  if (type === TYPE.TVSHOW) {
    url = URL.tvShowCategoryList;
  } else {
    url = URL.movieCategoryList;
  }

  const endpoint = constructUrl(url);
  const body = await sendRequest(endpoint);

  const categories = body.genres.map(x => ({
    id: x.id,
    title: x.name.toLowerCase()
  }));

  categoryData[type] = categories;

  return categories;
};

const constructModel = async (rawItem, type = TYPE.MOVIE) => {
  let categories = [];

  if (rawItem.genre_ids) {
    const categoryDataByType = await getCategoryDataByType(type);

    categories = rawItem.genre_ids
      .map(x => {
        const categoryItem = categoryDataByType.find(y => y.id === x);

        return categoryItem
          ? {
              title:
                categoryItem.title.charAt(0).toUpperCase() +
                categoryItem.title.slice(1),
              id: categoryItem.id
            }
          : null;
      })
      .filter(n => n);
  }

  const model = {
    type,
    id: rawItem.id,
    title: rawItem.original_title || rawItem.original_name,
    displayText: rawItem.original_title || rawItem.original_name,
    categories,
    description: rawItem.overview,
    images: []
  };

  if (rawItem.poster_path) {
    const url = `https://${URL.imagePath}/w342/${rawItem.poster_path}`;

    model.images.push({
      type: 'cover',
      url
    });
  }

  if (rawItem.backdrop_path) {
    const url = `https://${URL.imagePath}/original/${rawItem.backdrop_path}`;

    model.images.push({
      type: 'backdrop',
      url
    });
  }

  if (type === TYPE.TVSHOW && model.images.length === 2) {
    model.images = [model.images[1], model.images[0]];
  }

  return model;
};

const getEntryData = async (opts = {}, type = TYPE.MOVIE) => {
  const additionalParam = opts.category ? `with_genres=${opts.category}` : '';
  const url =
    opts.baseUrl || (type === TYPE.TVSHOW ? URL.tvShowList : URL.movieList);
  const endpoint = constructUrl(url, additionalParam);
  const body = await sendRequest(endpoint);
  const { results } = body;

  const data = await Promise.all(
    results.map(x => {
      return constructModel(x, type);
    })
  );

  return data;
};

const getEntryById = async (id, type = TYPE.MOVIE) => {
  const url = type === TYPE.TVSHOW ? URL.tvShow : URL.movie;
  const endpoint = constructUrl(`${url}/${id}`);
  const body = await sendRequest(endpoint);
  const data = await constructModel(body, type);

  return data;
};

const getMovieData = opts => getEntryData(opts, TYPE.MOVIE);
const getMovieById = id => getEntryById(id, TYPE.MOVIE);
const getMovieCategories = () => getCategoryDataByType(TYPE.MOVIE);

const getTvShowData = opts => getEntryData(opts, TYPE.TVSHOW);
const getTvShowById = id => getEntryById(id, TYPE.TVSHOW);
const getTvShowCategories = () => getCategoryDataByType(TYPE.TVSHOW);

const getEntriesByCategory = async (category, type = TYPE.MOVIE) => {
  if (!category) {
    return Promise.resolve(null);
  }

  let categories;

  if (type === TYPE.TVSHOW) {
    categories = await getTvShowCategories();
  } else {
    categories = await getMovieCategories();
  }

  const categoryItem = categories.find(
    x => x.id === category || x.title.indexOf(category.toLowerCase()) > -1
  );

  const opt = { category: categoryItem?.id };

  if (type === TYPE.TVSHOW) {
    return getTvShowData(opt);
  }

  return getMovieData(opt);
};

const getMoviesByCategory = category =>
  getEntriesByCategory(category, TYPE.MOVIE);

const getTvShowsByCategory = category =>
  getEntriesByCategory(category, TYPE.TVSHOW);

const signIn = () => {
  return Promise.resolve(null);
};

const signOut = () => {
  return Promise.resolve(null);
};

const validateToken = () => {
  return Promise.resolve(null);
};

const getChannelData = () => {
  return Promise.resolve();
};

// some more functions...
const getNowPlayingMovies = () =>
  getEntryData({ baseUrl: URL.nowPlayingMovies }, TYPE.MOVIE);
const getPopularMovies = () =>
  getEntryData({ baseUrl: URL.popularMovies }, TYPE.MOVIE);
const getTopRatedMovies = () =>
  getEntryData({ baseUrl: URL.topRatedMovie }, TYPE.MOVIE);
const getUpcomingMovies = () =>
  getEntryData({ baseUrl: URL.upcomingMovie }, TYPE.MOVIE);
const getPopularTvShows = () =>
  getEntryData({ baseUrl: URL.popularTvShows }, TYPE.TVSHOW);
const getTopRatedTvShows = () =>
  getEntryData({ baseUrl: URL.topRatedTvShow }, TYPE.TVSHOW);

export default validateOVPInterface({
  getChannelData,
  getMovieById,
  getMovieDataById: getMovieById,
  getMovieCategories,
  getMovieData,
  getMoviesByCategory,
  getTvShowById,
  getTvShowCategories,
  getTvShowData,
  getTvShowsByCategory,
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getPopularTvShows,
  getTopRatedTvShows,
  signIn,
  signOut,
  validateToken
});
