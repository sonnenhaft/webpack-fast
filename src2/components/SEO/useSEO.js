import { useContext, useMemo } from 'react';
import { ConfigContext } from '#/utils/context';
import createSpecific from './createSpecific';
import createBreadcrumb from './createBreadcrumb';

const useSEO = ({ __typename, episodeNumberAndTitle, ...rest }) => {
  const {
    id,
    imageUrl,
    title,
    rating,
    genres,
    description,
    period,
    duration
  } = rest;
  const { start, end } = period || {};
  const { appName } = useContext(ConfigContext);

  return useMemo(
    () => [
      ...createSpecific({ __typename, episodeNumberAndTitle, ...rest }),
      ...createBreadcrumb({
        appName,
        __typename,
        episodeNumberAndTitle,
        title
      })
    ],
    [
      appName,
      __typename,
      episodeNumberAndTitle,
      id,
      imageUrl,
      rating,
      genres,
      title,
      description,
      start,
      end,
      duration
    ]
  );
};

export default useSEO;
