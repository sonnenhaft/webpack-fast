/**
 * The list below documents the changes to vdkweb-epg
 *
 * Change prop-types import from T to PropTypes
 * Change current time marker design by extending its length and adding NOW label
 * Add 'Go to now' button which appears when current time marker is out of range / out of screen
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { animationToTransition } from '#/containers/utils/epgTimelineTransition';
import defaultTheme from './customCurrentTimeMarker.scss';
import Button from '#/components/Button/Button';
import { bodyWidth, leftColumnWidth } from './epgDimensions';

const CustomCurrentTimeMarker = ({
  offset,
  length,
  width = 2,
  vertical = false,
  theme = defaultTheme,
  style,
  animation = {},
  epgGoToNowButtoTitle,
  navigateNow,
  nowText
}) => {
  const lengthExtension = 41;
  const transform = `translate${vertical ? 'Y' : 'X'}(${offset}px)`;
  const _style = {
    width: vertical ? length : width,
    height: vertical ? width : length + lengthExtension,
    transform,
    WebkitTransform: transform,
    transition: animationToTransition(animation),
    ...style
  };
  const isOutOfScreen =
    offset > bodyWidth + leftColumnWidth || offset < leftColumnWidth;
  const { currentTimeMarker, goToNowButton } = theme;

  return (
    <Fragment>
      <div className={currentTimeMarker} style={_style}>
        <span>{nowText}</span>
      </div>
      {isOutOfScreen && (
        <div className={goToNowButton}>
          <Button
            light
            displayText={epgGoToNowButtoTitle}
            onClick={navigateNow}
          />
        </div>
      )}
    </Fragment>
  );
};

CustomCurrentTimeMarker.propTypes = {
  /**
   * Animation settings deciding ```enabled```,
   * ```speed``` and ```type``` (e.g. linear, ease-out)
   */
  animation: PropTypes.shape({
    disabled: PropTypes.bool,
    speed: PropTypes.number,
    type: PropTypes.string
  }),

  /** Text configuration from Accedo One for custom button to trigger navigateNow */
  epgGoToNowButtoTitle: PropTypes.string,

  /** The length of the marker */
  length: PropTypes.number,

  /** Custom function for re-rendering EPG */
  navigateNow: PropTypes.func,

  /** Text configuration from Accedo One for time marker label */
  nowText: PropTypes.string,

  /** Offset position */
  offset: PropTypes.number,

  /** Styles to be applied to the outer container div */
  style: PropTypes.object,

  /** Classname API for theming */
  theme: PropTypes.shape({
    currentTimeMarker: PropTypes.string
  }),

  /** If the time marker should be layed out vertically */
  vertical: PropTypes.bool,

  /** The thickness of the marker */
  width: PropTypes.number
};

export default CustomCurrentTimeMarker;
