import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Table,
  Paper
} from '@material-ui/core';
import Head from './Head';
import Body from './Body';

class UsersTable extends Component {
  state = {
    select: 'lastName'
  }

  applySort = (column, direction) => {
    this.setState({
      select: column
    });
    const newDirection = direction === 'down' ? 'ASC' : 'DESC';
    this.props.applySort([column, newDirection]);
  };

  render() {
    return (
      <Paper style={{ overflowX: 'auto' }}>
        <Table striped="true" bordered="true">
          <Head select={this.state.select} applySort={this.applySort} />
          <Body users={this.props.users} getArr={this.props.getArr} />
        </Table>
      </Paper>
    );
  }
}

UsersTable.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  getArr: PropTypes.func.isRequired,
  applySort: PropTypes.func.isRequired
};

export default UsersTable;
