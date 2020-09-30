/**
 * The list below documents the changes to vdkweb-epg
 *
 * Change prop-types import from T to PropTypes
 * Use useContext to register which program's channel has been clicked
 * Removing defaultTheme as theme is passed through componentProps
 * Add channel labels for certain channels
 */

import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { pure } from 'recompose';
import { EpgContext } from '#/utils/context';

/**
 * A cell for showing channel information such as the
 * channel's logo or title. Used together
 * with a ChannelColumn.
 *
 * @param {any} props See propTypes.
 * @returns {ChannelCell} A ChannelCell component
 */
const CustomChannelCell = ({
  channel = {},
  width,
  height,
  style = {},
  onClick,
  horizontal = true,
  theme,
  isFocused,
  nav = {}
}) => {
  const { onMouseOver: onMouseEnter, onMouseOut: onMouseLeave } = nav;
  const _style = {
    width,
    minWidth: width,
    height: height || '100%',
    lineHeight: horizontal && height ? `${height}px` : '',
    ...style
  };

  const {
    programSelected: { channelId }
  } = useContext(EpgContext);
  const { channelId: name, id, image, isIptvMulticast, isOttUnicast } = channel;

  const {
    channelCell,
    channelClickable,
    clickedBorder,
    fibreActive,
    fibreLabel,
    focused,
    horizontal: { themeHorizontal } = {},
    innerChannelCell
  } = theme;
  const className = classNames(channelCell, {
    [channelClickable]: !!onClick,
    [themeHorizontal]: horizontal,
    [focused]: isFocused || nav?.isFocused,
    [clickedBorder]: channelId && id === channelId
  });
  const fibreLabelClass = classNames(fibreLabel, {
    [fibreActive]: isIptvMulticast && !isOttUnicast
  });

  return (
    <div
      className={className}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={_style}
    >
      <div className={fibreLabelClass}>FIBRE TV ONLY</div>
      <div className={innerChannelCell}>
        {image ? (
          <Fragment>
            <span className={theme.text}>{name}</span>
            <img
              alt={`Channel logo for ${channel.channelNumber ||
                channel.channelId}`}
              className={theme.channelImage}
              src={image}
            />
          </Fragment>
        ) : (
          <span className={theme.text}>{name}</span>
        )}
      </div>
    </div>
  );
};

CustomChannelCell.propTypes = {
  /** The channel object for this cell */
  channel: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,

  /** The height of the cell */
  height: PropTypes.number,

  /** If the channel cell is layed out horizontally */
  horizontal: PropTypes.bool,

  isFocused: PropTypes.bool,
  nav: PropTypes.object,

  /** Click handler, applied when clicking a channel cell */
  onClick: PropTypes.func,

  style: PropTypes.object,

  /** Classname API for theming */
  theme: PropTypes.shape({
    channelClickable: PropTypes.string,
    channelName: PropTypes.string,
    focused: PropTypes.string,
    horizontal: PropTypes.string,
    text: PropTypes.string
  }),

  /** The width of the cell */
  width: PropTypes.number
};

export default pure(CustomChannelCell);
