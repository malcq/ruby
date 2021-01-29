import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  userRole,
  userStatus,
  dateToString
} from 'utils';

import { Link } from 'react-router-dom';
import {
  TableRow,
  TableCell
} from '@material-ui/core';
import Actions from './Actions';

class Body extends Component {
  render() {
    const { users } = this.props;
    return (
      <tbody className="usersTable">
        {users.map((user) => {
          return (
            <StyledTr key={user.id}>
              <SizeLimitTd>
                <Link to={`/account/${user.login}`}>
                  {`${user.lastName || ''} ${user.firstName || ''}`}
                </Link>
              </SizeLimitTd>

              <SizeLimitTd>
                <Link to={`/account/${user.login}`}>{user.login}</Link>
              </SizeLimitTd>

              <SizeLimitTd>{user.email}</SizeLimitTd>

              <SizeLimitTd>{dateToString(user.DoB)}</SizeLimitTd>

              <SizeLimitTd>{userRole[user.role]}</SizeLimitTd>

              <SizeLimitTd>{userStatus[user.status]}</SizeLimitTd>

              <Actions user={user} getArr={this.props.getArr} />
            </StyledTr>
          );
        })}
      </tbody>
    );
  }
}

const StyledTr = styled(TableRow)`
  &:nth-of-type(even) {
    background-color: #f8f8f8;
  }
`;

const SizeLimitTd = styled(TableCell)`
  max-width: 10px;
  word-wrap: break-word;
  font-size: 14px;

  && {
    text-align: center;
    border-right: 1px solid #e0e0e0;
    padding: 0 2px;
  }

  a {
    color: black;
  }
`;

Body.propTypes = {
  getArr: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default Body;
