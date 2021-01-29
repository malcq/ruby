import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  TableHead,
  TableRow
} from '@material-ui/core';
import ColumnTitle from 'pages/admin/StaffTable/components/ColumnTitle';

class Head extends Component {
  render() {
    const { applySort, select, isStudentTasks } = this.props;
    return (
      <TableHead>
        <TableRow>
          <ColumnTitle
            applySort={applySort}
            select={select}
            title="Заголовок"
            value="title"
          />
          {!isStudentTasks && (
            <>
              <ColumnTitle
                applySort={applySort}
                select={select}
                title="Дата"
                value="createdAt"
              />
              <ColumnTitle
                applySort={applySort}
                select={select}
                title="Автор"
                value="author_id"
              />
            </>
          )}
        </TableRow>
      </TableHead>
    );
  }
}

Head.propTypes = {
  applySort: PropTypes.func.isRequired,
  select: PropTypes.string,
  isStudentTasks: PropTypes.bool
};

Head.defaultProps = {
  select: 'id',
  isStudentTasks: true
};

export default Head;
