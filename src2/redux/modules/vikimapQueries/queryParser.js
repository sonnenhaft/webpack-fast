import { AccedoOneFeedQuery } from '#/config/templates';

import { getOVPKeyFromQuery, OVPKeyToOVP } from '#/services/ovp/helpers';

// https://accedobroadband.jira.com/wiki/x/HYEWIg#QAApplicationEntryAlignment-queryContainerQuery

const {
  MovieCategories,
  MoviesByCategory,
  TvShows,
  TvShowsByCategory
} = AccedoOneFeedQuery;

const executeQuery = async query => {
  const ovpKey = getOVPKeyFromQuery(query);
  const ovp = OVPKeyToOVP[ovpKey];

  const requestData = () => {
    if (MovieCategories?.test(query)) {
      return ovp.getMovieCategories();
    }

    if (TvShowsByCategory?.test(query)) {
      const category = TvShowsByCategory.exec(query)?.[1];

      if (category) {
        return ovp.getTvShowsByCategory(category);
      }
    }

    if (TvShows?.test(query)) {
      return ovp.getTvShowData();
    }

    if (MoviesByCategory?.test(query)) {
      const category = MoviesByCategory.exec(query)?.[1];

      if (category) {
        return ovp.getMoviesByCategory(category);
      }
    }

    return ovp.getMovieData();
  };

  const data = await requestData();

  return {
    data,
    ovpKey
  };
};

export default { executeQuery };
