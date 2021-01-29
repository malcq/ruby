import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Paper,
  Popover,
  MenuItem,
  MenuList
} from '@material-ui/core';

class ChangeUserStatus extends Component {
  buttonClick = (status, e) => {
    e.preventDefault();
    this.props.click(status);
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
            <MenuItem onClick={(e) => this.buttonClick('active', e)}>
              Активен
            </MenuItem>
            <MenuItem
              onClick={(e) => this.buttonClick('registered', e)}
              href="user"
            >
              Зарегистрирован
            </MenuItem>
            <MenuItem onClick={(e) => this.buttonClick('disabled', e)}>
              Отключён
            </MenuItem>
          </MenuList>
        </Paper>
      </Popover>
    );
  }
}

ChangeUserStatus.propTypes = {
  click: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  target: PropTypes.objectOf(PropTypes.any),
  onHide: PropTypes.func.isRequired
};

ChangeUserStatus.defaultProps = {
  target: null
};

export default ChangeUserStatus;
