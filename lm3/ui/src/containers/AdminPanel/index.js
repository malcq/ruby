import React, { Fragment } from 'react';

import { Switch, Route } from 'react-router-dom';

import { Container } from 'reactstrap';

import { ROUTES } from 'constants';

import NotFoundPage from 'components/NotFoundPage';

import Header from './Header';
import Users from './Users';

import Footer from './Footer';
import Dashboard from './Dashboard';


import './styles.css';

const AdminPanel = () => (
  <Fragment>
    <Header />
    <Container>
      <Switch>
        <Route exact path={ROUTES.ADMIN_PANEL.DASHBOARD} component={Dashboard} />
        <Route path={ROUTES.ADMIN_PANEL.USERS.INDEX} component={Users} />
        <Route component={NotFoundPage} />
      </Switch>
    </Container>
    <Footer />
  </Fragment>
);

export default AdminPanel;

