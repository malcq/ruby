import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _xor from 'lodash/xor';
import _groupBy from 'lodash/groupBy';
import { createSelector } from 'reselect';
import styled from 'styled-components';

import {
  createDateFromDate,
  getName,
  getPrettyString
} from 'utils';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const HEIGHT = 400;

const CHART_MARGINS = {
  top: 20,
  right: 30,
  left: 20,
  bottom: 5
};

class CustomBarChart extends PureComponent {
  state = {
    width: 990,
    authors: [],
  }

  async componentDidMount() {
    this.initData();
    this.resizeDisplay();
    window.addEventListener('resize', this.resizeDisplay);
  }

  componentDidUpdate(prevProps) {
    if (_xor(prevProps.requests, this.props.requests).length) {
      this.initData();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeDisplay);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.requests !== prevState.requests) {
      return { requests: nextProps.requests };
    }
    return null;
  }

  getPrettiedData = createSelector(
    [(state) => state.requests, (state) => state.needDays],
    (requests, needDays) => {
      const data = [];
      requests.forEach((el) => {
        const {
          dateFrom: dateFromString = '',
          dateTo: dateToString = '',
          users = [],
          dates,
          rest_days_number: restDays,
        } = el;
        const dateFrom = dateFromString ? new Date(dateFromString) : '';
        const dateTo = dateToString ? new Date(dateToString) : '';
        const name = getName(users[0]);
        if (!dateFrom && !dateTo && dates) {
          if (needDays) {
            dates.forEach((date) => {
              data.push({ name, dateFrom: date, dateTo: date, dates, restDays });
            });
          } else {
            data.push({ name, dateFrom: dates[0], dateTo: dates[0], dates, restDays });
          }
        }
        // If Vacation includes in 2 months
        if (dateFrom && dateTo && dateTo.getMonth() !== dateFrom.getMonth()) {
          const newDateEnd = createDateFromDate(dateFrom);
          const newDateStart = createDateFromDate(dateTo, { day: '1' });
          if (needDays) {
            data.push({ name, dateFrom, dateTo: newDateEnd, restDays });
            data.push({ name, dateFrom: newDateStart, dateTo, restDays: 0 });
          } else {
            data.push({ name, dateFrom, dateTo });
          }
        }

        if (dateFrom && dateTo && dateTo.getMonth() === dateFrom.getMonth()) {
          data.push({ name, dateFrom, dateTo, restDays });
        }

        if (!dateFrom && !dates) {
          data.push({ name, dateFrom: dateTo, dateTo, restDays });
        }
      });
      return data;
    }
  );

  initData = () => {
    const { filter } = this.props;
    const { requests = [] } = this.props;
    let needDays = true;
    if (
      !filter ||
      filter === 'technical' ||
      filter === 'common' ||
      filter === 'documents'
    ) {
      needDays = false;
    }
    const dataRaw = this.getPrettiedData({ requests, needDays });
    const data = this.createDataForBar(dataRaw);
    this.setState({ ...data });
  };

  resizeDisplay = () => {
    const { width } = this.state;
    if (window.innerWidth < 990 && width !== 990) {
      this.setState({ width: 490 });
    } else {
      // const update_width = window.innerWidth - 1000;
      const update_width = window.innerWidth * 0.4;
      this.setState({ width: update_width });
    }
  };

  calcData = (author, dataCurrent, dataGeneral) => {
    const { name } = dataCurrent;
    for (let i = 0; i < dataGeneral.length; ++i) {
      const { name: monthName } = dataGeneral[i];
      if (monthName === name) {
        // eslint-disable-next-line
        dataGeneral[i][author] = dataGeneral[i].hasOwnProperty(author)
          ? dataGeneral[i][author] + dataCurrent[author]
          : dataCurrent[author];
        break;
      }
    }
    return dataGeneral;
  };

  // TODO: update function to generator
  createDataForBarForYear = (data) => {
    const { filter } = this.props;
    const authors = new Set();
    let prettiedData = this.createDefaultBarValue();

    for (let i = 0; i < data.length; ++i) {
      const { name: nameAuthor, dateFrom, dateTo, restDays } = data[i];
      let diff;
      if (dateFrom && dateTo) {
        diff = restDays;
      } else if (!dateFrom && dateTo) {
        diff = 1;
      }
      if (!filter || !['medical', 'vacation'].includes(filter)) {
        diff = 1;
      }

      let name = moment(dateFrom).format('MMMM');
      name = getPrettyString(name);
      prettiedData = this.calcData(
        nameAuthor,
        { [nameAuthor]: diff, name },
        prettiedData,
      );
      authors.add(nameAuthor);
    }
    return { prettiedData, authors: [...authors] };
  };

  createDataForBar = (data) => {
    // dateFrom || new Date() We use this structure because dateFrom = '' , by default
    const preparedData = _groupBy(data,
      ({ dateFrom } = {}) => moment(dateFrom || new Date()).format('YYYY'));
    const keys = Object.keys(preparedData).reverse();
    const dataStats = keys.map((year) => (
      {
        ...this.createDataForBarForYear(preparedData[year]),
        year
      }
    ));
    return { dataStats };
  };

  createDefaultBarValue = () => {
    return moment.months().map((el) => ({ name: getPrettyString(el) }));
  };

  getYAxisLabel = () => {
    return this.props.filter
      ? this.props.filter === 'technical' ||
        this.props.filter === 'common' ||
        this.props.filter === 'documents'
        ? 'Заявок'
        : 'Дней'
      : 'Заявок';
  };

  createBar = ({ prettiedData: data, authors, year } = {}) => {
    const { width } = this.state;
    return (
      <div key={year}>
        {year}
        <BarChart
          width={width}
          height={HEIGHT}
          data={data}
          margin={CHART_MARGINS}
        >
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="name"/>
          <YAxis
            label={{
              value: this.getYAxisLabel(),
              angle: -90,
              position: 'insideLeft'
            }}
          />
          <Tooltip/>
          <Legend/>
          {authors.map((el) => (
            <Bar key={el} dataKey={el} stackId="a" fill={getRandomColor()}/>
          ))}
        </BarChart>
      </div>);
  }

  render() {
    const { dataStats } = this.state;
    return <StyledContainer>
      { dataStats && dataStats.map(el => this.createBar(el)) }
    </StyledContainer>;
  }
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

CustomBarChart.propTypes = {
  requests: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  filter: PropTypes.string,
};

CustomBarChart.defaultProps = {
  filter: '',
};

export default CustomBarChart;
