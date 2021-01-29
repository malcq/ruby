import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { createSelector } from 'reselect';

import { dateToString, getDateAgoWord } from 'utils';

import {
  Button,
  Collapse,
  Typography
} from '@material-ui/core';
import AccountField from './AccountField';
import EditAccount from './EditAccount';
import Repos from './repos/Repos';

class Info extends Component {
  phoneSelector = createSelector(
    (props) => props.user.phone,
    (phone) => {
      return phoneParser(phone);
    }
  );

  constructor(props) {
    super(props);
    this.state = {
      editInit: false
    };
  }

  editInit = () => {
    const { editInit: editState } = this.state;
    this.setState({
      editInit: !editState
    });
  };

  render() {
    return (
      <>
        <Collapse in={!this.state.editInit}>
          <ul>
            <AccountField title="Логин" value={this.props.user.login} />

            <AccountField title="Имя" value={this.props.user.firstName} />

            <AccountField title="Фамилия" value={this.props.user.lastName} />

            <AccountField title="Email" value={this.props.user.email} />

            <AccountField
              title="slack_name"
              value={this.props.user.slack_name}
            />

            {this.props.user.repo && (
              <StyledListItem>
                <Typography component="span">
                  <b>Репозитории: </b>

                  <Repos repos={this.props.user.repo} />
                </Typography>
              </StyledListItem>
            )}

            {this.props.user.phone && (
              <>
                <StyledListItem>
                  <Typography component="span">
                    <b>Телефон: </b>

                    <a href={`tel:${this.phoneSelector(this.props)}`}>
                      {this.props.user.phone}
                    </a>
                  </Typography>
                </StyledListItem>
              </>
            )}

            {(
              this.props.user.login === this.props.globalUser.login ||
              this.props.globalUser.role === 'admin'
            )
              && (
                <AccountField
                  title="Дата рождения"
                  value={dateToString(this.props.user.DoB)}
                />
              )}

            {this.props.globalUser.role === 'admin' && (
              <AccountField
                title="В компании"
                value={`${timeCounter(
                  this.props.user.createdAt
                )} (c ${dateToString(this.props.user.createdAt)})`}
              />
            )}

            <AccountField title="Информация" value={this.props.user.info} />
          </ul>
        </Collapse>

        {this.props.user.status === 'registered' && (
          <b>
            Ваша заявка на регистрацию рассматривается администрацией.
            Пожалуйста, ожидайте.
          </b>
        )}

        {this.state.editInit
          ? (
            <br />
          )
          : (
            this.props.user.status !== 'registered' &&
            this.props.user.login === this.props.globalUser.login &&
            !this.state.editInit
          )
            ? (
              <Button
                onClick={this.editInit}
                style={{ textTransform: 'none' }}
                variant="outlined"
              >
                Редактировать
              </Button>
            )
            : null}
        <EditAccount
          show={this.state.editInit}
          close={this.editInit}
          user={this.props.globalUser}
          changeGlobalUser={this.props.changeGlobalUser}
        />
      </>
    );
  }
}

const phoneParser = (str) => {
  let number = '';
  for (let i = 0; i < str.length; i++) {
    if (
      (str[i] === '+' && i === 0) ||
      (!isNaN(parseFloat(str[i])) && isFinite(str[i]))
    ) {
      number += str[i];
    }
  }
  return number;
};

const StyledListItem = styled.li`
  margin-bottom: 4px;
`;

const timeCounter = (date) => {
  const nowDay = moment().startOf('day');
  const startDay = moment(date)
    .startOf('day')
    .subtract(1, 'day');
  const difference = moment.duration(nowDay.diff(startDay));
  const years = getDateAgoWord(difference.years(), 'years');
  const months = getDateAgoWord(difference.months(), 'months');
  const days = getDateAgoWord(difference.days(), 'days');

  return `${years} ${months} ${days}`;
};

Info.propTypes = {
  user: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array])
  ).isRequired,
  globalUser: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array])
  ).isRequired,
  changeGlobalUser: PropTypes.func.isRequired
};

export default Info;
