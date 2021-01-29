import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import {
  requestStatusColor,
  getDate,
  getName
} from 'utils';

import {
  TableRow,
  TableCell,
  Tooltip,
  Avatar,
  Typography
} from '@material-ui/core';
import RequestDescription from './RequestDescription';

class Body extends Component {
  render() {
    const { requests = [] } = this.props;
    if (!requests.length) {
      return null;
    }

    return (
      <tbody className="usersTable">
        {requests.map((request) => {
          const { admin_who_updated_id: admin } = request;

          const approved_by = admin
            ? admin.firstName && admin.lastName
              ? `${admin.firstName} ${admin.lastName[0]}.`
              : `(${admin.login})`
            : '';

          return (
            <StyledTr key={request.id}>
              <SizeLimitTd>
                <Link to={`/account/${request.users[0].login}`}>
                  {getName(request.users[0])}
                </Link>
              </SizeLimitTd>

              <SizeLimitTd>
                <StyledTableCellFlex>
                  <Tooltip title={typesName[request.type]} placement="bottom">
                    <Avatar style={styleAvatar.title[request.type]}>
                      <i className={`type ${typeIcon[request.type]}`} />
                    </Avatar>
                  </Tooltip>
                  <Typography>{typesName[request.type]}</Typography>
                </StyledTableCellFlex>
                {/* <span>{typesName[request.type]}</span> */}
              </SizeLimitTd>

              <SizeLimitTd style={requestStatusColor[request.status]}>
                {statusName[request.status]}
              </SizeLimitTd>

              <SizeLimitTd
                style={
                  ['technical', 'common', 'documents'].includes(request.type)
                    ? dateActuality(request.dateTo, request.status)
                    : null
                }
              >
                {getDate(request, 'server', request.type)}
              </SizeLimitTd>

              <SizeLimitTd>{approved_by}</SizeLimitTd>

              <SizeLimitTd>
                <RequestDescription
                  request={request}
                  statusChange={this.props.statusChange}
                />
              </SizeLimitTd>
            </StyledTr>
          );
        })}
      </tbody>
    );
  }
}

const StyledTableCellFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  padding-left: 5px;
`;

const StyledTr = styled(TableRow)`
  td:not(:last-of-type):hover {
    background-color: #eee;
  }
  && td {
    text-align: center;
    padding: 0 2px;
  }

  td:nth-of-type(4) {
    min-width: 149px;
  }

  &:nth-of-type(even) {
    background-color: #f8f8f8;
  }
`;

const SizeLimitTd = styled(TableCell)`
  max-width: 10px;
  word-wrap: break-word;
  font-size: 14px;
  flex: 1;
  display: flex;
  &:not(:last-of-type) {
  }
  & p {
    margin-left: 10px;
  }
  a {
    color: black;
  }

  && {
    text-align: center;
    border-right: 1px solid #e0e0e0;
  }
`;

const styleAvatar = {
  title: {
    technical: {
      background: '#337ab7'
    },
    common: {
      background: '#F5A3F5'
    },
    documents: {
      background: '#33ccad'
    },
    dayOff: {
      background: '#f0ad4e'
    },
    timeOff: {
      background: '#f0ad4e'
    },
    vacation: {
      background: '#5cb85c'
    },
    medical: {
      background: '#d9534f'
    }
  }
};

const typeIcon = {
  technical: 'fas fa-cogs',
  common: 'fas fa-home',
  documents: 'far fa-file',
  dayOff: 'fas fa-walking',
  timeOff: 'fas fa-walking',
  vacation: 'fas fa-umbrella-beach',
  medical: 'fas fa-heartbeat'
};

const statusName = {
  wait: 'Ожидает ответа',
  inProgress: 'Выполняется',
  accept: 'Одобрена',
  denied: 'Отклонена',
  completed: 'Выполнена'
};

const typesName = {
  technical: 'Технический',
  common: 'Бытовой',
  documents: 'Документы',
  dayOff: 'Отгул',
  timeOff: 'Отгул',
  vacation: 'Отпуск',
  medical: 'Больничный'
};

const dateActuality = (date, status) => {
  if (status === 'completed') {
    return null;
  }
  const diff = (new Date(date) - new Date()) / (1000 * 60 * 60 * 24);

  if (diff < 0) {
    return {
      background: '#d9534f',
      color: 'white'
    };
  }
  if (diff <= 2) {
    return {
      background: '#f0ad4e',
      color: 'white'
    };
  }
  return null;
};

Body.propTypes = {
  requests: PropTypes.arrayOf(PropTypes.any).isRequired,
  statusChange: PropTypes.func.isRequired
};

export default Body;
