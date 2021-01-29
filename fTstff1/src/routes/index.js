import React, { memo, lazy } from 'react';

import { Switch, withRouter } from 'react-router-dom';
import {
  LazyWrapper,
  ProtectedRoute
} from 'ui';

import auth from './auth';
import admin from './admin';
import sales from './sales';

const Travolta = lazy(() => import('pages/Travolta'));
const Home = lazy(() => import('pages/Home'));
const Articles = lazy(() => import('pages/Articles'));
const Requests = lazy(() => import('pages/Requests'));
const Account = lazy(() => import('pages/Account'));
const UserCalendar = lazy(() => import('pages/UserCalendar'));
const ExtraHours = lazy(() => import('pages/ExtraHours'));

const Router = () => (
  <Switch>
    {routes.map((route) => (
      <ProtectedRoute
        {...route}
        key={route.path}
        component={LazyWrapper(route.component)}
      />
    ))}
  </Switch>
);

const routes = [
  ...auth,
  ...admin,
  ...sales,
  {
    path: ['/account', '/account/:login'],
    exact: true,
    component: Account,
    role: 'any',
    pageTitle: 'Информация о сотруднике'
  }, {
    path: '/requests',
    exact: true,
    component: Requests,
    role: 'any',
    pageTitle: 'Ваша заявка'
  }, {
    path: '/calendar',
    exact: true,
    component: UserCalendar,
    role: 'any',
    pageTitle: 'Календарь'
  }, {
    path: '/articles',
    exact: true,
    component: Articles,
    role: 'any',
    pageTitle: 'Статьи'
  }, {
    path: '/extra',
    exact: true,
    component: ExtraHours,
    role: ['user', 'sales', 'admin'],
    pageTitle: 'Переработки'
  }, {
    path: ['/', '/home'],
    exact: true,
    component: Home,
    role: 'any',
    pageTitle: 'Добро пожаловать!'
  }, {
    path: '/',
    exact: false,
    component: Travolta,
    pageTitle: 'Страница не найдена'
  }
];

export default withRouter(memo(Router));
