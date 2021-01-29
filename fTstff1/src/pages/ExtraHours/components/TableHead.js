import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import defaultThemeObject from 'ui/styles/theme/material/defaultThemeObject';

import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
} from '@material-ui/core';

const { breakpoints: { values: { md: tabletBreakpoint } } } = defaultThemeObject;
class EnhancedTableHead extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tablet: false, show: false };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    if ((window.innerWidth <= tabletBreakpoint) && (!this.state.tablet)) {
      this.setState({ tablet: true });
    }
    if ((window.innerWidth > tabletBreakpoint) && (this.state.tablet)) {
      this.setState({ tablet: false });
    }
  }

  clickRequestSort = (property) => {
    const { handleRequestSort, order, orderBy } = this.props;
    let newOrder = 'desc';

    if (orderBy === property && order === 'desc') {
      newOrder = 'asc';
    }
    handleRequestSort(property, newOrder);
  }

  handl = () => {
    this.setState({ in: this.state.in ? this.state.in : false });
  }

  render() {
    const { order, orderBy, role } = this.props;
    return (
      <TableHead>
        <StyledTr>
          {this.state.tablet ? (
            <SizeLimitTd
              key={rows[0].id}
              align={rows[0].numeric ? 'right' : 'left'}
              padding={rows[0].disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === rows[0].id ? order : false}
            >
              <TableSortLabel
                active={orderBy === rows[0].id}
                direction={order}
                onClick={() => this.clickRequestSort(rows[0].id)}
              >
                Дата
              </TableSortLabel>
            </SizeLimitTd>
          ) : (
            <>
                {rows.map((row) => {
                  if (row.id === 'author' && role !== 'admin') {
                    return null;
                  }
                  return (
                    <SizeLimitTd
                      key={row.id}
                      align={row.numeric ? 'right' : 'left'}
                      padding={row.disablePadding ? 'none' : 'default'}
                      sortDirection={orderBy === row.id ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === row.id}
                        direction={order}
                        onClick={() => this.clickRequestSort(row.id)}
                        className="column__name"
                      >
                        {row.label}
                      </TableSortLabel>
                    </SizeLimitTd>
                  );
                })}
            </>
          )}
        </StyledTr>
      </TableHead>
    );
  }
}

const rows = [
  { id: 'date', numeric: false, disablePadding: false, label: 'Дата' },
  { id: 'start', numeric: false, disablePadding: false, label: 'Часы' },
  { id: 'author', numeric: false, disablePadding: false, label: 'Автор' },
  {
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: 'Описание'
  }
];

const StyledTr = styled(TableRow)`

`;

const SizeLimitTd = styled(TableCell)`
  max-width: 10px;
  word-wrap: break-word;
  padding-right: 25px;
  position: relative;
  text-align: center;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  line-height: 19px;
  && {
    text-align: left;
    padding: 0 2px;
    padding-left: 23px;
    font-size: 16px;
    background: #e5e5e5;
    border: none;
  }

  a {
    color: black;
  }
  .column__name{
    font-family: Montserrat;
    font-size: 14px;
  }
`;

EnhancedTableHead.propTypes = {
  handleRequestSort: PropTypes.func,
  role: PropTypes.string,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
};

EnhancedTableHead.defaultProps = {
  handleRequestSort: () => null,
  role: 'user'
};

export default EnhancedTableHead;
