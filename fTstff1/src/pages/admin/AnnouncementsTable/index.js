import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { getAllAnnouncements } from 'api/announcementApi';
import { connectGlobalUser } from 'store/connections';

import {
  createMuiTheme,
  MuiThemeProvider,
  Typography,
  CssBaseline
} from '@material-ui/core';
import Pagination from 'material-ui-flat-pagination';
import Filters from 'pages/admin/StudentsTasks/components/TasksTable/Filters';
import FullTable from 'pages/admin/StudentsTasks/components/TasksTable/FullTable';

const theme = createMuiTheme();

class AdsTable extends Component {
  state = {
    announcements: [],
    sort: ['createdAt', 'DESC'],
    filter: {
      title: ''
    },
    perPage: 20,
    page: 1,
    pagesCount: 1
  }

  componentDidMount() {
    this.getAnnouncements();
  }

  getAnnouncements = async () => {
    try {
      const { sort, filter, page, perPage } = this.state;

      const {
        data: { data: announcements, pagesCount }
      } = await getAllAnnouncements({
        sort,
        filter,
        page,
        perPage
      });

      this.setState({ announcements, pagesCount });
    } catch (err) {
      console.log(err);
    }
  };

  applySort = (sort) => {
    this.setState({ sort }, this.getAnnouncements);
  };

  applyFilter = (filter) => {
    this.setState({ filter }, this.getAnnouncements);
  };

  handleClick = (page) => {
    this.setState({ page }, this.getAnnouncements);
  };

  render() {
    const { announcements, perPage, page, pagesCount } = this.state;
    const { user } = this.props;

    return (
      <StyledContainer className="container">
        <Typography variant="h4" className="pageTitle">
          Объявления
        </Typography>
        <Filters
          applyFilter={this.applyFilter}
          getTasks={this.getAnnouncements}
          isStudentTasks={false}
          globalUser={user}
        />
        <FullTable
          tasks={announcements}
          applySort={this.applySort}
          getTasks={this.getAnnouncements}
          isStudentTasks={false}
          globalUser={user}
        />
        {pagesCount > 1 ? (
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <Pagination
              limit={perPage}
              offset={(page - 1) * perPage}
              total={pagesCount * perPage}
              onClick={(e, offset) => this.handleClick(offset / perPage + 1)}
            />
          </MuiThemeProvider>
        ) : null}
      </StyledContainer>
    );
  }
}

const StyledContainer = styled.div`
  padding-top: 30px;
  padding-bottom: 150px;
  max-width: 90%;
  margin: 0 auto;

  .pageTitle {
    padding-bottom: 30px;
    text-align: center;
  }

  .pagination-center {
    text-align: center;
  }
`;

AdsTable.propTypes = {
  user: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array])
  ).isRequired
};

AdsTable.defaultProps = {};

export default connectGlobalUser(AdsTable);
