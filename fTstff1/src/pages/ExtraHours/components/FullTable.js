import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { UserType } from 'utils/types';

import {
  Table,
  TableBody,
  TablePagination,
  Paper,
} from '@material-ui/core';
import TableHead from './TableHead';
import TableRow from './TableRow';

class EnhancedTable extends React.Component {
  render() {
    const {
      handleModal,
      rows,
      handleRequestSort,
      rowsPerPage,
      page,
      handleChangePage,
      handleChangeRowsPerPage,
      count,
      modalDelete,
      handleDeleteModal,
      globalUser: { role },
      changeObjectParameters,
      order,
      orderBy
    } = this.props;

    return (
      <StyledTable>
        <Paper>
          <Table
            className='container__table'
            aria-labelledby="tableTitle"
            striped="true"
            bordered="false"
          >
            <TableHead
              handleRequestSort={handleRequestSort}
              role={role}
              order={order}
              orderBy={orderBy}
            />

            <TableBody className="container__table-body">
              {rows.map((extra) => (
                <TableRow
                  key={extra.id}
                  handleModal={handleModal}
                  extra={extra}
                  handleDeleteModal={handleDeleteModal}
                  changeObjectParameters={changeObjectParameters}
                  modalDelete={modalDelete}
                />
              ))}
            </TableBody>
          </Table>
        </Paper>

        <TablePagination
          className="extra-pagination"
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          {...optionsForPagination}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </StyledTable>
    );
  }
}

const optionsForPagination = {
  rowsPerPageOptions: [5, 10, 25],
  backIconButtonProps: {
    'aria-label': 'Previous Page'
  },
  nextIconButtonProps: {
    'aria-label': 'Next Page'
  },
  classes: {
    select: 'pagination__select',
    selectRoot: 'pagination__select__root'
  }
};

const StyledTable = styled(Paper)`
  overflow: auto;

  .container__table-body {
    background-color: #e5e5e5;
  }

  .pagination__select__root {
    svg {
      top: 5px;
    }
  }

  .pagination__select {
    padding-top: 8px;
    padding-right: 20px;
    min-height: unset;
  }

  .container__table {
    border-spacing: 0px 5px;
    border-collapse: separate;
    background-color: #e5e5e5;
  }

  &&, && > *, && table {
    background-color: inherit;
  }
`;

EnhancedTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object),
  handleModal: PropTypes.func,
  handleRequestSort: PropTypes.func,
  rowsPerPage: PropTypes.number,
  page: PropTypes.number,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  count: PropTypes.number,
  globalUser: UserType.isRequired,
  modalDelete: PropTypes.bool,
  handleDeleteModal: PropTypes.func,
  changeObjectParameters: PropTypes.func,
  order: PropTypes.string,
  orderBy: PropTypes.string,
};

EnhancedTable.defaultProps = {
  rows: [],
  order: 'date',
  orderBy: 'asc',
  rowsPerPage: 5,
  page: 0,
  count: 0,
  handleRequestSort: () => null,
  handleModal: () => null,
  handleDeleteModal: () => null,
  changeObjectParameters: () => null,
};

export default EnhancedTable;
