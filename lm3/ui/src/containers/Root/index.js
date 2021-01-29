import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Route, Switch, withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import flow from 'lodash/flow';

import { init } from 'store/App/actions';

import MainPage from 'containers/MainPage';
import Members from 'containers/Members';
import AdminPanel from 'containers/AdminPanel';
import {
  SignIn,
  SignUp,
  ConfirmEmail,
  ForgotPassword,
  ResetPassword,
} from 'containers/Authentication';

import Notifications from 'components/Notifications';
import NotFoundPage from 'components/NotFoundPage';

import { StandardProtectedRoute, AdminProtectedRoute } from 'components/ProtectedRoute';

import { ROUTES } from 'constants';

import './styles.css';

class Root extends PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    initialize: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.initialize();
  }

  render() {
    const { loading } = this.props;

    if (loading) {
      return null;
    }

    return (
      <Fragment>
        <Switch>
          <Route exact path={ROUTES.SIGN_UP} component={SignUp} />
          <Route exact path={ROUTES.SIGN_IN} component={SignIn} />
          <Route exact path={ROUTES.CONFIRM_EMAIL} component={ConfirmEmail} />
          <Route exact path={ROUTES.FORGOT_PASSWORD} component={ForgotPassword} />
          <Route exact path={ROUTES.RESET_PASSWORD} component={ResetPassword} />

          <Route exact path={ROUTES.MAIN} component={MainPage} />
          <StandardProtectedRoute path={ROUTES.MEMBERS.BASE} component={Members} />
          <AdminProtectedRoute path={ROUTES.ADMIN_PANEL.DASHBOARD} component={AdminPanel} />
          <Route component={NotFoundPage} />
        </Switch>
        <Notifications />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.app.loading,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  initialize: init,
}, dispatch);

export default flow([
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
])(Root);
