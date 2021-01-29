import React, { Component } from 'react';
import styled from 'styled-components';

import { getAllTasksRequest } from 'api/studyTaskApi';

import { Typography } from '@material-ui/core';
import FullTable from 'pages/admin/StudentsTasks/components/TasksTable/FullTable';
import Filters from 'pages/admin/StudentsTasks/components/TasksTable/Filters';

class StudentTasks extends Component {
  state = {
    tasks: [],
    sort: ['title', 'ASC'],
    filter: { title: '' }
  }

  componentDidMount() {
    this.getTasks();
  }

  getTasks = async (sort = this.state.sort, filter = this.state.filter) => {
    try {
      const { data: tasks } = await getAllTasksRequest(sort, filter);
      this.setState({
        tasks
      });
    } catch (err) {
      console.log(err);
    }
  };

  applySort = (sort) => {
    this.setState({
      sort
    });
    this.getTasks(sort);
  };

  applyFilter = (filter) => {
    this.setState({
      filter
    });
    this.getTasks(undefined, filter);
  };

  render() {
    const { tasks } = this.state;

    return (
      <StyledContainer className="container">
        <Typography variant="h4" className="pageTitle">
          Список заданий для стажировки
        </Typography>
        <Filters applyFilter={this.applyFilter} getTasks={this.getTasks} />
        <FullTable
          tasks={tasks}
          applySort={this.applySort}
          getTasks={this.getTasks}
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

StudentTasks.propTypes = {};

StudentTasks.defaultProps = {};

export default StudentTasks;
