import { createBrowserHistory }from 'history';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import 'flag-icon-css/css/flag-icon.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-select/dist/react-select.css';

import App, { CHANGE_PASSWORD_PATH } from './App';
import createStore from './stores';
import { userLoadState } from "./stores/actionCreators";
import { wsURL } from './config/local.json';
import { setDefaultLocale } from './config/moment';
import './index.scss';
import './assets/styles/icons.scss';
import './assets/styles/colors.scss';
import './assets/styles/general.scss';


setDefaultLocale();
const history = createBrowserHistory();
const store = createStore(history);

if (window.location.pathname !== CHANGE_PASSWORD_PATH){
  store.dispatch(userLoadState(window.location));
}

ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>,
  document.getElementById('root') as HTMLElement
);
