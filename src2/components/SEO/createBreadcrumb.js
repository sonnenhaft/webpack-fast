import { isMovie } from './checkTypes';
import { getOrigin, getCurrentUrl, getMoviePageUrl } from './urlUtil';

const createBreadcrumb = ({
  appName,
  __typename,
  episodeNumberAndTitle,
  title: name
}) => {
  const second = [];

  if (isMovie(__typename, episodeNumberAndTitle)) {
    second.push(
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Movies',
        item: getMoviePageUrl()
      },
      {
        '@type': 'ListItem',
        position: 3,
        name,
        item: getCurrentUrl()
      }
    );
  } else {
    // We do this now as there are no way to tell whether
    // it is Asian or English TV Shows.
    second.push({
      '@type': 'ListItem',
      position: 2,
      name,
      item: getCurrentUrl()
    });
  }

  return [
    {
      '@context': 'http://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: appName,
          item: getOrigin()
        },
        ...second
      ]
    }
  ];
};

export default createBreadcrumb;
