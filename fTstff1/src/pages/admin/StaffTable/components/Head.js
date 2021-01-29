import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  TableHead,
  TableRow,
  TableCell
} from '@material-ui/core';
import ColumnTitle from './ColumnTitle';

class Head extends Component {
  render() {
    return (
      <TableHead>
        <Row>
          <ColumnTitle
            applySort={this.props.applySort}
            select={this.props.select}
            value="lastName"
            title="Имя"
            className="lastName border_right"
          />

          <ColumnTitle
            applySort={this.props.applySort}
            select={this.props.select}
            title="Логин"
            value="login"
            className="login border_right"
          />

          <ColumnTitle
            applySort={this.props.applySort}
            select={this.props.select}
            title="Email"
            value="email"
            className="email border_right"
          />

          <ColumnTitle
            applySort={this.props.applySort}
            select={this.props.select}
            title="Дата рождения"
            value="DoB"
            className="DoB border_right"
          />

          <ColumnTitle
            applySort={this.props.applySort}
            select={this.props.select}
            title="Роль"
            value="role"
            className="role border_right"
          />

          <ColumnTitle
            applySort={this.props.applySort}
            select={this.props.select}
            title="Статус"
            value="status"
            className="status border_right"
          />

          <TableCell>Действия</TableCell>
        </Row>
      </TableHead>
    );
  }
}

const Row = styled(TableRow)`
  && th {
    font-size: 16px;
    text-align: center;
    padding: 0;
  }

  && .border_right {
    border-right: 1px solid #e0e0e0;
  }
  && .DoB {
    padding: 0 29px;
  }
`;

Head.propTypes = {
  select: PropTypes.string,
  applySort: PropTypes.func.isRequired
};

Head.defaultProps = {
  select: 'ID'
};

export default Head;
