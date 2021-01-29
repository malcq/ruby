import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { getDate } from 'utils';
import { editRequestRequest } from 'api/userRequestApi';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';

import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions,
  Typography,
  Button,
  Tooltip,
  Avatar,
  Divider
} from '@material-ui/core';

class RequestInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  open = () => {
    const { open } = this.state;
    this.setState({
      open: !open
    });
  };

  cancel = async () => {
    try {
      editRequestRequest({
        id: this.props.request.id,
        status: 'denied',
        deniedComment: 'Отменено пользователем'
      });
      this.setState({
        open: false
      });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { request } = this.props;
    request.date = {
      dateFrom: request.dateFrom,
      dateTo: request.dateTo,
      dates: request.dates
    };

    const whoUpdated = request.admin_who_updated_id;
    let whoUpdatedName = null;
    if (whoUpdated) {
      const name = request.admin_who_updated_id.firstName
        ? request.admin_who_updated_id.firstName
        : 'NoName';
      const fullname = request.admin_who_updated_id.lastName
        ? request.admin_who_updated_id.lastName
        : 'NoFullname';

      whoUpdatedName = `${name} ${fullname}`;
    }

    return (
      <StyledExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          style={{ paddingLeft: '0' }}
        >
          <Tooltip title={typeName[request.type]} placement="bottom">
            <Avatar style={styleAvatar.title[request.type]}>
              <i
                className={`type ${typeIcon[request.type]}`}
              // style={style.title[request.type]}
              />
              {/* <Icon
                style={style.title[request.type]}
                className={`type ${typeIcon[request.type]}`}
              /> */}
            </Avatar>
          </Tooltip>
          <StyledPanelHeader>
            <Typography style={{ fontSize: '1.1rem' }}>
              {request.title}
            </Typography>
            <Tooltip title={statusName[request.status]} placement="bottom">
              <i
                className={`status ${statusIcon[request.status]}`}
                style={style.status[request.status]}
              />
              {/* <Icon
                style={style.status[request.status]}
                className={`status ${statusIcon[request.status]}`}
              /> */}
            </Tooltip>
          </StyledPanelHeader>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails>
          <StyledPanel>
            <Typography component="span">
              <b>Когда: </b>
              <pre>{getDate(request.date, 'server', request.type)}</pre>
            </Typography>
            <br />

            {request.comment && (
              <Typography component="span">
                <b>Комментарий: </b>
                <pre>{request.comment}</pre>
              </Typography>
            )}

            {request.deniedComment && (
              <Typography component="span">
                <br />
                <b>"Причина отказа: "</b>
                {request.deniedComment}
              </Typography>
            )}

            {whoUpdatedName && request.comment && (
              <>
                <br />
                <b>
                  Вынес решение:
                  {whoUpdatedName}
                </b>
                <br />
              </>
            )}
          </StyledPanel>
        </ExpansionPanelDetails>
        <Divider />
        <StyledExpansionPanelActions style={style.footer[request.status]}>
          <b>{`Статус: ${statusName[request.status]}`}</b>

          {request.status === 'wait' && (
            <Button className="decline-btn" onClick={this.cancel}>
              Отменить
            </Button>
          )}
        </StyledExpansionPanelActions>
      </StyledExpansionPanel>
    );
  }
}

const StyledExpansionPanel = styled(ExpansionPanel)`
  .type,
  .status {
    font-size: 24px;
  }
`;

const StyledPanel = styled.div`
  && {
    padding: 6px 40px 6px 6px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-wrap: wrap;
    min-height: 42px;
  }

  && i {
    font-size: 25px;
    height: 100%;
    display: block;
    padding: 7px 5px 5px 5px;
    color: white;
    position: absolute;
    top: 0;
  }

  & .type {
    width: 50px;
    left: 0;
    font-size: 24px;
  }

  & span {
    font-weight: bold;
    /* font-size: */
    text-align: left;
    width: 100%;
    white-space: normal;

    pre {
      font-weight: normal;
    }
  }

  & .status {
    width: 40px;
    right: 0;
  }
`;

const StyledExpansionPanelActions = styled(ExpansionPanelActions)`
  && {
    justify-content: space-between;
  }
`;

const StyledPanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-left: 10px;
  align-items: center;

  p {
    word-break: break-all;
    padding-right: 10px;
  }
`;

const styleAvatar = {
  title: {
    technical: {
      background: '#337ab7',
      marginLeft: '7px'
    },
    dayOff: {
      background: '#f0ad4e',
      marginLeft: '7px'
    },
    timeOff: {
      background: '#f0ad4e',
      marginLeft: '7px'
    },
    vacation: {
      background: '#5cb85c',
      marginLeft: '7px'
    },
    medical: {
      background: '#d9534f',
      marginLeft: '7px'
    },
    common: {
      background: '#F5A3F5',
      marginLeft: '7px'
    },
    documents: {
      background: '#33ccad',
      marginLeft: '7px'
    }
  }
};

const style = {
  title: {
    technical: {
      background: '#337ab7'
    },
    dayOff: {
      background: '#f0ad4e',
      marginLeft: '7px'
    },
    timeOff: {
      background: '#f0ad4e',
      marginLeft: '7px'
    },
    vacation: {
      background: '#5cb85c'
    },
    medical: {
      background: '#d9534f'
    },
    common: {
      background: '#F5A3F5'
    },
    documents: {
      background: '#33ccad'
    }
  },
  status: {
    wait: {},
    inProgress: {
      color: '#337ab7'
    },
    accept: {
      color: '#5cb85c'
    },
    completed: {
      color: '#5cb85c'
    },
    denied: {
      color: '#d9534f'
    }
  },
  footer: {
    wait: {
      lineHeight: '30px'
    },
    inProgress: {
      color: 'white',
      background: '#337ab7'
    },
    accept: {
      color: 'white',
      background: '#5cb85c'
    },
    completed: {
      color: 'white',
      background: '#5cb85c'
    },
    denied: {
      color: 'white',
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

const statusIcon = {
  wait: '',
  inProgress: 'far fa-clock',
  accept: 'far fa-check-circle',
  completed: 'far fa-check-circle',
  denied: 'far fa-times-circle'
};

const typeName = {
  technical: 'Технический',
  common: 'Бытовой',
  documents: 'Документы',
  dayOff: 'Отгул',
  timeOff: 'Отгул',
  vacation: 'Отпуск',
  medical: 'Больничный'
};

const statusName = {
  wait: 'Ожидает рассмотрения',
  inProgress: 'Выполняется',
  accept: 'Одобрена',
  completed: 'Выполнена',
  denied: 'Отклонена'
};

RequestInfo.propTypes = {
  request: PropTypes.objectOf(PropTypes.any).isRequired
};

RequestInfo.defaultProps = {};

export default RequestInfo;
