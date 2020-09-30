import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withTheme } from '#/theme/Theme';
import toCamelCase from '#/utils/toCamelCase';
import {
  AccedoOneContainerTemplateTypes,
  AccedoOneContainerCardType
} from '#/config/templates';

import styles from './container.scss';

const {
  containerTitle,
  gridContainer,
  heroContainer,
  innerContainer,
  outerContainer
} = styles;

const Container = ({
  cardType,
  className,
  containerSubComponent,
  containerTitleCustomClass,
  customInnerContainerClass,
  displayText,
  template,
  style,
  theme = {},
  children
}) => {
  const templateClassName = styles[toCamelCase(template)] || '';
  const innerContainerClass = classNames(
    {
      [innerContainer]: true,
      [gridContainer]: template === AccedoOneContainerTemplateTypes.Grid,
      [heroContainer]: cardType === AccedoOneContainerCardType.Banner
    },
    customInnerContainerClass
  );

  const containerTitleClass = classNames(
    containerTitle,
    containerTitleCustomClass
  );

  return (
    <div
      className={classNames(
        outerContainer,
        templateClassName,
        styles[theme.name],
        className
      )}
      style={style}
    >
      {displayText ? (
        <h2 className={containerTitleClass}>{displayText}</h2>
      ) : (
        ''
      )}
      {containerSubComponent}
      <div className={innerContainerClass}>{children}</div>
    </div>
  );
};

Container.propTypes = {
  cardType: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  containerSubComponent: PropTypes.node,
  containerTitleCustomClass: PropTypes.string,
  customInnerContainerClass: PropTypes.string,
  displayText: PropTypes.string,
  style: PropTypes.object,
  template: PropTypes.string,
  theme: PropTypes.object
};

export default withTheme(Container);
