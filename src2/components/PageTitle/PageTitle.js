import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './pageTitle.scss';
import { withTheme } from '#/theme/Theme';

const { titleContainer } = styles;

export const PageTitle = ({ className, subtitle = '', text, theme }) => {
  if (!text) {
    return '';
  }

  return (
    <div className={classnames(titleContainer, styles[theme.name], className)}>
      <h1>{text}</h1>
      <span>{subtitle}</span>
    </div>
  );
};

PageTitle.propTypes = {
  className: PropTypes.string,
  subtitle: PropTypes.string,
  text: PropTypes.string,
  theme: PropTypes.object
};

export default withTheme(PageTitle);
