import React from 'react';
import PropTypes from 'prop-types';

import { Checkbox } from '#/components/Input';

import {
  restrictedChannelItem,
  channelImage,
  channelTitle,
  channelNum,
  channelCheckbox,
  channelMetadataContainer
} from './parental-control.scss';

const RestrictedChannelItem = ({
  style,
  channelId,
  channelName,
  id,
  image,
  onChannelSelect,
  selectedChannels
}) => {
  const checked = selectedChannels[id];
  const toggle = () => {
    onChannelSelect(id, !checked);
  };

  return (
    <div className={restrictedChannelItem} style={style}>
      <img className={channelImage} src={image} alt="channel" />
      <div className={channelMetadataContainer}>
        <span className={channelNum}>{channelId}</span>
        <span className={channelTitle}>{channelName}</span>
        <Checkbox
          type="tick"
          className={channelCheckbox}
          checked={selectedChannels[id]}
          onChange={toggle}
        />
      </div>
    </div>
  );
};

RestrictedChannelItem.propTypes = {
  channelId: PropTypes.number,
  channelName: PropTypes.string,
  id: PropTypes.string,
  image: PropTypes.string,
  onChannelSelect: PropTypes.func,
  selectedChannels: PropTypes.object,
  style: PropTypes.object
};

export default RestrictedChannelItem;
