/**
 * The list below documents the changes to vdkweb-epg
 *
 * Change prop-types import from T to PropTypes
 * Use useContext to register which program has been clicked
 * Removing defaultTheme as theme is passed through componentProps
 * Conditionally render different background image if program does not allow timeshift
 */

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-mini';
import { pure } from 'recompose';
import classNames from 'classnames';
import { EpgContext } from '#/utils/context';
import { GoToLiveIcon, StartOverIcon } from '#/components/Icons';
import noTimeShiftBackground from '#/static/images/no-time-shift.png';
import { isLiveHelper, ONE_HOUR_IN_MS } from '#/helpers/timeHelpers';

const ONE_DAY_IN_MS = 24 * ONE_HOUR_IN_MS;

export const formatProgramTime = (startTime, endTime, timeFormat) => {
  const formattedEndTime = endTime.format(timeFormat);
  const formattedStartTime = startTime.format(timeFormat);

  return `${formattedStartTime}-${formattedEndTime}`;
};

/**
 * A component for displaying program information.
 * Displays a title and the program's timespan.
 * Time format can be altered by providing a custom
 * time format or time formatter function.
 * Also reacts to clicks if provided with a click handler.
 *
 * @param {object} props See propTypes
 * @returns {Program} A Program component
 */
const CustomProgram = ({
  channel = {},
  children,
  endTime,
  id,
  isFocused,
  nav,
  onClick,
  ongoing,
  realEndTime,
  realStartTime,
  startOverSupport,
  startTime,
  style,
  theme,
  timeFormat,
  title
}) => {
  const { onMouseOver: onMouseEnter, onMouseOut: onMouseLeave } = nav;

  const {
    programSelected: { programId }
  } = useContext(EpgContext);
  const { isIptvMulticast, isOttUnicast } = channel;

  const end = moment(realEndTime || endTime);
  const start = moment(realStartTime || startTime);
  const isLive = isLiveHelper({ end, start });
  const inStartOverRange = Date.now() > end && Date.now() - end < ONE_DAY_IN_MS;
  const isFibreTv = isIptvMulticast && !isOttUnicast;
  const shouldShowStartOver =
    inStartOverRange && startOverSupport && !isFibreTv;

  const displayTime =
    typeof timeFormat === 'function'
      ? timeFormat(start, end)
      : formatProgramTime(start, end, timeFormat);

  const {
    clickable,
    clicked,
    focused,
    iconContainer,
    iconStyle,
    innerContainer,
    innerProgramContainer,
    ongoing: { ongoingTheme } = {}
  } = theme;

  const containerClassName = classNames(innerContainer, {
    [focused]: isFocused,
    [ongoingTheme]: ongoing,
    [clickable]: !!onClick,
    [clicked]: id === programId
  });

  return (
    <div
      {...isOttUnicast && { onClick }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={style}
    >
      <div
        className={containerClassName}
        {...inStartOverRange &&
          !startOverSupport && {
            title: 'no timeshift',
            style: {
              backgroundImage: `url(${noTimeShiftBackground})`,
              backgroundSize: '500px 75px',
              backgroundColor: '#151617'
            }
          }}
      >
        {children || (
          <div className={innerProgramContainer}>
            {isLive && (
              <GoToLiveIcon
                iconContainer={iconContainer}
                iconStyle={iconStyle}
              />
            )}
            {shouldShowStartOver && (
              <StartOverIcon
                iconContainer={iconContainer}
                iconStyle={iconStyle}
              />
            )}
            <span className={theme.titleText}>{title}</span>
            <span className={theme.timeText}>{`${displayTime}`}</span>
          </div>
        )}
      </div>
    </div>
  );
};

CustomProgram.defaultProps = {
  nav: {},
  timeFormat: 'HH:mm'
};

CustomProgram.propTypes = {
  /** Program's channel information */
  channel: PropTypes.shape({
    isOttUnicast: PropTypes.bool
  }),

  /** React children */
  children: PropTypes.node,

  /** When the program ends (unix timestamp) */
  endTime: PropTypes.number,

  /** Program id passed from ProgramGuideTile */
  id: PropTypes.string,

  /** Passed by VDK Navigation */
  isFocused: PropTypes.bool,

  /**
   * Navigation object for supporting key navigation and
   * global focus management.
   */
  nav: PropTypes.shape({
    isFocused: PropTypes.bool,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func
  }),

  /** Click handler, will pass the program object as argument */
  onClick: PropTypes.func,

  /** If the program is ongoing at the moment */
  ongoing: PropTypes.bool,

  /**
   * When passing splitProgramsByTimespan prop to the ProgramGuide, this will
   * be the real (before split) endTime
   */
  realEndTime: PropTypes.number,

  /**
   * When passing splitProgramsByTimespan prop to the ProgramGuide, this will be
   * the real (before split) startTime
   */
  realStartTime: PropTypes.number,

  /** Boolean to indicate if program has startOverSupport */
  startOverSupport: PropTypes.bool,

  /** When the program starts (unix timestamp) */
  startTime: PropTypes.number,

  /** Style object to be applied to the outer container div */
  style: PropTypes.object,

  /** Classname API for theming */
  theme: PropTypes.shape({
    innerContainer: PropTypes.string,
    program: PropTypes.string,
    timeText: PropTypes.string,
    title: PropTypes.string
  }),

  /**
   * Time format, either a string as supported by moment.js (e.g. 'HH:mm')
   * or a function for performing formatting.
   * The function should have the following interface:
   * ```timeFormat(startTime, endTime, timeFormatString)```
   */
  timeFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

  /** Program title to be displayed */
  title: PropTypes.string
};

export default pure(CustomProgram);
