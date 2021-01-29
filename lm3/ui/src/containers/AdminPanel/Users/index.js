import React from 'react';

import { Route, Switch } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';

import { Admin } from 'store';

import NotFoundPage from 'components/NotFoundPage';

import { ROUTES } from 'constants';

import List from './List';
import Create from './Create';
import Edit from './Edit';

const Users = () => (
  <Switch>
    <Route exact path={ROUTES.ADMIN_PANEL.USERS.INDEX} component={List} />
    <Route exact path={ROUTES.ADMIN_PANEL.USERS.CREATE} component={Create} />
    <Route exact path={ROUTES.ADMIN_PANEL.USERS.EDIT} component={Edit} />

    <Route component={NotFoundPage} />
  </Switch>
);

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchUsers: Admin.Users.fetch,
}, dispatch);

export default compose(
  connect(null, mapDispatchToProps),
  lifecycle({
    componentDidMount() {
      this.props.fetchUsers();
    },
  })
)(Users);
