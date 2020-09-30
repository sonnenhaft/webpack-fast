const isMovie = (type, episodeNumberAndTitle) =>
  type === 'Editorial' && !episodeNumberAndTitle;

const isEpisode = (type, episodeNumberAndTitle) =>
  type === 'Editorial' && episodeNumberAndTitle;

const isSeries = type => type === 'SeriesNode';

export { isMovie, isEpisode, isSeries };
