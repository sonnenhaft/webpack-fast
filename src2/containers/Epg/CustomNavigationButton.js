/**
 * The list below documents the changes to vdkweb-epg
 *
 * Change prop-types import from T to PropTypes
 * Change button text content to carousel custom arrow SVG
 * Change buttons design and position
 * Remove inline CSS which are not needed
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { pure } from 'recompose';
import defaultTheme from './customNavigationButton.scss';
import { Chevron } from '#/components/Icons';

export const Direction = {
  Up: 'up',
  Down: 'down',
  Right: 'right',
  Left: 'left'
};

const _getStyleForDirection = direction => {
  switch (direction) {
    case Direction.Left:
      return {
        left: 40
      };
    case Direction.Right:
      return {
        right: 0
      };
    default:
      return {};
  }
};

/**
 * A button for managing program guide navigation and scrolling
 * in different directions (up, down, left, right) with a mouse.
 *
 * By default it's styled differently depending on which direction
 * it's intended to navigate.
 *
 * @param {object} props See propTypes
 * @returns {NavigationButton} A NavigationButton component
 */
const CustomNavigationButton = ({
  direction,
  onClick,
  visible = true,
  getStyleForDirection = _getStyleForDirection,
  theme = defaultTheme
}) => {
  if (!visible) {
    return null;
  }

  const style = getStyleForDirection(direction);

  return (
    <button
      className={classNames(theme.navigationButton)}
      onClick={onClick}
      style={style}
    >
      <Chevron className={theme[direction]} />
    </button>
  );
};

CustomNavigationButton.propTypes = {
  /** The direction in which this button will navigate */
  direction: PropTypes.oneOf(['right', 'left', 'up', 'down']).isRequired,

  /**
   * For overriding the button styling which by default
   * is based on the direction and size prop.
   * ```getStyleForDirection(direction, size)```
   */
  getStyleForDirection: PropTypes.func,

  /** Click handler for the button */
  onClick: PropTypes.func,

  /** Classname API for theming */
  theme: PropTypes.shape({
    down: PropTypes.string,
    left: PropTypes.string,
    navigationButton: PropTypes.string,
    right: PropTypes.string,
    up: PropTypes.string
  }),

  visible: PropTypes.bool
};

export default pure(CustomNavigationButton);
