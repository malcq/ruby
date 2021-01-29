import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Admin } from 'store';

import { NotificationsService } from 'services';

import NotFoundRecord from 'components/NotFoundRecord';

import { SHAPES } from 'constants';

import UsersForm from '../Form';

class Edit extends Component {
  static propTypes = {
    user: PropTypes.objectOf(PropTypes.shape),
    match: PropTypes.shape(SHAPES.ROUTER.MATCH).isRequired,
    updateUser: PropTypes.func.isRequired,
  };

  static defaultProps = {
    user: undefined,
  };

  onSubmitSuccess = () => NotificationsService.success({ message: 'User was updated' });

  handleEdit = ({ passwordConfirmation, ...data }) => {
    const { id } = this.props.match.params;

    return this.props.updateUser(id, data);
  };

  render() {
    const { user } = this.props;

    if (!user) {
      return <NotFoundRecord />;
    }

    return (
      <div className="col-lg-8 col-md-10 col-sm-12 mx-auto">
        <h1>Edit user</h1>
        <UsersForm
          user={user}
          formName="usersEditForm"
          onFormSubmit={this.handleEdit}
          postSubmitSuccess={this.onSubmitSuccess}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, { match: { params: { id } } }) => ({
  user: state.admin.users.byId[id],
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateUser: Admin.Users.update,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
