import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  TableHead,
  TableRow,
  TableCell
} from '@material-ui/core';
import ColumnTitle from 'pages/admin/StaffTable/components/ColumnTitle';

class Head extends Component {
  render() {
    return (
      <TableHead>
        <Row>
          <ColumnTitle
            applySort={this.props.applySort}
            select={this.props.select}
            value="login"
            title="От"
            className="border_right"
          />

          <ColumnTitle
            applySort={this.props.applySort}
            select={this.props.select}
            value="type"
            title="Тип"
            className="border_right"
          />

          <ColumnTitle
            applySort={this.props.applySort}
            select={this.props.select}
            title="Статус"
            value="status"
            className="border_right"
          />
          <TableCell className="border_right">Дата</TableCell>
          <TableCell className="border_right">Принял решение</TableCell>
          <TableCell>Описание</TableCell>
        </Row>
      </TableHead>
    );
  }
}

const Row = styled(TableRow)`
  && th {
    font-size: 16px;
    text-align: center;
    min-width: 150px;
    padding: 0;
  }

  && .border_right {
    border-right: 1px solid #e0e0e0;
  }
`;

Head.propTypes = {
  select: PropTypes.string,
  applySort: PropTypes.func.isRequired
};

Head.defaultProps = {
  select: 'id'
};

export default Head;
