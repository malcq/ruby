import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { createSelector } from 'reselect';
import moment from 'moment';

import { getName } from 'utils';

import {
  TableRow,
  TableCell
} from '@material-ui/core';
import Task from './Task';

class Body extends Component {
  dateSelector = createSelector(
    (date) => date,
    (date) => {
      return moment(date).format('DD MMM YYYY');
    }
  );

  userSelector = createSelector(
    (user) => user,
    (user) => {
      return getName(user);
    }
  );

  render() {
    const { tasks, isStudentTasks } = this.props;
    if (!tasks.length) {
      return null;
    }

    return (
      <tbody className="usersTable">
        {tasks.map((task) => {
          return (
            <StyledTr key={task.id}>
              <SizeLimitTd>
                <Task {...this.props} task={task} />
              </SizeLimitTd>
              {!isStudentTasks && (
                <>
                  <SizeLimitTd className="center">
                    {this.dateSelector(task.createdAt)}
                  </SizeLimitTd>
                  <SizeLimitTd className="center">
                    {this.userSelector(task.user)}
                  </SizeLimitTd>
                </>
              )}
            </StyledTr>
          );
        })}
      </tbody>
    );
  }
}

const StyledTr = styled(TableRow)`
  td:hover {
    background-color: #eee;
  }
  .center {
    text-align: center;
  }

  &:nth-of-type(even) {
    background-color: #f8f8f8;
  }
`;

const SizeLimitTd = styled(TableCell)`
  max-width: 10px;
  word-wrap: break-word;
  font-size: 14px;
  a {
    color: black;
  }
`;

Body.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.any).isRequired,
  getTasks: PropTypes.func.isRequired,
  isStudentTasks: PropTypes.bool,
  // globalUser: PropTypes.objectOf(
  //   PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array])
  // ).isRequired
};

Body.defaultProps = {
  isStudentTasks: true
};

export default Body;
