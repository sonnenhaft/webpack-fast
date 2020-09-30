import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { ROUTE } from '#/constants';
import { PageContext } from '#/utils/context';
import WebAppManifest from '#/components/WebAppManifest';

const { MOVIE_DETAILS, SERIES_DETAILS } = ROUTE;

const getMeta = ({ pathname = '', routeToDisplayTextMap = {} }) => {
  const pathArray = pathname.split('/');
  const page = pathArray[1];

  if (MOVIE_DETAILS.includes(page)) {
    return routeToDisplayTextMap['/movies'];
  }

  if (SERIES_DETAILS.includes(page)) {
    return (
      routeToDisplayTextMap['/tv-shows-english'] ||
      routeToDisplayTextMap['/tv-shows-asian']
    );
  }

  return {};
};

const HelmetComponent = ({ location: { pathname } = {} }) => {
  const { pageTitle, routeToDisplayTextMap = {} } = useContext(PageContext);
  const { metaDescription, metaKeywords, metaTitle } = routeToDisplayTextMap[
    pathname
  ] || {
    ...getMeta({ pathname, routeToDisplayTextMap }),
    metaTitle: pageTitle
  };

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
      </Helmet>
      <WebAppManifest />
    </>
  );
};

HelmetComponent.defaultProps = {
  location: {}
};

HelmetComponent.propTypes = {
  location: PropTypes.object
};

export default HelmetComponent;
