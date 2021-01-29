import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import styled from 'styled-components';

import { createDataChart } from 'utils';

import {
  CustomActiveShapePieChart as CustomPieChart
} from 'ui';

class MyStatistics extends Component {
  statisticsBlockWidth = document.getElementById('parenWidht').offsetWidth - 12;

  getStatDataHolidays = createSelector(
    (props) => props.statisticsHolidays,
    (statisticsHolidays) => {
      if (
        !statisticsHolidays ||
        !statisticsHolidays.percent ||
        !statisticsHolidays.holidaysStatistic
      ) {
        return [];
      }
      const VACATION_DAYS_QUOTA = 20;
      const difference = VACATION_DAYS_QUOTA - statisticsHolidays.holidaysStatistic;
      return [
        { name: 'Дней в отпуске', value: statisticsHolidays.holidaysStatistic },
        { name: `${difference > 0 ? 'Осталось' : 'Превышено'}`, value: Math.abs(difference) }
      ];
    }
  );

  getStatDataRequests = createSelector(
    (props) => props.statistics,
    (statistics) => {
      return createDataChart(statistics);
    }
  );

  render() {
    const nonRequestsText = (
      <div className="requests_text">Вы еще не создавали заявок</div>
    );
    const { extraHours } = this.props.statistics;
    const dataHolidays = this.getStatDataHolidays(this.props);
    const dataRequests = this.getStatDataRequests(this.props);
    let holidaysText = '';
    if (this.props.statisticsHolidays.holidaysStatistic) {
      holidaysText = `Отдохнул ${this.props.statisticsHolidays.holidaysStatistic} дней`;
    } else {
      holidaysText = 'Пора в отпуск :)';
    }

    const requestsText = `Всего заявок ${this.props.statistics.allRequests}`;

    return (
      <StyledStat id="statistics">
        <CustomPieChart
          data={dataHolidays}
          parentWidth={this.statisticsBlockWidth}
          text={holidaysText}
          title="Отпуска (Считаются рабочие дни)"
          type="holidays"
        />
        {dataRequests.length
          ? (
            <CustomPieChart
              data={dataRequests}
              parentWidth={this.statisticsBlockWidth}
              text={requestsText}
              title="Заявки"
              type="requests"
            />
          )
          : (
            nonRequestsText
          )}
        {extraHours
          ? (
            <span>
              {`Переработал ${extraHours} ${extraHours === 1
                ? 'час'
                : /2|3|4/.test(`${extraHours}`)
                  ? 'часа'
                  : 'часов'}`}
            </span>
          )
          : null}
      </StyledStat>
    );
  }
}

const StyledStat = styled.div`
  text-align: center;
  & > * {
    margin: 40px 0;
  }
  .requests_text {
    text-align: center;
  }
`;

MyStatistics.propTypes = {
  statistics: PropTypes.objectOf(PropTypes.any),
  statisticsHolidays: PropTypes.objectOf(PropTypes.any)
};

MyStatistics.defaultProps = {
  statistics: {},
  statisticsHolidays: {}
};

export default MyStatistics;
