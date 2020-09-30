import React from 'react';
import PropTypes from 'prop-types';
import {
  AuthProvider,
  HistoryProvider,
  PageProvider,
  TranslateProvider,
  UserPrefProvider
} from '#/utils/context';
import { ThemeProvider } from '#/theme/Theme';
import AppShell from './AppShell';
import ErrorBoundary from '../utils/ErrorBoundary';

const App = ({ content }) => {
  return (
    <ErrorBoundary>
      <HistoryProvider>
        <ThemeProvider>
          <TranslateProvider>
            <PageProvider>
              <AuthProvider>
                <UserPrefProvider>
                  <AppShell>{content}</AppShell>
                </UserPrefProvider>
              </AuthProvider>
            </PageProvider>
          </TranslateProvider>
        </ThemeProvider>
      </HistoryProvider>
    </ErrorBoundary>
  );
};

App.contextTypes = {
  router: PropTypes.object
};

App.propTypes = {
  content: PropTypes.any
};

export default App;
