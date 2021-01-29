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
            title="Название"
            value="title"
            className="border_right"
          />

          <TableCell className="border_right">Разработчики</TableCell>
          <TableCell className="border_right">Технологии</TableCell>
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
    min-width: 150px;
    padding: 0 2px;
  }

  && .border_right {
    border-right: 1px solid #e0e0e0;
  }
`;

Head.propTypes = {
  applySort: PropTypes.func.isRequired,
  select: PropTypes.string
};

Head.defaultProps = {
  select: 'id'
};

export default Head;
