import React, { memo } from 'react';
import { Switch } from 'react-router-dom';

import {
  LazyWrapper,
  ProtectedRoute
} from 'ui';
import auth from './auth';

const Page404 = React.lazy(() => import('pages/Page404'));
const Home = React.lazy(() => import('pages/Home'));

const Router = () => (
  <Switch>
    {routes.map((route) => (
      <ProtectedRoute
        key={route.path}
        {...route}
        component={LazyWrapper(route.component)}
      />
    ))}
  </Switch>
);

const routes = [
  ...auth, {
    path: '/',
    exact: true,
    component: Home
  }, {
    path: '/',
    exact: false,
    component: Page404
  }
];

export default memo(Router);
