import React, { Component } from 'react';
import styled from 'styled-components';

import { getAllProjectsArrRequest } from 'api/projectApi';

import { Typography } from '@material-ui/core';
import FullTable from './components/FullTable';
import Filters from './components/Filters';

class ProjectsTable extends Component {
  state = {
    projects: [],
    filter: { title: '' },
    sort: ['id', 'DESC']
  }

  componentDidMount() {
    this.getArr();
  }

  getArr = async (sort = this.state.sort, filter = this.state.filter) => {
    try {
      const { data: projects } = await getAllProjectsArrRequest(sort, filter);
      this.setState({
        projects
      });
    } catch (err) {
      console.log(err);
    }
  };

  applySort = (sort) => {
    this.setState({
      sort
    });
    this.getArr(sort);
  };

  applyFilter = (filter) => {
    this.setState({
      filter
    });
    this.getArr(this.state.sort, filter);
  };

  render() {
    return (
      <StyledContainer className="container">
        <Typography variant="h4" className="pageTitle">
          Список проектов
        </Typography>

        <Filters applyFilter={this.applyFilter} />

        <FullTable
          refreshProjects={this.getArr}
          projects={this.state.projects}
          applySort={this.applySort}
        />
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
`;

export default ProjectsTable;
