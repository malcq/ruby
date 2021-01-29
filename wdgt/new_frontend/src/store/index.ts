import {
  createStore,
  applyMiddleware,
  compose,
} from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';
import api from '../api';

function getCompose() {
  const withDevtools = process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  if (withDevtools) {
    return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  }
  return compose;
}


const composeEnhancers = getCompose();

const middlewares = composeEnhancers(
  applyMiddleware(thunk.withExtraArgument(api))
);

const store = createStore(reducers, middlewares);

export default store;
