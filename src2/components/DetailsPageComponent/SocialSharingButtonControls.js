import React from 'react';
import PropTypes from 'prop-types';

import Button from '#/components/Button/Button';
import { SocialShareIcon } from '#/components/Icons';
import { noop } from '#/helpers';

const SocialSharingButton = ({ displayText = '', onClickFn = noop }) => {
  return (
    <Button
      dark
      hasLeftIcon
      displayText={displayText}
      Icon={SocialShareIcon}
      onClick={onClickFn}
    />
  );
};

const SocialSharingButtonControls = ({
  isShareDialogOpen,
  setShareDialogState = noop
}) => {
  return (
    <SocialSharingButton
      displayText="Share"
      onClickFn={() => {
        setShareDialogState(!isShareDialogOpen);
      }}
    />
  );
};

SocialSharingButton.propTypes = {
  displayText: PropTypes.string,
  onClickFn: PropTypes.func
};

SocialSharingButtonControls.propTypes = {
  setShareDialogState: PropTypes.func,
  isShareDialogOpen: PropTypes.bool
};

export default SocialSharingButtonControls;
