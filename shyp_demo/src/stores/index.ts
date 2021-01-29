import { History } from "history";
import { routerMiddleware } from 'react-router-redux';
import {
    applyMiddleware,
    compose,
    createStore,
    Middleware,
    Store,
    StoreEnhancerStoreCreator,
} from 'redux';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';

import rootReducer, {
  initialState
} from './reducers';
import rootSaga from './sagas';

export default function (history: History): Store {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const sagaMiddleware: SagaMiddleware<any> = createSagaMiddleware();
  const middleware: Middleware[] = [sagaMiddleware, routerMiddleware(history)];

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers: StoreEnhancerStoreCreator[] = [];
  if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = (window as any).devToolsExtension
      ? (window as any).devToolsExtension()
      : (f:any)=>f;
    enhancers.push(devToolsExtension);
  }
  const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers,
  );

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store: Store = createStore(
    rootReducer,
    initialState,
    composedEnhancers,
  );
  sagaMiddleware.run(rootSaga);
  return store;
}

