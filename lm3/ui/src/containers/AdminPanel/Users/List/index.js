import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import map from 'lodash/map';
import pick from 'lodash/pick';

import { Admin } from 'store';
import { NotificationsService } from 'services';

import { List } from 'containers/AdminPanel/Containers';

import { Pagination } from 'components/Bootstrap';

import { ROUTES } from 'constants';
import { PaginationUtils } from 'utils';

import UserItem from './Item';

class UsersList extends PureComponent {
  static propTypes = {
    users: PropTypes.objectOf(PropTypes.shape).isRequired,
    total: PropTypes.number.isRequired,
    deleteUser: PropTypes.func.isRequired,
  };

  handleDeleteUser = id => {
    this.props.deleteUser(id)
      .then(() => NotificationsService.success({ message: 'User was deleted' }));
  }

  render() {
    const { users, total } = this.props;

    return (
      <List>
        <List.Header
          className="btn"
          text="Users"
          buttonText="New User"
          buttonUrl={ROUTES.ADMIN_PANEL.USERS.CREATE}
        />

        <List.Content>
          <List.Content.Head>
            <List.Content.Row>
              <List.Content.Heading>
                First Name
              </List.Content.Heading>
              <List.Content.Heading>
                Last Name
              </List.Content.Heading>
              <List.Content.Heading>
                Email
              </List.Content.Heading>
              <List.Content.Heading>
                Role
              </List.Content.Heading>
              <List.Content.Heading>
                Created At
              </List.Content.Heading>
              <List.Content.Heading>
                Updated At
              </List.Content.Heading>
              <List.Content.Heading />
            </List.Content.Row>
          </List.Content.Head>

          <List.Content.Body>
            {total > 0 ? map(users, (user, id) => (
              <UserItem key={id} user={user} onDelete={this.handleDeleteUser} />
            )) : (
              <List.Content.Empty />
            )}
          </List.Content.Body>
        </List.Content>

        <Pagination
          totalItems={total}
          urlPath={ROUTES.ADMIN_PANEL.USERS.INDEX}
        />
      </List>
    );
  }
}

const mapStateToProps = (state, { location: { query } }) => ({
  users: pick(
    state.admin.users.byId,
    PaginationUtils.sliceByPage(state.admin.users.ids, Number(query.page || 1))
  ),
  total: state.admin.users.total,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  deleteUser: Admin.Users.destroy,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UsersList);
