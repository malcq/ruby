import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { Router as HistoryProvider } from 'react-router';

import store from 'store';
import * as serviceWorker from 'serviceWorker';

import GlobalStyles from 'ui/styles/GlobalStyles';
import ThemeProvider from 'ui/styles/ThemeProvider';
import App from 'App';

export const history = createBrowserHistory();

ReactDOM.render(
  <Provider store={store}>
    <HistoryProvider history={history}>
      <ThemeProvider>
        <>
          <GlobalStyles />

          <App />
        </>
      </ThemeProvider>
    </HistoryProvider>
  </Provider>, document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
