import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Paper,
  Popover,
  MenuItem,
  MenuList
} from '@material-ui/core';

class ChangeUserRole extends Component {
  buttonClick = (role, e) => {
    e.preventDefault();
    this.props.click(role);
  };

  render() {
    return (
      <Popover
        open={this.props.show}
        onClose={this.props.onHide}
        anchorEl={this.props.target}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Paper>
          <MenuList>
            <MenuItem onClick={(e) => this.buttonClick('student', e)}>
              Стажёр
            </MenuItem>
            <MenuItem onClick={(e) => this.buttonClick('user', e)} href="user">
              Пользователь
            </MenuItem>
            <MenuItem onClick={(e) => this.buttonClick('sales', e)}>
              Sales менеджер
            </MenuItem>
            <MenuItem onClick={(e) => this.buttonClick('admin', e)}>
              Администратор
            </MenuItem>
          </MenuList>
        </Paper>
      </Popover>
    );
  }
}

ChangeUserRole.propTypes = {
  click: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  target: PropTypes.objectOf(PropTypes.any),
  onHide: PropTypes.func.isRequired
};

ChangeUserRole.defaultProps = {
  target: null
};

export default ChangeUserRole;
