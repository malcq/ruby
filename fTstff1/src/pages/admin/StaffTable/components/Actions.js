import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import {
  updateUserByAdminRequest,
  deleteUserRequest
} from 'api/userApi';

import {
  Popover,
  Button,
  MenuList,
  MenuItem,
  TableCell
} from '@material-ui/core';
import ChangeUserRole from './ChangeUserRole';
import ChangeUserStatus from './ChangeUserStatus';
import UserStatisticalModal from './UserStatisticalModal';
import UserDeleteModal from './UserDeleteModal';
import StudyPlan from './StudyPlan';

const connectFunction = connect((state) => ({
  globalUser: state.global.user
}));

class Actions extends Component {
  state = {
    openRole: false,
    showStatistic: false,
    showPlan: false,
    roleTarget: null,
    openStatus: false,
    statusTarget: null,
    anchorEl: null,
    showDeleteUser: false
  }

  toggleRole = (e) => {
    const { openRole } = this.state;
    this.setState({
      openRole: !openRole,
      roleTarget: e.target
    });
  };

  closeRole = () => {
    this.setState({
      openRole: false
    });
  };

  toggleStatus = (e) => {
    const { openStatus } = this.state;
    this.setState({
      openStatus: !openStatus,
      statusTarget: e.target
    });
  };

  closeStatus = () => {
    this.setState({
      openStatus: false
    });
  };

  onRoleChange = async (value) => {
    this.setState({
      openRole: false
    });
    if (this.props.user.role === value) {
      return;
    }
    try {
      await updateUserByAdminRequest(this.props.user.id, { role: value });
      this.props.getArr();
    } catch (err) {
      console.log(err);
    }
  };

  onStatusChange = async (value) => {
    this.setState({
      openStatus: false
    });
    if (this.props.user.status === value) {
      return;
    }
    try {
      await updateUserByAdminRequest(this.props.user.id, { status: value });
      this.props.getArr();
    } catch (err) {
      console.log(err);
    }
  };

  changeModalStatus = () => {
    const { showStatistic } = this.state;
    this.setState({
      showStatistic: !showStatistic
    });
  };

  changeModalDeleteUser = () => {
    const { showDeleteUser } = this.state;
    this.setState({
      showDeleteUser: !showDeleteUser
    });
  };

  deleteUser = async (id) => {
    try {
      await deleteUserRequest(id);
      this.props.getArr();
    } catch (err) {
      console.log(err);
    }
  };

  changeStudyPlan = () => {
    const { showPlan } = this.state;
    this.setState({
      showPlan: !showPlan
    });
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    const { user, globalUser } = this.props;

    return (
      <StyledTableCell>
        <Button
          aria-owns={anchorEl ? 'simple-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
          variant="outlined"
          color="primary"
          className="action-button"
        >
          Действия
        </Button>

        <Popover
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <MenuList id="simple-menu">
            {globalUser.role === 'admin' && globalUser.login !== user.login && (
              <MenuItem onClick={this.toggleRole}>Сменить роль </MenuItem>
            )}

            {(user.role !== 'admin' || globalUser.role === 'admin') && (
              globalUser.login !== user.login && (
                <MenuItem onClick={this.toggleStatus}>Сменить статус</MenuItem>
              )
            )}

            {user.role === 'student' && (
              <MenuItem onClick={this.changeStudyPlan}>Учебный план</MenuItem>
            )}

            <MenuItem onClick={this.changeModalStatus}>Статистика</MenuItem>

            {globalUser.role === 'admin' && globalUser.login !== user.login && (
              <MenuItem onClick={this.changeModalDeleteUser}>Удалить</MenuItem>
            )}
          </MenuList>
        </Popover>

        <UserStatisticalModal
          show={this.state.showStatistic}
          onHide={this.changeModalStatus}
          user={user}
          globalUser={globalUser}
        />
        <UserDeleteModal
          show={this.state.showDeleteUser}
          onHide={this.changeModalDeleteUser}
          user={user}
          onDelete={this.deleteUser}
        />
        <ChangeUserRole
          click={this.onRoleChange}
          show={this.state.openRole}
          target={this.state.roleTarget}
          onHide={this.closeRole}
        />
        <ChangeUserStatus
          click={this.onStatusChange}
          show={this.state.openStatus}
          target={this.state.statusTarget}
          onHide={this.closeStatus}
        />
        {this.state.showPlan && (
          <StudyPlan
            show={this.state.showPlan}
            onHide={this.changeStudyPlan}
            user={user}
          />
        )}
      </StyledTableCell>
    );
  }
}

const StyledTableCell = styled(TableCell)`
  width: 90px;
  padding: 0;

  .action-button {
    width: 100%;
    margin: 0 auto;
  }
`;

Actions.propTypes = {
  getArr: PropTypes.func.isRequired,
  globalUser: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(
    PropTypes.any
  ).isRequired
};

export default connectFunction(Actions);
