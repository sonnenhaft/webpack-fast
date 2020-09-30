import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { SearchMenuIcon } from '#/components/Icons';
import { ROUTE } from '#/constants';

const SearchMenuButton = ({ className, iconStyle }) => (
  <Link className={className} to={ROUTE.SEARCH}>
    <SearchMenuIcon iconStyle={iconStyle} />
  </Link>
);

SearchMenuButton.propTypes = {
  className: PropTypes.string,
  iconStyle: PropTypes.string
};

export default SearchMenuButton;
