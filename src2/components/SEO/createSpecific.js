/* eslint camelcase: ["error", {allow: ["cast_crew"]}] */
// TODO: Refactor to remove the above rule.

import moment from 'moment';
import { isMovie, isEpisode, isSeries } from './checkTypes';
import { getCurrentUrl } from './urlUtil';

const addImageUrl = imageUrl => {
  if (!imageUrl) {
    return;
  }

  return {
    image: {
      '@type': 'ImageObject',
      url: imageUrl
    }
  };
};

const addContentRating = rating => {
  if (!rating) {
    return;
  }

  return {
    contentRating: `IMDA ${rating}`
  };
};

const addGenres = genres => {
  if (!Array.isArray(genres) || !genres.length) {
    return;
  }

  // This block is mostly due to the genres "Action / Adventure"
  // The slash in-between cause Google Rich Result Test failed
  // to generate a rich card in the search result.
  const genre = genres.reduce((acc, current, index) => {
    const comma = index ? ', ' : '';
    const currentString = current.replace(/\s*\/\s*/g, ', ');

    return acc + comma + currentString;
  }, '');

  return {
    genre
  };
};

const addCastAndCrew = persons => {
  if (!Array.isArray(persons) || !persons.length) {
    return;
  }

  const { director, actor } = persons.reduce(
    (acc, { castName: name, castTitle }) => {
      if (castTitle !== 'actor' && castTitle !== 'director') {
        return acc;
      }

      return {
        ...acc,
        [castTitle]: [
          ...acc[castTitle],
          {
            '@type': 'person',
            name
          }
        ]
      };
    },
    { director: [], actor: [] }
  );

  return {
    ...(director.length ? { director } : {}),
    ...(actor.length ? { actor } : {})
  };
};

const addCommon = ({
  id,
  name,
  description,
  imageUrl,
  rating,
  genres,
  cast_crew
}) => {
  return {
    '@id': id,
    name,
    description,
    url: getCurrentUrl(),
    ...addImageUrl(imageUrl),
    ...addContentRating(rating),
    ...addGenres(genres),
    ...addCastAndCrew(cast_crew)
  };
};

const addDuration = duration => {
  if (!duration) {
    return;
  }

  return {
    duration: moment.duration(duration, 'second').toISOString()
  };
};

// Thanks: https://stackoverflow.com/a/11526569/5725274
const MAX = 8640000000000;
const DEFAULT_PERIOD = {
  start: MAX,
  end: -MAX
};

const secondToDatetime = second => new Date(second * 1000).toISOString();
const secondToDate = second => secondToDatetime(second).split('T')[0];

const getPeriodStartEnd = ({ start, end }) => ({
  start: start || -MAX,
  end: end || MAX
});
const getEpisodesStartEnd = episodes =>
  episodes.reduce((acc, episode) => {
    const { period } = episode || {};
    const { start, end } = period || DEFAULT_PERIOD;

    return {
      start: Math.min(acc.start, start || MAX),
      end: Math.max(acc.end, end || -MAX)
    };
  }, DEFAULT_PERIOD);

const addPeriod = ({ period, episodes }) => {
  if (!period && (!Array.isArray(episodes) || !episodes.length)) {
    return;
  }

  const { start, end } = period
    ? getPeriodStartEnd(period)
    : getEpisodesStartEnd(episodes);

  return {
    dateCreated: secondToDatetime(start),
    expires: secondToDate(end)
  };
};

const addUploadDate = ({ start }) => ({
  uploadDate: secondToDate(start)
});

const buildAsMovie = ({ title: name, period, duration, imageUrl, ...rest }) => {
  // These two properties are required by Google.
  if (!imageUrl && name) {
    return null;
  }

  return {
    '@type': 'Movie',
    ...addCommon({
      name,
      imageUrl,
      ...rest
    }),
    ...addPeriod({ period }),
    ...addDuration(duration)
  };
};

// Note: Currently Google Search does not support Structured Data
// for TVSeries, but we build it nonetheless as the component is
// very similar.
const buildAsTvSeries = ({ title: name, episodes, ...rest }) => {
  return {
    '@type': 'TVSeries',
    ...addCommon({
      name,
      ...rest
    }),
    ...addPeriod({ episodes })
  };
};

// Note: Currently Google Search does not support Structured Data
// for TVSeries, but we build it nonetheless as the component is
// very similar.
const buildAsEpisode = ({ title: name, period, duration, ...rest }) => {
  const common = {
    ...addCommon({
      name,
      ...rest
    }),
    ...addPeriod({ period })
  };

  return {
    '@type': 'TVEpisode',
    ...common,
    video: {
      '@context': 'http://schema.org',
      '@type': 'VideoObject',
      requiresSubscription: true,
      ...common,
      ...addDuration(duration),
      ...addUploadDate(period)
      // TODO: Missing field 'thumbnailUrl'
      // TODO: Either 'contentUrl' or 'embedUrl' should be specified (optional)
    }
  };
};

const getBuilder = (__typename, episodeNumberAndTitle) => {
  if (isMovie(__typename, episodeNumberAndTitle)) {
    return buildAsMovie;
  }

  if (isEpisode(__typename, episodeNumberAndTitle)) {
    return buildAsEpisode;
  }

  return isSeries(__typename, episodeNumberAndTitle) ? buildAsTvSeries : null;
};

const createSpecific = ({ __typename, episodeNumberAndTitle, ...rest }) => {
  const builder = getBuilder(__typename, episodeNumberAndTitle);

  if (!builder) {
    return [];
  }

  const jsonld = builder({ ...rest });

  if (!jsonld) {
    return [];
  }

  return [
    {
      '@context': 'http://schema.org',
      ...jsonld
    }
  ];
};

export default createSpecific;
