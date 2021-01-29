import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { connectGlobalUser } from 'store/connections';
import { getAllRequestsArrRequest } from 'api/userRequestApi';
import { getAllAnnouncements } from 'api/announcementApi';
import {
  createDataChart,
  formatDataForCalendar
} from 'utils';

import {
  Button,
  Typography
} from '@material-ui/core';
import {
  CustomActiveShapePieChart as CustomPieChart
} from 'ui';
import Filters from './components/Filters';
import FullTable from './components/FullTable';
import RequestsBarChart from './components/RequestsBarChart';
import Calendar from './components/RequestsCalendar/Calendar';

class RequestsTable extends Component {
  constructor(props) {
    super(props);
    const { user } = this.props;
    this.state = {
      requests: [],
      filter: {},
      sort: ['id', 'DESC'],
      select: 'id',
      show: user.role !== 'admin' ? 'calendar' : 'list',
      requestsStat: null,
      announcements: []
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const { user } = this.props;
    if (user.role === 'admin') {
      await this.getAnnouncements();
    }
    await this.getArr();
  };

  changeView = (value) => {
    this.setState({
      show: value
    });
  };

  getAnnouncements = async (sort = this.state.sort) => {
    try {
      const {
        data: { data }
      } = await getAllAnnouncements({ sort });
      const announcements = data.map((elem) => formatDataForCalendar(elem));
      this.setState({ announcements });
    } catch (err) {
      console.log(err);
    }
  };

  getArr = async (sort = this.state.sort, filter = this.state.filter) => {
    try {
      const { data: res } = await getAllRequestsArrRequest(sort, filter);
      const groupStatistics = {};
      const statisticsType = {};
      await res.filter((request) => {
        if (!groupStatistics[request.type]) {
          groupStatistics[request.type] = [];
        }
        if (!statisticsType[request.type]) {
          statisticsType[request.type] = 0;
        }
        groupStatistics[request.type].push(request);
        statisticsType[request.type] += 1;
        return request;
      });
      const requestsStat = {
        allRequests: res.length,
        statisticsType,
        groupStatistics
      };
      const dataChart = await createDataChart(requestsStat);
      this.setState({
        requests: res,
        requestsStat: dataChart
      });
    } catch (err) {
      console.log(err);
    }
  };

  statusChange = () => {
    this.getArr();
  };

  applySort = (sort) => {
    if (sort[0] === this.state.sort[0] && sort[1] === this.state.sort[1]) {
      return;
    }

    this.setState({
      sort,
      select: sort[0]
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
    const {
      requests,
      sort,
      select,
      announcements,
      show,
      requestsStat
    } = this.state;
    const { user } = this.props;
    return (
      <StyledContainer className="container">
        <Filters
          applyFilter={this.applyFilter}
          applySort={this.applySort}
          sort={sort}
          user={user}
          statusChange={this.statusChange}
        />

        {
          user.role === 'admin' &&
          <StyledButtonsBar>
            <Button
              variant="outlined"
              style={style.changeButton}
              onClick={() => this.changeView('calendar')}
            >
              Календарь
            </Button>

            <Button
              variant="outlined"
              style={style.changeButton}
              onClick={() => this.changeView('list')}
            >
              Список
            </Button>

            <Button
              name="stats"
              variant="outlined"
              style={style.changeButton}
              onClick={() => this.changeView('stats')}
            >
              Статистика
            </Button>
          </StyledButtonsBar>
        }
        {show === 'list' && (
          <div>
            <Typography variant="h4" className="pageTitle">
              Список заявок
            </Typography>

            <FullTable
              requests={requests}
              applySort={this.applySort}
              statusChange={this.statusChange}
              select={select}
            />
          </div>
        )}

        {show === 'calendar' && (
          <div>
            <Typography variant="h4" className="pageTitle">
              Календарь заявок
            </Typography>
            <Calendar
              globalUser={user}
              requests={requests}
              statusChange={this.statusChange}
              announcements={announcements}
            />
          </div>
        )}

        {show === 'stats' && (
          <div>
            <Typography variant="h4" className="pageTitle">
              Статистика по заявкам
            </Typography>
            <StyledStatisticDiv>
              <RequestsBarChart
                filter={this.state.filter.type ? this.state.filter.type : null}
                requests={requests}
              />
              <CustomPieChart
                key={user.id}
                data={requestsStat}
                parentWidth={400}
                text={`Всего заявок ${requests.length}`}
                type="all-holidays"
              />
            </StyledStatisticDiv>
          </div>
        )}
      </StyledContainer>
    );
  }
}

const style = {
  title: {
    textAlign: 'center'
  },
  changeButton: {}
};

const StyledContainer = styled.div`
  padding-top: 30px;
  padding-bottom: 150px;
  max-width: 90%;
  margin: 0 auto;
  position: relative;

  .pageTitle {
    padding-bottom: 30px;
    text-align: center;
  }
`;

const StyledStatisticDiv = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  @media (max-width: 900px) {
    flex-wrap: wrap;
  }
`;

const StyledButtonsBar = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 30px;
  right: 0;
  button {
    margin-left: 20px;
  }
  @media (max-width: 800px) {
    position: relative;
    top: 0;
    left: 0;
    margin-bottom: 20px;
    button:first-child {
      margin-left: 0;
    }
  }
`;

RequestsTable.propTypes = {
  user: PropTypes.objectOf(PropTypes.any)
};

RequestsTable.defaultProps = {
  user: {}
};

export default connectGlobalUser(RequestsTable);
