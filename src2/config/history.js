import { BrowserRouter, HashRouter } from 'react-router-dom';

import { createHashHistory, createBrowserHistory } from 'history';

let appHistory;
let Router;

if (
  typeof __HISTORY_TYPE__ !== 'undefined' &&
  __HISTORY_TYPE__ === 'hashHistory'
) {
  appHistory = createHashHistory();
  Router = HashRouter;
} else if (typeof window === 'object') {
  appHistory = createBrowserHistory();
  Router = BrowserRouter;
}

export default {
  appHistory,
  Router
};
