import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookMessengerShareButton,
  FacebookIcon,
  TwitterIcon,
  FacebookMessengerIcon,
  WhatsappIcon
} from 'react-share';

import Button from '#/components/Button/Button';

import { getCurrentUrl } from '#/components/SEO/urlUtil';

import { FACEBOOK_APP_ID } from '#/constants';

import {
  socialSharingCopyButton,
  socialSharingCopyLinkSection,
  socialSharingIcons,
  socialSharingTitle
} from './socialSharingOverlay.scss';

const SocialSharingOverlay = ({ messages = {} }) => {
  const { detailShareCopyLink, detailShareTitle } = messages;
  const socialShareLink = useRef(null);

  const copyLink = useCallback(() => {
    socialShareLink.current?.select();
    if (__CLIENT__) {
      navigator.clipboard.writeText(socialShareLink.current?.value);
    }
  }, [socialShareLink]);

  const currentUrl = getCurrentUrl();

  return (
    <div>
      <h2 className={socialSharingTitle}>{detailShareTitle}</h2>
      <div className={socialSharingIcons}>
        <FacebookShareButton url={currentUrl}>
          <FacebookIcon />
        </FacebookShareButton>
        <FacebookMessengerShareButton appId={FACEBOOK_APP_ID} url={currentUrl}>
          <FacebookMessengerIcon />
        </FacebookMessengerShareButton>
        <TwitterShareButton url={currentUrl}>
          <TwitterIcon />
        </TwitterShareButton>
        <WhatsappShareButton url={currentUrl}>
          <WhatsappIcon />
        </WhatsappShareButton>
      </div>
      <div className={socialSharingCopyLinkSection}>
        <input readOnly="readonly" ref={socialShareLink} value={currentUrl} />
        <Button
          dark
          className={socialSharingCopyButton}
          displayText={detailShareCopyLink}
          onClick={copyLink}
        />
      </div>
    </div>
  );
};

SocialSharingOverlay.propTypes = {
  messages: PropTypes.object
};

export default React.memo(SocialSharingOverlay);
