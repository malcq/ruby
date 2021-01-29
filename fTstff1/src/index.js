import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';

import store from 'store';

import { Router as HistoryProvider } from 'react-router';
import CssBaseline from '@material-ui/core/CssBaseline';
import App from 'App';
import MaterialTheme from 'ui/styles/theme/MaterialTheme';
import StyledComponentsTheme from 'ui/styles/theme/StyledComponentsTheme';
import GlobalStyles from 'ui/styles/GlobalStyles';

import 'react-day-picker/lib/style.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'rc-slider/assets/index.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-quill/dist/quill.snow.css';

export const history = createBrowserHistory();

ReactDOM.render(
  <Provider store={store}>
    <HistoryProvider history={history}>
      <MaterialTheme>
        <StyledComponentsTheme>
          <>
            <GlobalStyles/>

            <CssBaseline />

            <App />
          </>
        </StyledComponentsTheme>
      </MaterialTheme>
    </HistoryProvider>
  </Provider>,
  document.getElementById('root')
);

const startPwa = () => {
  if ('serviceWorker' in navigator) {
    console.log('CLIENT: service worker registration in progress.');
    try {
      navigator.serviceWorker.register('service-worker-pwa.js');
      console.log('CLIENT: service worker registration complete.');
    } catch {
      console.log('CLIENT: service worker registration failure.');
    }
  } else {
    console.log('CLIENT: service worker is not supported.');
  }
};
startPwa();
