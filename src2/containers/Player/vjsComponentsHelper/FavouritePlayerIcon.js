import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _throttle from 'lodash/throttle';
import _isBoolean from 'lodash/isBoolean';

import { noop } from '#/helpers';
import { ON_FAVOURITE_CHANGE } from '#/constants';

import {
  FavouriteIcon as FavouriteUnfilledIcon,
  FavouriteFilledIcon
} from '#/components/Icons';

const FavouritePlayerIcon = ({ playerInstance, iconContainer, iconStyle }) => {
  const [isFav, setFav] = useState(undefined);

  const {
    state: { favouriteBtnControls: { isFavourite, onClick = noop } = {} }
  } = playerInstance || {};

  useEffect(() => {
    if (!_isBoolean(isFav)) {
      setFav(isFavourite);
    }
    const onChange = event => {
      const { detail } = event || {};
      const { isFavourite: isFavouriteFromEvent } = detail || {};

      if (isFav !== isFavouriteFromEvent) {
        setFav(isFavouriteFromEvent);
      }
    };

    window.addEventListener(ON_FAVOURITE_CHANGE, onChange);

    return () => window.removeEventListener(ON_FAVOURITE_CHANGE, onChange);
  }, []);

  const FavIcon = isFav ? FavouriteFilledIcon : FavouriteUnfilledIcon;

  const onIconClick = _throttle(() => {
    onClick();
    setFav(!isFav);
  }, 1000);

  return (
    <div onClick={onIconClick}>
      <FavIcon iconContainer={iconContainer} iconStyle={iconStyle} />
    </div>
  );
};

FavouritePlayerIcon.propTypes = {
  playerInstance: PropTypes.object,
  iconContainer: PropTypes.string,
  iconStyle: PropTypes.string
};

export default FavouritePlayerIcon;
