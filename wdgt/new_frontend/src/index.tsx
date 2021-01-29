import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import 'simplebar/dist/simplebar.css';
import 'react-circular-progressbar/dist/styles.css';
import './styles.css';

import App from './App';

import * as serviceWorker from './serviceWorker';

import store from './store'
import { widgetService } from './api/widget';
import { chatService } from './api/chat';

import {
  openWidgetState,
  closeWidgetState,
  setConfig,
} from './store/widget/actions';

import {
  checkSession,
  activeOn,
  activeOff,
} from './api/user';

if (process.env.NODE_ENV === 'development') {
  console.debug = console.log;
  (window as any)['chatService'] = chatService;
} else {
  console.debug = () => {};
}

// store.dispatch({
  // type: 'INITIALIZE',
  /**
   * 1. Create new store folder inside /store
   * 2. Add reducer and action creators like in store/user/actions.ts
   * 3. Add reducer like in store/user/reducer.ts
   * 4. Connect new store to store/reducers.ts
   * 5. Make dispatch here
   */
// });
let chatStarted = false;
widgetService
  .addOnOpenListener(() => {
    if(!chatStarted) {
      chatStarted = true;
    }
    store.dispatch(openWidgetState());
    activeOn();
  })
  .addOnCloseListener(() => {
    store.dispatch(setConfig({initialized: false}));
    store.dispatch(closeWidgetState());
    activeOff();
  });

async function start() {
  const widgetConfig = await widgetService.getConfig();
  const hasSession: boolean = await checkSession();

  console.debug(`index hasSession=${hasSession}`);

  store.dispatch(setConfig({ isMobile: widgetConfig.isMobile, initialized: false, hasSession }));
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
}
start();


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
