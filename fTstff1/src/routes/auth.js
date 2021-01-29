import { lazy } from 'react';

const SignIn = lazy(() => import('pages/auth/SignIn'));
const SignUp = lazy(() => import('pages/auth/SignUp'));
const PasswordRecovery = lazy(() => import('pages/auth/PasswordRecovery'));
const PasswordReset = lazy(() => import('pages/auth/PasswordReset'));

export default [
  {
    path: '/login',
    exact: true,
    component: SignIn,
    role: 'none',
    pageTitle: 'Вход'
  }, {
    path: '/register',
    exact: true,
    component: SignUp,
    role: 'none',
    pageTitle: 'Регистрация'
  }, {
    path: '/password_recovery',
    exact: true,
    component: PasswordRecovery,
    role: 'none',
    pageTitle: 'Восстановление пароля'
  }, {
    path: '/reset/:token',
    exact: true,
    component: PasswordReset,
    role: 'none',
    pageTitle: 'Изменение пароля'
  }
];
