import React from 'react';
import PropTypes from 'prop-types';
import { WarningSign } from '#/components/Icons';
import { STATIC_PAGE_OPTIONS } from '#/constants';
import staticPageTheme from './staticPage.scss';

const defaultMaintenanceMessage =
  'This site is not available at the moment. Please try again later.';

const { maintenance, mobileRedirect } = STATIC_PAGE_OPTIONS;

const StaticPage = ({ messages, theme, type }) => {
  const {
    MaintenanceDialogTitle,
    MaintenanceDialogMessage,
    mobilePageTitle,
    mobilePageMessage
  } = messages || {};
  const staticPageConfig = {
    [maintenance]: {
      message: MaintenanceDialogMessage || defaultMaintenanceMessage,
      title: MaintenanceDialogTitle
    },
    [mobileRedirect]: {
      message: mobilePageMessage,
      title: mobilePageTitle
    }
  };

  const { message, title } = staticPageConfig[type] || {};

  return (
    <div>
      <WarningSign iconContainer={theme.sign} />
      <h1 className={theme.title}>{title}</h1>
      <h1 className={theme.message}>{message}</h1>
    </div>
  );
};

StaticPage.propTypes = {
  messages: PropTypes.object,
  theme: PropTypes.object,
  type: PropTypes.oneOf(['maintenance', 'mobileRedirect'])
};

StaticPage.defaultProps = {
  theme: staticPageTheme
};

export default StaticPage;
