import React from 'react';

const SignIn = React.lazy(() => import('pages/auth/SignIn'));

export default [{
  path: '/auth/sign-in',
  exact: true,
  component: SignIn
}];
