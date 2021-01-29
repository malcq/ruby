import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { getStudyPlanRequest } from 'api/studyPlanApi';
import { getProjectsForUserRequest } from 'api/projectApi';
import {
  getUserRequestsRequest,
  getUserRequestStatisticHolidays,
  getUserRequestStatisticRequest
} from 'api/userRequestApi';

import {
  Tabs,
  Tab
} from '@material-ui/core';
import UserInfo from './UserInfo';
import MyRequests from './MyRequests';
import ProjectsInfo from './ProjectsInfo';
import UserStudyPlan from './UserStudyPlan';
import MyStatistics from './MyStatistics';

class Info extends Component {
  state = {
    requests: [],
    projects: [],
    plan: null,
    interval: null,
    tabValue: 'infoTab',
    statisticsHolidays: {},
    statistics: {}
  }

  async componentDidMount() {
    this.getInfo();
  }

  async componentDidUpdate() {
    if (this.props.changeUser) {
      this.getInfo();
      // eslint-disable-next-line
      this.setState({ tabValue: 'infoTab' });
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  getInfo = async () => {
    const { user, globalUser } = this.props;
    if (globalUser.status !== 'active') {
      return;
    }

    try {
      const { data: projects } = await getProjectsForUserRequest(user.id);
      const { data: requests } = await getUserRequestsRequest(globalUser.id);

      const {
        data: statisticsHolidays
      } = await getUserRequestStatisticHolidays(globalUser.id, {
        status: 'completed'
      });
      const { data: statistics } = await getUserRequestStatisticRequest(
        globalUser.id,
        { status: 'completed' }
      );

      let plan = null;
      if (user.login === globalUser.login && user.role === 'student') {
        plan = await getStudyPlanRequest(user.id);
        plan = plan.data.taskJobs;
      }

      const interval = setInterval(async () => {
        // const { data: res } = await getUserRequestsRequest(globalUser.id);
        // this.setState({
        //   requests: res
        // });
      }, 5000);

      this.setState({
        plan,
        projects,
        requests,
        interval,
        statistics,
        statisticsHolidays
      });
    } catch (err) {
      console.log(err);
    }
  };

  tabClick = (event, tabValue) => {
    this.setState({ tabValue });
  };

  render() {
    const { user, globalUser } = this.props;
    const { tabValue } = this.state;
    return (
      <StyledDiv id="parenWidht">
        <Tabs
          indicatorColor="primary"
          textColor="primary"
          value={tabValue}
          onChange={this.tabClick}
          className="tabs"
        >
          <Tab value="infoTab" label="Дополнительная информация" />
          {user.login === globalUser.login && user.status !== 'registered' && (
            <Tab value="reqsTab" label="Мои заявки" />
          )}

          {!!this.state.projects.length && user.status !== 'registered' && (
            <Tab value="projTab" label="Проекты" />
          )}

          {user.role === 'student' && (
            user.status !== 'registered' && (
              user.login === globalUser.login && (
                <Tab value="studyTab" label="Учебный план" />
              )
            )
          )}

          {(user.status !== 'registered' && user.login === globalUser.login) && (
            <Tab value="statisticsTab" label="Моя статистика" />
          )}
        </Tabs>

        {tabValue === 'infoTab' && (
          <UserInfo
            user={user}
            globalUser={globalUser}
            changeGlobalUser={this.props.changeGlobalUser}
          />
        )}
        {tabValue === 'reqsTab' && (
          <MyRequests requests={this.state.requests} />
        )}

        {tabValue === 'projTab' && (
          <ProjectsInfo projects={this.state.projects} />
        )}

        {tabValue === 'studyTab' && (
          <UserStudyPlan user={user} jobs={this.state.plan} />
        )}

        {tabValue === 'statisticsTab' && (
          <MyStatistics
            statistics={this.state.statistics}
            statisticsHolidays={this.state.statisticsHolidays}
          />
        )}
      </StyledDiv>
    );
  }
}

const StyledDiv = styled.div`
  @media (max-width: 960px) {
    .tabs > div > div > span {
      display: none;
    }
  }
  @media (max-width: 520px) {
    .tabs > div > div > div {
      flex-direction: column;
      align-items: center;
    }
  }
`;

Info.propTypes = {
  user: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array])
  ).isRequired,
  globalUser: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array])
  ).isRequired,
  changeGlobalUser: PropTypes.func.isRequired,
  changeUser: PropTypes.bool
};

Info.defaultProps = {
  changeUser: false
};

export default Info;
