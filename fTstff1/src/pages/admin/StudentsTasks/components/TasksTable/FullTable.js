import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Table,
  Paper
} from '@material-ui/core';
import { connectGlobalUser } from 'store/connections';
import TableHead from './TableHead';
import TableBody from './TableBody';

class FullTable extends Component {
  state = {
    select: 'title'
  }

  applySort = (column, direction) => {
    this.setState({
      select: column
    });
    const newDirection = direction === 'down' ? 'ASC' : 'DESC';
    this.props.applySort([column, newDirection]);
  };

  render() {
    const { isStudentTasks } = this.props;
    const { select } = this.state;
    return (
      <Paper style={{ overflowX: 'auto' }}>
        <Table>
          <TableHead
            isStudentTasks={isStudentTasks}
            select={select}
            applySort={this.applySort}
          />
          <TableBody {...this.props} />
        </Table>
      </Paper>
    );
  }
}

FullTable.propTypes = {
  applySort: PropTypes.func.isRequired,
  tasks: PropTypes.arrayOf(PropTypes.any).isRequired,
  getTasks: PropTypes.func.isRequired,
  isStudentTasks: PropTypes.bool,
  // user: PropTypes.objectOf(
  //   PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array])
  // ).isRequired
};
FullTable.defaultProps = {
  isStudentTasks: true
};

export default connectGlobalUser(FullTable);
