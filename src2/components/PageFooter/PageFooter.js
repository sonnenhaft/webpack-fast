import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { ConfigContext } from '#/utils/context';
import { isMobile } from '#/utils/getPlatform';

import styles from './pageFooter.scss';
import ExternalLink from '../ExternalLink/ExternalLink';

const { version } = __FILTERED_PACKAGE_JSON__ || {};
const [versionNumber, buildNumber] = version?.split('-') || [];
const fullVersionNumber = buildNumber
  ? `${versionNumber} (${buildNumber})`
  : versionNumber;

const PageFooter = ({ className }) => {
  const {
    copyrightText,
    faqUrl,
    messages,
    privacyPolicyLink,
    termsAndConditionLink
  } = useContext(ConfigContext) || {};
  const { footerHelp, footerPrivacyPolicy, footerTC } = messages || {};

  const footerLinks = [
    {
      displayText: footerPrivacyPolicy,
      to: privacyPolicyLink
    },
    {
      displayText: footerTC,
      to: termsAndConditionLink
    },
    {
      displayText: footerHelp,
      to: faqUrl
    }
  ];

  return (
    <div className={classnames(styles.pageFooter, className)}>
      <span className={styles.copyRight}>{copyrightText}</span>
      {!isMobile() &&
        footerLinks.map((item, index) => (
          <ExternalLink
            displayText={item.displayText}
            href={item.to}
            key={`${item.to}-${index}`}
          />
        ))}
      <span>{`v${fullVersionNumber}`}</span>
    </div>
  );
};

PageFooter.propTypes = {
  className: PropTypes.string
};

export default PageFooter;
