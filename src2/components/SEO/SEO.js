import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

const SEO = ({ seoMetadata }) => {
  if (!seoMetadata) {
    return null;
  }

  const jsonld = JSON.stringify(seoMetadata);

  return (
    <Helmet>
      <script type="application/ld+json">{jsonld}</script>
    </Helmet>
  );
};

SEO.propTypes = {
  seoMetadata: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default SEO;
