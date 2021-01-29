import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Select from 'react-select';

import {
  getFullName,
  dateToString,
  createDataChart,
  getModalStyle
} from 'utils';
import { getUserRequestStatisticRequest } from 'api/userRequestApi';

import {
  Typography,
  Paper,
  Modal,
  Button,
  Divider
} from '@material-ui/core';
import {
  DateRange,
  CustomActiveShapePieChart as CustomPieChart
} from 'ui';
// import api from "../../api";

class UserStatisticalModal extends Component {
  constructor(props) {
    super(props);
    const dateFrom = new Date();
    dateFrom.setMonth(dateFrom.getMonth() - 1);
    this.state = {
      userRequests: null,
      dates: {
        from: dateFrom,
        to: new Date()
      },
      pickedRange: {
        label: 'За последний месяц',
        value: 'lastMonth'
      },
      dataChart: null
    };
  }

  componentDidMount() {
    this.getStatistic(this.state.dates);
  }

  getStatistic = async (dates) => {
    try {
      const { data: userRequests } = await getUserRequestStatisticRequest(
        this.props.user.id,
        { dates, status: 'completed' }
      );
      const dataChart = await createDataChart(userRequests);
      this.setState({
        userRequests,
        dataChart
      });
    } catch (err) {
      console.log('Error in getStatistic function:\n', err);
    }
  };

  datePick = (dates) => {
    this.setState({
      dates
    });
    this.getStatistic(dates);
  };

  changePickedRange = async (pickedRange) => {
    const dateFrom = new Date();
    let dates;
    switch (pickedRange.value) {
      case 'lastMonth':
        dateFrom.setMonth(dateFrom.getMonth() - 1);
        dates = {
          from: dateFrom,
          to: new Date()
        };
        break;

      case 'lastWeek':
        dateFrom.setDate(dateFrom.getDay() - 7);
        dates = {
          from: dateFrom,
          to: new Date()
        };
        break;

      case 'dateRange':
        dates = null;
        break;

      case 'all':
        dates = {
          from: new Date('1800-01-01'),
          to: new Date()
        };
        break;

      default:
        break;
    }

    this.setState({
      pickedRange,
      dates
    });

    if (dates) {
      this.getStatistic(dates);
    }
  };

  render() {
    const { user, show, onHide, globalUser } = this.props;
    const { userRequests, dates, pickedRange, dataChart } = this.state;
    const { extraHours } = userRequests || {};
    return (
      <StyledModal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={show}
        onClose={onHide}
      >
        <StyledPaper style={getModalStyle()}>
          <Typography variant="h6" id="modal-title" gutterBottom>
            Статистика:
          </Typography>
          <Select
            className="col-12 col-sm-10"
            value={pickedRange}
            options={selectOptions}
            onChange={this.changePickedRange}
            styles={customSelect}
          />
          {pickedRange.value === 'dateRange' && !dates && (
            <DateRange
              userRole={globalUser.role}
              allDates={!!true}
              sendRequest={this.datePick}
            />
          )}
          <br />
          <Typography gutterBottom noWrap>
            <b
              style={{
                display: 'block',
                minWidth: '250px',
                textAlign: 'center'
              }}
            >
              {`Заявки сотрудника ${getFullName(user)} `}
              <br />
              {getString(pickedRange.value, dates)}
            </b>
          </Typography>
          <br />

          <StyledDivider variant="inset" />
          <Typography gutterBottom noWrap>
            <b style={{ display: 'block', padding: '10px 0' }}>Типы заявок: </b>
          </Typography>
          {dataChart && (
            <StyledFlexContainer>
              <div className="pie-chart">
                <CustomPieChart
                  key={user.id}
                  data={dataChart}
                  parentWidth={400}
                  height={270}
                  text={`Всего заявок ${userRequests.allRequests}`}
                  type="all-holidays"
                  x="65%"
                  y="140"
                  cx={130}
                  isModal
                />
              </div>
            </StyledFlexContainer>
          )}
          <StyledDivider variant="inset" />
          <Typography gutterBottom noWrap>
            <b style={{ display: 'block', padding: '10px 0' }}>
              Дни отсутвования:{' '}
            </b>
          </Typography>
          {dataChart && (
            <>
              <Typography gutterBottom noWrap>
                {'Был в отгуле: '}
                {dataChart.length ? dataChart[0].days : '0 дней'}
              </Typography>
              <Typography gutterBottom noWrap>
                {'Был в отпуске: '}
                {dataChart.length ? dataChart[3].days : '0 дней'}
              </Typography>
              <Typography gutterBottom noWrap>
                {'Болел: '}
                {dataChart.length ? dataChart[1].days : '0 дней'}
              </Typography>
              <Typography gutterBottom noWrap>
                {'Переработка: '}
                {extraHours ? ` ${extraHours} ${
                  extraHours === 1
                    ? 'час'
                    : /2|3|4/.test(`${extraHours}`)
                      ? 'часа'
                      : 'часов'} `
                  : '0 часов'}
              </Typography>
            </>
          )}
          <br />
          <Button
            variant="contained"
            color="primary"
            onClick={onHide}
            style={{ display: 'block', marginLeft: 'auto' }}
          >
            Закрыть
          </Button>
        </StyledPaper>
      </StyledModal>
    );
  }
}

const customSelect = {
  control: (base) => ({
    ...base,
    boxShadow: 'none',
    borderColor: 'rgba(0, 0, 0, 0.2)',
    '&:hover': {
      borderColor: '#101010'
    }
  })
};

const StyledFlexContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledModal = styled(Modal)`
  & .selectLabel {
    line-height: 38px;
  }
`;

const StyledDivider = styled(Divider)`
  margin-left: 0 !important;
`;

const StyledPaper = styled(Paper)`
  position: fixed;
  padding: 20px;
  font-size: 16px;
  min-width: 500px;
  max-height: 700px;
  overflow-y: scroll;

  @media (max-width: 405px) {
    min-width: auto;
    width: 98%;
  }
`;

const getString = (type, dates) => {
  let str = '';
  if (dates) {
    if (type === 'all') {
      str = 'за всё время';
    } else {
      str = `с ${dateToString(dates.from)} по ${dateToString(dates.to)}`;
    }
  }
  return str;
};

const selectOptions = [
  {
    label: 'За месяц',
    value: 'lastMonth'
  },
  {
    label: 'За неделю',
    value: 'lastWeek'
  },
  {
    label: 'За выбранный промежуток',
    value: 'dateRange'
  },
  {
    label: 'За всё время',
    value: 'all'
  }
];

UserStatisticalModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  globalUser: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array])
  ).isRequired
};

UserStatisticalModal.defaultProps = {};

export default UserStatisticalModal;
