import React from 'react';
import PropTypes from 'prop-types';

import {
  TableRow,
  TableCell
} from '@material-ui/core';

class TableBody extends React.Component {
  render() {
    const { rows } = this.props;

    return (
      <TableBody>
        {rows.map((n) => (
          <TableRow hover tabIndex={-1} key={n.id}>
            <TableCell align="left" scope="row" padding="none">
              {n.date}
            </TableCell>

            <TableCell align="left">{n.title}</TableCell>

            <TableCell align="left">{n.range}</TableCell>

            <TableCell className="descr" align="left">{n.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  }
}

TableBody.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object)
};

TableBody.defaultProps = {
  rows: []
};

export default TableBody;
