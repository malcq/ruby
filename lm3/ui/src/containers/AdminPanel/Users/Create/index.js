import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { Admin } from 'store';

import { NotificationsService } from 'services';

import { ROUTES } from 'constants';

import UsersForm from '../Form';

import validationRules from './validationRules';

class Create extends Component {
  static propTypes = {
    createUser: PropTypes.func.isRequired,
    pushRoute: PropTypes.func.isRequired,
  };

  onSubmitSuccess = () => {
    NotificationsService.success({ message: 'User was created' });

    this.props.pushRoute(ROUTES.ADMIN_PANEL.USERS.INDEX);
  };

  handleCreate = ({ passwordConfirmation, ...data }) => this.props.createUser(data);

  render() {
    return (
      <div className="col-lg-8 col-md-10 col-sm-12 mx-auto">
        <h1>New user</h1>
        <UsersForm
          formName="usersCreateForm"
          onFormSubmit={this.handleCreate}
          postSubmitSuccess={this.onSubmitSuccess}
          validationRules={validationRules}
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  createUser: Admin.Users.create,
  pushRoute: push,
}, dispatch);

export default connect(null, mapDispatchToProps)(Create);
