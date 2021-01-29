import React, { Component } from 'react';
import styled from 'styled-components';

import { getAllUsersRequest } from 'api/userApi';

import {
  Typography,
  Grid,
  Tooltip,
  Button
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import UsersTable from './components/UsersTable';
import Filters from './components/Filters';


class Staff extends Component {
  state = {
    users: [],
    sort: ['lastName', 'ASC'],
    filter: { name: '' }
  }

  componentDidMount() {
    this.getArr();
  }

  getArr = async (sort = this.state.sort, filter = this.state.filter) => {
    const { data: users } = await getAllUsersRequest(sort, filter);
    this.setState({
      users
    });
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
          Список сотрудников
        </Typography>
        <Grid item xs={12}>
          <div className="relative-container ">
            <Filters applyFilter={this.applyFilter} />

            <Link to="/cv_builder">
              <Tooltip title="Создать CV" placement="right" className="open-cv">
                <Button
                  variant="outlined"
                  style={{ marginBottom: '10px', marginLeft: '20px' }}
                >
                  Создать CV
                </Button>
              </Tooltip>
            </Link>
          </div>
          <UsersTable
            users={this.state.users}
            applySort={this.applySort}
            getArr={this.getArr}
          />
        </Grid>
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

  .relative-container {
    position: relative;
  }

  .open-cv {
    position: absolute;
    top: 0;
    left: 70px;
  }
`;

export default Staff;
