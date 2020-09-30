import React from 'react';
import PropTypes from 'prop-types';

const ExternalLink = ({ className = '', displayText = '', href = '' }) => (
  <a
    className={className}
    href={href}
    rel="noopener noreferrer"
    target="_blank"
  >
    {displayText}
  </a>
);

ExternalLink.propTypes = {
  className: PropTypes.string,
  displayText: PropTypes.string,
  href: PropTypes.string
};

export default ExternalLink;
